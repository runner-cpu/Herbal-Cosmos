import { icon } from './icons.js?v=planet-layout-v5-20261022-1';

const DATA_VERSION = 'planet-layout-v5-20261022-1';
const ONLINE_STYLE = 'https://tiles.openfreemap.org/styles/positron';
const LICENSE_LABELS = {
  CC0_1_0: 'CC0 1.0',
  CC_BY_4_0: 'CC BY 4.0',
};
const HABITATS = [
  { id: 'mountain', aliases: ['shanlin', 'mountain', 'forest'], label: '山林根境', color: '#d86a4f' },
  { id: 'meadow', aliases: ['caodian', 'meadow', 'grassland'], label: '草甸原野', color: '#80c7a7' },
  { id: 'flower', aliases: ['huaye', 'flower', 'aromatic'], label: '花野芳香', color: '#e8a7cb' },
  { id: 'fruit', aliases: ['guoshi', 'fruit', 'seed'], label: '果实种籽', color: '#f1c46f' },
  { id: 'wetland', aliases: ['shuize', 'wetland', 'water'], label: '水泽湿地', color: '#62b7cc' },
  { id: 'fungus', aliases: ['junmu', 'fungus', 'shade'], label: '菌木阴翳', color: '#b39ae3' },
];
const habitatFor = (item = {}) => {
  const raw = String(item.habitat || item.habitatLabel || item.environment || '').toLowerCase();
  return HABITATS.find((habitat) => habitat.aliases.some((alias) => raw === alias || raw.includes(alias)))?.id || 'unknown';
};
const habitatDef = (item) => HABITATS.find((habitat) => habitat.id === habitatFor(item)) || { id: 'unknown', label: '未归类', color: '#9aa6b2' };
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const itemText = (item = {}) => `${item.nameZh || ''} ${item.pinyin || ''} ${item.scientificName || ''} ${item.family || ''} ${item.tags || ''} ${item.morphology || ''}`.toLowerCase();
const numeric = (value) => new Intl.NumberFormat('zh-CN').format(Number(value || 0));
const record = (snapshot, id) => snapshot?.herbs?.find((entry) => entry.id === id) || null;

