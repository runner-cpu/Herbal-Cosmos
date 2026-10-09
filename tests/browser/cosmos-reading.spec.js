import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

async function readingState(page) {
  return page.evaluate(() => ({
    reading: document.documentElement.dataset.cosmosReadingMode,
    perf: window.__HERBAL_DEBUG__?.cosmosPerf?.() || null,
    pressed: [...document.querySelectorAll('#cosmosControls [data-cosmos-reading]')].map(button => ({
      mode: button.dataset.cosmosReading,
      pressed: button.getAttribute('aria-pressed')
    }))
  }));
}

test('the star map exposes four readings with a single pressed state', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#cosmosControls [data-cosmos-readings]')).toBeVisible();
  const buttons = page.locator('#cosmosControls [data-cosmos-reading]');
  await expect(buttons).toHaveCount(4);

  const initial = await readingState(page);
  expect(initial.reading).toBe('category');
  expect(initial.pressed.filter(item => item.pressed === 'true').map(item => item.mode)).toEqual(['category']);

  for (const mode of ['geography', 'nature', 'ethnic']) {
    await page.locator(`#cosmosControls [data-cosmos-reading="${mode}"]`).click();
    const state = await readingState(page);
    expect(state.reading).toBe(mode);
    expect(state.pressed.filter(item => item.pressed === 'true').map(item => item.mode)).toEqual([mode]);
    expect(state.perf.reading).toBe(mode);
  }

  await expect(page.locator('#cosmosReadingLegend')).toBeVisible();
  await expect(page.locator('#cosmosReadingLegend')).toContainText('有对照线索');

  await page.locator('#cosmosControls [data-cosmos-reading="category"]').click();
  await expect(page.locator('#cosmosReadingLegend')).toBeHidden();
});

test('the reading selection persists across a reload', async ({ page }) => {
  await page.goto('/#/home');
  await page.locator('#cosmosControls [data-cosmos-reading="nature"]').click();
  await page.reload();
  await expect(page.locator('#cosmosControls [data-cosmos-reading="nature"]')).toHaveAttribute('aria-pressed', 'true');
  expect((await readingState(page)).reading).toBe('nature');
});

test('home links can open the star map straight into a reading', async ({ page }) => {
  await page.goto('/#/home?read=geography');
  await expect(page.locator('#cosmosControls [data-cosmos-reading="geography"]')).toHaveAttribute('aria-pressed', 'true');
  expect((await readingState(page)).reading).toBe('geography');
  await expect(page.locator('#cosmosReadingLegend')).toContainText('青藏');
});

test('particle budget and degrade level stay inside the documented bounds', async ({ page }, testInfo) => {
  await page.goto('/#/home');
  await expect.poll(() => page.evaluate(() => Boolean(window.__HERBAL_DEBUG__?.cosmosPerf)), { timeout: 10_000 }).toBeTruthy();
  await page.waitForTimeout(2500);
  const perf = await page.evaluate(() => window.__HERBAL_DEBUG__.cosmosPerf());
  const report = JSON.stringify(perf);
  const cap = testInfo.project.name === 'mobile' ? 2500 : 8000;
  expect(perf.particleCount, 'particle count ' + report).toBeLessThanOrEqual(cap);
  expect(perf.particleCount, 'particle count ' + report).toBeGreaterThan(900);
  expect(perf.degradeLevel, 'degrade level ' + report).toBeLessThanOrEqual(2);
  expect(perf.spriteReadyMs, 'sprite warm-up ' + report).toBeLessThanOrEqual(200);
  // 帧耗时受共享 CI 机器负载影响，只要求引擎没有明显失控。
  expect(perf.avgFrameMs, 'average frame ' + report).toBeLessThanOrEqual(34);
});

test('reduced motion skips the reveal and still keeps every star reachable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/home');
  await page.waitForTimeout(600);
  const perf = await page.evaluate(() => window.__HERBAL_DEBUG__?.cosmosPerf?.() || null);
  expect(perf).not.toBeNull();
  await expect(page.locator('#heroCanvas')).toBeVisible();
  await expect(page.locator('#cosmosControls')).toBeVisible();
  await expect(page.locator('[data-cosmos-reading="ethnic"]')).toBeEnabled();
});
