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
export const EFFECT_LEGEND_ID = 'cosmosEffectLegend';

export function effectLegendMarkup() {
  return Object.entries(EFFECT_COLORS)
    .map(([name, color]) => '<span><i style="background:' + color + '"></i>' + name.replace(/药$/, '') + '</span>')
    .join('') + '<span><i style="background:#D8C9A8"></i>其他／未录类别</span>';
}

export const READING_LABELS = { category: '资料分类', geography: '文献分布', nature: '药性', ethnic: '民族对照' };

/* The island the viewer can travel to. Offered for the groups big enough to be
   a destination; the long tail of one-card categories is reachable by搜索 and by
   the category filter rather than by a trip button nobody needs. */
export const TRAVEL_LIMIT = 6;

// Cluster travel is offered as the groups the archive actually records. The
// buttons are filled from the mounted engine, so a group with no card never
// appears as a destination, and the list follows the live 读法.
export function clusterControlsMarkup() {
  return '<div class="cosmos-clusters" role="group" aria-label="星团穿梭" data-cosmos-clusters data-empty="true"></div>';
}

export function clusterButtonMarkup(item = {}) {
  const label = String(item.label || item.key || '');
  const count = Number(item.count || 0);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  return '<button type="button" data-cosmos-cluster="' + escape(label) + '" aria-pressed="false">'
    + escape(label) + '<b>' + count + '</b></button>';
}

// 民族对照读法只有在门禁确认了带来源的线索之后才出现：没有 approved 条目时
// 整片星云只会被压暗，不如不提供这个入口（见 scripts/validate-ethnic-data.mjs）。
export function availableReadings() {
  const approved = typeof window !== 'undefined' && Array.isArray(window.ETHNIC_CORRESPONDENCE)
    ? window.ETHNIC_CORRESPONDENCE.some(item => item?.status === 'approved')
    : false;
  return ['category', 'geography', 'nature', ...(approved ? ['ethnic'] : [])];
}

export function readingControlsMarkup(readings = availableReadings()) {
  return '<div class="cosmos-readings" role="group" aria-label="星图着色读法" data-cosmos-readings>'
    + readings.map((id, index) => '<button type="button" data-cosmos-reading="' + id + '" aria-pressed="' + (index === 0) + '">' + (READING_LABELS[id] || id) + '</button>').join('')
    + '</div>';
}

/* The first screen is the sky itself. Which reading colours it and which group
   the camera travels to are the two decisions a visitor actually makes, so they
   stay open; everything that only adjusts the drawing (category filter, region
   checkboxes, colour and motion switches, legend) stays folded away. */
