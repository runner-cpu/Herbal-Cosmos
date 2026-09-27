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

test('desktop herb rows expose a native keyboard link to the knowledge card', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The desktop table is intentionally replaced by mobile cards.');
  await page.goto('/#/herbs');
  const link = page.locator('#herbTableBody .rowname a').first();
  await expect(link).toBeVisible();
  const destination = await link.getAttribute('href');
  expect(destination).toMatch(/^#\/herb\?id=/);

  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
});

test('related formulas expose a native keyboard link to the network view', async ({ page }) => {
  await page.goto('/#/herb?id=gancao');
  const link = page.locator('#herbFormulaList a.formula-row').first();
  await expect(link).toBeVisible();
  const destination = await link.getAttribute('href');
  expect(destination).toMatch(/^#\/formula\?f=/);

  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
});
