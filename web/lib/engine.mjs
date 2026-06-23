// web/lib/engine.mjs — 규칙 매칭 엔진 (결정론적, 순수 함수)
// 계약: data/welfare/ENGINE-SPEC.md. 데이터 로딩은 호출부(API route / 테스트)가 담당.
//   matchPrograms({ situations, slots, primaryConcern? }, { rules, curated })
//     -> { litSituations, timeline, exclusivePairs }
// 하이브리드: LLM은 slots + primaryConcern(걱정 축)만 '추출'. 선택·정렬·자격은 전부 코드.
// 자격 판정 안 함 — 점등·순서·관련도 정렬·중복배제 표기만. badge/timeline/link는 데이터에서.

const CONF_RANK = { '확인': 0, '잠재후보': 1, '미확인': 2 };
const CONF_BONUS = { '확인': 6, '잠재후보': 3, '미확인': 0 };
const LOW_INCOME = new Set(['기초수급', '차상위']);

// primaryConcern(LLM 추출) → 가중치를 줄 situation 집합
const CONCERN_SITUATIONS = {
  '의료비': ['입원'],
  '돌봄공백': ['퇴원ADL', '노쇠치매'],
  '경제': ['경제주거'],
  '안전': ['권리안전', '가족환경'],
  '장기계획': ['장애등록', '말기임종'],
  '돌봄자': ['돌봄자지원'],
};

const FOCUS_N = 4; // 버킷별 기본 노출(핵심), 나머지는 '더보기'

/** slots 객체 → "축:값" 토큰 배열 (region/_note/배열 평탄화) */
export function flattenSlots(slots = {}) {
  const out = [];
  for (const [axis, val] of Object.entries(slots)) {
    if (axis === 'region' || axis.startsWith('_')) continue;
    const vals = Array.isArray(val) ? val : [val];
    for (const v of vals) {
      if (v === null || v === undefined || v === '') continue;
      out.push(`${axis}:${v}`);
    }
  }
  return out;
}

const isMeansTested = (prog) => {
  const r = prog.eligibility?.incomeRule;
  return typeof r === 'string' && /수급|차상위|중위|소득|기준/.test(r);
};

