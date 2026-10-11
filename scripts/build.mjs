import { readFile, readdir } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const required = ['index.html', 'src/main.js', 'src/styles.css', 'src/data/curated/schema.md'];
for (const file of required) await readFile(new URL(file, root));
const dataDir = new URL('src/data/curated/', root);
const jsonFiles = (await readdir(dataDir)).filter((file) => file.endsWith('.json'));
for (const file of jsonFiles) JSON.parse(await readFile(new URL(file, dataDir), 'utf8'));
console.log(`Build check passed: ${required.length} app files, ${jsonFiles.length} curated JSON files.`);
