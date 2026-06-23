#!/usr/bin/env node
/**
 * make-gallery.mjs — layout-registry.json의 모든 semanticLayout을 한 슬라이드씩 채운
 * "레이아웃 갤러리" deck.json을 생성한다. 처음 세팅 때 어떤 레이아웃이 있는지 한 번 훑어보는 용도.
 * 실행: npm run presentation:gallery  (이 스크립트 → presentation:build 순서)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(resolve(__dirname, "layout-registry.json"), "utf8"));
const outPath = resolve(__dirname, "..", "deck.json");

// 배열형 슬롯(여러 항목) vs 텍스트형 슬롯 구분
const ARRAY_SLOTS = new Set([
  "items", "points", "features", "cards", "tiers", "steps",
  "left", "right", "limitations", "guardrails", "callout",
]);

function sampleArray(slot) {
  return Array.from({ length: 3 }, (_, i) => ({
    title: `${slot} 항목 ${i + 1}`,
    desc: "샘플 설명 텍스트",
  }));
}

const TEXT_SAMPLE = {
  subtitle: "부제목 — 한 줄 설명",
  lead: "리드 문장 (대비/맥락)",
  eyebrow: "EYEBROW",
  footnote: "각주 / 태그",
  leftLabel: "기존", rightLabel: "개선",
  label: "지표", number: "3분", caption: "보조 설명 캡션",
  quote: "기억에 남을 한 문장.", attribution: "발표자",
  beforeLabel: "기존", afterLabel: "개선",
  beforeCaption: "기존 상태 설명", afterCaption: "개선된 상태 설명",
  result: "핵심 결과 한 줄", cta: "데모 보기", contact: "github.com/team",
};

const slides = registry.layouts.map((l, idx) => {
  const content = {};
  for (const slot of l.slots) {
    if (slot === "tags") { content.tags = ["태그1", "태그2", "태그3"]; continue; }
    if (ARRAY_SLOTS.has(slot)) { content[slot] = sampleArray(slot); continue; }
    content[slot] = TEXT_SAMPLE[slot] ?? "샘플";
  }
  // 슬라이드에 레이아웃 이름을 눈에 띄게 — title이 있으면 title, 없으면 label/attribution에.
  if (l.slots.includes("title")) content.title = l.semanticId;
  else if (l.slots.includes("label")) content.label = l.semanticId;
  else if (l.slots.includes("attribution")) content.attribution = l.semanticId;

  return {
    id: "slide-" + String(idx + 1).padStart(2, "0"),
    semanticLayout: l.semanticId,
    content,
    durationSeconds: 20,
    speakerNotes: `레이아웃 [${l.semanticId}] — 슬롯: ${l.slots.join(", ")}`,
  };
});

const deck = {
  version: 1,
  meta: { engine: "slidev", title: "레이아웃 갤러리 (16종)", language: "ko", presentationMinutes: 0 },
  slides,
};

writeFileSync(outPath, JSON.stringify(deck, null, 2) + "\n", "utf8");
console.log(`[make-gallery] ${slides.length}개 레이아웃으로 deck.json 생성: ${outPath}`);
console.log("  → npm run presentation:build 로 렌더, Slidev로 넘기며 레이아웃 선택.");
