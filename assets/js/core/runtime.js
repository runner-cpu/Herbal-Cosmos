/* Runtime extracted from index.html; data bindings come from data/featured.js. */
const store = {
  selectedHerb: null,      // 当前选中药材
  selectedFormula: null,
  compareHerbs: [],
  filters: { qi:'', wei:'', cat:'' },
  _formulaFocus: '',
  _atlasMode: 'featured',
  _catalogPage: 1,
  _catalogSource: '',
  _catalogKw: '',
  _searchIndex: -1,
  listeners: []
};
const I18N = {
  zh:{
    'nav.home':'首页','nav.herbs':'探索本草','nav.qiwei':'性味归经','nav.formula':'配伍网络','nav.learn':'学习舱','nav.more':'更多','nav.zheng':'病证药链','nav.classics':'典籍时光','nav.food':'药食同源','nav.culture':'文化与非遗','nav.saved':'本机收藏',
    'search.placeholder':'搜索药材 / 方剂','search.empty':'没有匹配，试试“人参”或“六味地黄丸”','theme.day':'日间','theme.night':'夜读','lang.button':'EN',
    'hero.tagline':'以 18,817 种中药资源为星辰，从一味药出发，漫游性味、配伍、典籍与生活的完整宇宙。','hero.explore':'探索星图','hero.network':'进入配伍网络','hero.hint':'拖动旋转星云 · 滚轮缩放 · 点击星辰查看一味药','home.journey':'从一味药，走进本草世界','home.journeyDesc':'五步完成认识、理解、关联与复习。进度仅保存在本机。','home.start':'开始今日学习','home.discover':'本草发现','home.viewAll':'查看全部代表药材 →','home.progress':'今日进度',
    'herb.imageCaption':'从图像认识本草','herb.imageDesc':'植物形态是理解药材来源的第一条线索。图像用于科普识别，不替代专业鉴定。','herb.visual':'图像档案','herb.openCard':'打开知识卡','herb.addCompare':'加入对比','herb.compare':'对比','herb.save':'收藏','herb.saved':'已收藏',
    'learn.next':'下一题 →','learn.correct':'答对了！','learn.retry':'再想一想。','learn.total':'累计正确','learn.done':'已完成','learn.right':'正确','learn.today':'今日提示','learn.method':'学习方法','learn.footprint':'你的足迹',
    'data.note':'图表展示代表性数据集中的关系与分布，不表示药效强弱或临床推荐。'
  },
  en:{
    'nav.home':'Home','nav.herbs':'Herb Atlas','nav.qiwei':'Qi · Wei','nav.formula':'Formula Network','nav.learn':'Learning Lab','nav.more':'More','nav.zheng':'Pattern Chain','nav.classics':'Classics','nav.food':'Food & Medicine','nav.culture':'Culture','nav.saved':'Local Herbarium',
    'search.placeholder':'Search herbs / formulas','search.empty':'No match. Try “ginseng” or a formula name.','theme.day':'Light','theme.night':'Night','lang.button':'中',
    'hero.tagline':'18,817 medicinal resources become stars. Start with one herb and explore properties, formulas, classics and daily life.','hero.explore':'Explore atlas','hero.network':'Open formula network','hero.hint':'Drag to rotate · Scroll to zoom · Select a star for a herb','home.journey':'From one herb into a living materia medica','home.journeyDesc':'Five steps connect recognition, properties, relationships and recall. Progress stays on this device.','home.start':'Start today’s lesson','home.discover':'Featured herbs','home.viewAll':'View the full atlas →','home.progress':'Today',
    'herb.imageCaption':'See the herb first','herb.imageDesc':'Plant form is the first clue to origin. Images support learning and are not a substitute for professional identification.','herb.visual':'Visual archive','herb.openCard':'Open knowledge card','herb.addCompare':'Add to compare','herb.compare':'Compare','herb.save':'Save','herb.saved':'Saved',
    'learn.next':'Next question →','learn.correct':'Correct!','learn.retry':'Not quite.','learn.total':'Correct','learn.done':'Completed','learn.right':'right','learn.today':'Today’s note','learn.method':'Study method','learn.footprint':'Your footprint',
    'data.note':'Charts show relationships and distributions in the representative dataset. They do not indicate efficacy or clinical recommendations.'
  }
};
let currentLang = localStorage.getItem('herbal_lang') || 'zh';
function t(key, fallback=''){ return (I18N[currentLang]&&I18N[currentLang][key]) || I18N.zh[key] || fallback || key; }
function applyLanguage(){
  document.documentElement.lang=currentLang==='en'?'en':'zh-CN';
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const value=t(el.dataset.i18n); if(value) el.textContent=value; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{ el.placeholder=t(el.dataset.i18nPlaceholder); });
  const lang=document.getElementById('languageToggle'); if(lang) lang.textContent=t('lang.button');
  const title=document.querySelector('title'); if(title) title.textContent=currentLang==='en'?'Herbal Cosmos · A visual materia medica':'本草宇宙 · HERBAL COSMOS';
  const routeTitles={home:['本草宇宙','Herbal Cosmos'],learn:['本草学习舱','Learning Lab'],saved:['本机收藏','Local Herbarium'],herbs:['药材星图','Herb Atlas'],herb:['药材知识卡','Herb Knowledge Card'],qiwei:['性味归经图谱','Qi · Wei · Meridian Atlas'],formula:['方剂配伍网络','Formula Network'],zheng:['病证 · 方剂 · 药材','Pattern · Formula · Herb'],food:['药食同源','Food & Medicine'],culture:['文化与非遗','Culture & Heritage']};
  document.querySelectorAll('.page h1.title').forEach(el=>{const route=el.closest('.page')?.dataset.route;const pair=routeTitles[route];if(pair)el.textContent=currentLang==='en'?pair[1]:pair[0];});
  const intros={herbs:['先用精品知识卡深入理解，再切换全量名称索引扩大检索范围。只有精品层进入性味归经图表与详情联动。','Start with complete knowledge cards, then switch to the full name index for wider discovery. Only the curated layer powers properties, charts and detail links.'],qiwei:['四气、五味与归经是中药药性的骨架，两个视角读同一套药性数据。','Qi, wei and meridian form the skeleton of materia medica. Read the same dataset through two visual lenses.'],formula:['方剂与药材构成二部图：点一个方剂，看它的组成与君臣佐使；点一味药，看它进入哪些方剂。','Formulas and herbs form a bipartite graph. Select a formula to inspect its composition, or a herb to trace its relationships.'],learn:['把漫游变成可积累的学习：先看知识卡，再用小测检验记忆。每次答题都会留下学习足迹。','Turn browsing into practice: study a knowledge card, test your recall and keep a local learning footprint.']};
  Object.entries(intros).forEach(([route,pair])=>{const page=document.querySelector(`.page[data-route="${route}"] .page-intro`);if(page)page.textContent=currentLang==='en'?pair[1]:pair[0];});
  updateThemeControl();
}
function updateThemeControl(){
  const button=document.getElementById('themeToggle'); if(!button) return;
  const night=document.body.classList.contains('night');
  button.setAttribute('aria-label',night?(currentLang==='en'?'Switch to light mode':'切换日间模式'):(currentLang==='en'?'Switch to night mode':'切换夜读模式'));
  const label=button.querySelector('[data-theme-label]'); if(label) label.textContent=night?t('theme.day'):t('theme.night');
}
function notify(){ store.listeners.forEach(fn=>{ try{fn();}catch(e){} }); }

/* ============================================================
   图表实例管理器：路由切换时主动销毁旧实例与 ResizeObserver，防内存泄漏
   ============================================================ */
