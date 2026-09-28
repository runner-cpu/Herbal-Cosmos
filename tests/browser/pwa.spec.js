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

test('blocked persistent storage falls back to current-session state', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const blocked = () => { throw new DOMException('Persistent storage is blocked', 'SecurityError'); };
    for (const method of ['getItem', 'setItem', 'removeItem', 'clear']) {
      Object.defineProperty(Storage.prototype, method, { configurable: true, value: blocked });
    }
  });

  await page.goto('/#/herbs');
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'herbs');
  await page.locator('[data-fav]:visible').first().click();
  await expect(page.locator('[data-saved-count]')).toHaveText('1');
  await page.locator('#savedDrawerToggle').click();
  await expect(page.locator('#savedDrawer [data-drawer-fav]')).toHaveCount(1);
  await page.locator('#savedDrawer [data-saved-close]').click();

  await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');

  await page.goto('/#/home?anchor=home-learning');
  await page.locator('[data-answer="1"]').click();
  await expect(page.locator('#learnStats')).toContainText('已完成 1');
  await page.goto('/#/home');
  await expect(page.locator('#learnStats')).toContainText('已完成 1');
  expect(pageErrors).toEqual([]);
});
