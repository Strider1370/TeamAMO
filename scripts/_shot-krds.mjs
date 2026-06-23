// KRDS 재디자인 검증 — 모바일 입력(fold)·결과 + 데스크톱 결과. 실행: node scripts/_shot-krds.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
const TEXT = '아버지가 뇌졸중으로 쓰러져 곧 퇴원하시는데 반신마비가 왔어요. 어머니는 혼자 사시는데 못 모시고, 저는 직장 다니면서 모셔야 해서 막막합니다. 형편도 빠듯해요.';

// 모바일 390
const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
await m.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 90000 });
await m.waitForSelector('#situation', { timeout: 60000 });
await m.screenshot({ path: 'design/mockups/krds-mobile-input.png' });
console.log('1) 모바일 입력(fold)');
await m.fill('#situation', TEXT);
await m.getByRole('button', { name: /정리해/ }).click();
await m.getByText(/오늘 할 일을 정리했어요/).waitFor({ timeout: 60000 });
await m.waitForTimeout(1200);
await m.screenshot({ path: 'design/mockups/krds-mobile-result.png', fullPage: true });
console.log('2) 모바일 결과(full)');

// 데스크톱 1100
const d = await b.newPage({ viewport: { width: 1100, height: 900 } });
await d.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await d.fill('#situation', TEXT);
await d.getByRole('button', { name: /정리해/ }).click();
await d.getByText(/오늘 할 일을 정리했어요/).waitFor({ timeout: 60000 });
await d.waitForTimeout(1200);
await d.screenshot({ path: 'design/mockups/krds-desktop-result.png' });
console.log('3) 데스크톱 결과');
await b.close();
