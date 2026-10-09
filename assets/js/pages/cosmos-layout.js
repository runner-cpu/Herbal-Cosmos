/* Editorial star positions, never measured geography or affinity.
 * Two deterministic readings share one contract: every layout returns nodes
 * keyed exactly { category, id, x, y, z } so filters, picking and labels keep
 * working while the camera flies between clusters. */
(function (root) {
  'use strict';
  function hash(value) {
    let n = 2166136261;
    for (const c of String(value)) { n ^= c.codePointAt(0); n = Math.imul(n, 16777619); }
    n ^= n >>> 16; n = Math.imul(n, 0x7feb352d); n ^= n >>> 15; n = Math.imul(n, 0x846ca68b); n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }

  // A flattened disk: u spans the screen axis, v is tilted into depth so the
  // scene still reads as a three-dimensional galaxy while it rotates.
  const DISK = Object.freeze({ arms: 4, rMin: 92, rMax: 252, swirl: 1.35, tiltSin: 0.4, tiltCos: 0.916, thickness: 15, golden: 2.399963229728653 });
  const REGION_ORDER = Object.freeze(['青藏', '西北', '北方', '西南', '东南']);
  const UNKNOWN_CLUSTER = '无分布记录';

  function diskPoint(u, v, hy = 0) {
    return { x: u, y: v * DISK.tiltSin + hy, z: v * DISK.tiltCos };
  }

  function categoryOrder(list) {
    const counts = new Map();
    for (const h of list) { const cat = h.cat || '类别未录入'; counts.set(cat, (counts.get(cat) || 0) + 1); }
    return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || String(a).localeCompare(String(b), 'zh-CN'));
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
    const categories = categoryOrder(list);
    const slot = new Map(categories.map((cat, index) => [cat, index]));
    const hub = hubWeights(unique, formulas);
    // Each category keeps one arm segment; its cards spread inside that
    // segment by a golden-angle drift, so no two cards can land on one point.
    const span = 14 + 30 * Math.sqrt(Math.min(list.length / Math.max(1, categories.length), 60) / 60);
    const seen = new Map();
    const nodes = list.map(h => {
      const category = h.cat || '类别未录入';
      const index = slot.get(category);
      const t = categories.length > 1 ? index / (categories.length - 1) : 0.5;
      const radius = DISK.rMin + (DISK.rMax - DISK.rMin) * Math.pow(t, 0.7);
      const angle = (index % DISK.arms) * (Math.PI * 2 / DISK.arms) + radius * (DISK.swirl / DISK.rMax) + (hash(category) - 0.5) * 0.16;
      const rank = seen.get(category) || 0;
      seen.set(category, rank + 1);
      const reach = span * Math.sqrt(hash(h.id + ':reach'));
      const drift = hash(category) * Math.PI * 2 + rank * DISK.golden + (hash(h.id + ':drift') - 0.5) * 0.7;
      // Herbs recorded in the shared prescriptions drift toward the bright core,
      // so the classical formulas read as one luminous centre.
      const weight = Math.min(1, (hub.get(h.id) || 0) / 5);
      const pull = 1 - 0.45 * weight;
      const u = (radius * Math.cos(angle) + reach * Math.cos(drift)) * pull;
      const v = (radius * Math.sin(angle) + reach * Math.sin(drift)) * pull;
      const lift = (hash(h.id + ':lift') - 0.5) * (DISK.thickness + weight * 46);
      return Object.assign({ id: h.id, category }, diskPoint(u, v, lift));
    });
    const edges = formulas.flatMap(f => [...new Set((f.herbs || []).map(m => Array.isArray(m) ? m[0] : m.id))].filter(id => unique.has(id)).map(id => ({ source: f.id, target: id, type: 'ingredient', formulaId: f.id })));
    return { nodes, edges };
  }

  /* Same node contract, regrouped into the literature regions the archive
     records. The five named regions form a ring; cards without a recorded
     province gather in the core instead of being guessed into a region. */
  function regionPositions(nodes = [], resolve = () => '') {
    const buckets = new Map([...REGION_ORDER, UNKNOWN_CLUSTER].map(key => [key, []]));
    for (const node of nodes) {
      const key = REGION_ORDER.includes(resolve(node)) ? resolve(node) : UNKNOWN_CLUSTER;
      buckets.get(key).push(node);
    }
    const placed = new Map();
    [...REGION_ORDER, UNKNOWN_CLUSTER].forEach((key, index) => {
      const group = buckets.get(key);
      const core = key === UNKNOWN_CLUSTER;
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / REGION_ORDER.length);
      const radius = core ? 58 : 214;
      const reach = 18 + 44 * Math.sqrt(Math.min(group.length, 90) / 90);
      const spin = hash(key) * Math.PI * 2;
      group.sort((a, b) => String(a.id).localeCompare(String(b.id))).forEach((node, rank) => {
        const distance = reach * Math.sqrt(hash(node.id + ':reach'));
        const drift = spin + rank * DISK.golden + (hash(node.id + ':drift') - 0.5) * 0.6;
        const u = radius * Math.cos(angle) + distance * Math.cos(drift);
        const v = radius * Math.sin(angle) + distance * Math.sin(drift);
        const lift = (hash(node.id + ':lift') - 0.5) * (core ? 26 : DISK.thickness);
        placed.set(node.id, Object.assign({ id: node.id, category: node.category }, diskPoint(u, v, lift)));
      });
    });
    return nodes.map(node => placed.get(node.id) || Object.assign({}, node));
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

  root.HerbalCosmosLayout = { hash, build, relations, selectedPositions, regionPositions, cooccurrence, REGION_ORDER, UNKNOWN_CLUSTER };
})(typeof window === 'undefined' ? globalThis : window);
