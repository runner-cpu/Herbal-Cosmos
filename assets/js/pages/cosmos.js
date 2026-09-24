const EFFECT_COLORS = {
  '补虚药': '#D0A24C',
  '清热药': '#B84B3E',
  '解表药': '#7C9DB3',
  '活血化瘀药': '#9D86AF',
  '利水渗湿药': '#6B9E8A'
};

export function colorForEffect(category = '') {
  return EFFECT_COLORS[category] || '#D8C9A8';
}

export function motionEnabled({ reducedMotion = false, preference = true } = {}) {
  return !reducedMotion && preference !== false;
}

function priority(star, state = {}) {
  const id = star.herb?.id || star.id;
  if (state.selectedHerb === id) return 1000;
  if (star.hovered || state.hoveredHerb === id) return 900;
  if (star.favorite || state.favoriteHerbs?.has?.(id)) return 800;
  if (star.viewed || state.viewedHerbs?.has?.(id)) return 700;
  if (star.herb?.food) return 600;
  if (state.formulaFrequency?.get?.(id)) return 500 + state.formulaFrequency.get(id);
  return 100;
}

export function selectVisibleLabels(stars = [], viewport = { width: 1280, height: 720 }, scale = 1, state = {}) {
  const limit = scale < 1.25 ? 18 : scale < 1.8 ? 40 : 90;
  const deduped = new Map();
  stars.forEach(star => {
    const id = star.herb?.id || star.id;
    if (!id || !deduped.has(id) || priority(star, state) > priority(deduped.get(id), state)) deduped.set(id, star);
  });
  const candidates = [...deduped.values()].sort((a, b) => priority(b, state) - priority(a, state) || String(a.herb?.name || '').localeCompare(String(b.herb?.name || '')));
  const labels = [];
  const width = Math.max(320, viewport.width || 1280);
  const height = Math.max(240, viewport.height || 720);
  candidates.forEach(star => {
    if (labels.length >= limit) return;
    const x = Number.isFinite(star.screenX) ? star.screenX : Number(star.x || 0) + width / 2;
    const y = Number.isFinite(star.screenY) ? star.screenY : Number(star.y || 0) + height / 2;
    const rect = { left: x - 48, top: y - 12, right: x + 48, bottom: y + 12 };
    if (rect.right < 0 || rect.left > width || rect.bottom < 0 || rect.top > height) return;
    if (labels.some(item => !(rect.right < item.rect.left || rect.left > item.rect.right || rect.bottom < item.rect.top || rect.top > item.rect.bottom))) return;
    labels.push({ ...star, rect });
  });
  return labels;
}

export function focusHerb(herbId, { animate = true } = {}) {
  if (typeof window === 'undefined') return herbId;
  window.dispatchEvent(new CustomEvent('herbal:focus-herb', { detail: { herbId, animate } }));
  return herbId;
}

export function setCosmosColorMode(mode = 'uniform') {
  const value = mode === 'effect' ? 'effect' : 'uniform';
  try { localStorage.setItem('herbal_cosmos_color', value); } catch { /* optional */ }
  if (typeof document !== 'undefined') document.documentElement.dataset.cosmosColor = value;
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:cosmos-color', { detail: { mode: value } }));
  return value;
}

export function setMotionEnabled(enabled) {
  const value = Boolean(enabled);
  try { localStorage.setItem('herbal_motion', value ? 'on' : 'off'); } catch { /* optional */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:motion', { detail: { enabled: value } }));
  return value;
}

function initCosmos() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let preference = true;
  try { preference = localStorage.getItem('herbal_motion') !== 'off'; } catch { /* optional */ }
  window.HerbalCosmos = { selectVisibleLabels, colorForEffect, motionEnabled, focusHerb, setCosmosColorMode, setMotionEnabled, animate: motionEnabled({ reducedMotion: reduced, preference }) };
  const hero = document.querySelector('.hero');
  if (hero && !document.getElementById('cosmosControls')) {
    const controls = document.createElement('div');
    controls.id = 'cosmosControls';
    controls.className = 'cosmos-controls';
    controls.innerHTML = '<button type="button" data-cosmos-color>统一色</button><button type="button" data-cosmos-motion>动效开</button>';
    hero.append(controls);
    controls.querySelector('[data-cosmos-color]')?.addEventListener('click', event => { const mode = document.documentElement.dataset.cosmosColor === 'effect' ? 'uniform' : 'effect'; setCosmosColorMode(mode); event.currentTarget.textContent = mode === 'effect' ? '功效色' : '统一色'; });
    controls.querySelector('[data-cosmos-motion]')?.addEventListener('click', event => { const enabled = !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) && window.HerbalCosmos.animate === false; window.HerbalCosmos.animate = setMotionEnabled(enabled); event.currentTarget.textContent = enabled ? '动效开' : '动效关'; });
  }
  let lastScroll = 0;
  window.addEventListener('scroll', () => { if (window.HerbalCosmos.animate !== false) { lastScroll = Math.min(28, window.scrollY * .04); document.documentElement.style.setProperty('--hero-parallax', lastScroll + 'px'); } }, { passive: true });
  window.dispatchEvent(new CustomEvent('herbal:cosmos-ready'));
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCosmos, { once: true });
  else initCosmos();
}
