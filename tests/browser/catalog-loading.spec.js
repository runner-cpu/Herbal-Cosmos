import { test, expect } from '@playwright/test';

test('catalog chunks are lazy and load only when index mode is entered', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('script[src*="data/catalog/chunk-"]')).toHaveCount(0);
  await page.goto('/#/herbs?mode=catalog&q=%E7%9A%82%E8%A7%92%E5%88%BA');
  await expect(page.locator('#catalogAtlasPanel')).toBeVisible();
  await expect(page.locator('script[src*="data/catalog/chunk-"]')).toHaveCount(1);
});

test('clicking the catalog tab loads approved rows without requiring a query URL', async ({ page }) => {
  await page.goto('/#/herbs');
  await page.locator('[data-atlas-mode="catalog"]').click();
  await expect(page.locator('#catalogAtlasPanel')).toBeVisible();
  await expect(page.locator('#catalogVisibleCount')).toHaveText('2');
  await expect(page.locator('#catalogTableBody tr')).toHaveCount(2);
});
