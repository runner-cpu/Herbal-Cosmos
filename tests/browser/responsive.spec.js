import { test, expect } from '@playwright/test';

test('mobile atlas keeps touch canvas and context controls reachable', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#heroCanvas')).toBeVisible();
  await page.goto('/#/herbs');
  await expect(page.locator('#herbMobileGrid')).toBeAttached();
  await expect(page.locator('#globalSearch')).toBeVisible();
});

test('theme control cycles day, night and ink with an accessible next-action label', async ({ page }) => {
  await page.goto('/#/home');
  const button = page.locator('#themeToggle');
  await expect(button).toBeVisible();
  await expect(button.locator('[data-theme-label]')).toHaveText('夜读');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await expect(button.locator('[data-theme-label]')).toHaveText('古籍');
  await expect(button).toHaveAttribute('aria-label', '切换到古籍主题');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'ink');
  await expect(button.locator('[data-theme-label]')).toHaveText('日间');
  await expect(button).toHaveAttribute('aria-label', '切换到日间主题');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'day');
  await expect(button.locator('[data-theme-label]')).toHaveText('夜读');
});

test('collection ledger exposes audited counts and the heritage directory keeps all food entries reachable', async ({ page }) => {
  await page.goto('/#/home');
  const cards=await page.evaluate(()=>window.HERBS.filter(h=>!['formula-material','directory-only'].includes(h.kind)).length);
  expect(cards).toBe(902);
  await expect(page.locator('[data-featured-count]').first()).toHaveText(cards.toLocaleString('zh-CN'));
  await expect(page.locator('[data-catalog-count]').first()).toHaveText(/^8,818$/);
  await page.goto('/#/heritage?anchor=heritage-food');
  await expect(page.locator('[data-route="heritage"]')).toBeVisible();
  await expect(page.locator('#heritage-food')).toContainText('106');
  await expect(page.locator('#heritageFoodStatus')).toContainText('找到 106 条');
  await expect(page.locator('#heritageFoodGrid .culture-food-card')).toHaveCount(12);
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
  for (const route of ['intro', 'home', 'herbs', 'qiwei', 'formula', 'heritage', 'learn']) {
    await page.goto('/#/' + route);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', route==='intro'?'home':route==='heritage'?'exhibit':route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route + ' overflow').toBeLessThanOrEqual(321);
  }
});

test('star map controls and legend stay inside 320px and 375px', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/#/home');
    if (!await page.locator('.cosmos-settings').evaluate(el => el.open)) await page.locator('[data-cosmos-collapse]').click();
    await expect(page.locator('#cosmosControls')).toBeVisible();
    const measured = await page.evaluate(() => {
      const doc = document.documentElement;
      const controls = document.getElementById('cosmosControls');
      const rect = controls.getBoundingClientRect();
      return { overflow: doc.scrollWidth - doc.clientWidth, left: Math.round(rect.left), right: Math.round(rect.right), client: doc.clientWidth };
    });
    expect(measured.overflow, width + 'px document overflow; ' + JSON.stringify(measured)).toBeLessThanOrEqual(1);
    expect(measured.left, width + 'px controls left edge; ' + JSON.stringify(measured)).toBeGreaterThanOrEqual(0);
    expect(measured.right, width + 'px controls right edge; ' + JSON.stringify(measured)).toBeLessThanOrEqual(measured.client + 1);

    await page.locator('#cosmosControls [data-cosmos-reading="geography"]').click();
    await expect(page.locator('#cosmosReadingLegend')).toBeVisible();
    const legend = await page.evaluate(() => {
      const doc = document.documentElement;
      const box = document.getElementById('cosmosReadingLegend').getBoundingClientRect();
      return { overflow: doc.scrollWidth - doc.clientWidth, right: Math.round(box.right), client: doc.clientWidth };
    });
    expect(legend.overflow, width + 'px legend overflow; ' + JSON.stringify(legend)).toBeLessThanOrEqual(1);
    expect(legend.right, width + 'px legend right edge; ' + JSON.stringify(legend)).toBeLessThanOrEqual(legend.client + 1);
  }
});

test('herb context bar stays a horizontal rail on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/herb?id=gancao');
  await expect(page.locator('#herbContext .context-links a')).toHaveCount(4);
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
  await page.goto('/#/home');
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'home');
  await expect(page.locator('#herbContext')).toBeHidden();
  await expect(page.locator('#herbContext .context-links a')).toHaveCount(0);
});

test('375px routes do not create document or chart overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['intro', 'home', 'herbs', 'qiwei', 'formula', 'heritage']) {
    await page.goto('/#/' + route);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', route==='intro'?'home':route==='heritage'?'exhibit':route);
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
  for (const selector of ['#savedDrawerToggle', '#themeToggle', '#hamburger']) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.width, selector + ' width').toBeGreaterThanOrEqual(44);
    expect(box?.height, selector + ' height').toBeGreaterThanOrEqual(44);
  }
});

test('375px consolidated formula views keep the switch usable and within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/formula');
  const buttons = page.locator('.formula-view-switch button');
  await expect(buttons).toHaveCount(4);
  for (let index = 0; index < await buttons.count(); index += 1) {
    const box = await buttons.nth(index).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await page.locator('[data-formula-view="zheng"]').click();
  await expect(page.locator('#formulaZhengView')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(376);
});
