/* file:// 兼容：lib 以普通脚本加载，IIFE 隔离作用域后挂全局 */
(function () {
  'use strict';
function hasCompleteFacts(herb = {}) {
  return herb.kind !== 'formula-material' && ['qi', 'wei', 'cat', 'eff', 'source'].every(key =>
    typeof herb[key] === 'string' && herb[key].trim() && !['未录入', '未分类'].includes(herb[key])) &&
    Array.isArray(herb.meridian) && herb.meridian.length > 0;
}

function factStatus(herb = {}) {
  if (herb.kind === 'formula-material') return 'material';
  if (['complete', 'partial', 'legacy'].includes(herb.factStatus)) return herb.factStatus;
  return hasCompleteFacts(herb) ? 'complete' : 'partial';
}

function buildDataCoverage(herbs = []) {
  const cards = herbs.filter(herb => herb.kind !== 'formula-material');
  const imageBacked = cards.filter(herb => Boolean(herb.image)).length;
  const sourceCovered = cards.filter(herb => [herb.sourceRefs, herb.distributionSourceRefs]
    .some(refs => Array.isArray(refs) && refs.some(ref => /^https?:\/\//.test(ref)))).length;
  const completeFacts = cards.filter(herb => factStatus(herb) === 'complete').length;
  const partialFacts = cards.filter(herb => factStatus(herb) === 'partial').length;
  const legacyFacts = cards.filter(herb => factStatus(herb) === 'legacy').length;
  return {
    records: herbs.length, featuredCards: cards.length,
    completeFacts, partialFacts, legacyFacts,
    formulaMaterialCount: herbs.length - cards.length,
    imageBacked, placeholder: cards.length - imageBacked, sourceCovered,
    originCovered: cards.filter(herb => Array.isArray(herb.origin) && herb.origin.length > 0).length,
    meridianCovered: cards.filter(herb => Array.isArray(herb.meridian) && herb.meridian.length > 0).length,
    taxonomyCovered: cards.filter(herb => typeof herb.taxonomy === 'string' && herb.taxonomy.trim()).length,
    imageCoverageRatio: cards.length ? imageBacked / cards.length : 0,
    factCoverageRatio: cards.length ? completeFacts / cards.length : 0
  };
}

/* file:// 兼容：挂到全局供 insights.js 调用 */
if (typeof window !== 'undefined') {
  window.HerbalDataCoverageLib = { buildDataCoverage };
}
})();
