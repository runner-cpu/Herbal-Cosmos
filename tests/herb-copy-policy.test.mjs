import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* 展馆的合规边界写在 index.html 的「不构成医疗建议」上，所以数据层的措辞就是
   这条边界的实际执行点。药典功效字段属于引用原文，允许保留；但把一味药说成某
   个用途的首选、或推荐日常服用方式，等于在数据里给出用药建议，必须在数据层拦住。 */
const TREATMENT_CLAIMS = ['治愈', '根治', '特效', '有效率', '临床验证', '推荐用药', '替代药物', '无毒副作用', '包治', '最好', '第一', '疗效'];
const USAGE_PROMOTIONS = ['要药', '皆宜', '代茶饮', '泡酒'];

function loadRuntime() {
  const dataDir = path.join(root, 'assets/js/data');
  const window = {};
  const context = vm.createContext({ window, console, encodeURIComponent });
  const expanded = fs.readdirSync(dataDir)
    .filter(file => /^expanded\.(?:bootstrap|chunk-\d+|generated)\.js$/.test(file))
    .sort((a, b) => a.localeCompare(b, 'en'));
  for (const file of ['assets/js/data/food-medicine.generated.js', 'assets/js/data/featured.js', ...expanded.map(file => 'assets/js/data/' + file)]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  }
  return window;
}

const words = (text, list) => list.filter(word => String(text || '').includes(word));

test('no knowledge card pushes a herb as the first choice for a use', () => {
  const window = loadRuntime();
  const cards = (window.HERBS || []).filter(herb => !['directory-only', 'formula-material'].includes(herb.kind));
  assert.equal(cards.length, 902);
  const offenders = [];
  for (const herb of cards) {
    for (const [field, value] of Object.entries({ note: herb.note, eff: herb.eff, use: herb.use })) {
      const found = words(value, USAGE_PROMOTIONS);
      if (found.length) offenders.push(herb.id + '.' + field + ' → ' + found.join('、') + '：' + String(value).slice(0, 50));
    }
  }
  assert.deepEqual(offenders, [], '推荐性措辞必须移除：\n' + offenders.join('\n'));
});

test('the food-medicine cards describe directory coverage instead of daily dosing', () => {
  const source = fs.readFileSync(path.join(root, 'assets/js/data/featured.js'), 'utf8');
  const details = source.slice(source.indexOf('const FOOD_DETAILS'), source.indexOf('const FOOD_DETAIL_NAME'));
  assert.ok(details.length > 200, 'the food detail table must still be declared');
  // use 字段是生活场景描述（泡茶 / 煲汤 / 入菜），可以保留；不能出现「代茶饮」
  // 「泡酒」这类把药材推荐成日常服用方式的措辞。
  assert.deepEqual(words(details, USAGE_PROMOTIONS), []);
  // 没有生活场景记录的条目必须走「目录收载」，不能自己编一段用法。
  const fallback = source.slice(source.indexOf('const FOODS ='), source.indexOf('const HERITAGE ='));
  assert.match(fallback, /目录收载/);
  assert.match(fallback, /以相应公告为准/);
});

test('quiz answers cite the pharmacopoeia rather than ranking herbs', () => {
  const window = loadRuntime();
  const quiz = window.QUIZ || [];
  assert.ok(quiz.length >= 20, 'the quiz must still be populated: ' + quiz.length);
  const offenders = [];
  for (const item of quiz) {
    const found = words(item.note, [...USAGE_PROMOTIONS, ...TREATMENT_CLAIMS]);
    if (found.length) offenders.push(item.q + ' → ' + found.join('、'));
  }
  assert.deepEqual(offenders, [], '题库解析不得给出用药建议：\n' + offenders.join('\n'));
});

test('card copy keeps the treatment boundary explicit where it touches efficacy', () => {
  const window = loadRuntime();
  const cards = (window.HERBS || []).filter(herb => !['directory-only', 'formula-material'].includes(herb.kind));
  // 「疗效」「第一」等词仍可出现，但只能出现在显式声明边界、而不是推荐药材的句子里。
  const mentions = cards.filter(herb => String(herb.note || '').includes('疗效'));
  for (const herb of mentions) {
    assert.match(herb.note, /不代表|不等同|不构成/, herb.id + ' 提到疗效时必须同时说明它不构成评价');
  }
});

test('the shell states the no-medical-advice boundary the data layer relies on', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /不构成医疗建议/);
  assert.match(html, /以官方公告为准/);
});
