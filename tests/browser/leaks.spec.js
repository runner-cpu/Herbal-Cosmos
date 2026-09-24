import { test, expect } from '@playwright/test';

test('repeated chart route changes keep instance and observer counts bounded', async ({ page }) => {
  await page.goto('/#/qiwei');
  const baseline = await page.evaluate(() => ({ charts: window.__HERBAL_DEBUG__?.chartCounts?.() || 0, observers: window.__HERBAL_DEBUG__?.observerCounts?.() || 0 }));
  for (let index = 0; index < 3; index += 1) { await page.goto('/#/formula'); await page.goto('/#/qiwei'); }
  const after = await page.evaluate(() => ({ charts: window.__HERBAL_DEBUG__?.chartCounts?.() || 0, observers: window.__HERBAL_DEBUG__?.observerCounts?.() || 0 }));
  expect(after.charts).toBeLessThanOrEqual(baseline.charts + 1);
  expect(after.observers).toBeLessThanOrEqual(baseline.observers + 1);
});
