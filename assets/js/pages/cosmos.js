const EFFECT_COLORS = {
  '补虚药': '#D0A24C',
  '清热药': '#B84B3E',
  '解表药': '#7C9DB3',
  '活血化瘀药': '#9D86AF',
  '利水渗湿药': '#6B9E8A',
  '理气药': '#D88C61',
  '化痰止咳平喘药': '#86B8AF',
  '安神药': '#B6A0C8',
  '收涩药': '#B9AC72',
  '温里药': '#DA8065',
  '消食药': '#A4AD71',
  '祛风湿药': '#98AABD',
  '止血药': '#D7A4A3'
};

export const DEFAULT_COLOR_MODE = 'effect';

export function effectLegendMarkup() {
  return Object.entries(EFFECT_COLORS)
    .map(([name, color]) => '<span><i style="background:' + color + '"></i>' + name.replace(/药$/, '') + '</span>')
    .join('') + '<span><i style="background:#D8C9A8"></i>其他／未录类别</span>';
}

export function cosmosControlsMarkup() {
  return '<button type="button" class="cosmos-collapse" data-cosmos-collapse aria-expanded="true" aria-label="收起星图控制面板">⌄</button><form class="cosmos-search"><label for="cosmosSearch">定位一味本草</label><div><input id="cosmosSearch" type="search" list="cosmosNames" placeholder="输入药名或拼音" autocomplete="off"><button type="submit">飞向本草</button></div><datalist id="cosmosNames"></datalist></form><div class="cosmos-actions"><button type="button" data-cosmos-color aria-pressed="false">统一色</button><button type="button" data-cosmos-motion aria-pressed="true">动效开</button><button type="button" data-cosmos-zoom="-.2" aria-label="缩小星图">−</button><button type="button" data-cosmos-zoom=".2" aria-label="放大星图">＋</button></div><p class="cosmos-legend" data-cosmos-legend>每一颗可选星辰对应一张本草知识卡。</p><div class="cosmos-selection" aria-live="polite"><span>点选星辰；双击聚焦。</span><a data-cosmos-detail hidden>打开知识卡 →</a></div>';
}

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

function focusHerb(herbId, { animate = true } = {}) {
  if (typeof window === 'undefined') return herbId;
  window.dispatchEvent(new CustomEvent('herbal:focus-herb', { detail: { herbId, animate } }));
  return herbId;
}

function setCosmosColorMode(mode = 'uniform') {
  const value = mode === 'effect' ? 'effect' : 'uniform';
  try { localStorage.setItem('herbal_cosmos_color', value); } catch { /* optional */ }
  if (typeof document !== 'undefined') document.documentElement.dataset.cosmosColor = value;
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:cosmos-color', { detail: { mode: value } }));
  return value;
}

function setMotionEnabled(enabled) {
  const value = Boolean(enabled);
  try { localStorage.setItem('herbal_motion', value ? 'on' : 'off'); } catch { /* optional */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('herbal:motion', { detail: { enabled: value } }));
  return value;
}

