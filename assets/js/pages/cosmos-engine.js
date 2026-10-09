/* 星云引擎 V2：光晕精灵预渲染 + 加色混合 + 景深 + 四种读法。
 * 与 runtime.js 解耦：几何、绘制、交互都收在这里，宿主只提供数据与回调。
 * 关键优化：把每帧 902 次 createRadialGradient 换成一次性的离屏精灵 + drawImage。
 * 以 classic script 形式加载（与 culture.js / insights.js 一致），暴露 window.HerbalCosmosEngine。 */
(function () {
  'use strict';

  const REGION_OF_PROVINCE = Object.freeze({
    青藏: ['西藏', '青海'],
    西北: ['新疆', '宁夏', '甘肃', '陕西'],
    北方: ['内蒙古', '黑龙江', '吉林', '辽宁', '河北', '山西'],
    西南: ['云南', '贵州', '四川', '广西'],
    东南: ['广东', '福建', '海南', '台湾', '湖南', '湖北', '江西', '浙江', '安徽', '江苏', '山东', '河南', '天津']
  });
  const REGION_COLORS = Object.freeze({
    青藏: '#C08A5A', 西北: '#C9A24F', 北方: '#5C8A6E',
    西南: '#4F7F5C', 东南: '#4A7590', unknown: '#7E8783'
  });
  const QI_COLORS = Object.freeze({
    大寒: '#4E7BA8', 寒: '#628FB4', 微寒: '#87AEC6', 凉: '#A6C6D4',
    平: '#E2DAC0', 微温: '#DCBB8A', 温: '#CE9A67', 热: '#C1734C', 大热: '#AE4738'
  });
  const UNIFORM_COLOR = '#D8C9A8';
  const ETHNIC_COLOR = '#E8C06A';
  const DIM_COLOR = '#465850';
  const READING_MODES = Object.freeze(['category', 'geography', 'nature', 'ethnic']);
  const READING_LABELS = Object.freeze({ category: '资料分类', geography: '文献分布', nature: '药性', ethnic: '民族对照' });
  const DEFAULT_READING = 'category';
  const GLOW_SIZE = 128;
  const GLOW_ALPHA_BY_THEME = Object.freeze({ day: 0.55, night: 1, ink: 0.72 });
  const DEPTH_RANGE = 300;
  const FOV = 640;
  const REVEAL = Object.freeze({ dustMs: 800, starMs: 1200, spread: 0.75, ramp: 0.45 });

  function hexWithAlpha(color, alpha) {
    const match = String(color || '').trim().match(/^#([0-9a-f]{6})$/i);
    if (!match) return color;
    const value = parseInt(match[1], 16);
    return 'rgba(' + ((value >> 16) & 255) + ',' + ((value >> 8) & 255) + ',' + (value & 255) + ',' + alpha + ')';
  }

  function regionOf(origin) {
    const regions = regionsOf(origin);
    return regions.length === 1 ? regions[0] : regions.length ? 'multiple' : 'unknown';
  }
  function regionsOf(origin) {
    const list = Array.isArray(origin) ? origin : [];
    return Object.keys(REGION_OF_PROVINCE).filter(region => list.some(province => REGION_OF_PROVINCE[region].includes(province)));
  }

  function colorForReading(herb = {}, mode = DEFAULT_READING, options = {}) {
    if (mode === 'geography') return regionOf(herb.origin) === 'multiple' ? UNIFORM_COLOR : REGION_COLORS[regionOf(herb.origin)] || REGION_COLORS.unknown;
    if (mode === 'nature') return QI_COLORS[herb.qi] || REGION_COLORS.unknown;
    if (mode === 'ethnic') return options.ethnicIds?.has?.(herb.id) ? ETHNIC_COLOR : DIM_COLOR;
    if (options.uniform) return UNIFORM_COLOR;
    return typeof options.categoryColor === 'function' ? (options.categoryColor(herb) || UNIFORM_COLOR) : UNIFORM_COLOR;
  }

  function legendFor(mode, options = {}) {
    if (mode === 'geography') return [...Object.keys(REGION_COLORS).map(key => ({ label: key === 'unknown' ? '无分布记录' : key, color: REGION_COLORS[key] })), { label: '跨区记录', color: UNIFORM_COLOR }];
    if (mode === 'nature') return Object.keys(QI_COLORS).map(key => ({ label: key, color: QI_COLORS[key] }));
    if (mode === 'ethnic') return [{ label: '有对照线索', color: ETHNIC_COLOR }, { label: '未标注', color: DIM_COLOR }];
    return (options.categories || []).map(item => ({ label: item.name, color: item.color }));
  }

  function particleBudget(env = {}) {
    // 902 星辰 + 微尘总数必须守住 2500 上限：移动端 1500 → 2,402。
    if (env.mobile || (env.cores || 4) <= 4) return { dust: 1500 };
    if ((env.dpr || 1) > 2 || (env.cores || 4) >= 8) return { dust: 6000 };
    return { dust: 3600 };
  }

  function depthBlur(zr, range = DEPTH_RANGE) {
    return Math.max(0, Math.min(1, Math.abs(zr) / range));
  }

  function dustReveal(elapsed, timing = REVEAL) {
    return Math.max(0, Math.min(1, elapsed / timing.dustMs));
  }

  function starReveal(index, total, elapsed, timing = REVEAL) {
    const span = timing.starMs * timing.spread;
    const delay = timing.dustMs + (total > 1 ? (index / total) * span : 0);
    if (elapsed >= timing.dustMs + timing.starMs) return 1;
    if (elapsed <= delay) return 0;
    return Math.max(0, Math.min(1, (elapsed - delay) / (timing.starMs * timing.ramp)));
  }

  function createGlowSprite(color, dpr = 1, size = GLOW_SIZE) {
    if (typeof document === 'undefined') return null;
    const px = Math.max(8, Math.round(size * dpr));
    const sprite = document.createElement('canvas');
    sprite.width = px; sprite.height = px;
    const ctx = sprite.getContext('2d');
    if (!ctx) return sprite;
    const center = px / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, hexWithAlpha(color, 1));
    gradient.addColorStop(0.35, hexWithAlpha(color, 0.55));
    gradient.addColorStop(0.72, hexWithAlpha(color, 0.18));
    gradient.addColorStop(1, hexWithAlpha(color, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, px, px);
    return sprite;
  }

  function supported() {
    if (typeof document === 'undefined') return false;
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext && probe.getContext('2d'));
  }

  function mount(canvas, host = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const herbs = host.herbs || [];
    const layoutApi = window.HerbalCosmosLayout;
    const layout = layoutApi.build(herbs, host.formulas || []);
    const reducedQuery = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;
    const mobileQuery = typeof window !== 'undefined' ? window.matchMedia?.('(max-width: 768px)') : null;

    let W = 0, H = 0, DPR = 1;
    let stars = [], dust = [];
    let rotY = 0, targetRotY = 0, scale = 1, targetScale = 1;
    let dragging = false, lastX = 0, lastY = 0, moved = 0;
    let hoverId = null, focusedId = null, panY = 0, targetPanY = 0;
    let running = false, animationFrame = 0, lastFrameAt = 0, disposed = false;
    let categoryFilter = '', regionFilters = new Set(), roam = false;
    let manuallyRotated = false;
    let webgl = null, webglCanvas = null, loadingRenderer = null, rendererAttempted = false, rendererReason = '';
    let rendererChoice = host.renderer || 'auto';
    let rendererEpoch = 0;
    let renderMs = 0, frames = 0;
    const listeners = [];
    const on = (name, fn, options) => { canvas.addEventListener(name, fn, options); listeners.push([name, fn, options]); };
    let reading = DEFAULT_READING;
    let degradeLevel = 0;
    let revealed = false, revealStart = 0;
    let firstFrameMs = 0;
    let spriteReadyMs = 0;
    const frameSamples = [];
    let stableSince = 0;
    const sprites = new Map();
    const activePointers = new Map();
    let pinchDistance = 0;

    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', '本草星图：点选知识卡；进入漫游后可拖动与缩放，也可通过顶部搜索定位。');
    canvas.dataset.renderer = 'canvas';

    function invalidate() {
      if (running && !disposed && !animationFrame) animationFrame = requestAnimationFrame(frame);
    }
    function rendererStatus(reason = '') {
      rendererReason = reason;
      canvas.dataset.renderer = webgl ? 'webgl' : rendererChoice === 'static' ? 'static' : 'canvas';
      window.dispatchEvent(new CustomEvent('herbal:cosmos-renderer', { detail: { renderer: canvas.dataset.renderer, reason } }));
    }
    function fallback(reason) {
      webgl?.dispose(); webgl = null;
      webglCanvas?.remove(); webglCanvas = null;
      rendererStatus(reason); invalidate();
    }
    async function enhance() {
      if (rendererAttempted || rendererChoice === 'canvas' || rendererChoice === 'static' || !/^https?:$/.test(location.protocol) || !revealEnabled()) return;
      rendererAttempted = true;
      const epoch = rendererEpoch;
      try {
        loadingRenderer = import('../../vendor/cosmos-webgl.js');
        const module = await loadingRenderer;
        if (disposed || epoch !== rendererEpoch || webgl || rendererChoice === 'canvas' || rendererChoice === 'static') return;
        const layer = document.createElement('canvas');
        layer.className = 'cosmos-webgl'; layer.setAttribute('aria-hidden', 'true');
        canvas.before(layer); webglCanvas = layer;
        // Covers all device budgets, including viewport changes after mount.
        webgl = module.createRenderer(layer, fallback, layout.nodes.length + particleBudget({ cores: 8 }).dust);
        rendererStatus(); invalidate();
      } catch (_) { if (!disposed) fallback('增强画面不可用，已使用基础星图'); }
      finally { loadingRenderer = null; }
    }

    function themeName() {
      const value = document.documentElement.dataset.theme;
      return value === 'night' || value === 'ink' ? value : 'day';
    }
    function glowAlpha() {
      const base = GLOW_ALPHA_BY_THEME[themeName()] ?? 1;
      return degradeLevel >= 2 ? 0 : base;
    }
    function favorite(id) { return Boolean(host.isFavorite?.(id)); }
    function sprite(color) {
      const key = color + '|' + DPR;
      let value = sprites.get(key);
      if (!value) { value = createGlowSprite(color, DPR); sprites.set(key, value); }
      return value;
    }
    function budget() {
      const env = {
        mobile: Boolean(mobileQuery?.matches),
        cores: (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4,
        dpr: (typeof window !== 'undefined' && window.devicePixelRatio) || 1
      };
      return particleBudget(env);
    }

    function resize() {
      DPR = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, W * DPR); canvas.height = Math.max(1, H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      invalidate();
    }

    function colorInputs() {
      return {
        uniform: host.colorMode?.() === 'uniform',
        categoryColor: host.categoryColor,
        ethnicIds: host.ethnicIds?.()
      };
    }
    function paint() {
      const inputs = colorInputs();
      for (const star of stars) { star.color = colorForReading(star.herb || {}, reading, inputs); star.size = favorite(star.id) ? 3.2 : 2.2; }
      warmSprites();
      invalidate();
    }

    // 精灵生成是一次性开销：必须在进入渲染循环之前完成，否则首帧会包含
    // 十几次离屏 canvas 创建，把首帧耗时推到预算之外。
    function warmSprites() {
      const started = typeof performance !== 'undefined' ? performance.now() : 0;
      for (const color of new Set(stars.map(star => star.color))) sprite(color);
      if (started) spriteReadyMs = Math.round((performance.now() - started) * 100) / 100;
      return spriteReadyMs;
    }

    function buildStars() {
      const inputs = colorInputs();
      const byId = new Map(herbs.map(h => [h.id, h]));
      stars = layout.nodes.map(node => {
        const herb = byId.get(node.id);
        return {
          id: herb.id, name: herb.name,
          ...node, tx: node.x, ty: node.y, tz: node.z,
          size: favorite(herb.id) ? 3.2 : 2.2,
          herb,
          color: colorForReading(herb, reading, inputs),
          screenX: 0, screenY: 0, persp: 1, zr: 0, viewed: false
        };
      });
      warmSprites();
      const count = Math.max(0, Math.round(budget().dust * (degradeLevel >= 1 ? 0.5 : 1)));
      dust = [];
      for (let i = 0; i < count; i += 1) {
        const r = 260 + Math.random() * 240;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        dust.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.cos(phi) * Math.sin(theta) * 0.7,
          z: r * Math.sin(phi) * Math.sin(theta),
          s: Math.random() * 1.4 + 0.3,
          a: Math.random() * 0.5 + 0.08,
          tw: Math.random() * Math.PI * 2
        });
      }
      setRelationPositions();
      invalidate();
    }

    function setRelationPositions() {
      const positions = focusedId ? layoutApi.selectedPositions(layout, focusedId) : layout.nodes;
      const targets = new Map(positions.map(n => [n.id, n]));
      for (const star of stars) {
        const target = targets.get(star.id);
        star.tx = target.x; star.ty = target.y; star.tz = target.z;
        if (!revealEnabled()) { star.x = star.tx; star.y = star.ty; star.z = star.tz; }
      }
    }
    function visible(star) {
      return (!categoryFilter || star.category === categoryFilter) && (reading !== 'geography' || !regionFilters.size || regionsOf(star.herb.origin).some(region => regionFilters.has(region)));
    }

    function project(x, y, z) {
      const c = Math.cos(rotY), s = Math.sin(rotY);
      const xr = x * c + z * s, zr = -x * s + z * c;
      const persp = FOV / (FOV + zr);
      const fit = Math.min(W / 600, H / 430, 1.25);
      return { sx: W / 2 + xr * scale * fit * persp, sy: H / 2 + y * scale * fit * persp + panY, persp, zr };
    }

    function revealEnabled() {
      return rendererChoice !== 'static' && !(reducedQuery?.matches) && host.motionAllowed?.() !== false;
    }

    function frame(now = 0) {
      animationFrame = 0;
      if (!running) return;
      const frameStart = performance.now();
      const interval = lastFrameAt ? now - lastFrameAt : 0;
      lastFrameAt = now;
      frames += 1;
      const elapsed = revealEnabled() ? Math.max(0, frameStart - revealStart) : REVEAL.dustMs + REVEAL.starMs;

      ctx.clearRect(0, 0, W, H);
      if (revealEnabled()) {
        rotY += (targetRotY - rotY) * 0.06;
        if (!dragging && !focusedId && !manuallyRotated) targetRotY = .18 * Math.sin(frameStart * .00006);
      } else rotY = targetRotY;
      if (revealEnabled()) { scale += (targetScale - scale) * 0.08; panY += (targetPanY - panY) * 0.08; }
      else { scale = targetScale; panY = targetPanY; }
      const particles = [];

      const dustFactor = dustReveal(elapsed);
      if (dustFactor > 0) {
        ctx.globalAlpha = 1;
        for (const d of dust) {
          const p = project(d.x, d.y, d.z);
          if (p.zr > DEPTH_RANGE) continue;
          const tw = host.motionAllowed?.() !== false ? 0.6 + 0.4 * Math.sin(d.tw + frameStart * 0.001) : 0.8;
          ctx.globalAlpha = d.a * tw * dustFactor * Math.min(1, p.persp);
          if (webgl) { particles.push({ x: p.sx, y: p.sy, size: d.s * p.persp * 3, color: '#BFD4DC', alpha: ctx.globalAlpha * .5 }); continue; }
          ctx.fillStyle = '#BFD4DC';
          ctx.beginPath(); ctx.arc(p.sx, p.sy, d.s * p.persp, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const viewed = new Set(host.viewedIds?.() || []);
      const selectedId = host.selectedId?.() || null;
      for (const star of stars) {
        star.x += (star.tx - star.x) * .12; star.y += (star.ty - star.y) * .12; star.z += (star.tz - star.z) * .12;
        const p = project(star.x, star.y, star.z);
        star.screenX = p.sx; star.screenY = p.sy; star.persp = p.persp; star.zr = p.zr;
        star.viewed = viewed.has(star.id);
      }
      const shown = stars.filter(visible);
      const labels = host.selectVisibleLabels?.(shown, { width: W, height: H }, scale, { selectedHerb: selectedId, viewedHerbs: viewed });
      const labelIds = new Set((labels || []).map(item => item.id));
      const alpha = glowAlpha();
      const relatedIds = new Set(focusedId ? layoutApi.relations(layout, focusedId).ids : []);
      const emphasis = star => focusedId && star.id !== focusedId && !relatedIds.has(star.id) ? .18 : 1;

      if (focusedId) {
        const selected = shown.find(s => s.id === focusedId);
        const relations = new Set(layoutApi.relations(layout, focusedId).ids);
        if (selected) for (const star of shown.filter(s => relations.has(s.id))) {
          ctx.strokeStyle = 'rgba(214,192,139,.22)'; ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(selected.screenX, selected.screenY); ctx.lineTo(star.screenX, star.screenY); ctx.stroke();
        }
      }

      if (alpha > 0 && !webgl) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < stars.length; i += 1) {
          const star = stars[i];
          if (!visible(star)) continue;
          if (star.zr > DEPTH_RANGE) continue;
          const factor = starReveal(i, stars.length, elapsed);
          if (factor <= 0) continue;
          const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
          const core = Math.max(1.4, star.size * star.persp * scale);
          const radius = core * 2.5 * (1 + blur * .4) * (0.3 + 0.7 * factor);
          const image = sprite(star.color);
          ctx.globalAlpha = alpha * Math.min(1, star.persp) * (1 - blur * 0.7) * factor * emphasis(star);
          if (image) ctx.drawImage(image, star.screenX - radius, star.screenY - radius, radius * 2, radius * 2);
          else { ctx.fillStyle = star.color; ctx.beginPath(); ctx.arc(star.screenX, star.screenY, radius, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        if (!visible(star)) continue;
        if (star.zr > DEPTH_RANGE) continue;
        const factor = starReveal(i, stars.length, elapsed);
        if (factor <= 0) continue;
        const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
        const core = Math.max(1.4, star.size * star.persp * scale) * (0.3 + 0.7 * factor);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.min(1, star.persp) * (1 - blur * 0.55) * factor * emphasis(star);
        if (webgl) particles.push({ x: star.screenX, y: star.screenY, size: core * 6, color: star.color, alpha: ctx.globalAlpha * .9 });
        else { ctx.beginPath(); ctx.arc(star.screenX, star.screenY, core, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 1;
        const hovered = hoverId === star.id;
        const labelled = labelIds.size
          ? (labelIds.has(star.id) || hovered || focusedId === star.id) && blur <= 0.55
          : (hovered || (scale >= 1.8 && core > 2) || (star.herb && star.herb.food && scale > 1.25));
        if (labelled) {
          ctx.fillStyle = hovered ? '#F3D9A0' : 'rgba(232,224,207,.82)';
          ctx.font = hovered ? '600 12px "Noto Sans SC",sans-serif' : '400 11px "Noto Sans SC",sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(star.name, star.screenX, star.screenY - core * 3.6);
        }
        if (star.viewed || focusedId === star.id) {
          ctx.strokeStyle = '#F0CA77'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(star.screenX, star.screenY, Math.max(5, core * 1.9), 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      if (webgl) { try { webgl.render(particles, W, H); } catch (_) { fallback('增强画面中断，已恢复基础星图'); } }

      const frameMs = performance.now() - frameStart;
      renderMs = frameMs;
      if (!firstFrameMs) firstFrameMs = frameMs;
      if (interval > 0 && interval < 1000) adapt(Math.max(interval, frameMs));
      if (revealEnabled()) invalidate();
    }

    function adapt(frameMs) {
      frameSamples.push(frameMs);
      if (frameSamples.length > 30) frameSamples.shift();
      if (frameSamples.length < 30) return;
      const avg = frameSamples.reduce((sum, value) => sum + value, 0) / frameSamples.length;
      if (avg > 20 && degradeLevel < 2) { degradeLevel += 1; frameSamples.length = 0; buildStars(); return; }
      if (avg < 18) {
        stableSince = stableSince || performance.now();
        if (degradeLevel > 0 && performance.now() - stableSince > 3000) { degradeLevel -= 1; stableSince = 0; buildStars(); }
      } else stableSince = 0;
    }

    function hitTest(mx, my) {
      let best = null, bestDistance = 1e9;
      for (const star of stars) {
        if (!visible(star)) continue;
        if (star.zr > DEPTH_RANGE) continue;
        const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
        const radius = Math.max(10, star.size * star.persp * scale * 3.4) * (1 + blur * 0.6);
        const distance = Math.hypot(mx - star.screenX, my - star.screenY);
        if (distance < radius && distance < bestDistance) { bestDistance = distance; best = star; }
      }
      return best;
    }

    function focus(id, animate = true, source = 'cosmos-focus') {
      const star = stars.find(item => item.id === id);
      if (!star) return;
      focusedId = star.id;
      categoryFilter = ''; regionFilters.clear();
      targetRotY = 0; targetScale = 1.1; targetPanY = 0;
      setRelationPositions();
      if (!animate || !revealEnabled()) {
        rotY = targetRotY; scale = targetScale; panY = targetPanY;
        for (const s of stars) { s.x = s.tx; s.y = s.ty; s.z = s.tz; }
      }
      host.onSelect?.(star.id, source);
      host.onPick?.(star.herb);
      invalidate();
    }

    function select(star, source) {
      if (!star) return;
      focus(star.id, true, source);
    }

    on('pointerdown', event => {
      if (event.pointerType === 'touch' && !roam) { moved = 0; return; }
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size === 1) moved = 0;
      dragging = true; lastX = event.clientX; lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      if (activePointers.size === 2) {
        moved = 20;
        const [a, b] = [...activePointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    });
    on('pointermove', event => {
      if (activePointers.has(event.pointerId)) activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size === 2) {
        const [a, b] = [...activePointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance) targetScale = Math.max(0.5, Math.min(2.4, targetScale * distance / pinchDistance));
        pinchDistance = distance; moved = 20;
        invalidate();
        return;
      }
      if (dragging) {
        moved += Math.hypot(event.clientX - lastX, event.clientY - lastY);
        targetRotY += (event.clientX - lastX) * 0.006;
        manuallyRotated = true;
        lastX = event.clientX; lastY = event.clientY;
        if (moved > 5) { focusedId = null; targetPanY = 0; setRelationPositions(); }
      } else {
        const rect = canvas.getBoundingClientRect();
        const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
        hoverId = hit?.id || null;
        canvas.style.cursor = hit ? 'pointer' : 'grab';
      }
      invalidate();
    });
    const release = event => {
      activePointers.delete(event.pointerId);
      dragging = activePointers.size > 0;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      pinchDistance = 0;
      if (activePointers.size === 1) { const [point] = activePointers.values(); lastX = point.x; lastY = point.y; }
    };
    on('pointerup', release);
    const cancel = event => {
      moved = 20;
      activePointers.clear(); dragging = false; pinchDistance = 0;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    on('pointercancel', cancel);
    on('lostpointercapture', event => {
      if (activePointers.has(event.pointerId)) cancel(event);
    });
    on('click', event => {
      if (moved > 5) return;
      const rect = canvas.getBoundingClientRect();
      select(hitTest(event.clientX - rect.left, event.clientY - rect.top), 'cosmos');
    });
    on('dblclick', event => {
      const rect = canvas.getBoundingClientRect();
      const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
      if (hit) focus(hit.id);
    });
    on('wheel', event => {
      if (!roam) return;
      const next = Math.max(0.5, Math.min(2.4, targetScale - event.deltaY * 0.001));
      if (next !== targetScale) { event.preventDefault(); targetScale = next; }
      invalidate();
    }, { passive: false });
    on('keydown', event => {
      if (event.key === '+' || event.key === '=') { targetScale = Math.min(2.4, targetScale + 0.2); event.preventDefault(); }
      if (event.key === '-') { targetScale = Math.max(0.5, targetScale - 0.2); event.preventDefault(); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        targetRotY += (event.key === 'ArrowLeft' ? -0.2 : 0.2); manuallyRotated = true; focusedId = null; targetPanY = 0; setRelationPositions(); event.preventDefault();
      }
      if (event.key === 'Enter') host.openSelected?.();
      invalidate();
    });

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
    resizeObserver?.observe(canvas);

    function start() {
      if (disposed) return;
      if (running) { invalidate(); return; }
      running = true;
      lastFrameAt = 0;
      enhance(); invalidate();
    }
    function stop() {
      running = false;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    const api = {
      buildStars,
      paint,
      focus,
      start,
      stop,
      isFavorite: favorite,
      toggleFavorite(id) { host.toggleFavorite?.(id); },
      clearFocus() { focusedId = null; manuallyRotated = false; targetRotY = 0; targetPanY = 0; targetScale = 1; setRelationPositions(); invalidate(); },
      setFilter(category = '', regions = []) { categoryFilter = category; regionFilters = new Set(regions); invalidate(); return stars.filter(visible).length; },
      setRoam(enabled) {
        roam = Boolean(enabled); canvas.dataset.roam = String(roam);
        const pointers = [...activePointers.keys()]; activePointers.clear();
        pointers.forEach(id => { if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id); });
        dragging = false; pinchDistance = 0; moved = 20; invalidate();
      },
      setRenderer(choice = 'auto') { rendererEpoch += 1; rendererChoice = choice; rendererAttempted = false; fallback(''); if (running) enhance(); },
      setReading(mode) {
        reading = READING_MODES.includes(mode) ? mode : DEFAULT_READING;
        paint();
        return reading;
      },
      setColorMode() { paint(); },
      zoom(delta) { targetScale = Math.max(0.5, Math.min(2.4, targetScale + Number(delta || 0))); invalidate(); },
      resetMotion() { if (!revealEnabled()) { targetRotY = rotY; scale = targetScale; panY = targetPanY; setRelationPositions(); } invalidate(); },
      beginReveal() { revealed = false; revealStart = performance.now(); },
      perf() {
        const avg = frameSamples.length ? frameSamples.reduce((sum, value) => sum + value, 0) / frameSamples.length : 0;
        return {
          firstFrameMs: Math.round(firstFrameMs * 100) / 100,
          avgFrameMs: Math.round(avg * 100) / 100,
          particleCount: stars.length + dust.length,
          degradeLevel,
          reading,
          rotation: rotY,
          targetRotation: targetRotY,
          dragging,
          spriteReadyMs,
          renderer: canvas.dataset.renderer, rendererReason, running, scheduled: Boolean(animationFrame), frames,
          renderCostMs: Math.round(renderMs * 100) / 100, visibleCount: stars.filter(visible).length,
          nodeCount: stars.length, categoryFilter, regions: [...regionFilters], roam, focusedId,
          paletteCount: new Set(stars.map(s => s.color)).size,
          relations: focusedId ? layoutApi.relations(layout, focusedId) : { ids: [], formulas: [] }
        };
      },
      dispose() { disposed = true; rendererEpoch += 1; stop(); resizeObserver?.disconnect(); sprites.clear(); listeners.forEach(([name, fn, options]) => canvas.removeEventListener(name, fn, options)); webgl?.dispose(); webglCanvas?.remove(); }
    };

    resize();
    revealed = !revealEnabled();
    buildStars();
    // 精灵预热与几何构建完成后才开始计时，保证揭示动画完整播放。
    if (!revealed) revealStart = performance.now();
    running = false;
    rendererStatus();
    if (host.autoStart !== false) start();
    return api;
  }

  const api = {
    mount,
    supported,
    regionOf,
    regionsOf,
    colorForReading,
    legendFor,
    particleBudget,
    depthBlur,
    dustReveal,
    starReveal,
    createGlowSprite,
    hexWithAlpha,
    REGION_OF_PROVINCE,
    REGION_COLORS,
    QI_COLORS,
    READING_MODES,
    READING_LABELS,
    DEFAULT_READING,
    UNIFORM_COLOR,
    ETHNIC_COLOR,
    DIM_COLOR,
    GLOW_ALPHA_BY_THEME,
    REVEAL
  };
  if (typeof window !== 'undefined') window.HerbalCosmosEngine = api;
  return api;
})();
