import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('herb picker uses only the Tom Select core, bundled locally with its license', async () => {
  const [pkg, source, html, build] = await Promise.all(['package.json', 'src/herb-picker.js', 'index.html', 'scripts/build.mjs'].map(read));
  assert.equal(JSON.parse(pkg).dependencies['tom-select'], '2.6.2');
  assert.match(source, /from 'tom-select\/base'/);
  assert.match(source, /searchField: \['nameZh', 'pinyin', 'scientificName', 'habitatLabel'\]/);
  assert.match(html, /vendor\/herb-picker.css/);
  assert.ok(html.indexOf('vendor/herb-picker.css') < html.indexOf('src/experience.css'));
  assert.match(build, /vendor\/tom-select-LICENSE.txt/);
  await access(new URL('../vendor/herb-picker.js', import.meta.url));
  await access(new URL('../vendor/tom-select-LICENSE.txt', import.meta.url));
});

test('floating herb name is removed; physical labels and focus feedback remain', async () => {
  const [engine, css] = await Promise.all(['src/apothecary-engine.js', 'src/experience.css'].map(read));
  assert.doesNotMatch(engine, /selectedLabel|apothecary-selected-label/);
  assert.doesNotMatch(css, /apothecary-selected-label/);
  assert.match(engine, /makeLabelAtlasTexture\(catalog\)/);
  assert.match(engine, /new THREE.LineSegments/);
});

test('picker lifecycle and motion paths are guarded', async () => {
  const [source, main] = await Promise.all(['src/herb-picker.js', 'src/main.js'].map(read));
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /dropdown\.inert = true/);
  assert.match(source, /if \(motion.matches \|\| disposed\) return/);
  assert.match(source, /picker.destroy\(\)/);
  assert.match(source, /select.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(main, /picker\.tomselect\.setValue\(item\?\.id \|\| '', true\)/);
  assert.match(main, /generation !== viewGeneration \|\| hallEngine !== engine/);
  assert.match(main, /native select retained/);
});