function initCosmos() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let preference = true;
  try { preference = localStorage.getItem('herbal_motion') !== 'off'; } catch { /* optional */ }
  const animate = motionEnabled({ reducedMotion: reduced, preference });
  let storedColor = DEFAULT_COLOR_MODE;
  try { storedColor = localStorage.getItem('herbal_cosmos_color') === 'uniform' ? 'uniform' : DEFAULT_COLOR_MODE; } catch { /* optional */ }
  document.documentElement.dataset.cosmosColor = storedColor;
  window.HerbalCosmos = { selectVisibleLabels, colorForEffect, motionEnabled, focusHerb, setCosmosColorMode, setMotionEnabled, animate };
  window.dispatchEvent(new CustomEvent('herbal:motion', { detail: { enabled: animate } }));
  const hero = document.querySelector('.hero');
  if (hero && !document.getElementById('cosmosControls')) {
    const controls = document.createElement('div');
    controls.id = 'cosmosControls';
    controls.className = 'cosmos-controls';
    controls.innerHTML = cosmosControlsMarkup();
    hero.append(controls);
    const datalist=controls.querySelector('#cosmosNames');
    (window.HERBS||[]).forEach(herb=>{const option=document.createElement('option');option.value=herb.name;option.label=herb.pinyin||'';datalist.append(option);});
    const colorButton=controls.querySelector('[data-cosmos-color]'),motionButton=controls.querySelector('[data-cosmos-motion]'),legend=controls.querySelector('[data-cosmos-legend]');
    const syncColor=()=>{const effect=document.documentElement.dataset.cosmosColor==='effect';colorButton.textContent=effect?'功效色':'统一色';colorButton.setAttribute('aria-pressed',String(effect));legend.innerHTML=effect?effectLegendMarkup():'每一颗可选星辰对应一张本草知识卡。';};
    const syncMotion=()=>{motionButton.textContent=window.HerbalCosmos.animate?'动效开':'动效关';motionButton.setAttribute('aria-pressed',String(window.HerbalCosmos.animate));};
    colorButton.addEventListener('click',()=>{setCosmosColorMode(document.documentElement.dataset.cosmosColor==='effect'?'uniform':'effect');syncColor();});
    motionButton.addEventListener('click',()=>{window.HerbalCosmos.animate=setMotionEnabled(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&!window.HerbalCosmos.animate);syncMotion();});
    controls.querySelectorAll('[data-cosmos-zoom]').forEach(button=>button.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('herbal:cosmos-zoom',{detail:{delta:Number(button.dataset.cosmosZoom)}}))));
    controls.querySelector('form').addEventListener('submit',event=>{event.preventDefault();const query=controls.querySelector('input').value.trim().toLowerCase();const all=window.HERBS||[];const match=all.find(h=>h.name.toLowerCase()===query||h.id===query||h.pinyin===query)||all.find(h=>h.name.includes(query)&&query);if(match)focusHerb(match.id,{animate:window.HerbalCosmos.animate});else controls.querySelector('.cosmos-selection span').textContent='没有匹配的知识卡，请换一个药名。';});
    window.addEventListener('herbal:cosmos-selection',event=>{const herb=event.detail?.herb;if(!herb)return;controls.querySelector('.cosmos-selection span').textContent=herb.name+' · '+(herb.qi||'性味未录入')+' · '+(herb.cat||'类别未录入');const detail=controls.querySelector('[data-cosmos-detail]');detail.hidden=false;detail.href='#/herb?id='+encodeURIComponent(herb.id);});
    const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');motionQuery?.addEventListener?.('change',event=>{window.HerbalCosmos.animate=motionEnabled({reducedMotion:event.matches,preference});window.dispatchEvent(new CustomEvent('herbal:motion',{detail:{enabled:window.HerbalCosmos.animate}}));syncMotion();});
    const collapseButton=controls.querySelector('[data-cosmos-collapse]');
    collapseButton.addEventListener('click',()=>{
      const collapsed=controls.dataset.collapsed==='true';
      controls.dataset.collapsed=String(!collapsed);
      collapseButton.setAttribute('aria-expanded',String(collapsed));
      collapseButton.setAttribute('aria-label',collapsed?'收起星图控制面板':'展开星图控制面板');
      collapseButton.textContent=collapsed?'⌄':'⌃';
    });
    syncColor();syncMotion();
  }
  let lastScroll = 0;
  window.addEventListener('scroll', () => { if (window.HerbalCosmos.animate !== false) { lastScroll = Math.min(28, window.scrollY * .04); document.documentElement.style.setProperty('--hero-parallax', lastScroll + 'px'); } }, { passive: true });
  window.dispatchEvent(new CustomEvent('herbal:cosmos-ready'));
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCosmos, { once: true });
  else initCosmos();
}
