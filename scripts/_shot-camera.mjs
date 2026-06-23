// 카메라 데모 캡처 — 가상 진단서 업로드 → 결과. 실행: node scripts/_shot-camera.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 400, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForSelector('input[type=file]', { state: 'attached', timeout: 30000 });
await p.setInputFiles('input[type=file]', 'design/mockups/sample-discharge.png');
await p.getByText(/가지를 찾았어요/).waitFor({ timeout: 60000 });
await p.waitForTimeout(1500);
await p.getByText(/가지를 찾았어요/).scrollIntoViewIfNeeded();
await p.screenshot({ path: 'design/mockups/shot-04-camera-result.png' });
await b.close();
console.log('카메라 결과 캡처: design/mockups/shot-04-camera-result.png');
