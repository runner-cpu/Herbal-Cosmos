function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

const HOME_CHAPTERS = [
  { id: 'home-overview', label: '文化导览', target: 'home-overview' },
  { id: 'home-featured', label: '精选本草', target: 'home-featured' },
  { id: 'home-collection', label: '馆藏账本', target: 'home-collection' },
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
    const threshold = window.scrollY + shellHeight() + nav.getBoundingClientRect().height + 24;
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

function shellHeight() {
  return (document.querySelector('header')?.getBoundingClientRect().height || 0)
    + (document.getElementById('herbContext')?.getBoundingClientRect().height || 0);
}

function initShellLayout() {
  const update = () => {
    const root = document.documentElement;
    root.style.setProperty('--header-height', (document.querySelector('header')?.getBoundingClientRect().height || 0) + 'px');
    root.style.setProperty('--shell-height', shellHeight() + 'px');
  };
  const observer = new ResizeObserver(update);
  [document.querySelector('header'), document.getElementById('herbContext')].filter(Boolean).forEach(el => observer.observe(el));
  window.addEventListener('resize', update);
  update();
}

function scrollHomeAnchor(anchor) {
  if (!anchor) return;
  setTimeout(() => {
    const target = document.getElementById(anchor);
    if (!target) return;
    const rail = document.querySelector('.home-chapter-nav')?.getBoundingClientRect().height || 0;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - shellHeight() - rail - 18), behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, 0);
}

function initHomeModules() {
  initShellLayout();
  window.HerbalHome = { scrollToAnchor: scrollHomeAnchor };
  let recent=[];
  try{const saved=JSON.parse(localStorage.getItem('herbal_viewed')||'[]');if(Array.isArray(saved))recent=saved;}catch{}
  const renderRecent=()=>{const el=document.getElementById('homeRecent');if(!el)return;const cards=recent.slice(-6).reverse().map(id=>(window.HERBS||[]).find(h=>h.id===id)).filter(Boolean);el.hidden=!cards.length;el.innerHTML='<strong>继续上次探索</strong>'+cards.map(h=>'<a href="#/herb?id='+encodeURIComponent(h.id)+'">'+escapeHtml(h.name)+' ↗</a>').join('');};
  renderRecent();
  window.addEventListener('herbal:selected',event=>{recent=event.detail?.viewedIds||recent;renderRecent();});
  initHomeChapterNav();
  window.addEventListener('hashchange', () => {
    const route = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
    if (route === 'home-food' || route === 'home-culture' || route === 'home-classics') scrollHomeAnchor(route);
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHomeModules, { once: true });
  else initHomeModules();
}
