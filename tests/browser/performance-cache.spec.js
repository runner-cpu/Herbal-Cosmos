import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'allow' });

async function openCachedIntro(page) {
  await page.goto('/#/intro');
  await expect(page.locator('[data-route="home"] .cosmos-scene')).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), {
    timeout: 15_000
  }).toBeTruthy();
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('assets/vendor/cosmos-webgl.js'))), {timeout:15000}).toBeTruthy();
}

async function openQiwei(page) {
  await page.evaluate(() => { location.hash = '/qiwei'; });
  await expect(page.locator('#qiweiMatrixChart canvas').first()).toBeVisible();
}

test('fresh cultural intro does not download chart or catalog payloads during offline installation', async ({ page, context }) => {
  const downloaded = [];
  context.on('response', response => {
    if (/\/assets\/vendor\/echarts\.min\.js|\/data\/catalog\/chunk-/.test(response.url())) {
      downloaded.push(response.url());
    }
  });
  await openCachedIntro(page);
  expect(downloaded).toEqual([]);
  expect(await page.evaluate(() => typeof window.echarts)).toBe('undefined');
});

test('visited chart library comes from the versioned cache without a background download', async ({ page, context }) => {
  await openCachedIntro(page);
  await openQiwei(page);
  // Waiting for the stored response removes a race between script execution
  // and CacheStorage.put; the observable chart still determines readiness.
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('assets/vendor/echarts.min.js')))).toBeTruthy();
  const networkDownloads = [];
  context.on('response', response => {
    if (response.url().includes('/assets/vendor/echarts.min.js') && !response.fromServiceWorker()) {
      networkDownloads.push(response.url());
    }
  });
  await page.reload();
  await expect(page.locator('#qiweiMatrixChart canvas').first()).toBeVisible();
  expect(networkDownloads).toEqual([]);
});

test('a visited chart reloads offline with its field utilities and complete data', async ({ page, context }) => {
  await openCachedIntro(page);
  await openQiwei(page);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('assets/vendor/echarts.min.js')))).toBeTruthy();
  const scriptFailures = [], errors = [];
  page.on('requestfailed', request => {
    if (request.resourceType() === 'script') scriptFailures.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#appStatus')).toContainText('当前离线');
  await expect(page.locator('#qiweiMatrixChart canvas').first()).toBeVisible();
  expect(await page.evaluate(() => window.HERBS.filter(herb => !['formula-material', 'directory-only'].includes(herb.kind)).length)).toBe(902);
  expect(scriptFailures).toEqual([]);
  expect(errors).toEqual([]);
});

test('a first visit directly to a chart warms the library after worker activation', async ({ page, context }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/qiwei');
  await expect(page.locator('#qiweiMatrixChart canvas').first()).toBeVisible();
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('assets/vendor/echarts.min.js'))), {
    timeout: 15_000
  }).toBeTruthy();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#qiweiMatrixChart canvas').first()).toBeVisible();
  await expect(page.locator('#appStatus')).toContainText('当前离线');
  expect(errors).toEqual([]);
});

test('reading a project document cannot replace the offline exhibition or its chart data', async ({ page, context }) => {
  const errors = [], scriptFailures = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => {
    if (request.resourceType() === 'script') scriptFailures.push(request.url());
  });
  await openCachedIntro(page);
  await openQiwei(page);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('assets/vendor/echarts.min.js')))).toBeTruthy();
  const document = await page.goto('/docs/competition-framework.md');
  expect(document.headers()['content-type']).toContain('text/plain');
  await expect(page.locator('body')).toContainText('文化交互展 V7');
  await context.setOffline(true);
  await page.goto('/#/intro');
  await expect(page.locator('[data-route="home"] .cosmos-scene')).toBeVisible();
  await openQiwei(page);
  expect(await page.evaluate(() => ({
    cards: window.HERBS.filter(herb => !['formula-material', 'directory-only'].includes(herb.kind)).length,
    formulas: window.FORMULAS.length,
    syndromes: window.ZHENGS.length
  }))).toEqual({ cards: 902, formulas: 100, syndromes: 58 });
  expect(errors).toEqual([]);
  expect(scriptFailures).toEqual([]);
});
