import { test, expect } from '@playwright/test';

test('mobile atlas keeps touch canvas and context controls reachable', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#heroCanvas')).toBeVisible();
  await page.goto('/#/herbs');
  await expect(page.locator('#herbMobileGrid')).toBeAttached();
  await expect(page.locator('#globalSearch')).toBeVisible();
});

test('theme control toggles between day and night', async ({ page }) => {
  await page.goto('/#/home');
  const button = page.locator('#themeToggle');
  await expect(button).toBeVisible();
  await expect(button.locator('[data-theme-label]')).toHaveText('夜读');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await expect(button.locator('[data-theme-label]')).toHaveText('日间');
  await expect(button).toHaveAttribute('aria-label', '切换到日间主题');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');
  await expect(button.locator('[data-theme-label]')).toHaveText('夜读');
});

test('homepage exposes audited dataset counts and all official food-directory entries', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('[data-food-count]').first()).toHaveText('106');
  const cards=await page.evaluate(()=>window.HERBS.filter(h=>!['formula-material','directory-only'].includes(h.kind)).length);
  expect(cards).toBe(902);
  await expect(page.locator('[data-featured-count]').first()).toHaveText(cards.toLocaleString('zh-CN'));
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

test('320px shell and core routes stay within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const route of ['home', 'herbs', 'qiwei', 'formula', 'learn']) {
    await page.goto('/#/' + route);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route + ' overflow').toBeLessThanOrEqual(321);
  }
});

test('herb context bar stays a horizontal rail on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbContext .context-links a')).toHaveCount(4);
  await page.goto('/#/home');
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'home');
  const layout = await page.evaluate(() => {
    const links = document.querySelector('#herbContext .context-links');
    const [a, b] = links.querySelectorAll('a');
    return {
      direction: getComputedStyle(links).flexDirection,
      sameRow: Math.abs(a.getBoundingClientRect().top - b.getBoundingClientRect().top) < 2,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  expect(layout.direction).toBe('row');
  expect(layout.sameRow).toBe(true);
  expect(layout.overflow).toBeLessThanOrEqual(1);
});

test('375px routes do not create document or chart overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['home', 'herbs', 'qiwei', 'formula']) {
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
          scrollWidth: element.scrollWidth,
          containedInScroller: Boolean(element.closest('.home-food-strip,.home-categories,#homeFeatured,.formula-index-list,.syndrome-list'))
        };
      }).filter(item => !item.containedInScroller && (item.width > document.documentElement.clientWidth + 1 || item.right > document.documentElement.clientWidth + 1)).sort((a, b) => b.right - a.right).slice(0, 8)
    }));
    expect(widths.scroll, route + ' document width; offenders=' + JSON.stringify(widths.offenders)).toBeLessThanOrEqual(widths.client + 1);
    const canvases = page.locator('.page.active canvas:visible');
    for (let index = 0; index < await canvases.count(); index += 1) {
      const box = await canvases.nth(index).boundingBox();
      if (box) expect(box.width, route + ' canvas width').toBeLessThanOrEqual(widths.client + 1);
    }
  }
});

test('desktop homepage keeps the featured grid within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/home');
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    featured: document.querySelector('#homeFeatured')?.scrollWidth || 0
  }));
  expect(widths.scroll, 'desktop document overflow; featured=' + widths.featured).toBeLessThanOrEqual(widths.client + 1);
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

test('375px consolidated formula views keep the switch usable and within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/formula');
  const buttons = page.locator('.formula-view-switch button');
  await expect(buttons).toHaveCount(2);
  for (let index = 0; index < await buttons.count(); index += 1) {
    const box = await buttons.nth(index).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await buttons.nth(1).click();
  await expect(page.locator('#formulaZhengView')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(376);
});
