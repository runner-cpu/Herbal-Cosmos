function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

function shellHeight() {
  return (document.querySelector('header')?.getBoundingClientRect().height || 0)
    + (document.getElementById('herbContext')?.getBoundingClientRect().height || 0);
}

function initShellLayout() {
  const update = () => {
    const root = document.documentElement;
    const header = document.querySelector('header');
    const headerHeight = header?.getBoundingClientRect().height || 0;
    root.style.setProperty('--header-height', headerHeight + 'px');
    // The mobile navigation is fixed below the real header. Reading the
    // measured height keeps it aligned when a safe-area inset or a font swap
    // changes the shell by a few pixels.
    root.style.setProperty('--nav-open-top', headerHeight + 'px');
    root.style.setProperty('--shell-height', shellHeight() + 'px');
  };
  const observer = new ResizeObserver(update);
  [document.querySelector('header'), document.getElementById('herbContext')].filter(Boolean).forEach(el => observer.observe(el));
  window.addEventListener('resize', update);
  update();

  const header = document.querySelector('header');
  const updateScrolledState = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateScrolledState, { passive: true });
  updateScrolledState();

  // Give keyboard users an immediate destination after opening the compact
  // menu. Escape remains owned by runtime.js and returns focus to the trigger.
  const trigger = document.getElementById('hamburger');
  const navigation = document.getElementById('mainNav');
  trigger?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      if (navigation?.classList.contains('open')) navigation.querySelector('a')?.focus();
    });
  });
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
  const syncApothecaryPlacement = route => {
    const section = document.getElementById('apothecary');
    const dock = document.querySelector('[data-apothecary-dock]');
    if (!section || !dock) return;
    if (route === 'herbs' && section.parentElement !== dock) dock.append(section);
    if (route === 'home' && section.parentElement !== document.querySelector('.page[data-route="home"]')) {
      document.querySelector('.story-path')?.after(section);
    }
  };
  window.HerbalHome = { scrollToAnchor: scrollHomeAnchor, syncApothecaryPlacement };
  syncApothecaryPlacement(location.hash.startsWith('#/herbs') ? 'herbs' : 'home');
  window.addEventListener('herbal:route', event => syncApothecaryPlacement(event.detail?.route));
  let recent=[];
  try{const saved=JSON.parse(localStorage.getItem('herbal_viewed')||'[]');if(Array.isArray(saved))recent=saved;}catch{}
  const renderRecent=()=>{const el=document.getElementById('homeRecent');if(!el)return;const cards=recent.slice(-6).reverse().map(id=>(window.HERBS||[]).find(h=>h.id===id)).filter(Boolean);el.hidden=!cards.length;el.innerHTML='<strong>继续上次探索</strong>'+cards.map(h=>'<a href="#/herb?id='+encodeURIComponent(h.id)+'">'+escapeHtml(h.name)+' ↗</a>').join('');};
  renderRecent();
  window.addEventListener('herbal:selected',event=>{recent=event.detail?.viewedIds||recent;renderRecent();});
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHomeModules, { once: true });
  else initHomeModules();
}
