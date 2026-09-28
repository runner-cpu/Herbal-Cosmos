import { test, expect } from '@playwright/test';

test('rendered charts have readable names and generated evidence summaries', async ({ page }) => {
  await page.goto('/#/qiwei');

  const charts = page.locator('.page.active .chart-box');
  await expect.poll(() => charts.count()).toBeGreaterThan(0);
  for (let index = 0; index < await charts.count(); index += 1) {
    const chart = charts.nth(index);
    await expect(chart).toHaveAttribute('role', 'img');
    await expect(chart).toHaveAttribute('aria-label', /\S+/);
    const canvases = chart.locator('canvas');
    for (let canvasIndex = 0; canvasIndex < await canvases.count(); canvasIndex += 1) {
      await expect(canvases.nth(canvasIndex)).toHaveAttribute('aria-hidden', 'true');
      await expect(canvases.nth(canvasIndex)).toHaveAttribute('tabindex', '-1');
    }
  }

  await page.goto('/#/formula');
  const summaries = page.locator('.page.active .chart-summary');
  await expect.poll(() => summaries.count()).toBeGreaterThanOrEqual(4);
  await expect(summaries.first()).toContainText(/样本|方剂|药材/);
  await summaries.first().locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(summaries.first()).toHaveAttribute('open', '');
  await expect(summaries.first().locator('li').first()).toContainText(/\S+/);
  const evidenceLink = page.locator('.page.active .chart-evidence a').first();
  await evidenceLink.focus();
  await expect(evidenceLink).toBeFocused();
});

test('catalog completeness matrix exposes a keyboard-accessible evidence path', async ({ page }) => {
  await page.goto('/#/herbs');
  await expect(page.locator('#factCompletenessChart canvas')).toBeVisible();
  await expect(page.locator('#factCompletenessChart')).toHaveAttribute('role', 'img');
  await expect(page.locator('#factCompletenessChart')).toHaveAttribute('aria-label', /资料|覆盖/);
  const access = page.locator('#factCompletenessAccess select');
  await expect(access).toBeVisible();
  await access.selectOption({ index: 1 });
  await expect(page.locator('#factCompletenessEvidence .evidence-links a').first()).toBeVisible();
});
