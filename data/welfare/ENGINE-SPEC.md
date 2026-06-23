# ENGINE-SPEC — 규칙 매칭 엔진 계약 (T1 → T2)

> 가족 복지·돌봄 내비게이터 | 기준일 2026-06-23 | 작성: T1(규칙엔진 데이터)
> 대상: T2(엔진 코드). 본 문서대로 구현하면 **결정론적**으로 동일 출력이 나온다.
> 데이터 의존: `data/welfare/rules.json`(점등 규칙), `data/welfare/curated-benefits.json`(제도 79건 = 진실원천), `data/questionnaire/questionnaire.json`(slotSchema·entry 카드).

---

## 0. 입력 / 출력 한눈에

```jsonc
// INPUT (질문지 multiSelect 결과 + 자연어 NLU 추출이 동일 형태로 수렴)
{
  "situations": ["퇴원ADL", "입원"],        // entry 카드 직접 선택(0개 이상). 표준 10키.
  "slots": {                                 // canonical 슬롯(아래 §1). 값은 단일 또는 배열.
    "target": "부",
    "condition": "뇌졸중",
    "adl": "도움 필요",
    "lifeEvent": ["입원", "퇴원"],
    "caregiver": "자녀 직장병행",
    "permanentDisability": "후유장애",
    "incomeBand": "일반",
    "region": "서울 강남구"
  }
}
```

```jsonc
// OUTPUT
{
  "litSituations": ["입원","퇴원ADL","장애등록","돌봄자지원","경제주거"],
  "timeline": {
    "지금":   [ { /* ProgramCard */ } ],
    "퇴원후": [ { /* ProgramCard */ } ],
    "장기":   [ { /* ProgramCard */ } ]
  },
  "droppedByExclusive": [
    { "kept": "ltci-recognition", "dropped": "elderly-customized-care", "reason": "택일" }
  ]
}

// ProgramCard (curated 원본 + 엔진 부가필드)
{
  "id": "ltci-recognition",
  "name": "노인장기요양보험 장기요양인정 신청",
  "badge": "받을 가능성",          // confidenceToBadge(eligibility.confidence)
  "timeline": "지금",
  "matchedSituations": ["퇴원ADL"], // 이 카드를 점등시킨 lit situation
  "boosted": true,                  // keyProgramBoosts로 핀고정됐는지
  "prerequisiteOf": ["home-care-visit","day-night-care","welfare-equipment","short-term-care","visiting-bath"],
  "exclusiveChoice": null,          // 택일로 버려진 상대 id(있으면), 없으면 null
  /* …curated-benefits.json의 나머지 필드 그대로 패스스루… */
}
```

---

## 1. canonical 슬롯 어휘 (rules.json `slotVocabulary`)

`questionnaire.json` slotSchema가 유일 기준. slot-dictionary(평어→슬롯)·demo-personas·curated.eligibility.slots 모두 이 어휘로 정렬됨.

| 축 | 허용 값 |
|---|---|
| target | 부 · 모 · 본인 · 배우자 |
| age | >=65 · >=60 · >=19 · >=18 · <65 |
| condition | 치매 · 뇌졸중 · 골절 · 암 · 파킨슨 · 중증화상 · 희귀난치 · 기타 |
| adl | 도움 필요 · 보조기기 필요 · 독립 |
| household | 독거 · 노인2인 · 조손 · 동거 |
| incomeBand | 기초수급 · 차상위 · 기초연금 · 일반 |
| lifeEvent | 입원 · 퇴원 · 진단 · 사별 · 은퇴 · 위기사유 |
| caregiver | 자녀 직장병행 · 소진 |
| permanentDisability | 후유장애 · 없음 |
| region | 자유 문자열(시군구) — 점등에 미사용, 링크·관할 안내용 |

슬롯 값은 단일 문자열 또는 배열. 엔진은 내부에서 **`"축:값"` 토큰**으로 평탄화한다(예: `{lifeEvent:["입원","퇴원"]}` → `["lifeEvent:입원","lifeEvent:퇴원"]`).

---

## 2. 매칭 알고리즘 (결정론적, 8단계)

