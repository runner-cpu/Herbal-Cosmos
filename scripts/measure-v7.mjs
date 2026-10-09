/** Reproducible local gzip measurements; never a claim about actual Pages or phones. */
import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { spawn } from 'node:child_process';
import os from 'node:os';
const port = Number(process.env.PLAYWRIGHT_PORT || 4187);
const diagnose = process.argv.includes('--diagnose');
const screenshotOnly = process.argv.includes('--screenshots-only');
const origin = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['scripts/serve-local.mjs', String(port), '--gzip'], {stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Server exited '+code)));});
const browser = await chromium.launch();
const html = fs.readFileSync('index.html','utf8');
const assets = [...html.matchAll(/<script[^>]+src="([^"?]+)(?:\?[^\"]*)?"/g)].map(m=>m[1]);
const bytes = name => {const raw=fs.readFileSync(name);return {raw:raw.length,gzip:gzipSync(raw).length};};
const result = { date:new Date().toISOString(), conditions:{server:'serve-local.mjs --gzip, loopback Chromium',cache:'new context per sample, browser cache disabled, SW blocked',network:{latencyMs:120,downloadBytesPerSecond:200000,uploadBytesPerSecond:100000},samples:diagnose||screenshotOnly?1:3,frameSeconds:diagnose||screenshotOnly?0:30},staticJs:assets.map(name=>({name,...bytes(name)})),renderer:bytes('assets/vendor/cosmos-webgl.js'),echarts:bytes('assets/vendor/echarts.min.js'),profiles:[]};
result.host={platform:os.platform(),release:os.release(),cpu:os.cpus()[0]?.model,logicalCpus:os.cpus().length,node:process.version,chromium:browser.version()};
result.staticTotal=result.staticJs.reduce((total,item)=>({raw:total.raw+item.raw,gzip:total.gzip+item.gzip}),{raw:0,gzip:0});
try {
  fs.mkdirSync('output/review',{recursive:true});
  for(const [name,width,height,cpu] of [['desktop',1440,900,1],['mobile',375,812,4]]) {
    const profile={name,width,height,cpuThrottle:cpu,samples:[]};
    for(let repetition=0;repetition<(diagnose||screenshotOnly?1:3);repetition++) {
      const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block',isMobile:name==='mobile',hasTouch:name==='mobile',deviceScaleFactor:1});
      const page=await context.newPage(), session=await context.newCDPSession(page);
      await session.send('Network.enable');
      await session.send('Network.setCacheDisabled',{cacheDisabled:true});
      await session.send('Network.emulateNetworkConditions',{offline:false,latency:120,downloadThroughput:200000,uploadThroughput:100000});
      await session.send('Emulation.setCPUThrottlingRate',{rate:cpu});
      let transfer=0, responses=0;
      session.on('Network.loadingFinished',event=>{transfer+=event.encodedDataLength;responses++;});
      await page.addInitScript(()=>{
        window.__perf={lcp:0,cls:0,longTasks:[],shifts:[]};
        new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__perf.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
        new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput){window.__perf.cls+=entry.value;window.__perf.shifts.push({at:entry.startTime,value:entry.value,sources:entry.sources.map(s=>({node:s.node?.id||s.node?.className||s.node?.nodeName,previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))});}}).observe({type:'layout-shift',buffered:true});
        new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__perf.longTasks.push(entry.duration);}).observe({type:'longtask',buffered:true});
      });
      await page.goto(origin+'/#/home',{waitUntil:'networkidle'});
      await page.waitForTimeout(1500);
      const sample=await page.evaluate(()=>({...window.__perf,renderer:window.__HERBAL_DEBUG__?.cosmosPerf?.().renderer,particles:window.__HERBAL_DEBUG__?.cosmosPerf?.().particleCount}));
      sample.transferBytes=transfer;sample.responses=responses;
      if(repetition===0&&!diagnose) {
        const cadence=screenshotOnly?null:await page.evaluate(()=>new Promise(resolve=>{
          const frames=[],start=performance.now(),longStart=window.__perf.longTasks.length;let last=start;
          function tick(now){frames.push(now-last);last=now;if(now-start<30000)requestAnimationFrame(tick);else{frames.sort((a,b)=>a-b);resolve({durationMs:now-start,frames:frames.length,medianMs:frames[Math.floor(frames.length*.5)],p95Ms:frames[Math.floor(frames.length*.95)],maxMs:frames.at(-1),longTasks:window.__perf.longTasks.slice(longStart)});}}
          requestAnimationFrame(tick);
        }));
        profile.cadence=cadence;
        if(name==='desktop') {
          await page.screenshot({path:'output/review/v7-home-1440.png'});
          // A direct focus link is an equal UI entry to the selected home object.
          await page.goto(origin+'/#/home?focus=star&id=gancao',{waitUntil:'networkidle'});
          await page.evaluate(()=>window.HerbalCosmos.focusHerb('gancao',{animate:false}));
          await expect(page.locator('#cosmosDetail')).toBeVisible();
          await expect(page.locator('#cosmosDetail h2')).toHaveText('甘草');
          await expect.poll(()=>page.locator('#cosmosDetail img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
          await page.waitForTimeout(700);
          await page.screenshot({path:'output/review/v7-home-selected-1440.png'});
        } else {
          await page.evaluate(()=>window.HerbalTheme.setTheme('night'));
          await page.screenshot({path:'output/review/v7-home-night-375.png'});
          await page.goto(origin+'/#/exhibit?chapter=inherit',{waitUntil:'networkidle'});
          await page.screenshot({path:'output/review/v7-inherit-night-375.png',fullPage:true});
        }
      }
      profile.samples.push(sample);
      await context.close();
    }
    const lcp=profile.samples.map(s=>s.lcp).sort((a,b)=>a-b);profile.lcpMedianMs=lcp[Math.floor(lcp.length/2)];profile.lcpMaxMs=lcp.at(-1);profile.clsMax=Math.max(...profile.samples.map(s=>s.cls));result.profiles.push(profile);
  }
  console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.kill();}
