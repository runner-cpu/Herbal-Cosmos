import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const vendorUrl = 'https://example.test/exhibition/assets/vendor/echarts.min.js';

function workerHarness({ networkGate = Promise.resolve() } = {}) {
  const listeners = new Map(), downloads = [], stores = new Map();
  const key = request => typeof request === 'string' ? request : request.url;
  const withoutQuery = value => { const url = new URL(value); url.search = ''; return url.href; };
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async match(request, options = {}) {
          const requested = key(request);
          const entry = [...entries].find(([url]) => options.ignoreSearch ? withoutQuery(url) === withoutQuery(requested) : url === requested);
          return entry?.[1].clone();
        },
        async put(request, response) { entries.set(key(request), response.clone()); }
      };
    }
  };
  vm.runInNewContext(source, {
    URL, Map, Set, Object, Promise, console, caches,
    async fetch(request) {
      downloads.push(key(request));
      await networkGate;
      return new Response('chart-code');
    },
    self: {
      registration: { scope: 'https://example.test/exhibition/' },
      location: { origin: 'https://example.test' },
      addEventListener(type, listener) { listeners.set(type, listener); }
    }
  }, { filename: 'sw.js' });
  return {
    downloads,
    warm(data) {
      let completion;
      listeners.get('message')({ data, waitUntil(value) { completion = value; } });
      return completion;
    },
    request(url) {
      let response;
      listeners.get('fetch')({ request: { method: 'GET', mode: 'same-origin', url }, respondWith(value) { response = value; } });
      return response;
    }
  };
}

test('chart warm-up ignores client URLs and uses the pinned asset inside its deployment scope', async () => {
  const worker = workerHarness();
  await worker.warm({ type: 'CACHE_VENDOR', url: 'https://unrelated.test/large-file.js' });
  assert.deepEqual(worker.downloads, [vendorUrl]);
  await worker.warm({ type: 'CACHE_VENDOR', url: '/other-file.js' });
  assert.deepEqual(worker.downloads, [vendorUrl], 'a cached library does not download again');
  assert.equal(await (await worker.request(vendorUrl)).text(), 'chart-code');
});

test('concurrent warm-up and chart fetch share one download with separate readable bodies', async () => {
  let release;
  const networkGate = new Promise(resolve => { release = resolve; });
  const worker = workerHarness({ networkGate });
  const first = worker.warm({ type: 'CACHE_VENDOR' });
  const second = worker.warm({ type: 'CACHE_VENDOR' });
  const fetched = worker.request(vendorUrl);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(worker.downloads, [vendorUrl]);
  release();
  const responses = await Promise.all([first, second, fetched]);
  assert.equal(await responses[0].text(), 'chart-code');
  assert.equal(await responses[1].text(), 'chart-code');
  assert.equal(await responses[2].text(), 'chart-code');
});
