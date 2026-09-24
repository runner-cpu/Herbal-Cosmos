export function foodMatrixData(foods = []) {
  const matrix = new Map();
  foods.forEach(food => {
    const key = (food.flavor || '未标注') + '|' + (food.tag || '未标注');
    matrix.set(key, (matrix.get(key) || 0) + 1);
  });
  return [...matrix.entries()].map(([key, count]) => {
    const parts = key.split('|');
    return { flavor: parts[0], use: parts[1], count };
  });
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
  if (strip) strip.innerHTML = foods.slice(0, 12).map(food => {
    const herb = herbs.find(item => item.name === food.name) || herbs[0] || {};
    const stamp = window.HerbalStamp?.renderStamp?.(herb, 'home-food-stamp') || '';
    return '<a class="home-food-card" href="#/food"><div class="home-food-image"><img src="' + escapeHtml(herb.image || '') + '" alt="' + escapeHtml(food.name) + '" loading="lazy"></div>' + stamp + '<strong>' + escapeHtml(food.name) + '</strong><span>' + escapeHtml(food.flavor) + ' · ' + escapeHtml(food.use) + '</span></a>';
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
  document.querySelectorAll('.path-steps a').forEach((link, index) => { link.href = '#/learn?step=' + (index + 1); });
  document.getElementById('homeCultureExpand')?.addEventListener('click', () => { cultureExpanded = !cultureExpanded; renderCulture(); });
  document.addEventListener('click', event => {
    const item = event.target.closest('.classic-timeline .cl-item');
    if (item) showClassicDetail(item);
  });
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
    if (route === 'home') { renderFood(); renderCulture(); }
  });
  window.renderHomeModules = () => { renderFood(); renderCulture(); };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHomeModules, { once: true });
  else initHomeModules();
}
