function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));
}

export function stampText(herb = {}) {
  return {
    seal: String(herb.name || '').replace(/[的子]$/, '').slice(0, 2),
    meta: (herb.qi || '') + '·' + (herb.wei || '')
  };
}

export function renderStamp(herb, className = '') {
  const text = stampText(herb);
  return '<span class="herb-stamp ' + escapeHtml(className) + '" aria-label="' + escapeHtml(herb?.name || '') + '"><span class="herb-stamp-seal">' + escapeHtml(text.seal) + '</span><span class="herb-stamp-meta">' + escapeHtml(text.meta) + '</span></span>';
}

if (typeof window !== 'undefined') window.HerbalStamp = { stampText, renderStamp };
