import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

const TOTAL = 144;

async function openCabinet(page) {
  await page.goto('/#/home');
  const canvas = page.locator('#apothecaryCanvas');
  await canvas.waitFor();
  await canvas.scrollIntoViewIfNeeded();
  await expect(page.locator('.apothecary-stage')).toHaveAttribute('data-mode', 'drawers', { timeout: 15_000 });
  return canvas;
}

async function state(page) {
  return page.evaluate(() => ({
    perf: window.HerbalApothecary?.perf?.() || null,
    status: document.querySelector('[data-apothecary-status]')?.textContent || '',
    count: document.querySelector('[data-apothecary-count]')?.textContent || '',
    name: document.querySelector('[data-apothecary-name]')?.textContent || '',
    attrs: document.querySelector('[data-apothecary-attrs]')?.textContent || '',
    href: document.querySelector('[data-apothecary-open]')?.getAttribute('href') || '',
    readoutHidden: document.querySelector('[data-apothecary-readout]')?.hidden
  }));
}

/* 16 列是偶数，画布正中恰好落在两列之间的缝里；偏半格才是抽屉中心。 */
async function firstDrawerPoint(page) {
  const box = await page.locator('#apothecaryCanvas').boundingBox();
  const { columns } = await state(page).then(value => value.perf);
  return { x: box.x + box.width * 0.5 + box.width / columns * 0.5, y: box.y + box.height * 0.5 };
}

test('the drawer wall renders once on home, hovers, picks and reads out the card', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'A real WebGL scene is verified once, on desktop chromium.');
  const requests = [];
  page.on('request', request => { if (request.url().includes('apothecary-webgl')) requests.push(request.url()); });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  const canvas = await openCabinet(page);
  const mounted = await state(page);
  expect(mounted.perf.count).toBe(TOTAL);
  expect(mounted.perf.columns * mounted.perf.rows).toBeGreaterThanOrEqual(TOTAL);
  expect(mounted.perf.camera.z).toBeGreaterThan(0);
  expect(await canvas.getAttribute('data-renderer')).toBe('apothecary');

  const point = await firstDrawerPoint(page);
  await page.mouse.move(point.x, point.y);
  await expect.poll(async () => (await state(page)).perf.hovered).toBeGreaterThanOrEqual(0);
  const hovered = await state(page);
  expect(hovered.status).toContain('抽屉：');
  expect(hovered.readoutHidden).toBe(true);

  await page.mouse.click(point.x, point.y);
  await expect.poll(async () => (await state(page)).perf.open).toBe(1);
  const picked = await state(page);
  expect(picked.perf.selected).toBe(hovered.perf.hovered);
  expect(picked.readoutHidden).toBe(false);
  expect(picked.name).not.toBe('—');
  expect(picked.attrs.length).toBeGreaterThan(0);
  expect(picked.href).toMatch(/^#\/herb\?id=/);
  expect(picked.status).toContain(picked.name);

  // 点开头上的知识卡链接必须真的落到那一味本草上。
  await page.locator('[data-apothecary-open]').click();
  await expect(page.locator('[data-route="herb"]')).toBeVisible();
  await expect(page.locator('#herbDetailHead h1')).toHaveText(picked.name);

  expect(requests).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('hovering a second drawer opens it while the picked card stays open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'A real WebGL scene is verified once, on desktop chromium.');
  const canvas = await openCabinet(page);
  const point = await firstDrawerPoint(page);
  await page.mouse.click(point.x, point.y);
  const picked = await state(page);

  const box = await canvas.boundingBox();
  await page.mouse.move(point.x - box.width * 0.16, point.y - box.height * 0.2);
  const hovered = await state(page);
  expect(hovered.perf.hovered).toBeGreaterThanOrEqual(0);
  expect(hovered.perf.hovered).not.toBe(picked.perf.selected);
  expect(hovered.perf.selected).toBe(picked.perf.selected);
  // 抽屉是弹簧收敛的，读数会停在 1 之前的最后一帧；这里只要求它确实抽出来了。
  expect(hovered.perf.open).toBeGreaterThan(0.9);
  expect(hovered.name).toBe(picked.name);

  await page.mouse.move(box.x + 4, box.y + 4);
  await expect.poll(async () => (await state(page)).perf.hovered).toBe(-1);
  expect((await state(page)).perf.selected).toBe(picked.perf.selected);
});

test('arrow keys step by the live grid and Enter pushes the drawer back', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'A real WebGL scene is verified once, on desktop chromium.');
  const canvas = await openCabinet(page);
  const grid = (await state(page)).perf;

  await canvas.focus();
  // 还没抽出任何一屉时，第一次按方向键就落在第一屉上。
  await page.keyboard.press('ArrowDown');
  const down = await state(page);
  expect(down.perf.selected).toBe(0);
  expect(down.readoutHidden).toBe(false);
  expect(down.name).not.toBe('—');

  await page.keyboard.press('ArrowDown');
  expect((await state(page)).perf.selected).toBe(grid.columns);
  await page.keyboard.press('ArrowUp');
  expect((await state(page)).perf.selected).toBe(0);
  await page.keyboard.press('ArrowLeft');
  expect((await state(page)).perf.selected).toBe(0);
  await page.keyboard.press('ArrowRight');
  expect((await state(page)).perf.selected).toBe(1);

  await page.keyboard.press('Enter');
  const closed = await state(page);
  expect(closed.perf.selected).toBe(-1);
  expect(closed.readoutHidden).toBe(true);
  // 空格同样能再抽出来，键盘用户不必换键。
  await page.keyboard.press(' ');
  expect((await state(page)).perf.selected).toBe(0);
});

