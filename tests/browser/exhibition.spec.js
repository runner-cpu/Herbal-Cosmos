import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

test.use({ serviceWorkers: 'block' });
async function openNote(page) {
  const disclosure = page.locator('.exhibit-note-disclosure');
  if (await disclosure.getAttribute('open') === null) await disclosure.locator('summary').click();
}

test('chapter scenes show one curated graph with actual case counts and source disclosures', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const [chapter, caseId, nodes, edges] of [['recognize', 'five-tastes', 16, 13], ['compose', 'sijunzitang', 5, 4], ['compose', 'mahuangtang', 5, 4], ['compose', 'guizhitang', 6, 5], ['inherit', 'lum', 12, 11], ['inherit', 'processing', 7, 6]]) {
    await page.goto('/#/exhibit?chapter=' + chapter + '&case=' + caseId);
    await expect(page.locator('#exhibitionRoot svg.exhibit-scene')).toHaveCount(1);
    await expect(page.locator('#exhibitionRoot [data-graph-node]')).toHaveCount(nodes);
    await expect(page.locator('#exhibitionRoot [data-graph-edge]')).toHaveCount(edges);
    if (!(await page.locator('.exhibit-source-disclosure').getAttribute('open') !== null)) await page.getByText('来源与证据', { exact: true }).click();
    await expect(page.locator('.exhibit-sources')).toBeVisible();
    await expect(page.locator('.exhibit-sources')).toContainText('2026-10-09');
  }
  expect(errors).toEqual([]);
});

test('keyboard picks update evidence and browser back restores selected chapter and node', async ({ page }) => {
  await page.goto('/#/exhibit?chapter=recognize');
  const button = page.locator('button[data-select="juemingzi"]');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#exhibitDetail h2')).toHaveText('决明子');
  await expect(page.locator('#exhibitDetail')).toContainText('甘苦咸');
  await page.locator('[data-chapter="compose"]').click();
  await expect(page.locator('#exhibitionRoot')).toHaveAttribute('data-chapter', 'compose');
  await page.goBack();
  await expect(page.locator('#exhibitDetail h2')).toHaveText('决明子');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.locator('button[data-select="taste:淡"]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#exhibitDetail')).toContainText('补充味型');
});

test('documented role switch exposes diagram-specific evidence and archive identity caveats', async ({ page }) => {
  await page.goto('/#/exhibit?chapter=compose&case=guizhitang');
  await expect(page.locator('[data-edge-role]')).toHaveCount(0);
  await page.getByRole('button', { name: '显示有据角色' }).click();
  await expect(page.locator('[data-edge-role]')).toHaveCount(5);
  await page.locator('button[data-select="baishao"]').click();
  await expect(page.locator('#exhibitDetail')).toContainText('现代解释段与教学图');
  await page.getByText('来源与证据', { exact: true }).click();
  await expect(page.locator('.exhibit-sources')).toContainText('F00002配套教学图');
  await expect(page.locator('.exhibit-sources a[href*="F00002.jpg"]')).toBeVisible();
  await page.locator('button[data-select="gancao"]').click();
  await expect(page.locator('#exhibitDetail h2')).toHaveText('炙甘草');
  await expect(page.locator('#exhibitDetail a[href="#/herb?id=gancao"]')).toContainText('相关知识卡');
});

test('bare heritage enters inheritance and anchored archive routes keep their owners', async ({ page }) => {
  await page.goto('/#/heritage');
  await expect(page.locator('#exhibitionRoot')).toHaveAttribute('data-chapter', 'inherit');
  await expect(page.locator('#mainNav [data-route-link="exhibit"]')).toHaveAttribute('aria-current', 'page');
  await expect(page).toHaveTitle('文化长卷 · 本草宇宙');
  await page.locator('[data-case="processing"]').click();
  await page.locator('button[data-select="texts"]').click();
  await expect(page.locator('#exhibitDetail')).toContainText('《雷公炮炙论》');
  await page.goBack();
  await expect(page.locator('#exhibitDetail h2')).toHaveText('中药炮制技术');
  for (const url of ['/#/heritage?anchor=heritage-food', '/#/herbs?section=culture']) {
    await page.goto(url);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'heritage');
  }
});

test('traditional taste colors have distinct swatches while supplementary categories remain neutral', async ({ page }) => {
  await page.goto('/#/exhibit?chapter=recognize');
  await expect(page.locator('.exhibit-phase-swatch')).toHaveCount(5);
  for (const theme of ['day', 'night']) {
    await page.evaluate(theme => window.HerbalTheme.setTheme(theme), theme);
    const colors = await page.locator('.exhibit-phase-swatch').evaluateAll(items => items.map(el => getComputedStyle(el).fill));
    expect(new Set(colors).size).toBe(5);
    await expect(page.locator('[data-graph-node="taste:淡"] .exhibit-phase-swatch')).toHaveCount(0);
    await expect(page.locator('[data-graph-node="taste:未录入"] .exhibit-phase-swatch')).toHaveCount(0);
  }
});

