import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(`src/data/curated/${file}`, root), 'utf8'));

test('curated dataset is fresh and internally connected', async () => {
  const [sources, herbs, formulas, anchors, relations, specimens, comparisons] = await Promise.all(['sources.json', 'herbs.json', 'formulas.json', 'cultural-anchors.json', 'relations.json', 'specimens.json', 'comparisons.json'].map(readJson));
  assert.equal(herbs.herbs.length, 16);
  assert.equal(formulas.formulas.length, 3);
  assert.equal(anchors.anchors.length, 3);
  assert.equal(relations.relations.length, 20);
  assert.equal(specimens.specimens.length, 6);
  assert.equal(comparisons.comparisons.length, 4);
  const sourceIds = new Set(sources.sources.map((source) => source.id));
  for (const entity of [...herbs.herbs, ...formulas.formulas, ...anchors.anchors, ...specimens.specimens, ...comparisons.comparisons]) {
    assert.ok(entity.sourceIds.length > 0, `${entity.id || entity.herbId} has no source`);
    for (const sourceId of entity.sourceIds) assert.ok(sourceIds.has(sourceId), `${entity.id || entity.herbId} references ${sourceId}`);
  }
  for (const relation of relations.relations) for (const sourceId of relation.sourceIds) assert.ok(sourceIds.has(sourceId), `${relation.id} references ${sourceId}`);
});

test('new entry has no legacy runtime dependency', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const js = await readFile(new URL('src/main.js', root), 'utf8');
  assert.match(html, /src\/main\.js/);
  assert.doesNotMatch(html, /assets\/js|sw\.js|Three\.js|ECharts/i);
  assert.match(js, /3D SPECIMEN LAB/);
  assert.match(js, /LOOK-ALIKE CHECK/);
  assert.match(js, /data-specimen-stage/);
  assert.match(js, /data-compare-select/);
  assert.doesNotMatch(js, /cosmos-engine|apothecary|runtime\.js|expanded\.generated/i);
});
