// 가상 진단서/퇴원소견서 HTML → PNG. 실행: node scripts/_render-discharge.mjs
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const html = path.resolve('design/mockups/sample-discharge.html');
const out = path.resolve('design/mockups/sample-discharge.png');

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log('saved', out);