### STEP 1 — 슬롯 평탄화
입력 `slots`를 `"축:값"` 토큰 배열 `T`로 변환. `region`, `_note`, `target`(단독 점등 없음)은 토큰화는 하되 §3에서 미사용.

### STEP 2 — situation 점등 (`litSituations`)
```
lit = set(input.situations)                       // 직접 선택 entry 카드
for tok in T:
    if rules.slotToSituations[tok] exists:
        lit |= rules.slotToSituations[tok]
```
- `slotToSituations`에 없는 토큰(예: `adl:독립`, `incomeBand:일반`, `lifeEvent:진단`, `permanentDisability:없음`, 모든 `target:*`)은 **단독으로 situation을 점등하지 않는다**(다른 슬롯·직접선택과 결합돼야 함).
- **중요:** `litSituations`는 직접선택 ∪ 슬롯파생의 **합집합**. 일부 situation(예: 말기임종)은 canonical 슬롯이 없어 entry 카드 직접 선택으로만 점등된다 — 정상 동작. NLU 경로는 LLM이 entry situation도 함께 채워 보내야 한다.

### STEP 3 — 제도 수집 (situation 교집합/합집합 풀)
```
pool = {}
for s in lit:
    for prog in curated where s in prog.situations:
        pool.add(prog.id)   // matchedSituations에 s 누적
```
즉 **lit situation 중 하나라도 prog.situations에 포함되면 풀에 들어온다**(situation 단위 OR). curated의 `situations[]`가 곧 역인덱스.

### STEP 4 — keyProgramBoosts 보강(핀고정)
```
for rule in rules.keyProgramBoosts.rules:
    if all(w in T for w in rule.when):    // when 배열은 AND
        for id in rule.boost:
            pool.add(id); mark boosted=true
```
boost로 들어온 제도는 STEP 6 가지치기·STEP 7 랭킹에서 **탈락/하단강등 금지**(반드시 surface).

### STEP 5 — 배지 매핑
각 prog: `badge = rules.confidenceToBadge[prog.eligibility.confidence]`
( 확인·잠재후보 → "받을 가능성" / 미확인 → "확인 필요" ).

### STEP 6 — sequence 위상정렬 + exclusiveWith 가지치기
1. **위상정렬:** `curated[id].sequence.prerequisiteOf`로 방향그래프 구성. 선행 제도(예: `ltci-recognition`, `dementia-center`, `disability-registration`, `basic-livelihood`, `elder-protection`)가 자신이 여는 제도보다 **앞 순서**가 되도록 정렬. 사이클 없음(데이터 보장). 정렬은 같은 timeline 버킷 안에서 카드 순서 결정에 사용.
2. **exclusiveWith 가지치기:** 두 제도가 모두 pool에 있고 서로 `exclusiveWith`이면 **우선순위 높은 1개만 유지**, 나머지는 풀에서 제거하고 `droppedByExclusive`에 `{kept, dropped, reason:"택일"}` 기록. 살아남은 카드에는 `exclusiveChoice = dropped id` 표기.
   - **우선순위 규칙(높을수록 유지):** (a) STEP4 boosted인 쪽 > 아닌 쪽 → (b) prerequisiteOf 길이가 긴(=더 많은 후속을 여는 관문) 쪽 > 짧은 쪽 → (c) eligibility.confidence: 확인 > 잠재후보 > 미확인 → (d) 그래도 동률이면 id 사전순.
   - 현재 데이터의 배타쌍: `ltci-recognition ↔ elderly-customized-care`(관문 ltci 유지), `survivor-pension ↔ death-lumpsum`(유족연금 우선), `elderly-customized-care ↔ disability-activity-support`, `elderly-customized-care ↔ solo-elder-checkin`.

### STEP 7 — timeline 버킷 분배
각 살아남은 prog를 `prog.timeline`(지금/퇴원후/장기) 버킷에 넣는다. curated의 timeline은 T1이 교정 완료(§4). 버킷 순서·라벨은 `rules.timelineBuckets`.
- 버킷 내 정렬: STEP6 위상정렬 순(관문 먼저) → boosted 먼저 → confidence(확인>잠재후보>미확인) → id 사전순.

