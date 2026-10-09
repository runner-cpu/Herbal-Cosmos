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
    const match = /^#([0-9a-f]{6})$/i.exec(String(color || '').trim());
    if (!match) return color;
    const value = parseInt(match[1], 16);
    return 'rgba(' + ((value >> 16) & 255) + ',' + ((value >> 8) & 255) + ',' + (value & 255) + ',' + alpha + ')';
  }

  function regionOf(origin) {
    const list = Array.isArray(origin) ? origin : [];
    for (const province of list) {
      for (const region of Object.keys(REGION_OF_PROVINCE)) {
        if (REGION_OF_PROVINCE[region].indexOf(province) >= 0) return region;
      }
    }
    return 'unknown';
  }

  function colorForReading(herb = {}, mode = DEFAULT_READING, options = {}) {
    if (mode === 'geography') return REGION_COLORS[regionOf(herb.origin)] || REGION_COLORS.unknown;
    if (mode === 'nature') return QI_COLORS[herb.qi] || REGION_COLORS.unknown;
    if (mode === 'ethnic') return options.ethnicIds?.has?.(herb.id) ? ETHNIC_COLOR : DIM_COLOR;
    if (options.uniform) return UNIFORM_COLOR;
    return typeof options.categoryColor === 'function' ? (options.categoryColor(herb) || UNIFORM_COLOR) : UNIFORM_COLOR;
  }

  function legendFor(mode, options = {}) {
    if (mode === 'geography') return Object.keys(REGION_COLORS).map(key => ({ label: key === 'unknown' ? '无分布记录' : key, color: REGION_COLORS[key] }));
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
    const reducedQuery = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;
    const mobileQuery = typeof window !== 'undefined' ? window.matchMedia?.('(max-width: 768px)') : null;

    let W = 0, H = 0, DPR = 1;
    let stars = [], dust = [];
    let rotY = 0, targetRotY = 0, scale = 1, targetScale = 1;
    let dragging = false, lastX = 0, moved = 0;
    let hoverId = null, focusedId = null, panY = 0, targetPanY = 0;
    let running = true, animationFrame = 0, lastFrameAt = 0;
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
    canvas.setAttribute('aria-label', '本草星图：拖动旋转，双击聚焦；可用读法按钮改变着色，也可使用搜索与缩放按钮。');

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
      for (const star of stars) star.color = colorForReading(star.herb || {}, reading, inputs);
      warmSprites();
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
      stars = herbs.map((herb, index) => {
        const phi = Math.acos(1 - 2 * (index + 0.5) / Math.max(1, herbs.length));
        const theta = index * Math.PI * (3 - Math.sqrt(5));
        const r = 210;
        return {
          id: herb.id, name: herb.name,
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.cos(phi),
          z: r * Math.sin(phi) * Math.sin(theta),
          size: favorite(herb.id) ? 6.2 : 4.6,
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
    }

    function project(x, y, z) {
      const c = Math.cos(rotY), s = Math.sin(rotY);
      const xr = x * c + z * s, zr = -x * s + z * c;
      const persp = FOV / (FOV + zr);
      return { sx: W / 2 + xr * scale * persp, sy: H / 2 + y * scale * persp + panY, persp, zr };
    }

    function revealEnabled() {
      return !(reducedQuery?.matches) && host.motionAllowed?.() !== false;
    }

    function frame(now = 0) {
      if (!running) return;
      const frameStart = now || performance.now();
      if (!lastFrameAt) lastFrameAt = frameStart;
      const elapsed = revealEnabled() ? Math.max(0, frameStart - revealStart) : REVEAL.dustMs + REVEAL.starMs;

      ctx.clearRect(0, 0, W, H);
      if (host.motionAllowed?.() !== false) {
        rotY += (targetRotY - rotY) * 0.06;
        if (!dragging && !focusedId) targetRotY += 0.0005;
      } else rotY = targetRotY;
      scale += (targetScale - scale) * 0.08;
      panY += (targetPanY - panY) * 0.08;

      const dustFactor = dustReveal(elapsed);
      if (dustFactor > 0) {
        ctx.globalAlpha = 1;
        for (const d of dust) {
          const p = project(d.x, d.y, d.z);
          if (p.zr > DEPTH_RANGE) continue;
          const tw = host.motionAllowed?.() !== false ? 0.6 + 0.4 * Math.sin(d.tw + frameStart * 0.001) : 0.8;
          ctx.globalAlpha = d.a * tw * dustFactor * Math.min(1, p.persp);
          ctx.fillStyle = '#BFD4DC';
          ctx.beginPath(); ctx.arc(p.sx, p.sy, d.s * p.persp, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const viewed = new Set(host.viewedIds?.() || []);
      const selectedId = host.selectedId?.() || null;
      for (const star of stars) {
        const p = project(star.x, star.y, star.z);
        star.screenX = p.sx; star.screenY = p.sy; star.persp = p.persp; star.zr = p.zr;
        star.viewed = viewed.has(star.id);
      }
      const visible = host.selectVisibleLabels?.(stars, { width: W, height: H }, scale, { selectedHerb: selectedId, viewedHerbs: viewed });
      const labelIds = new Set((visible || []).map(item => item.id));
      const alpha = glowAlpha();

      if (alpha > 0) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < stars.length; i += 1) {
          const star = stars[i];
          if (star.zr > DEPTH_RANGE) continue;
          const factor = starReveal(i, stars.length, elapsed);
          if (factor <= 0) continue;
          const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
          const core = Math.max(1.4, star.size * star.persp * scale);
          const radius = core * 3.4 * (1 + blur * 1.2) * (0.3 + 0.7 * factor);
          const image = sprite(star.color);
          ctx.globalAlpha = alpha * Math.min(1, star.persp) * (1 - blur * 0.7) * factor;
          if (image) ctx.drawImage(image, star.screenX - radius, star.screenY - radius, radius * 2, radius * 2);
          else { ctx.fillStyle = star.color; ctx.beginPath(); ctx.arc(star.screenX, star.screenY, radius, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        if (star.zr > DEPTH_RANGE) continue;
        const factor = starReveal(i, stars.length, elapsed);
        if (factor <= 0) continue;
        const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
        const core = Math.max(1.4, star.size * star.persp * scale) * (0.3 + 0.7 * factor);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.min(1, star.persp) * (1 - blur * 0.55) * factor;
        ctx.beginPath(); ctx.arc(star.screenX, star.screenY, core, 0, Math.PI * 2); ctx.fill();
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

      const frameMs = performance.now() - frameStart;
      if (!firstFrameMs) firstFrameMs = frameMs;
      adapt(frameMs);
      animationFrame = requestAnimationFrame(frame);
    }

    function adapt(frameMs) {
      frameSamples.push(frameMs);
      if (frameSamples.length > 30) frameSamples.shift();
      if (frameSamples.length < 30) return;
      const avg = frameSamples.reduce((sum, value) => sum + value, 0) / frameSamples.length;
      if (avg > 20 && degradeLevel < 2) { degradeLevel += 1; frameSamples.length = 0; buildStars(); return; }
      if (avg < 12) {
        stableSince = stableSince || performance.now();
        if (degradeLevel > 0 && performance.now() - stableSince > 3000) { degradeLevel -= 1; stableSince = 0; buildStars(); }
      } else stableSince = 0;
    }

    function hitTest(mx, my) {
      let best = null, bestDistance = 1e9;
      for (const star of stars) {
        if (star.zr > DEPTH_RANGE) continue;
        const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
        const radius = Math.max(10, star.size * star.persp * scale * 3.4) * (1 + blur * 0.6);
        const distance = Math.hypot(mx - star.screenX, my - star.screenY);
        if (distance < radius && distance < bestDistance) { bestDistance = distance; best = star; }
      }
      return best;
    }

    function focus(id, animate = true) {
      const star = stars.find(item => item.id === id);
      if (!star) return;
      focusedId = star.id;
      targetRotY = Math.atan2(star.x, -star.z);
      targetScale = Math.max(targetScale, 1.35);
      const depth = -Math.hypot(star.x, star.z);
      targetPanY = -star.y * targetScale * FOV / (FOV + depth);
      if (!animate || host.motionAllowed?.() === false) { rotY = targetRotY; scale = targetScale; panY = targetPanY; }
      host.onSelect?.(star.id, 'cosmos-focus');
    }

    function select(star, source) {
      if (!star) return;
      host.onSelect?.(star.id, source);
      host.onPick?.(star.herb);
    }

    canvas.addEventListener('pointerdown', event => {
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragging = true; moved = 0; lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
      if (activePointers.size === 2) {
        const [a, b] = [...activePointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    });
    canvas.addEventListener('pointermove', event => {
      if (activePointers.has(event.pointerId)) activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size === 2) {
        const [a, b] = [...activePointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance) targetScale = Math.max(0.5, Math.min(2.4, targetScale * distance / pinchDistance));
        pinchDistance = distance; moved = 20;
        return;
      }
      if (dragging) {
        moved += Math.hypot(event.clientX - lastX, event.clientY - lastY);
        targetRotY += (event.clientX - lastX) * 0.006;
        lastX = event.clientX;
        if (moved > 5) { focusedId = null; targetPanY = 0; }
      } else {
        const rect = canvas.getBoundingClientRect();
        const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
        hoverId = hit?.id || null;
        canvas.style.cursor = hit ? 'pointer' : 'grab';
      }
    });
    const release = event => {
      activePointers.delete(event.pointerId);
      dragging = activePointers.size > 0;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (activePointers.size === 1) { const [point] = activePointers.values(); lastX = point.x; }
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('click', event => {
      if (moved > 5) return;
      const rect = canvas.getBoundingClientRect();
      select(hitTest(event.clientX - rect.left, event.clientY - rect.top), 'cosmos');
    });
    canvas.addEventListener('dblclick', event => {
      const rect = canvas.getBoundingClientRect();
      const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
      if (hit) focus(hit.id);
    });
    canvas.addEventListener('wheel', event => {
      const next = Math.max(0.5, Math.min(2.4, targetScale - event.deltaY * 0.001));
      if (next !== targetScale) { event.preventDefault(); targetScale = next; }
    }, { passive: false });
    canvas.addEventListener('keydown', event => {
      if (event.key === '+' || event.key === '=') { targetScale = Math.min(2.4, targetScale + 0.2); event.preventDefault(); }
      if (event.key === '-') { targetScale = Math.max(0.5, targetScale - 0.2); event.preventDefault(); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        targetRotY += (event.key === 'ArrowLeft' ? -0.2 : 0.2); focusedId = null; targetPanY = 0; event.preventDefault();
      }
      if (event.key === 'Enter') host.openSelected?.();
    });

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
    resizeObserver?.observe(canvas);

    function start() {
      if (running) return;
      running = true;
      lastFrameAt = 0;
      animationFrame = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(animationFrame);
    }

    const api = {
      buildStars,
      paint,
      focus,
      start,
      stop,
      setReading(mode) {
        reading = READING_MODES.includes(mode) ? mode : DEFAULT_READING;
        paint();
        return reading;
      },
      setColorMode() { paint(); },
      zoom(delta) { targetScale = Math.max(0.5, Math.min(2.4, targetScale + Number(delta || 0))); },
      resetMotion() { if (host.motionAllowed?.() === false) targetRotY = rotY; },
      beginReveal() { revealed = false; revealStart = performance.now(); },
      perf() {
        const avg = frameSamples.length ? frameSamples.reduce((sum, value) => sum + value, 0) / frameSamples.length : 0;
        return {
          firstFrameMs: Math.round(firstFrameMs * 100) / 100,
          avgFrameMs: Math.round(avg * 100) / 100,
          particleCount: stars.length + dust.length,
          degradeLevel,
          reading,
          spriteReadyMs
        };
      },
      dispose() { stop(); resizeObserver?.disconnect(); sprites.clear(); }
    };

    resize();
    revealed = !revealEnabled();
    buildStars();
    // 精灵预热与几何构建完成后才开始计时，保证揭示动画完整播放。
    if (!revealed) revealStart = performance.now();
    running = false;
    start();
    return api;
  }

  const api = {
    mount,
    supported,
    regionOf,
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
