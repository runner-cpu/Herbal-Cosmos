import {test,expect} from '@playwright/test';

test('coverage chart links to bounded, correctly filtered knowledge-card pages',async({page})=>{
 await page.goto('/#/home');
 await expect(page.locator('#collectionCoverage')).not.toHaveAttribute('open','');
 await page.locator('#collectionCoverage > summary').click();
 await expect(page.locator('#homeCoverageChart canvas')).toBeVisible();
 const expected=await page.evaluate(()=>window.HERBAL_DATA_COVERAGE);
 const summary=page.locator('#homeCoverageSummary');
 await expect(summary).toContainText('完整来源事实 '+expected.completeFacts+' 张');
 await expect(summary).toContainText('部分字段记录 '+expected.partialFacts+' 张');
 await expect(summary).toContainText('既有基础卡 '+expected.legacyFacts+' 张');
 await expect(summary).toContainText('开放图片 '+expected.imageBacked+' 张');
 await expect(summary).toContainText('逐行来源 '+expected.sourceCovered+' 张');
 await expect(page.locator('#homeCoverageControls a[href*="coverage=missing-image"]')).toContainText('图片待补 '+expected.placeholder);
 await page.locator('#homeCoverageControls a[href*="coverage=missing-image"]').click();
 await expect(page.locator('#coverageFilter')).toHaveValue('missing-image');
 await expect(page.locator('#herbResultCount')).toContainText(expected.placeholder+' 味');
 await expect(page.locator('#herbTableBody tr')).toHaveCount(Math.min(48,expected.placeholder));
 expect(await page.locator('#herbTableBody img').count()).toBe(0);
 const first=await page.locator('#herbTableBody tr').first().textContent();
 await page.locator('[data-featured-page="2"]').click();
 await expect(page.locator('#herbTableBody tr').first()).not.toHaveText(first);
 await page.locator('#resetFilters').click();
 await expect(page.locator('#herbResultCount')).toContainText(expected.featuredCards+' 味');
});

test('homepage guide and source sections keep coherent theme surfaces without duplicate navigation',async({page})=>{
 await page.goto('/#/home');
 await expect(page.locator('#mainNav > a')).toHaveCount(7);
 await expect(page.locator('#navMore')).toHaveCount(0);
 for(let i=0;i<3;i++){
  const colors=await page.locator('.home-dashboard,.home-source-band').evaluateAll(els=>els.map(el=>getComputedStyle(el).backgroundColor));
  expect(new Set(colors).size).toBe(1);
  expect(colors[0]).toBe('rgba(0, 0, 0, 0)');
  await page.locator('#themeToggle').click();
 }
});
