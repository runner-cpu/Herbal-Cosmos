export function filterCatalogEntries(entries = []) { return entries.filter(entry => entry?.status !== 'review' && entry?.status !== 'rejected'); }
export function catalogScriptUrl(id) { return 'data/catalog/chunk-' + id + '.js'; }

let manifestPromise;
let loadPromise;
let worker;

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = () => reject(new Error('catalog chunk failed: ' + url));
    document.head.append(script);
  });
}

export async function loadCatalogManifest() {
  if (manifestPromise) return manifestPromise;
  manifestPromise = (async () => {
    if (window.HERB_CATALOG_MANIFEST) return window.HERB_CATALOG_MANIFEST;
    await loadScript('data/catalog/manifest.js');
    return window.HERB_CATALOG_MANIFEST || { chunks: [] };
  })();
  return manifestPromise;
}

export async function loadCatalog() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const manifest = await loadCatalogManifest();
    const chunks = manifest.chunks || [];
    if (location.protocol === 'file:' || typeof Worker === 'undefined') {
      for (const id of chunks) {
        if (!window.__HERB_CATALOG_CHUNKS__?.[id]) await loadScript(catalogScriptUrl(id));
        const entries = window.__HERB_CATALOG_CHUNKS__?.[id] || [];
        window.HERB_CATALOG.push(...filterCatalogEntries(entries));
      }
    } else {
      for (const id of chunks) {
        if (!window.__HERB_CATALOG_CHUNKS__?.[id]) await loadScript(catalogScriptUrl(id));
        const entries = window.__HERB_CATALOG_CHUNKS__?.[id] || [];
        window.HERB_CATALOG.push(...filterCatalogEntries(entries));
      }
      try {
        worker = new Worker('workers/catalog-search.js');
        worker.postMessage({ type: 'init', entries: window.HERB_CATALOG });
      } catch { worker = null; }
    }
    window.dispatchEvent(new CustomEvent('herbal:catalog-ready', { detail: { manifest, count: window.HERB_CATALOG.length } }));
    return { manifest, entries: window.HERB_CATALOG };
  })().catch(error => { loadPromise = null; window.dispatchEvent(new CustomEvent('herbal:catalog-error', { detail: { error } })); throw error; });
  return loadPromise;
}

export function catalogSearch(query, options = {}) {
  const page = options.page || 1;
  const pageSize = options.pageSize || 48;
  const source = options.source || '';
  if (worker) return new Promise(resolve => {
    const requestId = Math.random().toString(36).slice(2);
    const handler = event => { if (event.data?.type === 'result' && event.data.requestId === requestId) { worker.removeEventListener('message', handler); resolve(event.data); } };
    worker.addEventListener('message', handler);
    worker.postMessage({ type: 'search', requestId, query, page, pageSize, source });
  });
  const rows = filterCatalogEntries(window.HERB_CATALOG || []).filter(entry => !query || entry.name.includes(query));
  return Promise.resolve({ items: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, status: 'ready' });
}

function initLoader() {
  window.HerbalCatalogLoader = { loadCatalogManifest, loadCatalog, catalogSearch, filterCatalogEntries };
  loadCatalogManifest().then(manifest => {
    window.dispatchEvent(new CustomEvent('herbal:catalog-manifest', { detail: manifest }));
  }).catch(() => {});
  const ensure = () => { const route = location.hash.replace(/^#\/?/, '').split('?')[0]; if (route === 'herbs' && location.hash.includes('mode=catalog')) loadCatalog().catch(() => {}); };
  window.addEventListener('hashchange', ensure);
  window.addEventListener('herbal:catalog-ready', () => { window.render?.(); });
  ensure();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLoader, { once: true }); else initLoader();
}
