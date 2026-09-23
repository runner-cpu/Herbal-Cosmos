export const NOISE_WORDS = ['疼痛', '抽搐', '烦躁', '苍白', '破溃'];
export const SEPARATORS = /[、，,；;\/＋+]/;

export function buildAuthority({ canonicalNames, aliases, variants }) {
  return {
    canonicalNames: new Set(canonicalNames),
    aliases: new Map(Object.entries(aliases)),
    variants: new Map(Object.entries(variants))
  };
}

export function splitCandidate(raw) {
  return String(raw).split(SEPARATORS).map(value => value.trim()).filter(Boolean);
}

export function normalizeCandidate(raw, variants = new Map()) {
  const compact = String(raw).replace(/\uFEFF|\s+/g, '');
  return variants.get(compact) || compact;
}

export function classifyCandidate(raw, authority) {
  const original = String(raw).trim();
  const normalized = normalizeCandidate(original, authority.variants);
  const reasons = [];

  if (NOISE_WORDS.some(word => normalized.includes(word))) reasons.push('symptom-word');
  if (normalized.includes('等')) reasons.push('contains-deng');
  if (normalized.length > 8) reasons.push('too-long');

  const canonicalName = authority.canonicalNames.has(normalized)
    ? normalized
    : authority.aliases.get(normalized) || '';

  if (!canonicalName) reasons.push('not-in-authority');

  return {
    canonicalName: canonicalName || normalized,
    aliases: canonicalName && canonicalName !== original ? [original] : [],
    status: reasons.length ? 'review' : 'approved',
    reviewReasons: [...new Set(reasons)]
  };
}
