import { test, expect } from '@playwright/test';

test('keyboard focus and reduced motion preference remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/home');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbContext')).toBeAttached();
});

test('forced colors keeps shell controls and panels distinguishable', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/#/home');
  const toggle = page.locator('#savedDrawerToggle');
  await expect(toggle).toBeVisible();
  await toggle.focus();
  await expect(toggle).toBeFocused();
  await toggle.click();
  const drawer = page.locator('#savedDrawer');
  await expect(drawer).toHaveClass(/is-open/);
  await expect(drawer).toHaveCSS('box-shadow', 'none');
  await expect(drawer).toHaveCSS('border-top-style', 'solid');
  await expect(toggle).toHaveCSS('forced-color-adjust', 'auto');
});
