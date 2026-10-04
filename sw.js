const CACHE_VERSION = 'herbal-cosmos-v13-20261003-syndrome-58';
const PRECACHE = CACHE_VERSION + '-shell';
const IMAGE_CACHE = CACHE_VERSION + '-images';
const CATALOG_CACHE = CACHE_VERSION + '-catalog';
const MAX_IMAGE_ENTRIES = 120;
const MAX_CATALOG_ENTRIES = 45;

const PRECACHE_URLS = Object.freeze([
  './',
  './index.html',
  './404.html',
  './manifest.webmanifest',
  './assets/icons/favicon.svg',
  './assets/css/site.css',
  './assets/css/components.css',
  './assets/css/home.css',
  './assets/js/lib/data-coverage.browser.js',
  './assets/js/lib/insight-aggregates.browser.js',
  './assets/vendor/echarts.min.js',
  './assets/js/data/food-medicine.generated.js',
  './assets/js/data/featured.js',
  './assets/js/data/expanded.bootstrap.js',
  './assets/js/data/expanded.chunk-00.js',
  './assets/js/data/expanded.chunk-01.js',
  './assets/js/data/expanded.chunk-02.js',
  './assets/js/data/expanded.chunk-03.js',
  './assets/js/data/expanded.chunk-04.js',
  './assets/js/data/expanded.chunk-05.js',
  './assets/js/data/expanded.chunk-06.js',
  './assets/js/data/expanded.chunk-07.js',
  './assets/js/data/expanded.chunk-08.js',
  './assets/js/data/expanded.generated.js',
  './assets/js/core/runtime.js',
  './assets/js/core/app-shell.js',
  './assets/js/core/catalog-loader.browser.js',
  './assets/js/components/stamp.browser.js',
  './assets/js/components/context-bar.browser.js',
  './assets/js/components/search.browser.js',
  './assets/js/components/saved-drawer.browser.js',
  './assets/js/components/theme.browser.js',
  './assets/js/pages/home.browser.js',
  './assets/js/pages/cross-navigation.browser.js',
  './assets/js/pages/cosmos.browser.js',
  './assets/js/charts/insights.js',
  './assets/js/beautify.js',
  './workers/catalog-search.js',
  './data/catalog/manifest.js'
]);

const CURRENT_CACHES = new Set([PRECACHE, IMAGE_CACHE, CATALOG_CACHE]);
const PRECACHE_REQUESTS = new Set(PRECACHE_URLS.map(value => new URL(value, self.registration.scope).href.split('#')[0]));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => name.startsWith('herbal-cosmos-') && !CURRENT_CACHES.has(name) ? caches.delete(name) : Promise.resolve(false)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

async function trimCache(cacheName, maximum) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  const removeCount = Math.max(0, requests.length - maximum);
  await Promise.all(requests.slice(0, removeCount).map(request => cache.delete(request)));
}

async function matchCache(cacheName, request, options) {
  try {
    const cache = await caches.open(cacheName);
    return await cache.match(request, options);
  } catch {
    return undefined;
  }
}

async function storeResponse(cacheName, request, response, maximum) {
  if (!response || !response.ok) return;
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    if (Number.isFinite(maximum)) await trimCache(cacheName, maximum);
  } catch {
    // CacheStorage is an enhancement. A quota or privacy-mode failure must
    // never turn a successful network response into a failed request.
  }
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    await storeResponse(PRECACHE, './index.html', response);
    return response;
  } catch (error) {
    const fallback = await matchCache(PRECACHE, './index.html') || await matchCache(PRECACHE, './');
    if (fallback) return fallback;
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName, maximum, event) {
  const cached = await matchCache(cacheName, request, { ignoreSearch: false });
  const update = fetch(request).then(async response => {
    await storeResponse(cacheName, request, response, maximum);
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => undefined));
    return cached;
  }
  return update;
}

async function cacheFirstWithRefresh(request, event) {
  const cached = await matchCache(PRECACHE, request, { ignoreSearch: true });
  const update = fetch(request).then(async response => {
    await storeResponse(PRECACHE, request, response);
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => undefined));
    return cached;
  }
  return update;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  if (url.pathname.includes('/images/herbs/')) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, MAX_IMAGE_ENTRIES, event));
    return;
  }
  if (url.pathname.includes('/data/catalog/chunk-')) {
    event.respondWith(staleWhileRevalidate(request, CATALOG_CACHE, MAX_CATALOG_ENTRIES, event));
    return;
  }
  if (PRECACHE_REQUESTS.has(url.href.split('#')[0])) {
    event.respondWith(cacheFirstWithRefresh(request, event));
  }
});
