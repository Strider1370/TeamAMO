#!/usr/bin/env node
/**
 * select-layouts.mjs — scenes.json + layout-registry.json → 각 scene 에 semanticLayout 배정
 *
 * ⚠️ 스켈레톤(스캐폴드). 규칙 기반 매핑 골격만 둠 — Stage 09 첫 실사용 때 완성.
 * 현재는 입력/레지스트리를 읽고 규칙표를 로드하지만 결과를 쓰지 않고 안내만 출력한다(throw 금지).
 *
 * 완성 시 책임 (Doc2 §10):
 *  - layout-registry.selectionRules.rules 를 위→아래로 평가해 첫 일치 layout 배정
 *  - 동률/모호 시 보조 신호(메시지 길이, 숫자 존재, 이미지 존재, 직전 레이아웃 반복 회피)로 결정
 *  - 선택 이유(layoutReason) 기록
 *  - 결과를 deck.json 시드(또는 scenes.json 의 semanticLayout 필드)로 출력
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const presentationRoot = resolve(__dirname, "..");
const scenesPath = resolve(presentationRoot, "scenes.json");
const registryPath = resolve(__dirname, "layout-registry.json");

const BANNER = "[select-layouts] 아직 미구현(스캐폴드) — Stage 09 첫 실사용 때 완성";

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const rules = registry.selectionRules?.rules ?? [];
const fallback = registry.selectionRules?.fallbackLayout ?? "card-grid";

/**
 * 규칙 매처(참고용 골격). scene 의 필드를 rule.when 의 모든 키와 비교해 첫 일치 반환.
 * TODO(Stage 09): 보조 신호 기반 tie-break 추가.
 */
function matchLayout(scene) {
  for (const rule of rules) {
    const when = rule.when ?? {};
    const ok = Object.entries(when).every(([k, v]) => scene[k] === v);
    if (ok) return { layout: rule.layout, reason: `rule:${JSON.stringify(when)}` };
  }
  return { layout: fallback, reason: "fallback" };
}

if (!existsSync(scenesPath)) {
  console.log(BANNER);
  console.log(`  입력 없음: ${scenesPath} (generate-scenes 먼저 실행)`);
  console.log(`  규칙 ${rules.length}개 로드됨, fallback=${fallback}`);
  process.exit(0);
}

const scenes = JSON.parse(readFileSync(scenesPath, "utf8"));
console.log(BANNER);
console.log(`  입력 읽음: ${scenesPath} (scenes ${scenes.scenes?.length ?? 0}개)`);
console.log(`  규칙 ${rules.length}개 로드됨, fallback=${fallback}`);

// 미리보기(드라이런): 실제 배정/쓰기는 하지 않음.
for (const scene of scenes.scenes ?? []) {
  const { layout, reason } = matchLayout(scene);
  console.log(`    ${scene.id} role=${scene.role} → ${layout} (${reason})`);
}

// TODO(Stage 09): 위 결과를 deck.json 시드로 직렬화하고, tie-break/반복회피 적용 후 writeFileSync.
console.log("  (배정 결과 미저장 — 드라이런)");
process.exit(0);
