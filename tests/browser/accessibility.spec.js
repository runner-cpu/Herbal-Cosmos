import { test, expect } from '@playwright/test';

test('keyboard focus and reduced motion preference remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/home');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbContext')).toBeAttached();
});
