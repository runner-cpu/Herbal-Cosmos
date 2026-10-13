/**
 * 本草宇宙 · 粒子星球
 *
 * A dependency-free, canvas based sphere for the planet route. The module is
 * intentionally data-shape tolerant so catalog expansion can add herbs without
 * changing the visual layer. Each rendered particle keeps the source `id`.
 */

const HABITAT_COLORS = {
  mountain: '#d86a4f',
  meadow: '#80c7a7',
  flower: '#e8a7cb',
  fruit: '#f1c46f',
  wetland: '#62b7cc',
  fungus: '#b39ae3',
  unknown: '#c7d0d7',
};

const HABITATS = [
  { id: 'mountain', label: '山林根境', color: HABITAT_COLORS.mountain },
  { id: 'meadow', label: '草甸原野', color: HABITAT_COLORS.meadow },
  { id: 'flower', label: '花野芳香', color: HABITAT_COLORS.flower },
  { id: 'fruit', label: '果实种籽', color: HABITAT_COLORS.fruit },
  { id: 'wetland', label: '水泽湿地', color: HABITAT_COLORS.wetland },
  { id: 'fungus', label: '菌木阴翳', color: HABITAT_COLORS.fungus },
];

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const normaliseHabitat = (item = {}) => {
  const value = item.habitat || item.habitatId || item.environment || '';
  if (HABITATS.some((entry) => entry.id === value)) return value;
  const aliases = { forest: 'mountain', mountain: 'mountain', shanlin: 'mountain', grassland: 'meadow', meadow: 'meadow', caodian: 'meadow', aromatic: 'flower', flower: 'flower', huaye: 'flower', seed: 'fruit', fruit: 'fruit', guoshi: 'fruit', water: 'wetland', wetland: 'wetland', shuize: 'wetland', shade: 'fungus', fungus: 'fungus', junmu: 'fungus' };
  if (aliases[value]) return aliases[value];
  const text = `${value} ${item.habitatLabel || ''} ${item.tags || ''}`;
  if (/山林|根境|林下|山地/.test(text)) return 'mountain';
  if (/草甸|原野|草原|平原/.test(text)) return 'meadow';
  if (/花野|芳香|花卉/.test(text)) return 'flower';
  if (/果实|种籽|果园/.test(text)) return 'fruit';
  if (/水泽|湿地|水生|湖/.test(text)) return 'wetland';
  if (/菌木|阴翳|菌|木本/.test(text)) return 'fungus';
  return 'unknown';
};
const habitatLabel = (item) => item.habitatLabel || HABITATS.find((entry) => entry.id === normaliseHabitat(item))?.label || '未归类';
const itemText = (item) => `${item.nameZh || ''} ${item.pinyin || ''} ${item.scientificName || ''} ${item.tags || ''} ${item.morphology || ''}`.toLowerCase();

/** Return a stable set of sphere positions using a Fibonacci lattice. */
function fibonacciPositions(count) {
  if (!count) return [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });
}

function project(point, rotationX, rotationY, radius, width, height, zoom) {
  const cosY = Math.cos(rotationY); const sinY = Math.sin(rotationY);
  const cosX = Math.cos(rotationX); const sinX = Math.sin(rotationX);
  const x1 = point.x * cosY - point.z * sinY;
  const z1 = point.x * sinY + point.z * cosY;
  const y1 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;
  const depth = (z2 + 1) / 2;
  const perspective = 0.79 + depth * 0.21;
  return {
    x: width / 2 + x1 * radius * zoom * perspective,
    y: height / 2 + y1 * radius * zoom * perspective,
    z: z2,
    depth,
    scale: perspective,
  };
}