### STEP 8 — 출력 직렬화
`litSituations`, 버킷별 `ProgramCard[]`, `droppedByExclusive` 반환. ProgramCard는 curated 원본 필드 + `{badge, matchedSituations, boosted, exclusiveChoice}` 부가.

---

## 3. rules.json 키별 계약

| 키 | 형태 | 용도 |
|---|---|---|
| `situations` | `string[10]` | 표준 situation 키 화이트리스트(검증용) |
| `slotVocabulary` | `{축: 값[]}` | canonical 어휘. 입력 슬롯 검증·정규화 |
| `slotToSituations` | `{"축:값": situation[]}` | STEP2 점등표. 없는 토큰은 무점등 |
| `keyProgramBoosts.rules` | `[{when: 토큰[], boost: id[]}]` | STEP4 핀고정. when은 AND |
| `confidenceToBadge` | `{confidence: badge}` | STEP5 배지 |
| `timelineBuckets` | `{order, labels, rules}` | STEP7 버킷 정의·분류근거 |

밑줄 시작 키(`_note`, `_source`)는 문서용 — 엔진은 무시.

---

## 4. timeline 교정 결과 (curated-benefits.json 제자리 수정)

분류 규칙: **급한 관문·기한 임박 = 지금 / 등급의존 재가서비스 = 퇴원후 / 별도트랙·돌봄자·예방 = 장기.**

총 79건 → **지금 51 · 퇴원후 8 · 장기 20.** 본 작업에서 변경된 12건:

| id | before → after | 사유 |
|---|---|---|
| catastrophic-medical | 퇴원후 → **지금** | 퇴원 180일 기한 임박 관문 |
| disability-registration | 지금 → **장기** | 장애등록 별도 트랙 |
| disability-pension | 지금 → **장기** | 장애 등록 선행 별도 트랙 |
| disability-activity-support | 지금 → **장기** | 장애 등록 선행 별도 트랙 |
| disability-medical | 지금 → **장기** | 장애 등록 선행 별도 트랙 |
| assistive-device | 퇴원후 → **장기** | 장애 등록 선행 별도 트랙 |
| assistive-device-insurance | 퇴원후 → **장기** | 장애 등록 선행 별도 트랙 |
| family-care-leave | 지금 → **장기** | 돌봄자(자녀) 지원 트랙 |
| family-care-vacation | 지금 → **장기** | 돌봄자 지원 트랙 |
| work-hour-reduction | 지금 → **장기** | 돌봄자 지원 트랙 |
| caregiver-counseling | 지금 → **장기** | 돌봄자 지원 트랙 |
| dementia-family-support | 지금 → **장기** | 돌봄자(치매가족) 지원 트랙 |

이미 규칙에 맞던 항목(유지): copay-ceiling=장기(사후환급), disability-tax-reduction=장기, ltci-family-respite=장기, family-caregiver-allowance=장기, dementia-public-guardian=장기, dementia-safe-village=장기, culture-voucher·rice-discount=장기, elder-rights-education=장기 / 등급의존 재가서비스 8종(home-care-visit·day-night-care·welfare-equipment·short-term-care·visiting-bath·rehab-hospital·assistive-device-ltci·nursing-hospital-guide)=퇴원후 / ltci-recognition·dementia-center·special-copay·emergency-medical-aid 등 관문·기한=지금.

> **timeline 외 다른 필드는 일절 미수정.** 슬롯 어휘 정합은 demo-personas.json `expectedSlots`만 canonical로 교정(§6).

---

## 5. 검증 — 5개 페르소나 매칭 시뮬레이션 (매칭 0건 방지)

위 8단계 알고리즘을 5개 페르소나의 (직접선택 situation = expectedSituations) ∪ (canonical expectedSlots)에 적용해, expectedKeyPrograms가 **전부 surface되는지** 손/스크립트로 검증. 결과 **5/5 PASS**.

