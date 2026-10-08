import test from 'node:test';
import assert from 'node:assert/strict';
import { formulaDirectoryPage } from '../assets/js/pages/formula-directory.js';

test('directory pagination neither loses formulas nor keeps invalid pages after search', () => {
  const formulas = Array.from({ length: 25 }, (_, i) => ({ id: String(i), name: '方' + i, from: '典籍', herbs: [['herb']] }));
  const herbs = [{ id: 'herb', name: '甘草' }];
  const ids = [1, 2, 3].flatMap(page => formulaDirectoryPage(formulas, herbs, '', page).items.map(item => item.id));
  assert.deepEqual(ids, formulas.map(formula => formula.id));
  assert.equal(formulaDirectoryPage(formulas, herbs, '甘草').total, 25);
  const result = formulaDirectoryPage(formulas, herbs, '方24', 3);
  assert.equal(result.page, 1);
  assert.equal(result.items[0].id, '24');
  assert.equal(formulaDirectoryPage(formulas, herbs, '不存在').total, 0);
});
