export function hasCompleteFacts(herb = {}) {
  return herb.kind !== 'formula-material' && ['qi', 'wei', 'cat', 'eff', 'source'].every(key =>
    typeof herb[key] === 'string' && herb[key].trim() && !['未录入', '未分类'].includes(herb[key])) &&
    Array.isArray(herb.meridian) && herb.meridian.length > 0;
}

export function buildDataCoverage(herbs = []) {
  const cards = herbs.filter(herb => herb.kind !== 'formula-material');
  const imageBacked = cards.filter(herb => Boolean(herb.image)).length;
  const sourceCovered = cards.filter(herb => [herb.sourceRefs, herb.distributionSourceRefs]
    .some(refs => Array.isArray(refs) && refs.some(ref => /^https?:\/\//.test(ref)))).length;
  return {
    records: herbs.length, featuredCards: cards.length,
    completeFacts: cards.filter(hasCompleteFacts).length,
    formulaMaterialCount: herbs.length - cards.length,
    imageBacked, placeholder: cards.length - imageBacked, sourceCovered,
    originCovered: cards.filter(herb => Array.isArray(herb.origin) && herb.origin.length > 0).length,
    imageCoverageRatio: cards.length ? imageBacked / cards.length : 0
  };
}
