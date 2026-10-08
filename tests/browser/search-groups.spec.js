import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('search separates knowledge cards from name-only matches without losing aliases', async ({ page }) => {
  await page.goto('/#/intro');
  await page.locator('#globalSearch').fill('枸杞');
  await expect.poll(() => page.evaluate(() => HERB_CATALOG.length)).toBe(8818);
  const results = page.locator('#searchResults');
  const cards = results.getByRole('group', { name: '知识卡', exact: true });
  const names = results.getByRole('group', { name: '名称索引', exact: true });
  await expect(cards.locator('a[href="#/herb?id=gouqi"]')).toContainText('枸杞子');
  await expect(names.getByRole('option', { name: /枸杞 仅名称/ })).toBeVisible();
  await expect(names).toContainText('仅名称 · 无药性');
  expect(await results.locator('[role="option"][href*="/herb?"]').evaluateAll(options => options.every(option => {
    const id = new URLSearchParams(option.getAttribute('href').split('?')[1]).get('id');
    return !['formula-material', 'directory-only'].includes(HERBS.find(herb => herb.id === id)?.kind);
  }))).toBe(true);
  expect(await results.locator('[role="group"]').evaluateAll(groups => groups.map(group => group.getAttribute('aria-label')))).toEqual(['知识卡', '名称索引']);
  await page.locator('#globalSearch').fill('公丁香');
  await expect(cards.getByRole('option', { name: '丁香 知识卡 · 温 · 辛' })).toBeVisible();
});

test('search keyboard navigation skips group labels and opens the name index', async ({ page }) => {
  await page.goto('/#/intro');
  const input = page.locator('#globalSearch');
  await input.fill('枸杞');
  await expect.poll(() => page.evaluate(() => HERB_CATALOG.length)).toBe(8818);
  const options = page.locator('#searchResults [role="option"]');
  const targetIndex = await options.evaluateAll(rows => rows.findIndex(row => row.classList.contains('catalog-result') && row.querySelector('strong').textContent === '枸杞'));
  expect(targetIndex).toBeGreaterThan(0);
  for (let index = 0; index <= targetIndex; index++) {
    await input.press('ArrowDown');
    const activeId = await input.getAttribute('aria-activedescendant');
    await expect(page.locator('#' + activeId)).toHaveAttribute('role', 'option');
  }
  await input.press('Enter');
  await expect(page).toHaveURL(/#\/herbs\?mode=catalog&q=/);
  await expect(page.locator('#catalogSearch')).toHaveValue('枸杞');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
});

test('a name-only Enter match opens the index rather than an auxiliary herb card', async ({ page }) => {
  await page.goto('/#/intro');
  const input = page.locator('#globalSearch');
  await input.fill('枸杞叶');
  await expect(page.locator('#searchResults .catalog-result')).toContainText('枸杞叶');
  await input.press('Enter');
  await expect(page).toHaveURL(/#\/herbs\?mode=catalog&q=/);
  await expect(page.locator('#catalogSearch')).toHaveValue('枸杞叶');
});

test('mobile search leaves the input reachable above a viewport-bounded suggestion list', async ({ page }) => {
  for (const [width, height] of [[320, 700], [375, 812], [375, 400]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/#/intro');
    const input = page.locator('#globalSearch');
    await input.fill('枸杞');
    await expect(page.locator('#searchResults [role="option"]').first()).toBeVisible();
    const layout = await page.evaluate(() => {
      const input = document.getElementById('globalSearch'), results = document.getElementById('searchResults');
      const i = input.getBoundingClientRect(), r = results.getBoundingClientRect();
      return {
        inputReachable: document.elementFromPoint(i.left + i.width / 2, i.top + i.height / 2) === input,
        belowHeader: r.top >= document.querySelector('header').getBoundingClientRect().bottom,
        withinViewport: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight
      };
    });
    expect(layout, width + 'x' + height).toEqual({ inputReachable: true, belowHeader: true, withinViewport: true });
    await input.press('End');
    await input.press('Backspace');
    await expect(input).toHaveValue('枸');
  }
});

for (const action of ['navigate', 'escape']) {
  test('late name-index loading respects a search closed by ' + action, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route('**/data/catalog/chunk-*.js', async route => {
      await gate;
      if (action === 'escape') await route.abort();
      else await route.continue();
    });
    await page.goto('/#/intro');
    const input = page.locator('#globalSearch');
    await input.fill('枸杞子');
    await expect(page.locator('#searchResults a[href="#/herb?id=gouqi"]')).toBeVisible();
    await expect(input).toHaveAttribute('aria-busy', 'true');
    try {
      if (action === 'navigate') {
        await page.locator('#searchResults a[href="#/herb?id=gouqi"]').click();
        await expect(page).toHaveURL(/#\/herb\?id=gouqi/);
      } else {
        await input.press('Escape');
        await expect(input).toBeFocused();
      }
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    } finally {
      release();
    }
    await expect(input).toHaveAttribute('aria-busy', 'false');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#searchResults')).toBeHidden();
    if (action === 'navigate') {
      const favorite = page.locator('#herbDetailHead [data-fav="gouqi"]');
      await favorite.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const hit = await favorite.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
        return { x, y, reachable: element.contains(document.elementFromPoint(x, y)) };
      });
      expect(hit.reachable).toBe(true);
      await page.mouse.click(hit.x, hit.y);
      await expect(page.locator('[data-saved-count]')).toHaveText('1');
    }
  });
}
