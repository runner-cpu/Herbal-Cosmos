import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('a first visit opens the cultural door and each act leads to the next', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'intro');
  await expect(page.locator('#introExhibit h1')).toHaveText('本草千年');
  await expect(page.locator('#introExhibit')).toContainText('文化传说');
  await page.locator('#introExhibit a[href="#/home"]').first().click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'home');
  await page.locator('.act-portals a[href="#/qiwei"]').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'qiwei');
  await page.locator('.page.active .act-next a[href="#/formula"]').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'formula');
  await page.locator('.page.active .act-next a[href="#/heritage"]').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'heritage');
  await page.locator('.culture-next-links a[href="#/learn"]').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'learn');
  await expect(page.locator('#quizCard .quiz-q')).toBeVisible();
  await page.locator('#quizCard [data-answer="2"]').click();
  await expect(page.locator('#quizFeedback .quiz-reading a')).toHaveAttribute('href', '#/qiwei');
  await page.locator('#quizFeedback .quiz-reading a').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'qiwei');
});

test('legacy collection links reach the corresponding heritage exhibit', async ({ page }) => {
  const cases = [
    ['food', 'heritage-food'],
    ['culture', 'heritage-culture'],
    ['classics', 'heritage-classics'],
    ['home?anchor=home-food', 'heritage-food'],
    ['home?anchor=home-classics', 'heritage-classics']
  ];
  for (const [route, anchor] of cases) {
    await page.goto('/#/' + route);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'heritage');
    await expect(page.locator('[data-route-link="heritage"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#' + anchor)).toBeInViewport({ ratio: .01 });
  }
});

test('cultural context numbers stay separate from the actual explorable collection', async ({ page }) => {
  await page.goto('/#/home');
  await expect(page.locator('.cultural-numbers')).toContainText('365');
  await expect(page.locator('.cultural-numbers')).toContainText('1,892');
  await expect(page.locator('.cultural-numbers')).toContainText('5,911');
  await expect(page.locator('.cultural-numbers')).toContainText('四部合计');
  await expect(page.locator('.evidence-note')).toContainText('范围不同');
  const actual = await page.evaluate(() => [
    window.HERBS.filter(herb => !['formula-material', 'directory-only'].includes(herb.kind)).length,
    window.HERB_CATALOG_MANIFEST.approvedCount,
    window.FORMULAS.length,
    window.HERBAL_DATA_COVERAGE.imageBacked
  ].map(count => count.toLocaleString('zh-CN')));
  await expect(page.locator('#homeKpis strong')).toHaveText(actual);
  await expect(page.locator('#home-collection')).toContainText('当前可浏览');
  await expect(page.locator('#collectionCoverage')).not.toHaveAttribute('open', '');
});

