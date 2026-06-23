#!/usr/bin/env node
/**
 * validate-slides.mjs — slides.md 존재 + 슬라이드 개수가 deck.json 과 일치하는지 검증한다.
 *
 * 실동작 스크립트(스켈레톤 아님).
 *
 * Slidev slides.md 구조(generate-slidev.mjs 와 일치):
 *  - 파일 맨 앞 headmatter 1블록(--- ... ---) = 첫 슬라이드의 헤더.
 *  - 이후 각 슬라이드는 구분자 '---' 로 시작하며, 구분자 직후 선택적 per-slide
 *    frontmatter(layout: ... 를 다시 '---' 로 닫음)를 가질 수 있다.
 *  → 단순히 '---' 개수만 세면 per-slide frontmatter 의 닫는 '---' 까지 세어 과대계상된다.
 *    아래 countSlides 는 frontmatter 블록을 인지해 "슬라이드 시작"만 센다.
 *
 * 슬라이드 시작 규칙:
 *  - 슬라이드 #1 = 파일 시작(+ 맨 앞 headmatter).
 *  - 그 외 슬라이드 시작 = frontmatter 블록(또는 단독 구분자) 밖에서 만나는 '---' 라인.
 *    구분자 직후에 이어지는 '---'(per-slide frontmatter 닫기)는 슬라이드 시작이 아니다.
 *
 * 사용: node presentation/generator/validate-slides.mjs [slides.md] [deck.json]
 * exit code: 통과 0 / 실패 1
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const presentationRoot = resolve(__dirname, "..");

const slidesPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : resolve(presentationRoot, "slidev", "slides.md");
const deckPath = process.argv[3]
  ? resolve(process.cwd(), process.argv[3])
  : resolve(presentationRoot, "deck.json");

const errors = [];
const fail = (m) => errors.push(m);

let md;
try {
  md = readFileSync(slidesPath, "utf8");
} catch {
  fail(`slides.md 를 찾을 수 없음: ${slidesPath}`);
}

/**
 * frontmatter 인지 슬라이드 카운터.
 * 코드펜스(```) 안의 '---' 와 per-slide frontmatter 닫는 '---' 는 구분자로 세지 않는다.
 */
function countSlides(text) {
  const lines = text.split(/\r?\n/);
  const isHr = (s) => /^---\s*$/.test(s);

  let i = 0;
  let slideCount = 0;
  let inFence = false;

  // 1) 맨 앞 headmatter 처리 → 첫 슬라이드 1장.
  if (lines.length && isHr(lines[0])) {
    // headmatter 닫는 '---' 까지 소비
    let j = 1;
    while (j < lines.length && !isHr(lines[j])) j++;
    if (j < lines.length) {
      slideCount = 1; // 첫 슬라이드
      i = j + 1;
    } else {
      i = 1; // 닫히지 않음 — 그냥 진행
    }
  }

  // 2) 본문 스캔: 구분자 '---' 를 만나면 새 슬라이드 시작.
  //    구분자 직후 per-slide frontmatter(layout 등)는 닫는 '---' 까지 통째로 건너뛴다.
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line.trim())) { inFence = !inFence; continue; }
    if (inFence) continue;

    if (isHr(line)) {
      slideCount++; // 새 슬라이드 시작
      // per-slide frontmatter? 다음에 비-'---' YAML 줄이 오고, 다시 '---' 로 닫히면 소비.
      let k = i + 1;
      // 구분자 직후 곧바로 '---' 가 또 오는 비정상 케이스 방지: frontmatter 는 최소 1줄 키.
      if (k < lines.length && !isHr(lines[k]) && lines[k].trim() !== "") {
        // YAML 키처럼 보이는 블록을 닫는 '---' 까지 스캔
        let m = k;
        let closed = false;
        while (m < lines.length) {
          if (isHr(lines[m])) { closed = true; break; }
          if (lines[m].trim() === "") { /* 빈 줄 — frontmatter 종료로 간주, 닫힘 아님 */ break; }
          m++;
        }
        if (closed) i = m; // frontmatter 닫는 '---' 까지 소비
      }
    }
  }

  return Math.max(slideCount, 1);
}

let deckCount = null;
if (errors.length === 0) {
  try {
    const deck = JSON.parse(readFileSync(deckPath, "utf8"));
    const visible = Array.isArray(deck.slides)
      ? deck.slides.filter(
          (s) => s.implementationStatus !== "dropped" && s.implementationStatus !== "blocked"
        )
      : null;
    deckCount = visible ? visible.length : null;
    if (deckCount === null) fail("deck.json 의 slides 가 배열이 아님");
  } catch (e) {
    fail(`deck.json 읽기/파싱 실패(${deckPath}): ${e.message}`);
  }
}

if (errors.length === 0) {
  const mdCount = countSlides(md);
  if (mdCount !== deckCount) {
    fail(`슬라이드 개수 불일치 — slides.md: ${mdCount}장, deck.json(표시): ${deckCount}장`);
  } else {
    console.log(`[validate-slides] PASS — ${mdCount}장 일치.`);
    process.exit(0);
  }
}

console.error("[validate-slides] FAIL");
for (const e of errors) console.error("  - " + e);
process.exit(1);
