#!/usr/bin/env node
/**
 * validate-deck.mjs — deck.json을 deck.schema.json 핵심 규칙으로 검증한다.
 *
 * 실동작 스크립트(스켈레톤 아님). 외부 의존성 없이 순수 node로 수기 검증한다.
 * - JSON.parse 성공 여부
 * - 필수 필드(version/meta/slides)와 슬라이드별 필수 필드(id/semanticLayout/content)
 * - semanticLayout 이 layout-registry.json 에 등록되어 있는지 (Doc2 §17 #2)
 * - 엔진 값이 engine-registry.json primary 와 일치하는지
 *
 * 사용: node presentation/generator/validate-deck.mjs [deck.json 경로]
 * 기본 대상: presentation/deck.json
 * exit code: 통과 0 / 실패 1
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const presentationRoot = resolve(__dirname, "..");

const deckPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : resolve(presentationRoot, "deck.json");

const errors = [];
const fail = (m) => errors.push(m);

function readJson(p, label) {
  let raw;
  try {
    raw = readFileSync(p, "utf8");
  } catch {
    fail(`${label} 파일을 찾을 수 없음: ${p}`);
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    fail(`${label} JSON 파싱 실패: ${e.message}`);
    return null;
  }
}

const deck = readJson(deckPath, "deck.json");

// 레지스트리에서 허용 semanticLayout / primary engine 로드 (없어도 검증은 진행)
const registry = readJson(
  resolve(__dirname, "layout-registry.json"),
  "layout-registry.json"
);
const engineRegistry = readJson(
  resolve(__dirname, "engine-registry.json"),
  "engine-registry.json"
);
const allowedLayouts = registry?.layouts
  ? new Set(registry.layouts.map((l) => l.semanticId))
  : null;
const primaryEngine = engineRegistry?.primary ?? "slidev";

if (deck) {
  if (deck.version !== 1) fail(`version 은 1 이어야 함 (현재: ${deck.version})`);

  if (!deck.meta || typeof deck.meta !== "object") {
    fail("meta 객체 누락");
  } else {
    if (!deck.meta.title) fail("meta.title 누락");
    if (!deck.meta.engine) fail("meta.engine 누락");
    else if (deck.meta.engine !== primaryEngine)
      fail(`meta.engine 은 '${primaryEngine}' 이어야 함 (현재: ${deck.meta.engine})`);
  }

  if (!Array.isArray(deck.slides) || deck.slides.length === 0) {
    fail("slides 는 1개 이상의 배열이어야 함");
  } else {
    const seen = new Set();
    deck.slides.forEach((s, i) => {
      const at = `slides[${i}]`;
      if (!s || typeof s !== "object") return fail(`${at} 가 객체가 아님`);
      if (!s.id) fail(`${at}.id 누락`);
      else if (!/^slide-\d+$/.test(s.id)) fail(`${at}.id 형식 오류(slide-NN): ${s.id}`);
      else if (seen.has(s.id)) fail(`${at}.id 중복: ${s.id}`);
      else seen.add(s.id);

      if (!s.semanticLayout) fail(`${at}.semanticLayout 누락`);
      else if (allowedLayouts && !allowedLayouts.has(s.semanticLayout))
        fail(`${at}.semanticLayout 미등록 layout: ${s.semanticLayout} (Doc2 §17 #2)`);

      if (!s.content || typeof s.content !== "object")
        fail(`${at}.content 객체 누락`);
    });
  }
}

if (errors.length) {
  console.error("[validate-deck] FAIL");
  for (const e of errors) console.error("  - " + e);
  console.error(`총 ${errors.length}개 문제. 대상: ${deckPath}`);
  process.exit(1);
}

console.log(`[validate-deck] PASS — ${deck.slides.length}개 슬라이드. 대상: ${deckPath}`);
process.exit(0);
