// 외부 Slidev 덱(배포본)을 슬라이드별 PNG로 저장.
// __slidev__ API가 빌드본엔 없으므로, 키보드로 처음→끝까지 한 스텝씩 넘기며
// 각 페이지를 "그 페이지 마지막(다 펼쳐진) 상태"로 덮어써 저장한다.
import { chromium } from 'playwright-chromium';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL_BASE = process.argv[2] || 'https://baizeai.github.io/talks/2025-06-11-kubecon-hk/';
const OUT = path.join(__dirname, 'shots', 'kubecon-hk');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const pad = (n) => String(n).padStart(2, '0');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });

await page.goto(URL_BASE + '#/1', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.click('body').catch(() => {});
// goto 다이얼로그 등 오버레이가 캡처에 끼지 않게 숨김(슬라이드 많으면 닫혀도 삐져나온다).
await page
  .addStyleTag({ content: '#slidev-goto-dialog,.slidev-nav,.slidev-controls,.autocomplete-list{display:none!important}' })
  .catch(() => {});

let guard = 0;
let lastSaved = null;
while (guard++ < 500) {
  const hash = await page.evaluate(() => location.hash);
  const pageNo = parseInt((hash.match(/#\/(\d+)/) || [])[1] || '1', 10);
  // 현재 상태를 해당 페이지 파일로 덮어씀 → 마지막 덮어쓴 게 "다 펼친 상태"
  await page.screenshot({ path: path.join(OUT, pad(pageNo) + '.png') });
  lastSaved = pageNo;
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(360);
  const newHash = await page.evaluate(() => location.hash);
  if (newHash === hash) break; // 더 진행 안 됨 → 끝
}

const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.png'));
console.log(`done: ${files.length} slides (last page ${lastSaved}) ->`, OUT);
await browser.close();