function detailMarkup(item, gisRecord) {
  if (!item) {
    return `<div class="atlas-detail-empty"><span class="atlas-detail-orbit" aria-hidden="true">${icon('pin')}</span><p class="kicker">OPEN OCCURRENCE ATLAS</p><h2>从地图上选一味。</h2><p>聚类点来自 GBIF 的开放观测记录。它们只表示“人曾经在哪里记录过这种植物”，不表示药效、资源储量或推荐采集地点。</p></div>`;
  }
  const habitat = habitatDef(item);
  const available = gisRecord?.status === 'available';
  const licenses = (gisRecord?.licenses || []).map((code) => `<a href="${code === 'CC0_1_0' ? 'https://creativecommons.org/publicdomain/zero/1.0/' : 'https://creativecommons.org/licenses/by/4.0/'}" target="_blank" rel="noopener noreferrer">${LICENSE_LABELS[code] || esc(code)}</a>`).join(' · ');
  const representative = gisRecord?.cells?.find((cell) => cell.occurrenceUrl)?.occurrenceUrl || (gisRecord?.scientificName ? `https://www.gbif.org/species/search?q=${encodeURIComponent(gisRecord.scientificName)}` : 'https://www.gbif.org/');
  const image = item.image?.status === 'ready'
    ? `<figure class="atlas-detail-photo"><img src="${esc(item.image.path)}" width="${Number(item.image.width) || 640}" height="${Number(item.image.height) || 480}" alt="${esc(item.nameZh)}植物照片" loading="lazy" decoding="async" /><figcaption>${esc(item.image.creator || 'GBIF 公开观测')}</figcaption></figure>`
    : `<div class="atlas-detail-photo atlas-detail-photo-missing">${icon('image')}<span>照片待补</span></div>`;
  return `<div class="atlas-detail-head"><span class="kicker">${available ? 'OBSERVED RANGE' : 'NO OPEN GRID'} · ${esc(habitat.label)}</span><span class="atlas-detail-code">${esc(item.id.replace('herb-', '').slice(0, 18).toUpperCase())}</span></div>${image}<div class="atlas-detail-title"><div><h2>${esc(item.nameZh)}</h2><p>${esc(item.scientificName || item.pinyin || '')}</p></div><i style="--atlas-habitat:${habitat.color}" aria-hidden="true"></i></div><p class="atlas-detail-summary">${esc(item.identitySummary || item.morphology || '这味本草的身份资料正在补录。')}</p>${available ? `<dl class="atlas-stat-grid"><div><dt>GBIF 命中</dt><dd>${numeric(gisRecord.recordCount)}</dd></div><div><dt>许可样本</dt><dd>${numeric(gisRecord.sampledRecordCount)}</dd></div><div><dt>聚合网格</dt><dd>${numeric(gisRecord.gridCellCount)}</dd></div><div><dt>空间精度</dt><dd>${Number(gisRecord.precisionDegrees) === 0.5 ? '0.5°' : '1.0°'}</dd></div></dl><div class="atlas-license"><span>开放许可</span><p>${licenses || '未登记'}</p><a href="${esc(representative)}" target="_blank" rel="noopener noreferrer">查看 GBIF 记录入口 ↗</a></div><button type="button" class="quiet-button atlas-locate" data-atlas-locate="${esc(item.id)}">${icon('pin')} 定位这味本草</button>` : `<div class="atlas-empty-record"><strong>暂无符合条件的开放坐标记录</strong><p>当前快照在中国范围、可用许可和地理质量筛选下没有找到网格点。这不等于该物种在中国没有分布，也不表示没有其他公开记录。</p></div>`}<div class="atlas-facts"><div><span>主生境</span><b>${esc(habitat.label)}</b></div><div><span>药用部位</span><b>${esc(item.partUsed || '待补')}</b></div></div><p class="atlas-detail-boundary">${esc(item.boundary || '仅用于植物学与文化阅读，不构成专业鉴定或医疗建议。')}</p><button type="button" class="primary-button compact" data-atlas-trace="${esc(item.id)}">打开一味档案 <span>↗</span></button>`;
}

