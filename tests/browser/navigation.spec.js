import { test, expect } from '@playwright/test';

async function openPrimaryNavigation(page) {
  const hamburger = page.locator('#hamburger');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await expect(page.locator('#mainNav')).toHaveClass(/open/);
  }
}

test('primary navigation exposes three exhibition entries and an auxiliary personal tool', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#mainNav > a')).toHaveCount(3);
  await openPrimaryNavigation(page);
  await expect(page.locator('.nav-more')).toHaveCount(0);
  for (const route of ['home', 'exhibit', 'herbs']) {
    await expect(page.locator('#mainNav [data-route-link="' + route + '"]')).toBeVisible();
  }
});

test('learning lab is a standalone route and legacy syndrome routes stay consolidated', async ({ page }) => {
  await page.goto('/#/learn?step=2');
  await expect(page.locator('[data-route="learn"]')).toBeVisible();
  await expect(page.locator('#quizCard .quiz-q')).toBeVisible();
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

test('route titles describe the active Chinese view', async ({ page }) => {
  const cases = [
    ['intro', '漫游星海 · 本草宇宙'],
    ['herbs?section=classics', '典籍时间线 · 本草图鉴 · 本草宇宙'],
    ['exhibit', '文化长卷 · 本草宇宙'],
    ['home', '漫游星海 · 本草宇宙'],
    ['herbs', '本草图鉴 · 本草宇宙'],
    ['herb?id=gancao', '甘草 · 本草宇宙'],
    ['qiwei', '属性统计 · 本草图鉴 · 本草宇宙'],
    ['formula', '方剂档案 · 本草图鉴 · 本草宇宙'],
    ['formula?view=zheng', '证候药链 · 本草图鉴 · 本草宇宙'],
    ['heritage', '文化长卷 · 本草宇宙'],
    ['heritage?anchor=heritage-food', '文化档案 · 本草图鉴 · 本草宇宙'],
    ['learn', '我的本草 · 本草宇宙'],
    ['route-that-does-not-exist', '路径未收录 · 本草宇宙']
  ];
  for (const [hash, title] of cases) {
    await page.goto('/#/' + hash);
    await expect(page).toHaveTitle(title);
  }
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

test('each archive view has one navigation owner and the brand returns to the star sea', async ({ page }) => {
  await page.goto('/#/home');
  await openPrimaryNavigation(page);
  await page.locator('.brand').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'home');
  await expect(page.locator('#mainNav [aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('[data-route-link="home"]')).toHaveAttribute('aria-current', 'page');

  await page.goto('/#/learn');
  await expect(page.locator('[data-route-link="learn"]')).toHaveAttribute('aria-current', 'page');

  await page.goto('/#/formula?view=zheng');
  await expect(page.locator('#mainNav [aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('[data-route-link="herbs"]')).toHaveAttribute('aria-current', 'page');
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
