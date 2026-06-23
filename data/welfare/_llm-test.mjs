// 실제 GPT 추출 → 엔진 검증. 키는 web/.env.local에서 읽고 절대 출력하지 않음.
// 실행: node data/welfare/_llm-test.mjs
import fs from 'fs';
import { extractSignals, llmExtract } from '../../web/lib/extract.mjs';
import { matchPrograms } from '../../web/lib/engine.mjs';

const read = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const rules = read('./rules.json');
const curated = read('./curated-benefits.json');
const dict = read('../questionnaire/slot-dictionary.json');

// .env.local 파싱 (값은 메모리만, 출력 금지)
const env = {};
for (const line of fs.readFileSync(new URL('../../web/.env.local', import.meta.url), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const apiKey = env.OPENAI_API_KEY;
const model = env.OPENAI_MODEL || 'gpt-5.5';
console.log(`모델: ${model} | 키: ${apiKey ? '로드됨(non-empty)' : '없음'}`);

// 일부러 페르소나와 다른 '날것' 문장 — 진짜 추출력 테스트
const text = '아버지가 갑자기 뇌졸중으로 쓰러져 입원하셨다가 반신마비가 와서 다음 주 퇴원하세요. 어머니는 따로 혼자 사시는데 아버지를 못 보시고, 저는 회사 다니면서 모셔야 해서 정말 막막합니다. 병원비도 너무 많이 나왔어요.';
console.log(`\n입력 문장:\n  "${text}"`);

console.log('\n=== 1) GPT 직접 호출 ===');
try {
  const r = await llmExtract(text, { apiKey, model });
  console.log('  성공:', JSON.stringify(r, null, 0));
} catch (e) {
  console.log('  실패 →', e.message, '(폴백으로 진행)');
}

console.log('\n=== 2) 통합 추출(extractSignals) ===');
const sig = await extractSignals(text, { dict, apiKey, model });
console.log(`  경로(via): ${sig.via}`);
console.log(`  situations: ${sig.situations.join(', ') || '(없음)'}`);
console.log(`  slots: ${JSON.stringify(sig.slots)}`);
console.log(`  primaryConcern: ${sig.primaryConcern ?? '(없음)'}`);

console.log('\n=== 3) 엔진 매칭(핵심만) ===');
const out = matchPrograms({ situations: sig.situations, slots: sig.slots, primaryConcern: sig.primaryConcern }, { rules, curated });
console.log(`  litSituations: ${out.litSituations.join(', ')}`);
for (const b of rules.timelineBuckets.order) {
  const cards = out.timeline[b];
  const core = cards.filter((c) => c.core);
  if (!cards.length) continue;
  console.log(`\n  [${b}]  (핵심 ${core.length}/${cards.length})`);
  for (const c of core) {
    const dep = c.prerequisiteOf.length ? ` →여는:${c.prerequisiteOf.length}` : '';
    const ex = c.exclusiveChoice.length ? ` ⇄택일:${c.exclusiveChoice.join(',')}` : '';
    console.log(`     [${c.badge}] ${c.name}${dep}${ex}`);
  }
  if (cards.length > core.length) console.log(`     … +${cards.length - core.length}개 더`);
}
