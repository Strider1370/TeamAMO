#!/usr/bin/env node
/**
 * generate-scenes.mjs — presentation/script.md → presentation/scenes.json
 *
 * ⚠️ 스켈레톤(스캐폴드). 핵심 로직 미구현 — Stage 09 첫 실사용 때 완성.
 * 현재는 입력을 읽고 구조만 잡으며, 파일을 쓰지 않고 안내만 출력한다(throw 금지).
 *
 * 완성 시 책임:
 *  - script.md 의 섹션 헤더/마커를 scene 단위로 분해
 *  - 각 scene 에 role(answer-first/problem/insight/...) 추정 부여
 *  - message/script/visualIntent/contentType/requiredAssets/wowMoment 채움
 *  - scenes.schema.json 형태로 직렬화
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const presentationRoot = resolve(__dirname, "..");
const scriptPath = resolve(presentationRoot, "script.md");
const outPath = resolve(presentationRoot, "scenes.json");

const BANNER = "[generate-scenes] 아직 미구현(스캐폴드) — Stage 09 첫 실사용 때 완성";

if (!existsSync(scriptPath)) {
  console.log(`${BANNER}`);
  console.log(`  입력 없음: ${scriptPath} (script.md 작성 후 다시 실행)`);
  process.exit(0);
}

const script = readFileSync(scriptPath, "utf8");
console.log(BANNER);
console.log(`  입력 읽음: ${scriptPath} (${script.length} bytes)`);
console.log(`  출력 예정: ${outPath}`);

// TODO(Stage 09): script.md 파싱 → scene 분해.
//   1) '## ' 헤더 또는 <!-- scene:role --> 마커로 구간 분리
//   2) 구간 텍스트에서 message(첫 문장) / script(원문) 추출
//   3) role 추정(키워드: 문제→problem, 데모→demo, 한계→limitation ...)
//   4) wowMoment/comparison/contentType 힌트 부여
//   5) scenes.schema.json 구조로 JSON.stringify 후 writeFileSync(outPath)
// const scenes = { version: 1, title: "TODO", scenes: [] };

console.log("  (분해 로직 미구현 — scenes.json 미생성)");
process.exit(0);
