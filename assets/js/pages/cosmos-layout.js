/* Category bands are an editorial index, never measured geography or affinity. */
(function (root) {
  'use strict';
  function hash(value) {
    let n = 2166136261;
    for (const c of String(value)) { n ^= c.codePointAt(0); n = Math.imul(n, 16777619); }
    n ^= n >>> 16; n = Math.imul(n, 0x7feb352d); n ^= n >>> 15; n = Math.imul(n, 0x846ca68b); n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }
  function build(herbs = [], formulas = []) {
    const unique = new Map(herbs.filter(h => h?.id && !['formula-material', 'directory-only'].includes(h.kind)).map(h => [h.id, h]));
    const nodes = [...unique.values()].sort((a, b) => String(a.id).localeCompare(String(b.id))).map(h => {
      const category = h.cat || '类别未录入';
      const center = (hash(category) - .5) * 460;
      const along = (hash(h.id + ':along') - .5) * 165;
      const across = (hash(h.id + ':across') - .5) * 55;
      return { id: h.id, category, x: center + along, y: center * -.32 + (hash(category + ':lane') - .5) * 145 + across + along * -.18, z: (hash(h.id + ':depth') - .5) * 90 };
    });
    const edges = formulas.flatMap(f => [...new Set((f.herbs || []).map(m => Array.isArray(m) ? m[0] : m.id))].filter(id => unique.has(id)).map(id => ({ source: f.id, target: id, type: 'ingredient', formulaId: f.id })));
    return { nodes, edges };
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
  root.HerbalCosmosLayout = { hash, build, relations, selectedPositions };
})(typeof window === 'undefined' ? globalThis : window);
