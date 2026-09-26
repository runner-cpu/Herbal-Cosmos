import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { factualHerb } from '../scripts/import-open-herbs.mjs';
import { extractTaxa } from '../scripts/fetch-herb-images.mjs';

const row = {
  中药名: '九节菖蒲',
  拼音: 'jiujiechangpu',
  英文名: 'Rhizoma Anemones Altaicae',
  来源: '本品为毛茛科植物阿尔泰银莲花 Anemone altaica Fisch. 的干燥根茎。',
  性味: '味辛；性温。',
  归经: '归心、肝、胃经。',
  功效作用: '开窍化痰，醒脾安神。属开窍药。',
  别名: '小菖蒲、节菖蒲',
  产地分布: '分布于山西、河南、湖北、陕西。'
};

test('资料导入与图片检索共享完整的双名法解析', () => {
  const herb = factualHerb(row, 16);
  assert.deepEqual(extractTaxa(row), ['Anemone altaica']);
  assert.equal(herb.taxonomy, 'Anemone altaica');
  assert.equal(herb.latin, 'Anemone altaica');
});

test('资料导入只保留传统分类，不复制无明确许可的功效长文', () => {
  const herb = factualHerb(row, 16);
  assert.equal(herb.cat, '开窍药');
  assert.equal(herb.eff, '传统分类：开窍药');
  assert.doesNotMatch(JSON.stringify(herb), /开窍化痰|醒脾安神/);
});

test('提交的公开资料快照不含上游功效作用原文', () => {
  const source = JSON.parse(fs.readFileSync(new URL('../data/sources/open-herb-facts.json', import.meta.url), 'utf8'));
  assert.ok(source.herbs.length >= 800);
  assert.ok(source.herbs.every(herb => /^传统分类：/.test(herb.eff) || herb.eff === '传统分类未录入'));
  assert.ok(source.herbs.every(herb => !('effectText' in herb)));
});
