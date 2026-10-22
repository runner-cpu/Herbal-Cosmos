/**
 * Evidence relation explorer.
 *
 * This module is intentionally data-only: the page can embed the returned
 * markup in any section and keep its existing state/event delegation. Every
 * interactive node exposes `data-relation-node` and every edge exposes
 * `data-relation-id`; the host app can use those values to open its evidence
 * drawer or change the selected herb.
 */

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[char]));

const entityTitle = (entity = {}) => entity.nameZh || entity.titleZh || entity.name || entity.title || entity.id || '未知节点';
const entityMeta = (entity = {}) => entity.scientificName || entity.period || entity.textualOrigin || entity.publisher || entity.kind || '';

const nodeType = (id, indexes) => {
  if (indexes.herbs.has(id)) return 'herb';
  if (indexes.formulas.has(id)) return 'formula';
  if (indexes.anchors.has(id)) return 'anchor';
  if (indexes.sources.has(id)) return 'source';
  return 'unknown';
};

const typeLabel = { herb: '本草', formula: '方剂', anchor: '典籍 / 回响', source: '来源', unknown: '关系节点' };
const typeClass = { herb: 'herb', formula: 'formula', anchor: 'anchor', source: 'source', unknown: 'unknown' };

function wrapLabel(value, max = 10) {
  const text = String(value || '');
  if (text.length <= max) return [text];
  return [text.slice(0, max), `${text.slice(max, max * 2)}${text.length > max * 2 ? '…' : ''}`];
}

function relationGraphModel(dataset, options = {}) {
  const herbs = dataset?.herbs || [];
  const formulas = dataset?.formulas || [];
  const anchors = dataset?.anchors || [];
  const sources = dataset?.sources || [];
  const relations = dataset?.relations || [];
  const indexes = {
    herbs: new Map(herbs.map((item) => [item.id, item])),
    formulas: new Map(formulas.map((item) => [item.id, item])),
    anchors: new Map(anchors.map((item) => [item.id, item])),
    sources: new Map(sources.map((item) => [item.id, item])),
  };
  const focusId = options.focusId || '';
  const maxRelations = Number.isFinite(options.maxRelations) ? options.maxRelations : 28;
  const distance = new Map();
  if (focusId) {
    distance.set(focusId, 0);
    for (let depth = 0; depth < 2; depth += 1) {
      relations.forEach((relation) => {
        const fromDistance = distance.get(relation.from);
        if (fromDistance === depth && !distance.has(relation.to)) distance.set(relation.to, depth + 1);
      });
    }
  }
  const relevant = relations.filter((relation) => {
    if (!focusId) return true;
    if (relation.from === options.focusEntityId || relation.to === options.focusEntityId) return true;
    return distance.has(relation.from) && distance.has(relation.to) && Math.max(distance.get(relation.from), distance.get(relation.to)) <= 2;
  });
  // For a focused herb, show its direct neighborhood first. The host may pass
  // `maxRelations: Infinity` to reveal the entire curated network.
  const orderedRelations = (relevant.length ? relevant : relations)
    .slice()
    .sort((a, b) => Number(b.from === focusId || b.to === focusId) - Number(a.from === focusId || a.to === focusId));
  const visibleRelations = orderedRelations.slice(0, maxRelations);
  // Every curated relation carries sourceIds. Materialise those citations as
  // a final source lane so the graph visibly answers “where did this edge
  // come from?” even when the source is not itself a first-class relation.
  const graphRelations = [...visibleRelations];
  const sourceLinks = new Set();
  visibleRelations.forEach((relation) => (relation.sourceIds || []).forEach((sourceId) => {
    const key = `${relation.to}::${sourceId}`;
    if (relation.to === sourceId || sourceLinks.has(key) || !indexes.sources.has(sourceId)) return;
    sourceLinks.add(key);
    graphRelations.push({
      id: `evidence-${relation.id}-${sourceId}`,
      from: relation.to,
      to: sourceId,
      label: '来源支持',
      evidenceStatus: relation.evidenceStatus,
      boundary: relation.boundary,
      sourceIds: [sourceId],
      synthetic: true,
    });
  }));
  const ids = new Set();
  graphRelations.forEach((relation) => { ids.add(relation.from); ids.add(relation.to); });
  if (focusId && indexes.herbs.has(focusId)) ids.add(focusId);
  const nodes = [...ids].map((id) => {
    const type = nodeType(id, { herbs: indexes.herbs, formulas: indexes.formulas, anchors: indexes.anchors, sources: indexes.sources });
    const entity = indexes[`${type}s`]?.get(id) || { id };
    return { id, type, entity, title: entityTitle(entity), meta: entityMeta(entity), focus: id === focusId };
  });
  const columns = ['herb', 'formula', 'anchor', 'source'];
  const groups = Object.fromEntries(columns.map((type) => [type, nodes.filter((node) => node.type === type)]));
  const width = Number(options.width) || 1080;
  const top = 92;
  const gap = 116;
  const height = Math.max(390, top + Math.max(...columns.map((type) => groups[type].length), 1) * gap + 58);
  const x = { herb: 54, formula: width * 0.31, anchor: width * 0.58, source: width * 0.81 };
  const positions = new Map();
  columns.forEach((type) => groups[type].forEach((node, index) => {
    positions.set(node.id, { x: x[type], y: top + index * gap, node });
  }));
  return { indexes, nodes, groups, visibleRelations, graphRelations, positions, width, height, focusId };
}

function edgePath(from, to) {
  const startX = from.x + 164;
  const endX = to.x;
  const mid = (startX + endX) / 2;
  return `M ${startX} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${endX} ${to.y}`;
}

