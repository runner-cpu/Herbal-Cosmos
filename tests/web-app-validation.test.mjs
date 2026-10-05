import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateWebApp } from '../scripts/validate-web-app.mjs';

test('production shell satisfies metadata, ordering, and budget gates', () => {
  const result = validateWebApp();
  assert.equal(result.ok, true, result.issues.map(item => item.code + ': ' + item.message).join('\n'));
  assert.ok(result.summary.precacheBytes > 0);
  assert.ok(result.summary.precacheBytes <= 2_500_000);
  assert.ok(result.summary.checkedFiles > 0);
});

test('validator rejects a direct or misordered ECharts reference', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'herbal-app-'));
  try {
    fs.writeFileSync(
      path.join(fixture, 'index.html'),
      '<!doctype html><html><head><script src="assets/vendor/echarts.min.js"></script></head><body><script src="assets/js/core/runtime.js"></script></body></html>'
    );
    const result = validateWebApp({ baseDir: fixture });
    assert.ok(result.issues.some(item => item.code === 'echarts-blocking-tag'));
    assert.ok(result.issues.some(item => item.code === 'echarts-order'));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
