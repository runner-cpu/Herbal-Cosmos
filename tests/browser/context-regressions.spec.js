import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

async function navigateFromHeader(page, route) {
  const link = page.locator('#mainNav [data-route-link="' + route + '"]');
  if (!(await link.isVisible())) await page.locator('#hamburger').click();
  await link.click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', route);
}

async function expectNoContext(page) {
  await expect(page.locator('#herbContext')).toBeHidden();
  await expect(page.locator('#herbContext .context-inner')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => {
    const height = document.querySelector('header').getBoundingClientRect().height;
    const shell = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--shell-height'));
    return Math.abs(shell - height);
  })).toBeLessThan(1);
}

test('ordinary navigation removes the knowledge-card context instead of carrying a stale selection rail', async ({ page }) => {
  for (const route of ['intro', 'home', 'herbs', 'qiwei', 'formula', 'heritage', 'learn']) {
    await page.goto('/#/herb?id=gancao');
    await expect(page.locator('#herbContext')).toContainText('甘草');
    await navigateFromHeader(page, route);
    await expectNoContext(page);
  }
});

test('a linked star or chart selection keeps its herb context without displaying the knowledge-card rail', async ({ page }) => {
  for (const [label, route] of [['星图定位', 'home'], ['性味归经', 'qiwei'], ['配伍网络', 'formula']]) {
    await page.goto('/#/herb?id=gancao');
    await page.locator('#herbContext .context-links a').filter({ hasText: label }).click();
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', route);
    await expect(page).toHaveURL(/(?:id|herb)=gancao/);
    await expectNoContext(page);
    expect(await page.evaluate(() => store.selectedHerb?.id)).toBe('gancao');
    await page.evaluate(() => window.HerbalTheme.setTheme('night'));
    await expectNoContext(page);
  }
});

test('closing a knowledge-card context clears its controls and releases the sticky space', async ({ page }) => {
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbContext')).toBeVisible();
  await page.locator('#herbContext .context-close').click();
  await expectNoContext(page);
});

test('a dismissed knowledge-card context stays closed through theme redraws and reopens on a later visit', async ({ page }) => {
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbQiweiChart canvas')).toBeVisible();
  await page.locator('#herbContext .context-close').click();
  await expectNoContext(page);
  for (const theme of ['night', 'ink', 'day']) {
    await page.evaluate(value => window.HerbalTheme.setTheme(value), theme);
    await expectNoContext(page);
  }
  await navigateFromHeader(page, 'home');
  await page.goBack();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'herb');
  await expect(page.locator('#herbContext')).toBeVisible();
  await expect(page.locator('#herbContext')).toContainText('甘草');
});

test('an invalid knowledge-card route cannot retain the previous herb identity', async ({ page }) => {
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbContext')).toContainText('甘草');
  await page.evaluate(() => { location.hash = '#/herb?id=missing-record'; });
  await expect(page.locator('#herbDetailHead')).toContainText('未找到');
  await expectNoContext(page);
});

async function reachableCenter(locator) {
  return locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { x, y, reachable: hit === element || element.contains(hit), hit: hit?.id || hit?.className?.baseVal || hit?.className || hit?.tagName };
  });
}

for (const [width, height] of [[1440, 900], [375, 812], [320, 700]]) {
  test(width + 'px knowledge-card favorites stay clickable after reading and synchronize the badge and drawer', async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.addInitScript(() => localStorage.removeItem('herbal_favs'));
    await page.goto('/#/intro');
    await page.locator('#globalSearch').fill('枸杞子');
    await page.locator('#searchResults a[href="#/herb?id=gouqi"]').click();
    await expect(page.locator('#herbDetailHead h1')).toHaveText('枸杞子');
    await expect(page.locator('#herbQiweiChart canvas')).toBeVisible();
    const favorite = page.locator('#herbDetailHead [data-fav="gouqi"]');
    for (const block of ['start', 'center', 'auto']) {
      await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
      if (block === 'auto') await favorite.scrollIntoViewIfNeeded();
      else await favorite.evaluate((element, value) => element.scrollIntoView({ block: value, behavior: 'instant' }), block);
      const point = await reachableCenter(favorite);
      expect(point.reachable, block + ' center intercepted by ' + point.hit).toBe(true);
    }
    const box = await favorite.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    const point = await reachableCenter(favorite);
    await page.mouse.click(point.x, point.y);
    await expect(page.locator('[data-saved-count]')).toHaveText('1');
    await expect(favorite).toHaveAttribute('aria-label', '取消收藏枸杞子');

    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
    const trigger = await reachableCenter(page.locator('#savedDrawerToggle'));
    expect(trigger.reachable, 'header favorite intercepted by ' + trigger.hit).toBe(true);
    await page.mouse.click(trigger.x, trigger.y);
    await expect(page.locator('#savedDrawer [data-drawer-fav="gouqi"]')).toBeVisible();
    const close = await reachableCenter(page.locator('#savedDrawer [data-saved-close]'));
    expect(close.reachable, 'drawer close intercepted by ' + close.hit).toBe(true);
    await page.mouse.click(close.x, close.y);
    await expect(page.locator('#savedDrawer')).toBeHidden();

    const badge = await reachableCenter(page.locator('#savedDrawerToggle b'));
    expect(badge.reachable, 'badge intercepted by ' + badge.hit).toBe(true);
    await page.mouse.click(badge.x, badge.y);
    const remove = page.locator('#savedDrawer [data-drawer-fav="gouqi"]');
    await expect(remove).toBeVisible();
    const removal = await reachableCenter(remove);
    expect(removal.reachable, 'drawer favorite intercepted by ' + removal.hit).toBe(true);
    await page.mouse.click(removal.x, removal.y);
    await expect(page.locator('[data-saved-count]')).toHaveText('0');
    await expect(favorite).toHaveAttribute('aria-label', '收藏枸杞子');
    await expect(page.locator('#savedDrawer [data-drawer-fav]')).toHaveCount(0);
  });
}

test('drawer removal also updates knowledge-card favorites when local storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('storage unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('storage unavailable'); };
  });
  await page.goto('/#/herb?id=gouqi');
  const favorite = page.locator('#herbDetailHead [data-fav="gouqi"]');
  await favorite.click();
  await expect(page.locator('[data-saved-count]')).toHaveText('1');
  await page.locator('#savedDrawerToggle').click();
  await page.locator('#savedDrawer [data-drawer-fav="gouqi"]').click();
  await expect(page.locator('[data-saved-count]')).toHaveText('0');
  await expect(favorite).toHaveAttribute('aria-label', '收藏枸杞子');
  await page.keyboard.press('Escape');
  await favorite.click();
  await expect(page.locator('[data-saved-count]')).toHaveText('1');
});
