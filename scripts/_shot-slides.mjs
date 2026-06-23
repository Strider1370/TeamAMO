// Slidev 슬라이드 캡처(렌더 확인). 실행: node scripts/_shot-slides.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
for (const n of [1, 3, 6]) {
  await p.goto(`http://localhost:3030/${n}`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `design/mockups/slide-${n}.png` });
  console.log(`slide ${n} 캡처`);
}
await b.close();