export function cosmosControlsMarkup() {
  return '<div class="cosmos-toolbar"><button type="button" data-cosmos-roam aria-pressed="false">进入漫游</button><button type="button" data-cosmos-find>搜索本草</button><output data-cosmos-count aria-live="polite"></output></div>'
    + '<p class="cosmos-select-hint">点选星辰读档案；跨类连线表示同一首收录方剂中的共同组成。</p>'
    + readingControlsMarkup()
    + clusterControlsMarkup()
    + '<details class="cosmos-settings"><summary data-cosmos-collapse>细化筛选与显示</summary>'
    + '<label class="cosmos-category">资料分类 <select data-cosmos-category aria-label="星图资料分类"><option value="">全部知识卡</option></select></label>'
    + '<fieldset data-cosmos-regions hidden><legend>选择分布区域（可多选）</legend></fieldset>'
    + '<div class="cosmos-actions"><button type="button" data-cosmos-color aria-pressed="false">统一色</button><button type="button" data-cosmos-motion aria-pressed="true">动效开</button><button type="button" data-cosmos-zoom="-.2" aria-label="缩小星图">−</button><button type="button" data-cosmos-zoom=".2" aria-label="放大星图">＋</button></div>'
    + '<p class="cosmos-legend" data-cosmos-legend>每一颗可选星辰对应一张本草知识卡。</p></details>'
    + '<p class="cosmos-legend" id="cosmosReadingLegend" hidden></p>'
    + '<p data-cosmos-renderer class="cosmos-renderer-status" role="status">基础星图</p>';
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

function setReading(mode) {
  if (typeof window === 'undefined') return mode;
  window.dispatchEvent(new CustomEvent('herbal:cosmos-reading', { detail: { mode } }));
  return mode;
}

function initCosmos() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let preference = true;
  try { preference = localStorage.getItem('herbal_motion') !== 'off'; } catch { /* optional */ }
  const animate = motionEnabled({ reducedMotion: reduced, preference });
  let storedColor = DEFAULT_COLOR_MODE;
  try { storedColor = localStorage.getItem('herbal_cosmos_color') === 'uniform' ? 'uniform' : DEFAULT_COLOR_MODE; } catch { /* optional */ }
  document.documentElement.dataset.cosmosColor = storedColor;
  window.HerbalCosmos = {
    selectVisibleLabels, colorForEffect, motionEnabled, focusHerb, setCosmosColorMode, setMotionEnabled, animate,
    setReading,
    readings: () => (window.HerbalCosmosEngine?.READING_MODES || ['category', 'geography', 'nature', 'ethnic'])
      .map(id => ({ id, label: window.HerbalCosmosEngine?.READING_LABELS?.[id] || id }))
  };
  window.dispatchEvent(new CustomEvent('herbal:motion', { detail: { enabled: animate } }));
  const hero = document.querySelector('.hero');
  if (hero && !document.getElementById('cosmosControls')) {
    const controls = document.createElement('div');
    controls.id = 'cosmosControls';
    controls.className = 'cosmos-controls';
    controls.innerHTML = cosmosControlsMarkup();
    hero.querySelector('.cosmos-scene').append(controls);
    const detailPanel = document.createElement('aside');
    detailPanel.id = 'cosmosDetail'; detailPanel.className = 'cosmos-detail native-spotlight'; detailPanel.setAttribute('aria-label', '选中本草');
    detailPanel.hidden = true;
    detailPanel.innerHTML = '<p class="cosmos-detail-kicker">从一颗星，读一份档案</p><h2>点选一味本草</h2><p>或使用顶部搜索，打开知识卡后从「星图定位」回到这里。</p><p>选中后，连线只表示项目方剂记录中的共同组成；不表示疗效、距离或推荐组合。</p>';
    hero.append(detailPanel);
    const all = (window.HERBS || []).filter(h => !['formula-material', 'directory-only'].includes(h.kind));
    const category = controls.querySelector('[data-cosmos-category]');
    [...new Set(all.map(h => h.cat || '类别未录入'))].sort().forEach(cat => { const option = document.createElement('option'); option.value = cat; option.textContent = cat; category.append(option); });
    const regions = controls.querySelector('[data-cosmos-regions]');
    Object.keys(window.HerbalCosmosEngine.REGION_OF_PROVINCE).forEach(region => {
      const label = document.createElement('label'), input = document.createElement('input');
      input.type = 'checkbox'; input.value = region; label.append(input, document.createTextNode(region)); regions.append(label);
    });
    const geographyNote = document.createElement('p');
    geographyNote.className = 'cosmos-geography-note'; geographyNote.textContent = '记录可跨多区；多选按并集筛选，不表示独占产地或实测丰度。'; regions.append(geographyNote);
    const updateFilter = () => {
      const selectedRegions = [...regions.querySelectorAll('input:checked')].map(input => input.value);
      const count = window.HerbalNebula?.setFilter(category.value, selectedRegions) ?? all.length;
      controls.querySelector('[data-cosmos-count]').textContent = count + ' / ' + all.length + ' 张';
    };
    category.addEventListener('change', updateFilter); regions.addEventListener('change', updateFilter);
    controls.querySelector('[data-cosmos-find]').addEventListener('click', () => document.getElementById('globalSearch')?.focus());
    const roamButton = controls.querySelector('[data-cosmos-roam]');
    roamButton.addEventListener('click', () => {
      const enabled = roamButton.getAttribute('aria-pressed') !== 'true';
      window.HerbalNebula?.setRoam(enabled); roamButton.setAttribute('aria-pressed', String(enabled));
      roamButton.textContent = enabled ? '退出漫游' : '进入漫游';
    });
    // 星团穿梭按钮由引擎按当前读法实际存在的分组生成，避免出现空目的地。
    // 只保留够大的分组：二十八个资料分类里一半只有一两个抽屉，把它们都做成
    // 目的地只会让这一行变成噪声。
    const clusterHost = controls.querySelector('[data-cosmos-clusters]');
    let clusterButtons = [];
    function drawClusterButtons(items) {
      if (!clusterHost) return;
      clusterHost.dataset.empty = String(items.length === 0);
      clusterHost.innerHTML = items.map(item => clusterButtonMarkup(item)).join('');
      clusterButtons = [...clusterHost.querySelectorAll('[data-cosmos-cluster]')];
      clusterButtons.forEach(button => button.addEventListener('click', () => {
        const key = button.dataset.cosmosCluster;
        flyToCluster(button.getAttribute('aria-pressed') === 'true' ? 'all' : key);
      }));
    }
    function travelDestinations() {
      const items = window.HerbalNebula?.clusters?.() || [];
      return items.length <= TRAVEL_LIMIT ? items : items.slice(0, TRAVEL_LIMIT);
    }
    function syncClusterButtons() {
      if (!clusterHost) return;
      const items = travelDestinations();
      // 数量签名只在引擎重建分组后才变；重建时才重绘按钮，避免每次交互都改 DOM。
      const signature = items.map(item => item.key + ':' + item.count).join('|');
      if (clusterHost.dataset.signature !== signature) { clusterHost.dataset.signature = signature; drawClusterButtons(items); }
      const current = window.HerbalNebula?.perf?.().cluster || 'all';
      clusterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cosmosCluster === current)));
    }
    function flyToCluster(key) {
      const next = window.HerbalNebula?.flyTo?.(key);
      syncClusterButtons();
      return next;
    }
    const colorButton=controls.querySelector('[data-cosmos-color]'),motionButton=controls.querySelector('[data-cosmos-motion]'),legend=controls.querySelector('[data-cosmos-legend]');
    const syncColor=()=>{const effect=document.documentElement.dataset.cosmosColor==='effect';colorButton.textContent=effect?'分类色':'统一色';colorButton.setAttribute('aria-pressed',String(effect));legend.innerHTML=effect?effectLegendMarkup():'每一颗可选星辰对应一张本草知识卡。';};
    const syncMotion=()=>{motionButton.textContent=window.HerbalCosmos.animate?'动效开':'动效关';motionButton.setAttribute('aria-pressed',String(window.HerbalCosmos.animate));};
    colorButton.addEventListener('click',()=>{setCosmosColorMode(document.documentElement.dataset.cosmosColor==='effect'?'uniform':'effect');syncColor();});
    motionButton.addEventListener('click',()=>{preference=!window.HerbalCosmos.animate;window.HerbalCosmos.animate=setMotionEnabled(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&preference);syncMotion();});
    controls.querySelectorAll('[data-cosmos-zoom]').forEach(button=>button.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('herbal:cosmos-zoom',{detail:{delta:Number(button.dataset.cosmosZoom)}}))));
    const safeText = value => String(value || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
    function syncFavorite() {
      const button = detailPanel.querySelector('[data-cosmos-favorite]'); if (!button) return;
      const isFavorite = window.HerbalNebula?.isFavorite(button.dataset.cosmosFavorite);
      button.textContent = isFavorite ? '已收藏 · 取消收藏' : '收藏这味本草';
      button.setAttribute('aria-pressed', String(Boolean(isFavorite)));
      button.setAttribute('aria-label', (isFavorite ? '取消收藏' : '收藏') + button.dataset.herbName);
      detailPanel.querySelector('[data-cosmos-favorite-status]').textContent = isFavorite ? '已加入我的本草收藏' : '尚未收藏';
    }
    function selectionUrl(id) {
      const params = new URLSearchParams(location.hash.split('?')[1] || '');
      if (id) { params.set('focus', 'star'); params.set('id', id); } else { params.delete('focus'); params.delete('id'); }
      history.replaceState(history.state, '', '#/home' + (params.size ? '?' + params.toString() : ''));
    }
    window.addEventListener('herbal:favorites', syncFavorite);
    window.addEventListener('herbal:cosmos-selection', event => {
      const herb = event.detail?.herb; if (!herb) return;
      hero.dataset.selected = 'true'; detailPanel.hidden = false;
      selectionUrl(herb.id);
      category.value = ''; regions.querySelectorAll('input').forEach(input => input.checked = false); updateFilter();
      const related = window.HerbalNebula?.perf().relations || { ids: [], formulas: [] };
      detailPanel.innerHTML = '<button type="button" data-cosmos-close aria-label="关闭本草预览">×</button><p class="cosmos-detail-kicker">选中本草 · 项目知识卡</p>'
        + '<div class="cosmos-detail-image">' + (event.detail.imageMarkup || '') + '</div><div class="cosmos-image-credit">' + (event.detail.imageCreditMarkup || '') + '</div><h2>' + safeText(herb.name) + '</h2><p>' + safeText([herb.qi, herb.wei, herb.cat].filter(Boolean).join(' · ')) + '</p>'
        + '<p class="cosmos-origin">分布记录：' + safeText((herb.origin || []).join('、') || '未录入') + '。可跨多区，不表示独占产地。</p>'
        + '<p>' + (related.formulas.length ? '共同方剂记录：' + related.formulas.length + ' 首 · 相关知识卡 ' + related.ids.length + ' 张。连线仅为共同组成索引。' : '本馆尚无关联记录。可从完整档案阅读这味本草。') + '</p>'
        + '<button type="button" data-cosmos-favorite="' + safeText(herb.id) + '" data-herb-name="' + safeText(herb.name) + '" aria-pressed="false">收藏这味本草</button><span class="sr-only" role="status" data-cosmos-favorite-status></span>'
        + '<a data-cosmos-detail href="#/herb?id=' + encodeURIComponent(herb.id) + '">打开完整档案与来源 →</a><div class="cosmos-detail-sources">' + (event.detail.sourcesMarkup || '<span>字段来源请见完整档案</span>') + '</div>';
      detailPanel.querySelector('[data-cosmos-favorite]').addEventListener('click', () => window.HerbalNebula.toggleFavorite(herb.id));
      syncFavorite();
      detailPanel.querySelector('[data-cosmos-close]').addEventListener('click', () => {
        window.HerbalNebula?.clearFocus();
        hero.dataset.selected = 'false'; detailPanel.hidden = true;
        selectionUrl(null);
        detailPanel.innerHTML = '<p class="cosmos-detail-kicker">从一颗星，读一份档案</p><h2>继续读星海</h2><p>点选本草，查看名字、性味与可核对的来源。</p>';
        document.getElementById('heroCanvas').focus({ preventScroll: true });
      });
    });
    window.addEventListener('herbal:cosmos-reading', event => {
      regions.hidden = event.detail?.mode !== 'geography';
      updateFilter();
      if (event.detail?.mode === 'geography') flyToCluster('all');
      syncClusterButtons();
    });
    window.addEventListener('herbal:cosmos-renderer', event => { controls.querySelector('[data-cosmos-renderer]').textContent = event.detail.reason || (event.detail.renderer === 'webgl' ? '增强星图' : event.detail.renderer === 'static' ? '静态星图' : '基础星图'); });
    const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');motionQuery?.addEventListener?.('change',event=>{window.HerbalCosmos.animate=motionEnabled({reducedMotion:event.matches,preference});window.dispatchEvent(new CustomEvent('herbal:motion',{detail:{enabled:window.HerbalCosmos.animate}}));syncMotion();});
    controls.querySelector('details').open = false;
    regions.hidden = document.documentElement.dataset.cosmosReadingMode !== 'geography';
    syncColor();syncMotion();updateFilter();syncClusterButtons();
  }
  window.dispatchEvent(new CustomEvent('herbal:cosmos-ready'));
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCosmos, { once: true });
  else initCosmos();
}
