import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const file = (path) => new URL(path, root);
const filePath = (path) => fileURLToPath(file(path));

async function requireFile(path, minimumBytes = 1) {
  const info = await access(file(path));
  const bytes = await readFile(file(path));
  if (bytes.byteLength < minimumBytes) throw new Error(`${path} is unexpectedly small (${bytes.byteLength} bytes)`);
  return bytes;
}

const appFiles = [
  'index.html',
  'src/main.js',
  'src/atlas.js',
  'src/planet-engine.js',
  'src/apothecary-engine.js',
  'src/ui-runtime.js',
  'src/styles.css',
  'src/experience.css',
  'src/data/curated/schema.md',
];
for (const path of appFiles) await requireFile(path, 16);

const curatedDir = file('src/data/curated/');
const { readdir } = await import('node:fs/promises');
const curatedFiles = (await readdir(curatedDir)).filter((name) => name.endsWith('.json'));
for (const name of curatedFiles) JSON.parse(await readFile(new URL(name, curatedDir), 'utf8'));

const snapshot = JSON.parse(await requireFile('src/data/generated/gbif-snapshot.json', 1000));
if (snapshot.schemaVersion !== 1 || !Array.isArray(snapshot.herbs) || snapshot.herbs.length !== 120) {
  throw new Error('GBIF snapshot schema or herb count is invalid');
}
if (snapshot.summary?.totalHerbs !== 120) throw new Error('GBIF snapshot summary is incomplete');
for (const herb of snapshot.herbs) {
  if (!['available', 'no-records'].includes(herb.status)) throw new Error(`Invalid GIS status for ${herb.id}`);
  if (herb.precisionDegrees !== 0.5 && herb.precisionDegrees !== 1) throw new Error(`Invalid GIS precision for ${herb.id}`);
  for (const cell of herb.cells || []) {
    if (!Number.isFinite(cell.lat) || !Number.isFinite(cell.lon) || !Number.isInteger(cell.count) || cell.count < 1) {
      throw new Error(`Invalid aggregated GIS cell for ${herb.id}`);
    }
  }
}

const geo = JSON.parse(await requireFile('src/assets/geo/ne_110m_admin_0_countries.geojson', 100_000));
if (geo.type !== 'FeatureCollection' || !Array.isArray(geo.features) || geo.features.length < 100) {
  throw new Error('Natural Earth fallback is not a valid country collection');
}

const planetTextures = [
  'earth_atmos_2048.jpg',
  'earth_clouds_1024.png',
  'earth_lights_2048.png',
  'earth_normal_2048.jpg',
  'earth_specular_2048.jpg',
];
for (const name of planetTextures) await requireFile(`src/assets/planet/${name}`, 50_000);

await mkdir(file('vendor/maplibre/'), { recursive: true });
await build({
  entryPoints: [filePath('src/planet-engine.js')],
  outfile: filePath('vendor/planet-engine.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  legalComments: 'none',
  sourcemap: false,
  logLevel: 'warning',
});
await build({
  entryPoints: [filePath('src/apothecary-engine.js')],
  outfile: filePath('vendor/apothecary-engine.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  legalComments: 'none',
  sourcemap: false,
  logLevel: 'warning',
});
await build({
  entryPoints: [filePath('src/ui-runtime.js')],
  outfile: filePath('vendor/ui-runtime.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
  sourcemap: false,
  logLevel: 'warning',
});
await build({
  entryPoints: [filePath('src/herb-picker.js')],
  outfile: filePath('vendor/herb-picker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  legalComments: 'eof',
  logLevel: 'warning',
});
await copyFile(file('node_modules/tom-select/LICENSE'), file('vendor/tom-select-LICENSE.txt'));
for (const [name, source] of [
  ['three', 'node_modules/three/LICENSE'],
  ['maplibre', 'node_modules/maplibre-gl/LICENSE.txt'],
  ['auto-animate', 'node_modules/@formkit/auto-animate/LICENSE'],
]) {
  await copyFile(file(source), file(`vendor/${name}-LICENSE.txt`));
}
await copyFile(file('node_modules/maplibre-gl/dist/maplibre-gl.js'), file('vendor/maplibre/maplibre-gl.js'));
await copyFile(file('node_modules/maplibre-gl/dist/maplibre-gl.css'), file('vendor/maplibre/maplibre-gl.css'));

const engineBytes = await readFile(file('vendor/planet-engine.js'));
if (engineBytes.byteLength < 400_000) throw new Error(`Planet engine bundle is unexpectedly small (${engineBytes.byteLength} bytes)`);
const apothecaryBytes = await readFile(file('vendor/apothecary-engine.js'));
if (apothecaryBytes.byteLength < 400_000) throw new Error(`Apothecary engine bundle is unexpectedly small (${apothecaryBytes.byteLength} bytes)`);
const runtimeBytes = await readFile(file('vendor/ui-runtime.js'));
if (runtimeBytes.byteLength < 2_000) throw new Error('UI runtime bundle is unexpectedly small');

const summary = {
  curatedJson: curatedFiles.length,
  gisHerbs: snapshot.summary.availableHerbs,
  gisNoRecord: snapshot.summary.noRecordHerbs,
  gisCells: snapshot.summary.gridCells,
  planetTextures: planetTextures.length,
  engineKB: Math.round(engineBytes.byteLength / 1024),
  apothecaryKB: Math.round(apothecaryBytes.byteLength / 1024),
  runtimeKB: Math.round(runtimeBytes.byteLength / 1024),
};
console.log(`Build passed: ${summary.curatedJson} curated JSON, ${summary.planetTextures} planet textures, ${summary.gisHerbs}/${snapshot.summary.totalHerbs} herbs with open GIS cells (${summary.gisCells} cells), apothecary ${summary.apothecaryKB} KB, planet engine ${summary.engineKB} KB, UI runtime ${summary.runtimeKB} KB.`);
