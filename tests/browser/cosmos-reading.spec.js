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
  await page.goto('/?renderer=canvas#/home');
  await expect(page.locator('.cosmos-settings')).not.toHaveAttribute('open', '');
  await page.locator('[data-cosmos-collapse]').click();
  await expect(page.locator('#cosmosControls [data-cosmos-readings]')).toBeVisible();
  const buttons = page.locator('#cosmosControls [data-cosmos-reading]');
  await expect(buttons).toHaveCount(3);
  await expect(page.locator('#cosmosControls [data-cosmos-reading="ethnic"]')).toHaveCount(0);

  const initial = await readingState(page);
  expect(initial.reading).toBe('category');
  expect(initial.perf.paletteCount).toBeGreaterThan(1);
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
  await page.locator('[data-cosmos-collapse]').click();
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
  await page.goto('/?renderer=canvas#/home');
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

test('category filters count knowledge cards and geography selects every recorded region', async ({ page }) => {
  await page.goto('/?renderer=static#/home');
  await page.locator('[data-cosmos-collapse]').click();
  await expect(page.locator('[data-cosmos-count]')).toHaveText('902 / 902 张');
  const category = page.locator('[data-cosmos-category]');
  await category.selectOption('补虚药');
  const expected = await page.evaluate(() => window.HERBS.filter(h => !['directory-only', 'formula-material'].includes(h.kind) && h.cat === '补虚药').length);
  await expect(page.locator('[data-cosmos-count]')).toHaveText(expected + ' / 902 张');
  await category.selectOption('');
  await page.locator('[data-cosmos-reading="geography"]').click();
  await page.locator('[data-cosmos-regions] input[value="西南"]').check();
  await page.locator('[data-cosmos-regions] input[value="东南"]').check();
  const multi = await page.evaluate(() => window.HERBS.filter(h => !['directory-only', 'formula-material'].includes(h.kind) && window.HerbalCosmosEngine.regionsOf(h.origin).some(r => ['西南', '东南'].includes(r))).length);
  await expect(page.locator('[data-cosmos-count]')).toHaveText(multi + ' / 902 张');
  expect((await readingState(page)).perf.regions).toEqual(['西南', '东南']);
});

test('static focus has shared selection, recorded relations and an inline archive preview', async ({ page }) => {
  await page.goto('/?renderer=static#/home');
  await page.evaluate(() => window.HerbalCosmos.focusHerb('renshen'));
  await expect(page.locator('#cosmosDetail h2')).toHaveText('人参');
  await expect(page.locator('#cosmosDetail [data-cosmos-detail]')).toHaveAttribute('href', '#/herb?id=renshen');
  await expect(page.locator('#cosmosDetail .cosmos-detail-image img')).toBeVisible();
  const result = await readingState(page);
  expect(result.perf.focusedId).toBe('renshen');
  expect(result.perf.nodeCount).toBe(902);
  expect(result.perf.relations.formulas).toContain('sijunzitang');
  expect(result.perf.relations.ids).toContain('baizhu');
  await expect(page).toHaveURL(/focus=star&id=renshen/);
  await page.locator('[data-cosmos-favorite]').click();
  await expect(page.locator('[data-cosmos-favorite]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-saved-count]')).toHaveText('1');
  await page.reload();
  await expect(page.locator('#cosmosDetail h2')).toHaveText('人参');
  await expect(page.locator('[data-cosmos-favorite]')).toHaveAttribute('aria-pressed', 'true');
  const box = await page.locator('#heroCanvas').boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#cosmosDetail h2')).toHaveText('人参');
  await page.locator('[data-cosmos-close]').click();
  await expect(page.locator('#heroCanvas')).toBeFocused();
  expect((await readingState(page)).perf.focusedId).toBeNull();
  await expect(page.locator('#cosmosDetail')).toBeHidden();
});

test('reduced motion idles without camera tween and routes stop the scene', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/home');
  await expect.poll(async () => (await readingState(page)).perf?.scheduled).toBe(false);
  await page.evaluate(() => window.HerbalNebula.focus('renshen', true));
  await page.waitForTimeout(100);
  const before = (await readingState(page)).perf;
  await page.waitForTimeout(150);
  const after = (await readingState(page)).perf;
  expect(after.frames).toBe(before.frames);
  expect(after.rotation).toBe(after.targetRotation);
  await page.goto('/#/herbs');
  expect((await readingState(page)).perf.running).toBe(false);
});

