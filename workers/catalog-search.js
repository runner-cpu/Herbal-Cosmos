let entries = [];

function search(query = '', page = 1, pageSize = 48, source = '') {
  const keyword = String(query).trim().toLowerCase();
  const filtered = entries.filter(entry => {
    if (entry?.status === 'review' || entry?.status === 'rejected') return false;
    if (source && !(entry.sourceRefs || []).includes(source)) return false;
    return !keyword || String(entry.name || '').toLowerCase().includes(keyword) || (entry.aliases || []).some(alias => alias.toLowerCase().includes(keyword));
  });
  const start = Math.max(0, (page - 1) * pageSize);
  return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}

self.onmessage = event => {
  const message = event.data || {};
  if (message.type === 'init') entries = Array.isArray(message.entries) ? message.entries : [];
  if (message.type === 'search') self.postMessage({ type: 'result', requestId: message.requestId, ...search(message.query, message.page, message.pageSize, message.source) });
};
