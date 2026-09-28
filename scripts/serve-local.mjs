/** Project-local preview/test server, with no Python dependency or directory listing. */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.argv[2]||4173);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid preview port');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.md':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const url=new URL(req.url,'http://127.0.0.1');
  const decoded=decodeURIComponent(url.pathname);
  const target=path.resolve(root,'.'+decoded+(decoded.endsWith('/')?'index.html':''));
  const actual=await fs.realpath(target);
  const relative=path.relative(root,actual);
  if(relative.startsWith('..')||path.isAbsolute(relative)||relative.split(path.sep).some(s=>s.startsWith('.'))){res.writeHead(403).end();return;}
  const stat=await fs.stat(actual);if(!stat.isFile()){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(actual)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:await fs.readFile(actual));
 }catch{if(!res.headersSent)res.writeHead(404);res.end();}
});
server.listen({host:'127.0.0.1',port,backlog:512},()=>console.log('Herbal Cosmos preview: http://127.0.0.1:'+port));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
