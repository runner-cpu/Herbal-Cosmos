import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { relationExplorerModel } from '../src/relations.js';

const root = new URL('..', import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(`src/data/curated/${file}`, root), 'utf8'));

test('curated dataset is fresh and internally connected', async () => {
  const [sources, herbs, formulas, anchors, relations, specimens, comparisons, images] = await Promise.all(['sources.json', 'herbs.json', 'formulas.json', 'cultural-anchors.json', 'relations.json', 'specimens.json', 'comparisons.json', 'herb-images.json'].map(readJson));
  assert.equal(herbs.herbs.length, 120);
  assert.equal(herbs.catalogStats.featured, 16);
  assert.equal(herbs.catalogStats.overview, 104);
  assert.equal(formulas.formulas.length, 3);
  assert.equal(anchors.anchors.length, 3);
  assert.equal(relations.relations.length, 20);
  assert.equal(specimens.specimens.length, 6);
  assert.equal(comparisons.comparisons.length, 4);
  assert.equal(images.summary.total, 120);
  assert.equal(images.summary.ready, 120);
  assert.equal(images.images.filter((entry) => entry.status === 'ready').length, herbs.herbs.length);
  await Promise.all(images.images.map((entry) => access(new URL(entry.path.replace('./', ''), root))));
  const comparisonSides = comparisons.comparisons.flatMap((comparison) => [comparison.left, comparison.right]);
  const comparisonPhotos = comparisonSides.filter((side) => side.image?.status === 'ready');
  assert.equal(comparisonPhotos.length, 4, 'all external look-alike sides should have a real photo');
  await Promise.all(comparisonPhotos.map((side) => access(new URL(side.image.path.replace('./', ''), root))));
  const sourceIds = new Set(sources.sources.map((source) => source.id));
  const habitatIds = new Set(herbs.herbs.map((herb) => herb.habitat));
  assert.deepEqual([...habitatIds].sort(), ['caodian', 'guoshi', 'huaye', 'junmu', 'shanlin', 'shuize']);
  for (const herb of herbs.herbs) {
    assert.ok(herb.habitatLabel && herb.tags.length > 0 && herb.morphology, `${herb.id} missing catalog facets`);
    assert.ok(['deep', 'overview'].includes(herb.depthLevel), `${herb.id} has invalid depth`);
    assert.ok(herb.boundary, `${herb.id} missing reading boundary`);
    const refs = new Set((herb.sourceRefs || []).map((ref) => ref.sourceId));
    for (const sourceId of herb.sourceIds) assert.ok(refs.has(sourceId), `${herb.id} missing locator for ${sourceId}`);
  }
  for (const entity of [...herbs.herbs, ...formulas.formulas, ...anchors.anchors, ...specimens.specimens, ...comparisons.comparisons]) {
    assert.ok(entity.sourceIds.length > 0, `${entity.id || entity.herbId} has no source`);
    for (const sourceId of entity.sourceIds) assert.ok(sourceIds.has(sourceId), `${entity.id || entity.herbId} references ${sourceId}`);
  }
  for (const relation of relations.relations) for (const sourceId of relation.sourceIds) assert.ok(sourceIds.has(sourceId), `${relation.id} references ${sourceId}`);
});

test('new entry has no legacy runtime dependency', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const js = await readFile(new URL('src/main.js', root), 'utf8');
  const layout = await readFile(new URL('src/ui-layout.js', root), 'utf8');
  const planet = await readFile(new URL('src/planet.js', root), 'utf8');
  const css = await readFile(new URL('src/styles.css', root), 'utf8');
  assert.match(html, /src\/main\.js/);
  assert.doesNotMatch(html, /assets\/js|sw\.js|Three\.js|ECharts/i);
  assert.match(js, /3D SPECIMEN LAB/);
  assert.match(js, /LOOK-ALIKE CHECK/);
  assert.match(js, /renderCosmosHome/);
  assert.match(js, /particlePlanetMarkup/);
  assert.match(js, /state.view === 'planet'/);
  assert.match(layout, /本草宇宙 · 百子万象/);
  assert.match(layout, /cosmos-route-map/);
  assert.match(layout, /cabinet-console/);
  assert.match(layout, /data-cabinet-habitat/);
  assert.match(layout, /data-cabinet-morphology/);
  assert.match(layout, /data-compare-herb/);
  assert.match(planet, /data-planet-canvas/);
  assert.match(planet, /pointerdown/);
  assert.match(planet, /wheel/);
  assert.match(js, /data-specimen-stage/);
  assert.match(js, /data-compare-select/);
  assert.match(js, /imageLightbox/);
  assert.match(js, /data-image-quiz-open/);
  assert.match(js, /data-image-quiz-answer/);
  assert.match(js, /compare-image/);
  assert.match(js, /relationExplorer/);
  assert.match(js, /data-relation-node/);
  assert.match(css, /\.relation-scene\{overflow-x:auto/);
  assert.match(css, /\.relation-access-list/);
  assert.match(css, /\.cosmos-landing/);
  assert.match(css, /\.cabinet-wall/);
  assert.match(css, /\.planet-stage/);
  assert.match(css, /\.image-lightbox/);
  assert.match(css, /\.image-quiz/);
  assert.doesNotMatch(js, /cosmos-engine|apothecary|runtime\.js|expanded\.generated/i);
});

test('relation explorer keeps public sources visible in the evidence lane', async () => {
  const [sources, herbs, formulas, anchors, relations] = await Promise.all(['sources.json', 'herbs.json', 'formulas.json', 'cultural-anchors.json', 'relations.json'].map(readJson));
  const model = relationExplorerModel({ herbs: herbs.herbs, formulas: formulas.formulas, anchors: anchors.anchors, sources: sources.sources, relations: relations.relations }, { focusId: 'herb-artemisia-annua', maxRelations: 14 });
  assert.ok(model.visibleRelations.length > 0);
  assert.ok(model.nodes.some((node) => node.type === 'source'), 'focused graph should expose citation nodes');
  assert.ok(model.graphRelations.some((relation) => relation.synthetic && relation.to === 'S005'), 'citation edge should point to the Nobel source');
});