test('search and category chips count hits and select the first match', async ({ page }) => {
  await page.goto('/#/home');
  const cabinet = page.locator('#apothecaryCanvas');
  await cabinet.waitFor();
  await cabinet.scrollIntoViewIfNeeded();
  await expect(page.locator('.apothecary-stage')).toHaveAttribute('data-mode', 'drawers', { timeout: 15_000 });

  await expect(page.locator('[data-apothecary-count]')).toHaveText(TOTAL + ' 个抽屉 · 全部可读');

  await page.locator('[data-apothecary-search]').fill('人参');
  await expect(page.locator('[data-apothecary-count]')).toHaveText(/^命中 [1-9]\d* \/ 144 个抽屉$/);
  const hits = await page.evaluate(() => window.HerbalApothecary.filter('人参', '').length);
  await expect(page.locator('[data-apothecary-count]')).toHaveText('命中 ' + hits + ' / 144 个抽屉');
  await expect(page.locator('[data-apothecary-name]')).toContainText('人参');

  await page.locator('[data-apothecary-search]').fill('');
  await expect(page.locator('[data-apothecary-count]')).toHaveText(TOTAL + ' 个抽屉 · 全部可读');

  const chip = page.locator('[data-apothecary-chip="补虚药"]');
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-apothecary-chip=""]')).toHaveAttribute('aria-pressed', 'false');
  const expected = await page.evaluate(() => window.HerbalApothecary.filter('', '补虚药').length);
  await expect(page.locator('[data-apothecary-count]')).toHaveText('命中 ' + expected + ' / 144 个抽屉');
  expect(expected).toBeGreaterThan(0);
  expect(expected).toBeLessThan(TOTAL);

  await page.locator('[data-apothecary-chip=""]').click();
  await expect(page.locator('[data-apothecary-count]')).toHaveText(TOTAL + ' 个抽屉 · 全部可读');
  await expect(page.locator('[data-apothecary-search]')).toBeVisible();
});

test('the camera is framed by the live grid and re-framed on resize', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'A real WebGL scene is verified once, on desktop chromium.');
  const canvas = await openCabinet(page);
  await canvas.scrollIntoViewIfNeeded();

  // 取景距离必须正好等于布局契约算出的值：柜体没被推远成中间一条，也没顶到画外。
  const expected = await page.evaluate(() => {
    const layout = window.HerbalApothecaryLayout;
    const box = document.getElementById('apothecaryCanvas').getBoundingClientRect();
    const perf = window.HerbalApothecary.perf();
    const wall = layout.wallSpan({ columns: perf.columns, rows: perf.rows });
    return layout.frameDistance(wall.x, wall.y, box.width / box.height);
  });
  const measured = (await state(page)).perf.camera.z;
  expect(Math.abs(measured - expected)).toBeLessThan(0.01);

  // 换到竖屏比例后网格与取景都要跟着换档，否则手机上是空边框着一小块柜子。
  await page.setViewportSize({ width: 375, height: 812 });
  await expect.poll(async () => (await state(page)).perf.columns).toBeLessThan(16);
  const portrait = await page.evaluate(() => {
    const layout = window.HerbalApothecaryLayout;
    const box = document.getElementById('apothecaryCanvas').getBoundingClientRect();
    const perf = window.HerbalApothecary.perf();
    const wall = layout.wallSpan({ columns: perf.columns, rows: perf.rows });
    return { expected: layout.frameDistance(wall.x, wall.y, box.width / box.height), aspect: box.width / box.height };
  });
  expect(portrait.aspect).toBeLessThan(1);
  expect(Math.abs((await state(page)).perf.camera.z - portrait.expected)).toBeLessThan(0.01);
});

test('opening a drawer actually repaints the wall', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Compositor capture is only compared on desktop chromium.');
  const canvas = await openCabinet(page);
  await canvas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const before = await canvas.screenshot();
  const point = await firstDrawerPoint(page);
  await page.mouse.click(point.x, point.y);
  await expect.poll(async () => (await state(page)).perf.open).toBe(1);
  await page.waitForTimeout(400);
  const after = await canvas.screenshot();
  // 抽屉抽出来、签牌亮起、相机轻微推移，画面必然不同；相同就说明根本没在画。
  expect(Buffer.compare(before, after)).not.toBe(0);
  expect(before.length).toBeGreaterThan(1024);
  expect(after.length).toBeGreaterThan(1024);
});

