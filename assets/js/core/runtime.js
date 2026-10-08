const KNOWLEDGE_HERBS = HERBS.filter(herb => !['formula-material', 'directory-only'].includes(herb.kind));
const store = {
  selectedHerb: null,      // 当前选中药材
  selectedFormula: null,
  compareHerbs: [],
  filters: { qi:'', wei:'', cat:'' },
  _formulaFocus: '',
  _atlasMode: 'featured',
  _featuredPage: 1,
  _coverage: '',
  _catalogPage: 1,
  _catalogSource: '',
  _catalogKw: '',
  _catalogLoading: false,
  _catalogError: '',
  _searchIndex: -1,
  listeners: []
};
const sessionStorageFallback = new Map();
function storageRead(key, fallback=null){
  try{
    const value=localStorage.getItem(key);
    if(value!==null){ sessionStorageFallback.set(key,value); return value; }
  }catch(e){}
  return sessionStorageFallback.has(key)?sessionStorageFallback.get(key):fallback;
}
function storageWrite(key,value){
  const serialized=String(value);
  sessionStorageFallback.set(key,serialized);
  try{ localStorage.setItem(key,serialized); return true; }catch(e){ return false; }
}
function storageRemove(key){
  sessionStorageFallback.delete(key);
  try{ localStorage.removeItem(key); }catch(e){}
}
window.addEventListener('herbal:selected',event=>{
  if(Array.isArray(event.detail?.viewedIds)) storageWrite('herbal_viewed',JSON.stringify(event.detail.viewedIds));
});
function routeTitle(route, params={}){
  if(route==='herb') return (byId(params.id)?.name||'药材知识卡')+' · 本草宇宙';
  if(route==='formula'&&params.view==='zheng') return '术 · 证候药链 · 本草宇宙';
  return ({intro:'序章 · 本草千年 · 本草宇宙',home:'源 · 本草宇宙',heritage:'传 · 薪火相传 · 本草宇宙',learn:'文化传习 · 本草宇宙',herbs:'探索本草 · 本草宇宙',qiwei:'道 · 性味归经 · 本草宇宙',formula:'术 · 配伍成方 · 本草宇宙','not-found':'路径未收录 · 本草宇宙'})[route]||'本草宇宙';
}
function applyLanguage(route='home',params={}){
  document.documentElement.lang='zh-CN';
  document.title=routeTitle(route,params);
  updateThemeControl();
}
function updateThemeControl(){
  const button=document.getElementById('themeToggle'); if(!button) return;
  const current=document.documentElement.dataset.theme || (document.body.classList.contains('night')?'night':'day');
  const next=window.HerbalTheme?.nextTheme ? window.HerbalTheme.nextTheme(current) : (current==='night'?'day':'night');
  const nextLabel=({night:'夜读',ink:'古籍',day:'日间'})[next]||'日间';
  button.setAttribute('aria-label','切换到'+nextLabel+'主题');
  const label=button.querySelector('[data-theme-label]'); if(label) label.textContent=nextLabel;
  const hint=document.getElementById('themeToggleHint');if(hint)hint.textContent='依次切换日间、夜读与古籍主题';
}
function notify(){ store.listeners.forEach(fn=>{ try{fn();}catch(e){} }); }
function displayCount(value){ return Number.isFinite(value) ? value.toLocaleString('zh-CN') : '—'; }
function catalogManifestCount(key){
  const value=window.HERB_CATALOG_MANIFEST?.[key];
  return Number.isFinite(value) ? value : null;
}
function syncDatasetCounts(){
  const values=[
    ['[data-featured-count]',KNOWLEDGE_HERBS.length],
    ['[data-food-count]',FOODS.length],
    ['[data-formula-count]',FORMULAS.length],
    ['[data-zheng-count]',ZHENGS.length],
    ['[data-catalog-count]',catalogManifestCount('approvedCount')],
    ['[data-review-count]',catalogManifestCount('reviewCount')],
    ['[data-directory-only-count]',window.HERBAL_DATA_COVERAGE?.directoryOnlyCount]
  ];
  values.forEach(([selector,value])=>document.querySelectorAll(selector).forEach(el=>{el.textContent=displayCount(value);}));
  const atlas=document.getElementById('catalogAtlasCount');
  if(atlas) atlas.textContent=displayCount(catalogManifestCount('approvedCount'));
  document.querySelectorAll('[data-catalog-revision]').forEach(el=>{el.textContent=window.HERB_CATALOG_MANIFEST?.sourceRevision || '—';});
  document.querySelectorAll('[data-data-version]').forEach(el=>{const v=window.HERBAL_DATA_VERSION;el.textContent=v?'数据 v'+v.version+' · '+v.date:'数据版本加载中';});
  document.querySelectorAll('[data-catalog-ratio]').forEach(el=>{
    const approved=catalogManifestCount('approvedCount');
    el.textContent=Number.isFinite(approved)?Math.round(approved/18817*100)+'%':'—';
  });
}

const chartManager = {
  _instances: new Map(),
  _observers: new Map(),
  describe(el, { label='', summary='' }={}) {
    if(!el) return;
    const panel=el.closest('.chart-panel,.insight-chart-panel,.syndrome-flow,.graph-canvas,.detail-viz,.compare-panel,.home-classics,.food-matrix')||el.parentElement;
    const heading=panel?.querySelector('h2,h3')?.textContent?.trim();
    const method=panel?.querySelector('.cap,.chart-method')?.textContent?.trim();
    const name=[label||heading,method,summary].filter(Boolean).join('。');
    el.setAttribute('role','img');
    el.setAttribute('aria-label',name||'本草数据图表');
    el.querySelectorAll('canvas').forEach(canvas=>{
      canvas.setAttribute('aria-hidden','true');
      canvas.setAttribute('tabindex','-1');
    });
  },
  register(id, instance, el) {
    if(this._instances.get(id)===instance){ this._observers.get(id)?.disconnect(); this._observers.delete(id); instance.clear(); } else this.dispose(id);
    if(!instance) return null;
    instance.on?.('rendered',()=>this.describe(el));
    instance.setOption({animation:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches});
    this.describe(el);
    this._instances.set(id, instance);
    if(el && typeof ResizeObserver !== 'undefined'){
      const ro = new ResizeObserver(()=>{ try{ instance.resize(); }catch(e){} });
      ro.observe(el);
      this._observers.set(id, ro);
    }
    return instance;
  },
  dispose(id) {
    const inst = this._instances.get(id);
    if(inst){ try{ inst.dispose(); }catch(e){} this._instances.delete(id); }
    const ro = this._observers.get(id);
    if(ro){ try{ ro.disconnect(); }catch(e){} this._observers.delete(id); }
  },
  clear() { Array.from(this._instances.keys()).forEach(id=>this.dispose(id)); }
};
window.__HERBAL_DEBUG__ = window.__HERBAL_DEBUG__ || {};
window.HerbalChartManager = chartManager;
window.__HERBAL_DEBUG__.chartCounts = () => chartManager._instances.size;
window.__HERBAL_DEBUG__.observerCounts = () => chartManager._observers.size;

function showEchartsFailure(){
  document.querySelectorAll('.chart-box, #zhengSankey, #formulaGraph').forEach(el=>{
    el.innerHTML = '<div style="padding:26px;text-align:center;color:var(--ink-2);font-size:13.5px;line-height:1.8;">图表组件未能加载（可能网络受限）。<br>页面其余内容不受影响，请检查网络后刷新。</div>';
  });
}
function renderWhenEchartsReady(render){
  if(typeof window.ensureEcharts !== 'function'){ showEchartsFailure(); return; }
  const expectedHash=location.hash;
  window.ensureEcharts().then(()=>{
    if(location.hash!==expectedHash) return;
    try{ render(); }catch(err){ console.error('[herbal-cosmos] chart render after load failed:', err); }
  }).catch(()=>{if(location.hash===expectedHash)showEchartsFailure();});
}
function setSelected(herbId, opts){
  store.selectedHerb = herbId ? HERBS.find(h=>h.id===herbId) || null : null;
  if(store.selectedHerb && typeof window !== 'undefined'){
    if(typeof window.setSelectedHerb === 'function') window.setSelectedHerb(store.selectedHerb.id, opts?.source||'runtime');
    else window.dispatchEvent(new CustomEvent('herbal:selected',{detail:{herb:store.selectedHerb,source:opts?.source||'runtime'}}));
  }
  notify();
}
const favKey = 'herbal_favs';
function getFavs(){ try{ const value=JSON.parse(storageRead(favKey,'[]')); return Array.isArray(value)?value.filter(id=>typeof id==='string'):[]; }catch(e){ return []; } }
function toggleFav(id){
  let f = getFavs();
  if(f.includes(id)) f = f.filter(x=>x!==id); else f.push(id);
  storageWrite(favKey, JSON.stringify(f));
  if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:favorites',{detail:{ids:f}}));
  renderFavButtons(); toast(f.includes(id) ? '已收藏' : '已取消收藏');
}
function isFav(id){ return getFavs().includes(id); }
function toast(msg){
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 1600);
}

const $ = s => document.querySelector(s);
const byId = id => HERBS.find(h=>h.id===id) || null;
const byName = name => HERBS.find(h=>h.name===name) || null;
const formulaById = id => FORMULAS.find(f=>f.id===id) || null;
const zhengById = id => ZHENGS.find(z=>z.id===id) || null;
const herbEfficacyLabel = h => h?.source==='openMateria'?'资料分类':'功效';
const chartPalette = () => ({
  text: getComputedStyle(document.body).getPropertyValue('--ink').trim() || '#17231D',
  muted: getComputedStyle(document.body).getPropertyValue('--ink-2').trim() || '#59675F',
  line: getComputedStyle(document.body).getPropertyValue('--line').trim() || '#D7E1D9',
  qing: getComputedStyle(document.body).getPropertyValue('--qing-2').trim() || '#245B49',
  cha: getComputedStyle(document.body).getPropertyValue('--cha').trim() || '#A96032',
  celadon: getComputedStyle(document.body).getPropertyValue('--celadon').trim() || '#719E87',
  jin: getComputedStyle(document.body).getPropertyValue('--jin').trim() || '#B68A3D',
  cinnabar: getComputedStyle(document.body).getPropertyValue('--cinnabar').trim() || '#B84B3E',
  card: getComputedStyle(document.body).getPropertyValue('--card').trim() || '#FFFFFF'
});
function sourceBadge(h){
  const s = SOURCE_MAP[h.source] || {badge:'outline',label:'公开资料整理'};
  return `<span class="badge ${s.badge}">数据来源：${s.label}</span>` + (h.food ? ` <span class="badge cinnabar">药食同源</span>` : '');
}

function safeSourceUrl(value){ if(typeof value!=='string'||!value.trim())return ''; try { const url=new URL(value,location.href); return /^https?:$/.test(url.protocol)?url.href:''; } catch { return ''; } }
function fact(value){ return value && !['未标注','未录入','暂无'].includes(String(value).trim()) ? value : missingLabel(); }
function hasOpenImageCredit(h){
  const credit=h?.imageCredit;
  return Boolean(
    h?.image
    && /^images\/herbs\/open\/[^/]+\.(?:jpe?g|png|webp)$/i.test(h.image)
    && String(h.imageAlt||'').trim()
    && String(credit?.author||'').trim()
    && /^(?:CC BY(?:-SA)? [1-4]\.0|CC0 1\.0|Public domain)$/.test(String(credit?.license||''))
    && safeSourceUrl(credit?.url)
    && safeSourceUrl(h.imageLicenseUrl)
  );
}
function herbImagePlaceholder(h,cls='',failed=false){
  const name=h?.name||'本草';
  return '<span class="herb-image-empty '+esc(cls)+'" role="img" aria-label="'+esc(name)+'：'+(failed?'照片加载失败':'照片待补充')+'"><b aria-hidden="true">'+esc(name.slice(0,2))+'</b><small aria-hidden="true">'+(failed?'加载失败':'照片待补')+'</small></span>';
}
function herbImage(h, cls=''){
  if(hasOpenImageCredit(h)) return '<img data-herb-image="'+esc(h.id||'')+'" data-herb-name="'+esc(h.name)+'" class="'+esc(cls)+'" src="'+esc(h.image)+'" alt="'+esc(h.imageAlt)+'" loading="lazy" decoding="async">';
  return herbImagePlaceholder(h,cls);
}
function sourceLinks(item){
  return (item?.sourceRefs||[]).map((ref,index)=>{const url=safeSourceUrl(typeof ref==='string'?ref:ref.url);return url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(typeof ref==='object'?(ref.title||'原始资料 '+(index+1)):'原始资料 '+(index+1))+' ↗</a>':'';}).join('');
}
function imageCredit(h){
  if(!hasOpenImageCredit(h)) return h?.image?'图像未通过开放许可校验，当前不展示。':'暂无通过开放许可校验的图像。';
  const credit=h.imageCredit;
  const sourceUrl=safeSourceUrl(credit.url);
  const licenseUrl=safeSourceUrl(h.imageLicenseUrl);
  return esc(credit.author)+' · '+esc(credit.license)+' · <a href="'+esc(sourceUrl)+'" target="_blank" rel="noopener noreferrer">图像来源 ↗</a> · <a href="'+esc(licenseUrl)+'" target="_blank" rel="noopener noreferrer">许可文本 ↗</a>';
}

function stampHtml(h, sizeCls){
  const short = h.name.replace('子','').replace('仁','').slice(0,2);
  return `<span class="stamp ${sizeCls||''}"><span class="a">${esc(short)}</span><span class="b">${esc(fact(h.qi))}·${esc(fact(h.wei))}</span></span>`;
}