function detailMarkup(item, selected = false) {
  if (!item) return '<div class="planet-detail-empty"><span class="planet-detail-orbit">◎</span><p>点击任意粒子，打开一味本草的星际档案。</p></div>';
  const tags = Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(/[，,、|]/).filter(Boolean) : []);
  const image = item.image?.status === 'ready' ? `<figure class="planet-detail-image" data-image-open="${esc(item.id || '')}" tabindex="0" role="button" aria-label="放大查看${esc(item.nameZh || '本草')}照片"><img src="${esc(item.image.path)}" alt="${esc(item.nameZh || '本草')}植物照片" loading="lazy" decoding="async" /><figcaption>${esc(item.image.creator || 'GBIF 公开观测')} · 点击放大</figcaption></figure>` : '';
  return `<div class="planet-detail-head"><span class="planet-detail-kicker">PARTICLE PROFILE · ${esc(habitatLabel(item))}</span><button class="planet-detail-close" type="button" data-planet-close aria-label="关闭粒子详情">×</button></div>${image}<div class="planet-detail-orb" style="--planet-orb:${esc(HABITAT_COLORS[normaliseHabitat(item)] || HABITAT_COLORS.unknown)}"><span>${esc((item.nameZh || '本').slice(0, 1))}</span></div><h2>${esc(item.nameZh || '未命名本草')}</h2><p class="planet-detail-latin">${esc(item.scientificName || item.pinyin || '')}</p><p class="planet-detail-summary">${esc(item.identitySummary || item.morphology || '这味本草的身份资料正在补录。')}</p><dl class="planet-detail-facts"><div><dt>主生境</dt><dd>${esc(habitatLabel(item))}</dd></div><div><dt>药用部位</dt><dd>${esc(item.partUsed || '待补')}</dd></div><div><dt>目录级别</dt><dd>${esc(item.depthLevel || item.catalogStatus || '拓展条目')}</dd></div></dl>${tags.length ? `<div class="planet-detail-tags">${tags.slice(0, 6).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>` : ''}<p class="planet-detail-boundary">${esc(item.boundary || '本页用于本草识别与文化阅读，不替代专业鉴定或医疗建议。')}</p><button type="button" class="planet-detail-action" data-planet-trace="${esc(item.id || '')}">打开一味档案 <span>↗</span></button>`;
}

/**
 * Render the static shell. Call `mountParticlePlanet` after inserting it.
 */
export function particlePlanetMarkup({ items = [], activeHabitat = 'all', query = '', selectedId = '' } = {}) {
  const list = Array.isArray(items) ? items : [];
  const count = list.length;
  const filters = HABITATS.map((habitat) => `<button type="button" class="planet-filter ${activeHabitat === habitat.id ? 'active' : ''}" data-planet-habitat="${habitat.id}" aria-pressed="${activeHabitat === habitat.id}"><i style="--planet-filter-color:${habitat.color}"></i>${habitat.label}<b>${list.filter((item) => normaliseHabitat(item) === habitat.id).length}</b></button>`).join('');
  return `<section class="planet-view" data-planet-root data-planet-active="${esc(activeHabitat)}" data-planet-selected="${esc(selectedId)}" aria-labelledby="planet-title"><div class="planet-intro"><div><p class="planet-kicker">PARTICLE PLANET · 02</p><h1 id="planet-title">一颗星球，<em>百子万象。</em></h1><p class="planet-lead">每一味本草都是星球上的一个粒子。按生境着色，拖动旋转、滚轮缩放，点击任意粒子打开它的一味档案。</p></div><div class="planet-count"><strong>${count || '0'}</strong><span>味本草粒子<br />一颗总星球</span></div></div><div class="planet-toolbar"><label class="planet-search"><span aria-hidden="true">⌕</span><input type="search" data-planet-search value="${esc(query)}" placeholder="搜索本草名称、学名或标签" aria-label="搜索粒子星球" /></label><div class="planet-filters" role="toolbar" aria-label="按生境筛选"><button type="button" class="planet-filter ${activeHabitat === 'all' ? 'active' : ''}" data-planet-habitat="all" aria-pressed="${activeHabitat === 'all'}">全部<b>${count}</b></button>${filters}</div></div><div class="planet-layout"><div class="planet-stage-wrap"><div class="planet-stage" data-planet-stage><canvas data-planet-canvas data-planet-interaction="rotate zoom select" data-planet-rotate data-planet-zoom data-planet-select tabindex="0" role="img" aria-label="可拖拽旋转的本草粒子星球"></canvas><div class="planet-stage-hud"><span><i class="planet-live-dot"></i> LIVE CATALOG</span><span data-planet-count>${count} 粒子</span></div><div class="planet-stage-hint">拖动旋转 · 滚轮缩放 · 点击粒子</div></div><div class="planet-fallback" data-planet-fallback aria-label="粒子星球键盘目录"></div></div><aside class="planet-detail" data-planet-detail aria-live="polite">${detailMarkup(list.find((item) => item.id === selectedId))}</aside></div><p class="planet-boundary-note">粒子位置仅用于浏览，不表达药效或重要性排序。主生境唯一，多标签可扩展；完整出处请进入一味档案。</p></section>`;
}

