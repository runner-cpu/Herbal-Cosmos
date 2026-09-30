function filterCatalogEntries(entries = []) { return entries.filter(entry => entry?.status !== 'review' && entry?.status !== 'rejected'); }
function catalogScriptUrl(id) { return 'data/catalog/chunk-' + id + '.js'; }

let manifestPromise;
let loadPromise;
let worker;

async function loadInBatches(items, task, { concurrency = 4, onProgress = () => {} } = {}) {
  let next = 0, completed = 0, failure;
  const results = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(items.length, Math.max(1, concurrency)) }, async () => {
    while (!failure && next < items.length) {
      const index = next++;
      try { results[index] = await task(items[index]); onProgress(++completed, items.length); }
      catch (error) { failure ||= error; }
    }
  }));
  if (failure) throw failure;
  return results;
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    const finish = error => { clearTimeout(timer); script.remove(); error ? reject(error) : resolve(); };
    const timer = setTimeout(() => finish(new Error('catalog request timed out: '+url)), 20000);
    script.onload = () => finish();
    script.onerror = () => finish(new Error('catalog chunk failed: ' + url));
    document.head.append(script);
  });
}

async function loadCatalogManifest() {
  if (manifestPromise) return manifestPromise;
  manifestPromise = (async () => {
    if (window.HERB_CATALOG_MANIFEST) return window.HERB_CATALOG_MANIFEST;
    await loadScript('data/catalog/manifest.js');
    return window.HERB_CATALOG_MANIFEST || { chunks: [] };
  })().catch(error => { manifestPromise = null; throw error; });
  return manifestPromise;
}

async function loadCatalog() {
  if (loadPromise) return loadPromise;
  window.dispatchEvent(new CustomEvent('herbal:catalog-loading'));
  loadPromise = (async () => {
    const manifest = await loadCatalogManifest();
    const chunks = manifest.chunks || [];
    const progress = (completed, total) => window.dispatchEvent(new CustomEvent('herbal:catalog-progress', { detail: { completed, total } }));
    progress(0, chunks.length);
    const loaded = await loadInBatches(chunks, async id => {
      if (!window.__HERB_CATALOG_CHUNKS__?.[id]) await loadScript(catalogScriptUrl(id));
      const entries = window.__HERB_CATALOG_CHUNKS__?.[id];
      if (!Array.isArray(entries)) throw new Error('catalog chunk missing: '+id);
      return filterCatalogEntries(entries);
    }, { concurrency: 4, onProgress: progress });
    const entries = [...new Map(loaded.flat().map(entry => [entry.id || entry.name, entry])).values()];
    if (Number.isFinite(manifest.approvedCount) && entries.length !== manifest.approvedCount) throw new Error('catalog count does not match manifest');
    // Publish once. A failed attempt keeps cached chunks without partial or duplicated rows.
    window.HERB_CATALOG.splice(0, window.HERB_CATALOG.length, ...entries);
    if (location.protocol !== 'file:' && typeof Worker !== 'undefined') {
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

function catalogSearch(query, options = {}) {
  const page = options.page || 1;
  const pageSize = options.pageSize || 48;
  const source = options.source || '';
  const fallback = () => {
    const normalized = String(query || '').trim().toLowerCase();
    const rows = filterCatalogEntries(window.HERB_CATALOG || []).filter(entry =>
      (!source || (entry.sourceRefs || []).includes(source)) && (!normalized || [entry.name, ...(entry.aliases || [])].some(value => String(value).toLowerCase().includes(normalized))));
    return { items: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, status: 'ready' };
  };
  if (worker) return new Promise(resolve => {
    const activeWorker = worker;
    const requestId = Math.random().toString(36).slice(2);
    const finish = result => { clearTimeout(timer); activeWorker.removeEventListener('message', handler); activeWorker.removeEventListener('error', fail); resolve(result); };
    const fail = () => { worker = null; activeWorker.terminate(); finish(fallback()); };
    const handler = event => { if (event.data?.type === 'result' && event.data.requestId === requestId) finish(event.data); };
    const timer = setTimeout(fail, 3000);
    activeWorker.addEventListener('message', handler);
    activeWorker.addEventListener('error', fail);
    try { activeWorker.postMessage({ type: 'search', requestId, query, page, pageSize, source }); } catch { fail(); }
  });
  return Promise.resolve(fallback());
}

function initLoader() {
  window.HerbalCatalogLoader = { loadCatalogManifest, loadCatalog, catalogSearch, filterCatalogEntries };
  loadCatalogManifest().then(manifest => {
    window.dispatchEvent(new CustomEvent('herbal:catalog-manifest', { detail: manifest }));
  }).catch(() => {});
  const ensure = () => { const route = location.hash.replace(/^#\/?/, '').split('?')[0]; if (route === 'herbs' && location.hash.includes('mode=catalog')) loadCatalog().catch(() => {}); };
  window.addEventListener('hashchange', ensure);
  window.addEventListener('herbal:catalog-ready', () => {
    window.render?.();
  });
  const searchInput=document.getElementById('globalSearch');
  searchInput?.addEventListener('input', event => { if(event.target.value.trim() && !window.HERB_CATALOG.length) loadCatalog().catch(()=>{}); });
  ensure();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLoader, { once: true }); else initLoader();
}
