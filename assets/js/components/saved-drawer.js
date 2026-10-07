export function serializeFavorites(ids = [], herbs = [], exportedAt = new Date()) {
  const byId = new Map(herbs.map(herb => [herb.id, herb]));
  return {
    schemaVersion: 1,
    exportedAt: exportedAt.toISOString(),
    herbs: ids.map(id => byId.get(id)).filter(Boolean).map(herb => ({ id: herb.id, name: herb.name }))
  };
}

let memoryIds = [];
function normalizeIds(ids) {
  return [...new Set((Array.isArray(ids) ? ids : []).filter(id => typeof id === 'string' && id.trim()))];
}
function readIds() {
  try {
    const stored = localStorage.getItem('herbal_favs');
    if (stored !== null) memoryIds = normalizeIds(JSON.parse(stored));
  } catch { /* use the current-session copy */ }
  return [...memoryIds];
}
function writeIds(ids) {
  memoryIds = normalizeIds(ids);
  try { localStorage.setItem('herbal_favs', JSON.stringify(memoryIds)); } catch { /* current-session copy remains available */ }
}
export function favoriteCount(ids = []) {
  return new Set(ids.filter(id => typeof id === 'string' && id.trim())).size;
}
function syncFavoriteCount(ids = readIds()) {
  if (typeof document === 'undefined') return;
  const count = String(favoriteCount(ids));
  document.querySelectorAll('[data-saved-count]').forEach(node => node.replaceChildren(count));
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

let drawer;
let backdrop;
let lastTrigger = null;

function focusableElements() {
  return [...(drawer?.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') || [])]
    .filter(element => !element.hidden && element.getClientRects().length);
}

function setDrawerStatus(message = '') {
  const status = drawer?.querySelector('[data-saved-status]');
  if (status) status.textContent = message;
}

function syncDrawerA11y(open) {
  if (!drawer) return;
  drawer.setAttribute('aria-hidden', String(!open));
  document.querySelectorAll('[data-saved-open]').forEach(trigger => {
    trigger.setAttribute('aria-expanded', String(Boolean(open)));
  });
}

function renderDrawer() {
  if (!drawer) return;
  const herbs = window.HERBS || [];
  const ids = readIds();
  const byId = new Map(herbs.map(herb => [herb.id, herb]));
  const list = drawer.querySelector('[data-saved-list]');
  if (!ids.length) list.innerHTML = '<div class="saved-drawer-empty"><p>还没有收藏药材。</p><a href="#/herbs">去探索本草</a></div>';
  else list.innerHTML = ids.map(id => {
    const herb = byId.get(id);
    if (!herb) return '';
    return '<article class="saved-drawer-item"><a href="#/herb?id=' + encodeURIComponent(herb.id) + '"><strong>' + escapeHtml(herb.name) + '</strong><span>' + escapeHtml(herb.qi) + '·' + escapeHtml(herb.wei) + '·' + escapeHtml((herb.meridian || []).join('、')) + '</span></a><button type="button" data-drawer-fav="' + escapeHtml(herb.id) + '" aria-label="移除' + escapeHtml(herb.name) + '">移除</button></article>';
  }).join('');
}

function openSavedDrawer() {
  if (!drawer) return;
  if (!lastTrigger && document.activeElement?.matches?.('[data-saved-open]')) lastTrigger = document.activeElement;
  drawer.hidden = false;
  backdrop.hidden = false;
  drawer.classList.add('is-open');
  document.body.classList.add('saved-drawer-open');
  syncDrawerA11y(true);
  renderDrawer();
  drawer.querySelector('[data-saved-close]')?.focus();
}
function closeSavedDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.hidden = true;
  backdrop.hidden = true;
  document.body.classList.remove('saved-drawer-open');
  syncDrawerA11y(false);
  const trigger = lastTrigger;
  lastTrigger = null;
  if (trigger?.isConnected) trigger.focus();
}
function exportSavedJson() {
  const payload = serializeFavorites(readIds(), window.HERBS || []);
  const text = JSON.stringify(payload, null, 2);
  if (typeof document === 'undefined') return text;
  try {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'herbal-cosmos-favorites.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setDrawerStatus('已导出 ' + payload.herbs.length + ' 条收藏。');
  } catch {
    window.prompt('请复制收藏 JSON', text);
    setDrawerStatus('已打开复制提示，共 ' + payload.herbs.length + ' 条收藏。');
  }
  return text;
}

function initDrawer() {
  drawer = document.getElementById('savedDrawer');
  if (!drawer) {
    drawer = document.createElement('aside');
    drawer.id = 'savedDrawer';
    drawer.className = 'saved-drawer';
    drawer.hidden = true;
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-labelledby', 'savedDrawerTitle');
    drawer.innerHTML = '<div class="saved-drawer-head"><div><span>LOCAL HERBARIUM</span><h2 id="savedDrawerTitle">本机收藏</h2></div><button type="button" data-saved-close aria-label="关闭收藏">×</button></div><div class="saved-drawer-actions"><button type="button" data-saved-export>导出 JSON</button><span>仅保存在本机</span></div><p class="saved-drawer-status" data-saved-status role="status" aria-live="polite"></p><div data-saved-list></div>';
    document.body.append(drawer);
  }
  backdrop = document.getElementById('savedDrawerBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('button');
    backdrop.id = 'savedDrawerBackdrop';
    backdrop.className = 'saved-drawer-backdrop';
    backdrop.type = 'button';
    backdrop.hidden = true;
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', '关闭本机收藏');
    document.body.insertBefore(backdrop, drawer);
  }
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-saved-open]');
    if (!trigger) return;
    event.preventDefault();
    lastTrigger = trigger;
    openSavedDrawer();
  });
  backdrop.addEventListener('click', closeSavedDrawer);
  drawer.addEventListener('click', event => {
    if (event.target.matches('[data-saved-close]')) closeSavedDrawer();
    if (event.target.matches('[data-saved-export]')) exportSavedJson();
    const remove = event.target.closest('[data-drawer-fav]');
    if (remove) {
      const ids = readIds().filter(id => id !== remove.dataset.drawerFav);
      writeIds(ids);
      renderDrawer();
      syncFavoriteCount(ids);
      setDrawerStatus('已移除收藏。');
      window.dispatchEvent(new CustomEvent('herbal:favorites', { detail: { ids } }));
    }
  });
  document.addEventListener('keydown', event => {
    if (!drawer.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSavedDrawer();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = focusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.openSavedDrawer = openSavedDrawer; window.closeSavedDrawer = closeSavedDrawer; window.exportSavedJson = exportSavedJson;
  window.addEventListener('herbal:favorites', event => {
    if (Array.isArray(event.detail?.ids)) memoryIds = normalizeIds(event.detail.ids);
    renderDrawer();
    syncFavoriteCount(readIds());
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'herbal_favs') return;
    try {
      memoryIds = normalizeIds(event.newValue ? JSON.parse(event.newValue) : []);
    } catch {
      memoryIds = [];
    }
    renderDrawer();
    syncFavoriteCount(memoryIds);
    setDrawerStatus('收藏已从其他标签页同步。');
    window.dispatchEvent(new CustomEvent('herbal:favorites', { detail: { ids: [...memoryIds], source: 'storage' } }));
  });
  const recoverLegacySavedRoute = () => {
    if (location.hash.replace(/^#\/?/, '').split('?')[0] === 'saved') {
      openSavedDrawer();
      history.replaceState(null, '', '#/home');
      window.render?.();
    }
  };
  window.addEventListener('hashchange', recoverLegacySavedRoute);
  syncFavoriteCount();
  syncDrawerA11y(false);
  recoverLegacySavedRoute();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDrawer, { once: true });
  else initDrawer();
}
