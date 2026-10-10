/* Editorial star positions, never measured geography or affinity.
 * Every reading returns nodes keyed exactly { category, id, x, y, z } plus the
 * island list the camera travels to, so filters, picking, labels and cluster
 * travel all read one geometry.
 *
 * A group occupies an island whose area grows with how many cards it holds: a
 * one-card group is a dot and a two-hundred-card group is a wide field. Card
 * density therefore stays even across the sky instead of every group being
 * smeared over an identical disk. */
(function (root) {
  'use strict';
  function hash(value) {
    let n = 2166136261;
    for (const c of String(value)) { n ^= c.codePointAt(0); n = Math.imul(n, 16777619); }
    n ^= n >>> 16; n = Math.imul(n, 0x7feb352d); n ^= n >>> 15; n = Math.imul(n, 0x846ca68b); n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }

  // One flat disk: u spans the screen axis, v is tilted into depth so the scene
  // still reads as a three-dimensional galaxy while it rotates. The tilt is
  // deliberately shallow — an almost edge-on disk squashes the field into a
  // band and doubles the on-screen star density for no extra information.
  const DISK = Object.freeze({ tiltSin: 0.72, tiltCos: 0.694, golden: 2.399963229728653 });
  /* Island geometry. `floor` is the area all islands share, so an island radius
     is sqrt(floor * count / total) and every island holds the same number of
     cards per unit area. `gap` is the empty band kept between two islands for
     their captions and the picking radius around them; `boundary` is the flat
     ellipse the islands relax inside, matching the wide hero canvas; `relax`
     and `growth` drive the packing, `trials` bounds it. `lift` is the vertical
     jitter that makes the disk read as a volume: it is deliberately kept far
     below the in-plane spacing, because any vertical offset also closes the
     on-screen gap between two neighbours while the field turns. */
  const ISLAND = Object.freeze({ floor: 48_000, gap: 9, boundary: 1.45, relax: 320, growth: 1.06, trials: 6, lift: 2 });
  const REGION_ORDER = Object.freeze(['青藏', '西北', '北方', '西南', '东南']);
  const UNKNOWN_CLUSTER = '无分布记录';

  function diskPoint(u, v, hy = 0) {
    return { x: u, y: v * DISK.tiltSin + hy, z: v * DISK.tiltCos };
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

  function radiusOf(count, total) {
    return Math.sqrt((ISLAND.floor * Math.max(0, count)) / Math.max(1, total));
  }

  /* Islands are relaxed inside a flat ellipse until no two overlap by more than
     `gap`, growing the ellipse until every island fits. Islands are seeded on a
     ring in size order and relaxed as unordered pairs, so the result depends
     only on the group names and counts — never on the order records arrive in. */
  function placeIslands(groups) {
    let ax = 360;
    let ay = Math.round(ax / ISLAND.boundary);
    let placed = [];
    for (let trial = 0; trial < ISLAND.trials; trial += 1) {
      placed = groups.map((group, index) => {
        const angle = (index / Math.max(1, groups.length)) * Math.PI * 2;
        return Object.assign({}, group, { x: Math.cos(angle) * ax * 0.55, y: Math.sin(angle) * ay * 0.55 });
      });
      for (let step = 0; step < ISLAND.relax; step += 1) {
        const cool = 1 - step / ISLAND.relax;
        for (let i = 0; i < placed.length; i += 1) {
          for (let j = i + 1; j < placed.length; j += 1) {
            const a = placed[i], b = placed[j];
            let dx = b.x - a.x, dy = b.y - a.y;
            let d = Math.hypot(dx, dy);
            if (d === 0) { dx = 1; dy = 0; d = 1; }
            const want = a.radius + b.radius + ISLAND.gap;
            if (d >= want) continue;
            const push = ((want - d) / 2) * (0.4 + 0.6 * cool);
            const ux = (dx / d) * push, uy = (dy / d) * push;
            a.x -= ux; a.y -= uy; b.x += ux; b.y += uy;
          }
          // Keep every island inside the ellipse, including its own radius.
          const island = placed[i];
          const limitX = Math.max(1, ax - island.radius);
          const limitY = Math.max(1, ay - island.radius);
          const overflow = Math.hypot(island.x / limitX, island.y / limitY);
          if (overflow > 1) { island.x /= overflow; island.y /= overflow; }
        }
      }
      let worst = Infinity;
      for (let i = 0; i < placed.length; i += 1) {
        for (let j = i + 1; j < placed.length; j += 1) {
          const gap = Math.hypot(placed[j].x - placed[i].x, placed[j].y - placed[i].y) - placed[i].radius - placed[j].radius;
          if (gap < worst) worst = gap;
        }
      }
      if (placed.length < 2 || worst >= ISLAND.gap * 0.5) break;
      ax = Math.round(ax * ISLAND.growth);
      ay = Math.round(ay * ISLAND.growth);
    }
    return placed;
  }

  /* Group cards into islands, then lay each island out as a golden-angle
     sunflower so spacing is even at every island size and no two cards can land
     on one point. `rankOf` orders the members of one island, which is how the
     centre of an island can mean something. */
  function islandsOf(nodes = [], keyOf, rankOf) {
    const buckets = new Map();
    for (const node of nodes) {
      const key = keyOf(node) || UNKNOWN_CLUSTER;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(node);
    }
    const total = Math.max(1, nodes.length);
    const groups = [...buckets.entries()]
      .map(([key, members]) => ({ key, members, count: members.length, radius: radiusOf(members.length, total) }))
      .sort((a, b) => b.count - a.count || String(a.key).localeCompare(String(b.key), 'zh-CN'));
    const placed = placeIslands(groups);
    const byKey = new Map(placed.map(island => [island.key, island]));
    const slot = new Map();
    for (const island of placed) {
      const members = rankOf ? rankOf(island) : island.members;
      members.forEach((member, index) => slot.set(member.id, { index, count: members.length }));
    }
    const positioned = nodes.map(node => {
      const island = byKey.get(keyOf(node) || UNKNOWN_CLUSTER);
      const place = slot.get(node.id) || { index: 0, count: 1 };
      const reach = place.count > 1 ? island.radius * Math.sqrt((place.index + 0.5) / place.count) : 0;
      // Each island gets its own phase so no two islands repeat one pattern; the
      // per-card jitter stays tiny because the sunflower already breaks the grid
      // and a wider offset measurably closes the gap between neighbours.
      const drift = hash(island.key) * Math.PI * 2 + place.index * DISK.golden + (hash(node.id + ':drift') - 0.5) * 0.02;
      const lift = (hash(node.id + ':lift') - 0.5) * ISLAND.lift;
      return Object.assign({ id: node.id, category: node.category }, diskPoint(
        island.x + reach * Math.cos(drift),
        island.y + reach * Math.sin(drift),
        lift
      ));
    });
    const clusters = placed.map(island => ({
      key: island.key, count: island.count, radius: island.radius, x: island.x, y: island.y
    }));
    return { nodes: positioned, clusters };
  }

  function build(herbs = [], formulas = []) {
    const unique = new Map(herbs.filter(h => h?.id && !['formula-material', 'directory-only'].includes(h.kind)).map(h => [h.id, h]));
    const list = [...unique.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const hub = hubWeights(unique, formulas);
    const decorated = list.map(h => ({ id: h.id, category: h.cat || '类别未录入', hub: hub.get(h.id) || 0 }));
    const shaped = islandsOf(decorated, node => node.category, island => {
      // Cards recorded in the most source formulas sit nearest their island's
      // centre, so one reading of the sky also shows what the archive's
      // prescriptions keep returning to. Ties fall back to the card id.
      return [...island.members].sort((a, b) => b.hub - a.hub || String(a.id).localeCompare(String(b.id)));
    });
    const edges = formulas.flatMap(f => [...new Set((f.herbs || []).map(m => Array.isArray(m) ? m[0] : m.id))].filter(id => unique.has(id)).map(id => ({ source: f.id, target: id, type: 'ingredient', formulaId: f.id })));
    return { nodes: shaped.nodes, edges, clusters: shaped.clusters };
  }

  /* Same node contract, regrouped into the literature regions the archive
     records. Cards with no recorded province form their own island instead of
     being guessed into a region. */
  function regionKey(node, resolve) {
    const key = resolve(node);
    return REGION_ORDER.includes(key) ? key : UNKNOWN_CLUSTER;
  }

  function regionLayout(nodes = [], resolve = () => '') {
    return islandsOf(nodes, node => regionKey(node, resolve));
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
  function selectedPositions(layout, id) {
    const ids = relations(layout, id).ids;
    return layout.nodes.map(n => {
      if (n.id === id) return { ...n, x: 0, y: 0, z: -35 };
      const i = ids.indexOf(n.id);
      if (i < 0) return { ...n };
      const angle = i / Math.max(1, ids.length) * Math.PI * 2;
      return { ...n, x: Math.cos(angle) * 120, y: Math.sin(angle) * 100, z: 0 };
    });
  }

  /* How much room the field needs, as the horizontal support that survives
     rotation plus the vertical extent. The camera fits to this instead of to a
     constant, so a reading with fewer islands is framed tighter rather than
     floating in the middle of an empty frame. */
  function bounds(nodes = [], pad = 1) {
    let spanX = 0, spanY = 0;
    for (const node of nodes) {
      spanX = Math.max(spanX, Math.hypot(node.x, node.z));
      spanY = Math.max(spanY, Math.abs(node.y));
    }
    return { spanX: 2 * spanX * pad, spanY: 2 * spanY * pad };
  }

  root.HerbalCosmosLayout = { hash, build, relations, selectedPositions, regionPositions, regionLayout, islandsOf, bounds, cooccurrence, REGION_ORDER, UNKNOWN_CLUSTER, ISLAND };
})(typeof window === 'undefined' ? globalThis : window);
