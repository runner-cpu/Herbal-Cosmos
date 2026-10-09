import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const sandbox = { window: {}, URLSearchParams };
const dataPath = new URL('../assets/js/data/exhibition-cases.js', import.meta.url);
if (fs.existsSync(dataPath)) vm.runInNewContext(fs.readFileSync(dataPath, 'utf8'), sandbox);
const exhibit = sandbox.window.HerbalExhibitionCases || {};
const plain = value => JSON.parse(JSON.stringify(value));
const fixture = [
  { id: 'wuweizi', name: '五味子', wei: '酸' }, { id: 'huanglian', name: '黄连', wei: '苦' },
  { id: 'gancao', name: '甘草', wei: '甘' }, { id: 'guizhi', name: '桂枝', wei: '辛' },
  { id: 'mangxiao', name: '芒硝', wei: '咸' }, { id: 'juemingzi', name: '决明子', wei: '甘苦咸' },
  { id: 'tufuling', name: '土茯苓', wei: '甘淡' }, { id: 'baiji', name: '白及', wei: '苦甘涩' }
];

test('invalid chapters and mismatched case IDs restore a usable default', () => {
  assert.equal(typeof exhibit.resolveState, 'function', 'pure case/state layer is required');
  assert.deepEqual(plain(exhibit.resolveState({ chapter: 'bad', case: '<script>', selected: 'bad' })),
    { chapter: 'recognize', caseId: 'five-tastes', selected: 'taste:甘', roles: false });
  assert.equal(exhibit.resolveState({ chapter: 'compose', case: 'lum' }).caseId, 'sijunzitang');
  assert.equal(exhibit.resolveState({ chapter: 'inherit' }).caseId, 'lum');
  assert.equal(exhibit.resolveState({ chapter: 'compose', case: 'guizhitang', selected: 'baishao', roles: '1' }).roles, true);
});

test('recognition graph has unique herbs, composite edges and separate supplementary/missing nodes', () => {
  assert.equal(typeof exhibit.recognitionGraph, 'function');
  const graph = exhibit.recognitionGraph(fixture);
  assert.equal(graph.nodes.length, 16);
  assert.equal(graph.edges.length, 13);
  assert.equal(graph.nodes.filter(n => n.kind === 'herb').length, 8);
  assert.equal(new Set(graph.nodes.map(n => n.id)).size, 16);
  assert.deepEqual(plain(graph.edges.filter(e => e.target === 'juemingzi').map(e => e.source)), ['taste:苦', 'taste:甘', 'taste:咸']);
  assert.equal(graph.nodes.find(n => n.id === 'taste:未录入').kind, 'missing');
  const missing = exhibit.recognitionGraph([{ id: 'gancao', name: '甘草', wei: '未录入' }]);
  assert.equal(missing.edges[0].source, 'taste:未录入');
  assert.equal(missing.nodes.filter(n => n.kind === 'herb').length, 1);
});

test('formula graph exposes evidenced roles only in their individual case', () => {
  assert.equal(typeof exhibit.formulaGraph, 'function');
  for (const [id, nodes, edges] of [['sijunzitang', 5, 4], ['mahuangtang', 5, 4], ['guizhitang', 6, 5]]) {
    const graph = exhibit.formulaGraph(id);
    assert.equal(graph.nodes.length, nodes);
    assert.equal(graph.edges.length, edges);
    assert.ok(graph.edges.every(e => e.role && e.assertionId));
  }
  assert.equal(exhibit.formulaGraph('unknown').nodes.length, 0);
  const unsupported = exhibit.formulaGraph({ id: 'example', name: '资料受限', members: [{ id: 'gancao', label: '甘草', role: '君' }] });
  assert.equal(unsupported.edges[0].role, null, 'an uncited archive role must not become an exhibition assertion');
  assert.equal(exhibit.formulaGraph('sijunzitang').nodes.find(n => n.id === 'gancao').label, '炙甘草');
});

test('heritage edges distinguish practices, participants and transmission without herb links', () => {
  assert.equal(typeof exhibit.heritageGraph, 'function');
  const graph = exhibit.heritageGraph('lum');
  assert.equal(graph.nodes.length, 12);
  assert.equal(graph.edges.length, 11);
  assert.ok(graph.edges.every(e => ['practice', 'participant', 'transmission'].includes(e.type)));
  assert.equal(graph.nodes.filter(n => n.kind === 'herb').length, 0);
  const processing = exhibit.heritageGraph('processing');
  assert.equal(processing.nodes.length, 7);
  assert.equal(processing.edges.length, 6);
  assert.ok(processing.edges.every(e => e.type !== 'sequence' && e.type !== 'mentorship'));
});

test('every asserted edge resolves to a complete, case-scoped source record', () => {
  assert.ok(Array.isArray(exhibit.assertions));
  for (const graph of [exhibit.recognitionGraph(fixture), ...['sijunzitang', 'mahuangtang', 'guizhitang'].map(exhibit.formulaGraph), ...['lum', 'processing'].map(exhibit.heritageGraph)]) {
    for (const edge of graph.edges) {
      const claim = exhibit.assertions.find(a => a.id === edge.assertionId);
      assert.ok(claim, edge.assertionId);
      assert.equal(claim.caseId, graph.caseId);
      assert.equal(claim.kind, 'project-summary');
      assert.equal(claim.status, 'approved');
      for (const value of [claim.statement, claim.system, claim.evidenceNote, ...Object.values(claim.source)]) assert.ok(value);
      assert.ok(claim.entityIds.length);
    }
  }
});

test('URL state restores selection and drops unsafe or unrelated parameters', () => {
  assert.equal(typeof exhibit.canonicalHash, 'function');
  const hash = exhibit.canonicalHash({ chapter: 'compose', case: 'guizhitang', selected: 'baishao', roles: '1' });
  assert.equal(hash, '#/exhibit?chapter=compose&case=guizhitang&selected=baishao&roles=1');
  assert.equal(exhibit.resolveState({ chapter: 'compose', selected: '<script>' }).selected, 'sijunzitang');
});

test('export escapes XML and wraps long text into an editable reading document', () => {
  assert.equal(typeof exhibit.noteSvg, 'function');
  const svg = exhibit.noteSvg({ object: '<草 & "方">', takeaway: '一'.repeat(110) + '<script>', source: 'https://example.test?a=1&b=2', url: '#/exhibit?chapter=compose&case=guizhitang' });
  assert.ok(svg.includes('&lt;草 &amp; &quot;方&quot;&gt;'));
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(!svg.includes('<script>'));
  assert.ok((svg.match(/<tspan/g) || []).length >= 6);
});
