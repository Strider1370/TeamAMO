// web/lib/extract.mjs — 자연어 → 신호(situations·slots·primaryConcern) 추출
// 하이브리드: LLM은 '추출'만(자격 판정·제도 선택 금지). 키 없으면 키워드 사전 폴백.
// canonical 어휘는 questionnaire slotSchema / rules.json slotVocabulary 와 동일.

const SITUATIONS = ['노년진입','입원','퇴원ADL','노쇠치매','가족환경','경제주거','말기임종','장애등록','권리안전','돌봄자지원'];
const CONCERNS = ['의료비','돌봄공백','경제','안전','장기계획','돌봄자'];
const VOCAB = {
  target: ['부','모','본인','배우자'],
  age: ['>=65','>=60','>=19','>=18','<65'],
  condition: ['치매','뇌졸중','골절','암','파킨슨','중증화상','희귀난치','기타'],
  adl: ['도움 필요','보조기기 필요','독립'],
  household: ['독거','노인2인','조손','동거'],
  incomeBand: ['기초수급','차상위','기초연금','일반'],
  lifeEvent: ['입원','퇴원','진단','사별','은퇴','위기사유'],
  caregiver: ['자녀 직장병행','소진'],
  permanentDisability: ['후유장애','없음'],
};

const collapse = (sets) => {
  const out = {};
  for (const [axis, set] of Object.entries(sets)) {
    const arr = [...set];
    if (arr.length) out[axis] = arr.length === 1 ? arr[0] : arr;
  }
  return out;
};

/** 키워드 사전 폴백 — 키 없이도 동작 (데모 안전망) */
export function keywordExtract(text, dict) {
  const sets = {};
  const situations = new Set();
  for (const e of dict.entries) {
    if (!e.synonyms.some((s) => text.includes(s))) continue;
    for (const [axis, val] of Object.entries(e.emits)) {
      if (axis === 'situation') { situations.add(val); continue; }
      (sets[axis] ||= new Set()).add(val);
    }
  }
  return { situations: [...situations], slots: collapse(sets), primaryConcern: null, via: 'keyword' };
}

/** LLM 출력 정규화 — 허용값만 통과 (환각·이탈 차단) */
function sanitize(obj) {
  const situations = (Array.isArray(obj.situations) ? obj.situations : []).filter((s) => SITUATIONS.includes(s));
  const slots = {};
  const inSlots = obj.slots && typeof obj.slots === 'object' ? obj.slots : {};
  for (const [axis, allowed] of Object.entries(VOCAB)) {
    let v = inSlots[axis];
    if (v == null) continue;
    if (Array.isArray(v)) { v = v.filter((x) => allowed.includes(x)); if (v.length) slots[axis] = v.length === 1 ? v[0] : v; }
    else if (allowed.includes(v)) slots[axis] = v;
  }
  const primaryConcern = CONCERNS.includes(obj.primaryConcern) ? obj.primaryConcern : null;
  return { situations, slots, primaryConcern };
}

const SYSTEM = `너는 한국 노인복지 안내 보조다. 자녀가 부모 돌봄 상황을 적은 글에서 '신호'만 추출해 JSON으로 반환한다.
절대 자격을 판정하거나 제도를 추천하지 마라 — 글에 명시·강하게 암시된 신호만 뽑는다. 모르면 생략.
출력은 JSON만:
{"situations": 해당 키 배열, "slots": {축:값}, "primaryConcern": 값 또는 null}
situations 허용: 노년진입,입원,퇴원ADL,노쇠치매,가족환경,경제주거,말기임종,장애등록,권리안전,돌봄자지원
slots 허용값 — target:부/모/본인/배우자 · age:>=65/>=60/<65 · condition:치매/뇌졸중/골절/암/파킨슨/중증화상/희귀난치/기타 · adl:도움 필요/보조기기 필요/독립 · household:독거/노인2인/조손/동거 · incomeBand:기초수급/차상위/기초연금/일반 · lifeEvent:입원/퇴원/진단/사별/은퇴/위기사유 · caregiver:자녀 직장병행/소진 · permanentDisability:후유장애/없음 (한 축에 여러 개면 배열)
primaryConcern(가장 큰 걱정 하나): 의료비/돌봄공백/경제/안전/장기계획/돌봄자 또는 null`;

