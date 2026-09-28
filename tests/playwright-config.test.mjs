import test from 'node:test';
import assert from 'node:assert/strict';

test('browser tests use the requested port and never reuse an unrelated listener', async () => {
  const previousPort = process.env.PLAYWRIGHT_PORT;
  process.env.PLAYWRIGHT_PORT = '43123';
  try {
    const { default: config } = await import(`../playwright.config.js?port-test=${Date.now()}`);
    assert.equal(config.use.baseURL, 'http://127.0.0.1:43123');
    assert.equal(config.webServer.url, 'http://127.0.0.1:43123');
    assert.match(config.webServer.command, /serve-local\.mjs 43123$/);
    assert.equal(config.webServer.reuseExistingServer, false);
  } finally {
    if (previousPort === undefined) delete process.env.PLAYWRIGHT_PORT;
    else process.env.PLAYWRIGHT_PORT = previousPort;
  }
});
