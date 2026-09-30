/* file:// 兼容：lib 以普通脚本加载，IIFE 隔离作用域后挂全局 */
(function () {
  'use strict';
const ROLE_NAMES = ['君', '臣', '佐', '使'];
const UNKNOWN = /^(?:未录入|未标注|未知|暂无|无|不详)$/;
const known = value => typeof value === 'string' && value.trim() && !UNKNOWN.test(value.trim());

function buildCooccurrenceMatrix(formulas = [], herbs = [], limit = 14) {
  const items = rankFormulaHerbs(formulas, herbs).slice(0, limit);
  const ids = new Set(items.map(item => item.id));
  const cells = new Map();
  formulas.forEach(formula => {
    const members = [...new Set((formula.herbs || []).map(entry => entry?.[0]))].filter(id => ids.has(id));
    members.forEach(a => members.forEach(b => {
      const key = a + '\u0000' + b;
      if (!cells.has(key)) cells.set(key, { a, b, count: 0, formulaIds: [] });
      const cell = cells.get(key);
      cell.count += 1;
      cell.formulaIds.push(formula.id);
    }));
  });
  return { items, cells: items.flatMap(a => items.map(b => cells.get(a.id + '\u0000' + b.id) || { a: a.id, b: b.id, count: 0, formulaIds: [] })) };
}

function parseGramDose(dose) {
  if (typeof dose !== 'string') return null;
  const match = dose.trim().match(/^(\d+(?:\.\d+)?|\.\d+)\s*(?:g|克)$/i);
  const value = match ? Number(match[1]) : NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}

function quantile(sorted, fraction) {
  const index = (sorted.length - 1) * fraction;
  const low = Math.floor(index);
  return sorted[low] + (sorted[Math.ceil(index)] - sorted[low]) * (index - low);
}

function buildRoleDoseDistribution(formulas = []) {
  const groups = ROLE_NAMES.map(role => ({ role, samples: [], box: null, outliers: [] }));
  const excluded = { unitOrRange: 0, unassignedRole: 0 };
  let total = 0;
  formulas.forEach(formula => (formula.herbs || []).forEach(([herbId, dose, role]) => {
    total += 1;
    const value = parseGramDose(dose);
    if (value === null) { excluded.unitOrRange += 1; return; }
    const group = groups.find(item => item.role === role);
    if (!group) { excluded.unassignedRole += 1; return; }
    group.samples.push({ formulaId: formula.id, formulaName: formula.name, herbId, value, dose });
  }));
  groups.forEach(group => {
    const sorted = group.samples.map(sample => sample.value).sort((a, b) => a - b);
    if (!sorted.length) return;
    const q1 = quantile(sorted, .25), median = quantile(sorted, .5), q3 = quantile(sorted, .75);
    const fence = (q3 - q1) * 1.5;
    const inside = sorted.filter(value => value >= q1 - fence && value <= q3 + fence);
    group.box = [inside[0], q1, median, q3, inside[inside.length - 1]];
    group.outliers = group.samples.filter(sample => sample.value < q1 - fence || sample.value > q3 + fence);
  });
  return { groups, total, included: groups.reduce((sum, group) => sum + group.samples.length, 0), excluded };
}

function buildProvinceDistribution(herbs = []) {
  const provinces = new Map();
  const covered = new Set();
  herbs.forEach(herb => {
    if (!herb.id || !Array.isArray(herb.origin)) return;
    [...new Set(herb.origin.filter(known).map(value => value.trim()))].forEach(province => {
      if (!provinces.has(province)) provinces.set(province, new Set());
      provinces.get(province).add(herb.id);
      covered.add(herb.id);
    });
  });
  return { covered: covered.size, missing: new Set(herbs.map(herb => herb.id).filter(Boolean)).size - covered.size, provinces: [...provinces].map(([province, ids]) => ({ province, count: ids.size, herbIds: [...ids] })).sort((a, b) => b.count - a.count || a.province.localeCompare(b.province, 'zh-CN')) };
}

function rankFormulaHerbs(formulas = [], herbs = []) {
  const counts = new Map();
  formulas.forEach(formula => {
    const ids = new Set((formula?.herbs || []).map(entry => entry?.[0]).filter(Boolean));
    ids.forEach(id => counts.set(id, (counts.get(id) || 0) + 1));
  });
  const names = new Map(herbs.map(herb => [herb.id, herb.name]));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([id, count]) => {
    const result = { id, count };
    if (names.has(id)) result.name = names.get(id);
    return result;
  });
}

function countFormulaRoles(formulas = []) {
  const formulasResult = formulas.map(formula => {
    const row = { id: formula.id, name: formula.name || formula.id };
    ROLE_NAMES.forEach(role => { row[role] = 0; });
    (formula.herbs || []).forEach(entry => {
      const role = entry?.[2];
      if (ROLE_NAMES.includes(role)) row[role] += 1;
    });
    return row;
  });
  return { roles: [...ROLE_NAMES], formulas: formulasResult };
}

function buildMeridianEffectFlow(herbs = []) {
  const counts = new Map();
  herbs.forEach(herb => {
    const target = known(herb?.cat) ? herb.cat : (herb?.eff || '').split(/[，,。；;]/)[0];
    if (!known(target)) return;
    [...new Set(herb?.meridian || [])].filter(known).forEach(meridian => {
      const source = String(meridian).endsWith('经') ? String(meridian) : String(meridian) + '经';
      const key = source + '\u0000' + target;
      counts.set(key, { source, target, value: (counts.get(key)?.value || 0) + 1 });
    });
  });
  const links = [...counts.values()].sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
  const nodes = [...new Set(links.flatMap(link => [link.source, link.target]))].map(name => ({ name }));
  return { nodes, links };
}

function buildFoodUsageMatrix(foods = []) {
  const counts = new Map();
  foods.forEach(food => {
    const flavor = food?.flavor || '未标注性味';
    const uses = String(food?.use || food?.tag || '未标注用法').split(/[\/／]/).map(value => value.trim()).filter(Boolean);
    [...new Set(uses)].forEach(use => {
      const key = flavor + '\u0000' + use;
      counts.set(key, { flavor, use, count: (counts.get(key)?.count || 0) + 1 });
    });
  });
  return [...counts.values()].sort((a, b) => a.flavor.localeCompare(b.flavor) || a.use.localeCompare(b.use));
}

/**
 * Summarise which source-backed knowledge fields are present for each
 * traditional category. Counts are deliberately additive (not percentages)
 * so the chart can show both the category size and the evidence available.
 */
function buildFactCompletenessMatrix(herbs = [], limit = 12) {
  const features = ['图片', '归经', '地区', '分类学', '逐行来源'];
  const records = herbs.filter(herb => herb?.kind !== 'formula-material' && herb?.id);
  const groups = new Map();
  const hasSource = herb => [herb.sourceRefs, herb.distributionSourceRefs]
    .some(refs => Array.isArray(refs) && refs.some(ref => /^https?:\/\//.test(ref)));
  records.forEach(herb => {
    const category = known(herb.cat) ? herb.cat.trim() : '未分类';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(herb);
  });
  const rows = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-CN'))
    .slice(0, Math.max(1, limit))
    .map(([category, items]) => ({
      category,
      total: items.length,
      values: [
        items.filter(item => Boolean(item.image)).length,
        items.filter(item => Array.isArray(item.meridian) && item.meridian.length > 0).length,
        items.filter(item => Array.isArray(item.origin) && item.origin.some(known)).length,
        items.filter(item => known(item.taxonomy)).length,
        items.filter(hasSource).length
      ],
      ids: items.map(item => item.id)
    }));
  return { features, categories: rows.map(row => row.category), rows, total: records.length };
}

/* file:// 兼容：挂到全局供 insights.js 调用 */
if (typeof window !== 'undefined') {
  window.HerbalInsightLib = {
    rankFormulaHerbs, countFormulaRoles, buildMeridianEffectFlow,
    buildFoodUsageMatrix, buildCooccurrenceMatrix, buildRoleDoseDistribution,
    buildProvinceDistribution, buildFactCompletenessMatrix,
  };
}
})();
