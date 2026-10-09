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
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHomeModules, { once: true });
  else initHomeModules();
}