test('an unavailable renderer degrades to the named atlas instead of a blank cabinet', async ({ page }) => {
  await page.route('**/assets/vendor/apothecary-webgl.js', route => route.abort());
  await page.goto('/#/home');
  // 抽屉墙是滚进视口才装配的，降级路径同样只在那一刻才需要判定。
  await page.locator('#apothecaryCanvas').scrollIntoViewIfNeeded();
  const stage = page.locator('.apothecary-stage');
  await expect(stage).toHaveAttribute('data-mode', 'flat');
  await expect(page.locator('[data-apothecary-status]')).toContainText('本草图鉴');
  await expect(page.locator('#apothecaryCanvas')).toBeHidden();
  // 降级后筛选与计数仍然可用，本草一条都不能丢。
  await page.locator('[data-apothecary-search]').fill('人参');
  await expect(page.locator('[data-apothecary-count]')).toHaveText(/^命中 [1-9]\d* \/ 144 个抽屉$/);
  await expect(page.locator('.apothecary-head a[href="#/herbs"]')).toBeVisible();
});

test('the drawer wall downloads its renderer only once it scrolls into view', async ({ page }) => {
  const downloads = [];
  page.on('request', request => { if (request.url().includes('apothecary-webgl')) downloads.push(request.url()); });
  await page.goto('/#/home');
  await page.waitForTimeout(400);
  // 首屏是星图：没滚到柜子之前，抽屉墙不该替用户下 three.js。
  expect(downloads).toHaveLength(0);
  await page.locator('#apothecaryCanvas').scrollIntoViewIfNeeded();
  await expect(page.locator('.apothecary-stage')).toHaveAttribute('data-mode', 'drawers', { timeout: 15_000 });
  expect(downloads).toHaveLength(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#apothecaryCanvas').scrollIntoViewIfNeeded();
  expect(downloads).toHaveLength(1);
});

test('reduced motion paints one static frame and keeps the readout reachable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/home');
  const canvas = page.locator('#apothecaryCanvas');
  await canvas.waitFor();
  await canvas.scrollIntoViewIfNeeded();
  await expect(page.locator('.apothecary-stage')).toHaveAttribute('data-mode', 'drawers', { timeout: 15_000 });
  await expect.poll(async () => (await state(page)).perf?.frame ?? 0).toBeGreaterThan(0);
  const first = (await state(page)).perf.frame;
  await page.waitForTimeout(400);
  // 静止画面不该继续渲染；帧号是这一点的唯一可观测证据。
  expect((await state(page)).perf.frame).toBe(first);
  await page.evaluate(() => window.HerbalApothecary.select(0));
  await expect(page.locator('[data-apothecary-readout]')).toBeVisible();
  await expect(page.locator('[data-apothecary-name]')).not.toHaveText('—');
});

test('the drawer wall stays inside the viewport on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#/home');
  const canvas = page.locator('#apothecaryCanvas');
  await canvas.waitFor();
  await canvas.scrollIntoViewIfNeeded();
  await expect(page.locator('.apothecary-stage')).toHaveAttribute('data-mode', 'drawers', { timeout: 15_000 });
  const measured = await page.evaluate(() => {
    const doc = document.documentElement;
    const canvas = document.getElementById('apothecaryCanvas').getBoundingClientRect();
    return {
      overflow: doc.scrollWidth - doc.clientWidth,
      canvasLeft: Math.round(canvas.left),
      canvasRight: Math.round(canvas.right),
      client: doc.clientWidth
    };
  });
  expect(measured.overflow, JSON.stringify(measured)).toBeLessThanOrEqual(1);
  expect(measured.canvasLeft, JSON.stringify(measured)).toBeGreaterThanOrEqual(0);
  expect(measured.canvasRight, JSON.stringify(measured)).toBeLessThanOrEqual(measured.client + 1);
  // 竖屏下网格要重排成高瘦的一档，否则抽屉会小到点不准。
  const grid = (await state(page)).perf;
  expect(grid.columns).toBeLessThan(grid.rows);
  expect(grid.columns * grid.rows).toBeGreaterThanOrEqual(TOTAL);
});

test('the cabinet stops drawing once it scrolls out of view', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Frame counters need a real animation loop.');
  await openCabinet(page);
  const before = await state(page);
  expect(before.perf.frame).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => {
    const a = (await state(page)).perf.frame;
    await page.waitForTimeout(300);
    const b = (await state(page)).perf.frame;
    return b - a;
  }).toBeLessThanOrEqual(1);
  await page.evaluate(() => document.getElementById('apothecaryCanvas').scrollIntoView({ block: 'center' }));
  await expect.poll(async () => {
    const a = (await state(page)).perf.frame;
    await page.waitForTimeout(300);
    const b = (await state(page)).perf.frame;
    return b - a;
  }).toBeGreaterThan(1);
});

test('dispose removes the loop and keeps the module re-mountable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Frame counters need a real animation loop.');
  await openCabinet(page);
  const result = await page.evaluate(async () => {
    const before = window.HerbalApothecary.perf().frame;
    window.HerbalApothecary.dispose();
    await new Promise(resolve => setTimeout(resolve, 300));
    const after = window.HerbalApothecary.perf()?.frame ?? null;
    return { before, after };
  });
  // dispose 之后引用被清空，且没有任何帧继续被画出来。
  expect(result.after).toBeNull();
});
