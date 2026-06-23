#!/usr/bin/env node
/**
 * capture.mjs — 발표 슬라이드를 슬라이드별 PNG 로 캡처.
 *
 * 엔진 = Slidev 단일. slides.md → `slidev build`(dist) → 로컬 서버 → 라우트별 스크린샷.
 *  (dist 정적 서빙이라 dev 서버 charset 깨짐을 피한다 — reference/04 §7.)
 *
 * 목적: LLM 이 렌더된 슬라이드를 *직접 보고* per-slide contentScale(및 내용)을 조정(판단=LLM, 적용=코드).
 *  - 저장: presentation/output/captures/NN-<layout>.png (레이아웃명은 deck.json 기준).
 *  - 브라우저 경로: PLAYWRIGHT_BROWSERS_PATH env 우선.
 *  - 입력/도구 미비 시: 안내 후 exit 0 (throw 금지) — 워크플로우를 막지 않는다.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { createServer } from "node:http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const presentationRoot = resolve(__dirname, "..");
const slidevDir = resolve(presentationRoot, "slidev");
const distDir = resolve(slidevDir, "dist");
const deckPath = resolve(presentationRoot, "deck.json");
const capturesDir = resolve(presentationRoot, "output", "captures");

const BANNER = "[capture]";
const VIEWPORT = { width: 1280, height: 720 };
const PORT = 4799;
const pad2 = (n) => String(n).padStart(2, "0");
const info = (msg) => console.log(BANNER + " " + msg);

// 로컬(presentation/slidev) playwright-chromium 우선 → 전역 playwright 폴백.
function loadPlaywright() {
  const candidates = [resolve(slidevDir, "node_modules")]; // 키트 로컬 설치 우선
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

// deck.json 에서 보이는 슬라이드의 레이아웃 목록(dropped/blocked 제외) — 파일명용.
function visibleLayouts() {
  try {
    const deck = JSON.parse(readFileSync(deckPath, "utf8"));
    return (deck.slides || [])
      .filter((s) => s.implementationStatus !== "dropped" && s.implementationStatus !== "blocked")
      .map((s) => String(s.semanticLayout || "slide").replace(/[^a-z0-9-]/gi, "") || "slide");
  } catch { return null; }
}

async function launch(playwright) {
  try { return await playwright.chromium.launch(); }
  catch (e) {
    info("브라우저 실행 실패(브라우저 미설치 가능). 캡처를 건너뜁니다.");
    info("  PLAYWRIGHT_BROWSERS_PATH=" + (process.env.PLAYWRIGHT_BROWSERS_PATH || "(미설정)"));
    info("  원인: " + (e && e.message ? e.message.split("\n")[0] : e));
    return null;
  }
}

// ---- Slidev 캡처 ----
async function captureSlidev(playwright) {
  if (!existsSync(resolve(slidevDir, "package.json"))) return false;
  // 최신 slides.md 반영을 위해 매번 빌드.
  try {
    info("Slidev 빌드 중… (slides.md → dist)");
    execSync("npx slidev build --out dist", { cwd: slidevDir, stdio: "pipe" });
  } catch (e) {
    info("Slidev 빌드 실패 — 캡처를 건너뜁니다. (" + (e && e.message ? e.message.split("\n")[0] : e) + ")");
    return false;
  }
  if (!existsSync(resolve(distDir, "index.html"))) return false;

  const layouts = visibleLayouts() || [];
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml" };
  const server = createServer(async (q, r) => {
    const p = decodeURIComponent(q.url.split("?")[0]);
    const d = join(distDir, p);
    const f = existsSync(d) && extname(d) ? d : join(distDir, "index.html");
    r.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    r.end(await readFile(f));
  });
  await new Promise((res) => server.listen(PORT, res));

  const browser = await launch(playwright);
  if (!browser) { server.close(); return false; }
  try {
    mkdirSync(capturesDir, { recursive: true });
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
    const n = layouts.length || 1;
    for (let i = 1; i <= n; i++) {
      await page.goto(`http://localhost:${PORT}/${i}`, { waitUntil: "networkidle" });
      // 클릭 단계 콘텐츠를 모두 보이게(정적 캡처용).
      await page.addStyleTag({ content: ".slidev-vclick-target,.slidev-vclick-hidden{opacity:1!important;filter:none!important;visibility:visible!important;}" });
      await page.waitForTimeout(400);
      const layout = layouts[i - 1] || "slide";
      await page.screenshot({ path: resolve(capturesDir, pad2(i) + "-" + layout + ".png") });
    }
    info("Slidev 캡처 완료: " + n + "장 → " + capturesDir);
    info("  파일명: NN-<layout>.png. 이 PNG 를 직접 보고 슬라이드별 contentScale 을 조정하세요.");
    await browser.close();
    server.close();
    return true;
  } catch (e) {
    info("Slidev 캡처 중 오류 → 폴백: " + (e && e.message ? e.message.split("\n")[0] : e));
    try { await browser.close(); } catch { /* ignore */ }
    server.close();
    return false;
  }
}

async function main() {
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
    info("PLAYWRIGHT_BROWSERS_PATH 미설정 — 기본 경로 사용. 권장: `npm run presentation:capture`.");
  }
  const playwright = loadPlaywright();
  if (!playwright) {
    info("Playwright 모듈을 찾지 못했습니다(전역 설치 필요). 캡처를 건너뜁니다.");
    process.exit(0);
  }
  await captureSlidev(playwright);
  process.exit(0);
}

main();
