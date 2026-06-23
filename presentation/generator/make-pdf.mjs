#!/usr/bin/env node
// make-pdf.mjs — 슬라이드 캡처(PNG)들을 묶어 PDF 생성.
// Slidev export 가 dev 마운트 이슈로 실패할 때의 폴백(Stage 12 §16).
// 실행: node presentation/generator/make-pdf.mjs  (먼저 presentation:capture 로 캡처 생성)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const presentationRoot = resolve(__dirname, "..");
const slidevDir = resolve(presentationRoot, "slidev");
const capDir = resolve(presentationRoot, "output", "captures");
const out = resolve(presentationRoot, "output", "presentation.pdf");

// capture.mjs 와 동일 전략: 로컬(slidev) playwright-chromium 우선 → 전역 폴백.
function loadPlaywright() {
  const candidates = [resolve(slidevDir, "node_modules")];
  try {
    const root = execSync("npm root -g", { encoding: "utf8" }).trim();
    if (root) candidates.push(root);
  } catch { /* ignore */ }
  if (process.platform === "linux") candidates.push("/opt/node22/lib/node_modules");
  for (const base of candidates) {
    for (const pkg of ["playwright", "playwright-chromium"]) {
      try { return createRequire(resolve(base, "_.js"))(pkg); } catch { /* next */ }
    }
  }
  try { return createRequire(import.meta.url)("playwright"); } catch { /* next */ }
  try { return createRequire(import.meta.url)("playwright-chromium"); } catch { return null; }
}

if (!existsSync(capDir)) {
  console.error("[make-pdf] 캡처 폴더 없음 — 먼저 `npm run presentation:capture`");
  process.exit(1);
}
const pngs = readdirSync(capDir).filter((f) => /\.png$/i.test(f)).sort();
if (!pngs.length) {
  console.error("[make-pdf] 캡처 없음 — 먼저 `npm run presentation:capture`");
  process.exit(1);
}

const playwright = loadPlaywright();
if (!playwright) {
  console.error("[make-pdf] playwright(-chromium) 모듈을 찾지 못했습니다. (cd presentation/slidev && npm install)");
  process.exit(1);
}

const slides = pngs
  .map((f) => {
    const b64 = readFileSync(resolve(capDir, f)).toString("base64");
    return `<div class="page"><img src="data:image/png;base64,${b64}"></div>`;
  })
  .join("\n");

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  .page { width:1280px; height:720px; page-break-after:always; display:flex; align-items:center; justify-content:center; background:#fff; }
  .page img { max-width:100%; max-height:100%; }
</style></head><body>${slides}</body></html>`;

const browser = await playwright.chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({ path: out, width: "1280px", height: "720px", printBackground: true });
await browser.close();
console.log(`[make-pdf] ${pngs.length}페이지 → ${out}`);
