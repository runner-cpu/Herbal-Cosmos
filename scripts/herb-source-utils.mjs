/** Extract unambiguous botanical or zoological binomials from a source record. */
export function extractTaxa(row) {
  const source = String(row?.['来源'] || '').replace(/\u00a0/g, ' ');
  if (/矿物|矿石|化学品|化学成分.*结晶/.test(source)) return [];
  const full = [...source.matchAll(/([A-Z][a-z]{2,}) +([a-z][a-z-]{2,})/g)];
  const names = full.map(match => `${match[1]} ${match[2]}`);
  // Expand an abbreviated genus only when exactly one preceding genus has
  // that initial. Keep source spelling; never guess taxonomic corrections.
  for (const match of source.matchAll(/(?<![A-Za-z])([A-Z])\.\s*([a-z][a-z-]{2,})(?![A-Za-z])/g)) {
    const genera = new Set(full.filter(item => item.index < match.index && item[1][0] === match[1]).map(item => item[1]));
    if (genera.size === 1) names.push(`${[...genera][0]} ${match[2]}`);
  }
  return [...new Set(names)];
}
