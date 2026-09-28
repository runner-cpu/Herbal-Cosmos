import { test, expect } from '@playwright/test';

async function openPrimaryNavigation(page) {
  const hamburger = page.locator('#hamburger');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await expect(page.locator('#mainNav')).toHaveClass(/open/);
  }
}

test('primary navigation has four substantial entries', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#mainNav > a')).toHaveCount(4);
  await openPrimaryNavigation(page);
  await expect(page.locator('#navMore')).toHaveCount(0);
});

test('legacy learning and syndrome routes open their consolidated views', async ({ page }) => {
  await page.goto('/#/learn?step=2');
  await expect(page.locator('[data-route="home"]')).toBeVisible();
  await expect(page.locator('#home-learning')).toBeVisible();
  await page.goto('/#/zheng?z=feng-han&f=guizhitang');
  await expect(page.locator('[data-route="formula"]')).toBeVisible();
  await expect(page.locator('#formulaZhengView')).toBeVisible();
  await expect(page.locator('[data-formula-view="zheng"]')).toHaveAttribute('aria-pressed', 'true');
});

test('formula views preserve syndrome and formula context in both directions', async ({ page }) => {
  await page.goto('/#/formula?view=zheng&z=feng-han&f=guizhitang');
  await expect(page.locator('#zhengFocusTitle')).not.toHaveText('选择一个证候');
  await page.locator('[data-formula-view="network"]').click();
  await expect(page).toHaveURL(/#\/formula[?]f=guizhitang&z=feng-han$/);
  await expect(page.locator('#formulaNetworkView')).toBeVisible();
  await page.locator('[data-formula-view="zheng"]').click();
  await expect(page).toHaveURL(/view=zheng/);
  await expect(page).toHaveURL(/z=feng-han/);
  await expect(page).toHaveURL(/f=guizhitang/);
});

test('unknown hash renders a safe recoverable in-app 404', async ({ page }) => {
  await page.goto('/#/route-that-does-not-exist?x=%3Cscript%3E');
  await expect(page.locator('[data-route="not-found"]')).toBeVisible();
  await expect(page.locator('#unknownRoute')).toContainText('route-that-does-not-exist');
  await expect(page.locator('#unknownRoute script')).toHaveCount(0);
  await page.locator('[data-not-found-home]').click();
  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.locator('[data-route="home"]')).toBeVisible();
});

test('unknown home-prefixed anchors still render the in-app 404', async ({ page }) => {
  await page.goto('/#/home-not-a-real-section');
  await expect(page.locator('[data-route="not-found"]')).toBeVisible();
  await expect(page.locator('#unknownRoute')).toHaveText('home-not-a-real-section');
});

test('malformed query encoding cannot stop route rendering', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/#/home?focus=%E0%A4%A');
  await expect(page.locator('[data-route="home"]')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('mobile menu exposes its state and Escape returns focus to the trigger', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This disclosure replaces the desktop navigation only.');
  await page.goto('/#/home');
  const trigger = page.locator('#hamburger');
  const navigation = page.locator('#mainNav');
  await expect(trigger).toHaveAttribute('aria-controls', 'mainNav');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toHaveClass(/open/);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await navigation.locator('a[href="#/herbs"]').click();
  await expect(page).toHaveURL(/#\/herbs$/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
