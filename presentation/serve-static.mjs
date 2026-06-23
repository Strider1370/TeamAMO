#!/usr/bin/env node
// serve-static.mjs — 무의존 정적 파일 서버 (UTF-8 charset 강제 + SPA 폴백).
// 사용: node presentation/serve-static.mjs <root-dir> <port> [spa]
//   예) node presentation/serve-static.mjs presentation/slidev/dist 3030 spa
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join, extname, normalize } from 'node:path';

const root = resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 3032);
const spa = process.argv[4] === 'spa';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
};
async function tryFile(p) {
  try { const s = await stat(p); if (s.isFile()) return p; if (s.isDirectory()) return tryFile(join(p, 'index.html')); } catch {}
  return null;
}
createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let file = await tryFile(join(root, safe));
  if (!file && spa) file = await tryFile(join(root, 'index.html'));
  if (!file) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); return res.end('404'); }
  const body = await readFile(file);
  res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream' });
  res.end(body);
}).listen(port, () => console.log(`[serve-static] ${root} -> http://localhost:${port}/ (spa=${spa})`));
