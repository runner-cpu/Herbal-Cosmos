import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function buildFoodMedicine(base = root) {
  const sourcePath = path.join(base, 'data/sources/food-medicine-106.json');
  const outputPath = path.join(base, 'assets/js/data/food-medicine.generated.js');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const names = source.entries.map(item => item.name);
  if (source.entries.length !== 106 || new Set(names).size !== 106) throw new Error('food-medicine source must contain 106 unique items');
  const noticeIds = new Set(source.notices.map(item => item.id));
  if (source.entries.some(item => !noticeIds.has(item.notice))) throw new Error('food-medicine entry references an unknown notice');
  const directory = source.entries.map(item => ({ name: item.name, aliases: item.aliases || [], sourceRefs: [item.notice] }));
  const banner = '/* Generated from data/sources/food-medicine-106.json. Do not edit directly. */\n';
  const script = banner + 'window.FOOD_MEDICINE_REVISION = ' + JSON.stringify(source.sourceRevision) + ';\n'
    + 'window.FOOD_MEDICINE_DIRECTORY = ' + JSON.stringify(directory, null, 2) + ';\n';
  fs.writeFileSync(outputPath, script, 'utf8');
  return { count: directory.length, outputPath };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildFoodMedicine(root);
  console.log(`Generated ${result.count} food-medicine directory items`);
}
