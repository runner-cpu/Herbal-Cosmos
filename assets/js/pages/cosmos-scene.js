/* 星图场景词汇：分区映射、配色、景深与揭示数学、星团光晕与名录绘制。
 * 与 cosmos-engine.js 的挂载、状态与交互解耦，以 classic script 形式加载，
 * 暴露 window.HerbalCosmosScene。引擎把这里的成员原样挂到自己的公开 API 上，
 * 因此 window.HerbalCosmosEngine.* 的既有契约不变，而词汇表可以单独验证。 */
(function (root) {
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
  const NO_REGION = '无分布记录';
  const CLUSTER_ALL = 'all';
  const READING_MODES = Object.freeze(['category', 'geography', 'nature', 'ethnic']);
  const READING_LABELS = Object.freeze({ category: '资料分类', geography: '文献分布', nature: '药性', ethnic: '民族对照' });
  const CLUSTER_LABELS = Object.freeze({ 青藏: '青藏', 西北: '西北', 北方: '北方', 西南: '西南', 东南: '东南', [NO_REGION]: '未录分布' });
  const DEFAULT_READING = 'category';
  const GLOW_SIZE = 128;
  const GLOW_ALPHA_BY_THEME = Object.freeze({ day: 0.55, night: 1, ink: 0.72 });
  const DEPTH_RANGE = 300;
  const FOV = 640;
  const REVEAL = Object.freeze({ dustMs: 800, starMs: 1200, spread: 0.75, ramp: 0.45 });
  const TRAIL_SAME = 'rgba(126,164,152,';
  const TRAIL_CROSS = 'rgba(216,188,116,';
  /* Framing budget. The camera fits the reading's own extent into the canvas
     minus a margin for the island captions, and never magnifies past the point
     where a one-island reading would show five stars across the screen. */
  const FRAME_MARGIN = 34;
  const FRAME_PAD = 1.18;
  const FRAME_MAX = 1.6;
  const FLY_MS = 900;
  // 星团穿梭只提供够大的分组：二十八个资料分类里一半只有一两个抽屉，
  // 把它们全做成目的地只会让这一行变成噪声。
  const TRAVEL_LIMIT = 6;

  function hexWithAlpha(color, alpha) {
    const match = String(color || '').trim().match(/^#([0-9a-f]{6})$/i);
    if (!match) return color;
    const value = parseInt(match[1], 16);
    return 'rgba(' + ((value >> 16) & 255) + ',' + ((value >> 8) & 255) + ',' + (value & 255) + ',' + alpha + ')';
  }

  // Province lists follow the same five-region reading the archive publishes;
  // a card recorded in several provinces belongs to every region it names.
  function regionOf(origin) {
    const regions = regionsOf(origin);
    return regions.length === 1 ? regions[0] : regions.length ? 'multiple' : 'unknown';
  }
  function regionsOf(origin) {
    const list = Array.isArray(origin) ? origin : [];
    return Object.keys(REGION_OF_PROVINCE).filter(region => list.some(province => REGION_OF_PROVINCE[region].includes(province)));
  }
  function clusterOf(herb = {}) {
    return regionsOf(herb.origin)[0] || NO_REGION;
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

  /* 每个星团背后的光晕。它让一片散点在上屏的瞬间就读成有名字的分组，
     不必等用户悬停；被选中时压暗而不是消失，读者仍能看见自己的位置。
     光晕只有一种颜色，所以整幅光晕只预渲染一次，之后按半径缩放贴图：
     每帧为二十八个星团各建一次渐变会把绘制成本推回 40ms 量级。 */
  const HALO_SIZE = 256;
  let halo = null;
  function haloImage() {
    if (halo) return halo;
    halo = createGlowSprite('#7EB29E', 1, HALO_SIZE);
    return halo;
  }

  function drawIslandHalos(ctx, anchors, emphasisOf) {
    const image = haloImage();
    if (!image) return;
    for (const anchor of anchors) {
      const emphasis = emphasisOf ? emphasisOf(anchor.island) : 1;
      if (emphasis <= 0) continue;
      const radius = Math.max(18, anchor.radius * 1.5);
      ctx.globalAlpha = 0.2 * emphasis;
      ctx.drawImage(image, anchor.sx - radius, anchor.sy - radius, radius * 2, radius * 2);
    }
    ctx.globalAlpha = 1;
  }

  /* 名录是画在星图上的字，两块牌子叠在一起就等于都读不出来。岛屿排布已经保证
     了卡片不重叠，但名录挂在岛的外沿，最外侧的小岛在屏幕坐标里仍可能撞上邻居，
     所以落笔前先让一次：同一条水平带上挤不开时，往上翻一行。 */
  const PLATE_PAD = 5, PLATE_HEIGHT = 16, PLATE_STEP = 17;
  function clearPlateY(x, half, wanted, placed, height) {
    const top = 14, bottom = Math.max(top, height - 6);
    let y = Math.min(Math.max(wanted, top), bottom);
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const clash = placed.find(plate => Math.abs(plate.x - x) < plate.half + half && Math.abs(plate.y - y) < PLATE_STEP);
      if (!clash) return y;
      const lifted = y - PLATE_STEP;
      if (lifted < top) break;
      y = lifted;
    }
    return y;
  }

  /* 星团名录最后绘制，任何一颗星辰都盖不住它。名字来自数据本身，数量是当前
     真正画出来的卡片数，所以筛选之后不会报出没有展示的卡片。
     返回这一帧真正落笔的条目（含屏幕坐标与文字宽度）：名录是否真的画出来了、
     画的是哪个分组，可以由调用方核对，而不是只能靠肉眼看截图。 */
  function drawIslandCaptions(ctx, entries, width, height, options = {}) {
    const { labelOf = key => key, activeKey = null, focused = false } = options;
    const placed = [];
    // 被瞄准的那座岛先落位，其余再让路：观众正在看的那块牌子不该被邻居挤走。
    const queue = [...entries].sort((a, b) => Number(b.island.key === activeKey) - Number(a.island.key === activeKey));
    ctx.font = '500 12px "Noto Sans SC",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const painted = [];
    for (const entry of queue) {
      const label = labelOf(entry.island) + ' ' + entry.shown;
      const textWidth = ctx.measureText(label).width;
      const half = textWidth / 2 + PLATE_PAD;
      const x = Math.min(Math.max(entry.sx, half), Math.max(half, width - half));
      const lift = Math.max(16, entry.radius * 1.16);
      const y = clearPlateY(x, half, entry.sy - lift, placed, height);
      const active = entry.island.key === activeKey;
      ctx.globalAlpha = !focused || active ? 0.86 : 0.3;
      ctx.fillStyle = 'rgba(6,26,21,.55)';
      ctx.fillRect(x - half, y - 12, textWidth + PLATE_PAD * 2, PLATE_HEIGHT);
      ctx.fillStyle = active ? '#F3D9A0' : 'rgba(226,238,230,.92)';
      ctx.fillText(label, x, y);
      ctx.globalAlpha = 1;
      placed.push({ x, y, half });
      painted.push({ key: entry.island.key, label, shown: entry.shown, x, y, width: textWidth, active });
    }
    return painted;
  }

  /* 哪些岛该拿到名录：把「真正被画出来的卡片」按分组数一次，只有当前还有卡片
     落在这个分组里的岛才上榜。一次遍历覆盖全部卡片，而不是每个岛各扫一遍，
     所以筛选后的天空不会多出 岛数 × 卡数 次比较。 */
  function islandsWithCards(anchors, shown) {
    const counts = new Map();
    for (const star of shown) counts.set(star.cluster, (counts.get(star.cluster) || 0) + 1);
    const entries = [];
    for (const anchor of anchors) {
      const shownHere = counts.get(anchor.island.key) || 0;
      if (shownHere) entries.push({ ...anchor, shown: shownHere });
    }
    return entries;
  }

  root.HerbalCosmosScene = {
    REGION_OF_PROVINCE, REGION_COLORS, QI_COLORS, UNIFORM_COLOR, ETHNIC_COLOR, DIM_COLOR,
    NO_REGION, CLUSTER_ALL, READING_MODES, READING_LABELS, CLUSTER_LABELS, DEFAULT_READING,
    GLOW_SIZE, GLOW_ALPHA_BY_THEME, DEPTH_RANGE, FOV, REVEAL, TRAIL_SAME, TRAIL_CROSS,
    FRAME_MARGIN, FRAME_PAD, FRAME_MAX, FLY_MS, TRAVEL_LIMIT,
    hexWithAlpha, regionOf, regionsOf, clusterOf, colorForReading, legendFor, particleBudget,
    depthBlur, dustReveal, starReveal, createGlowSprite, supported,
    drawIslandHalos, drawIslandCaptions, islandsWithCards
  };
})(typeof window === 'undefined' ? globalThis : window);