test('reading note saves with keyboard, persists after reload and exports escaped SVG with revoked URL', async ({ page }) => {
  await page.goto('/#/exhibit?chapter=compose&case=guizhitang&selected=baishao');
  await expect(page.locator('#exhibitNoteForm')).toBeHidden();
  await page.getByRole('button', { name: '将这条理解写入札记' }).click();
  await expect(page.locator('#exhibitNoteForm')).toBeVisible();
  await page.getByLabel('阅读对象', { exact: true }).fill('<白芍 & "桂枝汤">');
  await page.getByLabel('我的理解').fill('图解角色 <script> & 来源有范围');
  await page.getByRole('button', { name: '保存到本机' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#exhibitNoteStatus')).toContainText('已保存到本机');
  await page.reload();
  await expect(page.locator('.exhibit-note-disclosure summary')).toContainText('已保存');
  await openNote(page);
  await expect(page.getByLabel('阅读对象', { exact: true })).toHaveValue('<白芍 & "桂枝汤">');
  await expect(page.getByLabel('我的理解')).toHaveValue('图解角色 <script> & 来源有范围');
  await expect(page.getByLabel('展览地址')).toHaveValue(/#\/exhibit\?chapter=compose&case=guizhitang&selected=baishao$/);
  await page.evaluate(() => { window.__revoked = 0; const revoke = URL.revokeObjectURL.bind(URL); URL.revokeObjectURL = value => { window.__revoked++; revoke(value); }; });
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 SVG 札记' }).click();
  const download = await downloading;
  const svg = fs.readFileSync(await download.path(), 'utf8');
  expect(svg).toContain('&lt;白芍 &amp; &quot;桂枝汤&quot;&gt;');
  expect(svg).not.toContain('<script>');
  await expect.poll(() => page.evaluate(() => window.__revoked)).toBe(1);
});

test('herb collection uses existing favorite event and storage flow', async ({ page }) => {
  await page.goto('/#/exhibit?chapter=recognize&selected=gancao');
  await page.getByRole('button', { name: '收藏甘草', exact: true }).click();
  await expect(page.getByRole('button', { name: '取消收藏甘草', exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('herbal_favs')))).toContain('gancao');
});

for (const width of [320, 375, 1440]) {
  test(width + 'px scenes and editable note fit in night mode with reduced motion', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const chapter of ['recognize', 'compose', 'inherit']) {
      await page.goto('/#/exhibit?chapter=' + chapter);
      await page.evaluate(() => window.HerbalTheme.setTheme('night'));
      await expect(page.locator('.exhibit-scene')).toBeVisible();
      await openNote(page);
      await expect(page.getByRole('button', { name: '保存到本机' })).toBeVisible();
      const bounds = await page.locator('#exhibitionRoot').evaluate(root => ({ scroll: document.documentElement.scrollWidth, width: innerWidth, svg: root.querySelector('svg').getBoundingClientRect().width }));
      expect(bounds.scroll).toBeLessThanOrEqual(bounds.width + 1);
      expect(bounds.svg).toBeGreaterThan(200);
      const minNodeTypeSize = await page.locator('.exhibit-scene').evaluate(svg => Math.min(...Array.from(svg.querySelectorAll('[data-graph-node] text:not(.node-meta)')).map(text => parseFloat(getComputedStyle(text).fontSize) * text.getScreenCTM().a)));
      expect(minNodeTypeSize, 'core scene labels must remain readable at this viewport').toBeGreaterThanOrEqual(11);
      await expect(page.locator('#mainNav a')).toHaveCount(3);
    }
  });
}

test('classic file URL renders all chapter basics without module fetches', async ({ page }) => {
  await page.goto(pathToFileURL(process.cwd() + '/index.html').href + '#/exhibit?chapter=inherit&case=processing');
  await expect(page.locator('#exhibitDetail h2')).toHaveText('中药炮制技术');
  await page.locator('[data-chapter="compose"]').click();
  await expect(page.locator('[data-graph-node]')).toHaveCount(5);
});

test('375px core graph labels render at readable scale in all chapters', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const chapter of ['recognize', 'compose', 'inherit']) {
    await page.goto('/#/exhibit?chapter=' + chapter);
    const size = await page.locator('.exhibit-scene').evaluate(svg => Math.min(...Array.from(svg.querySelectorAll('[data-graph-node] text:not(.node-meta)')).map(text => parseFloat(getComputedStyle(text).fontSize) * text.getScreenCTM().a)));
    expect(size).toBeGreaterThanOrEqual(14);
  }
});
