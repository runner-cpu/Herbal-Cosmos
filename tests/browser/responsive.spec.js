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

test('375px routes do not create document or chart overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['home', 'herbs', 'qiwei', 'formula', 'zheng', 'learn']) {
    await page.goto('/#/' + route);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', route);
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      offenders: [...document.querySelectorAll('.page.active *')].map(element => {
        const rect = element.getBoundingClientRect();
        return {
          element: element.tagName.toLowerCase() + (element.id ? '#' + element.id : '') + (element.classList.length ? '.' + [...element.classList].join('.') : ''),
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          scrollWidth: element.scrollWidth
        };
      }).filter(item => item.width > document.documentElement.clientWidth + 1 || item.right > document.documentElement.clientWidth + 1).sort((a, b) => b.right - a.right).slice(0, 8)
    }));
    expect(widths.scroll, route + ' document width; offenders=' + JSON.stringify(widths.offenders)).toBeLessThanOrEqual(widths.client + 1);
    const canvases = page.locator('.page.active canvas:visible');
    for (let index = 0; index < await canvases.count(); index += 1) {
      const box = await canvases.nth(index).boundingBox();
      if (box) expect(box.width, route + ' canvas width').toBeLessThanOrEqual(widths.client + 1);
    }
  }
});

test('375px shell controls meet the minimum touch target', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/home');
  for (const selector of ['#savedDrawerToggle', '#hamburger']) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.width, selector + ' width').toBeGreaterThanOrEqual(44);
    expect(box?.height, selector + ' height').toBeGreaterThanOrEqual(44);
  }
});
