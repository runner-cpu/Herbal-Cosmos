import { test, expect } from '@playwright/test';

test('catalog chunks are lazy and load only when index mode is entered', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/#/home');
  expect(requests.some(url => url.includes('/data/catalog/chunk-'))).toBeFalsy();
  await page.goto('/#/herbs?mode=catalog&q=%E7%9A%82%E8%A7%92%E5%88%BA');
  await expect(page.locator('#catalogAtlasPanel')).toBeVisible();
  await expect.poll(() => requests.some(url => url.includes('/data/catalog/chunk-'))).toBeTruthy();
});