test('five-phase matrix preserves observed counts and has no invalid supplementary coordinates', async ({ page }) => {
  await page.goto('/#/qiwei');
  await expect(page.locator('#qiweiMatrixChart canvas')).toBeVisible();
  await expect(page.locator('#fivePhaseLegend')).toContainText('酸 · 木');
  await expect(page.locator('#fivePhaseLegend')).toContainText('咸 · 水');
  await expect(page.locator('#fivePhaseLegend')).toContainText('淡');
  await expect(page.locator('#fivePhaseLegend')).toContainText('涩');
  const counts = await page.evaluate(() => {
    const flavors = ['酸', '苦', '甘', '辛', '咸'];
    const records = window.HERBS.filter(herb => !['formula-material', 'directory-only'].includes(herb.kind));
    const matrix = window.echarts.getInstanceByDom(document.getElementById('qiweiMatrixChart')).getOption();
    const bar = window.echarts.getInstanceByDom(document.getElementById('weiBarChart')).getOption();
    const qis = matrix.yAxis[0].data;
    const values = matrix.series[0].data.map(cell => Array.isArray(cell) ? cell : cell.value);
    return {
      invalid: values.filter(([x, y, count]) => !Number.isInteger(x) || x < 0 || x >= flavors.length || !Number.isInteger(y) || y < 0 || y >= qis.length || !Number.isFinite(count)),
      matrixActual: flavors.map((_, index) => values.filter(cell => cell[0] === index).reduce((sum, cell) => sum + cell[2], 0)),
      matrixExpected: flavors.map(flavor => records.filter(herb => String(herb.wei || '').includes(flavor)).length),
      barActual: bar.series[0].data.map(cell => typeof cell === 'number' ? cell : cell.value),
      barExpected: flavors.map(flavor => records.filter(herb => String(herb.wei || '').includes(flavor)).length),
      barColors: bar.series[0].data.map(cell => cell.itemStyle?.color)
    };
  });
  expect(counts.invalid).toEqual([]);
  expect(counts.matrixActual).toEqual(counts.matrixExpected);
  expect(counts.barActual).toEqual(counts.barExpected);
  expect(counts.matrixActual).toEqual(counts.barActual);
  expect(new Set(counts.barColors).size).toBe(5);
  await expect(page.locator('.cultural-reading')).toContainText('不能直接等同四季');
  await expect(page.locator('#qiweiMissingNote')).toContainText('以灰色行保留');
  const pending = await page.evaluate(() => {
    const chart = window.echarts.getInstanceByDom(document.getElementById('qiweiMatrixChart'));
    const options = chart.getOption(), pendingIndex = options.yAxis[0].data.indexOf('四气待补');
    const cell = options.series[0].data.find(item => (Array.isArray(item) ? item : item.value)[1] === pendingIndex);
    return cell ? chart.convertToPixel({ seriesIndex: 0 }, (Array.isArray(cell) ? cell : cell.value).slice(0, 2)) : null;
  });
  expect(pending).not.toBeNull();
  await page.locator('#qiweiMatrixChart').click({ position: { x: pending[0], y: pending[1] } });
  await expect(page.locator('#qiweiInspector')).toContainText('四气待补');
  await expect(page.locator('#qiweiInspector')).toContainText('颠茄草');
});

test('food collection remains bounded, searchable and source-linked after relocation', async ({ page }) => {
  await page.goto('/#/heritage?anchor=heritage-food');
  const cards = page.locator('#heritageFoodGrid .culture-food-card');
  await expect(cards).toHaveCount(12);
  await expect(page.locator('#heritageFoodStatus')).toContainText('106');
  const first = await cards.first().textContent();
  await page.locator('#heritageFoodPages [data-culture-food-page="2"]').click();
  await expect(cards.first()).not.toHaveText(first);
  const lastName = await page.evaluate(() => window.FOODS.at(-1).name);
  await page.locator('#heritageFoodSearch').fill(lastName);
  await expect(cards.first().locator('h3')).toHaveText(lastName);
  await expect(cards.first().locator('.culture-food-source a')).toHaveAttribute('href', /^https:\/\//);
  await page.locator('#heritageFoodSearch').fill('不存在的食药目录名称');
  await expect(page.locator('#heritageFoodStatus')).toContainText('没有找到');
  await expect(cards).toHaveCount(0);
  await page.locator('[data-culture-food-reset]').click();
  await expect(cards).toHaveCount(12);
  await expect(page.locator('#heritageFoodScope')).toHaveValue('all');
  await expect(page.locator('.culture-heritage-card')).toHaveCount(6);
  await expect(page.locator('.culture-heritage-card figcaption')).toHaveText(Array(6).fill('项目概念插画 · 非历史影像'));
});

test('ink theme persists on cultural pages and legacy classic preferences migrate', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('herbal_theme', 'classic'));
  await page.goto('/#/heritage');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'ink');
  await expect(page.locator('body')).toHaveClass(/ink/);
  await expect(page.locator('body')).not.toHaveClass(/night/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'ink');
  await expect(page.locator('#heritageExhibit h1')).toHaveText('薪火相传');
  expect(await page.evaluate(() => localStorage.getItem('herbal_theme'))).toBe('ink');
});

