import { build } from 'esbuild';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';

// The apothecary drawer wall is an on-demand layer, so it carries its own
// budget instead of sharing the star-map renderer's.
const RAW_LIMIT = 560_000;
const GZIP_LIMIT = 145_000;

await build({
  entryPoints: ['assets/js/pages/apothecary-webgl.js'],
  outfile: 'assets/vendor/apothecary-webgl.js',
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2020',
  legalComments: 'eof'
});
const bytes = fs.readFileSync('assets/vendor/apothecary-webgl.js');
const gzip = gzipSync(bytes).length;
if (bytes.length > RAW_LIMIT || gzip > GZIP_LIMIT) {
  throw new Error(`Apothecary renderer exceeds its own ${RAW_LIMIT} B / ${GZIP_LIMIT} gzip budget: ${bytes.length} B / ${gzip} gzip.`);
}
console.log(`Apothecary renderer: ${bytes.length} bytes / ${gzip} gzip bytes`);
