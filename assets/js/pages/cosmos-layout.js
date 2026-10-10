/* 星图几何：星海是一颗球，不是一个平面。
 *
 * 每张知识卡是球面上的一颗粒子，按黄金角均匀铺开，所以任意视角下卡片密度都
 * 一致——这是「粒子星球」能看清的前提。同一分组的卡片聚成一块球冠，像星座一样
 * 连成一片；球冠的球面面积与卡片数成正比，因此最大的分组也只是球面上更大的一块，
 * 而不是把卡片挤成一团。
 *
 * 每次读法都返回同一份节点契约 { category, id, x, y, z }，另加 clusters（球冠的
 * 中心轴、角半径与卡片数），摄像机绕球心旋转把目标星座转到正前方。 */
(function (root) {
  'use strict';
  function hash(value) {
    let n = 2166136261;
    for (const c of String(value)) { n ^= c.codePointAt(0); n = Math.imul(n, 16777619); }
    n ^= n >>> 16; n = Math.imul(n, 0x7feb352d); n ^= n >>> 15; n = Math.imul(n, 0x846ca68b); n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }

  /* 球面参数。radius 是球面半径；golden 是黄金角，用来在球面与球冠内均匀铺点；
     gap 是两块球冠之间留的角间隙（弧度）；relax/trials 驱动球冠中心的松弛，
     保证大分组不会把相邻的小分组盖住。 */
  const SPHERE = Object.freeze({ radius: 240, golden: 2.399963229728653, gap: 0.05, relax: 260, growth: 1.12, trials: 5, shell: 1.75 });
  const REGION_ORDER = Object.freeze(['青藏', '西北', '北方', '西南', '东南']);
  const UNKNOWN_CLUSTER = '无分布记录';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function normalize(v) {
    const length = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / length, y: v.y / length, z: v.z / length };
  }
  function fibonacciDirection(index, total) {
    if (total <= 1) return { x: 0, y: 1, z: 0 };
    const y = 1 - 2 * ((index + 0.5) / total);
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * SPHERE.golden;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  }
  // 一块球冠在球面上的面积是 2πR²(1-cosθ)；让面积与卡片数成正比，就得到下面的角半径。
  function capSin(count, total) {
    return Math.sqrt(clamp(count / Math.max(1, total), 0, 1));
  }
  function tangentBasis(axis) {
    const helper = Math.abs(axis.y) > 0.9 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
    const e1 = normalize({ x: axis.y * helper.z - axis.z * helper.y, y: axis.z * helper.x - axis.x * helper.z, z: axis.x * helper.y - axis.y * helper.x });
    const e2 = { x: axis.y * e1.z - axis.z * e1.y, y: axis.z * e1.x - axis.x * e1.z, z: axis.x * e1.y - axis.y * e1.x };
    return { e1, e2 };
  }

  /* 球冠中心的排布：先按黄金角均匀撒在球面上（与卡片同一套均匀分布），
     再把重叠的球冠沿着大圆推开，直到每对中心之间至少隔开两个角半径加间隙。
     固定的球面装不下时就整体收紧角半径（growth），而不是让某一块盖住别人。 */
  function placeConstellations(groups) {
    const total = Math.max(1, groups.length);
    const axes = groups.map((_, index) => fibonacciDirection(index, total));
    let radii = groups.map(group => group.sinTheta);
    for (let trial = 0; trial < SPHERE.trials; trial += 1) {
      for (let step = 0; step < SPHERE.relax; step += 1) {
        const cool = 1 - step / SPHERE.relax;
        for (let i = 0; i < axes.length; i += 1) {
          for (let j = i + 1; j < axes.length; j += 1) {
            const a = axes[i], b = axes[j];
            const dot = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
            const angle = Math.acos(dot);
            const want = Math.asin(clamp(radii[i], 0, 1)) + Math.asin(clamp(radii[j], 0, 1)) + SPHERE.gap;
            if (angle >= want) continue;
            // 沿大圆方向各退一半；两块中心重合时给一个人为方向，避免除零。
            const push = (want - angle) * 0.5 * (0.35 + 0.65 * cool);
            let tx = b.x - a.x * dot, ty = b.y - a.y * dot, tz = b.z - a.z * dot;
            if (Math.hypot(tx, ty, tz) < 1e-6) { tx = 1; ty = 0; tz = 0; }
            const t = normalize({ x: tx, y: ty, z: tz });
            axes[i] = normalize({ x: a.x - t.x * push, y: a.y - t.y * push, z: a.z - t.z * push });
            axes[j] = normalize({ x: b.x + t.x * push, y: b.y + t.y * push, z: b.z + t.z * push });
          }
        }
      }
      let worst = Infinity;
      for (let i = 0; i < axes.length; i += 1) {
        for (let j = i + 1; j < axes.length; j += 1) {
          const a = axes[i], b = axes[j];
          const angle = Math.acos(clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1));
          const gap = angle - Math.asin(clamp(radii[i], 0, 1)) - Math.asin(clamp(radii[j], 0, 1));
          if (gap < worst) worst = gap;
        }
      }
      if (axes.length < 2 || worst >= SPHERE.gap * 0.5) break;
      radii = radii.map(sin => Math.min(1, sin / SPHERE.growth));
    }
    return axes.map((axis, index) => ({ key: groups[index].key, axis, radius: Math.asin(clamp(radii[index], 0, 1)) }));
  }

  /* 一张卡在球冠里的位置：把球冠按球面面积正投影到切平面，平面内点用向日葵
     铺开（任意张数下间距都均匀），再投影回球面。等面积投影保证密度处处一致。 */
  function sphereOf(nodes = [], keyOf, rankOf) {
    const buckets = new Map();
    for (const node of nodes) {
      const key = keyOf(node) || UNKNOWN_CLUSTER;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(node);
    }
    const total = Math.max(1, nodes.length);
    const groups = [...buckets.entries()]
      .map(([key, members]) => ({ key, members, count: members.length, sinTheta: capSin(members.length, total) }))
      .sort((a, b) => b.count - a.count || String(a.key).localeCompare(String(b.key), 'zh-CN'));
    const placed = placeConstellations(groups);
    const byKey = new Map(placed.map(item => [item.key, item]));
    const caps = new Map();
    for (const group of groups) {
      const members = rankOf ? rankOf(group) : group.members;
      const placedGroup = byKey.get(group.key);
      const { e1, e2 } = tangentBasis(placedGroup.axis);
      const radius = SPHERE.radius;
      const points = new Map();
      members.forEach((member, index) => {
        const sin = Math.min(0.999, group.sinTheta * Math.sqrt((index + 0.5) / members.length));
        const angle = index * SPHERE.golden;
        const u = sin * Math.cos(angle), v = sin * Math.sin(angle), w = Math.sqrt(Math.max(0, 1 - sin * sin));
        points.set(member.id, {
          x: radius * (placedGroup.axis.x * w + e1.x * u + e2.x * v),
          y: radius * (placedGroup.axis.y * w + e1.y * u + e2.y * v),
          z: radius * (placedGroup.axis.z * w + e1.z * u + e2.z * v)
        });
      });
      caps.set(group.key, { key: group.key, count: group.count, radius: placedGroup.radius, axis: placedGroup.axis, points });
    }
    const positioned = nodes.map(node => {
      const cap = caps.get(keyOf(node) || UNKNOWN_CLUSTER);
      const point = cap?.points.get(node.id) || { x: 0, y: 0, z: -SPHERE.radius };
      return { id: node.id, category: node.category, x: point.x, y: point.y, z: point.z };
    });
    const clusters = [...caps.values()].map(cap => ({
      key: cap.key, count: cap.count, radius: cap.radius,
      axis: cap.axis,
      x: cap.axis.x * SPHERE.radius, y: cap.axis.y * SPHERE.radius, z: cap.axis.z * SPHERE.radius
    }));
    return { nodes: positioned, clusters };
  }

  function hubWeights(unique, formulas = []) {
    const hub = new Map();
    for (const f of formulas) {
      for (const m of f?.herbs || []) {
        const id = Array.isArray(m) ? m[0] : m?.id;
        if (!unique.has(id)) continue;
        hub.set(id, (hub.get(id) || 0) + 1);
      }
    }
    return hub;
  }

  function build(herbs = [], formulas = []) {
    const unique = new Map(herbs.filter(h => h?.id && !['formula-material', 'directory-only'].includes(h.kind)).map(h => [h.id, h]));
    const list = [...unique.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const hub = hubWeights(unique, formulas);
    const decorated = list.map(h => ({ id: h.id, category: h.cat || '类别未录入', hub: hub.get(h.id) || 0 }));
    // 记载它的方剂越多，就越靠近星座中心：一整颗星球上，中心是资料反复回到的那几味。
    const shaped = sphereOf(decorated, node => node.category, group => {
      return [...group.members].sort((a, b) => b.hub - a.hub || String(a.id).localeCompare(String(b.id)));
    });
    const edges = formulas.flatMap(f => [...new Set((f.herbs || []).map(m => Array.isArray(m) ? m[0] : m.id))].filter(id => unique.has(id)).map(id => ({ source: f.id, target: id, type: 'ingredient', formulaId: f.id })));
    return { nodes: shaped.nodes, edges, clusters: shaped.clusters };
  }

  /* 同一份节点契约，按文献记录的区域重新分组成星座。没有登记省份的卡片自成
     一块球冠，而不是被猜进某个区。 */
  function regionKey(node, resolve) {
    const key = resolve(node);
    return REGION_ORDER.includes(key) ? key : UNKNOWN_CLUSTER;
  }

  function regionLayout(nodes = [], resolve = () => '') {
    return sphereOf(nodes, node => regionKey(node, resolve));
  }

  function regionPositions(nodes = [], resolve = () => '') {
    return regionLayout(nodes, resolve).nodes;
  }

  /* Herb-to-herb trails derived from the same recorded prescriptions: two cards
     are linked when one source formula lists both. Sampled deterministically so
     the trail layer stays inside the frame budget. */
  function cooccurrence(layout, { limit = 420 } = {}) {
    const groups = new Map();
    for (const edge of layout.edges || []) {
      if (!edge?.formulaId || !edge.target) continue;
      if (!groups.has(edge.formulaId)) groups.set(edge.formulaId, new Set());
      groups.get(edge.formulaId).add(edge.target);
    }
    const links = [];
    const seen = new Set();
    for (const [formulaId, targets] of groups) {
      const ids = [...targets].sort();
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
          const key = ids[i] + '|' + ids[j];
          if (seen.has(key)) continue;
          seen.add(key);
          links.push({ source: ids[i], target: ids[j], formulaId });
        }
      }
    }
    links.sort((a, b) => (a.source + '|' + a.target).localeCompare(b.source + '|' + b.target));
    if (links.length <= limit) return links;
    const step = Math.ceil(links.length / limit);
    return links.filter((_, index) => index % step === 0).slice(0, limit);
  }

  function relations(layout, id) {
    const formulas = new Set(layout.edges.filter(e => e.target === id).map(e => e.formulaId));
    const related = new Set(layout.edges.filter(e => formulas.has(e.formulaId)).map(e => e.target));
    related.delete(id);
    return { formulas: [...formulas].sort(), ids: [...related].sort() };
  }

  /* 选中一味本草：把它放到球的正前方，相关卡片在它周围铺成一小圈，
     于是「这颗星和谁一起被记载」在一个视角里读完，其余星辰留在球面上作背景。 */
  function selectedPositions(layout, id) {
    const ids = relations(layout, id).ids;
    const radius = SPHERE.radius;
    return layout.nodes.map(n => {
      if (n.id === id) return { ...n, x: 0, y: 0, z: -radius };
      const i = ids.indexOf(n.id);
      if (i < 0) return { ...n };
      const angle = i / Math.max(1, ids.length) * Math.PI * 2;
      const ring = radius * 0.46;
      return { ...n, x: Math.cos(angle) * ring, y: Math.sin(angle) * ring, z: -radius * 0.86 };
    });
  }

  /* 摄像机要框住的球面范围。球体是旋转对称的，所以「在任意视角下都留在画面内」
     等价于把整颗球装进去：水平与竖直方向都是直径，也就是半径的两倍。
     返回 radius 供调用方按同一尺寸取景，避免两处各写一份半径。 */
  function bounds(nodes = [], pad = 1) {
    let radius = 0;
    for (const node of nodes) radius = Math.max(radius, Math.hypot(node.x, node.y, node.z));
    radius = Math.max(radius, 1);
    return { spanX: 2 * radius * pad, spanY: 2 * radius * pad, radius };
  }

  root.HerbalCosmosLayout = { hash, build, relations, selectedPositions, regionPositions, regionLayout, sphereOf, bounds, cooccurrence, REGION_ORDER, UNKNOWN_CLUSTER, SPHERE };
})(typeof window === 'undefined' ? globalThis : window);
