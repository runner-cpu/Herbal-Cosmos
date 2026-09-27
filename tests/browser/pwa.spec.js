import { test, expect } from '@playwright/test';

test('manifest and worker are fetchable and scoped', async ({ page, request }) => {
  const manifestResponse = await request.get('/manifest.webmanifest');
  expect(manifestResponse.ok()).toBeTruthy();
  expect((await manifestResponse.json()).scope).toBe('./');
  expect((await request.get('/sw.js')).ok()).toBeTruthy();

  await page.goto('/#/home');
  await expect.poll(
    () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    { timeout: 15_000 }
  ).toBeTruthy();
});

test('visited shell reloads offline with an honest status', async ({ page, context }) => {
  await page.goto('/#/home');
  await expect.poll(
    () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    { timeout: 15_000 }
  ).toBeTruthy();

  await context.setOffline(true);
  await page.reload();

  await expect(page.locator('[data-route="home"]')).toBeVisible();
  await expect(page.locator('#appStatus')).toContainText('当前离线');
  await expect(page.locator('[data-featured-count]').first()).not.toHaveText('0');

  await context.setOffline(false);
});