const chartManager = {
  _instances: new Map(),
  _observers: new Map(),
  register(id, instance, el) {
    this.dispose(id);
    if(!instance) return null;
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

/* ECharts 全局守卫：CDN 加载失败时给图表区降级文案，页面主体不受影响 */
if(typeof echarts === 'undefined'){
  document.querySelectorAll('.chart-box, #zhengSankey, #formulaGraph').forEach(el=>{
    el.innerHTML = '<div style="padding:26px;text-align:center;color:var(--ink-2);font-size:13.5px;line-height:1.8;">图表组件未能加载（可能网络受限）。<br>页面其余内容不受影响，请检查网络后刷新。</div>';
  });
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
function getFavs(){ try{ return JSON.parse(localStorage.getItem(favKey)||'[]'); }catch(e){ return []; } }
function toggleFav(id){
  let f = getFavs();
  if(f.includes(id)) f = f.filter(x=>x!==id); else f.push(id);
  localStorage.setItem(favKey, JSON.stringify(f));
  if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:favorites',{detail:{ids:f}}));
  renderFavButtons(); toast(f.includes(id) ? '已收藏' : '已取消收藏');
}
function isFav(id){ return getFavs().includes(id); }
function toast(msg){
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 1600);
}

/* ============================================================
   工具函数
   ============================================================ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId = id => HERBS.find(h=>h.id===id) || null;
const byName = name => HERBS.find(h=>h.name===name) || null;
const formulaById = id => FORMULAS.find(f=>f.id===id) || null;
const zhengById = id => ZHENGS.find(z=>z.id===id) || null;
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
function herbName(herbId){ const h=byId(herbId); return h?h.name:herbId; }
function sourceBadge(h){
  const s = SOURCE_MAP[h.source] || SOURCE_MAP.census;
  return `<span class="badge ${s.badge}">数据来源：${s.label}</span>` + (h.food ? ` <span class="badge cinnabar">药食同源</span>` : '');
}
function stampHtml(h, sizeCls){
  const short = h.name.replace('子','').replace('仁','').slice(0,2);
  return `<span class="stamp ${sizeCls||''}"><span class="a">${esc(short)}</span><span class="b">${esc(h.qi)}·${esc(h.wei)}</span></span>`;
}

/* ============================================================
   Hash 路由
   ============================================================ */
const routes = ['home','herbs','herb','qiwei','formula','zheng','food','culture','learn','saved'];
function parseHash(){
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, queryStr] = raw.split('?');
  const params = {};
  if(queryStr){ queryStr.split('&').forEach(kv=>{ const [k,v]=kv.split('='); params[k]=decodeURIComponent(v||''); }); }
  const route = routes.includes(path) ? path : 'home';
  if(path==='classics') params.focus='classics';
  return { route, params };
}
function render(){
  const { route, params } = parseHash();
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active', p.dataset.route===route));
  document.querySelectorAll('[data-route-link]').forEach(a=>{
    a.classList.toggle('active', a.dataset.routeLink===route);
  });
  document.getElementById('mainNav').classList.remove('open');
  const more=document.getElementById('navMore'); if(more) more.removeAttribute('open');
  if(typeof closeSearch==='function') closeSearch();
  window.scrollTo(0,0);
  if(route==='herbs'){
    if(params.mode==='catalog') store._atlasMode='catalog';
    if(params.q!=null){ store._catalogKw=params.q; store._catalogPage=1; }
  }
  const views = { home:renderHome, herbs:renderHerbs, herb:()=>renderHerb(params.id), qiwei:renderQiwei,
    formula:renderFormula, zheng:renderZheng, food:renderFood, culture:renderCulture, learn:renderLearn, saved:renderSaved };
  try{ (views[route]||views.home)(); }catch(err){ console.error('[herbal-cosmos] render error:', err); }
  applyLanguage();
  if(route==='home' && params.focus==='classics') setTimeout(()=>document.getElementById('home-classics')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}
  window.render = render;
  window.addEventListener('hashchange', render);

/* ============================================================
   首页：3D 星云（Canvas 粒子引擎）
   ============================================================ */
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

  function resize(){
    DPR = Math.min(window.devicePixelRatio||1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W*DPR; canvas.height = H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function buildStars(){
    stars = HERBS.map((h,i)=>{
      // 球面分布 + 星等
      const phi = Math.acos(1 - 2*(i+0.5)/HERBS.length);
      const theta = i * Math.PI * (3 - Math.sqrt(5)); // 黄金角
      const r = 210;
      return {
        id:h.id, name:h.name, herb:h,
        x:r*Math.sin(phi)*Math.cos(theta), y:r*Math.cos(phi), z:r*Math.sin(phi)*Math.sin(theta),
        size: isFav(h.id) ? 6.2 : 4.6, color: h.food ? '#E8C87E' : '#D8C9A8'
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
    return { sx: W/2 + xr*scale*persp, sy: H/2 + y*scale*persp, persp, zr };
  }

  function frame(){
    if(!running) return;
    ctx.clearRect(0,0,W,H);
    rotY += (targetRotY - rotY)*0.06;
    scale += (targetScale - scale)*0.08;

    // 星尘
    for(const d of dust){
      const p = project(d.x, d.y, d.z);
      if(p.zr > 300) continue;
      const tw = 0.6 + 0.4*Math.sin(d.tw + performance.now()*0.001);
      ctx.globalAlpha = d.a*tw*Math.min(1, p.persp);
      ctx.fillStyle = '#BFD4DC';
      ctx.beginPath(); ctx.arc(p.sx, p.sy, d.s*p.persp, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 精品星
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
      const showLabel = (hoverId===st.id) || (sz > 2.6) || (st.herb && st.herb.food && sz > 1.7) || (scale > 1.15 && sz > 2.0);
      if(showLabel){
        ctx.fillStyle = hoverId===st.id ? '#F3D9A0' : 'rgba(232,224,207,.82)';
        ctx.font = hoverId===st.id ? '600 12px "Noto Sans SC",sans-serif' : '400 11px "Noto Sans SC",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.name, p.sx, p.sy - sz*3.6);
      }
    }
    requestAnimationFrame(frame);
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

  // 交互
  canvas.addEventListener('pointerdown', e=>{ dragging=true; lastX=e.clientX; lastY=e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e=>{
    if(dragging){
      targetRotY += (e.clientX-lastX)*0.006;
      lastX=e.clientX; lastY=e.clientY;
    } else {
      const rect = canvas.getBoundingClientRect();
      const h = hitTest(e.clientX-rect.left, e.clientY-rect.top);
      hoverId = h?h.id:null;
      canvas.style.cursor = h?'pointer':'grab';
    }
  });
  canvas.addEventListener('pointerup', e=>{ dragging=false; });
  canvas.addEventListener('click', e=>{
    const rect = canvas.getBoundingClientRect();
    const h = hitTest(e.clientX-rect.left, e.clientY-rect.top);
    if(h) { setSelected(h.id); location.hash = '#/herb?id='+h.id; }
  });
  canvas.addEventListener('wheel', e=>{
    const next = targetScale - e.deltaY*0.001;
    if(next >= 0.5 && next <= 1.8){
      e.preventDefault(); // 仅在缩放有效区间内接管滚轮；到达边界时放行，页面可正常滚动
      targetScale = next;
    }
  }, {passive:false});
  // 自动慢转
  setInterval(()=>{ if(!dragging){ targetRotY += 0.0009; } }, 30);

  const ro = new ResizeObserver(()=>{ resize(); });
  ro.observe(canvas);
  resize(); buildStars(); frame();
})();

/* ============================================================
   视图渲染
   ============================================================ */
function renderHomeMuseum(){
  const countBy = key => Object.entries(HERBS.reduce((acc,item)=>{acc[item[key]]=(acc[item[key]]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]);
  const kpis=[
    ['18,817','资源星辰','全国中药资源普查','总量口径'],
    [HERBS.length.toLocaleString('zh-CN'),'精品知识卡','四气 · 五味 · 归经 · 功效','可深度联动'],
    [HERB_CATALOG.length.toLocaleString('zh-CN'),'名称索引','公开名称与古典文本','可搜索分页'],
    [FORMULAS.length.toLocaleString('zh-CN'),'关系网络方剂','配伍与证候链路','可点击追踪']
  ];
  const kpiEl=$('#homeKpis');
  if(kpiEl) kpiEl.innerHTML=kpis.map(item=>`<div class="home-kpi"><div><strong>${item[0]}</strong><span>${item[1]}</span></div><em>${item[2]}<br>${item[3]}</em></div>`).join('');
  const palette=['#D0A24C','#8FC1A8','#B84B3E','#7C9DB3','#C48B62','#9D86AF','#6B9E8A','#D49A5B'];
  const categories=countBy('cat').slice(0,8);
  const catEl=$('#homeCategories');
  if(catEl) catEl.innerHTML=categories.map(([name,count],i)=>`<button type="button" class="home-category" data-home-category="${esc(name)}" style="--cat-color:${palette[i%palette.length]}"><b>${esc(name.replace(/药$/,''))}</b><span>${count} 味精品卡 · 查看 →</span></button>`).join('');
  catEl?.querySelectorAll('[data-home-category]').forEach(btn=>btn.addEventListener('click',()=>{store.filters={qi:'',wei:'',cat:btn.dataset.homeCategory};store._kw='';location.hash='#/herbs';}));
}
function renderHome(){
  // 精选本草
  const picks = ['gouqi','renshen','danggui','fuling','jinyinhua','suanzaoren'];
  const featured = picks.slice(0,6).map(byId).filter(Boolean);
  $('#homeFeatured').innerHTML = featured.map(h=>`
    <a class="card card-pad featured-herb" href="#/herb?id=${h.id}">
      <div class="image-frame"><img src="${h.image}" alt="${esc(h.name)} · ${esc(h.imageAlt)}" loading="lazy"></div>
      <div><div class="n">${esc(h.name)}</div><div class="d">${esc(h.qi)} · ${esc(h.wei)} · 归${esc(h.meridian.join('、'))}经</div></div>
    </a>`).join('');
  const catalogCount = $('#homeCatalogCount');
  if(catalogCount) catalogCount.textContent = HERB_CATALOG.length.toLocaleString('zh-CN');
  renderHomeMuseum();
  renderHomeClassics();
  updateHomeProgress();
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
  const featuredCount=$('#featuredAtlasCount'); if(featuredCount) featuredCount.textContent=HERBS.length;
  const catalogCount=$('#catalogAtlasCount'); if(catalogCount) catalogCount.textContent=HERB_CATALOG.length.toLocaleString('zh-CN');
  if(mode==='catalog'){ renderCatalog(); return; }
  const f = store.filters;
  // 筛选芯片
  const qis = [...new Set(HERBS.map(h=>h.qi))];
  const weis = [...new Set(HERBS.map(h=>h.wei))];
  const cats = [...new Set(HERBS.map(h=>h.cat))];
  $('#qiFilter').innerHTML = chipSet(qis, f.qi, 'qi');
  $('#weiFilter').innerHTML = chipSet(weis, f.wei, 'wei');
  $('#catFilter').innerHTML = chipSet(cats, f.cat, 'cat');

  const kw = (store._kw||'').toLowerCase();
  let list = HERBS.filter(h=>{
    if(f.qi && h.qi!==f.qi) return false;
    if(f.wei && h.wei!==f.wei) return false;
    if(f.cat && h.cat!==f.cat) return false;
    if(kw && !(h.name.toLowerCase().includes(kw)||h.pinyin.includes(kw)||h.eff.includes(kw))) return false;
    return true;
  });
  const count = $('#herbResultCount');
  if(count) count.textContent = `${list.length} 味药材${kw ? ` · 搜索“${kw}”` : ''}`;
  $('#herbTableBody').innerHTML = list.map(h=>`
    <tr class="hoverable" onclick="location.hash='#/herb?id=${h.id}'">
      <td class="rowname"><div style="display:flex;align-items:center;gap:10px;"><img class="herb-thumb" src="${h.image}" alt="${esc(h.imageAlt)}" loading="lazy"><span>${esc(h.name)}</span></div></td>
      <td>${esc(h.qi)}</td>
      <td>${esc(h.wei)}</td>
      <td>${esc(h.meridian.join('、'))}经</td>
      <td>${esc(h.eff)}</td>
      <td>${sourceBadge(h)}</td>
      <td><button class="compare-btn ${store.compareHerbs.includes(h.id)?'on':''}" data-compare="${h.id}" type="button">${store.compareHerbs.includes(h.id)?'已加入':'对比'}</button> <button class="fav-btn ${isFav(h.id)?'on':''}" data-fav="${h.id}" onclick="event.stopPropagation();toggleFav('${h.id}')">${isFav(h.id)?'已收藏':'收藏'}</button></td>
    </tr>`).join('') || `<tr><td colspan="7" class="empty">没有匹配的药材，换个筛选试试。</td></tr>`;
  const mobile = $('#herbMobileGrid');
  if(mobile) mobile.innerHTML = list.map(h=>`
    <article class="herb-mobile-card">
      <div class="top"><img class="herb-thumb" src="${h.image}" alt="${esc(h.name)} · ${esc(h.imageAlt)}" loading="lazy"><div><h3>${esc(h.name)}</h3><div class="muted">${esc(h.qi)} · ${esc(h.wei)} · 归${esc(h.meridian.join('、'))}经</div></div></div>
      <p>${esc(h.eff)}</p><div>${sourceBadge(h)}</div>
      <div class="herb-mobile-actions"><a href="#/herb?id=${h.id}">查看知识卡</a><button type="button" class="compare-btn ${store.compareHerbs.includes(h.id)?'on':''}" data-compare="${h.id}">${store.compareHerbs.includes(h.id)?'已加入':'加入对比'}</button><button type="button" class="fav-btn ${isFav(h.id)?'on':''}" data-fav="${h.id}">${isFav(h.id)?'已收藏':'收藏'}</button></div>
    </article>`).join('') || '<div class="empty">没有匹配的药材，换个筛选试试。</div>';
  renderCompareTray();
}

function renderCatalog(){
  const input=$('#catalogSearch');
  if(input && input.value!==store._catalogKw) input.value=store._catalogKw||'';
  const sourceSelect=$('#catalogSource');
  const sources=[...new Set(HERB_CATALOG.map(item=>item.source))];
  if(sourceSelect){
    sourceSelect.innerHTML='<option value="">全部来源</option>'+sources.map(source=>`<option value="${esc(source)}">${esc(source.split(' · ')[0])}</option>`).join('');
    sourceSelect.value=store._catalogSource||'';
  }
  const kw=(store._catalogKw||'').trim().toLowerCase();
  const rows=HERB_CATALOG.filter(item=>{
    if(store._catalogSource && item.source!==store._catalogSource) return false;
    return !kw || item.name.toLowerCase().includes(kw);
  });
  const pageSize=48;
  const pageCount=Math.max(1,Math.ceil(rows.length/pageSize));
  store._catalogPage=Math.min(Math.max(1,store._catalogPage||1),pageCount);
  const pageRows=rows.slice((store._catalogPage-1)*pageSize,store._catalogPage*pageSize);
  const visible=$('#catalogVisibleCount'); if(visible) visible.textContent=rows.length.toLocaleString('zh-CN');
  const body=$('#catalogTableBody');
  if(body) body.innerHTML=pageRows.map(item=>`<tr><td><strong>${esc(item.name)}</strong></td><td><span class="catalog-source">${esc(item.source)}</span></td><td><span class="badge outline">仅名称索引</span></td><td><button type="button" class="catalog-open" data-catalog-name="${esc(item.name)}">在精品层查找</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">没有匹配名称，试试换个关键词。</td></tr>';
  const pagination=$('#catalogPagination');
  if(pagination){
    const windowStart=Math.max(1,Math.min(store._catalogPage-2,pageCount-4));
    const windowEnd=Math.min(pageCount,windowStart+4);
    pagination.innerHTML=`<button type="button" data-catalog-page="${Math.max(1,store._catalogPage-1)}" ${store._catalogPage===1?'disabled':''}>上一页</button><span>第 ${store._catalogPage} / ${pageCount} 页 · ${rows.length.toLocaleString('zh-CN')} 条</span>${Array.from({length:windowEnd-windowStart+1},(_,i)=>windowStart+i).map(page=>`<button type="button" class="${page===store._catalogPage?'on':''}" data-catalog-page="${page}">${page}</button>`).join('')}<button type="button" data-catalog-page="${Math.min(pageCount,store._catalogPage+1)}" ${store._catalogPage===pageCount?'disabled':''}>下一页</button>`;
  }
}
document.addEventListener('click', e=>{
  const mode=e.target.closest('[data-atlas-mode]');
  if(mode){ store._atlasMode=mode.dataset.atlasMode; store._catalogPage=1; renderHerbs(); return; }
  const page=e.target.closest('[data-catalog-page]');
  if(page){ store._catalogPage=Number(page.dataset.catalogPage)||1; renderCatalog(); return; }
  const open=e.target.closest('[data-catalog-name]');
  if(open){
    const match=HERBS.find(h=>h.name===open.dataset.catalogName);
    if(match) location.hash='#/herb?id='+match.id;
    else { store._atlasMode='featured'; store._kw=open.dataset.catalogName; location.hash='#/herbs'; toast('精品层暂未收录完整知识卡'); }
  }
});
document.addEventListener('input', e=>{
  if(e.target.id==='catalogSearch'){ store._catalogKw=e.target.value; store._catalogPage=1; if(parseHash().route==='herbs' && store._atlasMode==='catalog') renderCatalog(); }
});
document.addEventListener('change', e=>{
  if(e.target.id==='catalogSource'){ store._catalogSource=e.target.value; store._catalogPage=1; if(parseHash().route==='herbs' && store._atlasMode==='catalog') renderCatalog(); }
});
function renderCompareTray(){
  const tray=$('#compareTray'), open=$('#openCompare');
  if(!tray) return;
  if(!store.compareHerbs.length) tray.innerHTML='选择 2-3 味药材进行属性对比';
  else tray.innerHTML=store.compareHerbs.map(id=>{const h=byId(id);return h?`<button class="compare-tag" type="button" data-compare-remove="${h.id}">${esc(h.name)} ×</button>`:''}).join('') + (store.compareHerbs.length<3?'<span class="muted">还可选择</span>':'');
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
  if(!el || herbs.length<2 || typeof echarts==='undefined') return;
  const p=chartPalette();
  const qiScore={'大寒':1,'寒':2,'微寒':3,'凉':4,'平':5,'微温':6,'温':7,'热':8,'大热':9};
  const weiScore={'酸':1,'苦':2,'甘':3,'辛':4,'咸':5};
  const indicator=[{name:'四气位置',max:9},{name:'五味位置',max:5},{name:'归经数量',max:6},{name:'药食属性',max:1},{name:'配伍关系',max:8}];
  const formulaCounts=Object.fromEntries(herbs.map(h=>[h.id,FORMULAS.filter(f=>f.herbs.some(x=>x[0]===h.id)).length]));
  const values=herbs.map(h=>({name:h.name,value:[qiScore[h.qi]||5,weiScore[h.wei]||3,Math.min(h.meridian.length,6),h.food?1:0,Math.min(formulaCounts[h.id]||0,8)]}));
  const chart=chartManager.register('herbCompare',echarts.init(el),el);
  chart.setOption({backgroundColor:'transparent',tooltip:{trigger:'item',confine:true,backgroundColor:p.card,textStyle:{color:p.text,fontSize:12}},legend:{bottom:0,textStyle:{color:p.muted}},radar:{radius:'66%',indicator,axisName:{color:p.muted,fontSize:11},splitLine:{lineStyle:{color:p.line}},splitArea:{areaStyle:{color:['rgba(113,158,135,.04)','rgba(113,158,135,.1)']}},axisLine:{lineStyle:{color:p.line}}},series:[{type:'radar',data:values,symbolSize:6,lineStyle:{width:2},areaStyle:{opacity:.1},color:[p.celadon,p.cinnabar,p.jin]}]});
}
function chipSet(vals, cur, key){
  return `<button class="filter-chip ${cur===''?'on':''}" data-chip="${key}|" >全部</button>` +
    vals.map(v=>`<button class="filter-chip ${cur===v?'on':''}" data-chip="${key}|${esc(v)}" >${esc(v)}</button>`).join('');
}
document.addEventListener('click', e=>{
  const chip = e.target.closest('[data-chip]');
  if(chip){
    const [k,v] = chip.dataset.chip.split('|');
    store.filters[k] = v;
    renderHerbs();
  }
  const compare=e.target.closest('[data-compare]');
  if(compare){ e.preventDefault(); e.stopPropagation(); toggleCompareHerb(compare.dataset.compare); return; }
  const remove=e.target.closest('[data-compare-remove]');
  if(remove){ toggleCompareHerb(remove.dataset.compareRemove); return; }
  const fav=e.target.closest('[data-fav]');
  if(fav && !fav.getAttribute('onclick')){ e.preventDefault(); e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
  if(e.target.id==='openCompare'){
    const panel=$('#comparePanel'); if(panel){ panel.hidden=false; renderCompareChart(); panel.scrollIntoView({behavior:'smooth',block:'start'}); }
  }
  if(e.target.id==='closeCompare'){ const panel=$('#comparePanel'); if(panel) panel.hidden=true; }
});
document.getElementById('resetFilters').addEventListener('click', ()=>{
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
  setSelected(h.id);
  $('#herbCrumb').innerHTML = `<a href="#/herbs">药材星图</a> / <span>${esc(h.name)}</span>`;
  $('#herbDetailHead').innerHTML = `
    <div class="detail-visual"><div class="image-frame"><img src="${h.image}" alt="${esc(h.name)} · ${esc(h.imageAlt)}"></div><div class="visual-caption"><span class="eyebrow">${esc(t('herb.visual'))}</span><h2>${esc(t('herb.imageCaption'))}</h2><p>${esc(t('herb.imageDesc'))}</p><div class="signal-row"><span>${esc(h.cat)}</span><span>${esc(h.qi)} · ${esc(h.wei)}</span><span>${esc(h.meridian.length)} 经络</span></div></div></div>
    <div class="detail-title">
      <h1>${esc(h.name)}</h1>
      <div class="latin">${esc(h.latin)}</div>
      <div class="source-line">${sourceBadge(h)} <span class="badge outline">${esc(h.cat)}</span>
        <button class="fav-btn ${isFav(h.id)?'on':''}" data-fav="${h.id}" onclick="toggleFav('${h.id}')">${isFav(h.id)?'已收藏':'收藏'}</button>
      </div>
    </div>`;
  $('#herbProps').innerHTML = `
    <div class="prop"><div class="k">四气</div><div class="v">${esc(h.qi)}</div><div class="src">药典记载</div></div>
    <div class="prop"><div class="k">五味</div><div class="v">${esc(h.wei)}</div><div class="src">药典记载</div></div>
    <div class="prop"><div class="k">归经</div><div class="v">${esc(h.meridian.join('、'))}</div><div class="src">药典记载</div></div>
    <div class="prop"><div class="k">功效</div><div class="v" style="font-size:14px;">${esc(h.eff)}</div></div>
    <div class="prop" style="grid-column:1/-1;"><div class="k">本草小记</div><div class="v" style="font-size:13.5px;font-weight:400;font-family:var(--sans);">${esc(h.note)}</div></div>`;

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
      data:[[pos[h.wei], pos[h.qi]]],
      symbolSize:26,
      itemStyle:{color:p.cinnabar},
      label:{show:true, formatter:h.name, position:'top', color:p.text, fontSize:12, fontFamily:'Noto Serif SC'}
    }]
  });

  // 相关方剂
  const rel = FORMULAS.filter(f=>f.herbs.some(x=>x[0]===h.id));
  $('#herbFormulaList').innerHTML = rel.length ? rel.map(f=>`
    <div class="formula-row" style="cursor:pointer;" onclick="location.hash='#/formula?f=${f.id}'">
      <div class="fn">${esc(f.name)}</div>
      <div class="fz">${esc(f.from)} · ${esc(f.eff)}</div>
      <span style="margin-left:auto;" class="muted">组成含 ${esc(herbName(h.id))}</span>
    </div>`).join('') : `<div class="muted">暂无收录的相关方剂。</div>`;
}

function renderQiwei(){
  if(typeof echarts === 'undefined'){ return; }
  const p=chartPalette();
  const categorySelect=$('#qiweiCatFilter');
  const categories=[...new Set(HERBS.map(h=>h.cat))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  if(categorySelect){ categorySelect.innerHTML='<option value="">全部类别</option>'+categories.map(cat=>`<option value="${esc(cat)}">${esc(cat)}</option>`).join(''); categorySelect.value=store._qiweiCat||''; if(categorySelect.dataset.bound!=='1'){ categorySelect.addEventListener('change',()=>{ store._qiweiCat=categorySelect.value; renderQiwei(); }); categorySelect.dataset.bound='1'; } }
  const active=store._qiweiCat||'';
  const herbs=active?HERBS.filter(h=>h.cat===active):HERBS;
  const catCount=$('#qiweiCategoryCount'); if(catCount) catCount.textContent=new Set(herbs.map(h=>h.cat)).size;
  const sampleCount=$('#qiweiSampleCount'); if(sampleCount) sampleCount.textContent=herbs.length;
  const meridianCount=$('#qiweiMeridianCount'); if(meridianCount) meridianCount.textContent=new Set(herbs.flatMap(h=>h.meridian)).size;
  const qis=['大寒','寒','微寒','凉','平','微温','温','热','大热'];
  const weis=['酸','苦','甘','辛','咸'];
  const qiPos={}, weiPos={};
  qis.forEach((q,i)=>qiPos[q]=i); weis.forEach((w,i)=>weiPos[w]=i);
  const mat = [];
  herbs.forEach(h=>{
    const q=qiPos[h.qi], w=weiPos[h.wei];
    if(q==null||w==null) return;
    const cell = mat.find(m=>m[0]===q&&m[1]===w);
    if(cell) cell[2]++; else mat.push([q,w,1]);
  });
  const mChart = chartManager.register('qiweiMatrix', echarts.init(document.getElementById('qiweiMatrixChart')), document.getElementById('qiweiMatrixChart'));
  mChart.setOption({
    backgroundColor:'transparent',
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:item=>`${weis[item.value[1]]} · ${qis[item.value[0]]}<br/>代表药材 <b>${item.value[2]}</b> 味`},
    grid:{left:54,right:16,top:14,bottom:40},
    xAxis:{type:'category', data:weis, name:'五味', nameLocation:'middle', nameGap:26, nameTextStyle:{color:p.muted,fontSize:11}, axisLabel:{color:p.muted,fontSize:11}},
    yAxis:{type:'category', data:qis, name:'四气', nameLocation:'middle', nameGap:38, nameTextStyle:{color:p.muted,fontSize:11}, axisLabel:{color:p.muted,fontSize:11}},
    visualMap:{min:0,max:Math.max(5,...mat.map(m=>m[2])),calculable:false,orient:'horizontal',left:'center',bottom:0,textStyle:{color:p.muted,fontSize:10},inRange:{color:['#E8F0EB',p.jin,p.cha||'#A96032']}},
    series:[{type:'heatmap', data:mat, itemStyle:{borderColor:p.card,borderWidth:2}, label:{show:true, formatter:item=>item.value[2]||'', color:p.text,fontSize:11}}]
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
  const weiData=weiOrder.map(w=>({name:w+'味', value:herbs.filter(h=>h.wei.includes(w)).length}));
  const wb=chartManager.register('weiBar', echarts.init(document.getElementById('weiBarChart')), document.getElementById('weiBarChart'));
  wb.setOption({
    backgroundColor:'transparent',
    tooltip:{trigger:'axis', confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}},
    grid:{left:40,right:16,top:14,bottom:34},
    xAxis:{type:'category', data:weiData.map(d=>d.name), axisLabel:{color:p.muted,fontSize:11}, axisLine:{lineStyle:{color:p.line}}},
    yAxis:{type:'value', minInterval:1, axisLabel:{color:p.muted,fontSize:11}, splitLine:{lineStyle:{color:p.line}}},
    series:[{type:'bar', data:weiData.map(d=>d.value), barWidth:'52%', itemStyle:{color:p.jin,borderRadius:[5,5,0,0]}, label:{show:true,position:'top',color:p.text,fontSize:11}}]
  });
  wb.on('click', params=>{ const w=weiOrder[params.dataIndex]; const list=herbs.filter(h=>h.wei.includes(w)); showInspector(w+'味', w+'味的代表药材', list); });

  const pairs=new Map();
  herbs.forEach(h=>h.meridian.forEach(mer=>{
    herbs.filter(other=>other!==h&&other.meridian.includes(mer)).forEach(other=>{
      const key=[h.id,other.id].sort().join('|'); pairs.set(key,(pairs.get(key)||0)+1);
    });
  }));
  const topPairs=[...pairs.entries()].sort((a,b)=>b[1]-a[1]).slice(0,18);
  const flowNodes=[...new Set(topPairs.flatMap(([key])=>key.split('|')))].map(id=>({id,name:herbName(id),symbolSize:Math.min(30,12+(pairs.get(topPairs.find(([key])=>key.includes(id))?.[0])||1)*2),itemStyle:{color:p.celadon}}));
  const flowLinks=topPairs.map(([key,value])=>{const [source,target]=key.split('|');return {source,target,value,lineStyle:{width:Math.min(6,1+value/2),opacity:.38}};});
  const flow=chartManager.register('qiweiFlow', echarts.init(document.getElementById('qiweiFlowChart')), document.getElementById('qiweiFlowChart'));
  flow.setOption({backgroundColor:'transparent',tooltip:{confine:true,backgroundColor:p.card,textStyle:{color:p.text,fontSize:12},formatter:item=>item.dataType==='edge'?`${item.data.source} · ${item.data.target}<br/>共同归经 ${item.data.value} 个`:item.data.name},series:[{type:'graph',layout:'force',roam:true,draggable:true,data:flowNodes,links:flowLinks,force:{repulsion:180,edgeLength:[50,110],gravity:.12},label:{show:true,color:p.text,fontSize:11},lineStyle:{color:p.celadon,curveness:.16}}]});

  const inspector=$('#qiweiInspector');
  const showInspector=(title,desc,items)=>{
    if(!inspector) return;
    inspector.classList.add('has-selection');
    inspector.innerHTML=`<div><span>INSPECTOR · ${esc(title)}</span><h2>${esc(desc)}</h2></div><div><p>当前组合共 ${items.length} 味代表药材，点击药材名称可进入知识卡。</p><div class="inspector-herbs">${items.length?items.slice(0,28).map(h=>`<a href="#/herb?id=${h.id}"><img src="${h.image}" alt=""><span>${esc(h.name)} <small>${esc(h.qi)}·${esc(h.wei)}</small></span></a>`).join(''):'<span class="muted">暂无匹配药材</span>'}</div></div>`;
  };
  mChart.on('click', params=>{
    if(!params.value || params.value.length<3) return;
    const q=params.value[0], w=params.value[1];
    showInspector(`${qis[q]} · ${weis[w]}`,`${qis[q]} · ${weis[w]} 的药材`,herbs.filter(h=>h.qi===qis[q]&&h.wei.includes(weis[w])));
  });
  bChart.on('click', params=>{
    const idx=typeof params.dataIndex==='number'?params.dataIndex:-1;
    if(idx<0) return;
    const mer=counts[idx]?.name.replace('经','');
    if(mer) showInspector(`${mer}归经`,`归入${mer}经的药材`,herbs.filter(h=>h.meridian.includes(mer)));
  });
  flow.on('click', params=>{if(params.dataType==='node'){const herb=byName(params.data.name);if(herb)showInspector(herb.name,`${herb.name} · ${herb.qi} · ${herb.wei}`,[herb]);}});
}

function renderFormula(){
  if(typeof echarts === 'undefined'){ return; }
  const q = parseHash().params;
  const focusId = store._formulaFocus || q.f || '';
  const visibleFormulas = focusId ? FORMULAS.filter(f=>f.id===focusId) : FORMULAS;
  // 力导向二部图
  const herbNodes = visibleFormulas.flatMap(f=>f.herbs.map(x=>x[0])).filter((v,i,a)=>a.indexOf(v)===i);
  const palette=chartPalette();
  const nodes = visibleFormulas.map(f=>({id:'f_'+f.id, name:f.name, category:0, symbolSize:24, itemStyle:{color:palette.qing}}))
    .concat(herbNodes.map(hid=>({id:'h_'+hid, name:herbName(hid), category:1, symbolSize:14, itemStyle:{color:palette.jin}})));
  const links = [];
  visibleFormulas.forEach(f=>f.herbs.forEach(x=>{ if(x[0]) links.push({source:'f_'+f.id, target:'h_'+x[0], value:1}); }));
  const p=palette;
  const gChart = chartManager.register('formulaGraph', echarts.init(document.getElementById('formulaGraph')), document.getElementById('formulaGraph'));
  gChart.setOption({
    backgroundColor:'transparent',
    tooltip:{confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:item=>{
      if(item.dataType==='edge') return `${item.data.sourceName||''} ⇄ ${item.data.targetName||''}`;
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
  const focusSelect=$('#formulaFocus'); if(focusSelect){focusSelect.innerHTML='<option value="">全部方剂</option>'+FORMULAS.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('');focusSelect.value=focusId;}
  const stat=$('#networkStats'); if(stat) stat.textContent=`${visibleFormulas.length} 首方剂 · ${herbNodes.length} 味药材 · ${links.length} 条关系`;
  const note=$('#networkFocusNote'); if(note) note.textContent=focusId?`当前聚焦：${formulaById(focusId)?.name||''}。网络仅显示与其直接相连的药材，点击“显示全网”恢复。`:'提示：点击网络节点可快速查看方剂详情，点击药材节点可进入知识卡。';
  const index=$('#formulaIndex');
  if(index) index.innerHTML=FORMULAS.map(f=>`<button type="button" class="${f.id===focusId?'active':''}" data-formula-index="${f.id}"><span>${esc(f.name)}</span><small>${f.herbs.length}味</small></button>`).join('');
  const inspector=$('#formulaInspector');
  const showFormula=(f)=>{
    if(!inspector||!f) return;
    store.selectedFormula=f.id;
    inspector.innerHTML=`<span>关系检查器 · 方剂</span><h2>${esc(f.name)}</h2><div class="inspector-source"><b>来源</b> ${esc(f.from)}<br><b>主治</b> ${esc(f.zheng)}<br><b>功效</b> ${esc(f.eff)}</div><div class="workspace-label">君臣佐使组成</div><div class="composition-list">${f.herbs.map(x=>`<div class="composition-row"><b>${esc(x[2])}</b><a href="#/herb?id=${x[0]}">${esc(herbName(x[0]))}</a><small>${esc(x[1]||'')}</small></div>`).join('')}</div>`;
  };
  const showHerb=(h)=>{
    if(!inspector||!h) return;
    const related=FORMULAS.filter(f=>f.herbs.some(x=>x[0]===h.id));
    inspector.innerHTML=`<span>关系检查器 · 药材</span><h2>${esc(h.name)}</h2><div class="inspector-source"><b>四气</b> ${esc(h.qi)}　<b>五味</b> ${esc(h.wei)}<br><b>归经</b> ${esc(h.meridian.join('、'))}经<br><b>功效</b> ${esc(h.eff)}</div><div class="workspace-label">进入方剂</div><div class="composition-list">${related.map(f=>`<div class="composition-row"><b>方</b><a href="#/formula?f=${f.id}">${esc(f.name)}</a><small>${esc(f.zheng)}</small></div>`).join('')||'<span class="muted">暂无收录方剂</span>'}</div>`;
  };
  if(focusId) showFormula(formulaById(focusId));
  else if(store.selectedFormula) showFormula(formulaById(store.selectedFormula));
  gChart.on('click', params=>{if(!params.data||!params.data.id)return;const id=params.data.id;if(id.startsWith('f_')){store._formulaFocus=id.slice(2);showFormula(formulaById(id.slice(2)));renderFormula();}else if(id.startsWith('h_')){showHerb(byId(id.slice(2)));}});
  document.querySelectorAll('[data-formula-index]').forEach(btn=>btn.onclick=()=>{store._formulaFocus=btn.dataset.formulaIndex; location.hash='#/formula?f='+btn.dataset.formulaIndex;});
  // 跨页联动：来自药材详情的"相关方剂"点击，高亮该方剂节点
  if(q.f){
      const fi = visibleFormulas.findIndex(x=>x.id===focusId);
    if(fi>=0){
      setTimeout(()=>{ try{ gChart.dispatchAction({type:'focusNodeAdjacency', seriesIndex:0, dataIndex:fi}); }catch(e){} }, 150);
    }
  }

  // 代表方剂卡片
  const featuredF = ['liuweidihuang','qijudihuangwan','sijunzitang','siwutang','guizhitang','mahuangtang','yinqiaosan','xiaoyaosan','guipitang','buzhongyiqitang','shenlingbaizhusan','xuefuzhuyutang','wendantang','lizhongwan','baihutang','xiaoqinglongtang','yupingfengsan','suanzaorentang','shiyaogancaotang'];
  const activeF = focusId || '';
  $('#formulaCards').innerHTML = featuredF.map(fid=>{
    const f = formulaById(fid); if(!f) return '';
    const comp = f.herbs.map(x=>`<span class="role-tag">${x[2]}</span>${esc(herbName(x[0]))}${x[1]?`<span class="muted"> ${x[1]}</span>`:''}`).join(' · ');
    return `<button type="button" class="card card-pad formula-card ${fid===activeF?'active':''}" data-formula-index="${fid}">
      <h3 style="font-family:var(--serif);color:var(--qing);">${esc(f.name)}${fid===activeF?'<span style="margin-left:8px;" class="badge cinnabar">定位</span>':''}</h3>
      <div class="muted" style="font-size:12px;">${esc(f.from)} · ${esc(f.eff)}</div>
      <p style="font-size:13px;margin-top:8px;">${comp}</p>
      ${f.note?`<div class="muted" style="font-size:11.5px;margin-top:6px;">${esc(f.note)}</div>`:''}
      <div style="margin-top:8px;"><span class="badge celadon">主治：${esc(f.zheng)}</span></div>
    </button>`;
  }).join('');
  document.querySelectorAll('#formulaCards [data-formula-index]').forEach(btn=>btn.onclick=()=>{store._formulaFocus=btn.dataset.formulaIndex;location.hash='#/formula?f='+btn.dataset.formulaIndex;});
}

function renderZheng(){
  if(typeof echarts === 'undefined'){ return; }
  const p=chartPalette();
  if(!store.selectedZheng) store.selectedZheng = ZHENGS[0].id;
  const cur = ZHENGS.find(z=>z.id===store.selectedZheng) || ZHENGS[0];
  const selectedFormulas=cur.formulas.map(formulaById).filter(Boolean);
  const coreIds=[];
  selectedFormulas.forEach(f=>f.herbs.slice(0,5).forEach(x=>{if(x[0]&&!coreIds.includes(x[0])) coreIds.push(x[0]);}));
  const links=[];
  selectedFormulas.forEach((fm,fi)=>{
    links.push({source:'pattern',target:'formula-'+fi,value:1});
    fm.herbs.slice(0,5).forEach(x=>{if(x[0]&&coreIds.includes(x[0]))links.push({source:'formula-'+fi,target:'herb-'+x[0],value:1});});
  });
  const nodes=[{id:'pattern',name:cur.name,x:90,y:215,fixed:true,symbolSize:34,itemStyle:{color:p.cinnabar}},...selectedFormulas.map((f,i)=>({id:'formula-'+i,name:f.name,x:280,y:80+i*150,fixed:true,symbolSize:26,itemStyle:{color:p.celadon}})),...coreIds.map((id,i)=>({id:'herb-'+id,name:herbName(id),x:500,y:36+i*58,fixed:true,symbolSize:16,itemStyle:{color:p.jin}}))];
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
  sChart.on('click', params=>{ const id=params.data&&params.data.id||''; if(id.startsWith('herb-')) location.hash='#/herb?id='+id.slice(5); });
  const title=$('#zhengFocusTitle'); if(title) title.textContent=cur.name;
  const desc=$('#zhengFocusDesc'); if(desc) desc.textContent=`${cur.desc} · 当前展示 ${selectedFormulas.length} 首方剂与 ${coreIds.length} 味核心药材`;
  const count=$('#zhengFocusCount'); if(count) count.textContent=`${selectedFormulas.length} 方 · ${coreIds.length} 味药`;
  const evidence=$('#zhengEvidence');
  if(evidence) evidence.innerHTML=`<span>证据检查器 · 当前证候</span><h2>${esc(cur.name)}</h2><p>${esc(cur.desc)}</p>${selectedFormulas.map(f=>`<div class="evidence-formula"><strong>${esc(f.name)}</strong><div class="muted" style="font-size:11px;margin-top:4px;">${esc(f.from)} · ${esc(f.eff)}</div><div class="evidence-herbs">${f.herbs.slice(0,5).map(x=>`<a href="#/herb?id=${x[0]}">${esc(herbName(x[0]))}</a>`).join('')}</div></div>`).join('')}`;
  const index=$('#zhengIndex');
  const query=($('#syndromeSearch')?.value||'').trim();
  const filtered=ZHENGS.filter(z=>!query||z.name.includes(query)||z.desc.includes(query));
  if(index) index.innerHTML=filtered.map(z=>`<button type="button" class="${z.id===cur.id?'active':''}" data-zheng="${esc(z.id)}"><b>${esc(z.name)}</b><small>${esc(z.desc)}</small></button>`).join('')||'<span class="muted">没有匹配证候</span>';
}
document.addEventListener('click', e=>{
  const card=e.target.closest('[data-zheng]');
  if(card){ store.selectedZheng=card.dataset.zheng; renderZheng(); }
});
document.addEventListener('input', e=>{if(e.target.id==='syndromeSearch'&&parseHash().route==='zheng')renderZheng();});

function renderHomeClassics(){
  if(typeof echarts === 'undefined'){ return; }
  const p=chartPalette();
  const el=document.getElementById('homeClassicBarChart');
  if(!el) return;
  const bChart = chartManager.register('homeClassicBar', echarts.init(el), el);
  const data = CLASSICS.map(c=>({name:c.name, value:c.num}));
  bChart.setOption({
    backgroundColor:'transparent',
    tooltip:{trigger:'axis', confine:true, backgroundColor:p.card, textStyle:{color:p.text,fontSize:12}, formatter:item=>`${item[0].name}<br/>收载 <b>${item[0].value}</b> 种`},
    grid:{left:56,right:20,top:14,bottom:60},
    xAxis:{type:'category', data:data.map(d=>d.name), axisLabel:{color:p.muted,fontSize:10.5,rotate:32,interval:0}, axisLine:{lineStyle:{color:p.line}}},
    yAxis:{type:'value', axisLabel:{color:p.muted,fontSize:11}, splitLine:{lineStyle:{color:p.line}}},
    series:[{type:'bar', data:data.map(d=>d.value), barWidth:'52%', itemStyle:{color:item=> item.dataIndex>=4 ? p.cinnabar : p.celadon, borderRadius:[6,6,0,0]}, label:{show:true, position:'top', color:p.text,fontSize:11}}]
  });

  $('#homeClassicTimeline').innerHTML = CLASSICS.map(c=>`
    <div class="cl-item">
      <div class="cl-era">${esc(c.era)}</div>
      <div class="cl-name">${esc(c.name)}</div>
      <div class="cl-meta">${esc(c.author)} · <span class="cl-num">收载 ${c.num} 种</span></div>
      <div class="cl-desc">${esc(c.desc)}</div>
    </div>`).join('');
}

function renderFood(){
  const tags = ['全部', ...new Set(FOODS.map(f=>f.tag))];
  $('#foodFilters').innerHTML = tags.map(t=>`<button class="filter-chip ${store._foodTag===t||(t==='全部'&&!store._foodTag)?'on':''}" data-food="${esc(t)}">${esc(t)}</button>`).join('');
  const list = FOODS.filter(f=>!store._foodTag || store._foodTag==='全部' || f.tag===store._foodTag);
  $('#foodGrid').innerHTML = list.map(f=>`
    <div class="card card-pad thumb-card">
      <div class="image-frame food-image"><img src="${(byName(f.name)||HERBS[0]).image}" alt="${esc(f.name)} · ${esc((byName(f.name)||HERBS[0]).imageAlt)}" loading="lazy"></div>
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
      <div class="image-frame culture-image"><img src="${HERITAGE_IMAGES[h.name]||herbPlaceholder('遗')}" alt="${esc(h.name)} 非遗场景图" loading="lazy" onerror="this.onerror=null;this.src=herbPlaceholder('遗')"></div>
      <div class="hd"><span class="stamp"><span class="a">${esc(h.name.slice(0,2))}</span><span class="b">非遗</span></span>
        <div><h3>${esc(h.name)}</h3><div class="muted" style="font-size:11.5px;">${esc(h.type)}</div></div></div>
      <p>${esc(h.note)}</p>
    </div>`).join('');
}

const QUIZ = [
  {q:'枸杞子在四气五味中的组合是？', options:['温 · 辛','平 · 甘','寒 · 苦','凉 · 酸'], answer:1, note:'枸杞子性平、味甘，归肝肾经，是代表性的药食同源本草。'},
  {q:'“血中圣药”通常指哪一味药材？', options:['黄芪','当归','陈皮','薄荷'], answer:1, note:'当归补血活血、调经止痛，常被称为“血中圣药”。'},
  {q:'君臣佐使中的“君药”主要承担什么角色？', options:['调和诸药','针对主病或主证','消除副作用','引药归经'], answer:1, note:'君药针对主病或主证，是方剂的核心药物。'},
  {q:'下列哪项属于药食同源的日常场景？', options:['枸杞泡水','自行替代处方药','长期超量服用','忽略过敏史'], answer:0, note:'药食同源强调在合适边界内融入日常，不能替代诊疗。'},
  {q:'《本草纲目》的作者是？', options:['张仲景','李时珍','孙思邈','陶弘景'], answer:1, note:'明代李时珍历时多年编成《本草纲目》，是本草学的重要典籍。'}
];
const learnState = {index:0, answered:false, correct:0, total:0};
function getLearnStats(){try{return JSON.parse(localStorage.getItem('herbal_learn_stats')||'{"total":0,"correct":0}')}catch(e){return {total:0,correct:0}}}
function saveLearnStats(){localStorage.setItem('herbal_learn_stats',JSON.stringify({total:learnState.total,correct:learnState.correct}));}
function renderLearn(){
  const s=getLearnStats(); learnState.total=s.total; learnState.correct=s.correct;
  const item=QUIZ[learnState.index%QUIZ.length]; const progress=((learnState.index%QUIZ.length)/QUIZ.length)*100;
  $('#quizCard').innerHTML=`<div class="quiz-top"><span class="badge qing">${currentLang==='en'?'Question':'第'} ${(learnState.index%QUIZ.length)+1} / ${QUIZ.length} ${currentLang==='en'?'':'题'}</span><span class="muted" style="font-size:12px;">${t('learn.total')} ${s.correct} ${currentLang==='en'?'':'题'}</span></div><div class="progress"><i style="width:${progress}%"></i></div><div class="quiz-q">${item.q}</div><div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${o}</button>`).join('')}</div><div id="quizFeedback"></div>`;
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{if(learnState.answered)return;learnState.answered=true;const picked=Number(btn.dataset.answer),ok=picked===item.answer;learnState.total++;if(ok)learnState.correct++;saveLearnStats();document.querySelectorAll('[data-answer]').forEach((b,i)=>{b.disabled=true;if(i===item.answer)b.classList.add('correct');if(i===picked&&!ok)b.classList.add('wrong')});$('#quizFeedback').innerHTML=`<div class="quiz-note">${ok?t('learn.correct'):t('learn.retry')} ${item.note}</div><button class="quiz-next" id="quizNext">${t('learn.next')}</button>`;$('#quizNext').onclick=()=>{learnState.index++;learnState.answered=false;renderLearn();updateHomeProgress();};$('#learnStats').textContent=`${t('learn.done')} ${learnState.total} · ${t('learn.right')} ${learnState.correct}`;updateHomeProgress();}));
  $('#learnStats').textContent=`${t('learn.done')} ${s.total} · ${t('learn.right')} ${s.correct}`;
}
function renderSaved(){
  const ids=getFavs(); const grid=$('#savedGrid');
  if(!ids.length){grid.innerHTML='<div class="saved-empty">还没有本机收藏。去“药材星图”点亮第一枚收藏吧。</div>';return;}
  grid.innerHTML=ids.map(id=>{const h=byId(id);if(!h)return '';return `<a class="card card-pad featured-herb" href="#/herb?id=${h.id}"><div class="image-frame"><img src="${h.image}" alt="${esc(h.name)} · ${esc(h.imageAlt)}" loading="lazy"></div><div><div class="n">${esc(h.name)}</div><div class="d">${esc(h.qi)} · ${esc(h.wei)} · ${esc(h.eff)}</div></div><button class="fav-btn on" data-fav="${h.id}" onclick="event.preventDefault();event.stopPropagation();toggleFav('${h.id}');renderSaved();">已收藏</button></a>`}).join('');
}
function updateHomeProgress(){const el=$('#homeProgress');if(el){const s=getLearnStats();el.textContent=`${Math.min(s.total,5)} / 5`;}}

/* ============================================================
   全局搜索 + 收藏按钮 + 初始化
   ============================================================ */
function renderFavButtons(){
  document.querySelectorAll('[data-fav]').forEach(b=>{
    const on = isFav(b.dataset.fav); b.classList.toggle('on', on); b.textContent = on?'已收藏':'收藏';
  });
}
const searchInput = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');
let searchTimer = null;
function updateSearchSuggestions(){
  const kw=searchInput.value.trim().toLowerCase();
  store._searchIndex=-1;
  if(!kw){ searchResults.classList.remove('open'); searchResults.innerHTML=''; searchInput.setAttribute('aria-expanded','false'); return; }
  const herbs=HERBS.filter(h=>h.name.toLowerCase().includes(kw)||h.pinyin.includes(kw)||h.eff.toLowerCase().includes(kw)).slice(0,6);
  const approvedCatalog=(window.HerbalSearch?.filterApproved||((entries)=>entries.filter(item=>item?.status!=='review')))(HERB_CATALOG);
  const catalog=approvedCatalog.filter(item=>!byName(item.name)&&item.name.toLowerCase().includes(kw)).slice(0,4);
  const formulas=FORMULAS.filter(f=>f.name.toLowerCase().includes(kw)||f.eff.toLowerCase().includes(kw)).slice(0,4);
  searchResults.innerHTML=herbs.map(h=>`<a class="search-result" role="option" href="#/herb?id=${h.id}"><img class="herb-thumb" src="${h.image}" alt="" loading="lazy"><strong>${esc(h.name)}</strong><span>${currentLang==='en'?'Herb':'药材'} · ${esc(h.qi)} · ${esc(h.wei)}</span></a>`).concat(catalog.map(item=>`<a class="search-result catalog-result" role="option" href="#/herbs?mode=catalog&q=${encodeURIComponent(item.name)}"><span class="catalog-result-mark">索引</span><strong>${esc(item.name)}</strong><span>${currentLang==='en'?'Name index':'仅名称索引'}</span></a>`), formulas.map(f=>`<a class="search-result" role="option" href="#/formula?f=${f.id}"><strong>${esc(f.name)}</strong><span>${currentLang==='en'?'Formula':'方剂'} · ${esc(f.zheng)}</span></a>`)).join('')||`<div class="search-empty">${esc(t('search.empty'))}</div>`;
  searchResults.classList.add('open'); searchInput.setAttribute('aria-expanded','true');
}
function closeSearch(){ searchResults.classList.remove('open'); searchInput.setAttribute('aria-expanded','false'); }
// 输入过程提供建议，也在药材星图页同步过滤
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
  if(e.key==='Escape'){ closeSearch(); return; }
  const options=Array.from(searchResults.querySelectorAll('.search-result'));
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    if(!options.length) return;
    e.preventDefault(); store._searchIndex=(store._searchIndex+(e.key==='ArrowDown'?1:options.length-1))%options.length;
    options.forEach((el,i)=>el.classList.toggle('active',i===store._searchIndex)); return;
  }
  if(e.key !== 'Enter') return;
  const kw = searchInput.value.trim();
  if(!kw) return;
  if(options[store._searchIndex]){ options[store._searchIndex].click(); closeSearch(); return; }
  const herbHit = HERBS.filter(h=>h.name.includes(kw)||h.pinyin.includes(kw.toLowerCase()));
  const catalogHit = HERB_CATALOG.filter(item=>item.name.includes(kw));
  const formHit = FORMULAS.filter(f=>f.name.includes(kw));
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
  document.getElementById('mainNav').classList.toggle('open');
});
document.addEventListener('change', e=>{
  if(e.target.id==='formulaFocus'){ store._formulaFocus=e.target.value; if(parseHash().route==='formula') renderFormula(); else location.hash='#/formula'; }
  if(e.target.id==='qiweiCatFilter'){ store._qiweiCat=e.target.value; if(parseHash().route==='qiwei') renderQiwei(); }
});
document.addEventListener('click', e=>{
  if(e.target.id==='resetGraph'){ store._formulaFocus=''; if(parseHash().route==='formula' && !parseHash().params.f) renderFormula(); else location.hash='#/formula'; }
});
const themeToggle=document.getElementById('themeToggle');
if(localStorage.getItem('herbal_theme')==='night') document.body.classList.add('night');
themeToggle.addEventListener('click',()=>{
  if(window.HerbalTheme?.setTheme){ window.HerbalTheme.setTheme(window.HerbalTheme.nextTheme(document.documentElement.dataset.theme)); return; }
  document.body.classList.toggle('night');localStorage.setItem('herbal_theme',document.body.classList.contains('night')?'night':'day');updateThemeControl();render();
});
const languageToggle=document.getElementById('languageToggle');
if(languageToggle) languageToggle.addEventListener('click',()=>{currentLang=currentLang==='zh'?'en':'zh';localStorage.setItem('herbal_lang',currentLang);render();toast(currentLang==='en'?'Language switched to English':'已切换为中文');});
updateThemeControl();
const hero=document.querySelector('.hero');
if(hero) hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--spot-x',`${((e.clientX-r.left)/r.width)*100}%`);hero.style.setProperty('--spot-y',`${((e.clientY-r.top)/r.height)*100}%`);});
document.addEventListener('click', e=>{
  const nav = document.getElementById('mainNav');
  if(e.target.closest('nav a,.nav-popover a') || (e.target.closest('#app') && !e.target.closest('#mainNav') && window.innerWidth<=768)){
    nav.classList.remove('open');
    const more=document.getElementById('navMore'); if(more) more.removeAttribute('open');
  }
  if(!e.target.closest('.searchbox')) closeSearch();
});

// 本地静态资源异常时保留可读的植物图像，不让卡片出现破图图标。
document.addEventListener('error', e=>{
  const img=e.target;
  if(!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied='1';
  img.src=herbPlaceholder((img.alt||'药').slice(0,1));
  img.alt=(img.alt||'本草植物图谱')+'（备用图像）';
}, true);

// 启动
render();

// ECharts 加载兜底：CDN 异常时全站提示，避免图表区静默空白
if(typeof echarts === 'undefined'){
  const tip = document.createElement('div');
  tip.style.cssText = 'position:fixed;top:64px;left:0;right:0;z-index:99;background:#B23A2E;color:#F6EFE3;text-align:center;font-size:13px;padding:8px 14px;';
  tip.textContent = '图表库（ECharts）加载失败，可能是网络受限。请检查网络后刷新页面。';
  document.body.prepend(tip);
}
