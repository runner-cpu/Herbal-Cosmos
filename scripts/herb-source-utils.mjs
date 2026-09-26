/** Extract unambiguous botanical or zoological binomials from a source record. */
export function extractTaxa(row) {
  const source = String(row?.['来源'] || '').replace(/\u00a0/g, ' ');
  if (/矿物|矿石|化学品|化学成分.*结晶/.test(source)) return [];
  return [...new Set(
    [...source.matchAll(/[A-Z][a-z]{2,} +[a-z][a-z-]{2,}/g)]
      .map(match => match[0].replace(/ +/g, ' '))
  )];
}
