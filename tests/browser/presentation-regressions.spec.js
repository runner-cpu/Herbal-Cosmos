import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('collection counts survive theme changes during and after count animation', async ({ page }) => {
  await page.goto('/#/home');
  const expected = await page.evaluate(() => [HERBS.filter(herb => !['directory-only','formula-material'].includes(herb.kind)).length, HERB_CATALOG_MANIFEST.approvedCount, FORMULAS.length, HERBAL_DATA_COVERAGE.imageBacked].map(value => value.toLocaleString('zh-CN')));
  await page.evaluate(() => window.HerbalTheme.setTheme('night'));
  await expect(page.locator('#homeKpis strong')).toHaveText(expected);
  await page.evaluate(() => window.HerbalTheme.setTheme('day'));
  await expect(page.locator('#homeKpis strong')).toHaveText(expected);
  await page.goto('/#/herbs');
  await page.locator('.brand').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'home');
  await expect(page.locator('#homeKpis strong')).toHaveText(expected);
  await page.evaluate(() => window.scrollTo(0, 1000));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(1000);
  await page.evaluate(() => window.HerbalTheme.setTheme('night'));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(1000);
});

test('night panels use dark surfaces and readable text', async ({ page }) => {
  await page.goto('/#/home');
  await page.evaluate(() => window.HerbalTheme.setTheme('night'));
  const surfaces = await page.locator('.home-kpis,.home-coverage,.classic-timeline.compact,footer').evaluateAll(elements => elements.map(el => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.fillStyle = getComputedStyle(el).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    const rgb = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    return { name: el.className, rgb };
  }));
  for (const surface of surfaces) {
    expect(surface.rgb.length, surface.name).toBe(3);
    expect(Math.max(...surface.rgb), surface.name).toBeLessThan(65);
  }
});

test('resource explanation follows the statistics without intersecting them', async ({ page }) => {
  await page.goto('/#/home');
  await page.locator('.evidence-note').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => {
    const stats = document.querySelector('.evidence-rail').getBoundingClientRect();
    const note = document.querySelector('.evidence-note').getBoundingClientRect();
    return note.top - stats.bottom;
  })).toBeGreaterThanOrEqual(12);
});

test('missing photographs have visible labeled thumbnails instead of empty squares', async ({ page }) => {
  await page.goto('/#/herbs?cat=' + encodeURIComponent('温里药'));
  const placeholders = page.locator('.page.active .herb-image-empty:visible');
  await expect(placeholders.first()).toBeVisible();
  await expect(placeholders.first()).toContainText('待补');
  const names = await placeholders.evaluateAll(elements => elements.map(el => ({
    label: el.getAttribute('aria-label'), text: el.textContent.trim()
  })));
  for (const item of names) {
    expect(item.label).toContain('照片待补充');
    expect(item.text.length).toBeGreaterThan(2);
  }
});

test('a failed licensed image recovers to a named placeholder', async ({ page }) => {
  await page.route('**/images/herbs/**', route => route.abort());
  await page.goto('/#/herbs');
  await expect(page.locator('.page.active .herb-image-empty[aria-label*="加载失败"]:visible').first()).toContainText('加载失败');
  expect(await page.locator('.page.active img[data-herb-image]').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).length)).toBe(0);
});

test('formula directory is bounded, searchable and keeps every formula reachable', async ({ page }) => {
  await page.goto('/#/formula');
  await expect(page.locator('#formulaCards .formula-card')).toHaveCount(12);
  await expect(page.locator('#formulaDirectoryCount')).toContainText('100 / 100');
  const first = await page.locator('#formulaCards .formula-card').first().textContent();
  await page.locator('[data-directory-page="2"]').first().click();
  await expect(page.locator('#formulaCards .formula-card').first()).not.toHaveText(first);
  await page.locator('#formulaDirectorySearch').fill('六味地黄丸');
  await expect(page.locator('#formulaCards .formula-card')).toHaveCount(1);
  await page.locator('#formulaCards .formula-card').click();
  await expect(page.locator('#formulaInspector h2')).toHaveText('六味地黄丸');
  await page.locator('#formulaDirectorySearch').fill('不存在的方剂');
  await expect(page.locator('#formulaCards .empty')).toBeVisible();
  await page.locator('#formulaDirectorySearch').fill('');
  await expect(page.locator('#formulaCards .formula-card')).toHaveCount(12);
});

test('syndrome view has one navigation owner and anchors clear both sticky rails', async ({ page }) => {
  await page.goto('/#/formula?view=zheng');
  await expect(page.locator('.nav-more a[href*="view=zheng"]')).toHaveCount(0);
  await expect(page.locator('[data-route-link="formula"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.nav-more summary')).not.toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#formulaZhengView')).toBeVisible();
  await page.goto('/#/herb?id=gancao');
  await page.locator('.brand').click();
  await page.locator('[data-home-chapter="home-classics"]').click();
  await expect.poll(() => page.evaluate(() => {
    const target = document.getElementById('home-classics').getBoundingClientRect();
    const nav = document.querySelector('.home-chapter-nav').getBoundingClientRect();
    return target.top - nav.bottom;
  })).toBeGreaterThanOrEqual(10);
});
