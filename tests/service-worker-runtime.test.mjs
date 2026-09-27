import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

function loadWorker({ cacheOpenError = null, cachePutError = null } = {}) {
  const listeners = new Map();
  const cache = {
    addAll: async () => undefined,
    delete: async () => true,
    keys: async () => [],
    match: async () => undefined,
    put: async () => { if (cachePutError) throw cachePutError; }
  };
  const networkResponse = {
    ok: true,
    source: 'network',
    clone() { return this; }
  };
  const context = {
    URL,
    Set,
    Object,
    Promise,
    console,
    fetch: async () => networkResponse,
    caches: {
      keys: async () => [],
      delete: async () => true,
      open: async () => { if (cacheOpenError) throw cacheOpenError; return cache; }
    },
    self: {
      location: { origin: 'https://example.test' },
      registration: { scope: 'https://example.test/' },
      clients: { claim: async () => undefined },
      skipWaiting: async () => undefined,
      addEventListener(type, listener) { listeners.set(type, listener); }
    }
  };
  vm.runInNewContext(source, context, { filename: 'sw.js' });
  return { listeners, networkResponse };
}

async function dispatchFetch(listener, request) {
  let responsePromise;
  const background = [];
  listener({
    request,
    respondWith(value) { responsePromise = Promise.resolve(value); },
    waitUntil(value) { background.push(Promise.resolve(value)); }
  });
  assert.ok(responsePromise, 'service worker must handle the same-origin request');
  const response = await responsePromise;
  await Promise.allSettled(background);
  return response;
}

test('successful network responses survive CacheStorage write failures', async () => {
  const { listeners, networkResponse } = loadWorker({ cachePutError: new Error('quota exceeded') });
  const fetchListener = listeners.get('fetch');
  assert.ok(fetchListener, 'fetch listener is registered');

  const requests = [
    { method: 'GET', mode: 'navigate', url: 'https://example.test/#/home' },
    { method: 'GET', mode: 'same-origin', url: 'https://example.test/assets/css/site.css' },
    { method: 'GET', mode: 'same-origin', url: 'https://example.test/images/herbs/gancao.jpg' }
  ];
  for (const request of requests) {
    assert.equal(await dispatchFetch(fetchListener, request), networkResponse);
  }
});

test('successful network responses survive unavailable CacheStorage', async () => {
  const { listeners, networkResponse } = loadWorker({ cacheOpenError: new Error('storage unavailable') });
  const fetchListener = listeners.get('fetch');
  assert.equal(await dispatchFetch(fetchListener, {
    method: 'GET',
    mode: 'same-origin',
    url: 'https://example.test/data/catalog/chunk-c00.js'
  }), networkResponse);
});
