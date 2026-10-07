function foodMatrixData(foods = []) {
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

function foodCardModel(food = {}, herbs = []) {
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

function cultureSelection(items = [], expanded = false) {
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
      ? '<div class="home-food-image"><img src="' + escapeHtml(model.image) + '" alt="' + escapeHtml(model.herb.imageAlt || model.name+'的来源生物参考图') + '" loading="lazy"></div>'
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

const HOME_CHAPTERS = [
  { id: 'home-overview', label: '本草档案', target: 'home-overview' },
  { id: 'home-featured', label: '精选本草', target: 'home-featured' },
  { id: 'home-food', label: '食养同源', target: 'homeFood' },
  { id: 'home-classics', label: '典籍时光', target: 'home-classics' },
  { id: 'home-sources', label: '项目来源', target: 'home-sources' }
];

function homeChapterState(index = 0, total = HOME_CHAPTERS.length) {
  const safeIndex = Math.max(0, Math.min(total - 1, Number(index) || 0));
  return {
    index: safeIndex,
    label: HOME_CHAPTERS[safeIndex]?.label || HOME_CHAPTERS[0].label,
    progress: `${safeIndex + 1} / ${total}`,
    ratio: total > 0 ? Math.round(((safeIndex + 1) / total) * 10000) / 100 : 0
  };
}

function initHomeChapterNav() {
  const nav = document.querySelector('[data-home-chapters]');
  if (!nav || nav.dataset.initialized === 'true') return;
  nav.dataset.initialized = 'true';
  const current = nav.querySelector('[data-home-chapter-current]');
  const progress = nav.querySelector('[data-home-chapter-progress]');
  const meter = nav.querySelector('[data-home-chapter-meter]');
  const links = [...nav.querySelectorAll('[data-home-chapter]')];
  const sections = HOME_CHAPTERS.map(chapter => ({
    ...chapter,
    element: document.getElementById(chapter.target) || document.querySelector(`[data-home-section=\"${chapter.id}\"]`)
  })).filter(chapter => chapter.element);
  let activeIndex = 0;
  let frame = 0;
  let anchorLockUntil = 0;
  let lockedAnchor = '';

  const update = index => {
    const state = homeChapterState(index, HOME_CHAPTERS.length);
    activeIndex = state.index;
    if (current) current.textContent = state.label;
    if (progress) progress.textContent = state.progress;
    if (meter) meter.style.width = `${state.ratio}%`;
    links.forEach(link => {
      const active = link.dataset.homeChapter === HOME_CHAPTERS[state.index]?.id;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const updateFromScroll = () => {
    frame = 0;
    if (document.querySelector('.page.active')?.dataset.route !== 'home') return;
    if (lockedAnchor && performance.now() < anchorLockUntil) return;
    lockedAnchor = '';
    const threshold = window.scrollY + 132;
    let next = 0;
    sections.forEach((section, index) => {
      if (section.element.getBoundingClientRect().top + window.scrollY <= threshold) next = index;
    });
    update(next);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(updateFromScroll);
  };

  if (typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver(entries => {
      if (lockedAnchor && performance.now() < anchorLockUntil) return;
      lockedAnchor = '';
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const candidate = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      const index = sections.findIndex(section => section.element === candidate.target);
      if (index >= 0) update(index);
    }, { rootMargin: '-118px 0px -62% 0px', threshold: [0, .15, .5] });
    sections.forEach(section => observer.observe(section.element));
    nav._chapterObserver = observer;
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('herbal:route', event => {
    if (event.detail?.route === 'home') {
      const requested = event.detail.params?.anchor;
      const index = HOME_CHAPTERS.findIndex(chapter => chapter.id === requested);
      if (index >= 0) {
        lockedAnchor = requested;
        anchorLockUntil = performance.now() + 1400;
        update(index);
        setTimeout(() => { lockedAnchor = ''; updateFromScroll(); }, 1450);
      }
      setTimeout(updateFromScroll, 180);
    }
  });
  update(activeIndex);
  updateFromScroll();
}

function scrollHomeAnchor(anchor) {
  if (!anchor) return;
  setTimeout(() => {
    const target = document.getElementById(anchor);
    if (!target) return;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 84), behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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
  dialog.querySelector('.classic-detail-close')?.focus();
  dialog.querySelector('.classic-detail-close')?.addEventListener('click', () => dialog.close());
}

function initHomeModules() {
  let recent=[];
  try{const saved=JSON.parse(localStorage.getItem('herbal_viewed')||'[]');if(Array.isArray(saved))recent=saved;}catch{}
  const renderRecent=()=>{const el=document.getElementById('homeRecent');if(!el)return;const cards=recent.slice(-6).reverse().map(id=>(window.HERBS||[]).find(h=>h.id===id)).filter(Boolean);el.hidden=!cards.length;el.innerHTML='<strong>继续上次探索</strong>'+cards.map(h=>'<a href="#/herb?id='+encodeURIComponent(h.id)+'">'+escapeHtml(h.name)+' ↗</a>').join('');};
  renderRecent();
  window.addEventListener('herbal:selected',event=>{recent=event.detail?.viewedIds||recent;renderRecent();});
  renderFood();
  renderCulture();
  updateFoodToggle();
  initHomeChapterNav();
  const initialAnchor = location.hash.replace(/^#\/?/, '').split('?')[0];
  if (initialAnchor === 'home-food' || initialAnchor === 'home-culture') scrollHomeAnchor(initialAnchor);
  document.getElementById('homeCultureExpand')?.addEventListener('click', () => { cultureExpanded = !cultureExpanded; renderCulture(); });
  document.getElementById('homeFoodExpand')?.addEventListener('click', () => { window.__HERBAL_FOOD_EXPANDED__ = !window.__HERBAL_FOOD_EXPANDED__; renderFood(); updateFoodToggle(); });
  document.addEventListener('click', event => {
    const item = event.target.closest('.classic-timeline .cl-item');
    if (item) showClassicDetail(item);
  });
  document.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key)) return;
    const item = event.target.closest('.classic-timeline .cl-item');
    if (!item) return;
    event.preventDefault();
    showClassicDetail(item);
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
