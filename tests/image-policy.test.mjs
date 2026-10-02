import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadExpanded, validateExpandedData } from '../scripts/validate-expanded-data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/sources/herb-images.json'), 'utf8'));
const acceptedLicense = /^(?:CC BY(?:-SA)? [1-4]\.0|CC0 1\.0|Public domain)$/;

test('每张运行时本草图都精确匹配开放许可清单', () => {
  const herbs = loadExpanded(root).HERBS;
  const displayed = herbs.filter(herb => herb.image);
  assert.ok(displayed.length >= 500);
  for (const herb of displayed) {
    const source = manifest.images[herb.name];
    assert.ok(source, `${herb.name}: runtime image is absent from the open-image manifest`);
    assert.equal(herb.image, source.file, `${herb.name}: file`);
    assert.equal(herb.imageAlt, source.alt, `${herb.name}: alt`);
    assert.equal(herb.imageCredit?.author, source.author, `${herb.name}: author`);
    assert.equal(herb.imageCredit?.license, source.license, `${herb.name}: credit license`);
    assert.equal(herb.imageCredit?.url, source.sourceUrl, `${herb.name}: source URL`);
    assert.equal(herb.imageLicenseUrl, source.licenseUrl, `${herb.name}: license URL`);
    assert.match(source.license, acceptedLicense, `${herb.name}: license`);
  }
});

test('扩展数据校验器拦截未在开放清单中的运行时图片', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'herbal-image-policy-'));
  try {
    for (const dir of ['assets/js/data', 'data/sources', 'reports']) fs.mkdirSync(path.join(temp, dir), { recursive: true });
    const expandedFiles = fs.readdirSync(path.join(root, 'assets/js/data')).filter(file => /^expanded\.(?:bootstrap|chunk-\d+|generated)\.js$/.test(file));
    for (const file of ['food-medicine.generated.js', 'featured.js', ...expandedFiles]) {
      fs.copyFileSync(path.join(root, 'assets/js/data', file), path.join(temp, 'assets/js/data', file));
    }
    fs.copyFileSync(path.join(root, 'data/sources/herb-images.json'), path.join(temp, 'data/sources/herb-images.json'));
    fs.copyFileSync(path.join(root, 'reports/data-coverage.json'), path.join(temp, 'reports/data-coverage.json'));
    fs.symlinkSync(path.join(root, 'images'), path.join(temp, 'images'), process.platform === 'win32' ? 'junction' : 'dir');

    const approved = manifest.images['枸杞子'];
    const chunk = expandedFiles.map(file => path.join(temp, 'assets/js/data', file))
      .find(file => fs.readFileSync(file, 'utf8').includes(approved.file));
    assert.ok(chunk, 'expanded runtime should contain the approved image path');
    const source = fs.readFileSync(chunk, 'utf8');
    fs.writeFileSync(chunk, source.replace(approved.file, 'images/herbs/gouqi.jpg'));

    const result = validateExpandedData({ baseDir: temp });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(item => item.code === 'runtime-image-manifest'), result.issues.map(item => `${item.code}: ${item.message}`).join('\n'));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('homepage herb imagery only references assets in the open-image manifest', () => {
  const approvedFiles = new Set(Object.values(manifest.images).map(item => item.file));
  const css = fs.readFileSync(path.join(root, 'assets/css/site.css'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const references = [...`${css}\n${html}`.matchAll(/(?:https:\/\/[^\s\"']+\/)?(?:\.\.\/\.\.\/)?(images\/herbs\/[^)'\"\s>]+)/g)]
    .map(match => match[1]);

  assert.ok(references.length >= 6, 'expected homepage module and Open Graph herb imagery');
  for (const reference of new Set(references)) {
    assert.ok(reference.startsWith('images/herbs/open/'), `${reference}: legacy or unverified herb image`);
    assert.ok(approvedFiles.has(reference), `${reference}: absent from open-image manifest`);
    const [name, source] = Object.entries(manifest.images).find(([, item]) => item.file === reference);
    assert.ok(html.includes(source.author), `${name}: homepage attribution omits author`);
    assert.ok(html.includes(source.sourceUrl), `${name}: homepage attribution omits source link`);
    assert.ok(html.includes(source.licenseUrl), `${name}: homepage attribution omits license link`);
  }
  assert.match(html, /id="homeImageCredits"/);
  assert.match(html, /IMAGE_SOURCES_V4\.md/);
});
