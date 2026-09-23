import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthority } from '../assets/js/lib/catalog-rules.mjs';
import { buildCatalog } from '../scripts/build-herb-catalog.mjs';

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
  assert.match(result.approved[0].id, /^herb-[a-f0-9]{12}$/);
});

test('相同输入的构建结果字节级稳定', () => {
  const a = buildCatalog({ candidates: ['川芎', '皂角刺'], authority });
  const b = buildCatalog({ candidates: ['皂角刺', '川芎'], authority });
  assert.deepEqual(a, b);
});
