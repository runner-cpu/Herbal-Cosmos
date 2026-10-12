import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.argv[2] || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent((request.url || '/').split('?')[0]);
  const safe = normalize(pathname).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/, '');
  const candidate = join(root, safe || 'index.html');
  try { const info = await stat(candidate); if (!info.isFile()) throw new Error('not file'); response.writeHead(200, { 'content-type': mime[extname(candidate)] || 'application/octet-stream' }); response.end(await readFile(candidate)); } catch { response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); response.end('Not found'); }
});
server.listen(port, () => console.log(`Herbal Cosmos trace server: http://localhost:${port}/`));