/** GPT 추출 (gpt-5.x 파라미터 자동 대응) */
export async function llmExtract(text, { apiKey, model }) {
  if (!apiKey) return null;
  const isNewGen = /^(gpt-5|o\d)/.test(model || '');
  const body = {
    model,
    messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: text }],
    response_format: { type: 'json_object' },
  };
  if (isNewGen) { body.max_completion_tokens = 3000; body.reasoning_effort = 'low'; }
  else { body.max_tokens = 600; body.temperature = 0; }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`openai ${res.status}`);
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error('empty');
  return { ...sanitize(JSON.parse(raw)), via: 'llm', model };
}

/** 비전 추출 (서류 사진 → 신호). dataUrl = "data:image/...;base64,..." */
export async function visionExtract(dataUrl, { apiKey, model }) {
  if (!apiKey) return null;
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    throw new Error('invalid image data url');
  }
  const isNewGen = /^(gpt-5|o\d)/.test(model || '');
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: [
          { type: 'text', text: '이 의료/복지 서류 이미지에서 신호만 추출해 JSON으로 반환해라. 보이는 내용에 명시·강하게 암시된 신호만 — 환각 금지.' },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  };
  if (isNewGen) { body.max_completion_tokens = 3000; body.reasoning_effort = 'low'; }
  else { body.max_tokens = 600; body.temperature = 0; }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`openai ${res.status}`);
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error('empty');
  return { ...sanitize(JSON.parse(raw)), via: 'vision', model };
}

function mergeSlots(a, b) {
  const out = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (key === 'target' && b[key]) { out[key] = b[key]; continue; } // target은 LLM 단일값 우선(과추출 방지)
    const vals = new Set();
    for (const src of [a[key], b[key]]) {
      if (src == null) continue;
      (Array.isArray(src) ? src : [src]).forEach((v) => vals.add(v));
    }
    const arr = [...vals];
    if (arr.length) out[key] = arr.length === 1 ? arr[0] : arr;
  }
  return out;
}

/** 두 신호 객체 병합 — situations 합집합 · slots mergeSlots · primaryConcern는 a 우선(없으면 b). */
export function mergeSignals(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    situations: [...new Set([...(a.situations || []), ...(b.situations || [])])],
    slots: mergeSlots(a.slots || {}, b.slots || {}),
    primaryConcern: a.primaryConcern ?? b.primaryConcern ?? null,
    via: [a.via, b.via].filter(Boolean).join('+'),
  };
}

/** 통합 진입점 — 키워드(바닥) ∪ LLM(이해·뉘앙스). 좋은 모델도 놓치는 명시 신호를 키워드가 보장. */
export async function extractSignals(text, { dict, apiKey, model }) {
  const kw = keywordExtract(text, dict); // 결정론적 바닥 — 명시 키워드는 반드시 잡힘
  let llm = null;
  if (apiKey) {
    try { llm = await llmExtract(text, { apiKey, model }); } catch { /* 폴백 */ }
  }
  if (!llm) return { ...kw, via: 'keyword' };
  return {
    situations: [...new Set([...kw.situations, ...llm.situations])],
    slots: mergeSlots(kw.slots, llm.slots),
    primaryConcern: llm.primaryConcern ?? null,
    via: 'llm+keyword',
  };
}

/** LLM 관련도 정렬 — 코드가 고른 후보의 '순서'만 재정렬(선택·추가 금지). 실패 시 null → 결정론 순서 유지. */
export async function rankByRelevance({ text, items }, { apiKey, model }) {
  if (!apiKey || !items?.length) return null;
  const isNewGen = /^(gpt-5|o\d)/.test(model || '');
  const list = items.map((it) => `${it.id} :: ${it.name}`).join('\n');
  const sys = `사용자가 적은 가족 돌봄 상황과 후보 지원 제도 목록(id :: 이름)이 주어진다. 이 가정 상황에 관련성이 높은 순서로 제도 id만 정렬해 JSON {"order":["id", ...]} 으로 반환하라. 목록에 있는 id만 쓰고 새로 만들지 마라. 모든 id를 빠짐없이 포함하라. 설명 없이 JSON만.`;
  const body = {
    model,
    messages: [{ role: 'system', content: sys }, { role: 'user', content: `[상황]\n${text}\n\n[후보 제도]\n${list}` }],
    response_format: { type: 'json_object' },
  };
  if (isNewGen) { body.max_completion_tokens = 4000; body.reasoning_effort = 'low'; }
  else { body.max_tokens = 2000; body.temperature = 0; }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`openai ${res.status}`);
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error('empty');
  const parsed = JSON.parse(raw);
  const order = Array.isArray(parsed.order) ? parsed.order.filter((x) => typeof x === 'string') : [];
  return order.length ? order : null;
}