export function matchPrograms(input, { rules, curated }) {
  const byId = new Map(curated.map((p) => [p.id, p]));
  const tokens = flattenSlots(input.slots);
  const tokenSet = new Set(tokens);
  const incomeBand = input.slots?.incomeBand;
  const userTags = new Set(input.attributeTags || input.slots?.attributeTags || []);
  const concernSits = new Set(CONCERN_SITUATIONS[input.primaryConcern] || []);

  // STEP 2 — situation 점등 (직접선택 ∪ 슬롯파생)
  const lit = new Set(input.situations || []);
  for (const tok of tokens) {
    const sits = rules.slotToSituations[tok];
    if (Array.isArray(sits)) sits.forEach((s) => lit.add(s));
  }

  // STEP 3 — situation 교집합 풀 수집
  const pool = new Map(); // id -> { prog, matched:Set, boosted }
  for (const prog of curated) {
    const hit = (prog.situations || []).filter((s) => lit.has(s));
    if (hit.length) pool.set(prog.id, { prog, matched: new Set(hit), boosted: false });
  }

  // STEP 4 — keyProgramBoosts 핀고정 (when=AND)
  for (const rule of rules.keyProgramBoosts?.rules || []) {
    if (!rule.when.every((w) => tokenSet.has(w))) continue;
    for (const id of rule.boost) {
      const prog = byId.get(id);
      if (!prog) continue;
      if (!pool.has(id)) pool.set(id, { prog, matched: new Set((prog.situations || []).filter((s) => lit.has(s))), boosted: true });
      else pool.get(id).boosted = true;
    }
  }

  // STEP 4.5 — 제외(직접혜택 아님) + 사망게이트(말기임종 신호 없으면 사망 관련 제도 차단)
  const excludeSet = new Set(rules.excludeIds?.ids || []);
  const deathSet = new Set(rules.deathGate?.ids || []);
  const deathLit = lit.has(rules.deathGate?.situation || '말기임종');
  for (const id of [...pool.keys()]) {
    if (excludeSet.has(id)) { pool.delete(id); continue; }
    if (deathSet.has(id) && !deathLit) pool.delete(id);
  }

  // STEP 5 — 배지 + 관련도 점수 (결정론적)
  for (const e of pool.values()) {
    const p = e.prog;
    e.badge = rules.confidenceToBadge[p.eligibility?.confidence] || '확인 필요';
    let score = 0;
    if (e.boosted) score += 100;
    score += e.matched.size * 12;
    if ((p.sequence?.prerequisiteOf || []).length) score += 15;
    score += CONF_BONUS[p.eligibility?.confidence] ?? 0;
    if ([...e.matched].some((s) => concernSits.has(s))) score += 30;
    if (isMeansTested(p) && incomeBand && !LOW_INCOME.has(incomeBand)) score -= 35;
    // 속성 태그(보훈·농어촌·지역) 불일치 제도 강등 — 사용자 태그와 안 맞으면 핵심에서 내림
    const tags = p.attributeTags || [];
    if (tags.length && !tags.some((t) => userTags.has(t))) score -= 50;
    e.score = score;
  }

  // STEP 6a — indegree (위상: 선행 관문 먼저)
  const indeg = new Map([...pool.keys()].map((id) => [id, 0]));
  for (const { prog } of pool.values()) {
    for (const dep of prog.sequence?.prerequisiteOf || []) {
      if (indeg.has(dep)) indeg.set(dep, indeg.get(dep) + 1);
    }
  }

  // STEP 6b — exclusiveWith: 양쪽 다 유지, '택일' 관계만 표기 (제거하지 않음)
  const poolIds = new Set(pool.keys());
  const exclusivePairs = [];
  const seenPair = new Set();
  for (const e of pool.values()) {
    for (const partner of e.prog.exclusiveWith || []) {
      if (!poolIds.has(partner)) continue;
      const key = [e.prog.id, partner].sort().join('|');
      if (seenPair.has(key)) continue;
      seenPair.add(key);
      exclusivePairs.push({ a: e.prog.id, b: partner, reason: '택일' });
    }
  }

  // STEP 7 — timeline 버킷 + 관련도 정렬 + 포커스(core) 표기
  const order = rules.timelineBuckets.order;
  const buckets = Object.fromEntries(order.map((b) => [b, []]));
  for (const e of pool.values()) {
    const b = order.includes(e.prog.timeline) ? e.prog.timeline : order[order.length - 1];
    buckets[b].push(e);
  }
  const card = (e, core) => ({
    ...e.prog,
    badge: e.badge,
    relevanceScore: e.score,
    core,
    matchedSituations: [...e.matched],
    boosted: !!e.boosted,
    prerequisiteOf: e.prog.sequence?.prerequisiteOf || [],
    exclusiveChoice: (e.prog.exclusiveWith || []).filter((id) => pool.has(id)),
  });
  const timeline = {};
  for (const b of order) {
    buckets[b].sort((a, c) => {
      if (a.score !== c.score) return c.score - a.score;            // 관련도 desc
      if (indeg.get(a.prog.id) !== indeg.get(c.prog.id)) return indeg.get(a.prog.id) - indeg.get(c.prog.id); // 관문 먼저
      const ca = CONF_RANK[a.prog.eligibility?.confidence] ?? 9;
      const cc = CONF_RANK[c.prog.eligibility?.confidence] ?? 9;
      if (ca !== cc) return ca - cc;
      return a.prog.id < c.prog.id ? -1 : 1;
    });
    timeline[b] = buckets[b].map((e, i) => card(e, e.boosted || i < FOCUS_N));
  }

  return { litSituations: [...lit], timeline, exclusivePairs };
}
