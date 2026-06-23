// web/lib/engine.mjs — 규칙 매칭 엔진 (결정론적, 순수 함수)
// 계약: data/welfare/ENGINE-SPEC.md. 데이터 로딩은 호출부(API route / 테스트)가 담당.
//   matchPrograms({ situations, slots }, { rules, curated }) -> { litSituations, timeline, exclusivePairs }
// 자격 판정 안 함 — 점등·순서·중복배제 표기만. badge/timeline/link는 데이터에서.
// exclusiveWith는 '택일' 관계로 양쪽 다 노출(정직성 — 옵션을 숨기지 않음).

const CONF_RANK = { '확인': 0, '잠재후보': 1, '미확인': 2 };

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

export function matchPrograms(input, { rules, curated }) {
  const byId = new Map(curated.map((p) => [p.id, p]));
  const tokens = flattenSlots(input.slots);
  const tokenSet = new Set(tokens);

  // STEP 2 — situation 점등 (직접선택 ∪ 슬롯파생)
  const lit = new Set(input.situations || []);
  for (const tok of tokens) {
    const sits = rules.slotToSituations[tok];
    if (Array.isArray(sits)) sits.forEach((s) => lit.add(s));
  }

  // STEP 3 — situation 교집합 풀 수집 (matchedSituations 누적)
  const pool = new Map(); // id -> { prog, matched:Set, boosted:false }
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

  // STEP 5 — 배지
  for (const e of pool.values()) {
    e.badge = rules.confidenceToBadge[e.prog.eligibility?.confidence] || '확인 필요';
  }

  // STEP 6a — indegree (위상: 선행 관문 먼저). gateway.prerequisiteOf = [의존제도]
  const indeg = new Map([...pool.keys()].map((id) => [id, 0]));
  for (const { prog } of pool.values()) {
    for (const dep of prog.sequence?.prerequisiteOf || []) {
      if (indeg.has(dep)) indeg.set(dep, indeg.get(dep) + 1);
    }
  }

  // STEP 6b — exclusiveWith: 양쪽 다 유지하고 '택일' 관계만 표기 (제거하지 않음)
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

  // STEP 7 — timeline 버킷 분배 + 정렬
  const order = rules.timelineBuckets.order;
  const timeline = Object.fromEntries(order.map((b) => [b, []]));
  const card = (e) => ({
    ...e.prog,
    badge: e.badge,
    matchedSituations: [...e.matched],
    boosted: !!e.boosted,
    prerequisiteOf: e.prog.sequence?.prerequisiteOf || [],
    exclusiveChoice: (e.prog.exclusiveWith || []).filter((id) => pool.has(id)),
  });
  for (const e of pool.values()) {
    const bucket = order.includes(e.prog.timeline) ? e.prog.timeline : order[order.length - 1];
    timeline[bucket].push(e);
  }
  for (const b of order) {
    timeline[b].sort((a, c) => {
      if (indeg.get(a.prog.id) !== indeg.get(c.prog.id)) return indeg.get(a.prog.id) - indeg.get(c.prog.id);
      if (a.boosted !== c.boosted) return a.boosted ? -1 : 1;
      const ca = CONF_RANK[a.prog.eligibility?.confidence] ?? 9;
      const cc = CONF_RANK[c.prog.eligibility?.confidence] ?? 9;
      if (ca !== cc) return ca - cc;
      return a.prog.id < c.prog.id ? -1 : 1;
    });
    timeline[b] = timeline[b].map(card);
  }

  return { litSituations: [...lit], timeline, exclusivePairs };
}