/** Convenience adapter for the app's shared `data` + `state` shape. */
export function renderPlanet(data, state = {}) {
  const items = data?.herbs?.herbs || data?.herbs || [];
  return particlePlanetMarkup({
    items,
    activeHabitat: state.planetHabitat || state.habitat || 'all',
    query: state.planetQuery || state.query || '',
    selectedId: state.planetHerbId || state.selectedId || '',
  });
}

/**
 * Mount interactions on a rendered `[data-planet-root]` element.
 *
 * Options:
 * - onSelect(item): called when a particle is selected.
 * - onTrace(item): called by the detail action.
 * - onFilter(habitat): called when a habitat filter changes.
 * - onSearch(query): called when search changes.
 * - onStateChange(state): called after local interaction state changes.
 */
export function mountParticlePlanet(root, items = [], options = {}) {
  if (!root) return () => {};
  const catalog = Array.isArray(items) ? items.filter(Boolean) : [];
  const canvas = root.querySelector('[data-planet-canvas]');
  const fallback = root.querySelector('[data-planet-fallback]');
  const detail = root.querySelector('[data-planet-detail]');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const state = {
    habitat: root.dataset.planetActive || 'all',
    query: root.querySelector('[data-planet-search]')?.value || '',
    selectedId: root.dataset.planetSelected || '',
    rotationX: -0.18,
    rotationY: 0.34,
    zoom: 1,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    velocityX: 0,
    velocityY: 0,
    moved: false,
    activePointers: new Map(),
    pinchDistance: 0,
  };
  const positions = fibonacciPositions(catalog.length);
  const points = catalog.map((item, index) => ({ item, position: positions[index] }));
  let frame = 0;
  let width = 0;
  let height = 0;
  let resizeObserver;

  const filtered = () => points.filter(({ item }) => state.habitat === 'all' || normaliseHabitat(item) === state.habitat).filter(({ item }) => !state.query.trim() || itemText(item).includes(state.query.trim().toLowerCase()));
  const ensureSelection = () => {
    const visible = filtered();
    if (!visible.some(({ item }) => item.id === state.selectedId)) {
      const next = visible[0]?.item || null;
      state.selectedId = next?.id || '';
      root.dataset.planetSelected = state.selectedId;
      if (detail) detail.innerHTML = detailMarkup(next, Boolean(next));
    }
    return visible;
  };
  const notify = () => options.onStateChange?.({ habitat: state.habitat, query: state.query, selectedId: state.selectedId, zoom: state.zoom, rotationX: state.rotationX, rotationY: state.rotationY });
  const select = (item) => {
    if (!item) return;
    state.selectedId = item.id;
    if (detail) detail.innerHTML = detailMarkup(item, true);
    root.dataset.planetSelected = item.id || '';
    renderFallback();
    options.onSelect?.(item);
    notify();
    draw();
  };
  const updateFilter = () => {
    const visible = ensureSelection();
    root.querySelectorAll('[data-planet-habitat]').forEach((button) => {
      const active = button.dataset.planetHabitat === state.habitat;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (fallback) renderFallback();
    const countNode = root.querySelector('[data-planet-count]');
    if (countNode) countNode.textContent = `${filtered().length} 粒子`;
    draw();
    options.onFilter?.(state.habitat);
    notify();
  };
  const renderFallback = () => {
    if (!fallback) return;
    const visible = filtered();
    fallback.innerHTML = `<div class="planet-fallback-head"><span>键盘目录</span><b>${visible.length} 味</b></div>${visible.map(({ item }) => `<button type="button" class="planet-fallback-item ${item.id === state.selectedId ? 'active' : ''}" data-planet-fallback-id="${esc(item.id)}"><span class="planet-fallback-dot" style="--planet-particle:${HABITAT_COLORS[normaliseHabitat(item)] || HABITAT_COLORS.unknown}"></span><span><b>${esc(item.nameZh || '未命名')}</b><small>${esc(item.scientificName || item.pinyin || '')}</small></span></button>`).join('') || '<p class="planet-fallback-empty">没有匹配的粒子。试试其他生境或关键词。</p>'}`;
  };
  const resize = () => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    width = Math.max(280, rect.width || canvas.parentElement?.clientWidth || 600);
    height = Math.max(360, rect.height || 560);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  const draw = () => {
    if (!canvas || !width || !height) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width, height) * 0.39;
    const gradient = context.createRadialGradient(width * 0.41, height * 0.38, radius * 0.08, width * 0.5, height * 0.5, radius * 1.04);
    gradient.addColorStop(0, 'rgba(47, 62, 112, .56)');
    gradient.addColorStop(.62, 'rgba(21, 28, 64, .84)');
    gradient.addColorStop(1, 'rgba(10, 14, 35, .03)');
    context.beginPath(); context.arc(width / 2, height / 2, radius * state.zoom, 0, Math.PI * 2); context.fillStyle = gradient; context.fill();
    context.beginPath(); context.arc(width / 2, height / 2, radius * state.zoom * .98, 0, Math.PI * 2); context.strokeStyle = 'rgba(140, 157, 225, .28)'; context.lineWidth = 1; context.stroke();
    const visible = filtered().map(({ item, position }) => ({ item, projected: project(position, state.rotationX, state.rotationY, radius, width, height, state.zoom) })).sort((a, b) => a.projected.z - b.projected.z);
    visible.forEach(({ item, projected }) => {
      const color = HABITAT_COLORS[normaliseHabitat(item)] || HABITAT_COLORS.unknown;
      const active = item.id === state.selectedId;
      const alpha = Math.max(.18, .35 + projected.depth * .65);
      const particleRadius = (active ? 5 : 2.4 + projected.depth * 2.2) * Math.max(.8, state.zoom * .9);
      context.globalAlpha = alpha;
      context.beginPath(); context.arc(projected.x, projected.y, particleRadius * (active ? 2.3 : 1.8), 0, Math.PI * 2); context.fillStyle = color; context.globalAlpha = alpha * .16; context.fill();
      context.globalAlpha = alpha;
      context.beginPath(); context.arc(projected.x, projected.y, particleRadius, 0, Math.PI * 2); context.fillStyle = color; context.fill();
      if (active) { context.globalAlpha = 1; context.beginPath(); context.arc(projected.x, projected.y, particleRadius + 6, 0, Math.PI * 2); context.strokeStyle = color; context.lineWidth = 1.4; context.stroke(); }
    });
    context.globalAlpha = 1;
    const selected = catalog.find((item) => item.id === state.selectedId);
    if (selected) {
      const point = visible.find(({ item }) => item.id === selected.id);
      if (point && point.projected.z > -0.95) { context.font = '600 12px "Noto Sans SC", sans-serif'; context.fillStyle = 'rgba(248, 243, 233, .92)'; context.fillText(selected.nameZh || '', point.projected.x + 11, point.projected.y - 9); }
    }
    if (!reduced && !state.dragging && (Math.abs(state.velocityX) > .0001 || Math.abs(state.velocityY) > .0001)) {
      state.rotationY += state.velocityY;
      state.rotationX += state.velocityX;
      state.velocityX *= .94; state.velocityY *= .94;
      frame = requestAnimationFrame(draw);
    }
  };
  const canvasPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const nearest = (event) => {
    const point = canvasPoint(event);
    const radius = Math.min(width, height) * .39;
    let candidate = null; let distance = Infinity;
    filtered().forEach(({ item, position }) => {
      const projected = project(position, state.rotationX, state.rotationY, radius, width, height, state.zoom);
      const delta = Math.hypot(projected.x - point.x, projected.y - point.y);
      const hit = Math.max(12, 9 * projected.scale * state.zoom);
      if (delta < hit && delta < distance && projected.z > -.72) { candidate = item; distance = delta; }
    });
    return candidate;
  };
  const onPointerDown = (event) => {
    if (!canvas) return;
    state.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.activePointers.size >= 2) {
      state.moved = true;
      const [a, b] = [...state.activePointers.values()];
      state.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      state.dragging = false;
      canvas.classList.remove('is-dragging');
      return;
    }
    state.dragging = true; state.moved = false; state.pointerId = event.pointerId; state.lastX = event.clientX; state.lastY = event.clientY; state.velocityX = 0; state.velocityY = 0; canvas.setPointerCapture?.(event.pointerId); canvas.classList.add('is-dragging');
  };
  const onPointerMove = (event) => {
    if (state.activePointers.has(event.pointerId)) state.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.activePointers.size >= 2) {
      const [a, b] = [...state.activePointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (state.pinchDistance > 0) state.zoom = Math.min(1.55, Math.max(.7, state.zoom * (distance / state.pinchDistance)));
      state.pinchDistance = distance;
      draw();
      notify();
      return;
    }
    if (!state.dragging || (state.pointerId !== null && event.pointerId !== state.pointerId)) return;
    const dx = event.clientX - state.lastX; const dy = event.clientY - state.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) state.moved = true;
    state.rotationY += dx * .008; state.rotationX += dy * .008; state.velocityY = dx * .008; state.velocityX = dy * .008; state.lastX = event.clientX; state.lastY = event.clientY; draw();
  };
  const onPointerUp = (event) => {
    state.activePointers.delete(event.pointerId);
    if (state.activePointers.size < 2) state.pinchDistance = 0;
    if (!state.dragging || (state.pointerId !== null && event.pointerId !== state.pointerId)) return;
    state.dragging = false; state.pointerId = null; canvas.classList.remove('is-dragging');
    if (!reduced) { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); }
  };
  const onClick = (event) => {
    if (state.moved) { state.moved = false; return; }
    const item = nearest(event); if (item) select(item);
  };
  const onWheel = (event) => { event.preventDefault(); state.zoom = Math.min(1.55, Math.max(.7, state.zoom * (event.deltaY > 0 ? .92 : 1.08))); draw(); notify(); };
  const onKey = (event) => {
    if (event.key === '+' || event.key === '=') { state.zoom = Math.min(1.55, state.zoom + .08); draw(); notify(); }
    else if (event.key === '-' || event.key === '_') { state.zoom = Math.max(.7, state.zoom - .08); draw(); notify(); }
    else if (event.key === 'ArrowLeft') { state.rotationY -= .12; draw(); }
    else if (event.key === 'ArrowRight') { state.rotationY += .12; draw(); }
    else if (event.key === 'ArrowUp') { state.rotationX -= .12; draw(); }
    else if (event.key === 'ArrowDown') { state.rotationX += .12; draw(); }
  };
  const onSearch = (event) => { state.query = event.target.value; ensureSelection(); renderFallback(); const countNode = root.querySelector('[data-planet-count]'); if (countNode) countNode.textContent = `${filtered().length} 粒子`; draw(); options.onSearch?.(state.query); notify(); };
  const onRootClick = (event) => {
    const habitat = event.target.closest('[data-planet-habitat]');
    const fallbackButton = event.target.closest('[data-planet-fallback-id]');
    const close = event.target.closest('[data-planet-close]');
    const trace = event.target.closest('[data-planet-trace]');
    if (habitat) { state.habitat = habitat.dataset.planetHabitat || 'all'; root.dataset.planetActive = state.habitat; updateFilter(); return; }
    if (fallbackButton) { select(catalog.find((item) => item.id === fallbackButton.dataset.planetFallbackId)); return; }
    if (close) { state.selectedId = ''; root.dataset.planetSelected = ''; if (detail) detail.innerHTML = detailMarkup(null); renderFallback(); draw(); notify(); return; }
    if (trace) { const item = catalog.find((entry) => entry.id === trace.dataset.planetTrace); if (item) options.onTrace?.(item); }
  };
  canvas?.addEventListener('pointerdown', onPointerDown);
  canvas?.addEventListener('pointermove', onPointerMove);
  canvas?.addEventListener('pointerup', onPointerUp);
  canvas?.addEventListener('pointercancel', onPointerUp);
  canvas?.addEventListener('click', onClick);
  canvas?.addEventListener('wheel', onWheel, { passive: false });
  canvas?.addEventListener('keydown', onKey);
  root.addEventListener('input', onSearch);
  root.addEventListener('click', onRootClick);
  if (window.ResizeObserver) { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas?.parentElement || root); } else window.addEventListener('resize', resize);
  ensureSelection(); renderFallback(); resize();
  if (!reduced) { state.velocityY = .0007; frame = requestAnimationFrame(draw); }
  return () => {
    cancelAnimationFrame(frame); resizeObserver?.disconnect(); window.removeEventListener('resize', resize); canvas?.removeEventListener('pointerdown', onPointerDown); canvas?.removeEventListener('pointermove', onPointerMove); canvas?.removeEventListener('pointerup', onPointerUp); canvas?.removeEventListener('pointercancel', onPointerUp); canvas?.removeEventListener('click', onClick); canvas?.removeEventListener('wheel', onWheel); canvas?.removeEventListener('keydown', onKey); root.removeEventListener('input', onSearch); root.removeEventListener('click', onRootClick);
  };
}

export { HABITATS, HABITAT_COLORS, normaliseHabitat, fibonacciPositions, detailMarkup };
