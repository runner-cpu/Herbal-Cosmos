import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const readJson = path => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const v5 = readJson('data/sources/formulas-v5.json');
const v4 = readJson('data/sources/formulas-expanded.json');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('assets/js/data/featured.js', root), 'utf8'), context);
const base = context.window;
const generated = fs.readFileSync(new URL('assets/js/data/expanded.generated.js', root), 'utf8');
const unknownDose = '所引资料未载剂量';

test('V5 classical source adds exactly 50 formulas reaching the 100-formula runtime library', () => {
  assert.equal(v5.length, 50);
  const allIds = [...base.FORMULAS, ...v4, ...v5].map(row => row.id);
  const allNames = [...base.FORMULAS, ...v4, ...v5].map(row => row.name);
  assert.equal(new Set(allIds).size, allIds.length, 'formula ids must be unique across base/V4/V5');
  assert.equal(new Set(allNames).size, allNames.length, 'formula names must be unique across base/V4/V5');
});

test('every V5 formula keeps an honest classical-source note and complete ingredient rows', () => {
  for (const formula of v5) {
    for (const field of ['id', 'name', 'from', 'zheng', 'eff', 'sourceNote']) {
      assert.equal(typeof formula[field], 'string', `${formula.id}.${field}`);
      assert.ok(formula[field].trim().length > 0);
    }
    assert.match(formula.sourceNote, /通行本原文整理/, `${formula.id}: sourceNote must describe the collation method`);
    assert.ok(!/gf-(?:sh|jk|wb)-\d+/.test(formula.sourceNote), `${formula.id}: V5 rows must not borrow V4 third-party row ids`);
    assert.deepEqual(formula.sourceRefs, [], `${formula.id}: V5 declares no third-party row-level URLs`);
    assert.ok(formula.herbs.length > 0);
    assert.equal(new Set(formula.herbs.map(herb => herb.name)).size, formula.herbs.length, `${formula.id}: duplicate ingredient`);
    for (const herb of formula.herbs) {
      assert.equal(typeof herb.name, 'string');
      assert.ok(herb.name.trim());
      assert.equal(typeof herb.dose, 'string');
      assert.ok(herb.dose.trim(), `${formula.id}: missing doses must say so explicitly`);
      assert.equal(herb.role, '未标注');
    }
  }
});

test('V5 original doses stay in source units and uncollated doses are explicit', () => {
  const withDose = v5.filter(row => row.herbs.some(herb => herb.dose !== unknownDose));
  assert.ok(withDose.length >= 15, `expected at least 15 rows with original units, got ${withDose.length}`);
  for (const row of withDose) {
    for (const herb of row.herbs) {
      assert.doesNotMatch(herb.dose, /\d+\s*g\b/i, `${row.id}: modern gram doses are not collated into V5`);
    }
  }
});

test('V5 syndromes either map onto the runtime index or stay honestly outside it', () => {
  const index = readJson('data/sources/syndromes-expanded.json');
  const syndromes = Array.isArray(index) ? index : index.syndromes;
  const known = new Set([...base.ZHENGS, ...syndromes].map(row => row.name));
  for (const formula of v5) assert.ok(typeof formula.zheng === 'string' && formula.zheng.trim());
  const linked = v5.filter(formula => known.has(formula.zheng));
  assert.ok(linked.length >= 10, `expected at least 10 formulas mapped onto existing syndromes, got ${linked.length}`);
  // Load the generated runtime (bootstrap + chunks + finalizer) and verify every linked
  // syndrome actually lists its V5 formulas.
  const runtime = { window: {} };
  vm.createContext(runtime);
  vm.runInContext(fs.readFileSync(new URL('assets/js/data/featured.js', root), 'utf8'), runtime);
  vm.runInContext(fs.readFileSync(new URL('assets/js/data/expanded.bootstrap.js', root), 'utf8'), runtime);
  for (const file of fs.readdirSync(new URL('assets/js/data/', root)).filter(f => /^expanded\.chunk-\d+\.js$/.test(f)).sort()) {
    vm.runInContext(fs.readFileSync(new URL('assets/js/data/' + file, root), 'utf8'), runtime);
  }
  vm.runInContext(generated, runtime);
  const ZHENGS = runtime.window.ZHENGS;
  for (const formula of linked) {
    const hit = ZHENGS.find(row => row.name === formula.zheng);
    assert.ok(hit, `${formula.id}: syndrome ${formula.zheng} missing from runtime`);
    assert.ok(hit.formulas.includes(formula.id), `${formula.id}: not appended to ${hit.id}.formulas`);
  }
});
