// 엔진 실행 검증 — 5개 페르소나를 실제 engine.mjs로 돌려 expectedKeyPrograms가 surface되는지 확인.
// 입력 situations는 NLU/질문지가 제공하는 값(ENGINE-SPEC 계약). 실행: node data/welfare/_engine-test.mjs
import fs from 'fs';
import { matchPrograms, flattenSlots } from '../../web/lib/engine.mjs';

const read = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const rules = read('./rules.json');
const curated = read('./curated-benefits.json');
const personas = read('../personas/demo-personas.json');
const list = Array.isArray(personas) ? personas : personas.personas || [];

let allPass = true;
for (const p of list) {
  const input = { situations: p.expectedSituations || [], slots: p.expectedSlots || {} };
  const out = matchPrograms(input, { rules, curated });
  const surfaced = new Set();
  for (const b of rules.timelineBuckets.order) for (const c of out.timeline[b]) surfaced.add(c.id);
  const expected = p.expectedKeyPrograms || [];
  const missing = expected.filter((id) => !surfaced.has(id));
  const pass = missing.length === 0;
  allPass = allPass && pass;
  const counts = rules.timelineBuckets.order.map((b) => `${b} ${out.timeline[b].length}`).join(' · ');
  console.log(`\n${pass ? 'PASS' : 'FAIL'}  ${p.id}  (expected ${expected.length}/${expected.length - missing.length} surface)`);
  console.log(`   lit: ${out.litSituations.join(', ')}`);
  console.log(`   buckets: ${counts}  | 택일쌍: ${out.exclusivePairs.length}`);
  if (missing.length) console.log(`   !! MISSING: ${missing.join(', ')}`);
}

// 메인 Wow 페르소나 타임라인 상세
const main = list.find((p) => p.id === 'persona-stroke-discharge') || list[0];
if (main) {
  const out = matchPrograms({ situations: main.expectedSituations || [], slots: main.expectedSlots || {} }, { rules, curated });
  console.log(`\n──────── 타임라인 상세: ${main.id} ────────`);
  for (const b of rules.timelineBuckets.order) {
    console.log(`\n[${b}]`);
    for (const c of out.timeline[b]) {
      const dep = c.prerequisiteOf.length ? ` →여는: ${c.prerequisiteOf.length}개` : '';
      const ex = c.exclusiveChoice.length ? ` ⇄택일: ${c.exclusiveChoice.join(',')}` : '';
      const bo = c.boosted ? ' ★' : '';
      console.log(`   [${c.badge}] ${c.name} (${c.id})${bo}${dep}${ex}`);
    }
  }
  if (out.exclusivePairs.length) {
    console.log('\n택일 관계(둘 다 노출, 사용자가 선택):');
    out.exclusivePairs.forEach((d) => console.log(`   ${d.a} ⇄ ${d.b} (${d.reason})`));
  }
}

console.log(`\n${allPass ? '✅ 전체 PASS — 5개 페르소나 expectedKeyPrograms 전부 실제 코드로 surface' : '❌ 일부 FAIL (위 MISSING 확인)'}`);
process.exit(allPass ? 0 : 1);
