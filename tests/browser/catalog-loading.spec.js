import { test, expect } from '@playwright/test';

// This suite asserts the catalog-loader's own retry semantics. The Service
// Worker's fetch handler serves chunk requests from its runtime cache and
// bypasses page.route interception, so keep it disabled here for determinism;
// PWA behaviour is covered separately in pwa.spec.js.
test.use({ serviceWorkers: 'block' });

test('catalog chunks are lazy and load only when index mode is entered', async ({ page }) => {
  const requested=new Set();page.on('request',request=>{if(request.url().includes('/data/catalog/chunk-'))requested.add(request.url());});
  await page.goto('/#/home');
  await expect(page.locator('script[src*="data/catalog/chunk-"]')).toHaveCount(0);
  await page.goto('/#/herbs?mode=catalog&q=%E7%9A%82%E8%A7%92%E5%88%BA');
  await expect(page.locator('#catalogAtlasPanel')).toBeVisible();
  const expectedChunks = await page.evaluate(() => window.HERB_CATALOG_MANIFEST.chunks.length);
  await expect.poll(()=>page.evaluate(()=>window.HERB_CATALOG?.length)).toBe(8818);
  expect(requested.size).toBe(expectedChunks);
});

test('failed chunk can retry without publishing partial or duplicate entries',async({page})=>{
  let fail=true;
  await page.route('**/data/catalog/chunk-c01.js',route=>fail?route.abort():route.continue());
  await page.goto('/#/herbs?mode=catalog');
  await expect(page.locator('[data-retry-catalog]')).toBeVisible();
  expect(await page.evaluate(()=>window.HERB_CATALOG.length)).toBe(0);
  fail=false;await page.locator('[data-retry-catalog]').click();
  await expect(page.locator('#catalogVisibleCount')).toHaveText('8,818');
  const result=await page.evaluate(()=>({count:window.HERB_CATALOG.length,unique:new Set(window.HERB_CATALOG.map(item=>item.id||item.name)).size}));
  expect(result).toEqual({count:8818,unique:8818});
});

test('clicking the catalog tab loads approved rows without requiring a query URL', async ({ page }) => {
  await page.goto('/#/herbs');
  await page.locator('[data-atlas-mode="catalog"]').click();
  await expect(page.locator('#catalogAtlasPanel')).toBeVisible();
  await expect(page.locator('#catalogVisibleCount')).toHaveText('8,818');
  await expect(page.locator('#catalogTableBody tr')).toHaveCount(48);
});

test('global search resolves an indexed name that maps to a featured alias', async ({ page }) => {
  await page.goto('/#/home');
  await page.locator('#globalSearch').fill('公丁香');
  await expect(page.locator('#searchResults .search-result').first()).toBeVisible();
  await expect(page.locator('#searchResults')).toContainText('丁香');
});
