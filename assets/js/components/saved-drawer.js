export function serializeFavorites(ids = [], herbs = [], exportedAt = new Date()) {
  const byId = new Map(herbs.map(herb => [herb.id, herb]));
  return {
    schemaVersion: 1,
    exportedAt: exportedAt.toISOString(),
    herbs: ids.map(id => byId.get(id)).filter(Boolean).map(herb => ({ id: herb.id, name: herb.name }))
  };
}

function readIds() {
  try { return JSON.parse(localStorage.getItem('herbal_favs') || '[]'); } catch { return []; }
}
function writeIds(ids) {
  try { localStorage.setItem('herbal_favs', JSON.stringify([...new Set(ids)])); } catch { /* optional */ }
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
let returnHash = '#/home';

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

export function openSavedDrawer() {
  if (!drawer) return;
  if (location.hash && !location.hash.includes('/saved')) returnHash = location.hash;
  drawer.hidden = false;
  drawer.classList.add('is-open');
  drawer.querySelector('[data-saved-close]')?.focus();
  renderDrawer();
}
export function closeSavedDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.hidden = true;
}
export function exportSavedJson() {
  const payload = serializeFavorites(readIds(), window.HERBS || []);
  const text = JSON.stringify(payload, null, 2);
  if (typeof document === 'undefined') return text;
  try {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'herbal-cosmos-favorites.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  } catch {
    window.prompt('请复制收藏 JSON', text);
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
    drawer.setAttribute('role', 'complementary');
    drawer.setAttribute('aria-label', '本机收藏');
    drawer.innerHTML = '<div class="saved-drawer-head"><div><span>LOCAL HERBARIUM</span><h2>本机收藏</h2></div><button type="button" data-saved-close aria-label="关闭收藏">×</button></div><div class="saved-drawer-actions"><button type="button" data-saved-export>导出 JSON</button><span>仅保存在本机</span></div><div data-saved-list></div>';
    document.body.append(drawer);
  }
  document.getElementById('savedDrawerToggle')?.addEventListener('click', openSavedDrawer);
  drawer.addEventListener('click', event => {
    if (event.target.matches('[data-saved-close]')) closeSavedDrawer();
    if (event.target.matches('[data-saved-export]')) exportSavedJson();
    const remove = event.target.closest('[data-drawer-fav]');
    if (remove) {
      const ids = readIds().filter(id => id !== remove.dataset.drawerFav);
      writeIds(ids);
      renderDrawer();
      syncFavoriteCount(ids);
      window.dispatchEvent(new CustomEvent('herbal:favorites', { detail: { ids } }));
    }
  });
  window.openSavedDrawer = openSavedDrawer; window.closeSavedDrawer = closeSavedDrawer; window.exportSavedJson = exportSavedJson;
  window.addEventListener('herbal:favorites', event => {
    renderDrawer();
    syncFavoriteCount(Array.isArray(event.detail?.ids) ? event.detail.ids : readIds());
  });
  window.addEventListener('hashchange', () => {
    if (location.hash.replace(/^#\/?/, '').split('?')[0] === 'saved') {
      openSavedDrawer();
      history.replaceState(null, '', returnHash || '#/home');
      window.render?.();
    }
  });
  syncFavoriteCount();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDrawer, { once: true });
  else initDrawer();
}
