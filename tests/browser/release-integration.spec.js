import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

for(const width of [320,375,768,1440]) {
  test(width+'px cold home reserves its readable layout while knowledge scripts are pending', async ({page})=>{
    await page.setViewportSize({width,height:900});
    let release;
    const gate=new Promise(resolve=>{release=resolve;});
    await page.route('**/assets/js/data/featured.js?*',async route=>{await gate;await route.continue();});
    await page.addInitScript(()=>{
      window.__releaseCLS=0;
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__releaseCLS+=e.value;}).observe({type:'layout-shift',buffered:true});
    });
    await page.goto('/#/home',{waitUntil:'commit'});
    try {
      await expect(page.locator('.hero-overlay h1')).toBeVisible();
      await expect(page.locator('#cosmosHero')).toHaveCSS('display','grid');
      const before=await page.locator('.cosmos-scene').boundingBox();
      release();
      await expect(page.locator('#cosmosControls')).toBeVisible();
      await page.waitForTimeout(700);
      const after=await page.locator('.cosmos-scene').boundingBox();
      for(const field of ['x','y','width'])expect(Math.abs(after[field]-before[field]),field+' remains stable').toBeLessThanOrEqual(1);
      expect(await page.evaluate(()=>window.__releaseCLS)).toBeLessThanOrEqual(.1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
    } finally {release();}
  });
}

test('optional archive analyses initialize only when their visible disclosure opens', async ({ page }) => {
  const bundles = [];
  page.on('request', r => { if(r.url().includes('echarts.min.js')) bundles.push(r.url()); });
  await page.goto('/#/herbs?anchor=home-collection');
  await expect(page.locator('#archiveProvenance')).toBeVisible();
  await expect(page.locator('#provinceDistributionChart canvas')).toHaveCount(0);
  await expect(page.locator('#homeCoverageChart canvas')).toHaveCount(0);
  expect(bundles).toEqual([]);
  await page.locator('#collectionCoverage summary').click();
  await expect(page.locator('#homeCoverageChart canvas')).toBeVisible();
  await expect(page.locator('#provinceDistributionChart canvas')).toHaveCount(0);
  await page.goto('/#/herbs');
  await expect(page.locator('#atlasAnalysis')).not.toHaveAttribute('open', '');
  await expect(page.locator('#factCompletenessChart canvas')).toHaveCount(0);
  await page.locator('#atlasAnalysis summary').click();
  await expect(page.locator('#provinceDistributionChart canvas')).toBeVisible();
  await expect(page.locator('#factCompletenessChart canvas')).toBeVisible();
});

test('session-only note status survives revisiting without overwriting unsaved favorite drafts', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = function () { throw new DOMException('blocked', 'SecurityError'); }; });
  await page.goto('/#/exhibit?chapter=recognize&selected=gancao');
  await page.locator('.exhibit-note-disclosure summary').click();
  await page.getByLabel('我的理解').fill('自己的草稿');
  await page.locator('.exhibit-detail-actions [data-fav]').click();
  await expect(page.locator('.exhibit-detail-actions [data-fav]')).toHaveText('已收藏');
  await expect(page.getByLabel('我的理解')).toHaveValue('自己的草稿');
  await page.getByRole('button', {name:'保存到本机'}).click();
  await expect(page.locator('#exhibitNoteStatus')).toContainText('本次页面');
  await page.locator('[data-chapter="compose"]').click();
  await page.goBack();
  await expect(page.locator('.exhibit-note-disclosure summary')).toContainText('本次页面暂存');
  await expect(page.locator('#exhibitNoteStatus')).toContainText('本机存储不可用');
  await expect(page.getByLabel('我的理解')).toHaveValue('自己的草稿');
});

test('real previous worker upgrades its old shell without mixing scripts and keeps local reading state', async ({ browser }, testInfo) => {
  test.setTimeout(60000);
  const root = process.cwd(), ref = '37c61a7';
  const old = new Map();
  const readOld = name => execFileSync('git', ['show', ref + ':' + name], { cwd:root });
  const worker = readOld('sw.js');
  const urls = [...worker.toString().matchAll(/'\.\/([^']*)'/g)].map(m => m[1] || 'index.html');
  for(const name of new Set(['sw.js','index.html', ...urls])) {
    try { old.set('/'+name, readOld(name)); } catch { /* generated request paths are covered by current files */ }
  }
  let current = false;
  const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml'};
  const server = http.createServer((req,res) => {
    const pathname = new URL(req.url,'http://localhost').pathname;
    const name = pathname === '/' ? '/index.html' : pathname;
    try {
      const bytes = !current && old.has(name) ? old.get(name) : fs.readFileSync(path.join(root,name));
      res.writeHead(200, {'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const {viewport,isMobile,hasTouch,deviceScaleFactor,userAgent} = testInfo.project.use;
  const context = await browser.newContext({serviceWorkers:'allow',viewport,isMobile,hasTouch,deviceScaleFactor,userAgent});
  const page = await context.newPage(), errors=[];
  page.on('pageerror', error => errors.push(error.message));
  const origin = 'http://127.0.0.1:'+server.address().port;
  try {
    await page.goto(origin+'/#/intro');
    await expect(page.locator('#introExhibit h1')).toBeVisible();
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBeTruthy();
    const oldCaches = await page.evaluate(() => caches.keys());
    expect(oldCaches.some(name=>name.includes('v21'))).toBeTruthy();
    await page.evaluate(() => {
      localStorage.setItem('herbal_favs','["gancao"]');
      localStorage.setItem('herbal_theme','night');
      localStorage.setItem('herbal_exhibition_notes_v1','{"legacy":{"takeaway":"keep me"}}');
    });
    current = true;
    await page.goto(origin+'/?upgrade=1#/exhibit?chapter=compose');
    await expect(page.locator('#exhibitionRoot')).toHaveAttribute('data-chapter','compose');
    await expect(page.locator('#mainNav > a')).toHaveCount(3);
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    await expect(page.locator('#appUpdate')).toBeVisible();
    await Promise.all([page.waitForEvent('load'), page.locator('#appUpdateRefresh').click()]);
    await expect.poll(() => page.evaluate(async () => (await caches.keys()).every(name=>!name.includes('v21')))).toBeTruthy();
    await expect(page.locator('#exhibitionRoot')).toHaveAttribute('data-chapter','compose');
    expect(await page.evaluate(()=>localStorage.getItem('herbal_favs'))).toBe('["gancao"]');
    expect(await page.evaluate(()=>localStorage.getItem('herbal_theme'))).toBe('night');
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('herbal_exhibition_notes_v1')).legacy.takeaway)).toBe('keep me');
    expect(await page.evaluate(()=>window.HERBS.filter(h=>!['formula-material','directory-only'].includes(h.kind)).length)).toBe(902);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('#exhibitionRoot')).toHaveAttribute('data-chapter','compose');
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
