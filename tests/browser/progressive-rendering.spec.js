import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('routes without charts never request the ECharts bundle', async ({ page }) => {
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/assets/vendor/echarts.min.js')) requests.push(request.url());
  });

  await page.goto('/#/learn');
  await expect(page.locator('#quizCard .quiz-q')).toBeVisible();
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);

  await page.goto('/#/route-that-does-not-exist');
  await expect(page.locator('[data-route="not-found"]')).toBeVisible();
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);
});

test('homepage content renders before the deferred chart bundle resolves', async ({ page }) => {
  let releaseBundle;
  const bundleGate = new Promise(resolve => { releaseBundle = resolve; });
  await page.route('**/assets/vendor/echarts.min.js', async route => {
    await bundleGate;
    await route.continue();
  });

  await page.goto('/#/home', { waitUntil: 'domcontentloaded' });
  try {
    await expect(page.locator('#homeFeatured .featured-herb').first()).toBeVisible({ timeout: 700 });
    await expect(page.locator('#homeKpis .home-kpi')).toHaveCount(4);
  } finally {
    releaseBundle();
  }
});

test('late chart loading cannot render a route the user already left', async ({ page }) => {
  let releaseBundle;
  const bundleGate = new Promise(resolve => { releaseBundle = resolve; });
  await page.route('**/assets/vendor/echarts.min.js', async route => {
    await bundleGate;
    await route.continue();
  });

  await page.goto('/#/qiwei', { waitUntil: 'domcontentloaded' });
  await page.goto('/#/learn', { waitUntil: 'commit' });
  await expect(page.locator('[data-route="learn"]')).toBeVisible();
  releaseBundle();
  await page.waitForTimeout(500);

  const counts = await page.evaluate(() => ({
    runtime: window.__HERBAL_DEBUG__?.chartCounts?.() || 0,
    insights: window.__HERBAL_DEBUG__?.insightCounts?.().charts || 0
  }));
  expect(counts).toEqual({ runtime: 0, insights: 0 });
});

test('herb facts and related formulas survive a chart bundle failure', async ({ page }) => {
  await page.route('**/assets/vendor/echarts.min.js', route => route.abort());
  await page.goto('/#/herb?id=gancao');

  await expect(page.locator('#herbDetailHead h1')).toHaveText('甘草');
  await expect(page.locator('#herbProps .prop')).toHaveCount(6);
  await expect(page.locator('#herbFormulaList a.formula-row').first()).toBeVisible();
  await expect(page.locator('#herbMeridianChart')).toContainText('图表组件未能加载');
  await expect(page.locator('#herbQiweiChart')).toContainText('图表组件未能加载');
});
