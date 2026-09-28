import test from 'node:test';
import assert from 'node:assert/strict';
import { extractTaxa } from '../scripts/herb-source-utils.mjs';
test('expands only an unambiguous preceding genus and preserves source spelling', () => {
  assert.deepEqual(extractTaxa({来源:'Dysosma versipellis(Hance)、D.pleiantha 和 D.veithchii'}), ['Dysosma versipellis','Dysosma pleiantha','Dysosma veithchii']);
  assert.deepEqual(extractTaxa({来源:'Dysosma versipellis 和 Dipsacus asperoides、D.pleiantha'}), ['Dysosma versipellis','Dipsacus asperoides']);
  assert.deepEqual(extractTaxa({来源:'D.pleiantha'}), []);
  assert.deepEqual(extractTaxa({来源:'矿物石膏'}), []);
});
