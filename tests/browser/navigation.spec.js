import { test, expect } from '@playwright/test';

async function openPrimaryNavigation(page) {
  const hamburger = page.locator('#hamburger');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await expect(page.locator('#mainNav')).toHaveClass(/open/);
  }
}

test('primary navigation has five entries and More closes accessibly', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#mainNav > a')).toHaveCount(5);
  await openPrimaryNavigation(page);

  const more = page.locator('#navMore');
  const summary = more.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(more).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(more).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();

  await summary.click();
  const viewport = page.viewportSize();
  if (viewport && viewport.width <= 768) await page.mouse.click(4, viewport.height - 4);
  else await page.locator('main').click({ position: { x: 1, y: 1 } });
  await expect(more).not.toHaveAttribute('open', '');
});

test('More reflects the current secondary route and closes after navigation', async ({ page }) => {
  await page.goto('/#/home');
  await openPrimaryNavigation(page);
  const more = page.locator('#navMore');
  await more.locator('summary').click();
  await more.locator('a[href="#/zheng"]').click();
  await expect(page).toHaveURL(/#\/zheng$/);
  await expect(more).not.toHaveAttribute('open', '');
  await expect(more.locator('summary')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-route="zheng"]')).toBeVisible();
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
