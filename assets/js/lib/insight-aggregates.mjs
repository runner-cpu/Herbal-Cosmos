const ROLE_NAMES = ['君', '臣', '佐', '使'];

export function rankFormulaHerbs(formulas = [], herbs = []) {
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

export function countFormulaRoles(formulas = []) {
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

export function buildMeridianEffectFlow(herbs = []) {
  const counts = new Map();
  herbs.forEach(herb => {
    const target = herb?.cat || (herb?.eff || '').split(/[，,。；;]/)[0] || '未标注功效';
    [...new Set(herb?.meridian || [])].forEach(meridian => {
      const source = String(meridian).endsWith('经') ? String(meridian) : String(meridian) + '经';
      const key = source + '\u0000' + target;
      counts.set(key, { source, target, value: (counts.get(key)?.value || 0) + 1 });
    });
  });
  const links = [...counts.values()].sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
  const nodes = [...new Set(links.flatMap(link => [link.source, link.target]))].map(name => ({ name }));
  return { nodes, links };
}

export function buildFoodUsageMatrix(foods = []) {
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

export { ROLE_NAMES };
