export function viewedIds(previous = [], id) {
  return [...new Set(previous.filter(Boolean).filter(value => value !== id).concat(id || []))];
}

export function contextLinks({ id }) {
  const value = encodeURIComponent(id || '');
  const result = [
    { href: '#/home?focus=star&id=' + value, label: '星图定位' },
    { href: '#/qiwei?herb=' + value, label: '性味归经' },
    { href: '#/formula?herb=' + value, label: '配伍网络' },
    { href: '#/herb?id=' + value, label: '相关方剂' }
  ];
  return result.map(link => link.href.startsWith('#/herb?id=') ? { ...link, href: '#/formula?herb=' + value } : link);
}

function storageIds() {
  try { return JSON.parse(localStorage.getItem('herbal_viewed') || '[]'); } catch { return []; }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

export function setSelectedHerb(herbId, source = 'unknown') {
  const herbs = window.HERBS || [];
  const herb = herbs.find(item => item.id === herbId) || null;
  if (!herb) return null;
  const ids = viewedIds(storageIds(), herb.id);
  try { localStorage.setItem('herbal_viewed', JSON.stringify(ids)); } catch { /* optional */ }
  window.dispatchEvent(new CustomEvent('herbal:selected', { detail: { herb, source, viewedIds: ids } }));
  return herb;
}

function renderContext(detail) {
  const herb = detail?.herb;
  const bar = document.getElementById('herbContext');
  if (!bar || !herb) return;
  const stamp = window.HerbalStamp?.renderStamp?.(herb, 'context-stamp') || '<span class="herb-stamp context-stamp"><span class="herb-stamp-seal">' + escapeHtml(herb.name.slice(0, 2)) + '</span></span>';
  const links = contextLinks({ id: herb.id });
  bar.innerHTML = '<div class="context-inner"><div class="context-identity">' + stamp + '<strong>' + escapeHtml(herb.name) + '</strong><span>' + escapeHtml((herb.meridian || []).join('、')) + '归经</span></div><nav class="context-links" aria-label="药材联动">' + links.map(link => '<a href="' + link.href + '">' + link.label + '</a>').join('') + '</nav><button type="button" class="context-close" aria-label="关闭药材上下文">×</button></div>';
  bar.hidden = false;
  bar.querySelector('.context-close')?.addEventListener('click', () => { bar.hidden = true; });
}

function initContext() {
  window.setSelectedHerb = setSelectedHerb;
  window.addEventListener('herbal:selected', event => renderContext(event.detail));
  const match = location.hash.match(/[?&]id=([^&]+)/);
  if (match) setSelectedHerb(decodeURIComponent(match[1]), 'initial-route');
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initContext, { once: true });
  else initContext();
}
