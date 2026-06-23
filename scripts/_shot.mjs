// 데모 스크린샷 — 입력화면 + 결과화면. 실행: node scripts/_shot.mjs
import { chromium } from 'playwright';

const URL = process.env.SHOT_URL || 'http://localhost:3000';
const TEXT = '아버지가 뇌졸중으로 쓰러져 곧 퇴원하시는데 반신마비가 왔어요. 어머니는 혼자 사시는데 못 모시고, 저는 직장 다니면서 모셔야 해서 막막합니다. 형편도 빠듯하고 병원비도 많이 나왔어요.';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 400, height: 900 }, deviceScaleFactor: 2 });
await p.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForSelector('textarea', { timeout: 30000 });
await p.screenshot({ path: 'design/mockups/shot-01-input.png', fullPage: true });
console.log('1) 입력화면 저장');

await p.fill('textarea', TEXT);
await p.getByRole('button', { name: /정리해줘/ }).click();
await p.getByText('오늘 할 일', { exact: false }).waitFor({ timeout: 45000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: 'design/mockups/shot-02-result.png', fullPage: true });
console.log('2) 결과화면 저장');

await b.close();
console.log('완료: design/mockups/shot-01-input.png, shot-02-result.png');