const routes = ['intro','home','heritage','learn','herbs','herb','qiwei','formula'];
function parseHash(){
  const raw = location.hash.replace(/^#\/?/, '') || 'intro';
  const separator = raw.indexOf('?');
  const path = separator < 0 ? raw : raw.slice(0, separator);
  const queryStr = separator < 0 ? '' : raw.slice(separator + 1);
  const params = Object.fromEntries(new URLSearchParams(queryStr));
  const legacyAnchors = { food: 'heritage-food', culture: 'heritage-culture', classics: 'heritage-classics', 'home-food':'heritage-food', 'home-culture':'heritage-culture', 'home-classics':'heritage-classics' };
  const legacyRoutes = new Set(['learn','zheng']);
  const legacyDrawers = new Set(['saved']);
  const homeAnchors = new Set(['home-learning','home-sources','home-collection']);
  const known = routes.includes(path) || legacyRoutes.has(path) || Boolean(legacyAnchors[path]) || legacyDrawers.has(path) || homeAnchors.has(path) || path==='classics';
  let route = known ? (routes.includes(path) ? path : 'home') : 'not-found';
  if(path==='zheng'){route='formula';params.view='zheng';}
  if (legacyAnchors[path]) params.anchor = legacyAnchors[path];
  else if (homeAnchors.has(path)) params.anchor = path;
  if(legacyAnchors[path]){route='heritage';params.anchor=legacyAnchors[path];}
  if(route==='home'&&(params.focus==='classics'||legacyAnchors[params.anchor])){route='heritage';params.anchor=legacyAnchors[params.anchor]||'heritage-classics';}
  return { route, params, unknownPath: known ? '' : path };
}
function renderNotFound(path){
  const unknownRoute=document.getElementById('unknownRoute');
  if(unknownRoute) unknownRoute.textContent=path||'未知路径';
}
function setNavigationOpen(open, returnFocus=false){
  const navigation=document.getElementById('mainNav');
  const trigger=document.getElementById('hamburger');
  navigation?.classList.toggle('open',Boolean(open));
  trigger?.setAttribute('aria-expanded',String(Boolean(open)));
  if(!open&&returnFocus) trigger?.focus();
}
function render(options={}){
  const savedScroll=options.preserveScroll?window.scrollY:null;
  chartManager.clear();
  window.HerbalInsights?.dispose?.();
  syncDatasetCounts();
  const { route, params, unknownPath } = parseHash();
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active', p.dataset.route===route));
  document.querySelectorAll('[data-route-link]').forEach(a=>{
    const active=a.dataset.routeLink===route;
    a.classList.toggle('active',active);
    if(active) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  if(!options.preserveSearch&&typeof closeSearch==='function') closeSearch();
  if(savedScroll===null) window.scrollTo(0,0);
  if(route==='herbs'){
    if(params.mode==='catalog') store._atlasMode='catalog';
    if(params.mode==='featured') store._atlasMode='featured';
    if(params.coverage !== undefined){store._coverage=params.coverage;store._atlasMode='featured';store.filters={qi:'',wei:'',cat:''};store._kw='';}
    if(params.cat !== undefined){store._coverage='';store._atlasMode='featured';store.filters={qi:'',wei:'',cat:params.cat};store._kw='';}
    if(params.q!=null){ store._catalogKw=params.q; store._catalogPage=1; }
  }
  const views = { intro:()=>window.HerbalCulture?.renderIntro(), heritage:()=>window.HerbalCulture?.renderHeritage(), home:renderHome, learn:renderLearn, herbs:renderHerbs, herb:()=>renderHerb(params.id), qiwei:renderQiwei,
    formula:renderFormula, 'not-found':()=>renderNotFound(unknownPath) };
  const invokeView=()=>{ try{ (views[route]||views.home)(); }catch(err){ console.error('[herbal-cosmos] render error:', err); } };
  invokeView();
  applyLanguage(route,params);
  window.dispatchEvent(new CustomEvent('herbal:route',{detail:{route,params,unknownPath}}));
  if(route==='learn')window.HerbalCulture?.renderJourney?.('learnJourney');
  if(savedScroll!==null){requestAnimationFrame(()=>window.scrollTo({top:savedScroll,behavior:'instant'}));return;}
  if(route==='home' && params.focus==='star' && params.id){ setSelected(params.id,{source:'context-bar'}); setTimeout(()=>window.HerbalCosmos?.focusHerb?.(params.id,{animate:true}),80); }
  if(['intro','heritage'].includes(route)&&params.anchor)setTimeout(()=>{const target=document.getElementById(params.anchor);if(target)window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--shell-height'))||64)-20),behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},120);
  if(route==='learn' && params.anchor) setTimeout(()=>{
    const target = document.getElementById(params.anchor);
    if (!target) return;
    target.scrollIntoView({behavior:'smooth',block:'start'});
  },120);
  if(route==='home' && params.anchor) setTimeout(()=>{
    const target = document.getElementById(params.anchor);
    if (!target) return;
    window.HerbalHome?.scrollToAnchor(params.anchor);
  },120);
}
  window.render = render;
  window.addEventListener('herbal:catalog-manifest', event => {
    if(event.detail) window.HERB_CATALOG_MANIFEST=event.detail;
    syncDatasetCounts();
    const visible=document.getElementById('catalogVisibleCount');
    if(visible && (store._catalogKw||store._catalogSource)) visible.textContent=displayCount(HERB_CATALOG.length);
    if(parseHash().route==='home' || parseHash().route==='herbs') render({preserveScroll:true,preserveSearch:true});
  });
  window.addEventListener('hashchange',()=>{
    setNavigationOpen(false);
    render();
  });
  window.addEventListener('herbal:theme',()=>render({preserveScroll:true}));
  window.addEventListener('pagehide',()=>chartManager.clear());

(function initNebula(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W=0, H=0, DPR=1;
  let stars = [], dust = [];
  let rotY = 0, targetRotY = 0, scale = 1, targetScale = 1;
  let dragging = false, lastX = 0, lastY = 0;
  let hoverId = null;
  let running = true;
  let motion = !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) && storageRead('herbal_motion','on')!=='off';
  let colorMode = document.documentElement.dataset.cosmosColor || storageRead('herbal_cosmos_color','effect');
  let focusedId = null, panY=0, targetPanY=0, moved=0, animationFrame=0;
  const activePointers=new Map(); let pinchDistance=0;
  canvas.setAttribute('tabindex','0'); canvas.setAttribute('aria-label','本草星图：拖动旋转，双击聚焦；也可使用星图搜索与缩放按钮。');

  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W*DPR; canvas.height = H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function buildStars(){
    stars = KNOWLEDGE_HERBS.map((h,i)=>{
      // 球面分布 + 星等
      const phi = Math.acos(1 - 2*(i+0.5)/KNOWLEDGE_HERBS.length);
      const theta = i * Math.PI * (3 - Math.sqrt(5)); // 黄金角
      const r = 210;
      return {
        id:h.id, name:h.name, herb:h,
        x:r*Math.sin(phi)*Math.cos(theta), y:r*Math.cos(phi), z:r*Math.sin(phi)*Math.sin(theta),
        size: isFav(h.id) ? 6.2 : 4.6, color: colorMode==='effect' ? (window.HerbalCosmos?.colorForEffect?.(h.cat)||'#D8C9A8') : '#D8C9A8'
      };
    });
    // 背景星尘（全量资源分布的氛围示意）
    dust = [];
    const N = 1500;
    for(let i=0;i<N;i++){
      const r = 260 + Math.random()*240;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      dust.push({
        x:r*Math.sin(phi)*Math.cos(theta), y:r*Math.cos(phi)*Math.sin(theta)*0.7, z:r*Math.sin(phi)*Math.sin(theta),
        s: Math.random()*1.4+0.3,
        a: Math.random()*0.5+0.08,
        tw: Math.random()*Math.PI*2
      });
    }
  }

  function project(x,y,z){
    // 绕 Y 轴旋转
    const c = Math.cos(rotY), s = Math.sin(rotY);
    const xr = x*c + z*s, zr = -x*s + z*c;
    const fov = 640;
    const persp = fov / (fov + zr);
    return { sx: W/2 + xr*scale*persp, sy: H/2 + y*scale*persp + panY, persp, zr };
  }

  function frame(){
    if(!running) return;
    ctx.clearRect(0,0,W,H);
    if(motion) rotY += (targetRotY - rotY)*0.06;
    else rotY = targetRotY;
    scale += (targetScale - scale)*(motion?.08:1);
    panY += (targetPanY-panY)*(motion?.08:1);
    if(motion&&!dragging&&!focusedId)targetRotY+=.0005;

    // 星尘
    for(const d of dust){
      const p = project(d.x, d.y, d.z);
      if(p.zr > 300) continue;
      const tw = motion ? 0.6 + 0.4*Math.sin(d.tw + performance.now()*0.001) : 0.8;
      ctx.globalAlpha = d.a*tw*Math.min(1, p.persp);
      ctx.fillStyle = '#BFD4DC';
      ctx.beginPath(); ctx.arc(p.sx, p.sy, d.s*p.persp, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 精品星
    const viewed = new Set((()=>{ try{const value=JSON.parse(storageRead('herbal_viewed','[]'));return Array.isArray(value)?value:[];}catch(e){return [];} })());
    const favorites=new Set(getFavs());
    stars.forEach(st=>{ const projected=project(st.x,st.y,st.z); st.screenX=projected.sx; st.screenY=projected.sy; st.viewed=viewed.has(st.id); st.favorite=favorites.has(st.id); });
    const visibleLabels = new Set((window.HerbalCosmos?.selectVisibleLabels?.(stars,{width:W,height:H},scale,{selectedHerb:store.selectedHerb?.id||null,viewedHerbs:viewed})||[]).map(item=>item.id));
    for(const st of stars){
      const p = project(st.x, st.y, st.z);
      if(p.zr > 300) continue;
      const sz = st.size * p.persp * scale;
      const alpha = Math.min(1, p.persp);
      // 光晕
      const g = ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,sz*3.4);
      g.addColorStop(0, st.color+'55'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.sx,p.sy,sz*3.4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = st.color; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(1.4,sz),0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      // 名称：默认只标注药食同源与亮星；放大星云时显示全部药名
      const showLabel = visibleLabels.size ? visibleLabels.has(st.id) || hoverId===st.id || focusedId===st.id : ((hoverId===st.id) || (scale >= 1.8 && sz > 2.0) || (st.herb && st.herb.food && scale > 1.25));
      if(showLabel){
        ctx.fillStyle = hoverId===st.id ? '#F3D9A0' : 'rgba(232,224,207,.82)';
        ctx.font = hoverId===st.id ? '600 12px "Noto Sans SC",sans-serif' : '400 11px "Noto Sans SC",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.name, p.sx, p.sy - sz*3.6);
      }
      if(st.viewed || focusedId===st.id){ ctx.strokeStyle='#F0CA77'; ctx.lineWidth=1.2; ctx.globalAlpha=.85; ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(5,sz*1.9),0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }
    }
    animationFrame=requestAnimationFrame(frame);
  }

  function hitTest(mx,my){
    let best=null, bd=1e9;
    for(const st of stars){
      const p = project(st.x, st.y, st.z);
      if(p.zr>300) continue;
      const sz = Math.max(10, st.size*p.persp*scale*3.4);
      const d = Math.hypot(mx-p.sx, my-p.sy);
      if(d<sz && d<bd){ bd=d; best=st; }
    }
    return best;
  }

  function focusStar(id, animate=true){
    const star=stars.find(item=>item.id===id); if(!star)return;
    focusedId=star.id;targetRotY=Math.atan2(star.x,-star.z);targetScale=Math.max(targetScale,1.35);
    const depth=-Math.hypot(star.x,star.z); targetPanY=-star.y*targetScale*640/(640+depth);
    if(!animate||!motion){rotY=targetRotY;scale=targetScale;panY=targetPanY;}
    setSelected(star.id,{source:'cosmos-focus'});
    window.dispatchEvent(new CustomEvent('herbal:cosmos-selection',{detail:{herb:star.herb}}));
  }
  canvas.addEventListener('pointerdown',e=>{activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragging=true;moved=0;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);if(activePointers.size===2){const [a,b]=[...activePointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);}});
  canvas.addEventListener('pointermove',e=>{
    if(activePointers.has(e.pointerId))activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(activePointers.size===2){const [a,b]=[...activePointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance)targetScale=Math.max(.5,Math.min(2.4,targetScale*distance/pinchDistance));pinchDistance=distance;moved=20;return;}
    if(dragging){const delta=Math.hypot(e.clientX-lastX,e.clientY-lastY);moved+=delta;targetRotY+=(e.clientX-lastX)*.006;lastX=e.clientX;lastY=e.clientY;if(moved>5){focusedId=null;targetPanY=0;}}
    else{const rect=canvas.getBoundingClientRect(),hit=hitTest(e.clientX-rect.left,e.clientY-rect.top);hoverId=hit?.id||null;canvas.style.cursor=hit?'pointer':'grab';}
  });
  const release=e=>{activePointers.delete(e.pointerId);dragging=activePointers.size>0;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(activePointers.size===1){const [point]=activePointers.values();lastX=point.x;lastY=point.y;}};
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('click',e=>{if(moved>5)return;const rect=canvas.getBoundingClientRect(),hit=hitTest(e.clientX-rect.left,e.clientY-rect.top);if(hit){setSelected(hit.id,{source:'cosmos'});window.dispatchEvent(new CustomEvent('herbal:cosmos-selection',{detail:{herb:hit.herb}}));}});
  canvas.addEventListener('dblclick',e=>{const rect=canvas.getBoundingClientRect(),hit=hitTest(e.clientX-rect.left,e.clientY-rect.top);if(hit)focusStar(hit.id);});
  canvas.addEventListener('wheel',e=>{const next=Math.max(.5,Math.min(2.4,targetScale-e.deltaY*.001));if(next!==targetScale){e.preventDefault();targetScale=next;}},{passive:false});
  canvas.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){targetScale=Math.min(2.4,targetScale+.2);e.preventDefault();}if(e.key==='-'){targetScale=Math.max(.5,targetScale-.2);e.preventDefault();}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){targetRotY+=(e.key==='ArrowLeft'?-.2:.2);focusedId=null;targetPanY=0;e.preventDefault();}if(e.key==='Enter'&&store.selectedHerb)location.hash='#/herb?id='+store.selectedHerb.id;});
  window.addEventListener('herbal:focus-herb',event=>focusStar(event.detail?.herbId,event.detail?.animate!==false));
  window.addEventListener('herbal:cosmos-zoom',event=>{targetScale=Math.max(.5,Math.min(2.4,targetScale+Number(event.detail?.delta||0)));});
  const updateRunning=()=>{const next=!document.hidden&&document.querySelector('.page.active')?.dataset.route==='home';if(next&&!running){running=true;animationFrame=requestAnimationFrame(frame);}else if(!next){running=false;cancelAnimationFrame(animationFrame);}};
  window.addEventListener('herbal:route',updateRunning);document.addEventListener('visibilitychange',updateRunning);
  window.addEventListener('herbal:motion', event=>{ motion=Boolean(event.detail?.enabled); if(!motion) targetRotY=rotY; });
  window.addEventListener('herbal:cosmos-color', event=>{ colorMode=event.detail?.mode==='effect'?'effect':'uniform'; buildStars(); });

  const ro = new ResizeObserver(()=>{ resize(); });
  ro.observe(canvas);
  resize(); buildStars(); frame();
})();

function renderHomeMuseum(){
  const countBy = key => Object.entries(KNOWLEDGE_HERBS.reduce((acc,item)=>{acc[item[key]]=(acc[item[key]]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]);
  const kpis=[
    [KNOWLEDGE_HERBS.length.toLocaleString('zh-CN'),'本草知识卡','四气 · 五味 · 归经 · 功效','浏览知识卡','#/herbs?mode=featured'],
    [displayCount(catalogManifestCount('approvedCount')),'名称索引','名称与行级资料来源','检索名称目录','#/herbs?mode=catalog'],
    [FORMULAS.length.toLocaleString('zh-CN'),'代表方剂','配伍与证候链路','进入关系网络','#/formula'],
    [displayCount(window.HERBAL_DATA_COVERAGE?.imageBacked),'开放许可图片','来源生物参考图','浏览有图本草','#/herbs?mode=featured&coverage=images']
  ];
  const kpiEl=$('#homeKpis');
  if(kpiEl) kpiEl.innerHTML=kpis.map(item=>`<a class="home-kpi" href="${esc(item[4])}"><div><strong>${esc(item[0])}</strong><span>${esc(item[1])}</span></div><em>${esc(item[2])}<br>${esc(item[3])} ↗</em></a>`).join('');
  const palette=['#D0A24C','#8FC1A8','#B84B3E','#7C9DB3','#C48B62','#9D86AF','#6B9E8A','#D49A5B'];
  const categories=countBy('cat').slice(0,8);
  const catEl=$('#homeCategories');
  if(catEl) catEl.innerHTML=categories.map(([name,count],i)=>`<button type="button" class="home-category" data-home-category="${esc(name)}" title="${count} / ${KNOWLEDGE_HERBS.length} 张知识卡；按资料分类计数" style="--cat-color:${palette[i%palette.length]}"><b>${esc(name.replace(/药$/,''))}</b><span>${count} 味知识卡 · 查看 →</span></button>`).join('');
  catEl?.querySelectorAll('[data-home-category]').forEach(btn=>btn.addEventListener('click',()=>{store.filters={qi:'',wei:'',cat:btn.dataset.homeCategory};store._kw='';location.hash='#/herbs';}));
  const directoryCount=window.HERBAL_DATA_COVERAGE?.directoryOnlyCount||0;
  const boundary=document.querySelector('[data-directory-only-note]');
  if(boundary){
    boundary.hidden=directoryCount<1;
    boundary.textContent=directoryCount>0
      ? '当前官方食药物质目录中，有 '+directoryCount+' 条仅确认目录身份，性味、归经与功效仍待逐条补录；它们不会计入精品知识卡或属性图表。'
      : '';
  }
}
function renderHome(){
  const picks = ['gouqi','renshen','danggui','fuling','jinyinhua','suanzaoren'];
  const featured = picks.slice(0,6).map(byId).filter(Boolean);
  $('#homeFeatured').innerHTML = featured.map(h=>`
    <a class="card card-pad featured-herb" href="#/herb?id=${esc(h.id)}">
      <div class="image-frame">${herbImage(h,"")}</div>
      <div><div class="n">${esc(h.name)}</div><div class="d">${esc(fact(h.qi))} · ${esc(fact(h.wei))} · 归${esc(h.meridian.length?h.meridian.join('、'):missingLabel())}${h.meridian.length?'经':''}</div></div>
    </a>`).join('');
  syncDatasetCounts();
  renderHomeMuseum();
}

function renderHerbs(){
  const mode = store._atlasMode || 'featured';
  document.querySelectorAll('[data-atlas-mode]').forEach(tab=>{
    const active = tab.dataset.atlasMode===mode;
    tab.classList.toggle('on', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  const featuredPanel = $('#featuredAtlasPanel');
  const catalogPanel = $('#catalogAtlasPanel');
  if(featuredPanel) featuredPanel.hidden = mode!=='featured';
  if(catalogPanel) catalogPanel.hidden = mode!=='catalog';
  syncDatasetCounts();
  if(mode==='catalog'){ renderCatalog(); return; }
  const f = store.filters;
  const qis = [...new Set(KNOWLEDGE_HERBS.map(h=>h.qi).filter(v=>v&&v!=='未录入'))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const weiValues = [...new Set(KNOWLEDGE_HERBS.flatMap(h=>weiTokens(h.wei)))];
  const compositeValues = [...new Set(KNOWLEDGE_HERBS.map(h=>String(h.wei||'').trim()).filter(v=>isCompositeWei(v)))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const cats = [...new Set(KNOWLEDGE_HERBS.map(h=>h.cat).filter(v=>v&&v!=='未分类'&&v!=='未录入'))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const renderSelect=(id, label, values, current, composite=[])=>{
    const el=$('#'+id); if(!el)return;
    const options=['<option value="">全部'+label+'</option>',...values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>` )];
    if(composite.length) options.push(`<optgroup label="复合五味（${composite.length} 种）">${composite.map(v=>`<option value="${esc(v)}">${esc(v)} · 复合</option>`).join('')}</optgroup>`);
    el.innerHTML=options.join(''); el.value=current||'';
  };
  renderSelect('qiFilter','四气',qis,f.qi);
  renderSelect('weiFilter','五味',weiValues.filter(v=>CANONICAL_WEIS.includes(v)),f.wei,compositeValues);
  renderSelect('catFilter','资料分类',cats,f.cat);

  const kw = (store._kw||'').toLowerCase();
  let list = KNOWLEDGE_HERBS.filter(h=>{
    if(f.qi && h.qi!==f.qi) return false;
    if(f.wei && (CANONICAL_WEIS.includes(f.wei) ? !weiTokens(h.wei).includes(f.wei) : String(h.wei||'')!==f.wei)) return false;
    if(f.cat && h.cat!==f.cat) return false;
    if(kw && !(h.name.toLowerCase().includes(kw)||h.pinyin.includes(kw)||h.eff.includes(kw)||(h.aliases||[]).some(alias=>alias.toLowerCase().includes(kw)))) return false;
    if(store._coverage==='images' && !h.image) return false;
    if(store._coverage==='missing-image' && h.image) return false;
    if(store._coverage==='complete' && h.factStatus!=='complete') return false;
    if(store._coverage==='partial' && h.factStatus!=='partial') return false;
    if(store._coverage==='origin' && !h.origin?.length) return false;
    if(store._coverage==='sources' && ![h.sourceRefs,h.distributionSourceRefs].some(refs=>refs?.some(ref=>/^https?:\/\//.test(ref)))) return false;
    return true;
  });
  const signature=JSON.stringify([f,kw,store._coverage]);
  if(signature!==store._featuredSignature){store._featuredPage=1;store._featuredSignature=signature;}
  const pageCount=Math.max(1,Math.ceil(list.length/48));
  store._featuredPage=Math.min(pageCount,Math.max(1,store._featuredPage));
  const visibleRows=list.slice((store._featuredPage-1)*48,store._featuredPage*48);
  const coverageSelect=$('#coverageFilter');if(coverageSelect)coverageSelect.value=store._coverage||'';
  const count = $('#herbResultCount');
  if(count) count.textContent = `${list.length} 味药材${kw ? ` · 搜索“${kw}”` : ''}`;
  const summary=$('#herbFilterSummary');
  if(summary){ const active=[f.qi&&`四气 ${f.qi}`,f.wei&&(CANONICAL_WEIS.includes(f.wei)?`五味 ${f.wei}`:`复合 ${f.wei}`),f.cat&&`分类 ${f.cat}`,store._coverage&&`覆盖 ${coverageLabel(store._coverage)}`].filter(Boolean); summary.textContent=active.length?`当前筛选：${active.join(' · ')}`:'按字段筛选精品知识卡'; }
  $('#herbTableBody').innerHTML = visibleRows.map(h=>`
    <tr>
      <td class="rowname"><a class="herb-row-link" href="#/herb?id=${esc(h.id)}">${herbImage(h,"herb-thumb")}<span>${esc(h.name)}</span></a></td>
      <td>${esc(fact(h.qi))}</td>
      <td>${esc(fact(h.wei))}</td>
      <td>${esc(h.meridian.length?h.meridian.join('、'):missingLabel())}${h.meridian.length?'经':''}</td>
      <td>${esc(h.eff)}</td>
      <td>${sourceBadge(h)}</td>
      <td><button class="compare-btn ${store.compareHerbs.includes(h.id)?'on':''}" data-compare="${esc(h.id)}" type="button">${store.compareHerbs.includes(h.id)?'已加入':'对比'}</button> <button class="fav-btn ${isFav(h.id)?'on':''}" data-fav="${esc(h.id)}" type="button" aria-label="${isFav(h.id)?'取消收藏':'收藏'}${esc(h.name)}" title="${isFav(h.id)?'取消收藏':'收藏'}"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3 4.9 13a4.9 4.9 0 0 1 0-6.9 4.7 4.7 0 0 1 6.8 0l.3.3.3-.3a4.7 4.7 0 0 1 6.8 0 4.9 4.9 0 0 1 0 6.9Z"/></svg></button></td>
    </tr>`).join('') || `<tr><td colspan="7" class="empty">没有匹配的药材，换个筛选试试。</td></tr>`;
  const mobile = $('#herbMobileGrid');
  if(mobile) mobile.innerHTML = visibleRows.map(h=>`
    <article class="herb-mobile-card">
      <div class="top">${herbImage(h,"herb-thumb")}<div><h3>${esc(h.name)}</h3><div class="muted">${esc(fact(h.qi))} · ${esc(fact(h.wei))} · 归${esc(h.meridian.length?h.meridian.join('、'):missingLabel())}${h.meridian.length?'经':''}</div></div></div>
      <p>${esc(h.eff)}</p><div>${sourceBadge(h)}</div>
      <div class="herb-mobile-actions"><a href="#/herb?id=${esc(h.id)}">查看知识卡</a><button type="button" class="compare-btn ${store.compareHerbs.includes(h.id)?'on':''}" data-compare="${esc(h.id)}">${store.compareHerbs.includes(h.id)?'已加入':'加入对比'}</button><button type="button" class="fav-btn ${isFav(h.id)?'on':''}" data-fav="${esc(h.id)}" aria-label="${isFav(h.id)?'取消收藏':'收藏'}${esc(h.name)}" title="${isFav(h.id)?'取消收藏':'收藏'}"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3 4.9 13a4.9 4.9 0 0 1 0-6.9 4.7 4.7 0 0 1 6.8 0l.3.3.3-.3a4.7 4.7 0 0 1 6.8 0 4.9 4.9 0 0 1 0 6.9Z"/></svg></button></div>
    </article>`).join('') || '<div class="empty">没有匹配的药材，换个筛选试试。</div>';
  const pager=$('#featuredPagination');
  if(pager)pager.innerHTML='<button type="button" data-featured-page="'+(store._featuredPage-1)+'" '+(store._featuredPage===1?'disabled':'')+'>上一页</button><span>第 '+store._featuredPage+' / '+pageCount+' 页 · '+list.length+' 味</span><button type="button" data-featured-page="'+(store._featuredPage+1)+'" '+(store._featuredPage===pageCount?'disabled':'')+'>下一页</button>';
  renderCompareTray();
}

function renderCatalog(){
  const input=$('#catalogSearch');
  if(input && input.value!==store._catalogKw) input.value=store._catalogKw||'';
  const sourceSelect=$('#catalogSource');
  const sourceLabel = item => { const refs=(item.sourceRefs||[]).join(' '); return item.evidenceTier==='pharmacopoeia'?'药典逐项核验':refs.includes('kdhr:')?'KDHR 研究资料':refs.includes('tcmkg:')?'公开本草资料':refs.includes('legacy-open')?'历史名称索引':'其他文献名称'; };
  const catalogSourceLink = item => {const ref=(item.sourceRefs||[]).find(value=>/^kdhr:HN\d+/.test(value));if(!ref)return '';const row=Number(ref.match(/HN(\d+)/)[1])+1;return '<a href="https://github.com/Rao-Yulong/KDHR/blob/50f0eb294766a11536907a4f7273e0d1235d34a1/KG/entity/herbID.csv#L'+row+'" target="_blank" rel="noopener noreferrer">来源行 ↗</a>';};
  const sources=[...new Set(HERB_CATALOG.map(sourceLabel))];
  if(sourceSelect){
    sourceSelect.innerHTML='<option value="">全部来源</option>'+sources.map(source=>`<option value="${esc(source)}">${esc(source.split(' · ')[0])}</option>`).join('');
    sourceSelect.value=store._catalogSource||'';
  }
  const kw=(store._catalogKw||'').trim().toLowerCase();
  if(store._catalogLoading && !HERB_CATALOG.length){
    const visible=$('#catalogVisibleCount'); if(visible) visible.textContent='—';
    const body=$('#catalogTableBody'); if(body) body.innerHTML='<tr><td colspan="4" class="empty">正在加载文献名称索引…<span id="catalogLoadProgress" role="status">'+esc(store._catalogProgress||'连接数据源中')+'</span></td></tr>';
    const pagination=$('#catalogPagination'); if(pagination) pagination.innerHTML='';
    return;
  }
  if(store._catalogError && !HERB_CATALOG.length){
    const visible=$('#catalogVisibleCount'); if(visible) visible.textContent='—';
    const body=$('#catalogTableBody'); if(body) body.innerHTML='<tr><td colspan="4" class="empty"><p>名称索引加载失败，请检查网络后重试。</p><button type="button" data-retry-catalog>重新加载</button></td></tr>';
    return;
  }
  const rows=HERB_CATALOG.filter(item=>{
    if(store._catalogSource && sourceLabel(item)!==store._catalogSource) return false;
    return !kw || [item.name,...(item.aliases||[])].some(value=>String(value).toLowerCase().includes(kw));
  });
  const pageSize=48;
  const pageCount=Math.max(1,Math.ceil(rows.length/pageSize));
  store._catalogPage=Math.min(Math.max(1,store._catalogPage||1),pageCount);
  const pageRows=rows.slice((store._catalogPage-1)*pageSize,store._catalogPage*pageSize);
  const visible=$('#catalogVisibleCount'); if(visible) visible.textContent=rows.length.toLocaleString('zh-CN');
  const body=$('#catalogTableBody');
  if(body) body.innerHTML=pageRows.map(item=>`<tr><td><strong>${esc(item.name)}</strong></td><td><span class="catalog-source">${esc(sourceLabel(item))}</span> ${catalogSourceLink(item)}</td><td><span class="badge outline">仅名称索引</span></td><td><button type="button" class="catalog-open" data-catalog-name="${esc(item.name)}">在精品层查找</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty"><p>没有匹配名称，请检查关键词或来源筛选。</p><button type="button" data-switch-featured>去精品层浏览</button></td></tr>';
  const pagination=$('#catalogPagination');
  if(pagination){
    const windowStart=Math.max(1,Math.min(store._catalogPage-2,pageCount-4));
    const windowEnd=Math.min(pageCount,windowStart+4);
    pagination.innerHTML=`<button type="button" data-catalog-page="${Math.max(1,store._catalogPage-1)}" ${store._catalogPage===1?'disabled':''}>上一页</button><span>第 ${store._catalogPage} / ${pageCount} 页 · ${rows.length.toLocaleString('zh-CN')} 条</span>${Array.from({length:windowEnd-windowStart+1},(_,i)=>windowStart+i).map(page=>`<button type="button" class="${page===store._catalogPage?'on':''}" data-catalog-page="${page}">${page}</button>`).join('')}<button type="button" data-catalog-page="${Math.min(pageCount,store._catalogPage+1)}" ${store._catalogPage===pageCount?'disabled':''}>下一页</button>`;
  }
}
document.addEventListener('click', e=>{
  const featuredPage=e.target.closest('[data-featured-page]');
  if(featuredPage){store._featuredPage=Number(featuredPage.dataset.featuredPage);renderHerbs();$('#herbResultCount')?.scrollIntoView({block:'start'});return;}
  if(e.target.closest('#resetFilters'))store._coverage='';
  const mode=e.target.closest('[data-atlas-mode]');
  if(mode){
    store._atlasMode=mode.dataset.atlasMode; store._catalogPage=1;
    if(store._atlasMode==='catalog' && !HERB_CATALOG.length){
      store._catalogLoading=true; store._catalogError='';
      renderHerbs();
      window.HerbalCatalogLoader?.loadCatalog?.().then(()=>{store._catalogLoading=false;renderHerbs();}).catch(()=>{store._catalogLoading=false;store._catalogError='load-failed';renderCatalog();});
      return;
    }
    renderHerbs(); return;
  }
  const page=e.target.closest('[data-catalog-page]');
  if(page){ store._catalogPage=Number(page.dataset.catalogPage)||1; renderCatalog(); return; }
  const open=e.target.closest('[data-catalog-name]');
  if(open){
    const match=HERBS.find(h=>h.name===open.dataset.catalogName);
    if(match) location.hash='#/herb?id='+match.id;
    else { store._atlasMode='featured'; store._kw=open.dataset.catalogName; location.hash='#/herbs'; toast('精品层暂未收录完整知识卡'); }
  }
  const switchFeatured=e.target.closest('[data-switch-featured]');
  if(switchFeatured){ store._atlasMode='featured'; store._catalogKw=''; store._catalogSource=''; renderHerbs(); }
  const retryCatalog=e.target.closest('[data-retry-catalog]');
  if(retryCatalog){ store._catalogLoading=true; store._catalogError=''; renderCatalog(); window.HerbalCatalogLoader?.loadCatalog?.().then(()=>{store._catalogLoading=false;renderCatalog();}).catch(()=>{store._catalogLoading=false;store._catalogError='load-failed';renderCatalog();}); }
});
document.addEventListener('input', e=>{
  if(e.target.id==='catalogSearch'){ store._catalogKw=e.target.value; store._catalogPage=1; if(parseHash().route==='herbs' && store._atlasMode==='catalog') renderCatalog(); }
});
document.addEventListener('change', e=>{
  if(e.target.id==='coverageFilter'){store._coverage=e.target.value;renderHerbs();}
  if(e.target.dataset.herbFilter){ store.filters[e.target.dataset.herbFilter]=e.target.value; renderHerbs(); }
  if(e.target.id==='catalogSource'){ store._catalogSource=e.target.value; store._catalogPage=1; if(parseHash().route==='herbs' && store._atlasMode==='catalog') renderCatalog(); }
});
function renderCompareTray(){
  const tray=$('#compareTray'), open=$('#openCompare');
  if(!tray) return;
  if(!store.compareHerbs.length) tray.innerHTML='选择 2-3 味药材进行属性对比';
  else tray.innerHTML=store.compareHerbs.map(id=>{const h=byId(id);return h?`<button class="compare-tag" type="button" data-compare-remove="${esc(h.id)}">${esc(h.name)} ×</button>`:''}).join('') + (store.compareHerbs.length<3?'<span class="muted">还可选择</span>':'');
  if(open) open.disabled=store.compareHerbs.length<2;
}
function toggleCompareHerb(id){
  const i=store.compareHerbs.indexOf(id);
  if(i>=0) store.compareHerbs.splice(i,1);
  else if(store.compareHerbs.length>=3){ toast('最多选择 3 味药材'); return; }
  else store.compareHerbs.push(id);
  renderHerbs();
}
function renderCompareChart(){
  const herbs=store.compareHerbs.map(byId).filter(Boolean), el=$('#herbCompareChart');
  if(!el || herbs.length<2) return;
  if(typeof echarts==='undefined'){ renderWhenEchartsReady(renderCompareChart); return; }
  const p=chartPalette();
  const qiScore={'大寒':1,'寒':2,'微寒':3,'凉':4,'平':5,'微温':6,'温':7,'热':8,'大热':9};
  const weiScore={'酸':1,'苦':2,'甘':3,'辛':4,'咸':5};
  const indicator=[{name:'四气位置',max:9},{name:'五味位置',max:5},{name:'归经数量',max:6},{name:'药食属性',max:1},{name:'配伍关系',max:8}];
  const formulaCounts=Object.fromEntries(herbs.map(h=>[h.id,FORMULAS.filter(f=>f.herbs.some(x=>x[0]===h.id)).length]));
  const values=herbs.map(h=>({name:h.name,value:[qiScore[h.qi]??null,weiScore[h.wei]??null,Math.min(h.meridian.length,6),h.food?1:0,Math.min(formulaCounts[h.id]||0,8)]}));
  const chart=chartManager.register('herbCompare',echarts.init(el),el);
  chart.setOption({backgroundColor:'transparent',tooltip:{trigger:'item',confine:true,backgroundColor:p.card,textStyle:{color:p.text,fontSize:12}},legend:{bottom:0,textStyle:{color:p.muted}},radar:{radius:'66%',indicator,axisName:{color:p.muted,fontSize:11},splitLine:{lineStyle:{color:p.line}},splitArea:{areaStyle:{color:['rgba(113,158,135,.04)','rgba(113,158,135,.1)']}},axisLine:{lineStyle:{color:p.line}}},series:[{type:'radar',data:values,symbolSize:6,lineStyle:{width:2},areaStyle:{opacity:.1},color:[p.celadon,p.cinnabar,p.jin]}]});
  renderCompareTable(herbs,formulaCounts);
}
function renderCompareTable(herbs,formulaCounts){
  const head=$('#compareTableHead'), body=$('#compareTableBody');
  if(!head||!body) return;
  const rows=[
    ['四气', h=>esc(fact(h.qi))],
    ['五味', h=>esc(fact(h.wei))],
    ['归经', h=>esc(h.meridian.length?h.meridian.join('、')+'经':missingLabel())],
    ['功效摘要', h=>esc(h.eff||missingLabel())],
    ['传统分类', h=>esc(fact(h.cat))],
    ['药食同源', h=>h.food?'目录收载':'—'],
    ['收录方剂', h=>(formulaCounts[h.id]||0)+' 首'],
    ['资料口径', h=>esc(h.source==='openMateria'?'公开资料整理':'编辑精选资料')]
  ];
  head.innerHTML='<tr><th scope="col">属性</th>'+herbs.map(h=>`<th scope="col">${esc(h.name)}</th>`).join('')+'</tr>';
  body.innerHTML=rows.map(([label,fn])=>`<tr><th scope="row">${label}</th>${herbs.map(h=>`<td>${fn(h)}</td>`).join('')}</tr>`).join('');
}
document.addEventListener('click', e=>{
  const compare=e.target.closest('[data-compare]');
  if(compare){ e.preventDefault(); e.stopPropagation(); toggleCompareHerb(compare.dataset.compare); return; }
  const remove=e.target.closest('[data-compare-remove]');
  if(remove){ toggleCompareHerb(remove.dataset.compareRemove); return; }
  const fav=e.target.closest('[data-fav]');
  if(fav){ e.preventDefault(); e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
  if(e.target.id==='openCompare'){
    const panel=$('#comparePanel'); if(panel){ panel.hidden=false; renderCompareChart(); panel.scrollIntoView({behavior:'smooth',block:'start'}); }
  }
  if(e.target.id==='closeCompare'){ const panel=$('#comparePanel'); if(panel) panel.hidden=true; }
});
document.getElementById('resetFilters').addEventListener('click', ()=>{
  store._coverage='';
  store.filters = { qi:'', wei:'', cat:'' };
  store._kw = '';
  const si = document.getElementById('globalSearch'); if(si) si.value = '';
  renderHerbs();
  toast('已重置筛选');
});

function renderHerb(id){
  const h = byId(id);
  if(!h){ $('#herbCrumb').innerHTML=''; $('#herbDetailHead').innerHTML=`<div class="empty">未找到该药材。</div>`; $('#herbProps').innerHTML=''; $('#herbFormulaList').innerHTML=''; return; }
  const p=chartPalette();
  const factSource=h.source==='openMateria'?'公开资料整理':'编辑精选资料';
  const efficacyLabel=herbEfficacyLabel(h);
  setSelected(h.id);
  $('#herbCrumb').innerHTML = `<a href="#/herbs">探索本草</a> / <span>${esc(h.name)}</span>`;
  $('#herbDetailHead').innerHTML = `
    <div class="detail-visual"><div class="image-frame">${herbImage(h,"")}</div><div class="visual-caption"><span class="eyebrow">图像档案</span><h2>${esc(h.name)} · ${hasOpenImageCredit(h)?'来源生物参考图':'照片待补充'}</h2><p>${esc(hasOpenImageCredit(h)?h.imageAlt:'当前尚无通过物种与开放许可校验的照片，以名称档案占位；不作为实物识别依据。')}</p><div class="signal-row"><span>${esc(fact(h.cat))}</span><span>${esc(fact(h.qi))} · ${esc(fact(h.wei))}</span><span>${h.meridian.length?esc(h.meridian.length)+' 经络':'归经待补充'}</span></div></div></div>
    <div class="detail-title">
      <h1>${esc(h.name)}</h1>
      <div class="latin">${esc(h.latin)}</div>
      <div class="source-line">${sourceBadge(h)} <span class="badge outline">${esc(fact(h.cat))}</span>
        <button class="fav-btn ${isFav(h.id)?'on':''}" data-fav="${esc(h.id)}" type="button" aria-label="${isFav(h.id)?'取消收藏':'收藏'}${esc(h.name)}" title="${isFav(h.id)?'取消收藏':'收藏'}"><svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3 4.9 13a4.9 4.9 0 0 1 0-6.9 4.7 4.7 0 0 1 6.8 0l.3.3.3-.3a4.7 4.7 0 0 1 6.8 0 4.9 4.9 0 0 1 0 6.9Z"/></svg></button>
      </div>
    </div><details class="herb-provenance"><summary>资料与图像来源（展开查看）</summary><p><strong>${factSource}</strong> · 记录分层展示；待补充字段不推断，公开资料整理不等同于药典逐项核验。</p><div class="source-links">${sourceLinks(h)||'<span>尚未配置可直接打开的来源链接。</span>'}</div><p class="image-credit">${imageCredit(h)}</p></details>`;
  $('#herbProps').innerHTML = `
    <div class="prop"><div class="k">四气</div><div class="v">${esc(fact(h.qi))}</div></div>
    <div class="prop"><div class="k">五味</div><div class="v">${esc(fact(h.wei))}</div></div>
    <div class="prop"><div class="k">归经</div><div class="v">${esc(h.meridian.length?h.meridian.join('、'):missingLabel())}</div></div>
    <div class="prop"><div class="k">文献分布</div><div class="v">${esc(h.origin?.length?h.origin.join('、'):missingLabel())}</div><div class="src">来源记载，不等同道地产区认证</div></div>
    <div class="prop"><div class="k">${efficacyLabel}</div><div class="v" style="font-size:14px;">${esc(h.eff)}</div></div>
    <div class="prop" style="grid-column:1/-1;"><div class="k">本草小记</div><div class="v" style="font-size:13.5px;font-weight:400;font-family:var(--sans);">${esc(h.note||'小记待补充，可展开资料来源查看当前收录依据。')}</div></div>`;
  const rel = FORMULAS.filter(f=>f.herbs.some(x=>x[0]===h.id));
  $('#herbFormulaList').innerHTML = rel.length ? rel.map(f=>`
    <a class="formula-row" href="#/formula?f=${esc(f.id)}">
      <div class="fn">${esc(f.name)}</div>
      <div class="fz">${esc(f.from)} · ${esc(f.eff)}</div>
      <span style="margin-left:auto;" class="muted">组成含 ${esc(herbName(h.id))}</span>
    </a>`).join('') : `<div class="muted">暂无收录的相关方剂。</div>`;
  if(typeof echarts==='undefined'){
    renderWhenEchartsReady(()=>{const state=parseHash();if(state.route==='herb'&&state.params.id===h.id)renderHerb(h.id);});
    return;
  }

  // 归经图
  const meridians = ['心','肝','脾','肺','肾','胃','胆','膀胱','大肠','小肠','三焦','心包'];
  const merData = meridians.map(m=>({name:m, value:h.meridian.includes(m)?1:0}));
  const merChart = chartManager.register('herbMeridian', echarts.init(document.getElementById('herbMeridianChart')), document.getElementById('herbMeridianChart'));
  merChart.setOption({
    backgroundColor:'transparent',
    tooltip:{trigger:'item', confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}},
    series:[{
      type:'pie', radius:['38%','70%'], center:['50%','52%'],
      data: merData.filter(d=>d.value>0).map(d=>({name:d.name+'经', value:1})).concat([{name:'',value:0.0001, itemStyle:{color:'transparent'}}]),
      label:{show:true, formatter:item=>item.name?item.name.split('经')[0]:'', color:p.text, fontSize:13, fontFamily:'Noto Serif SC'},
      itemStyle:{borderColor:p.card, borderWidth:2},
      color:[p.cha||'#A96032',p.jin,p.celadon,p.qing,p.cinnabar,'#8D7651','#4A806C']
    }]
  });

  // 性味定位（矩阵散点）
  const qis=['大寒','寒','微寒','凉','平','微温','温','热','大热'];
  const weis=['酸','苦','甘','辛','咸'];
  const qiweiChart = chartManager.register('herbQiwei', echarts.init(document.getElementById('herbQiweiChart')), document.getElementById('herbQiweiChart'));
  const pos = {};
  qis.forEach((q,i)=>pos[q]=i); weis.forEach((w,i)=>pos[w]=i);
  qiweiChart.setOption({
    backgroundColor:'transparent',
    grid:{left:64,right:20,top:20,bottom:36},
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:()=>`${h.name}：${h.qi} · ${h.wei}`},
    xAxis:{type:'category', data:weis, name:'五味', nameTextStyle:{color:p.muted,fontSize:11}, axisLabel:{color:p.muted,fontSize:11}},
    yAxis:{type:'category', data:qis, name:'四气', nameTextStyle:{color:p.muted,fontSize:11}, axisLabel:{color:p.muted,fontSize:11}},
    series:[{
      type:'scatter',
      data:pos[h.qi]==null?[]:weiTokens(h.wei).filter(w=>pos[w]!=null).map(w=>[pos[w],pos[h.qi]]),
      symbolSize:26,
      itemStyle:{color:p.cinnabar},
      label:{show:true, formatter:h.name, position:'top', color:p.text, fontSize:12, fontFamily:'Noto Serif SC'}
    }]
  });

  if(!h.meridian.length){chartManager.dispose('herbMeridian');$('#herbMeridianChart').innerHTML='<p class="chart-empty">此条资料待补充归经，暂不绘制。</p>';}
  if(pos[h.qi]==null||!weiTokens(h.wei).length){chartManager.dispose('herbQiwei');$('#herbQiweiChart').innerHTML='<p class="chart-empty">此条资料尚无可定位的性味记录。</p>';}
}

function renderQiwei(){
  window.HerbalFivePhases?.renderFlavorLegend('fivePhaseLegend',{note:'五色表达五味与五行的传统对应，同色深浅表示记录数量。“四气待补”灰色行保留已知味型；淡、涩仅作补充味型图例，未纳入当前主矩阵与五味柱图。'});
  if(typeof echarts === 'undefined'){ renderWhenEchartsReady(renderQiwei); return; }
  const routeQuery=parseHash().params;
  if(routeQuery.herb) setSelected(routeQuery.herb,{source:'context-bar'});
  const p=chartPalette();
  const categorySelect=$('#qiweiCatFilter');
  const categories=[...new Set(KNOWLEDGE_HERBS.map(h=>h.cat).filter(value=>value&&value!=='未录入'))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  if(categorySelect){ categorySelect.innerHTML='<option value="">全部类别</option>'+categories.map(cat=>`<option value="${esc(cat)}">${esc(cat)}</option>`).join(''); categorySelect.value=store._qiweiCat||''; if(categorySelect.dataset.bound!=='1'){ categorySelect.addEventListener('change',()=>{ store._qiweiCat=categorySelect.value; renderQiwei(); }); categorySelect.dataset.bound='1'; } }
  const active=store._qiweiCat||'';
  const herbs=active?KNOWLEDGE_HERBS.filter(h=>h.cat===active):KNOWLEDGE_HERBS;
  const catCount=$('#qiweiCategoryCount'); if(catCount) catCount.textContent=new Set(herbs.map(h=>h.cat)).size;
  const sampleCount=$('#qiweiSampleCount'); if(sampleCount) sampleCount.textContent=herbs.length;
  const matrixSample=$('#qiweiMatrixSample'); if(matrixSample) matrixSample.textContent=herbs.length;
  const weiSample=$('#weiBarSample'); if(weiSample) weiSample.textContent=herbs.length;
  const meridianCount=$('#qiweiMeridianCount'); if(meridianCount) meridianCount.textContent=new Set(herbs.flatMap(h=>h.meridian)).size;
  const qis=['大寒','寒','微寒','凉','平','微温','温','热','大热','四气待补'];
  const weis=['酸','苦','甘','辛','咸'];
  const qiPos={}, weiPos={};
  qis.forEach((q,i)=>qiPos[q]=i); weis.forEach((w,i)=>weiPos[w]=i);
  const missingQi=herbs.filter(h=>qiPos[h.qi]==null);
  const missingQiWithTaste=missingQi.filter(h=>weiTokens(h.wei).some(w=>weiPos[w]!=null));
  const matrixCaption=$('#qiweiMatrixChart')?.previousElementSibling;
  if(matrixCaption?.classList.contains('cap')){
    let note=document.getElementById('qiweiMissingNote');
    if(!note){note=document.createElement('span');note.id='qiweiMissingNote';matrixCaption.append(note);}
    note.textContent=` 四气待补 ${missingQi.length} 味，其中 ${missingQiWithTaste.length} 味已有主五味记录，以灰色行保留；两图采用相同的主五味拆分计数。`;
  }
  const mat = [];
  herbs.forEach(h=>{
    const q=qiPos[h.qi]??(qis.length-1);
    weiTokens(h.wei).forEach(w=>{const wi=weiPos[w];if(wi==null)return;const cell=mat.find(m=>m[0]===wi&&m[1]===q);if(cell)cell[2]++;else mat.push([wi,q,1]);});
  });
  const mChart = chartManager.register('qiweiMatrix', echarts.init(document.getElementById('qiweiMatrixChart')), document.getElementById('qiweiMatrixChart'));
  mChart.setOption({
    backgroundColor:'transparent',
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:item=>`${window.HerbalFivePhases?.flavorLabel(weis[item.value[0]])||weis[item.value[0]]} · ${qis[item.value[1]]}<br/>代表药材 <b>${item.value[2]}</b> 味`},
    grid:{left:54,right:16,top:14,bottom:40},
    xAxis:{type:'category', data:weis, name:'五味 · 五行', nameLocation:'middle', nameGap:26, nameTextStyle:{color:p.muted,fontSize:11}, axisLabel:{color:p.muted,fontSize:11,formatter:value=>value+'·'+(window.HerbalFivePhases?.flavorMeta(value).phase||'')}},
    yAxis:{type:'category', data:qis, name:'四气', nameLocation:'middle', nameGap:38, nameTextStyle:{color:p.muted,fontSize:11}, axisLabel:{color:p.muted,fontSize:11}},
    series:[{type:'heatmap', data:mat.map(value=>({value,...window.HerbalFivePhases?.flavorStyle(value[1]===qis.length-1?'四气待补':weis[value[0]],value[2],Math.max(5,...mat.map(m=>m[2])))})), itemStyle:{borderColor:p.card,borderWidth:2}, label:{show:true, formatter:item=>item.value[2]||'', color:p.text,fontSize:11}}]
  });

  const meridians = ['心','肝','脾','肺','肾','胃','胆','膀胱','大肠','小肠','三焦','心包'];
  const counts = meridians.map(m=>({name:m+'经', value:herbs.filter(h=>h.meridian.includes(m)).length})).filter(c=>c.value>0).sort((a,b)=>b.value-a.value);
  const bChart = chartManager.register('meridianBar', echarts.init(document.getElementById('meridianBarChart')), document.getElementById('meridianBarChart'));
  bChart.setOption({
    backgroundColor:'transparent',
    tooltip:{trigger:'axis', confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}},
    grid:{left:58,right:18,top:12,bottom:20},
    xAxis:{type:'value', minInterval:1, axisLabel:{color:p.muted,fontSize:11}, splitLine:{lineStyle:{color:p.line}}},
    yAxis:{type:'category', data:counts.map(c=>c.name), axisLabel:{color:p.muted,fontSize:11}, axisLine:{lineStyle:{color:p.line}}},
    series:[{type:'bar', data:counts.map(c=>c.value), barWidth:'56%', itemStyle:{color:p.celadon,borderRadius:[0,5,5,0]}, label:{show:true, position:'right', color:p.text,fontSize:11}}]
  });
  const qiOrder=['大寒','寒','微寒','凉','平','微温','温','热','大热'];
  const qiCount=qiOrder.map(q=>({name:q, value:herbs.filter(h=>h.qi===q).length})).filter(d=>d.value>0);
  const qiCaption=$('#qiRoseChart')?.previousElementSibling;
  if(qiCaption?.classList.contains('cap'))qiCaption.textContent=`有效四气 ${qiCount.reduce((sum,item)=>sum+item.value,0)} 味；待补 ${missingQi.length} 味未计入占比。保留原载的微寒、微温等标签。`;
  const rose=chartManager.register('qiRose', echarts.init(document.getElementById('qiRoseChart')), document.getElementById('qiRoseChart'));
  rose.setOption({
    backgroundColor:'transparent',
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}},
    series:[{type:'pie', roseType:'radius', radius:['18%','72%'], center:['50%','54%'],
      data:qiCount, label:{color:p.text,fontSize:10.5,formatter:'{b}\n{c}味',fontFamily:'Noto Sans SC'},
      itemStyle:{borderColor:p.card,borderWidth:1.5},
      color:[p.qing,p.celadon,p.cha||'#A96032',p.jin,p.cinnabar,'#4A806C','#8D7651','#B84B3E','#5C4A2E']}]
  });
  rose.on('click', params=>{ const q=params.name; const list=herbs.filter(h=>h.qi===q); showInspector(q+'性', q+'性的代表药材', list); });
  const weiOrder=['酸','苦','甘','辛','咸'];
  const weiData=weiOrder.map(w=>({name:w+'味', value:herbs.filter(h=>weiTokens(h.wei).includes(w)).length}));
  const wb=chartManager.register('weiBar', echarts.init(document.getElementById('weiBarChart')), document.getElementById('weiBarChart'));
  wb.setOption({
    backgroundColor:'transparent',
    tooltip:{trigger:'axis', confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}},
    grid:{left:40,right:16,top:14,bottom:34},
    xAxis:{type:'category', data:weiData.map(d=>d.name), axisLabel:{color:p.muted,fontSize:11}, axisLine:{lineStyle:{color:p.line}}},
    yAxis:{type:'value', minInterval:1, axisLabel:{color:p.muted,fontSize:11}, splitLine:{lineStyle:{color:p.line}}},
    series:[{type:'bar', data:weiData.map(d=>({value:d.value,itemStyle:window.HerbalFivePhases?.flavorStyle(d.name).itemStyle})), barWidth:'52%', itemStyle:{color:p.jin,borderRadius:[5,5,0,0]}, label:{show:true,position:'top',color:p.text,fontSize:11}}]
  });
  wb.on('click', params=>{ const w=weiOrder[params.dataIndex]; const list=herbs.filter(h=>weiTokens(h.wei).includes(w)); showInspector(w+'味', w+'味的代表药材', list); });

  const pairs=new Map();
  herbs.forEach(h=>h.meridian.forEach(mer=>{
    herbs.filter(other=>other!==h&&other.meridian.includes(mer)).forEach(other=>{
      if(h.id.localeCompare(other.id)>=0)return;const key=[h.id,other.id].sort().join('|'); pairs.set(key,(pairs.get(key)||0)+1);
    });
  }));
  const topPairs=[...pairs.entries()].sort((a,b)=>b[1]-a[1]).slice(0,18);
  const flowIds=[...new Set(topPairs.flatMap(([key])=>key.split('|')))].filter(id=>displayHerbName(id));
  const flowNodes=flowIds.map(id=>({id,name:displayHerbName(id),symbolSize:Math.min(30,12+(pairs.get(topPairs.find(([key])=>key.includes(id))?.[0])||1)*2),itemStyle:{color:p.celadon}}));
  const flowLinks=topPairs.map(([key,value])=>{const [source,target]=key.split('|');return {source,target,value,lineStyle:{width:Math.min(6,1+value/2),opacity:.38}};}).filter(link=>flowIds.includes(link.source)&&flowIds.includes(link.target));
  const flow=chartManager.register('qiweiFlow', echarts.init(document.getElementById('qiweiFlowChart')), document.getElementById('qiweiFlowChart'));
  flow.setOption({backgroundColor:'transparent',tooltip:{confine:true,backgroundColor:p.card,textStyle:{color:p.text,fontSize:12},formatter:item=>item.dataType==='edge'?`${esc(item.data.source)} · ${esc(item.data.target)}<br/>共同归经 ${item.data.value} 个`:esc(item.data.name)},series:[{type:'graph',layout:'force',roam:true,draggable:true,data:flowNodes,links:flowLinks,force:{repulsion:180,edgeLength:[50,110],gravity:.12},label:{show:true,color:p.text,fontSize:11},lineStyle:{color:p.celadon,curveness:.16}}]});

  const inspector=$('#qiweiInspector');
  const showInspector=(title,desc,items)=>{
    if(!inspector) return;
    inspector.classList.add('has-selection');
    inspector.innerHTML=`<div><span>INSPECTOR · ${esc(title)}</span><h2>${esc(desc)}</h2></div><div><p>当前组合共 ${items.length} 味代表药材，点击药材名称可进入知识卡。</p><div class="inspector-herbs">${items.length?items.slice(0,28).map(h=>`<a href="#/herb?id=${esc(h.id)}">${herbImage(h,"")}<span>${esc(h.name)} <small>${esc(fact(h.qi))}·${esc(fact(h.wei))}</small></span></a>`).join(''):'<span class="muted">暂无匹配药材</span>'}</div></div>`;
  };
  mChart.on('click', params=>{
    if(!params.value || params.value.length<3) return;
    const w=params.value[0], q=params.value[1];
    showInspector(`${qis[q]} · ${weis[w]}`,`${qis[q]} · ${weis[w]} 的药材`,herbs.filter(h=>(qiPos[h.qi]??(qis.length-1))===q&&weiTokens(h.wei).includes(weis[w])));
  });
  bChart.on('click', params=>{
    const idx=typeof params.dataIndex==='number'?params.dataIndex:-1;
    if(idx<0) return;
    const mer=counts[idx]?.name.replace('经','');
    if(mer) showInspector(`${mer}归经`,`归入${mer}经的药材`,herbs.filter(h=>h.meridian.includes(mer)));
  });
  flow.on('click', params=>{if(params.dataType==='node'){const herb=byId(params.data.id);if(herb)showInspector(herb.name,`${herb.name} · ${herb.qi} · ${herb.wei}`,[herb]);}});
  if(routeQuery.herb){ const focused=byId(routeQuery.herb); if(focused) showInspector(focused.name,`${focused.name} 路 ${focused.qi} 路 ${focused.wei}`,[focused]); }
}

function renderFormula(){
  const q = parseHash().params;
  const view = ['stats','directory','zheng'].includes(q.view) ? q.view : 'network';
  document.querySelectorAll('[data-formula-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.formulaView===view)));
  const networkView=document.getElementById('formulaNetworkView');
  const zhengView=document.getElementById('formulaZhengView');
  if(networkView) networkView.hidden=view==='zheng';
  if(zhengView) zhengView.hidden=view!=='zheng';
  const graph=networkView?.querySelector('.graph-workspace');if(graph){graph.id='formulaGraphView';graph.hidden=view!=='network';}
  const stats=networkView?.querySelector('.formula-insights');if(stats){stats.id='formulaStatsView';stats.hidden=view!=='stats';}
  networkView?.querySelectorAll('.formula-directory-heading,.formula-directory-toolbar,#formulaCards,#formulaDirectoryPages').forEach(el=>{el.hidden=view!=='directory';});
  if(view==='directory'){window.HerbalFormulaDirectory?.render(q.f);return;}
  if(view==='stats')return;
  if(typeof echarts === 'undefined'){ renderWhenEchartsReady(renderFormula); return; }
  if(view==='zheng'){renderZheng();return;}
  const focusId = q.f && formulaById(q.f) ? q.f : '';
  store._formulaFocus=focusId;
  const visibleFormulas = focusId ? FORMULAS.filter(f=>f.id===focusId) : q.herb ? FORMULAS.filter(f=>f.herbs.some(entry=>entry[0]===q.herb)) : FORMULAS;
  // 力导向二部图
  const herbNodes = visibleFormulas.flatMap(f=>f.herbs.map(x=>x[0])).filter((v,i,a)=>a.indexOf(v)===i && displayHerbName(v));
  const palette=chartPalette();
  const nodes = visibleFormulas.map(f=>({id:'f_'+f.id, name:f.name, category:0, symbolSize:24, itemStyle:{color:palette.qing}}))
    .concat(herbNodes.map(hid=>({id:'h_'+hid, name:herbName(hid), category:1, symbolSize:14, itemStyle:{color:palette.jin}})));
  const links = [];
  visibleFormulas.forEach(f=>f.herbs.forEach(x=>{ if(x[0] && displayHerbName(x[0])) links.push({source:'f_'+f.id, target:'h_'+x[0], sourceName:f.name, targetName:herbName(x[0]), value:1}); }));
  const p=palette;
  const gChart = chartManager.register('formulaGraph', echarts.init(document.getElementById('formulaGraph')), document.getElementById('formulaGraph'));
  gChart.setOption({
    backgroundColor:'transparent',
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:item=>{
      if(item.dataType==='edge') return `${esc(item.data.sourceName||'方剂')} ⇄ ${esc(item.data.targetName||'名称待补')}`;
      const id = item.data.id; const isF = id.startsWith('f_');
      return isF ? `${item.data.name}<br/>${formulaById(id.slice(2))?formulaById(id.slice(2)).eff:''}` : `${item.data.name}`;
    }},
    legend:{type:'scroll', bottom:0, textStyle:{color:p.muted,fontSize:11}, data:['方剂','药材']},
    series:[{
      type:'graph', layout:'force', roam:true, draggable:true, data:nodes, links:links,
      categories:[{name:'方剂'},{name:'药材'}],
      force:{repulsion:320, edgeLength:[60,140], gravity:0.08},
      label:{show:true, position:'right', color:p.text, fontSize:11, fontFamily:'Noto Serif SC'},
      lineStyle:{color:'rgba(107,158,138,.45)', width:1.2, curveness:0.08},
      emphasis:{focus:'adjacency', lineStyle:{width:3,color:p.cinnabar}}
    }]
  });
  const focusSelect=$('#formulaFocus'); if(focusSelect){focusSelect.innerHTML='<option value="">全部方剂</option>'+FORMULAS.map(f=>`<option value="${esc(f.id)}">${esc(f.name)}</option>`).join('');focusSelect.value=focusId;}
  const stat=$('#networkStats'); if(stat) stat.textContent=`${visibleFormulas.length} 首方剂 · ${herbNodes.length} 味药材 · ${links.length} 条关系`;
  const note=$('#networkFocusNote'); if(note) note.textContent=focusId?`当前聚焦：${formulaById(focusId)?.name||''}。网络仅显示与其直接相连的药材，点击“显示全网”恢复。`:'提示：点击网络节点可快速查看方剂详情，点击药材节点可进入知识卡。';
  const index=$('#formulaIndex');
  if(index) index.innerHTML=FORMULAS.map(f=>`<button type="button" class="${f.id===focusId?'active':''}" data-formula-index="${esc(f.id)}"><span>${esc(f.name)}</span><small>${f.herbs.length}味</small></button>`).join('');
  const inspector=$('#formulaInspector');
  const showFormula=(f)=>{
    if(!inspector||!f) return;
    store.selectedFormula=f.id;
    const relatedZheng=ZHENGS.filter(z=>z.formulas.includes(f.id));
    inspector.innerHTML=`<span>关系检查器 · 方剂</span><h2>${esc(f.name)}</h2><div class="inspector-source"><b>来源</b> ${esc(f.from)}<br><b>主治</b> ${esc(f.zheng)}<br><b>功效</b> ${esc(f.eff)}<div class="source-links">${sourceLinks(f)}</div></div><div class="evidence-links">${relatedZheng.map(z=>`<a href="#/formula?view=zheng&z=${encodeURIComponent(z.id)}&f=${encodeURIComponent(f.id)}">${esc(z.name)} →</a>`).join('')}</div><div class="workspace-label">君臣佐使组成</div><div class="composition-list">${f.herbs.map(x=>`<div class="composition-row"><b>${esc(x[2])}</b><a href="#/herb?id=${esc(x[0])}">${esc(herbName(x[0]))}</a><small>${esc(x[1]||'')}</small></div>`).join('')}</div>`;
  };
  const showHerb=(h)=>{
    if(!inspector||!h) return;
    const related=FORMULAS.filter(f=>f.herbs.some(x=>x[0]===h.id));
    inspector.innerHTML=`<span>关系检查器 · 药材</span><h2>${esc(h.name)}</h2><div class="inspector-source"><b>四气</b> ${esc(fact(h.qi))}　<b>五味</b> ${esc(fact(h.wei))}<br><b>归经</b> ${esc(h.meridian.length?h.meridian.join('、'):missingLabel())}${h.meridian.length?'经':''}<br><b>${herbEfficacyLabel(h)}</b> ${esc(h.eff)}</div><div class="workspace-label">进入方剂</div><div class="composition-list">${related.map(f=>`<div class="composition-row"><b>方</b><a href="#/formula?f=${esc(f.id)}">${esc(f.name)}</a><small>${esc(f.zheng)}</small></div>`).join('')||'<span class="muted">暂无收录方剂</span>'}</div>`;
  };
  if(focusId) showFormula(formulaById(focusId));
  else if(store.selectedFormula) showFormula(formulaById(store.selectedFormula));
  if(q.herb) { const focusedHerb=byId(q.herb); if(focusedHerb) showHerb(focusedHerb); }
  if(inspector && q.from==='zheng' && q.z){
    const back=document.createElement('a'); back.href='#/formula?view=zheng&z='+encodeURIComponent(q.z)+'&f='+encodeURIComponent(focusId); back.className='inspector-back-link'; back.textContent='返回相关证候'; inspector.prepend(back);
  }
  gChart.on('click', params=>{if(!params.data||!params.data.id)return;const id=params.data.id;if(id.startsWith('f_')){location.hash='#/formula?f='+encodeURIComponent(id.slice(2));}else if(id.startsWith('h_')){showHerb(byId(id.slice(2)));}});
  document.querySelectorAll('[data-formula-index]').forEach(btn=>btn.onclick=()=>{store._formulaFocus=btn.dataset.formulaIndex; location.hash='#/formula?f='+btn.dataset.formulaIndex;});
  // 跨页联动：来自药材详情的"相关方剂"点击，高亮该方剂节点
  if(q.f){
      const fi = visibleFormulas.findIndex(x=>x.id===focusId);
    if(fi>=0){
      setTimeout(()=>{ try{ gChart.dispatchAction({type:'focusNodeAdjacency', seriesIndex:0, dataIndex:fi}); }catch(e){} }, 150);
    }
  }

  window.HerbalFormulaDirectory?.render(focusId);
}

function renderZheng(){
  if(typeof echarts === 'undefined'){ renderWhenEchartsReady(renderZheng); return; }
  const routeQuery=parseHash().params;
  if(routeQuery.z && ZHENGS.some(item=>item.id===routeQuery.z)) store.selectedZheng=routeQuery.z;
  const p=chartPalette();
  if(!store.selectedZheng) store.selectedZheng = ZHENGS[0].id;
  const cur = ZHENGS.find(z=>z.id===store.selectedZheng) || ZHENGS[0];
  const selectedFormulas=cur.formulas.map(formulaById).filter(Boolean);
  selectedFormulas.sort((a,b)=>Number(b.id===routeQuery.f)-Number(a.id===routeQuery.f));
  const coreIds=[];
  selectedFormulas.forEach(f=>f.herbs.slice(0,5).forEach(x=>{if(x[0]&&!coreIds.includes(x[0])) coreIds.push(x[0]);}));
  const links=[];
  selectedFormulas.forEach((fm,fi)=>{
    links.push({source:'pattern',target:'formula-'+fi,value:1});
    fm.herbs.slice(0,5).forEach(x=>{if(x[0]&&coreIds.includes(x[0]))links.push({source:'formula-'+fi,target:'herb-'+x[0],value:1});});
  });
  const nodes=[{id:'pattern',name:cur.name,x:90,y:215,fixed:true,symbolSize:34,itemStyle:{color:p.cinnabar}},...selectedFormulas.map((f,i)=>({id:'formula-'+i,name:f.name,x:280,y:80+i*150,fixed:true,symbolSize:f.id===routeQuery.f?34:26,itemStyle:{color:f.id===routeQuery.f?p.cinnabar:p.celadon}})),...coreIds.map((id,i)=>({id:'herb-'+id,name:herbName(id),x:500,y:36+i*58,fixed:true,symbolSize:16,itemStyle:{color:p.jin}}))];
  const formulaNodeMap=new Map(selectedFormulas.map((formula,index)=>['formula-'+index,'formula-'+formula.id]));
  nodes.forEach(node=>{ if(formulaNodeMap.has(node.id)) node.id=formulaNodeMap.get(node.id); });
  links.forEach(link=>{ if(formulaNodeMap.has(link.source)) link.source=formulaNodeMap.get(link.source); if(formulaNodeMap.has(link.target)) link.target=formulaNodeMap.get(link.target); });
  const zhengEl=document.getElementById('zhengSankey');
  if(!zhengEl) return;
  chartManager.dispose('zhengSankey');
  zhengEl.innerHTML='';
  zhengEl.removeAttribute('_echarts_instance_');
  const sChart = chartManager.register('zhengSankey', echarts.init(zhengEl), zhengEl);
  sChart.setOption({
    backgroundColor:'transparent',
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}},
    series:[{
      type:'graph',layout:'none',roam:true,coordinateSystem:null,data:nodes,links,
      lineStyle:{color:p.celadon,opacity:.48,width:2,curveness:.12},
      label:{color:p.text,fontSize:12,fontFamily:'Noto Serif SC',position:'right',formatter:item=>item.data.name},
      emphasis:{focus:'adjacency',lineStyle:{width:4,color:p.cinnabar}}
    }]
  });
  sChart.on('click', params=>{ const id=params.data&&params.data.id||''; if(id.startsWith('herb-')) location.hash='#/herb?id='+id.slice(5); if(id.startsWith('formula-')){ const formula=selectedFormulas.find(item=>'formula-'+item.id===id)||selectedFormulas[Number(id.slice(8))]; if(formula) location.hash='#/formula?view=network&f='+encodeURIComponent(formula.id)+'&from=zheng&z='+encodeURIComponent(cur.id); } });
  const title=$('#zhengFocusTitle'); if(title) title.textContent=cur.name;
  const desc=$('#zhengFocusDesc'); if(desc) desc.textContent=`${cur.desc} · 当前展示 ${selectedFormulas.length} 首方剂与 ${coreIds.length} 味核心药材`;
  const count=$('#zhengFocusCount'); if(count) count.textContent=`${selectedFormulas.length} 方 · ${coreIds.length} 味药`;
  const evidence=$('#zhengEvidence');
  if(evidence) evidence.innerHTML=`<span>证据检查器 · 当前证候</span><h2>${esc(cur.name)}</h2><p>${esc(cur.desc)}</p><div class="source-links">${sourceLinks(cur)}</div>${selectedFormulas.map(f=>`<div class="evidence-formula"><strong>${esc(f.name)}</strong><div class="muted" style="font-size:11px;margin-top:4px;">${esc(f.from)} · ${esc(f.eff)}</div><div class="evidence-herbs">${f.herbs.slice(0,5).map(x=>`<a href="#/herb?id=${esc(x[0])}">${esc(herbName(x[0]))}</a>`).join('')}</div></div>`).join('')}`;
  if(evidence) evidence.querySelectorAll('.evidence-formula').forEach((el,index)=>{ const formula=selectedFormulas[index]; if(!formula) return; const link=document.createElement('a'); link.href='#/formula?view=network&f='+encodeURIComponent(formula.id)+'&from=zheng&z='+encodeURIComponent(cur.id); link.dataset.testid='zheng-formula-link'; link.className='evidence-formula-link'; link.textContent='查看方剂配伍 →'; el.prepend(link); });
  const index=$('#zhengIndex');
  const query=($('#syndromeSearch')?.value||'').trim();
  const filtered=ZHENGS.filter(z=>!query||z.name.includes(query)||z.desc.includes(query));
  if(index) index.innerHTML=filtered.map(z=>`<button type="button" class="${z.id===cur.id?'active':''}" data-zheng="${esc(z.id)}"><b>${esc(z.name)}</b><small>${esc(z.desc)}</small></button>`).join('')||'<span class="muted">没有匹配证候</span>';
}
document.addEventListener('click', e=>{
  const card=e.target.closest('[data-zheng]');
  if(card){ store.selectedZheng=card.dataset.zheng; location.hash='#/formula?view=zheng&z='+encodeURIComponent(card.dataset.zheng); }
});
document.addEventListener('input', e=>{const state=parseHash();if(e.target.id==='syndromeSearch'&&state.route==='formula'&&state.params.view==='zheng')renderZheng();});

function renderHomeClassics(){
  $('#homeClassicTimeline').innerHTML = CLASSICS.map(c=>`
    <div class="cl-item" tabindex="0">
      <div class="cl-era">${esc(c.era)}</div>
      <div class="cl-name">${esc(c.name)}</div>
      <div class="cl-meta">${esc(c.author)} · <span class="cl-num">收载 ${esc(c.num)} 种</span></div>
      <div class="cl-desc">${esc(c.desc)}</div>
    </div>`).join('');
  if(typeof echarts === 'undefined'){
    renderWhenEchartsReady(()=>{if(parseHash().route==='home')renderHomeClassics();});
    return;
  }
  const p=chartPalette();
  const el=document.getElementById('homeClassicBarChart');
  if(!el) return;
  const bChart = chartManager.register('homeClassicBar', echarts.init(el), el);
  const data = CLASSICS.map(c=>({name:c.name, value:c.num}));
  bChart.setOption({
    backgroundColor:'transparent',
    tooltip:{trigger:'axis', confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:item=>`${esc(item[0].name)}<br/>收载 <b>${item[0].value}</b> 种`},
    grid:{left:56,right:20,top:14,bottom:60},
    xAxis:{type:'category', data:data.map(d=>d.name), axisLabel:{color:p.muted,fontSize:10.5,rotate:32,interval:0}, axisLine:{lineStyle:{color:p.line}}},
    yAxis:{type:'value', axisLabel:{color:p.muted,fontSize:11}, splitLine:{lineStyle:{color:p.line}}},
    series:[{type:'bar', data:data.map(d=>d.value), barWidth:'52%', itemStyle:{color:item=> item.dataIndex>=4 ? p.cinnabar : p.celadon, borderRadius:[6,6,0,0]}, label:{show:true, position:'top', color:p.text,fontSize:11}}]
  });

}

function renderFood(){
  const tags = ['全部', ...new Set(FOODS.map(f=>f.tag))];
  $('#foodFilters').innerHTML = tags.map(t=>`<button class="filter-chip ${store._foodTag===t||(t==='全部'&&!store._foodTag)?'on':''}" data-food="${esc(t)}">${esc(t)}</button>`).join('');
  const list = FOODS.filter(f=>!store._foodTag || store._foodTag==='全部' || f.tag===store._foodTag);
  $('#foodGrid').innerHTML = list.map(f=>`
    <div class="card card-pad thumb-card">
      <div class="image-frame food-image">${herbImage(byName(f.name)||{name:f.name})}</div>
      <div class="hd"><span class="stamp"><span class="a">${esc(f.name.slice(0,2))}</span><span class="b">${esc(f.flavor)}</span></span>
        <div><h3>${esc(f.name)}</h3><div class="muted" style="font-size:11.5px;">${esc(f.flavor)} · ${esc(f.tag)}</div></div></div>
      <p>${esc(f.note)}</p>
      <div class="tags"><span class="badge jin">用法：${esc(f.use)}</span></div>
    </div>`).join('');
}
document.addEventListener('click', e=>{
  const chip = e.target.closest('[data-food]');
  if(chip){ store._foodTag = chip.dataset.food; renderFood(); }
});

function renderCulture(){
  $('#heritageGrid').innerHTML = HERITAGE.map(h=>`
    <div class="card card-pad thumb-card">
      <div class="image-frame culture-image"><img src="${esc(HERITAGE_IMAGES[h.name]||herbPlaceholder('遗'))}" alt="${esc(h.name)} 非遗场景图" loading="lazy" onerror="this.onerror=null;this.src=herbPlaceholder('遗')"></div>
      <div class="hd"><span class="stamp"><span class="a">${esc(h.name.slice(0,2))}</span><span class="b">非遗</span></span>
        <div><h3>${esc(h.name)}</h3><div class="muted" style="font-size:11.5px;">${esc(h.type)}</div></div></div>
      <p>${esc(h.note)}</p>
    </div>`).join('');
}

const QUIZ = (typeof window !== 'undefined' && Array.isArray(window.QUIZ)) ? window.QUIZ : [];
const learnState = {index:0, answered:false, picked:null, routeHash:null, correct:0, total:0};
if (typeof window !== 'undefined') window.HerbalLearnState = learnState;
function getLearnStats(){try{const value=JSON.parse(storageRead('herbal_learn_stats','{"total":0,"correct":0}'));return {total:Number.isFinite(value?.total)?value.total:0,correct:Number.isFinite(value?.correct)?value.correct:0};}catch(e){return {total:0,correct:0}}}
function saveLearnStats(){storageWrite('herbal_learn_stats',JSON.stringify({total:learnState.total,correct:learnState.correct}));}
function renderLearn(){
  const quizCard=$('#quizCard');
  const stats=$('#learnStats');
  if(!quizCard||!stats) return;
  const s=getLearnStats(); learnState.total=s.total; learnState.correct=s.correct;
  if(learnState.routeHash!==location.hash){
    const stepParam=Number(parseHash().params.step);
    if(Number.isFinite(stepParam)&&stepParam>0)learnState.index=Math.min(QUIZ.length-1,Math.max(0,Math.floor(stepParam)-1));
    learnState.routeHash=location.hash;learnState.answered=false;learnState.picked=null;
  }
  const item=QUIZ[learnState.index%QUIZ.length]; const progress=((learnState.index%QUIZ.length)/QUIZ.length)*100;
  quizCard.innerHTML=`<div class="quiz-top"><span class="badge qing">第 ${(learnState.index%QUIZ.length)+1} / ${QUIZ.length} 题</span><span class="muted" style="font-size:12px;">累计正确 ${s.correct} 题</span></div><div class="progress"><i style="width:${progress}%"></i></div><div class="quiz-q">${esc(item.q)}</div><div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${esc(o)}</button>`).join('')}</div><div id="quizFeedback" aria-live="polite"></div>`;
  const restoreAnswer=()=>{
    const picked=learnState.picked,ok=picked===item.answer;
    quizCard.querySelectorAll('[data-answer]').forEach((b,i)=>{b.disabled=true;if(i===item.answer)b.classList.add('correct');if(i===picked&&!ok)b.classList.add('wrong')});
    const readHref=/^#\/[a-z]+(?:\?.*)?$/.test(item.readHref||'')?item.readHref:'';
    const sourceUrl=safeSourceUrl(item.sourceUrl);
    const reading=(readHref?`<a href="${esc(readHref)}">继续阅读 · ${esc(item.source||'展览解读')}</a>`:'')+(sourceUrl?`<a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">官方来源 ↗</a>`:'');
    $('#quizFeedback').innerHTML=`<div class="quiz-note">${ok?'答对了！':'再想一想。'} ${esc(item.note)}${reading?`<div class="quiz-reading">${reading}</div>`:''}</div><button class="quiz-next" id="quizNext">下一题 →</button>`;
    $('#quizNext').onclick=()=>{
      learnState.index=(learnState.index+1)%QUIZ.length;learnState.answered=false;learnState.picked=null;
      const params=new URLSearchParams(location.hash.split('?')[1]||'');params.set('step',String(learnState.index+1));
      const nextHash='#/learn?'+params.toString();
      if(location.hash===nextHash)renderLearn();else location.hash=nextHash;
    };
    $('#learnStats').textContent=`已完成 ${learnState.total} · 正确 ${learnState.correct}`;
  };
  quizCard.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{
    if(learnState.answered)return;
    learnState.answered=true;learnState.picked=Number(btn.dataset.answer);
    learnState.total++;if(learnState.picked===item.answer)learnState.correct++;saveLearnStats();
    restoreAnswer();
    window.HerbalCulture?.renderJourney?.('learnJourney');
  }));
  if(learnState.answered&&Number.isInteger(learnState.picked))restoreAnswer();
  stats.textContent=`已完成 ${s.total} · 正确 ${s.correct}`;
  if (window.HerbalLearn) { window.HerbalLearn.renderPictureQuiz(); window.HerbalLearn.renderLearnCulture(); }
}

