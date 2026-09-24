export function foodMatrixData(foods = []) {
  const matrix = new Map();
  foods.filter(food => food.enriched !== false).forEach(food => {
    const key = (food.flavor || '未标注') + '|' + (food.tag || '未标注');
    matrix.set(key, (matrix.get(key) || 0) + 1);
  });
  return [...matrix.entries()].map(([key, count]) => {
    const parts = key.split('|');
    return { flavor: parts[0], use: parts[1], count };
  });
}

export function foodCardModel(food = {}, herbs = []) {
  const herb = herbs.find(item => item.name === food.name) || null;
  const enriched = food.enriched !== false;
  return {
    name: food.name || '',
    detail: enriched ? `${food.flavor || '未录入'} · ${food.use || '目录收载'}` : '目录收载 · 属性未录入',
    href: herb ? '#/herb?id=' + (herb.id || '') : null,
    image: herb?.image || null,
    herb
  };
}

export function cultureSelection(items = [], expanded = false) {
  return expanded ? items : items.slice(0, 3);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

function renderFood() {
  const foods = window.FOODS || [];
  const herbs = window.HERBS || [];
  const strip = document.getElementById('homeFoodStrip');
  if (strip) strip.innerHTML = foods.slice(0, window.__HERBAL_FOOD_EXPANDED__ ? foods.length : 12).map(food => {
    const model = foodCardModel(food, herbs);
    const stamp = model.herb ? (window.HerbalStamp?.renderStamp?.(model.herb, 'home-food-stamp') || '') : '';
    const visual = model.image
      ? '<div class="home-food-image"><img src="' + escapeHtml(model.image) + '" alt="' + escapeHtml(model.name) + '植物形态，用于科普识别" loading="lazy"></div>'
      : '<div class="home-food-image home-food-directory-mark" aria-hidden="true"><span>录</span></div>';
    const content = visual + stamp + '<strong>' + escapeHtml(model.name) + '</strong><span>' + escapeHtml(model.detail) + '</span>';
    return model.href
      ? '<a class="home-food-card" href="' + escapeHtml(model.href) + '">' + content + '</a>'
      : '<article class="home-food-card directory-only">' + content + '</article>';
  }).join('');
  const matrix = document.getElementById('homeFoodMatrix');
  if (matrix) {
    const cells = foodMatrixData(foods);
    matrix.innerHTML = '<div class="food-matrix-label">性味 × 用法</div>' + cells.map(cell => '<div class="food-matrix-cell" style="--heat:' + Math.min(1, cell.count / 5) + '"><b>' + escapeHtml(cell.flavor) + '</b><span>' + escapeHtml(cell.use) + '</span><em>' + cell.count + '</em></div>').join('');
  }
}

let cultureExpanded = false;
function renderCulture() {
  const grid = document.getElementById('homeCultureGrid');
  if (!grid) return;
  const items = cultureSelection(window.HERITAGE || [], cultureExpanded);
  const images = window.HERITAGE_IMAGES || {};
  grid.innerHTML = items.map(item => '<article class="home-culture-card"><div class="home-culture-image"><img src="' + escapeHtml(images[item.name] || '') + '" alt="' + escapeHtml(item.name) + '" loading="lazy"></div><div class="home-culture-copy"><span>' + escapeHtml(item.type) + '</span><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.note) + '</p></div></article>').join('');
  const button = document.getElementById('homeCultureExpand');
  if (button) button.textContent = cultureExpanded ? '收起精选' : '查看全部';
}

function updateFoodToggle() {
  const button = document.getElementById('homeFoodExpand');
  if (button) button.textContent = window.__HERBAL_FOOD_EXPANDED__ ? '收起目录' : '查看' + (window.FOODS?.length || 0) + '种目录';
}

function scrollHomeAnchor(anchor) {
  if (!anchor) return;
  setTimeout(() => {
    const target = document.getElementById(anchor);
    if (!target) return;
    window.scrollTo({ top: Math.max(0, target.offsetTop - 72), behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, 260);
}

function showClassicDetail(item) {
  const name = item?.querySelector('.cl-name')?.textContent?.trim();
  const classic = (window.CLASSICS || []).find(entry => entry.name === name);
  if (!classic) return;
  let dialog = document.getElementById('classicDetail');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'classicDetail';
    dialog.className = 'classic-detail';
    document.body.append(dialog);
  }
  dialog.innerHTML = '<button type="button" class="classic-detail-close" aria-label="关闭典籍详情">×</button><span>COLLECTION NOTE</span><h2>' + escapeHtml(classic.name) + '</h2><p class="classic-detail-era">' + escapeHtml(classic.era) + ' · ' + escapeHtml(classic.author) + '</p><div class="classic-detail-stats"><b>' + classic.num + '</b><span>收载数量</span></div><p>' + escapeHtml(classic.desc) + '</p>';
  dialog.showModal?.();
  dialog.querySelector('.classic-detail-close')?.addEventListener('click', () => dialog.close());
}

function initHomeModules() {
  renderFood();
  renderCulture();
  updateFoodToggle();
  const initialAnchor = location.hash.replace(/^#\/?/, '').split('?')[0];
  if (initialAnchor === 'home-food' || initialAnchor === 'home-culture') scrollHomeAnchor(initialAnchor);
  document.querySelectorAll('.path-steps a').forEach((link, index) => { link.href = '#/learn?step=' + (index + 1); });
  document.getElementById('homeCultureExpand')?.addEventListener('click', () => { cultureExpanded = !cultureExpanded; renderCulture(); });
  document.getElementById('homeFoodExpand')?.addEventListener('click', () => { window.__HERBAL_FOOD_EXPANDED__ = !window.__HERBAL_FOOD_EXPANDED__; renderFood(); updateFoodToggle(); });
  document.addEventListener('click', event => {
    const item = event.target.closest('.classic-timeline .cl-item');
    if (item) showClassicDetail(item);
  });
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
    if (route === 'home' || route === 'home-food' || route === 'home-culture') {
      renderFood(); renderCulture(); updateFoodToggle();
      if (route !== 'home') scrollHomeAnchor(route);
    }
  });
  window.renderHomeModules = () => { renderFood(); renderCulture(); updateFoodToggle(); };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHomeModules, { once: true });
  else initHomeModules();
}
