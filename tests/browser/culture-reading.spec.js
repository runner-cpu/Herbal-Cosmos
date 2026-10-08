import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('timeline source notes can be opened and closed with the keyboard', async ({ page }) => {
  await page.goto('/#/intro?anchor=intro-timeline');
  const notes = page.locator('.culture-chronicle .culture-classic-source');
  await expect(notes).toHaveCount(7);
  for (const note of await notes.all()) {
    const summary = note.locator('summary');
    const content = note.locator('.culture-classic-source-content');
    await expect(content).toBeHidden();
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(content).toBeVisible();
    await expect(summary).toContainText('收起出处');
    await expect(content.locator('a[href="docs/competition-framework.md"]')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(content).toBeHidden();
  }
});

test('an open timeline source survives theme changes and stays closed after the reader collapses it', async ({ page }) => {
  await page.goto('/#/intro?anchor=intro-timeline');
  const notes = page.locator('.culture-chronicle .culture-classic-source');
  await expect(notes).toHaveCount(7);
  const source = page.locator('.culture-chronicle li').filter({ has: page.getByRole('heading', { name: '《本草纲目》', exact: true }) }).locator('.culture-classic-source');
  await source.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(source.locator('.culture-classic-source-content')).toBeVisible();
  for (const theme of ['night', 'ink', 'day']) {
    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(source.locator('.culture-classic-source-content')).toBeVisible();
    await expect(page.locator('.culture-chronicle .culture-classic-source[open]')).toHaveCount(1);
  }
  await source.locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(source.locator('.culture-classic-source-content')).toBeHidden();
  await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await expect(source.locator('.culture-classic-source-content')).toBeHidden();
  await expect(page.locator('.culture-chronicle .culture-classic-source[open]')).toHaveCount(0);
});

for (const theme of ['day', 'night', 'ink']) {
  for (const width of [320, 375]) {
    test(`expanded timeline sources remain readable in ${theme} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.addInitScript(themeName => localStorage.setItem('herbal_theme', themeName), theme);
      await page.goto('/#/intro?anchor=intro-timeline');
      const notes = page.locator('.culture-chronicle .culture-classic-source');
      await expect(notes).toHaveCount(7);
      for (const note of await notes.all()) await note.locator('summary').click();
      for (const note of await notes.all()) await expect(note.locator('.culture-classic-source-content')).toBeVisible();
      const bencao = page.locator('.culture-chronicle li').filter({ has: page.getByRole('heading', { name: '《本草纲目》', exact: true }) });
      await expect(bencao.locator('.culture-classic-source-content')).toContainText('二级书目');
      await expect(bencao.locator('.culture-classic-source-content a[href="https://en.wikipedia.org/wiki/Compendium_of_Materia_Medica"]')).toBeVisible();
      const pharmacopoeia = page.locator('.culture-chronicle li').filter({ has: page.getByRole('heading', { name: '《中国药典 2020》', exact: true }) });
      await expect(pharmacopoeia.locator('.culture-classic-source-content')).toContainText('历史');
      await expect(pharmacopoeia.locator('.culture-classic-source-content')).toContainText('统计');
      const geometry = await page.evaluate(() => ({
        viewport: innerWidth,
        width: document.documentElement.scrollWidth,
        clipped: [...document.querySelectorAll('.culture-classic-source-content, .culture-classic-source-content a')].filter(element => {
          const bounds = element.getBoundingClientRect();
          return bounds.left < -1 || bounds.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.className)
      }));
      expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.clipped).toEqual([]);
    });
  }
}
