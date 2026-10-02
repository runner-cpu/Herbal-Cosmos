/** Emit JSON-equivalent JavaScript literals with repeated long strings shared. */
function collectRepeatedStrings(payload) {
  const counts = new Map();
  const visit = value => {
    if (typeof value === 'string' && value.length > 40) counts.set(value, (counts.get(value) || 0) + 1);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') Object.values(value).forEach(visit);
  };
  visit(payload);
  return [...counts].filter(([, count]) => count > 1).map(([value]) => value);
}

function encodePayload(payload, strings) {
  const ids = new Map(strings.map((value, index) => [value, index]));
  const encode = value => {
    if (typeof value === 'string' && ids.has(value)) return 'sharedStrings[' + ids.get(value) + ']';
    if (Array.isArray(value)) return '[' + value.map(encode).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.entries(value).map(([key, item]) => JSON.stringify(key) + ':' + encode(item)).join(',') + '}';
    return JSON.stringify(value);
  };
  return encode(payload);
}

/**
 * `sharedStrings` can be supplied by a bootstrap file when a payload is split
 * into several browser scripts. The default remains byte-for-byte compatible
 * with the original single-file serializer.
 */
export function serializeSharedStrings(payload, options = {}) {
  const strings = options.sharedStrings || collectRepeatedStrings(payload);
  const table = options.includeTable === false ? '' : 'const sharedStrings=' + JSON.stringify(strings) + ';\n';
  return table + 'const data=' + encodePayload(payload, strings) + ';';
}

export { collectRepeatedStrings };