test('enhancement failure visibly keeps the Canvas layout and knowledge card reachability', async ({ page }) => {
  await page.route('**/assets/vendor/cosmos-webgl.js', route => route.abort());
  await page.goto('/#/home');
  await expect(page.locator('[data-cosmos-renderer]')).toContainText('已使用基础星图');
  expect((await readingState(page)).perf.renderer).toBe('canvas');
  await page.evaluate(() => window.HerbalNebula.focus('renshen', false));
  await expect(page.locator('#cosmosDetail h2')).toHaveText('人参');
});

test('context loss tears down the enhanced painter and preserves selection', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One real WebGL context regression is sufficient.');
  await page.goto('/#/home');
  await expect.poll(async () => (await readingState(page)).perf?.renderer).toBe('webgl');
  await page.evaluate(() => {
    window.HerbalNebula.focus('renshen', false);
    document.querySelector('.cosmos-webgl').dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  });
  await expect(page.locator('.cosmos-webgl')).toHaveCount(0);
  await expect(page.locator('#cosmosDetail h2')).toHaveText('人参');
  expect((await readingState(page)).perf.renderer).toBe('canvas');
});

test('mobile scene permits scroll by default and gates touch capture behind roam', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Touch behavior requires the mobile project.');
  await page.goto('/?renderer=static#/home');
  const canvas = page.locator('#heroCanvas');
  expect(await canvas.evaluate(el => getComputedStyle(el).touchAction)).toBe('pan-y');
  await canvas.dispatchEvent('pointerdown', { pointerId: 42, pointerType: 'touch', clientX: 100, clientY: 100 });
  expect((await readingState(page)).perf.dragging).toBe(false);
  await page.locator('[data-cosmos-roam]').click();
  expect(await canvas.evaluate(el => getComputedStyle(el).touchAction)).toBe('none');
  await page.locator('[data-cosmos-roam]').click();
  expect(await canvas.evaluate(el => getComputedStyle(el).touchAction)).toBe('pan-y');
  await canvas.scrollIntoViewIfNeeded();
  const beforeScroll = await page.evaluate(() => scrollY);
  const box = await canvas.boundingBox();
  const session = await context.newCDPSession(page);
  const x = box.x + box.width / 2, y = Math.min(600, Math.max(250, box.y + 200));
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 160, id: 1 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(beforeScroll);
});

test('enhancement loads once on home, stays off the archive and stops offscreen', async ({ page }) => {
  const downloads = [];
  page.on('request', request => { if (request.url().endsWith('/assets/vendor/cosmos-webgl.js')) downloads.push(request.url()); });
  await page.goto('/#/herbs');
  expect(downloads).toHaveLength(0);
  await page.locator('header .brand').click();
  await expect.poll(() => downloads.length).toBe(1);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => (await readingState(page)).perf?.running).toBe(false);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(async () => (await readingState(page)).perf?.running).toBe(true);
  expect(downloads).toHaveLength(1);
});

test('disposing a mount removes its loop and keyboard listeners', async ({ page }) => {
  await page.goto('/?renderer=static#/home');
  const result = await page.evaluate(async () => {
    const canvas = document.createElement('canvas'); canvas.style.width = '200px'; canvas.style.height = '120px'; document.body.append(canvas);
    const instance = window.HerbalCosmosEngine.mount(canvas, { herbs: window.HERBS.filter(h => h.id === 'renshen'), renderer: 'static' });
    await new Promise(resolve => requestAnimationFrame(resolve));
    instance.dispose(); const before = instance.perf();
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); instance.start();
    await new Promise(resolve => requestAnimationFrame(resolve));
    const after = instance.perf(); canvas.remove();
    return { before, after };
  });
  expect(result.after.frames).toBe(result.before.frames);
  expect(result.after.targetRotation).toBe(result.before.targetRotation);
  expect(result.after.running).toBe(false);
  expect(result.after.scheduled).toBe(false);
});

test('renderer changes during enhancement keep one active particle painter', async ({ page }) => {
  await page.goto('/?renderer=canvas#/home');
  await page.evaluate(() => {
    window.HerbalNebula.setRenderer('auto');
    window.HerbalNebula.setRenderer('canvas');
    window.HerbalNebula.setRenderer('auto');
  });
  await expect.poll(async () => (await readingState(page)).perf?.renderer).toBe('webgl');
  await expect(page.locator('.cosmos-webgl')).toHaveCount(1);
  await page.evaluate(() => window.HerbalNebula.setRenderer('canvas'));
  await expect(page.locator('.cosmos-webgl')).toHaveCount(0);
  expect((await readingState(page)).perf.renderer).toBe('canvas');
});
