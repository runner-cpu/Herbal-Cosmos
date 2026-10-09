import { build } from 'esbuild';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
await build({ entryPoints: ['assets/js/pages/cosmos-webgl.js'], outfile: 'assets/vendor/cosmos-webgl.js', bundle: true, minify: true, format: 'esm', target: 'es2020', legalComments: 'eof' });
const bytes = fs.readFileSync('assets/vendor/cosmos-webgl.js');
if (bytes.length > 550000 || gzipSync(bytes).length > 140000) throw new Error('Optional renderer exceeds its own 550 KB / 140 KB gzip budget.');
console.log(`Optional renderer: ${bytes.length} bytes / ${gzipSync(bytes).length} gzip bytes`);
