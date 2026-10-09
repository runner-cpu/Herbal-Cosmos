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

test('the star map exposes its readings with a single pressed state', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('#cosmosControls [data-cosmos-readings]')).toBeVisible();
  const buttons = page.locator('#cosmosControls [data-cosmos-reading]');
  await expect(buttons).toHaveCount(3);
  await expect(page.locator('#cosmosControls [data-cosmos-reading="ethnic"]')).toHaveCount(0);

  const initial = await readingState(page);
  expect(initial.reading).toBe('category');
  expect(initial.pressed.filter(item => item.pressed === 'true').map(item => item.mode)).toEqual(['category']);

  for (const mode of ['geography', 'nature']) {
    await page.locator(`#cosmosControls [data-cosmos-reading="${mode}"]`).click();
    const state = await readingState(page);
    expect(state.reading).toBe(mode);
    expect(state.pressed.filter(item => item.pressed === 'true').map(item => item.mode)).toEqual([mode]);
    expect(state.perf.reading).toBe(mode);
    await expect(page.locator('#cosmosReadingLegend')).toBeVisible();
    if (mode === 'geography') await expect(page.locator('#cosmosReadingLegend')).toContainText('青藏');
    if (mode === 'nature') await expect(page.locator('#cosmosReadingLegend')).toContainText('大寒');
  }

  await page.locator('#cosmosControls [data-cosmos-reading="category"]').click();
  await expect(page.locator('#cosmosReadingLegend')).toBeHidden();
});

test('the reading selection survives a reload even without the ethnic reading', async ({ page }) => {
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
  await expect(page.locator('#cosmosControls [data-cosmos-reading="nature"]')).toBeEnabled();
});

test('the ethnic reading stays hidden until the correspondence gate has approved entries', async ({ page }) => {
  await page.goto('/#/home');
  const approved = await page.evaluate(() => (window.ETHNIC_CORRESPONDENCE || []).filter(item => item.status === 'approved').length);
  const buttons = await page.locator('#cosmosControls [data-cosmos-reading="ethnic"]').count();
  if (approved === 0) {
    expect(buttons, 'no approved entries means no ethnic reading').toBe(0);
    // ?read=ethnic 也不能把用户带到一个空读法上。
    await page.goto('/#/home?read=ethnic');
    expect((await readingState(page)).reading).toBe('category');
  } else {
    expect(buttons).toBe(1);
  }
});
