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
  await page.goto('/#/formula?view=zheng');
  await expect(page.getByLabel('搜索证候', { exact: true })).toBeVisible();
});

test('the favorites toggle opens the drawer without changing routes', async ({ page }) => {
  await page.goto('/#/home');
  const locationBefore = page.url();
  await page.locator('#savedDrawerToggle').click();
  await expect(page.locator('#savedDrawer')).toHaveClass(/is-open/);
  await expect(page).toHaveURL(locationBefore);
  await expect(page.locator('[data-route="saved"]')).toHaveCount(0);
});

test('home route actions remain native keyboard links', async ({ page }) => {
  await page.goto('/#/home');
  const destinations = new Map([
    ['探索星图', '#/herbs'],
    ['进入配伍网络', '#/formula']
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

test('home chapter rail follows the consolidated reading path', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('[data-home-chapter-current]')).toHaveText('本草档案');
  await page.locator('[data-home-chapter="home-food"]').click();
  await expect(page).toHaveURL(/#\/home\?anchor=home-food$/);
  await expect(page.locator('[data-home-chapter-current]')).toHaveText('食养同源');
  await expect(page.locator('[data-home-chapter-progress]')).toHaveText('3 / 5');
  await expect(page.locator('[data-home-chapter="home-food"]')).toHaveAttribute('aria-current', 'location');
});

test('favorites drawer is modal and traps focus', async ({ page }, testInfo) => {
  await page.goto('/#/home');
  const trigger = page.locator('#savedDrawerToggle');
  await trigger.click();
  const drawer = page.locator('#savedDrawer');
  await expect(drawer).toHaveAttribute('role', 'dialog');
  await expect(drawer).toHaveAttribute('aria-modal', 'true');
  await expect(page.locator('#savedDrawerBackdrop')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/saved-drawer-open/);

  const focusable = drawer.locator('a[href],button:not([disabled])');
  await page.keyboard.press('Shift+Tab');
  await expect(focusable.last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(focusable.first()).toBeFocused();

  if (testInfo.project.name !== 'mobile') {
    // 移动端抽屉全宽铺开，背景层不可指针到达；Escape 路径已单独覆盖。
    await page.locator('#savedDrawerBackdrop').click({ position: { x: 4, y: 4 } });
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('#savedDrawerBackdrop')).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/saved-drawer-open/);
  if (testInfo.project.name !== 'mobile') await expect(trigger).toBeFocused();
});

test('favorites drawer closes with Escape and returns focus', async ({ page }) => {
  await page.goto('/#/home');
  const trigger = page.locator('#savedDrawerToggle');
  await trigger.click();
  await expect(page.locator('#savedDrawer')).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Escape');
  await expect(page.locator('#savedDrawer')).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();
});

test('classic timeline entries open their native dialog from the keyboard', async ({ page }) => {
  await page.goto('/#/home');
  const entry = page.locator('#homeClassicTimeline .cl-item').first();
  await expect(entry).toHaveAttribute('tabindex', '0');
  await entry.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('#classicDetail');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.classic-detail-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(entry).toBeFocused();
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