function renderFavButtons(){
  document.querySelectorAll('[data-fav]').forEach(b=>{
    const on = isFav(b.dataset.fav); b.classList.toggle('on', on);
    const name = (b.getAttribute('aria-label')||'').replace(/^(取消收藏|收藏)/,'');
    b.setAttribute('aria-label',(on?'取消收藏':'收藏')+name);
    b.title = on?'取消收藏':'收藏';
  });
}
window.addEventListener('herbal:favorites',event=>{
  if(Array.isArray(event.detail?.ids)) storageWrite(favKey,JSON.stringify([...new Set(event.detail.ids.filter(id=>typeof id==='string'&&id.trim()))]));
  renderFavButtons();
});
const searchInput = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');
const searchStatus = document.getElementById('searchStatus');
let searchTimer = null;
let catalogSearchUnavailable = false;
function searchOptionId(type, key, index){
  const encoded=encodeURIComponent(String(key??index)).replace(/%/g,'x').replace(/[^a-z0-9_.:-]/gi,'-');
  return 'search-option-'+type+'-'+(encoded||index)+'-'+index;
}
function setSearchBusy(busy){
  searchInput.setAttribute('aria-busy',String(Boolean(busy)));
  if(busy && searchStatus) searchStatus.textContent='名称索引正在加载';
}
function setActiveSearchOption(options,index){
  const safeIndex=index>=0&&index<options.length?index:-1;
  store._searchIndex=safeIndex;
  options.forEach((option,i)=>{
    const active=i===safeIndex;
    option.classList.toggle('active',active);
    option.setAttribute('aria-selected',String(active));
  });
  if(options[safeIndex]) searchInput.setAttribute('aria-activedescendant',options[safeIndex].id);
  else searchInput.removeAttribute('aria-activedescendant');
}
function announceSearchResults(count,keyword){
  if(!searchStatus || searchInput.getAttribute('aria-busy')==='true') return;
  const scopeNote=catalogSearchUnavailable?'；名称索引暂时不可用，结果来自知识卡与方剂':'';
  searchStatus.textContent=(count?'“'+keyword+'”有 '+count+' 条结果':'没有找到“'+keyword+'”')+scopeNote;
}
function updateSearchSuggestions(){
  const keyword=searchInput.value.trim();
  const kw=keyword.toLowerCase();
  setActiveSearchOption([], -1);
  if(!kw){ searchResults.classList.remove('open'); searchResults.innerHTML=''; searchInput.setAttribute('aria-expanded','false'); if(searchStatus) searchStatus.textContent=''; return; }
  const herbs=KNOWLEDGE_HERBS.filter(h=>h.name.toLowerCase().includes(kw)||h.pinyin.includes(kw)||h.eff.toLowerCase().includes(kw)||(h.aliases||[]).some(alias=>String(alias).toLowerCase().includes(kw))).slice(0,6);
  const approvedCatalog=(window.HerbalSearch?.filterApproved||((entries)=>entries.filter(item=>item&& !['review','rejected'].includes(item.status))))(HERB_CATALOG);
  const cardNames=new Set(KNOWLEDGE_HERBS.map(h=>h.name));
  const catalog=approvedCatalog.filter(item=>!cardNames.has(item.name)&&[item.name,...(item.aliases||[])].some(value=>String(value).toLowerCase().includes(kw))).slice(0,4);
  const formulas=FORMULAS.filter(f=>f.name.toLowerCase().includes(kw)||f.eff.toLowerCase().includes(kw)).slice(0,4);
  const group=(label,rows)=>rows.length?`<div class="search-group" role="group" aria-label="${label}"><div class="search-group-label" role="presentation">${label}</div>${rows.join('')}</div>`:'';
  searchResults.innerHTML=[
    group('知识卡',herbs.map(h=>`<a class="search-result herb-result" role="option" href="#/herb?id=${esc(h.id)}">${herbImage(h,"herb-thumb")}<strong>${esc(h.name)}</strong><span class="search-result-meta">知识卡 · ${esc(fact(h.qi))} · ${esc(fact(h.wei))}</span></a>`)),
    group('方剂',formulas.map(f=>`<a class="search-result formula-result" role="option" href="#/formula?f=${esc(f.id)}"><span class="catalog-result-mark" aria-hidden="true">方</span><strong>${esc(f.name)}</strong><span class="search-result-meta">方剂 · ${esc(f.zheng)}</span></a>`)),
    group('名称索引',catalog.map(item=>`<a class="search-result catalog-result" role="option" href="#/herbs?mode=catalog&q=${encodeURIComponent(item.name)}"><span class="catalog-result-mark" aria-hidden="true">索引</span><strong>${esc(item.name)}</strong><span class="search-result-meta">仅名称 · 无药性</span></a>`))
  ].join('')||'<div class="search-empty">没有匹配，试试“人参”或“六味地黄丸”</div>';
  const options=Array.from(searchResults.querySelectorAll('[role="option"]'));
  options.forEach((option,index)=>{
    const href=option.getAttribute('href')||'';
    const type=option.classList.contains('catalog-result')?'catalog':(href.startsWith('#/formula')?'formula':'herb');
    option.id=searchOptionId(type,href||option.textContent,index);
    option.setAttribute('aria-selected','false');
  });
  searchResults.classList.add('open'); searchInput.setAttribute('aria-expanded','true');
  announceSearchResults(options.length,keyword);
}
function closeSearch(){
  searchResults.classList.remove('open');
  searchInput.setAttribute('aria-expanded','false');
  setActiveSearchOption(Array.from(searchResults.querySelectorAll('[role="option"]')),-1);
}
function searchSuggestionsVisible(){
  return document.activeElement===searchInput&&searchResults.classList.contains('open')&&Boolean(searchInput.value.trim());
}
window.addEventListener('herbal:catalog-loading',()=>{
  store._catalogLoading=true; store._catalogError='';
  catalogSearchUnavailable=false;
  setSearchBusy(true);
});
window.addEventListener('herbal:catalog-ready',()=>{
  store._catalogLoading=false; store._catalogError='';
  catalogSearchUnavailable=false;
  setSearchBusy(false);
  setTimeout(()=>{
    if(searchSuggestionsVisible()) updateSearchSuggestions();
    else if(searchStatus) searchStatus.textContent='名称索引已就绪';
  },0);
});
window.addEventListener('herbal:catalog-error',()=>{
  store._catalogLoading=false; store._catalogError='load-failed';
  if(parseHash().route==='herbs'&&store._atlasMode==='catalog')renderCatalog();
  catalogSearchUnavailable=true;
  setSearchBusy(false);
  if(searchSuggestionsVisible()) updateSearchSuggestions();
  else if(searchStatus) searchStatus.textContent='名称索引暂时不可用，仍可搜索知识卡与方剂';
});
setSearchBusy(false);
// 输入过程提供建议，也在药材星图页同步过滤
window.addEventListener('herbal:catalog-progress',event=>{
  const {completed,total}=event.detail;
  store._catalogProgress='已加载 '+completed+' / '+total+' 个分块';
  const el=document.getElementById('catalogLoadProgress');if(el)el.textContent=store._catalogProgress;
  if(parseHash().route==='herbs'&&store._atlasMode==='catalog'&&!el)renderCatalog();
});
searchInput.addEventListener('input', ()=>{
  clearTimeout(searchTimer);
  searchTimer = setTimeout(()=>{
    const kw = searchInput.value.trim();
    store._kw = kw;
    updateSearchSuggestions();
    const { route } = parseHash();
    if(route==='herbs') renderHerbs();
  }, 120);
});
searchInput.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ e.preventDefault(); closeSearch(); searchInput.focus(); return; }
  let options=Array.from(searchResults.querySelectorAll('[role="option"]'));
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    if(!searchResults.classList.contains('open') && searchInput.value.trim()){
      updateSearchSuggestions();
      options=Array.from(searchResults.querySelectorAll('[role="option"]'));
    }
    if(!options.length) return;
    e.preventDefault();
    const next=e.key==='ArrowDown'
      ? (store._searchIndex>=options.length-1?0:store._searchIndex+1)
      : (store._searchIndex<=0?options.length-1:store._searchIndex-1);
    setActiveSearchOption(options,next);
    options[next]?.scrollIntoView({block:'nearest'});
    return;
  }
  if(e.key !== 'Enter') return;
  const kw = searchInput.value.trim();
  if(!kw) return;
  if(options[store._searchIndex]){ options[store._searchIndex].click(); closeSearch(); return; }
  const herbHit = KNOWLEDGE_HERBS.filter(h=>h.name.includes(kw)||h.pinyin.includes(kw.toLowerCase())||(h.aliases||[]).some(alias=>String(alias).includes(kw)));
  const catalogHit = HERB_CATALOG.filter(item=>item&&!['review','rejected'].includes(item.status)&&[item.name,...(item.aliases||[])].some(value=>String(value).includes(kw)));
  const formHit = FORMULAS.filter(f=>f.name.includes(kw));
  closeSearch();
  if(herbHit.length===1){ setSelected(herbHit[0].id); location.hash = '#/herb?id='+herbHit[0].id; }
  else if(formHit.length===1){ location.hash = '#/formula?f='+formHit[0].id; }
  else if(herbHit.length>1){ store._kw = kw; location.hash = '#/herbs'; }
  else if(catalogHit.length){ store._atlasMode='catalog'; store._catalogKw=kw; location.hash = '#/herbs?mode=catalog&q='+encodeURIComponent(kw); }
  else if(formHit.length>1){ location.hash = '#/formula'; }
  else { toast('未找到「'+kw+'」，试试药材名或方剂名'); }
});
searchInput.addEventListener('focus', updateSearchSuggestions);
searchResults.addEventListener('click', closeSearch);
document.getElementById('hamburger').addEventListener('click', ()=>{
  setNavigationOpen(!document.getElementById('mainNav').classList.contains('open'));
});
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape') return;
  const more=document.querySelector('.nav-more');
  if(more?.open){
    event.preventDefault();
    more.open=false;
    more.querySelector('summary')?.focus();
    return;
  }
  if(document.getElementById('mainNav')?.classList.contains('open')) setNavigationOpen(false,true);
});
document.addEventListener('change', e=>{
  if(e.target.id==='formulaFocus'){ location.hash=e.target.value?'#/formula?f='+encodeURIComponent(e.target.value):'#/formula'; }
  if(e.target.id==='qiweiCatFilter'){ store._qiweiCat=e.target.value; if(parseHash().route==='qiwei') renderQiwei(); }
});
document.addEventListener('click', e=>{
  const more=document.querySelector('.nav-more');
  if(more?.open&&!e.target.closest('.nav-more')) more.open=false;
  if(e.target.id==='resetGraph'){ store._formulaFocus=''; if(parseHash().route==='formula' && !parseHash().params.f) renderFormula(); else location.hash='#/formula'; }
  const formulaView=e.target.closest('[data-formula-view]');
  if(formulaView){
    const params=parseHash().params;
    const next=new URLSearchParams();
    if(formulaView.dataset.formulaView!=='network'){next.set('view',formulaView.dataset.formulaView);if(params.z)next.set('z',params.z);if(params.f)next.set('f',params.f);}
    else {if(params.f)next.set('f',params.f);if(params.from)next.set('from',params.from);if(params.z)next.set('z',params.z);}
    if(params.herb)next.set('herb',params.herb);
    if(params.from&&!next.has('from'))next.set('from',params.from);
    location.hash='#/formula'+(next.toString()?'?'+next.toString():'');
  }
});
const themeToggle=document.getElementById('themeToggle');
if(storageRead('herbal_theme')==='night') document.body.classList.add('night');
themeToggle.addEventListener('click',()=>{
  if(window.HerbalTheme?.setTheme){ window.HerbalTheme.setTheme(window.HerbalTheme.nextTheme(document.documentElement.dataset.theme)); return; }
  document.body.classList.toggle('night');storageWrite('herbal_theme',document.body.classList.contains('night')?'night':'day');updateThemeControl();render();
});
updateThemeControl();
const hero=document.querySelector('.hero');
if(hero) hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--spot-x',`${((e.clientX-r.left)/r.width)*100}%`);hero.style.setProperty('--spot-y',`${((e.clientY-r.top)/r.height)*100}%`);});
document.querySelectorAll('[data-scroll-down]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.evidence-rail')?.scrollIntoView({behavior:'smooth',block:'start'});}));
document.querySelectorAll('[data-learn-mode]').forEach(button=>button.addEventListener('click',()=>{
  const mode=button.dataset.learnMode;
  document.querySelectorAll('[data-learn-mode]').forEach(b=>{const on=b===button;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on));});
  const text=$('#quizCard'), picture=$('#pictureQuizCard');
  if(text) text.hidden = mode!=='text';
  if(picture) picture.hidden = mode!=='picture';
  if(mode==='picture') window.HerbalLearn?.renderPictureQuiz();
}));
document.addEventListener('click',e=>{
  if(e.target.closest('#learnCultureExpand')){ window.HerbalLearn?.toggleCulture(); }
});
document.addEventListener('click', e=>{
  if(e.target.closest('nav a') || (e.target.closest('#app') && !e.target.closest('#mainNav,#hamburger') && window.innerWidth<=768)){
    setNavigationOpen(false);
  }
  if(!e.target.closest('.searchbox')) closeSearch();
});

// 网络失败与尚未收录图片使用不同状态，不把名称占位当成实物照片。
document.addEventListener('error', e=>{
  const img=e.target;
  if(!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied='1';
  img.outerHTML=herbImagePlaceholder({name:img.dataset.herbName||img.alt||'本草'},img.className,true);
}, true);

// 启动
render();

// ECharts 加载兜底：CDN 异常时全站提示，避免图表区静默空白

