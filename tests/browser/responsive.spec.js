import { test, expect } from '@playwright/test';

test('mobile atlas keeps touch canvas and context controls reachable', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#heroCanvas')).toBeVisible();
  await page.goto('/#/herbs');
  await expect(page.locator('#herbMobileGrid')).toBeAttached();
  await expect(page.locator('#globalSearch')).toBeVisible();
});

test('theme control names the next theme in the three-theme cycle', async ({ page }) => {
  await page.goto('/#/home');
  const button = page.locator('#themeToggle');
  await expect(button).toBeVisible();
  await expect(button.locator('[data-theme-label]')).toHaveText('夜读');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await expect(button.locator('[data-theme-label]')).toHaveText('古籍');
  await expect(button).toHaveAttribute('aria-label', '切换到古籍主题');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic');
  await expect(button.locator('[data-theme-label]')).toHaveText('日间');
  await expect(button).toHaveAttribute('aria-label', '切换到日间主题');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');
  await expect(button.locator('[data-theme-label]')).toHaveText('夜读');
});

test('homepage exposes audited dataset counts and all official food-directory entries', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('[data-food-count]').first()).toHaveText('106');
  await expect(page.locator('[data-featured-count]').first()).toHaveText(/^(60[0-9]|[1-9][0-9]{3,})$/);
  await expect(page.locator('[data-catalog-count]').first()).toHaveText(/^8,818$/);
  await page.locator('#homeFoodExpand').click();
  await expect(page.locator('#homeFoodStrip .home-food-card')).toHaveCount(106);
});

test('favorite action keeps navigation badge and drawer in sync', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('herbal_favs'));
  await page.goto('/#/herbs');
  await page.locator('[data-fav]:visible').first().click();
  await expect(page.locator('[data-saved-count]')).toHaveText('1');
  await page.locator('#savedDrawerToggle').click();
  await expect(page.locator('#savedDrawer [data-drawer-fav]')).toHaveCount(1);
  await page.locator('#savedDrawer [data-drawer-fav]').click();
  await expect(page.locator('[data-saved-count]')).toHaveText('0');
});
