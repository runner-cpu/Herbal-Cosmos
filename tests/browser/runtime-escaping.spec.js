import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

const PAYLOAD = '<img src=x onerror="window.__XSS__=1">';

/* 这三处 ECharts tooltip 的 formatter 返回的是 HTML，ECharts 会把它塞进 tooltip 的
   innerHTML。药材名、四气、五味、方剂功效都来自数据记录，所以它们必须转义后再拼。
   formatter 是确定性纯函数，可以直接读出来调用——这比等 hover 更可靠，也是唯一能
   在浏览器里固定这条契约的办法。 */
async function waitForCharts(page) {
  await expect.poll(() => page.evaluate(() => window.HerbalChartManager?._instances?.size || 0), { timeout: 30_000 }).toBeGreaterThan(0);
  await expect.poll(async () => {
    const before = await page.evaluate(() => window.HerbalChartManager._instances.size);
    await page.waitForTimeout(400);
    return await page.evaluate((size) => window.HerbalChartManager._instances.size === size, before);
  }, { timeout: 20_000 }).toBe(true);
}

async function tooltipSamples(page) {
  return page.evaluate((sample) => {
    const out = [];
    for (const [key, instance] of (window.HerbalChartManager?._instances || [])) {
      const formatter = instance?.getOption?.()?.tooltip?.[0]?.formatter;
      if (typeof formatter !== 'function') continue;
      for (const dataType of ['node', 'edge']) {
        try {
          const value = String(formatter({
            value: [0, 0, 0],
            data: { name: sample, id: 'f_sijunzitang', sourceName: sample, targetName: sample },
            dataType, name: sample, seriesName: '方剂'
          }));
          out.push({ key, dataType, value });
        } catch (error) {
          out.push({ key, dataType, error: error.message.slice(0, 80) });
        }
      }
    }
    return out;
  }, PAYLOAD);
}

test('formula graph tooltip escapes the herb name and the formula effect', async ({ page }) => {
  await page.goto('/#/formula?f=sijunzitang');
  await waitForCharts(page);
  const samples = (await tooltipSamples(page)).filter(item => item.key === 'formulaGraph');
  expect(samples.length).toBeGreaterThan(0);
  for (const sample of samples) {
    expect(sample.error, JSON.stringify(sample)).toBeUndefined();
    // 修复前这里返回的是活的 <img，ECharts 会把它当 HTML 插进 tooltip。
    expect(sample.value.includes('<img'), JSON.stringify(sample)).toBe(false);
    expect(sample.value.includes('&lt;img'), JSON.stringify(sample)).toBe(true);
  }
});

test('herb and qiwei tooltips escape every field they print', async ({ page }) => {
  await page.goto('/#/herb?id=renshen');
  await waitForCharts(page);
  const herb = (await tooltipSamples(page)).filter(item => item.key === 'herbQiwei');
  expect(herb.length, 'the herb qiwei tooltip must still register a formatter').toBeGreaterThan(0);

  await page.goto('/#/qiwei');
  await waitForCharts(page);
  const qiwei = (await tooltipSamples(page)).filter(item => ['qiweiMatrix', 'qiweiFlow'].includes(item.key));
  expect(qiwei.length).toBeGreaterThan(0);

  for (const sample of [...herb, ...qiwei]) {
    expect(sample.error, JSON.stringify(sample)).toBeUndefined();
    expect(sample.value.includes('<img'), JSON.stringify(sample)).toBe(false);
  }
});

test('a payload in a knowledge card never executes on the routes that print it', async ({ page }) => {
  const source = await page.request.get('/assets/js/data/featured.js').then(response => response.text());
  const at = source.indexOf(`{id:'renshen', name:'人参'`);
  expect(at, 'the renshen record must still be in the runtime data').toBeGreaterThan(-1);
  const lineEnd = source.indexOf('\n', at);
  const record = source.slice(at, lineEnd)
    .replace("name:'人参'", `name:'${PAYLOAD}'`)
    .replace("cat:'补虚药'", `cat:'${PAYLOAD}'`)
    .replace("qi:'微温'", `qi:'${PAYLOAD}'`)
    .replace("wei:'甘'", `wei:'${PAYLOAD}'`);
  const patched = source.slice(0, at) + record + source.slice(lineEnd);
  expect(patched).not.toBe(source);

  await page.route('**/assets/js/data/featured.js*', route => route.fulfill({
    status: 200, contentType: 'application/javascript; charset=utf-8', body: patched
  }));
  for (const hash of ['/#/home', '/#/herbs', '/#/herb?id=renshen', '/#/formula?f=sijunzitang']) {
    await page.goto(hash);
    await page.waitForTimeout(1200);
    const state = await page.evaluate(() => ({
      executed: window.__XSS__ || 0,
      live: document.querySelectorAll('img[src="x"]').length
    }));
    expect(state, hash + ' must render the payload as text').toEqual({ executed: 0, live: 0 });
    // 载荷确实进了页面：它以文本形式出现在某处，说明上面两条不是「数据没加载」造成的。
    expect(await page.evaluate((payload) => document.body.innerText.includes(payload), PAYLOAD), hash + ' never rendered the payload').toBe(true);
  }
});
