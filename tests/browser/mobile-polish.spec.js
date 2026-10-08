import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 320, height: 700 }, serviceWorkers: 'block' });

test('the night-reading filter reset remains readable and easy to tap', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('herbal_theme', 'night'));
  await page.goto('/#/herbs');
  const reset = page.locator('#resetFilters');
  await expect(reset).toBeVisible();
  const metrics = await reset.evaluate(button => {
    const context = document.createElement('canvas').getContext('2d');
    const luminance = color => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const style = getComputedStyle(button);
    const foreground = luminance(style.color), background = luminance(style.backgroundColor);
    return { contrast: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05), height: button.getBoundingClientRect().height };
  });
  expect(metrics.contrast).toBeGreaterThanOrEqual(4.5);
  expect(metrics.height).toBeGreaterThanOrEqual(44);
});

test('mobile formula controls retain whole labels and switch all four reading views', async ({ page }) => {
  await page.goto('/#/formula');
  const reset = page.locator('#resetGraph');
  await expect(reset).toBeVisible();
  const resetLines = await reset.evaluate(button => {
    const range = document.createRange();
    range.selectNodeContents(button);
    return range.getClientRects().length;
  });
  expect(resetLines).toBe(1);
  const tabs = page.locator('.formula-view-switch button');
  await expect(tabs).toHaveCount(4);
  for (const tab of await tabs.all()) {
    const metrics = await tab.evaluate(button => {
      const range = document.createRange();
      range.selectNodeContents(button);
      return { lines: range.getClientRects().length, height: button.getBoundingClientRect().height, clipped: button.scrollWidth > button.clientWidth };
    });
    expect(metrics.lines).toBe(1);
    expect(metrics.height).toBeGreaterThanOrEqual(44);
    expect(metrics.clipped).toBe(false);
    await tab.click();
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
  }
  const width = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(width.document).toBeLessThanOrEqual(width.viewport);
});
