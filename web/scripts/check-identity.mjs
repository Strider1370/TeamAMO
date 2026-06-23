#!/usr/bin/env node
// web/scripts/check-identity.mjs — 스캐폴드의 자리표시(placeholder) 정체성이 실제 서비스로
// 교체됐는지 검사한다. 남아 있으면 exit 1 (파일·줄 출력).
//
// 왜: 스캐폴드는 서비스명/nav/타이틀/footer 를 일부러 자리표시로 둔다(교체 전제).
//     Stage 05 빌드 마감에서 이 교체가 빠지면 "메뉴 1·2·3 / 스타터 키트"가 그대로 발표에 나간다.
//     이 검사를 gate:build 에 물려서 자리표시가 남으면 빌드 게이트를 통과 못 하게 한다.
//
// 사용: node web/scripts/check-identity.mjs   (= npm run web:check-identity)
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const WEB = resolve(fileURLToPath(import.meta.url), "../.."); // web/
const SKIP = new Set(["node_modules", ".next", "dist", ".turbo", "out", "coverage"]);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".mdx", ".md", ".css"]);

// 스캐폴드 자리표시 문자열. 이게 남아 있으면 실제 서비스로 교체가 안 된 것.
const PLACEHOLDERS = [
  "공공 서비스 스타터",
  "KRDS 스타터 키트",
  "한국 공공 서비스 해커톤 스타터",
  "새 주제를 여기에 구현하세요",
  "새 주제 서비스명으로 교체",
  "메뉴 1",
  "메뉴 2",
  "메뉴 3",
];

if (!existsSync(WEB)) {
  console.log("[check-identity] web/ 없음 — 스킵.");
  process.exit(0);
}

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXT.has(extname(name))) {
      const lines = readFileSync(p, "utf8").split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const ph of PLACEHOLDERS) {
          if (line.includes(ph)) {
            hits.push({ file: relative(WEB, p), line: i + 1, ph, text: line.trim().slice(0, 80) });
          }
        }
      });
    }
  }
}

try {
  walk(WEB);
} catch (e) {
  console.error("[check-identity] 스캔 실패:", e.message);
  process.exit(2);
}

if (hits.length === 0) {
  console.log("[check-identity] OK — 스캐폴드 자리표시가 모두 교체됨.");
  process.exit(0);
}

console.error(`[check-identity] FAIL — 교체 안 된 스캐폴드 자리표시 ${hits.length}곳:`);
for (const h of hits) console.error(`  web/${h.file}:${h.line}  "${h.ph}"  →  ${h.text}`);
console.error(
  "\n  실제 서비스 정체성으로 교체하세요:\n" +
    "  - Header/Footer 서비스명, Header nav 항목(메뉴 1·2·3)\n" +
    "  - app/layout.tsx metadata title/description\n" +
    "  - app/page.tsx badge/heading"
);
process.exit(1);
