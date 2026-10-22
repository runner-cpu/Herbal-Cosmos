import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const text = (path) => readFile(new URL(path, root), 'utf8');

test('redesign keeps the 3D/GIS architecture and removes stale claims', async () => {
  const [html, main, planet, engine, apothecaryEngine, apothecaryBundle, atlas, experience, build, serve] = await Promise.all([
    text('index.html'),
    text('src/main.js'),
    text('src/planet.js'),
    text('src/planet-engine.js'),
    text('src/apothecary-engine.js'),
    text('vendor/apothecary-engine.js'),
    text('src/atlas.js'),
    text('src/experience.css'),
    text('scripts/build.mjs'),
    text('scripts/serve.mjs'),
  ]);
  assert.match(html, /experience\.css\?v=planet-layout-v5-20261022-1/);
  assert.match(html, /vendor\/ui-runtime\.js\?v=planet-layout-v5-20261022-1/);
  assert.doesNotMatch(html, /`n/);
  assert.match(main, /loadPlanetModule/);
  assert.match(main, /loadAtlasModule/);
  assert.match(main, /mountPlanetExperience/);
  assert.match(main, /mountApothecaryExperience/);
  assert.match(main, /syncCabinetSelection/);
  assert.match(main, /hallEngine.update/);
  assert.match(main, /viewGeneration/);
  assert.match(main, /atlasGeneration/);
  assert.match(main, /libraryLimit = 24/);
  assert.match(main, /data-library-more/);
  assert.match(main, /百子药堂/);
  assert.doesNotMatch(main, /百子柜|百子药柜/);
  assert.match(apothecaryEngine, /百子药堂/);
  assert.doesNotMatch(main, /redesign-v1-20261020-3|没有打包器|不加载任何图表或 3D 库/);
  assert.match(planet, /data-planet-engine/);
  assert.match(planet, /data-planet-atlas/);
  assert.match(engine, /three\/webgpu|WebGPURenderer/);
  assert.match(engine, /@takram\/three-atmosphere\/webgpu/);
  assert.match(engine, /createWebGLRenderer/);
  assert.match(apothecaryEngine, /THREE.WebGLRenderer/);
  assert.match(apothecaryEngine, /InstancedMesh/);
  assert.match(apothecaryEngine, /Raycaster/);
  assert.match(apothecaryEngine, /closeDrawer/);
  assert.match(main, /data-apothecary-close/);
  assert.match(apothecaryEngine, /prefers-reduced-motion/);
  assert.match(apothecaryEngine, /dispose()/);
  assert.match(apothecaryBundle, /InstancedMesh/);
  assert.match(atlas, /OPENFREEMAP|openfreemap/);
  assert.match(atlas, /data-atlas-focus-label/);
  assert.match(atlas, /herb-selected-cells/);
  assert.match(atlas, /Natural Earth/);
  assert.match(atlas, /setupFallback/);
  assert.match(experience, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(experience, /\.entry-visual-atlas/);
  assert.match(experience, /content-visibility: auto/);
  assert.match(experience, /@media \(max-width: 390px\)/);
  assert.match(build, /esbuild/);
  assert.match(build, /maplibre-gl\.js/);
  assert.match(serve, /gzipSync/);
  assert.match(serve, /max-age=31536000/);
});

test('GBIF snapshot is open-licensed, aggregated, and complete', async () => {
  const snapshot = JSON.parse(await text('src/data/generated/gbif-snapshot.json'));
  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.summary.totalHerbs, 120);
  assert.equal(snapshot.summary.availableHerbs + snapshot.summary.noRecordHerbs, 120);
  assert.equal(snapshot.herbs.length, 120);
  assert.equal(new Set(snapshot.herbs.map((herb) => herb.id)).size, 120);

  let sampled = 0;
  let cells = 0;
  for (const herb of snapshot.herbs) {
    assert.ok(['available', 'no-records'].includes(herb.status), herb.id);
    assert.ok([0.5, 1].includes(herb.precisionDegrees), herb.id);
    assert.ok(Array.isArray(herb.cells), herb.id);
    assert.ok(Array.isArray(herb.licenses), herb.id);
    for (const license of herb.licenses) assert.ok(['CC0_1_0', 'CC_BY_4_0'].includes(license), `${herb.id}: ${license}`);
    if (herb.status === 'no-records') assert.equal(herb.cells.length, 0, herb.id);
    for (const cell of herb.cells) {
      assert.ok(Number.isFinite(cell.lat) && Number.isFinite(cell.lon), herb.id);
      assert.ok(Number.isInteger(cell.count) && cell.count > 0, herb.id);
      assert.ok(Array.isArray(cell.licenses) && cell.licenses.length > 0, herb.id);
      for (const license of cell.licenses) assert.ok(['CC0_1_0', 'CC_BY_4_0'].includes(license), `${herb.id}: ${license}`);
      assert.equal(cell.decimalLatitude, undefined, herb.id);
      assert.equal(cell.decimalLongitude, undefined, herb.id);
      assert.equal(cell.south, undefined, herb.id);
      assert.equal(cell.west, undefined, herb.id);
    }
    sampled += herb.sampledRecordCount;
    cells += herb.cells.length;
    assert.equal(herb.gridCellCount, herb.cells.length, herb.id);
  }
  assert.equal(snapshot.summary.sampledRecords, sampled);
  assert.equal(snapshot.summary.gridCells, cells);
  assert.deepEqual([...snapshot.query.licenses].sort(), ['CC0_1_0', 'CC_BY_4_0']);
  assert.equal(snapshot.query.hasCoordinate, true);
  assert.equal(snapshot.query.hasGeospatialIssue, false);
  assert.equal(snapshot.query.country, 'CN');
  assert.ok(snapshot.disclaimers.some((line) => line.includes('不代表药用分布')));
  assert.ok(snapshot.disclaimers.some((line) => line.includes('采集')));
});

test('required static runtime assets exist for planet, atlas, and build', async () => {
  await Promise.all([
    access(new URL('src/experience.css', root)),
    access(new URL('src/atlas.js', root)),
    access(new URL('src/planet-engine.js', root)),
    access(new URL('src/ui-runtime.js', root)),
    access(new URL('src/apothecary-engine.js', root)),
    access(new URL('vendor/apothecary-engine.js', root)),
    access(new URL('src/assets/planet/earth_atmos_2048.jpg', root)),
    access(new URL('src/assets/planet/earth_clouds_1024.png', root)),
    access(new URL('src/assets/geo/ne_110m_admin_0_countries.geojson', root)),
  ]);
  const readme = await text('README.md');
  assert.match(readme, /WebGPU/);
  assert.match(readme, /MapLibre/);
  assert.match(readme, /GBIF/);
  assert.match(readme, /古风 3D 药堂/);
  assert.match(readme, /百子药堂/);
  assert.doesNotMatch(readme, /百子柜|百子药柜/);
  assert.match(readme, /390×844|3D|地图/);
});