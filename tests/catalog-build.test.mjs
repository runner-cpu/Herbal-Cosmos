import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildAuthority } from '../assets/js/lib/catalog-rules.mjs';
import { buildCatalog, buildFromSources } from '../scripts/build-herb-catalog.mjs';

const authority = buildAuthority({
  canonicalNames: ['皂角刺', '川芎'],
  aliases: { '皂角刺异': '皂角刺' },
  variants: {}
});

test('构建与输入顺序无关并聚合 aliases', () => {
  const result = buildCatalog({
    candidates: [
      { raw: '皂角刺', sourceRefs: ['cp2020'] },
      { raw: '皂角刺异', sourceRefs: ['legacy'] },
      { raw: '川芎', sourceRefs: ['cp2020'] },
      { raw: '出现面色苍白', sourceRefs: ['legacy'] }
    ],
    authority
  });
  assert.equal(result.approved.length, 2);
  assert.deepEqual(result.approved[0].aliases, []);
  assert.deepEqual(result.approved.find(item => item.name === '皂角刺').sourceRefs, ['cp2020', 'legacy']);
  assert.deepEqual(result.approved.find(item => item.name === '皂角刺').aliases, ['皂角刺异']);
  assert.equal(result.review[0].name, '出现面色苍白');
  assert.ok(result.approved.every(item => item.status === 'approved'));
  assert.ok(result.review.every(item => item.status === 'review'));
  assert.ok(result.review.every(item => !item.sourceLocation || !item.sourceLocation.startsWith('data/herb-catalog.js:')));
  assert.match(result.approved[0].id, /^herb-[a-f0-9]{12}$/);
});

test('相同输入的构建结果字节级稳定', () => {
  const a = buildCatalog({ candidates: ['川芎', '皂角刺'], authority });
  const b = buildCatalog({ candidates: ['皂角刺', '川芎'], authority });
  assert.deepEqual(a, b);
});

test('构建器按明确分隔符逐段匹配，不把复合候选整条丢进 review', () => {
  const segmentedAuthority = buildAuthority({
    canonicalNames: ['泽泻', '沙参'],
    aliases: {},
    variants: {}
  });
  const result = buildCatalog({
    candidates: [{ raw: '泽泻、沙参', sourceRefs: ['table-row-1'] }],
    authority: segmentedAuthority
  });
  assert.deepEqual(result.approved.map(item => item.name), ['沙参', '泽泻']);
  assert.deepEqual(result.approved.map(item => item.sourceRefs), [['table-row-1'], ['table-row-1']]);
  assert.equal(result.review.length, 0);
});

test('缩小 approved 后清理 stale chunks 且产物哈希稳定', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-build-'));
  try {
    fs.mkdirSync(path.join(temp, 'data'), { recursive: true });
    fs.cpSync('data/sources', path.join(temp, 'data/sources'), { recursive: true });
    const pharmaFile = path.join(temp, 'data/sources/pharmacopoeia-2020-materials.json');
    const pharma = JSON.parse(fs.readFileSync(pharmaFile, 'utf8'));
    const names = Array.from({ length: 121 }, (_, i) => '测试' + String(i).padStart(3, '0'));
    pharma.canonicalNames = names;
    pharma.entries = names.map(name => ({ canonicalName: name, sourceRefs: ['test'] }));
    fs.writeFileSync(pharmaFile, JSON.stringify(pharma));
    fs.writeFileSync(path.join(temp, 'data/sources/raw-candidates.json'), JSON.stringify({ candidates: [] }));
    buildFromSources(temp);
    assert.equal(fs.existsSync(path.join(temp, 'data/catalog/chunk-c01.js')), true);
    pharma.canonicalNames = names.slice(0, 2);
    pharma.entries = pharma.entries.slice(0, 2);
    fs.writeFileSync(pharmaFile, JSON.stringify(pharma));
    buildFromSources(temp);
    assert.equal(fs.existsSync(path.join(temp, 'data/catalog/chunk-c01.js')), false);
    const file = path.join(temp, 'data/catalog/chunk-c00.js');
    const firstHash = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    buildFromSources(temp);
    const secondHash = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    assert.equal(firstHash, secondHash);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
