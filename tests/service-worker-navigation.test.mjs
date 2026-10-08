import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const scope = 'https://example.test/exhibition/';

function navigationWorker(networkResponse) {
  let online = true;
  const listeners = new Map();
  const entries = new Map([[scope + 'index.html', new Response('<html>original app</html>', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })]]);
  const key = request => new URL(typeof request === 'string' ? request : request.url, scope).href;
  vm.runInNewContext(source, {
    URL, Map, Set, Object, Promise, console,
    async fetch() {
      if (!online) throw new Error('network offline');
      return networkResponse.clone();
    },
    caches: {
      async open() {
        return {
          async match(request) { return entries.get(key(request))?.clone(); },
          async put(request, response) { entries.set(key(request), response.clone()); }
        };
      }
    },
    self: {
      registration: { scope },
      location: { origin: 'https://example.test' },
      addEventListener(type, listener) { listeners.set(type, listener); }
    }
  }, { filename: 'sw.js' });
  return {
    offline() { online = false; },
    async cachedApp() { return entries.get(scope + 'index.html').clone().text(); },
    navigate(path) {
      let response;
      listeners.get('fetch')({
        request: { method: 'GET', mode: 'navigate', url: new URL(path, scope).href },
        respondWith(value) { response = value; }
      });
      return response;
    }
  };
}

test('only HTML navigations to application entry paths update its offline shell', async () => {
  const fixtures = [
    ['', 'text/html; charset=utf-8', '<html>updated app</html>'],
    ['index.html?demo=1#/intro', 'text/html', '<html>updated app</html>'],
    ['', 'text/plain', '<html>original app</html>'],
    ['docs/competition-framework.md', 'text/plain', '<html>original app</html>'],
    ['404.html', 'text/html', '<html>original app</html>']
  ];
  for (const [path, contentType, expected] of fixtures) {
    const worker = navigationWorker(new Response('<html>updated app</html>', { headers: { 'Content-Type': contentType } }));
    assert.equal(await (await worker.navigate(path)).text(), '<html>updated app</html>');
    assert.equal(await worker.cachedApp(), expected, path + ' with ' + contentType);
  }
});

test('offline entry navigation receives its shell while documents remain a network-only resource', async () => {
  const worker = navigationWorker(new Response('# project document', { headers: { 'Content-Type': 'text/plain' } }));
  await worker.navigate('docs/competition-framework.md');
  worker.offline();
  assert.equal(await (await worker.navigate('?demo=1#/intro')).text(), '<html>original app</html>');
  assert.equal(await (await worker.navigate('index.html#/qiwei')).text(), '<html>original app</html>');
  await assert.rejects(worker.navigate('docs/competition-framework.md'), /network offline/);
});
