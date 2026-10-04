import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const readJson = path => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const formulas = readJson('data/sources/formulas-expanded.json');
const v5Formulas = readJson('data/sources/formulas-v5.json');
const syndromes = readJson('data/sources/syndromes-expanded.json');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('assets/js/data/featured.js', root), 'utf8'), context);
const base = context.window;
const sourcePrefix = 'https://github.com/hongge168/huatuo-tcm-dictionary/blob/4bf9786f5191dd17f8ee0f2b4183d9d1f7bbb679/server/data/knowledge/';
const unknownDose = '所引资料未载剂量';

test('V4 source additions reach exactly 50 formulas and the syndrome index grows with V5', () => {
  assert.equal(formulas.length, 29);
  assert.equal(syndromes.length, 40);
  assert.equal(base.FORMULAS.length + formulas.length, 50);
  assert.equal(base.ZHENGS.length + syndromes.length, 58);
  for (const group of [[...base.FORMULAS, ...formulas], [...base.ZHENGS, ...syndromes]]) {
    assert.equal(new Set(group.map(row => row.id)).size, group.length);
    assert.equal(new Set(group.map(row => row.name)).size, group.length);
  }
});
test('every added formula has a fixed source row and complete ingredient fields', () => {
  for (const formula of formulas) {
    for (const field of ['id', 'name', 'from', 'zheng', 'eff', 'sourceNote']) {
      assert.equal(typeof formula[field], 'string', `${formula.id}.${field}`);
      assert.ok(formula[field].trim().length > 0);
    }
    assert.match(formula.sourceNote, /gf-(?:sh|jk|wb)-\d+/);
    assert.match(formula.sourceNote, /CC BY-NC-SA 4\.0/);
    assert.match(formula.sourceRefs[0], /#L\d+$/);
    assert.ok(formula.sourceRefs.every(url => url.startsWith(sourcePrefix)));
    assert.ok(formula.herbs.length > 0);
    assert.equal(new Set(formula.herbs.map(herb => herb.name)).size, formula.herbs.length);
    for (const herb of formula.herbs) {
      assert.equal(typeof herb.name, 'string');
      assert.ok(herb.name.trim());
      assert.equal(typeof herb.dose, 'string');
      assert.ok(herb.dose.trim());
      assert.equal(herb.role, '未标注');
    }
  }
});

test('historical units are retained and missing doses remain explicit', () => {
  assert.equal(formulas.filter(row => row.herbs.some(h => h.dose !== unknownDose)).length, 18);
  for (const formula of formulas) {
    for (const herb of formula.herbs) {
      assert.ok(herb.dose === unknownDose || /[两斤升合铢枚个尺]/.test(herb.dose), `${formula.name}: ${herb.name}`);
      assert.doesNotMatch(herb.dose, /(?:\d\s*g\b|克)/i);
    }
  }
  const byId = new Map(formulas.map(row => [row.id, row]));
  assert.equal(byId.get('wuling-san').herbs.find(h => h.name === '泽泻').dose, '一两六铢');
  assert.equal(byId.get('maziren-wan').herbs.find(h => h.name === '厚朴').dose, '一尺，炙，去皮');
  assert.ok(byId.get('shenqi-wan').herbs.some(h => h.name === '干地黄'));
  assert.ok(byId.get('huanglian-ejiao-tang').herbs.some(h => h.name === '芍药'));
  assert.ok(byId.get('huanglian-ejiao-tang').herbs.some(h => h.name === '鸡子黄'));
  assert.equal(byId.get('zhigancao-tang').herbs.find(h => h.name === '清酒').dose, unknownDose);
});

test('all added syndrome references resolve to sourced formulas', () => {
  const ids = new Set([...base.FORMULAS, ...formulas, ...v5Formulas].map(row => row.id));
  for (const syndrome of syndromes) {
    assert.ok(syndrome.name && syndrome.desc && syndrome.id);
    assert.ok(syndrome.formulas.length > 0, syndrome.id + ': empty syndrome index');
    assert.equal(new Set(syndrome.formulas).size, syndrome.formulas.length);
    assert.ok(syndrome.formulas.every(id => ids.has(id)), syndrome.id);
    if (syndrome.sourceRefs && syndrome.sourceRefs.length) {
      // V4 (huatuo) syndromes keep their third-party row URLs.
      assert.ok(syndrome.sourceRefs.every(url => url.startsWith(sourcePrefix)));
    } else {
      // V5-classical syndromes carry no third-party row URLs; their formula
      // links live in formulas-v5.json and the generated runtime index.
      assert.ok(syndrome.formulas.every(id => v5Formulas.some(row => row.id === id)), syndrome.id + ': V5 syndrome must cite V5 formulas');
    }
  }
});
