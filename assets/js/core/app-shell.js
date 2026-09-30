const status = document.getElementById('appStatus');
const statusText = document.getElementById('appStatusText');
const update = document.getElementById('appUpdate');
const refreshButton = document.getElementById('appUpdateRefresh');
const laterButton = document.getElementById('appUpdateLater');
const supported = 'serviceWorker' in navigator && /^https?:$/.test(location.protocol);
let refreshing = false;
let refreshApproved = false;
let restoreTimer = 0;
let warned = false;

function announce(message, mode = 'status', temporary = false) {
  if (!status || !statusText) return;
  window.clearTimeout(restoreTimer);
  status.dataset.mode = mode;
  statusText.textContent = message;
  status.hidden = !message;
  if (temporary && message) restoreTimer = window.setTimeout(() => { status.hidden = true; }, 4200);
}

function offerUpdate(worker) {
  if (!worker || !update || !refreshButton || !laterButton) return;
  update.hidden = false;
  refreshButton.onclick = () => {
    refreshApproved = true;
    refreshButton.disabled = true;
    refreshButton.textContent = '正在更新…';
    worker.postMessage({ type: 'SKIP_WAITING' });
  };
  laterButton.onclick = () => { update.hidden = true; };
}

function watchInstalling(registration) {
  const installing = registration.installing;
  if (!installing) return;
  installing.addEventListener('statechange', () => {
    if (installing.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(installing);
  });
}

async function registerAppShell() {
  if (!supported) return null;
  try {
    const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    if (registration.waiting) offerUpdate(registration.waiting);
    registration.addEventListener('updatefound', () => watchInstalling(registration));
    return registration;
  } catch (error) {
    if (!warned) {
      warned = true;
      console.warn('[herbal-cosmos] Service Worker registration failed; continuing online.', error);
    }
    return null;
  }
}

window.addEventListener('offline', () => {
  announce('当前离线：已访问的页面与数据仍可阅读，未访问图片或目录可能不可用。', 'offline');
});
window.addEventListener('online', () => {
  announce('网络连接已恢复。', 'online', true);
});

if (supported) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshApproved || refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

if (!navigator.onLine) announce('当前离线：已访问的页面与数据仍可阅读，未访问图片或目录可能不可用。', 'offline');

window.HerbalAppShell = Object.freeze({ registerAppShell, announce });
registerAppShell();
