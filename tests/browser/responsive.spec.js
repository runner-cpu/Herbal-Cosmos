import { test, expect } from '@playwright/test';

test('mobile atlas keeps touch canvas and context controls reachable', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#heroCanvas')).toBeVisible();
  await page.goto('/#/herbs');
  await expect(page.locator('#herbMobileGrid')).toBeAttached();
  await expect(page.locator('#globalSearch')).toBeVisible();
});

test('three themes expose a visible theme control', async ({ page }) => {
  await page.goto('/#/home');
  const button = page.locator('#themeToggle');
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic');
});
