import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('archive secondary links reach their one existing workspace and preserve data', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'home');
  await expect(page.locator('#home-sources')).toBeHidden();
  await page.goto('/#/herbs');
  const cases = [['qiwei', 'qiweiMatrixChart'], ['formula', 'formulaCards'], ['heritage', 'heritageFoodGrid'], ['intro', 'intro-timeline'], ['sources', 'home-sources']];
  for (const [owner, target] of cases) {
    await page.locator('#archiveNav [data-archive-view="' + owner + '"]').click();
    await expect(page.locator('#' + target)).toBeVisible();
    await expect(page.locator('#mainNav [data-route-link="herbs"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#archiveNav [aria-current="page"]')).toHaveCount(1);
  }
  const imageCount = await page.evaluate(() => String(window.HERBAL_DATA_COVERAGE.imageBacked));
  await expect(page.locator('#homeKpis strong')).toHaveText(['902', '8,818', '100', imageCount]);
  await page.goto('/#/heritage');
  await expect(page.locator('.culture-local-nav a[href*="heritage-together"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('attribute switches show one main figure and retain click to evidence', async ({ page }) => {
  await page.goto('/#/qiwei?cat=补虚药');
  await expect(page.locator('#qiweiCatFilter')).toHaveValue('补虚药');
  await page.locator('#qiweiCatFilter').selectOption('清热药');
  for (const view of ['wei', 'meridian', 'qi', 'relations', 'flow', 'matrix']) {
    await page.locator('[data-attribute-view="' + view + '"]').click();
    await expect(page.locator('[data-attribute-panel]:visible')).toHaveCount(1);
    await expect(page.locator('[data-attribute-panel="' + view + '"] canvas')).toBeVisible();
    await expect(page.locator('#qiweiCatFilter')).toHaveValue('清热药');
  }
  const position = await page.evaluate(() => {
    const chart = window.echarts.getInstanceByDom(document.getElementById('qiweiMatrixChart'));
    return chart.convertToPixel({ seriesIndex: 0 }, chart.getOption().series[0].data[0].value.slice(0, 2));
  });
  await page.locator('#qiweiMatrixChart').click({ position: { x: position[0], y: position[1] } });
  await expect(page.locator('#qiweiInspector .inspector-herbs a')).not.toHaveCount(0);
});

test('drag changes star rotation without errors or selecting on release', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/home');
  await page.waitForFunction(() => Boolean(window.__HERBAL_DEBUG__?.cosmosPerf?.()));
  await page.evaluate(() => { window.__dragSelections = 0; window.addEventListener('herbal:cosmos-selection', () => window.__dragSelections++); });
  const bounds = await page.locator('#heroCanvas').boundingBox();
  const x = bounds.x + bounds.width * .86, y = bounds.y + 52;
  const before = await page.evaluate(() => window.__HERBAL_DEBUG__.cosmosPerf().targetRotation);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 90, y + 35, { steps: 8 });
  await page.mouse.up();
  const state = await page.evaluate(() => ({ perf: window.__HERBAL_DEBUG__.cosmosPerf(), picks: window.__dragSelections }));
  expect(Math.abs(state.perf.targetRotation - before)).toBeGreaterThan(.1);
  expect(state.perf.dragging).toBe(false);
  expect(state.picks).toBe(0);
  expect(errors).toEqual([]);
});

test('cancel, lost capture and a pinch never leave dragging or dispatch a false pick', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP provides trusted multitouch input for the Chromium/mobile regression.');
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/home');
  await page.waitForFunction(() => Boolean(window.__HERBAL_DEBUG__?.cosmosPerf?.()));
  await page.evaluate(() => {
    window.__gesturePicks = 0;
    document.getElementById('heroCanvas').addEventListener('pointerdown', event => { window.__gesturePointer = event.pointerId; });
    window.addEventListener('herbal:cosmos-selection', () => window.__gesturePicks++);
  });
  const box = await page.locator('#heroCanvas').boundingBox();
  const x = box.x + box.width * .86, y = box.y + 52;
  for (const operation of ['cancel', 'lost']) {
    await page.mouse.move(x, y);
    await page.mouse.down();
    // Activate the pending pointer capture before exercising its loss.
    await page.mouse.move(x - 1, y + 1);
    await expect.poll(() => page.evaluate(() => window.__HERBAL_DEBUG__.cosmosPerf().dragging)).toBe(true);
    await page.evaluate(operation => {
      const canvas = document.getElementById('heroCanvas');
      if (operation === 'cancel') canvas.dispatchEvent(new PointerEvent('pointercancel', { pointerId: window.__gesturePointer }));
      else canvas.releasePointerCapture(window.__gesturePointer);
    }, operation);
    await page.mouse.move(x - 10, y + 10);
    await expect.poll(() => page.evaluate(() => window.__HERBAL_DEBUG__.cosmosPerf().dragging)).toBe(false);
    await page.mouse.up();
  }
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }, { x: x - 40, y, id: 2 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  await expect.poll(() => page.evaluate(() => window.__HERBAL_DEBUG__.cosmosPerf().dragging)).toBe(false);
  expect(await page.evaluate(() => window.__gesturePicks)).toBe(0);
  expect(errors).toEqual([]);
});

test('pressed reading and archive buttons meet readable contrast in all themes', async ({ page }) => {
  await page.goto('/#/home');
  const ratio = async selector => page.locator(selector).evaluate(el => {
    const css = getComputedStyle(el);
    const luminance = value => {
      const rgb = value.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
      return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
    };
    const a = luminance(css.color), b = luminance(css.backgroundColor);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  });
  for (const theme of ['day', 'night', 'ink']) {
    await page.evaluate(theme => window.HerbalTheme.setTheme(theme), theme);
    expect(await ratio('#cosmosControls [data-cosmos-reading][aria-pressed="true"]')).toBeGreaterThanOrEqual(4.5);
  }
  await page.goto('/#/herbs?view=attributes');
  for (const theme of ['day', 'night', 'ink']) {
    await page.evaluate(theme => window.HerbalTheme.setTheme(theme), theme);
    expect(await ratio('[data-attribute-view][aria-pressed="true"]')).toBeGreaterThanOrEqual(4.5);
  }
});