export function atlasMarkup({ items = [], selectedId = '', activeHabitat = 'all', query = '' } = {}) {
  const list = Array.isArray(items) ? items : [];
  const selected = list.find((item) => item.id === selectedId) || list.find((item) => item.id === 'herb-artemisia-annua') || list[0] || null;
  const filters = HABITATS.map((habitat) => `<button type="button" class="atlas-habitat ${activeHabitat === habitat.id ? 'is-active' : ''}" data-atlas-habitat="${habitat.id}" aria-pressed="${activeHabitat === habitat.id}"><i style="--atlas-habitat:${habitat.color}" aria-hidden="true"></i>${habitat.label}<b>${list.filter((item) => habitatFor(item) === habitat.id).length}</b></button>`).join('');
  return `<main class="atlas-view" data-atlas-root data-atlas-active="${esc(activeHabitat)}" aria-labelledby="atlas-title"><div class="atlas-intro"><div><p class="kicker">OPEN OCCURRENCE ATLAS · FIELD SIGNAL</p><h1 id="atlas-title">把一味本草，<br /><em>放回真实观测。</em></h1><p class="atlas-lead">从 GBIF 的中国开放坐标记录生成聚类地图。它不是药效地图，也不是资源分布图，而是一层可核对的“人在哪里看见过它”。</p></div><div class="atlas-stamp"><span>${icon('pin')}</span><small>GBIF<br />OCCURRENCE<br />SNAPSHOT</small></div></div><section class="atlas-workbench" aria-label="中国开放观测生境地图"><aside class="atlas-index"><div class="atlas-index-head"><span class="panel-label">SPECIES INDEX</span><button type="button" class="quiet-button atlas-reset" data-atlas-reset>重置</button></div><label class="atlas-search"><span aria-hidden="true">${icon('search')}</span><input type="search" data-atlas-search value="${esc(query)}" placeholder="搜索名称、学名或科属" aria-label="在地图物种索引中搜索" /></label><div class="atlas-habitats" role="toolbar" aria-label="按生境筛选地图物种"><button type="button" class="atlas-habitat ${activeHabitat === 'all' ? 'is-active' : ''}" data-atlas-habitat="all" aria-pressed="${activeHabitat === 'all'}"><i class="all-habitats" aria-hidden="true"></i>全部生境<b>${list.length}</b></button>${filters}</div><div class="atlas-list-head"><span>物种 / 主生境</span><span data-atlas-list-count>${list.length} 味</span></div><div class="atlas-species-list" data-atlas-list role="listbox" aria-label="本草物种列表">${list.map((item) => { const habitat = habitatDef(item); return `<button type="button" class="atlas-species ${item.id === selected?.id ? 'is-selected' : ''}" data-atlas-herb="${esc(item.id)}" role="option" aria-selected="${item.id === selected?.id}"><span class="atlas-species-dot" style="--atlas-habitat:${habitat.color}"></span><span><b>${esc(item.nameZh)}</b><small>${esc(item.scientificName || item.pinyin || '')}</small></span><em>${esc(habitat.label)}</em><i data-atlas-record-state="${esc(item.id)}" aria-label="记录状态待载入"></i></button>`; }).join('')}</div></aside><section class="atlas-stage"><div class="atlas-stage-bar"><b class="atlas-focus" data-atlas-focus-label>正在关联本草</b><div class="atlas-mode"><i class="atlas-live-dot"></i><span data-atlas-mode>正在接入开放地图</span></div><div class="atlas-legend"><span><i class="legend-cluster"></i>聚类</span><span><i class="legend-point"></i>开放网格</span><button type="button" class="atlas-locate-reset" data-atlas-locate-reset>回到中国</button></div></div><div class="atlas-map-shell"><div class="atlas-map" data-atlas-map aria-label="中国开放观测聚类地图"></div><canvas class="atlas-canvas" data-atlas-canvas aria-label="离线聚合点地图" tabindex="0" hidden></canvas><div class="atlas-loader" data-atlas-loader role="status"><span class="atlas-loader-ring" aria-hidden="true"></span><span>载入 GBIF 开放观测网格</span></div><div class="atlas-map-caption"><span>中国大陆范围 · 0.5° / 1.0° 聚合</span><span>点位已脱敏为网格中心</span></div></div><div class="atlas-disclaimer"><span>${icon('info')}</span><p><b>读图边界</b> 开放观测不等于药用分布，聚类数量不等于资源储量，也不代表推荐程度或采集地点。记录密度主要反映公众观测活动。</p></div></section><aside class="atlas-detail" data-atlas-detail>${detailMarkup(selected, null)}</aside></section><footer class="atlas-footnote"><span>来源：GBIF occurrence search · 仅使用 CC0 1.0 / CC BY 4.0 坐标记录</span><a href="https://www.gbif.org/" target="_blank" rel="noopener noreferrer">查看 GBIF ↗</a></footer></main>`;
}

