export function viewedIds(previous = [], id) {
  return [...new Set(previous.filter(Boolean).filter(value => value !== id).concat(id || []))];
}

export function contextLinks({ id }) {
  const value = encodeURIComponent(id || '');
  return [
    { href: '#/home?focus=star&id=' + value, label: '星图定位' },
    { href: '#/herbs?view=attributes&herb=' + value, label: '性味归经' },
    { href: '#/herbs?section=formulas&herb=' + value, label: '配伍网络' },
    { href: '#/herb?id=' + value, label: '知识卡' }
  ];
}

let memoryViewedIds = [];
let dismissedContextRoute = null;
function storageIds() {
  try {
    const stored = localStorage.getItem('herbal_viewed');
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) memoryViewedIds = parsed.filter(value => typeof value === 'string' && value);
    }
  } catch { /* use the current-session copy */ }
  return [...memoryViewedIds];
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

function setSelectedHerb(herbId, source = 'unknown') {
  const herbs = window.HERBS || [];
  const herb = herbs.find(item => item.id === herbId) || null;
  if (!herb) return null;
  const ids = viewedIds(storageIds(), herb.id);
  memoryViewedIds = ids;
  try { localStorage.setItem('herbal_viewed', JSON.stringify(ids)); } catch { /* optional */ }
  window.dispatchEvent(new CustomEvent('herbal:selected', { detail: { herb, source, viewedIds: ids } }));
  return herb;
}

function knowledgeCardId() {
  const [route, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  return route === 'herb' ? new URLSearchParams(query).get('id') : null;
}

function clearContext() {
  const bar = document.getElementById('herbContext');
  if (!bar) return;
  bar.hidden = true;
  bar.replaceChildren();
  delete bar.dataset.herbId;
}

function renderContext(detail) {
  const herb = detail?.herb;
  const bar = document.getElementById('herbContext');
  if (!bar || !herb) return;
  if (knowledgeCardId() !== herb.id || dismissedContextRoute === location.hash) {
    clearContext();
    return;
  }
  const stamp = window.HerbalStamp?.renderStamp?.(herb, 'context-stamp') || '<span class="herb-stamp context-stamp"><span class="herb-stamp-seal">' + escapeHtml(herb.name.slice(0, 2)) + '</span></span>';
  const links = contextLinks({ id: herb.id });
  bar.innerHTML = '<div class="context-inner"><div class="context-identity">' + stamp + '<strong>' + escapeHtml(herb.name) + '</strong><span>' + escapeHtml((herb.meridian || []).join('、')) + '归经</span></div><nav class="context-links" aria-label="药材联动">' + links.map(link => '<a href="' + link.href + '">' + link.label + '</a>').join('') + '</nav><button type="button" class="context-close" aria-label="关闭药材上下文">×</button></div>';
  bar.dataset.herbId = herb.id;
  bar.hidden = false;
  bar.querySelector('.context-close')?.addEventListener('click', () => {
    dismissedContextRoute = location.hash;
    clearContext();
  });
}

function initContext() {
  window.setSelectedHerb = setSelectedHerb;
  window.addEventListener('herbal:selected', event => renderContext(event.detail));
  window.addEventListener('herbal:route', () => {
    if (dismissedContextRoute !== location.hash) dismissedContextRoute = null;
    const bar = document.getElementById('herbContext');
    if (!knowledgeCardId() || bar?.dataset.herbId !== knowledgeCardId()) clearContext();
  });
  const id = knowledgeCardId();
  if (id) setSelectedHerb(id, 'initial-route');
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initContext, { once: true });
  else initContext();
}