function nodeMarkup(node, position, options = {}) {
  const active = node.focus || node.id === options.activeId;
  const lines = wrapLabel(node.title);
  const visibleAria = `${typeLabel[node.type]}${lines.join('')}${node.meta || ''}`;
  const aria = `${visibleAria}。${typeLabel[node.type]} ${node.title}${node.meta ? ` ${node.meta}` : ''}`;
  return `<g class="relation-node relation-node-${typeClass[node.type]} ${active ? 'is-active' : ''}" data-relation-node="${esc(node.id)}" tabindex="0" role="button" aria-label="${esc(aria)}" transform="translate(${position.x}, ${position.y})"><rect width="164" height="72" rx="12"></rect><circle class="relation-node-dot" cx="14" cy="18" r="5"></circle><text aria-hidden="true" class="relation-node-type" x="27" y="22">${esc(typeLabel[node.type])}</text>${lines.map((line, index) => `<text aria-hidden="true" class="relation-node-title" x="14" y="${43 + index * 16}">${esc(line)}</text>`).join('')}<text aria-hidden="true" class="relation-node-meta" x="14" y="${lines.length > 1 ? 68 : 61}">${esc(node.meta)}</text></g>`;
}

/**
 * Render a compact, keyboard-accessible evidence constellation.
 *
 * Example:
 *   relationExplorer({
 *     herbs: data.herbs.herbs,
 *     formulas: data.formulas.formulas,
 *     anchors: data.anchors.anchors,
 *     sources: data.sources.sources,
 *     relations: data.relations.relations,
 *   }, { focusId: state.herbId })
 */
export function relationExplorer(dataset, options = {}) {
  const model = relationGraphModel(dataset, options);
  const { visibleRelations, graphRelations, positions, width, height, nodes, focusId } = model;
  const edges = graphRelations.map((relation, index) => {
    const from = positions.get(relation.from);
    const to = positions.get(relation.to);
    if (!from || !to) return '';
    const isFocus = relation.from === focusId || relation.to === focusId;
    const isSelected = relation.id === options.activeRelationId;
    const labelOffset = ((index % 3) - 1) * 11;
    return `<g class="relation-edge ${relation.synthetic ? 'is-support' : ''} ${isFocus ? 'is-focus' : ''} ${isSelected ? 'is-selected' : ''}" data-relation-id="${esc(relation.id)}" tabindex="0" role="button" aria-label="${esc(`${relation.label}：${relation.boundary || ''}`)}"><path class="relation-edge-hit" d="${edgePath(from, to)}"></path><path class="relation-edge-line" d="${edgePath(from, to)}"></path><text class="relation-edge-label" x="${(from.x + to.x + 164) / 2}" y="${(from.y + to.y) / 2 - 6 + labelOffset}">${esc(relation.label)}</text><title>${esc(`${relation.label} · ${relation.evidenceStatus || '未标注状态'}`)}</title></g>`;
  }).join('');
  const legend = `<div class="relation-legend" aria-label="关系图例"><span><i class="relation-key herb"></i>本草</span><span><i class="relation-key formula"></i>方剂</span><span><i class="relation-key anchor"></i>典籍 / 回响</span><span><i class="relation-key source"></i>来源</span><span class="relation-legend-note">深色线是实体关系，灰色线是来源支持；线条粗细不表示疗效或优先级。</span></div>`;
  const accessList = graphRelations.map((relation) => {
    const from = positions.get(relation.from)?.node?.title || relation.from;
    const to = positions.get(relation.to)?.node?.title || relation.to;
    const summary = relation.synthetic ? '公开来源支持这条关系' : `${relation.label} · ${relation.evidenceStatus || '未标注状态'}`;
    return `<button class="relation-access-item ${relation.synthetic ? 'is-support' : ''}" data-relation-id="${esc(relation.id)}" aria-label="${esc(`${relation.synthetic ? '来源支持' : '实体关系'}：${from} → ${to}：${summary}`)}"><span class="relation-access-type">${relation.synthetic ? '来源支持' : '实体关系'}</span><b>${esc(from)} <i>→</i> ${esc(to)}</b><small>${esc(summary)}</small></button>`;
  }).join('');
  const empty = '<div class="relation-empty"><strong>这味本草还没有可绘制的关系</strong><span>可以先从资料库补充来源，或换一味本草继续探索。</span></div>';
  return `<section class="relation-explorer" data-relation-explorer><div class="relation-explorer-head"><div><span class="panel-label">EVIDENCE CONSTELLATION</span><h2>关系星图</h2><p>从本草出发，沿着方剂、典籍与来源追踪它如何被记录。</p></div><div class="relation-count"><b>${visibleRelations.length}</b><span>条关系</span></div></div>${nodes.length ? `<div class="relation-scene" style="--relation-width:${width}px"><svg class="relation-svg" viewBox="0 0 ${width} ${height}" role="group" aria-label="本草证据关系图" preserveAspectRatio="xMinYMin meet"><defs><linearGradient id="relation-flow" x1="0" x2="1"><stop offset="0" stop-color="#b54a3a"></stop><stop offset="1" stop-color="#315f59"></stop></linearGradient></defs><text class="relation-column-label" x="54" y="32">本草</text><text class="relation-column-label" x="${width * 0.31}" y="32">方剂</text><text class="relation-column-label" x="${width * 0.58}" y="32">典籍 / 回响</text><text class="relation-column-label" x="${width * 0.81}" y="32">公开来源</text>${edges}${nodes.map((node) => nodeMarkup(node, positions.get(node.id), options)).join('')}</svg></div><div class="relation-access-list" aria-label="关系列表">${accessList}</div>${legend}` : empty}</section>`;
}

export function relationExplorerModel(dataset, options = {}) {
  return relationGraphModel(dataset, options);
}