function loadStylesheet(href) {
  return new Promise((resolve) => {
    const existing = document.querySelector(`link[data-atlas-style="${href}"]`);
    if (existing) { resolve(); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.atlasStyle = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.append(link);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.maplibregl) { resolve(window.maplibregl); return; }
    const existing = document.querySelector(`script[data-atlas-script="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.maplibregl), { once: true });
      existing.addEventListener('error', () => reject(new Error('MapLibre script failed')), { once: true });
      if (window.maplibregl) resolve(window.maplibregl);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.atlasScript = src;
    script.onload = () => window.maplibregl ? resolve(window.maplibregl) : reject(new Error('MapLibre global unavailable'));
    script.onerror = () => reject(new Error('MapLibre script failed'));
    document.head.append(script);
  });
}

function sourceFeatures(items, snapshot) {
  const features = [];
  items.forEach((item) => {
    const gis = record(snapshot, item.id);
    if (gis?.status !== 'available') return;
    const habitat = habitatDef(item);
    (gis.cells || []).forEach((cell) => {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [cell.lon, cell.lat] },
        properties: { herbId: item.id, nameZh: item.nameZh, habitat: habitat.id, habitatColor: habitat.color, count: cell.count },
      });
    });
  });
  return { type: 'FeatureCollection', features };
}

function localStyle(countries) {
  return {
    version: 8,
    name: 'Herbal Cosmos · Natural Earth',
    sources: {
      countries: { type: 'geojson', data: countries },
    },
    layers: [
      { id: 'paper', type: 'background', paint: { 'background-color': '#07121c' } },
      { id: 'country-fill', type: 'fill', source: 'countries', paint: { 'fill-color': '#142a35', 'fill-opacity': 0.82 } },
      { id: 'country-line', type: 'line', source: 'countries', paint: { 'line-color': '#54727b', 'line-width': 0.7, 'line-opacity': 0.72 } },
    ],
  };
}

function addAtlasLayers(map) {
  if (!map.getSource('herb-cells')) {
    map.addSource('herb-cells', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterRadius: 34,
      clusterMaxZoom: 7,
    });
  }
  if (!map.getLayer('herb-clusters')) {
    map.addLayer({ id: 'herb-clusters', type: 'circle', source: 'herb-cells', filter: ['has', 'point_count'], paint: { 'circle-color': '#e7d3a5', 'circle-opacity': 0.13, 'circle-stroke-color': '#f0deb8', 'circle-stroke-opacity': 0.32, 'circle-stroke-width': 1, 'circle-radius': ['step', ['get', 'point_count'], 8, 8, 12, 24, 17, 80, 22] } });
    if (map.getStyle()?.glyphs) map.addLayer({ id: 'herb-cluster-count', type: 'symbol', source: 'herb-cells', filter: ['has', 'point_count'], layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 10, 'text-font': ['Noto Sans Regular'] }, paint: { 'text-color': '#f8f1df' } });
    map.addLayer({ id: 'herb-point-glow', type: 'circle', source: 'herb-cells', filter: ['!', ['has', 'point_count']], paint: { 'circle-color': ['get', 'habitatColor'], 'circle-radius': 8, 'circle-opacity': 0.12, 'circle-blur': 0.7 } });
    map.addLayer({ id: 'herb-points', type: 'circle', source: 'herb-cells', filter: ['!', ['has', 'point_count']], paint: { 'circle-color': ['get', 'habitatColor'], 'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 3, 8, 5, 20, 7], 'circle-opacity': 0.82, 'circle-stroke-color': '#f8f1df', 'circle-stroke-opacity': 0.65, 'circle-stroke-width': 0.7 } });
  }
  if (!map.getSource('herb-selected')) map.addSource('herb-selected', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  if (!map.getLayer('herb-selected-cells')) map.addLayer({ id: 'herb-selected-cells', type: 'circle', source: 'herb-selected', paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 5.5, 8, 7.5, 20, 10], 'circle-color': '#ffdf9f', 'circle-opacity': 0.82, 'circle-stroke-color': '#fff8e0', 'circle-stroke-width': 1.1, 'circle-stroke-opacity': 0.9 } });
  if (!map.getLayer('herb-selected-ring')) map.addLayer({ id: 'herb-selected-ring', type: 'circle', source: 'herb-selected', paint: { 'circle-radius': 16, 'circle-color': 'transparent', 'circle-stroke-color': '#f8e6b6', 'circle-stroke-width': 1.5, 'circle-opacity': 0.85 } });
}

function setupCanvas(canvas, items, snapshot, state, select) {
  if (!canvas) return { update() {}, dispose() {}, reset() {} };
  const context = canvas.getContext('2d');
  if (!context) return { update() {}, dispose() {}, reset() {} };
  canvas.hidden = false;
  let width = 0;
  let height = 0;
  let frame = 0;
  let zoom = 1;
  let points = [];
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const bounds = { west: 72, east: 136, south: 17, north: 55 };
  const project = (lon, lat) => ({ x: ((lon - bounds.west) / (bounds.east - bounds.west)) * width, y: ((bounds.north - lat) / (bounds.north - bounds.south)) * height });
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(280, Math.round(rect.width || 720));
    height = Math.max(300, Math.round(rect.height || 520));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  const draw = () => {
    cancelAnimationFrame(frame);
    context.clearRect(0, 0, width, height);
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#081723');
    gradient.addColorStop(1, '#10252b');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'rgba(151,184,181,.16)';
    context.lineWidth = 1;
    for (let lon = 75; lon <= 135; lon += 10) { const p = project(lon, bounds.north); context.beginPath(); context.moveTo(p.x, 0); context.lineTo(p.x, height); context.stroke(); }
    for (let lat = 20; lat <= 50; lat += 10) { const p = project(bounds.west, lat); context.beginPath(); context.moveTo(0, p.y); context.lineTo(width, p.y); context.stroke(); }
    context.save();
    context.translate(width * 0.13, height * 0.19);
    context.rotate(-0.08);
    context.strokeStyle = 'rgba(222,209,174,.14)';
    context.strokeRect(0, 0, width * 0.74, height * 0.62);
    context.restore();
    points = [];
    const habitats = new Map(HABITATS.map((habitat) => [habitat.id, habitat.color]));
    items.filter((item) => (state.habitat === 'all' || habitatFor(item) === state.habitat) && (!state.query.trim() || itemText(item).includes(state.query.trim().toLowerCase()))).forEach((item) => {
      const gis = record(snapshot, item.id);
      if (gis?.status !== 'available') return;
      (gis.cells || []).forEach((cell) => {
        const p = project(cell.lon, cell.lat);
        points.push({ ...p, item });
        context.globalAlpha = Math.min(0.88, 0.28 + Math.log10(cell.count + 1) * 0.22);
        context.fillStyle = habitats.get(habitatFor(item)) || '#9aa6b2';
        context.beginPath();
        context.arc(p.x, p.y, 1.8 + Math.min(4, cell.count * 0.13), 0, Math.PI * 2);
        context.fill();
      });
    });
    context.globalAlpha = 1;
    const selected = state.selectedId;
    if (selected) {
      points.filter((point) => point.item.id === selected).forEach((point) => {
        context.beginPath(); context.arc(point.x, point.y, 12, 0, Math.PI * 2); context.fillStyle = 'rgba(255,223,159,.22)'; context.fill(); context.strokeStyle = '#ffdf9f'; context.lineWidth = 1.5; context.stroke();
      });
    }
    context.fillStyle = 'rgba(226,216,192,.72)';
    context.font = '600 10px "Noto Sans SC", sans-serif';
    context.fillText('OFFLINE GRID · 0.5° / 1.0°', 14, height - 16);
  };
  const onClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let nearest = null;
    let distance = 16;
    points.forEach((point) => { const d = Math.hypot(point.x - x, point.y - y); if (d < distance) { nearest = point; distance = d; } });
    if (nearest) select(nearest.item);
  };
  canvas.addEventListener('click', onClick);
  window.addEventListener('resize', resize);
  resize();
  return {
    update() { draw(); },
    reset() { zoom = 1; draw(); },
    dispose() { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('click', onClick); },
  };
}

export async function mountAtlas({ root, items = [], selectedId = '', activeHabitat = 'all', query = '', onSelect, onTrace, onStateChange } = {}) {
  if (!root) return () => {};
  const allItems = items.filter(Boolean);
  const mapNode = root.querySelector('[data-atlas-map]');
  const canvasNode = root.querySelector('[data-atlas-canvas]');
  const loader = root.querySelector('[data-atlas-loader]');
  const modeNode = root.querySelector('[data-atlas-mode]');
  const detailNode = root.querySelector('[data-atlas-detail]');
  const listNode = root.querySelector('[data-atlas-list]');
  const listCount = root.querySelector('[data-atlas-list-count]');
  const searchInput = root.querySelector('[data-atlas-search]');
  const detailAnimator = globalThis.HerbalAutoAnimate?.(detailNode);
  let detailKey = '';
  const state = { habitat: activeHabitat || 'all', query: query || '', selectedId: selectedId || allItems.find((item) => item.id === 'herb-artemisia-annua')?.id || allItems[0]?.id || '' };
  let snapshot = null;
  let map = null;
  let mode = 'loading';
  let fallback = null;
  let debounce = 0;
  let disposed = false;
  let maplibre = null;

  const visibleItems = () => allItems.filter((item) => (state.habitat === 'all' || habitatFor(item) === state.habitat) && (!state.query.trim() || itemText(item).includes(state.query.trim().toLowerCase())));
  const selectedItem = () => allItems.find((item) => item.id === state.selectedId) || null;
  const setMode = (value, label) => {
    mode = value;
    if (modeNode) modeNode.textContent = label;
    root.dataset.atlasMode = value;
  };
  const updateDetail = () => {
    if (!detailNode) return;
    const item = selectedItem();
    const gis = item ? record(snapshot, item.id) : null;
    const key = `${item?.id || 'empty'}:${gis?.status || 'pending'}:${gis?.gridCellCount || 0}`;
    if (key === detailKey) return;
    detailKey = key;
    detailNode.innerHTML = detailMarkup(item, gis);
  };
  const updateList = () => {
    const visible = visibleItems();
    const visibleIds = new Set(visible.map((item) => item.id));
    listNode?.querySelectorAll('[data-atlas-herb]').forEach((button) => {
      const id = button.dataset.atlasHerb;
      const item = allItems.find((entry) => entry.id === id);
      const gis = record(snapshot, id);
      const allowed = visibleIds.has(id);
      button.hidden = !allowed;
      button.classList.toggle('is-selected', id === state.selectedId);
      button.setAttribute('aria-selected', String(id === state.selectedId));
      const badge = button.querySelector('[data-atlas-record-state]');
      if (badge && item) {
        badge.textContent = gis?.status === 'available' ? `${gis.gridCellCount} 格` : '无开放格';
        badge.classList.toggle('is-empty', gis?.status !== 'available');
        badge.setAttribute('aria-label', gis?.status === 'available' ? `${gis.gridCellCount} 个开放网格` : '没有开放坐标记录');
      }
    });
    if (listCount) listCount.textContent = `${visible.length} 味`;
    return visible;
  };
  const selectedCentroid = () => {
    const item = selectedItem();
    const gis = record(snapshot, item?.id);
    if (gis?.status !== 'available') return null;
    if (Array.isArray(gis.centroid)) return { lng: gis.centroid[0], lat: gis.centroid[1] };
    return gis.cells?.[0] ? { lng: gis.cells[0].lon, lat: gis.cells[0].lat } : null;
  };
  const selectedGeoJson = () => {
    const item = selectedItem();
    const gis = record(snapshot, item?.id);
    if (gis?.status !== 'available' || !gis.cells?.length) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: gis.cells.map((cell) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [cell.lon, cell.lat] },
        properties: { herbId: item.id, nameZh: item.nameZh, count: cell.count },
      })),
    };
  };
  const updateFocusLabel = () => {
    const item = selectedItem();
    const gis = record(snapshot, item?.id);
    const label = !item ? '暂无选中本草' : gis?.status === 'available' ? `当前：${item.nameZh} · ${gis.gridCellCount} 格` : `当前：${item.nameZh} · 暂无开放格`;
    const node = root.querySelector('[data-atlas-focus-label]');
    if (node) node.textContent = label;
  };
  const updateMap = () => {
    const visible = visibleItems();
    if (map?.getSource('herb-cells')) map.getSource('herb-cells').setData(sourceFeatures(visible, snapshot));
    if (map?.getSource('herb-selected')) map.getSource('herb-selected').setData(selectedGeoJson());
    if (map?.getLayer('herb-points') && state.selectedId) map.setFilter('herb-points', ['!', ['==', ['get', 'herbId'], state.selectedId]]);
    fallback?.update();
    updateList();
    updateDetail();
    updateFocusLabel();
  };
  const flyToSelected = () => {
    const item = selectedItem();
    const gis = record(snapshot, item?.id);
    if (!map || gis?.status !== 'available') return;
    if (Array.isArray(gis.bounds) && gis.bounds.length === 2) {
      map.fitBounds(gis.bounds, { padding: window.innerWidth < 720 ? 38 : 70, maxZoom: 7.5, duration: 900 });
      return;
    }
    const point = selectedCentroid();
    if (point) map.flyTo({ center: [point.lng, point.lat], zoom: 6, duration: 900 });
  };
  const select = (item, { fly = true } = {}) => {
    if (!item) return;
    state.selectedId = item.id;
    onSelect?.(item);
    updateMap();
    if (fly) flyToSelected();
    const selectedButton = root.querySelector('[data-atlas-herb].is-selected');
    const listRect = listNode?.getBoundingClientRect();
    const buttonRect = selectedButton?.getBoundingClientRect();
    if (listNode && buttonRect && listRect && (buttonRect.top < listRect.top || buttonRect.bottom > listRect.bottom)) listNode.scrollTo({ top: listNode.scrollTop + buttonRect.top - listRect.top - 12, behavior: 'smooth' });
  };
  const reset = () => {
    state.habitat = 'all';
    state.query = '';
    if (searchInput) searchInput.value = '';
    root.querySelectorAll('[data-atlas-habitat]').forEach((button) => { const active = button.dataset.atlasHabitat === 'all'; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    if (map) map.flyTo({ center: [104, 35], zoom: window.innerWidth < 720 ? 2.45 : 3.05, duration: 850 });
    fallback?.reset();
    updateMap();
    onStateChange?.(state);
  };

  const setupMap = async () => {
    await loadStylesheet(new URL('../vendor/maplibre/maplibre-gl.css', import.meta.url).href);
    maplibre = await loadScript(new URL('../vendor/maplibre/maplibre-gl.js', import.meta.url).href);
    if (disposed) return false;
    const ready = (target, style, timeout = 7500) => new Promise((resolve, reject) => {
      let settled = false;
      const finish = (fn, value) => { if (settled) return; settled = true; clearTimeout(timer); fn(value); };
      const timer = setTimeout(() => finish(reject, new Error('Map style timeout')), timeout);
      target.once('load', () => finish(resolve, target));
      target.on('idle', () => finish(resolve, target));
      target._herbalCancel = () => finish(reject, new Error('Map setup cancelled'));
    });
    let candidate;
    try {
      candidate = new maplibre.Map({ container: mapNode, style: ONLINE_STYLE, center: [104, 35], zoom: window.innerWidth < 720 ? 2.45 : 3.05, attributionControl: false, renderWorldCopies: false, maxZoom: 9 });
      await ready(candidate, ONLINE_STYLE, 6500);
      map = candidate;
      setMode('online', 'ONLINE BASEMAP · OPENFREEMAP');
    } catch (error) {
      candidate?._herbalCancel?.();
      candidate?.remove();
      if (disposed) return false;
      const response = await fetch(new URL('./assets/geo/ne_110m_admin_0_countries.geojson', import.meta.url), { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Natural Earth unavailable: ${response.status}`);
      const countries = await response.json();
      map = new maplibre.Map({ container: mapNode, style: localStyle(countries), center: [104, 35], zoom: window.innerWidth < 720 ? 2.45 : 3.05, attributionControl: false, renderWorldCopies: false, maxZoom: 9 });
      await ready(map, 'local', 5500);
      setMode('local', 'LOCAL BASEMAP · NATURAL EARTH');
    }
    if (disposed) { map?.remove(); map = null; return false; }
    addAtlasLayers(map);
    map.on('click', 'herb-clusters', (event) => {
      const feature = event.features?.[0];
      if (!feature) return;
      map.getSource('herb-cells').getClusterExpansionZoom(feature.properties.cluster_id, (error, zoom) => {
        if (error) return;
        map.easeTo({ center: feature.geometry.coordinates, zoom: Number(zoom) + 0.15, duration: 500 });
      });
    });
    map.on('click', 'herb-points', (event) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const item = allItems.find((entry) => entry.id === feature.properties.herbId);
      if (item) select(item, { fly: false });
    });
    ['herb-clusters', 'herb-points'].forEach((layer) => {
      map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
    });
    map.addControl(new maplibre.NavigationControl({ showCompass: false, visualizePitch: false }), 'bottom-right');
    if (loader) loader.hidden = true;
    updateMap();
    if (selectedItem()) flyToSelected();
    return true;
  };

  const setupFallback = () => {
    mapNode.hidden = true;
    canvasNode.hidden = false;
    setMode('canvas', 'OFFLINE GRID · CANVAS');
    fallback = setupCanvas(canvasNode, allItems, snapshot, state, select);
    if (loader) loader.hidden = true;
    updateMap();
  };

  const onRootClick = (event) => {
    const habitat = event.target.closest('[data-atlas-habitat]');
    const herb = event.target.closest('[data-atlas-herb]');
    const trace = event.target.closest('[data-atlas-trace]');
    const locate = event.target.closest('[data-atlas-locate]');
    if (habitat) {
      state.habitat = habitat.dataset.atlasHabitat || 'all';
      root.querySelectorAll('[data-atlas-habitat]').forEach((button) => { const active = button.dataset.atlasHabitat === state.habitat; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
      updateMap();
      onStateChange?.(state);
      return;
    }
    if (herb) { select(allItems.find((item) => item.id === herb.dataset.atlasHerb)); return; }
    if (trace) { const item = allItems.find((entry) => entry.id === trace.dataset.atlasTrace); if (item) onTrace?.(item); return; }
    if (locate) { flyToSelected(); return; }
    if (event.target.closest('[data-atlas-locate-reset]')) { if (map) map.flyTo({ center: [104, 35], zoom: window.innerWidth < 720 ? 2.45 : 3.05, duration: 850 }); fallback?.reset(); return; }
    if (event.target.closest('[data-atlas-reset]')) reset();
  };
  const onSearch = (event) => {
    if (!event.target.matches('[data-atlas-search]')) return;
    state.query = event.target.value;
    clearTimeout(debounce);
    debounce = setTimeout(() => { updateMap(); onStateChange?.(state); }, 140);
  };
  const onListKey = (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key) || !event.target.closest('[data-atlas-herb]')) return;
    event.preventDefault();
    const buttons = [...listNode.querySelectorAll('[data-atlas-herb]:not([hidden])')];
    const index = buttons.indexOf(event.target.closest('[data-atlas-herb]'));
    const next = buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length];
    next?.focus();
  };
  root.addEventListener('click', onRootClick);
  root.addEventListener('input', onSearch);
  listNode?.addEventListener('keydown', onListKey);

  try {
    const response = await fetch(new URL('./data/generated/gbif-snapshot.json', import.meta.url).href + `?v=${DATA_VERSION}`, { cache: 'reload' });
    if (!response.ok) throw new Error(`GBIF snapshot unavailable: ${response.status}`);
    snapshot = await response.json();
    if (disposed) return () => {};
    updateList();
    updateDetail();
    const loaded = await setupMap().catch(() => false);
    if (!loaded) setupFallback();
  } catch (error) {
    if (loader) loader.innerHTML = '<span>开放地图暂不可用，已切换到物种与档案列表。</span>';
    setMode('offline', 'ATLAS DATA UNAVAILABLE');
    root.classList.add('is-atlas-error');
  }

  return () => {
    disposed = true;
    clearTimeout(debounce);
    root.removeEventListener('click', onRootClick);
    root.removeEventListener('input', onSearch);
    listNode?.removeEventListener('keydown', onListKey);
    fallback?.dispose();
    detailAnimator?.();
    map?._herbalCancel?.();
    map?.remove();
    map = null;
  };
}
