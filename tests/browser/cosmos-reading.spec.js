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

test('the star map stays legible in every theme without blooming on the light one', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Pixel sampling is only meaningful on the desktop chromium project.');
  await page.goto('/#/home');
  await expect.poll(() => page.evaluate(() => Boolean(window.__HERBAL_DEBUG__?.cosmosPerf)), { timeout: 10_000 }).toBeTruthy();
  // 首屏揭示动画（微尘 800ms + 星辰 1200ms）结束后再采样，否则读到的是动画中间态。
  await page.waitForTimeout(2600);

  const sample = () => page.evaluate(() => {
    const canvas = document.getElementById('heroCanvas');
    const off = document.createElement('canvas');
    off.width = 300; off.height = 190;
    const ctx = off.getContext('2d');
    ctx.drawImage(canvas, 0, 0, 300, 190);
    const data = ctx.getImageData(0, 0, 300, 190).data;
    let total = 0, lit = 0, blown = 0;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      total += 1;
      const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (alpha > 40 && luminance > 25) lit += 1;
      if (alpha > 40 && data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250) blown += 1;
    }
    return { theme: document.documentElement.dataset.theme, litPct: 100 * lit / total, blownPct: 100 * blown / total };
  });

  const report = [];
  for (const theme of ['day', 'night', 'ink']) {
    await page.evaluate(value => window.HerbalTheme.setTheme(value), theme);
    await page.waitForTimeout(900);
    const state = await sample();
    report.push(state);
    expect(state.theme, 'theme applied; ' + JSON.stringify(report)).toBe(theme);
    expect(state.litPct, theme + ' still paints stars; ' + JSON.stringify(report)).toBeGreaterThan(3);
    // 加色混合在浅色底上最容易过曝：day 主题必须比夜间更保守。
    expect(state.blownPct, theme + ' over-bloom; ' + JSON.stringify(report)).toBeLessThan(theme === 'night' ? 6 : 2.5);
  }
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