| 페르소나 | 점등 situations | expected 제도 수 | 결과 |
|---|---|---|---|
| persona-stroke-discharge | 입원·퇴원ADL·장애등록·돌봄자지원·경제주거 | 9 | **PASS** — 9/9 surface |
| persona-early-dementia-solo | 노쇠치매·가족환경·경제주거·권리안전(+노년진입) | 8 | **PASS** — 8/8 surface |
| persona-retirement-onset | 노년진입·경제주거 | 7 | **PASS** — 7/7 surface |
| persona-terminal-cancer | 말기임종·입원·경제주거·돌봄자지원·가족환경(+퇴원ADL) | 7 | **PASS** — 7/7 surface |
| persona-caregiver-burnout | 돌봄자지원·퇴원ADL | 7 | **PASS** — 7/7 surface |

검증의 핵심 사실: **5개 페르소나의 expectedKeyPrograms 38건 전부가, 해당 페르소나의 점등 situation 중 하나 이상을 `situations[]`에 갖고 있다**(curated 역인덱스로 확인). 따라서 STEP3(situation OR 수집)만으로 모두 풀에 들어오며, keyProgramBoosts는 핵심 관문(ltci-recognition·dementia-center·disability-registration·family-care-leave 등)의 상단 노출을 추가 보증한다.

### 주의(정직성)
- **persona-terminal-cancer의 말기임종**: canonical 슬롯에 '말기/임종' 축이 없어 슬롯만으로는 점등 안 됨. entry 카드 '말기임종' 직접 선택(또는 NLU가 situation을 함께 채움)으로 점등된다. survivor-pension·hospice·advance-directive·safe-inheritance는 모두 `situations:["말기임종"]`이라 이 선택 하나로 surface. → NLU 프롬프트(T_LLM)는 **situation도 함께 출력**해야 함을 계약으로 둔다.
- persona별로 슬롯 파생 외 entry 카드 선택이 더해질 때 노년진입(P2)·퇴원ADL(P4) 등 부가 situation이 추가로 켜질 수 있으나, 이는 더 많은 정당한 제도를 노출할 뿐 expected를 깨지 않는다.

---

## 6. 슬롯 어휘 정합 — demo-personas.json 교정 내역

`expectedSlots`가 비표준(서술형 한국어·`대상:parent`·`permanence`·`risk`·`intent` 등 슬롯 외 키)이라 canonical로 교정. 의미는 `_note`로 보존.

| 페르소나 | 주요 교정 |
|---|---|
| stroke-discharge | `대상:parent→target:부`, `condition:뇌졸중(뇌혈관질환)→치매아닌 condition:뇌졸중`, adl→`도움 필요`, household→`동거`, incomeBand→`일반`, lifeEvent→`[입원,퇴원,위기사유]`, caregiver→`자녀 직장병행`, `permanence→permanentDisability:후유장애` |
| early-dementia-solo | target:`모`, age:`>=65`, condition:`치매`, adl:`독립`(경증), household:`독거`, incomeBand:`기초연금`, lifeEvent:`진단`, 비표준 `risk` 제거(→_note) |
| retirement-onset | target:`부`, age:`>=65`, adl:`독립`, incomeBand:`일반`, lifeEvent:`은퇴`, condition 미점등(질병없음), `intent` 제거 |
| terminal-cancer | target:`부`, condition:`암`, adl:`도움 필요`, household:`동거`, incomeBand:`일반`, lifeEvent:`진단`, caregiver:`자녀 직장병행`, `intent` 제거. 말기 트랙은 entry 카드 점등(_note) |
| caregiver-burnout | `대상:caregiver→target:모`(돌봄대상) + `caregiver:[소진,자녀 직장병행]`(돌봄자 축), adl:`도움 필요`, household:`동거`, incomeBand:`일반`, 비표준 `intent` 제거 |

> curated.eligibility.slots는 제도별 자격요건 표기용(예: `ltciGrade`,`diagnosis`)으로 입력 슬롯 어휘와 층위가 다르므로 미변경. slot-dictionary.json은 이미 canonical 정렬 상태라 미변경(단 `emits.situation`은 권리안전 직접점등 보조 — 엔진은 STEP2에서 직접선택 situation과 동일 취급).