test('answered learning steps survive theme changes and source reading, then advance exactly once', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('herbal_learn_stats'));
  await page.goto('/#/learn?step=2');
  const question = await page.locator('#quizCard .quiz-q').textContent();
  await page.locator('#quizCard [data-answer="1"]').click();
  await expect(page.locator('#learnStats')).toContainText('已完成 1');
  await expect(page.locator('#quizFeedback .quiz-note')).toBeVisible();
  await page.evaluate(() => window.HerbalTheme.setTheme('night'));
  await expect(page.locator('#quizCard .quiz-q')).toHaveText(question);
  await expect(page.locator('#quizFeedback .quiz-note')).toBeVisible();
  await expect(page.locator('#quizCard [data-answer]:enabled')).toHaveCount(0);
  await page.locator('#quizFeedback a[href="#/formula"]').click();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'formula');
  await page.goBack();
  await expect(page.locator('.page.active')).toHaveAttribute('data-route', 'learn');
  await expect(page.locator('#quizFeedback .quiz-note')).toBeVisible();
  await expect(page.locator('#quizCard [data-answer]:enabled')).toHaveCount(0);
  await expect(page.locator('#learnStats')).toContainText('已完成 1');
  await page.locator('#quizNext').click();
  await expect(page).toHaveURL(/#\/learn[?]step=3$/);
  await expect(page.locator('#quizCard .quiz-q')).not.toHaveText(question);
  await expect(page.locator('#quizCard [data-answer]:enabled')).toHaveCount(4);
  await page.locator('#quizCard [data-answer="1"]').click();
  await expect(page.locator('#learnStats')).toContainText('已完成 2');
});

test('formula reading, sample statistics, directory and syndrome views remain distinct', async ({ page }) => {
  await page.goto('/#/formula?f=guizhitang&z=feng-han');
  await expect(page.locator('#formulaGraphView')).toBeVisible();
  await expect(page.locator('#formulaStatsView')).toBeHidden();
  await expect(page.locator('#formulaCards')).toBeHidden();
  await page.locator('[data-formula-view="stats"]').click();
  await expect(page.locator('#formulaStatsView')).toBeVisible();
  await expect(page.locator('#formulaGraphView')).toBeHidden();
  await expect(page.locator('#formulaRolesChart canvas')).toBeVisible();
  await expect(page.locator('[data-chart-cultural-note="formulaRolesChart"]')).toContainText('柱高表示组成条数');
  await page.locator('[data-formula-view="directory"]').click();
  await expect(page.locator('#formulaCards')).toBeVisible();
  await expect(page.locator('#formulaStatsView')).toBeHidden();
  await expect(page.locator('#formulaCards .formula-card')).toHaveCount(12);
  await page.locator('[data-formula-view="zheng"]').click();
  await expect(page.locator('#formulaZhengView')).toBeVisible();
  await expect(page).toHaveURL(/f=guizhitang/);
  await expect(page).toHaveURL(/z=feng-han/);
  await page.locator('[data-formula-view="network"]').click();
  await expect(page.locator('#formulaGraphView')).toBeVisible();
  await expect(page).toHaveURL(/f=guizhitang/);
  await expect(page).toHaveURL(/z=feng-han/);
});

test('formula views retain the herb context and network edge tooltips name the source and material', async ({ page }) => {
  await page.goto('/#/formula?herb=gancao');
  await expect(page.locator('#formulaGraph canvas')).toBeVisible();
  const initial = await page.locator('#networkStats').textContent();
  const edgeTooltip = await page.evaluate(() => {
    const options = window.echarts.getInstanceByDom(document.getElementById('formulaGraph')).getOption();
    const edge = options.series[0].links[0];
    return { source: edge.sourceName, target: edge.targetName, text: options.tooltip[0].formatter({ dataType: 'edge', data: edge }) };
  });
  expect(edgeTooltip.source).toBeTruthy();
  expect(edgeTooltip.target).toBeTruthy();
  expect(edgeTooltip.text).toContain(edgeTooltip.source);
  expect(edgeTooltip.text).toContain(edgeTooltip.target);
  for (const view of ['stats', 'directory', 'zheng', 'network']) {
    await page.locator('[data-formula-view="' + view + '"]').click();
    await expect(page).toHaveURL(/herb=gancao/);
  }
  await expect(page.locator('#networkStats')).toHaveText(initial);
});

test('new cultural exhibits have no duplicate ids, page errors or mobile overflow in all themes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['intro', 'heritage']) {
    await page.goto('/#/' + route);
    await expect(page.locator('.page.active')).toHaveAttribute('data-route', route);
    await expect(page.locator('.page.active h1')).toBeVisible();
    for (const theme of ['day', 'night', 'ink']) {
      await page.evaluate(value => window.HerbalTheme.setTheme(value), theme);
      const audit = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
        return { duplicates: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))], scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
      });
      expect(audit.duplicates, route + ' / ' + theme).toEqual([]);
      expect(audit.scroll, route + ' / ' + theme).toBeLessThanOrEqual(audit.client + 1);
    }
  }
  expect(errors).toEqual([]);
});
