import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCatalogEntries, catalogScriptUrl, loadInBatches } from '../assets/js/core/catalog-loader.js';

test('catalog loader excludes review entries from default results', () => {
  assert.deepEqual(filterCatalogEntries([{ name: '甲', status: 'approved' }, { name: '乙', status: 'review' }]).map(item => item.name), ['甲']);
});

test('catalog chunk URL is deterministic', () => {
  assert.equal(catalogScriptUrl('c00'), 'data/catalog/chunk-c00.js');
});
test('bounded chunk requests preserve order and report progress', async () => {
  let active=0, peak=0; const progress=[];
  const rows=await loadInBatches([3,2,1,0,4,5],async n=>{active++;peak=Math.max(peak,active);await new Promise(resolve=>setTimeout(resolve,n+1));active--;return n*2;},{concurrency:3,onProgress:n=>progress.push(n)});
  assert.equal(peak,3); assert.deepEqual(rows,[6,4,2,0,8,10]); assert.deepEqual(progress,[1,2,3,4,5,6]);
});
test('failure drains active requests before allowing retry', async () => {
  let active=0;
  await assert.rejects(loadInBatches([0,1,2,3,4],async n=>{active++;await new Promise(resolve=>setTimeout(resolve,2));active--;if(n===0)throw new Error('offline');return n;}),/offline/);
  assert.equal(active,0);
  assert.deepEqual(await loadInBatches([0,1],async n=>n),[0,1]);
});
