import { test, expect } from '@playwright/test';

test('detail page hides an image when its open-license credit is missing', async ({ page }) => {
  await page.goto('/#/home');

  const herbId = await page.evaluate(() => {
    const herb = HERBS.find((item) => item.image && item.imageCredit);
    if (!herb) throw new Error('No credited runtime image is available for this regression test.');
    herb.imageCredit = null;
    location.hash = `#/herb?id=${encodeURIComponent(herb.id)}`;
    return herb.id;
  });

  await expect.poll(() => new URL(page.url()).hash).toBe(`#/herb?id=${herbId}`);
  await expect(page.locator('#herbDetailHead .herb-image-empty')).toBeVisible();
  await expect(page.locator('#herbDetailHead .image-frame img')).toHaveCount(0);
  await expect(page.locator('#herbDetailHead .image-credit')).toContainText('未通过开放许可校验');
});

test('open-materia detail labels its category as sourced classification, not efficacy', async ({ page }) => {
  await page.goto('/#/home');

  const herbId = await page.evaluate(() => {
    const herb = HERBS.find((item) => item.source === 'openMateria');
    if (!herb) throw new Error('No open-materia card is available for this regression test.');
    location.hash = `#/herb?id=${encodeURIComponent(herb.id)}`;
    return herb.id;
  });

  await expect.poll(() => new URL(page.url()).hash).toBe(`#/herb?id=${herbId}`);
  await expect(page.locator('#herbProps .prop .k', { hasText: '资料分类' })).toHaveCount(1);
  await expect(page.locator('#herbProps .prop .k', { hasText: /^功效$/ })).toHaveCount(0);
});

test('open-materia formula inspector keeps the sourced-classification label', async ({ page }) => {
  await page.goto('/#/home');

  const herbId = await page.evaluate(() => {
    const linkedIds = new Set(FORMULAS.flatMap(formula => formula.herbs.map(entry => entry[0])));
    const herb = HERBS.find(item => item.source === 'openMateria' && linkedIds.has(item.id));
    if (!herb) throw new Error('No linked open-materia card is available for this regression test.');
    location.hash = `#/formula?herb=${encodeURIComponent(herb.id)}`;
    return herb.id;
  });

  await expect.poll(() => new URL(page.url()).hash).toBe(`#/formula?herb=${herbId}`);
  await expect(page.locator('#formulaInspector .inspector-source')).toContainText('资料分类');
  await expect(page.locator('#formulaInspector .inspector-source b', { hasText: /^功效$/ })).toHaveCount(0);
});

test('homepage exposes attribution for its static herb imagery', async ({ page }) => {
  await page.goto('/#/herbs?anchor=home-sources');
  const credits = page.locator('#homeImageCredits');
  await credits.locator('summary').click();
  await expect(credits).toContainText('Nina Filippova');
  await expect(credits).toContainText('Cheng-Tao Lin');
  await expect(credits).toContainText('Urgamal Magsar');
  await expect(credits.locator('a[href="IMAGE_SOURCES_V4.md"]')).toHaveCount(1);
});
