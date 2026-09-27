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

test('syndrome filtering exposes an explicit accessible name', async ({ page }) => {
  await page.goto('/#/zheng');
  await expect(page.getByLabel('搜索证候', { exact: true })).toBeVisible();
});

test('the learning journey opens favorites as a drawer without changing routes', async ({ page }) => {
  await page.goto('/#/home');
  const locationBefore = page.url();
  await page.getByRole('button', { name: '查看收藏' }).click();
  await expect(page.locator('#savedDrawer')).toHaveClass(/is-open/);
  await expect(page).toHaveURL(locationBefore);
  await expect(page.locator('[data-route="saved"]')).toHaveCount(0);
});

test('home route actions remain native keyboard links', async ({ page }) => {
  await page.goto('/#/home');
  const destinations = new Map([
    ['探索星图', '#/herbs'],
    ['进入配伍网络', '#/formula'],
    ['开始今日学习', '#/learn']
  ]);
  for (const [name, href] of destinations) {
    await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }
  await page.getByRole('link', { name: '探索星图', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp('#/herbs$'));
});

test('legacy saved links recover to the home route and open the drawer', async ({ page }) => {
  await page.goto('/#/saved');
  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.locator('[data-route="home"]')).toBeVisible();
  await expect(page.locator('#savedDrawer')).toHaveClass(/is-open/);
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
