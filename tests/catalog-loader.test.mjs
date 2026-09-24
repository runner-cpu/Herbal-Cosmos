import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCatalogEntries, catalogScriptUrl } from '../assets/js/core/catalog-loader.js';

test('catalog loader excludes review entries from default results', () => {
  assert.deepEqual(filterCatalogEntries([{ name: '甲', status: 'approved' }, { name: '乙', status: 'review' }]).map(item => item.name), ['甲']);
});

test('catalog chunk URL is deterministic', () => {
  assert.equal(catalogScriptUrl('c00'), 'data/catalog/chunk-c00.js');
});
