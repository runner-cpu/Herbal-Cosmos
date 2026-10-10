/* 星云引擎 V2：光晕精灵预渲染 + 加色混合 + 景深 + 四种读法。
 * 与 runtime.js 解耦：几何、绘制、交互都收在这里，宿主只提供数据与回调。
 * 关键优化：把每帧 902 次 createRadialGradient 换成一次性的离屏精灵 + drawImage。
 * 分区映射、配色与景深数学在 cosmos-scene.js；岛屿几何在 cosmos-layout.js。
 * 两者都先于本文件加载，缺失即视为装配错误。以 classic script 形式加载
 * （与 culture.js / insights.js 一致），暴露 window.HerbalCosmosEngine。 */
(function () {
  'use strict';

  const vocabulary = (typeof window !== 'undefined' && window.HerbalCosmosScene) || null;
  if (!vocabulary) throw new Error('HerbalCosmosScene must be loaded before cosmos-engine.js');
  const {
    REGION_OF_PROVINCE, REGION_COLORS, QI_COLORS, UNIFORM_COLOR, ETHNIC_COLOR, DIM_COLOR,
    NO_REGION, CLUSTER_ALL, READING_MODES, READING_LABELS, CLUSTER_LABELS, DEFAULT_READING,
    GLOW_SIZE, GLOW_ALPHA_BY_THEME, DEPTH_RANGE, FOV, REVEAL, TRAIL_SAME, TRAIL_CROSS,
    FLY_MS, FRAME_MARGIN, FRAME_PAD, FRAME_MAX, TRAVEL_LIMIT,
    hexWithAlpha, regionOf, regionsOf, clusterOf, colorForReading, legendFor, particleBudget,
    depthBlur, dustReveal, starReveal, createGlowSprite, supported,
    drawIslandHalos, drawIslandCaptions, islandsWithCards
  } = vocabulary;
  // Herb-to-herb trails come from recorded prescriptions. Sampling keeps the
  // line layer inside the frame budget without dropping the network's shape.
  const TRAIL_LIMIT = 420;

  function mount(canvas, host = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const herbs = host.herbs || [];
    const layoutApi = window.HerbalCosmosLayout;
    const layout = layoutApi.build(herbs, host.formulas || []);
    const regionOfId = new Map(herbs.map(herb => [herb.id, clusterOf(herb)]));
    const regionReading = layoutApi.regionLayout
      ? layoutApi.regionLayout(layout.nodes, node => regionOfId.get(node.id))
      : { nodes: layout.nodes, clusters: [] };
    const regionNodes = regionReading.nodes;
    const trails = layoutApi.cooccurrence ? layoutApi.cooccurrence(layout, { limit: TRAIL_LIMIT }) : [];
    const reducedQuery = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;
    const mobileQuery = typeof window !== 'undefined' ? window.matchMedia?.('(max-width: 768px)') : null;

    let W = 0, H = 0, DPR = 1;
    let stars = [], dust = [];
    let rotY = 0, targetRotY = 0, scale = 1, targetScale = 1;
    let dragging = false, lastX = 0, lastY = 0, moved = 0;
    let hoverId = null, focusedId = null;
    let running = false, animationFrame = 0, lastFrameAt = 0, disposed = false;
    let manuallyRotated = false;
    let categoryFilter = '', regionFilters = new Set(), roam = false;
    let webgl = null, webglCanvas = null, loadingRenderer = null, rendererAttempted = false, rendererReason = '';
    let rendererChoice = host.renderer || 'auto';
    let rendererEpoch = 0;
    let renderMs = 0, frames = 0;
    const listeners = [];
    const on = (name, fn, options) => { canvas.addEventListener(name, fn, options); listeners.push([name, fn, options]); };
    let reading = DEFAULT_READING;
    let readingLayout = layout.nodes;
    let activeClusters = layout.clusters || [];
    let trailsEnabled = host.trails !== false;
    let cluster = CLUSTER_ALL;
    let flight = null;
    // 上一帧名录层落笔的条目与被瞄准的岛在屏幕上的位置：让「每个分组都有名录」
    // 和「穿梭后停在目标岛」可被断言，而不是只能靠肉眼看截图。
    let captionsDrawn = [], aimedAt = null;

    // The island a card currently belongs to, under the live reading. Both the
    // captions and the travel buttons read this, so a button never points at a
    // group the sky is not currently drawing.
    function clusterKeyOf(star) {
      if (!star) return NO_REGION;
      if (reading === 'geography') return regionOfId.get(star.id) || NO_REGION;
      return star.category;
    }

    // The cluster list the host renders as travel buttons, counted from the
    // cards actually present so no empty region ever ships as a destination.
    function clusterCounts() {
      const counts = new Map();
      for (const star of stars) {
        const key = clusterKeyOf(star);
        counts.set(key, (counts.get(key) || 0) + 1);
      }
      return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN')).map(([key, count]) => ({ key, label: CLUSTER_LABELS[key] || key, count }));
    }
    let anchorX = 0, anchorY = 0, targetAnchorX = 0, targetAnchorY = 0;
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
      const regionById = new Map(regionNodes.map(node => [node.id, node]));
      stars = layout.nodes.map(node => {
        const herb = byId.get(node.id);
        const region = regionById.get(node.id) || node;
        return {
          id: herb.id, name: herb.name,
          category: node.category,
          gx: node.x, gy: node.y, gz: node.z,
          rx: region.x, ry: region.y, rz: region.z,
          x: node.x, y: node.y, z: node.z,
          tx: node.x, ty: node.y, tz: node.z,
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
      materialize();
      setRelationPositions();
      invalidate();
    }

    // Reveal and reduced-motion paths write positions straight through; the
    // animated path leaves them to the frame loop's easing.
    function materialize() {
      if (revealEnabled()) return;
      for (const star of stars) { star.x = star.tx; star.y = star.ty; star.z = star.tz; }
    }

    // Two registrations share one node contract: the category islands, and the
    // literature-region islands used by the distribution reading. The reading
    // alone decides which one is on screen — a chosen cluster highlights its
    // group inside that same layout instead of silently regrouping the sky.
    function syncLayout() {
      const regional = reading === 'geography';
      readingLayout = regional ? regionNodes : layout.nodes;
      activeClusters = regional ? regionReading.clusters : layout.clusters || [];
    }

    /* The field the camera must hold. Derived from the live reading instead of a
       constant, and padded for the captions drawn outside the outermost cards,
       so a reading with few groups is framed tighter than a busy one. */
    function fieldBounds() {
      const nodes = readingLayout?.length ? readingLayout : layout.nodes;
      const box = layoutApi.bounds ? layoutApi.bounds(nodes, FRAME_PAD) : { spanX: 700, spanY: 420 };
      const captions = activeClusters.reduce((widest, cluster) => Math.max(widest, cluster.radius * 2), 0) + 130;
      return { spanX: Math.max(box.spanX, captions), spanY: Math.max(box.spanY, captions * 0.55) };
    }

    /* One framing rule for projection, anchoring and flights, so a cluster can
       never be aimed at with a different scale than the one it is drawn with.
       The result is cached for the frame: `project()` runs once per particle, so
       recomputing the field extent inside it would be quadratic per frame. */
    let frameFit = 1;
    function refit() {
      const field = fieldBounds();
      const room = Math.min((W - 2 * FRAME_MARGIN) / field.spanX, (H - 2 * FRAME_MARGIN) / field.spanY);
      frameFit = Math.max(0.12, Math.min(room, FRAME_MAX));
      return frameFit;
    }

    function setRelationPositions() {
      const positions = focusedId ? layoutApi.selectedPositions(layout, focusedId) : readingLayout;
      const targets = new Map(positions.map(n => [n.id, n]));
      for (const star of stars) {
        const target = targets.get(star.id) || star;
        const source = target === star
          ? (reading === 'geography' ? { x: star.rx, y: star.ry, z: star.rz } : { x: star.gx, y: star.gy, z: star.gz })
          : target;
        star.tx = source.x; star.ty = source.y; star.tz = source.z;
      }
      materialize();
    }

    // A cluster the viewer chose: the camera aims at its centroid while the
    // rest of the field keeps its shape, so the flight reads as travel.
    function centroidOf(ids) {
      let x = 0, y = 0, z = 0, n = 0;
      for (const star of stars) {
        if (!ids.has(star.id)) continue;
        x += star.x; y += star.y; z += star.z; n += 1;
      }
      if (!n) return { x: 0, y: 0, z: 0 };
      return { x: x / n, y: y / n, z: z / n };
    }

    /* Where a travel destination is and how far in the camera should go. Read
       from the island geometry the sky is drawn with, so the frame a flight
       lands on is the frame the caption was measured against. */
    function anchorFor(key) {
      if (key === CLUSTER_ALL) return { x: 0, y: 0, z: 0, scale: 1 };
      const island = activeClusters.find(item => item.key === key);
      if (!island) {
        const ids = new Set(stars.filter(star => clusterKeyOf(star) === key).map(star => star.id));
        if (!ids.size) return { x: 0, y: 0, z: 0, scale: 1 };
        return { ...centroidOf(ids), scale: 1.6 };
      }
      // Enough magnification to read the island's own cards, capped so an
      // eleven-card group is not blown up to the same size as a two-hundred one.
      const field = refit();
      const room = Math.min(W, H * 1.6) * 0.42;
      const scale = Math.max(1.05, Math.min(3.2, room / Math.max(24, island.radius * field)));
      return { x: island.x, y: island.y, z: 0, scale };
    }

    // Screen projection folds the camera yaw into x, so the anchor is derived
    // from the live rotation: the chosen cluster stays under the viewer's eye
    // even while the field is still turning.
    function syncAnchor() {
      const focus = anchorFor(cluster);
      if (focus.scale === 1) { targetAnchorX = 0; targetAnchorY = 0; targetScale = 1; return; }
      const c = Math.cos(targetRotY), s = Math.sin(targetRotY);
      const xr = focus.x * c + focus.z * s;
      const fit = refit();
      targetAnchorX = -xr * focus.scale * fit;
      targetAnchorY = -focus.y * focus.scale * fit;
      targetScale = focus.scale;
    }

    function visible(star) {
      return (!categoryFilter || star.category === categoryFilter) && (reading !== 'geography' || !regionFilters.size || regionsOf(star.herb.origin).some(region => regionFilters.has(region)));
    }

    function project(x, y, z) {
      const c = Math.cos(rotY), s = Math.sin(rotY);
      const xr = x * c + z * s, zr = -x * s + z * c;
      const persp = FOV / (FOV + zr);
      return { sx: W / 2 + xr * scale * frameFit * persp + anchorX, sy: H / 2 + y * scale * frameFit * persp + anchorY, persp, zr };
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
      // One framing evaluation per frame, before anything projects. Deriving the
      // field extent inside project() would run it 900+ times a frame.
      refit();
      if (revealEnabled()) {
        rotY += (targetRotY - rotY) * 0.06;
        if (!dragging && !flight && !focusedId && !manuallyRotated) targetRotY = .18 * Math.sin(frameStart * .00006);
      } else rotY = targetRotY;
      if (flight) {
        // Interstellar hop: ease rotation and framing toward the chosen cluster
        // instead of cutting, so the field visibly travels under the camera.
        const t = Math.max(0, Math.min(1, (frameStart - flight.start) / Math.max(1, flight.duration)));
        const ease = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        rotY = flight.fromRot + (flight.toRot - flight.fromRot) * ease;
        targetRotY = flight.toRot;
        const anchor = anchorFor(flight.key);
        const fit = refit();
        const c = Math.cos(rotY), s = Math.sin(rotY);
        const goalX = anchor.scale === 1 ? 0 : -(anchor.x * c + anchor.z * s) * anchor.scale * fit;
        const goalY = anchor.scale === 1 ? 0 : -anchor.y * anchor.scale * fit;
        anchorX = flight.fromX + (goalX - flight.fromX) * ease;
        anchorY = flight.fromY + (goalY - flight.fromY) * ease;
        scale = flight.fromScale + (anchor.scale - flight.fromScale) * ease;
        targetAnchorX = goalX; targetAnchorY = goalY; targetScale = anchor.scale;
        if (t >= 1) flight = null;
      } else if (revealEnabled()) {
        scale += (targetScale - scale) * 0.08;
        anchorX += (targetAnchorX - anchorX) * 0.08;
        anchorY += (targetAnchorY - anchorY) * 0.08;
      } else { scale = targetScale; anchorX = targetAnchorX; anchorY = targetAnchorY; }
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
        // The label pass reads the group each card is currently drawn in, so it
        // can guarantee every island is named instead of labelling whichever
        // cards happen to sit in the middle of the frame.
        star.cluster = clusterKeyOf(star);
      }
      // Island halos sit behind the cards: they are what turns a scatter of
      // dots into named groups the moment the page paints, before any hover.
      const islandAnchors = [];
      for (const island of activeClusters) {
        const spot = project(island.x, island.y, 0);
        if (spot.zr > DEPTH_RANGE) continue;
        islandAnchors.push({ island, ...spot, radius: island.radius * frameFit * scale * spot.persp });
      }
      drawIslandHalos(ctx, islandAnchors, island => (!focusedId || cluster === island.key ? 1 : 0.35));
      const shown = stars.filter(visible);
      // Only the cards nearest each island's centre are offered to the label
      // pass. Every island therefore gets named at least once, and the pass
      // still decides the final collision-free subset.
      const byCluster = new Map();
      for (const star of shown) {
        const list = byCluster.get(star.cluster);
        if (list) list.push(star); else byCluster.set(star.cluster, [star]);
      }
      const captionCandidates = [];
      for (const list of byCluster.values()) {
        list.sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z) || String(a.id).localeCompare(String(b.id)));
        captionCandidates.push(...list.slice(0, 3));
      }
      const labels = host.selectVisibleLabels?.(captionCandidates.length ? captionCandidates : shown, { width: W, height: H }, scale, { selectedHerb: selectedId, viewedHerbs: viewed });
      const labelIds = new Set((labels || []).map(item => item.id));
      const alpha = glowAlpha();
      const relatedIds = new Set(focusedId ? layoutApi.relations(layout, focusedId).ids : []);
      const emphasis = star => {
        if (focusedId) return star.id === focusedId || relatedIds.has(star.id) ? 1 : .18;
        if (cluster !== CLUSTER_ALL) return clusterKeyOf(star) === cluster ? 1 : .16;
        return 1;
      };

      if (focusedId) {
        const selected = shown.find(s => s.id === focusedId);
        const relations = new Set(layoutApi.relations(layout, focusedId).ids);
        if (selected) for (const star of shown.filter(s => relations.has(s.id))) {
          ctx.strokeStyle = 'rgba(214,192,139,.22)'; ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(selected.screenX, selected.screenY); ctx.lineTo(star.screenX, star.screenY); ctx.stroke();
        }
      } else if (trailsEnabled) {
        // Interchange trails: two cards are joined when one recorded formula
        // lists both. Same-category pairs read as one colour family, pairs that
        // cross categories are brighter, which is where the traditions meet.
        const byStar = new Map(stars.map(star => [star.id, star]));
        const trailAlpha = (degradeLevel >= 2 ? 0 : degradeLevel >= 1 ? .4 : 1) * (0.35 + 0.65 * Math.min(1, elapsed / (REVEAL.dustMs + REVEAL.starMs)));
        ctx.lineWidth = .6;
        for (const link of trails) {
          const a = byStar.get(link.source), b = byStar.get(link.target);
          if (!a || !b || a.zr > DEPTH_RANGE || b.zr > DEPTH_RANGE) continue;
          if (!visible(a) || !visible(b)) continue;
          const cross = a.category !== b.category;
          ctx.strokeStyle = (cross ? TRAIL_CROSS : TRAIL_SAME) + (cross ? .26 : .13) * trailAlpha + ')';
          ctx.beginPath(); ctx.moveTo(a.screenX, a.screenY); ctx.lineTo(b.screenX, b.screenY); ctx.stroke();
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
          if (star.herb?.name) ctx.fillText(star.herb.name, star.screenX, star.screenY - core * 3.6);
        }
        if (star.viewed || focusedId === star.id) {
          ctx.strokeStyle = '#F0CA77'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(star.screenX, star.screenY, Math.max(5, core * 1.9), 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      if (webgl) { try { webgl.render(particles, W, H); } catch (_) { fallback('增强画面中断，已恢复基础星图'); } }

      // Captions last so no star can cover a name. The name is the group's own
      // label from the data, and the count is the cards actually shown.
      captionsDrawn = drawIslandCaptions(ctx, islandsWithCards(islandAnchors, shown), W, H, {
        labelOf: island => CLUSTER_LABELS[island.key] || island.key,
        activeKey: cluster,
        focused: Boolean(focusedId)
      }) || [];
      const aimed = islandAnchors.find(anchor => anchor.island.key === cluster);
      aimedAt = aimed ? { key: aimed.island.key, x: aimed.sx, y: aimed.sy, radius: aimed.radius } : null;

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
      // The picking radius shrinks as the field is magnified: at four times the
      // scale a card is fifteen screen pixels across, and a fixed radius would
      // swallow its neighbours long before the viewer could aim between them.
      const reach = Math.max(8, Math.min(16, 16 * frameFit));
      for (const star of stars) {
        if (!visible(star)) continue;
        if (star.zr > DEPTH_RANGE) continue;
        const blur = degradeLevel >= 1 ? 0 : depthBlur(star.zr);
        const radius = Math.max(reach, star.size * star.persp * scale * frameFit * 2.4) * (1 + blur * 0.6);
        const distance = Math.hypot(mx - star.screenX, my - star.screenY);
        if (distance < radius && distance < bestDistance) { bestDistance = distance; best = star; }
      }
      return best;
    }

    function focus(id, animate = true, source = 'cosmos-focus') {
      const star = stars.find(item => item.id === id);
      if (!star) return;
      focusedId = star.id;
      cluster = CLUSTER_ALL; flight = null;
      syncLayout();
      categoryFilter = ''; regionFilters.clear();
      targetRotY = 0; targetScale = 1.1; targetAnchorX = 0; targetAnchorY = 0;
      setRelationPositions();
      if (!animate || !revealEnabled()) {
        rotY = targetRotY; scale = targetScale; anchorX = targetAnchorX; anchorY = targetAnchorY;
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
        flight = null;
        lastX = event.clientX; lastY = event.clientY;
        if (moved > 5) { focusedId = null; setRelationPositions(); }
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
        targetRotY += (event.key === 'ArrowLeft' ? -0.2 : 0.2); manuallyRotated = true; flight = null; focusedId = null; setRelationPositions(); event.preventDefault();
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
      clearFocus() {
        focusedId = null; manuallyRotated = false; flight = null;
        cluster = CLUSTER_ALL;
        targetRotY = 0; targetScale = 1; targetAnchorX = 0; targetAnchorY = 0;
        setRelationPositions(); invalidate();
      },
      setFilter(category = '', regions = []) { categoryFilter = category; regionFilters = new Set(regions); invalidate(); return stars.filter(visible).length; },
      // Cluster travel: choosing a group regroups the sky by that reading and
      // flies the camera to the group, so the destination is a place in the map
      // rather than a filter over it.
      flyTo(key = CLUSTER_ALL) {
        syncLayout();
        const next = key === CLUSTER_ALL || activeClusters.some(island => island.key === key) ? key : CLUSTER_ALL;
        focusedId = null; manuallyRotated = true; flight = null;
        categoryFilter = ''; regionFilters.clear();
        if (next === CLUSTER_ALL) {
          cluster = CLUSTER_ALL;
          syncLayout();
          targetRotY = 0; targetScale = 1; targetAnchorX = 0; targetAnchorY = 0;
          setRelationPositions();
          if (!revealEnabled()) { rotY = targetRotY; scale = targetScale; anchorX = 0; anchorY = 0; }
          invalidate();
          return cluster;
        }
        cluster = next;
        syncLayout();
        setRelationPositions();
        syncAnchor();
        flight = { key: next, start: performance.now(), duration: revealEnabled() ? FLY_MS : 0, fromRot: rotY, toRot: targetRotY, fromX: anchorX, fromY: anchorY, fromScale: scale };
        if (!revealEnabled()) { rotY = targetRotY; scale = targetScale; anchorX = targetAnchorX; anchorY = targetAnchorY; flight = null; }
        invalidate();
        return cluster;
      },
      setRoam(enabled) {
        roam = Boolean(enabled); canvas.dataset.roam = String(roam);
        const pointers = [...activePointers.keys()]; activePointers.clear();
        pointers.forEach(id => { if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id); });
        dragging = false; pinchDistance = 0; moved = 20; invalidate();
      },
      setRenderer(choice = 'auto') { rendererEpoch += 1; rendererChoice = choice; rendererAttempted = false; fallback(''); if (running) enhance(); },
      setReading(mode) {
        reading = READING_MODES.includes(mode) ? mode : DEFAULT_READING;
        // The literature-distribution reading is the one that regroups cards
        // into their recorded regions; every other reading keeps the disk.
        syncLayout();
        setRelationPositions();
        paint();
        return reading;
      },
      setColorMode() { paint(); },
      clusters: clusterCounts,
      zoom(delta) { targetScale = Math.max(0.5, Math.min(2.4, targetScale + Number(delta || 0))); invalidate(); },
      resetMotion() { if (!revealEnabled()) { targetRotY = rotY; scale = targetScale; anchorX = targetAnchorX; anchorY = targetAnchorY; setRelationPositions(); } invalidate(); },
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
          nodeCount: stars.length, categoryFilter, regions: [...regionFilters], roam, focusedId, cluster,
          flight: Boolean(flight),
          // 名录与被瞄准的岛：截图看不见的东西（哪个分组拿到了名录、穿梭后相机
          // 是否真的停在目标岛上）只有报出来才能被浏览器用例断言。
          captions: captionsDrawn, aimedAt, frameWidth: W, frameHeight: H,
          trailCount: trailsEnabled ? trails.length : 0,
          clusters: clusterCounts(),
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
    clusterOf,
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
    CLUSTER_LABELS,
    CLUSTER_ALL,
    NO_REGION,
    DEFAULT_READING,
    UNIFORM_COLOR,
    ETHNIC_COLOR,
    DIM_COLOR,
    GLOW_ALPHA_BY_THEME,
    REVEAL,
    TRAVEL_LIMIT,
    FRAME_MAX
  };
  if (typeof window !== 'undefined') window.HerbalCosmosEngine = api;
  return api;
})();
