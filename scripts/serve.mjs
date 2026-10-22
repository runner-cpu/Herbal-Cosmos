import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.argv[2] || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const compressible = new Set(['.html', '.js', '.css', '.json', '.svg']);

createServer(async (request, response) => {
  const pathname = decodeURIComponent((request.url || '/').split('?')[0]);
  const safe = normalize(pathname).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/, '');
  const candidate = join(root, safe || 'index.html');
  try {
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error('not file');
    const extension = extname(candidate);
    const type = mime[extension] || 'application/octet-stream';
    const body = await readFile(candidate);
    const immutable = /[?&]v=/.test(request.url || '') || /\/(assets|vendor)\//.test(pathname);
    const headers = {
      'content-type': type,
      'cache-control': extension === '.html' ? 'no-cache' : immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
    };
    let output = body;
    if (compressible.has(extension) && /\bgzip\b/.test(request.headers['accept-encoding'] || '')) {
      output = gzipSync(body, { level: 9 });
      headers['content-encoding'] = 'gzip';
      headers['vary'] = 'Accept-Encoding';
    }
    response.writeHead(200, headers);
    response.end(output);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
    response.end('Not found');
  }
}).listen(port, () => console.log(`Herbal Cosmos trace server: http://localhost:${port}/`));