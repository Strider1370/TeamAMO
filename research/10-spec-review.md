# 10. Spec 비판적 검토 (03 단계) — 09-spec 깐깐 리뷰

> 검토일 2026-06-23 · 역할: 03 스펙 비판적 검토자. 점수·칭찬 없음. 데이터로 확인 가능한 건 직접 열어 교차검증함.
> 검토 대상 [[09-spec]] / 기준선 [[08-concept]] / 공격 [[05-judge-review]] / 현실성 [[04-feasibility]] / 빈틈 [[02-domestic]]
> 데이터: curated-benefits.json(79제도, 직접 열람), demo-personas.json, questionnaire.json, slot-dictionary.json, web/ 스캐폴드

---

## 0. 한 줄 결론

데이터·엔진의 **킥(의존성·중복배제·시간축)은 메인 Wow 페르소나에서 실제로 화면을 만들어낼 만큼 채워져 있다 — 이건 진짜다.** 그러나 **스펙과 데이터·스캐폴드 사이에 빌드 전 반드시 메워야 할 구멍 6개**가 있다. 가장 치명적인 건 (1) **슬롯 어휘가 3곳에서 서로 다르다**(questionnaire `부/모` vs persona `parent` vs curated 매칭에 쓸 키 부재), (2) **스캐폴드의 LLM이 OpenAI인데 스펙은 provider를 안 박았고**, (3) **02 빈틈/05 킬러의 핵심인 "지금/대기공백기에 뭘 하나"가 스펙 화면 명세에 약하다**. 이 3개를 빌드 전에 못 박지 않으면 4시간 중 1시간을 어휘 디버깅에 태운다.

---

## 1. 정합성 — concept 킥/정직성을 실제로 구현하나

### 1-1. 잘 맞는 부분 (근거 있음)
- concept의 3요소(의존성·중복배제·시간축)가 스펙 §4·§5.3에 1:1로 들어갔고, **데이터가 이를 뒷받침**한다(§2에서 교차검증). 컨셉→스펙 변환은 충실.
- 정직성(받을가능성+공식URL)은 §5.3 카드 필드(`배지: 받을 가능성/확인 필요` + `공식 링크 버튼`)와 §9 가드레일에 반영. curated의 `confidence`(확인/잠재후보/미확인)·`regionVaries`·`source.url`이 이 배지를 실제로 채울 데이터로 존재.

### 1-2. 어긋남 / 미세 구멍
- 🔴 **`confidence`가 3값(확인/잠재후보/미확인)인데 스펙 배지는 2값(`받을 가능성`/`확인 필요`)이다.** "미확인"(12건, 예: `first-aid-injury-cost-support`, `medical-social-work-consult`, `assistive-device-ltci`, `longevity-allowance`)을 어느 배지에 매핑할지 스펙에 없음. "미확인"을 "받을 가능성"으로 올리면 정직성 위반(환각에 준함), "확인 필요"로 내리면 OK. **매핑 규칙을 빌드 전 명시**: 확인→받을가능성 / 잠재후보·미확인→확인필요. (지금 안 정하면 코드에서 즉흥 분기 → 데모 중 "미확인" 제도가 "받을 가능성"으로 떠서 자기모순)
- 🟡 스펙 §3은 "민감정보 외부 LLM 전송 ❌"라 적었지만, **데모 입력 자체가 질병·소득 평어**라서 그걸 LLM에 보내면 원칙과 충돌하는 것처럼 보인다. 실제로는 "가상 페르소나라 안전"이 맞지만, **발표 카피에서 "입력은 가상이고 저장 안 함"을 명시**하지 않으면 05-Q10에 역공당함. 스펙에 "외부 전송하는 건 가상 페르소나 텍스트뿐"이라고 1줄 박을 것.

---

## 2. 데모 검증 (가장 중요) — 메인 Wow 페르소나 교차검증

`persona-stroke-discharge`의 `expectedKeyPrograms` 9개를 curated-benefits.json에서 **전부 직접 확인**. 결과:

| program id | 실재? | timeline | sequence.prerequisiteOf | exclusiveWith |
|---|---|---|---|---|
| ltci-recognition | ✅ | 지금 | `[home-care-visit, day-night-care, welfare-equipment, short-term-care, visiting-bath]` | `[elderly-customized-care]` |
| home-care-visit | ✅ | 퇴원후 | [] (선행: ltci) | [] |
| welfare-equipment | ✅ | 퇴원후 | [] (선행: ltci) | [] |
| rehab-hospital | ✅ | 퇴원후 | [] | [] |
| catastrophic-medical | ✅ | 퇴원후 | [] | [] |
| disability-registration | ✅ | **지금** | `[disability-pension, disability-activity-support, disability-tax-reduction, assistive-device, disability-medical]` | [] |
| disability-pension | ✅ | **지금** | [] (선행: disability-registration) | [] |
| emergency-welfare | ✅ | 지금 | [] | [] |
| family-care-leave | ✅ | 지금 | [] | [] |

**결론: 9/9 실재. 의존성·중복배제는 데이터로 실제 생성된다.**
- **의존성 시각화 성립**: `ltci-recognition`(지금) → 5개 재가급여(퇴원후)가 `prerequisiteOf`로 연결됨. 화면의 "① 장기요양 등급 → ② 복지용구·방문요양 열림"이 데이터로 그려진다. ✅
- **별도 트랙 성립**: `disability-registration` → `disability-pension` 의존 체인 존재. "장기요양과 별개 장애 트랙"이 데이터로 분리됨. ✅
- **중복배제 성립·양방향 확인**: `ltci-recognition.exclusiveWith=[elderly-customized-care]` ↔ `elderly-customized-care.exclusiveWith=[ltci-recognition, disability-activity-support]`. **상호 참조가 양쪽에 다 박혀 있어** 어느 쪽에서 가지치기해도 일관됨. ✅ (두 번째 페르소나 dementia도 `dementia-center → [dementia-treatment-cost, wandering-id, dementia-public-guardian, fingerprint-prereg]` 체인 확인됨)

### 2-1. 그러나 — 시간축이 persona showcase와 데이터가 어긋난다 🔴
- persona의 `showcases`는 **"장기(장애등록→장애인연금)"**라고 적었지만, 데이터 `disability-registration.timeline="지금"`, `disability-pension.timeline="지금"`이다. 둘 다 "지금"이라 **"장기" 섹션이 비거나, 장애 트랙이 "지금"에 다 몰린다.**
- persona showcase의 또 다른 문구 "장기(...)→장애인연금"과 §7 데모 시나리오 "「장기」 장애등록·자녀 가족돌봄휴직"도 데이터와 불일치(`family-care-leave.timeline="지금"`).
- **즉, 메인 데모에서 "「장기」 섹션"에 들어갈 카드가 데이터상 거의 없다.** 3-섹션 타임라인(지금/퇴원후/장기)을 약속했는데 장기 칸이 휑하면 Wow가 깨진다.
- 🔴 **빌드 전 결정 필요**: (A) `disability-registration`/`disability-pension`/`family-care-leave`의 timeline을 "장기"로 고치거나(데이터 수정), (B) 스펙·데모 대본을 "지금/퇴원후" 2섹션으로 축소하거나, (C) "장기"를 "별도 트랙"으로 재명명. **데이터의 timeline 값이 화면 섹션의 single source of truth이므로 persona showcase 텍스트가 아니라 데이터를 신뢰해야 한다 — 둘 중 하나를 반드시 일치시켜라.** 현 상태로 코딩하면 데모 대본(§7)과 실제 출력이 다르게 나온다.

### 2-2. 필드 충분성
- 카드 렌더에 필요한 필드(`name·eligibility.summary·howToApply·documents·applyUrl·phone·deadline·amount·confidence·regionVaries`) 전부 채워져 있음. `applyUrl=null`인 항목(`longevity-allowance`, `medical-social-work-consult`)은 소수 → "공식 링크 버튼"을 조건부 렌더(없으면 phone/안내문으로 폴백)해야 깨지지 않음. 스펙에 이 폴백 명세 없음 🟡.
- "왜 해당될 수 있나" 1줄은 **AI 번역 산출물**이라 데이터에 없음(정상). 단 폴백(키 없음) 시 이 줄을 무엇으로 채울지 미명세 → §4 참조.

---

## 3. 4시간 현실성 — 스캐폴드 위에서 P0가 되나

### 3-1. 스캐폴드 실측
- `app/page.tsx`는 **빈 스타터**(KRDS 히어로 + 점선 박스). 입력폼·결과카드 **전무** → P0 UI는 0부터 작성. 단 KRDS(`Display/Body/Badge`)·Tailwind·layout/Header/Footer는 셋업됨.
- `app/api/llm/route.ts` + `lib/llm.ts`: 얇은 LLM 프록시 **존재**. 키 없으면 `text:null` 폴백 경로도 이미 구현됨(👍 폴백 안전망의 절반은 공짜).
- `lib/regions.ts`: 시도→시군구 **전국 사전 완비**(17 시도). 지역 선택 UI는 데이터 측 준비 완료.
- ⚠️ **curated-benefits.json은 `web/` 밖(`data/welfare/`)에 있다.** API route에서 `fs`로 `process.cwd()/../data/...` 읽거나 빌드 시 `web/`로 복사해야 함. `public/data/`엔 대피소 json만 있고 복지 데이터 없음 → **import 경로 배선이 첫 15분 과제**. 스펙 §6은 데이터 위치만 적고 "어떻게 web에서 읽나"가 없음 🟡.

### 3-2. P0(자연어→슬롯→규칙매칭→순서화→렌더) 4시간 판정: **가능. 단 조건부.**
- 규칙엔진 자체는 가볍다: 79제도 fixture를 메모리 로드 → 슬롯로 situations 점등 → situations로 후보 수집 → `prerequisiteOf` 위상정렬 → `exclusiveWith` 가지치기 → `timeline`으로 버킷. 전부 순수 함수, **1~1.5시간**이면 된다(데이터가 이미 그래프를 들고 있어서).
- **가장 위험한 병목(우선순위)**:
  1. 🔴 **슬롯 어휘 불일치(§4-2 상세)** — 매칭이 0건 나오는 가장 흔한 원인. 빌드 중 디버깅으로 30~60분 증발 위험. **빌드 전 어휘 통일 1장 작성이 최우선.**
  2. 🟠 **자연어→슬롯 AI 프롬프트의 출력 스키마**가 어디에도 확정 안 됨. set_field/JSON 스키마(어떤 키·어떤 enum)를 빌드 전 고정 안 하면 LLM이 제멋대로 키를 뱉어 매칭 실패. `slot-dictionary.json`의 `emits` 형태로 강제할 것.
  3. 🟡 **KRDS 컴포넌트로 타임라인 3섹션 카드 레이아웃** — 디자인 시간 잡아먹음. 카드는 단순 `<div>`로도 충분하니 KRDS 욕심 버리고 P0에선 최소 마크업.
- **더 줄일 데**: §5.2의 "처리 중 슬롯 칩 노출" 전환 애니메이션은 Wow지만 P0 필수 아님 — 슬롯 칩을 **결과 화면 상단에 정적 표시**로 합치면 화면 전환/로딩상태 코드를 절약. P1 질문지 입구는 예정대로 미루는 게 맞음.

### 3-3. provider 리스크 🔴
- 스캐폴드 `lib/llm.ts`는 **OpenAI(`gpt-4.1-mini`) 전용**이고 스펙은 "LLM 키"로만 적어 provider 불명. 데모 당일 키 모달에서 받는 키가 OpenAI 키인지 다른 건지 **스펙·UI 카피가 명시 안 함**. 폴백이 있어 치명타는 아니나, **"키 모달=OpenAI 키"임을 스펙에 박고 UI 카피도 맞춰라.** (provider를 바꿀 거면 빌드 전에 결정. 지금 스캐폴드 그대로 가면 OpenAI다.)

---

## 4. 구멍 — 화면/상태/슬롯 합류/폴백

### 4-1. 빠진 화면/상태 (스펙에 명세 없음) 🟡
- **매칭 0건**: 슬롯이 안 잡히거나(예: "그냥 힘들어요") situations가 안 켜지면 결과 0. 스펙에 빈결과 화면 없음. → "상황을 조금 더 적어주세요" + 질문지 입구로 유도하는 폴백 필요.
- **applyUrl=null 카드**: 링크 버튼 깨짐(§2-2). 조건부 렌더 명세 필요.
- **LLM 에러/타임아웃**: `lib/llm.ts`는 12초 타임아웃 후 null 반환 → 폴백. 스펙은 "키 없으면 폴백"만 적고 **"키는 있는데 호출 실패" 케이스**를 폴백과 동일 취급하는지 불명. 동일 취급으로 명시할 것(코드는 이미 그렇게 동작).
- **로딩**: §5.2가 전환 상태를 Wow로 쓰겠다지만, 폴백(키 없음)일 땐 LLM 호출이 없어 즉시 결과 → "이해하는 중…" 연출이 빈다. 폴백 경로의 로딩 카피 별도 필요.

### 4-2. 슬롯 합류 — 3곳 어휘 정렬 점검 (직접 대조) 🔴 **이게 최대 리스크**
세 소스의 슬롯 어휘를 실제로 열어 비교한 결과 **불일치가 있다**:

| 슬롯 축 | questionnaire `emits` / slot-dictionary | persona `expectedSlots` | curated `eligibility.slots` |
|---|---|---|---|
| 대상 | `target: "부"/"모"/"배우자"/"본인"` | `대상: "parent"` | `target`은 최상위 필드(`"parent"/"caregiver"`), slots엔 없음 |
| 나이 | `age: ">=65"/">=60"/"<65"` | `(없음, 텍스트)` | `age: ">=65" / ">=65 또는 노인성질병"` 등 **자유문자열** |
| 질병 | `condition: "치매"/"뇌졸중"/...` | `condition: "뇌졸중(뇌혈관질환)"` | `condition: "뇌졸중·골절·수술 후..."` 자유문자열 |
| 소득 | `incomeBand: "기초수급"/"차상위"/"기초연금"/"일반"` | `incomeBand: "저소득(...)"` | `income`/`incomeRule` 자유문자열 |
| ADL | `adl: "도움 필요"/"보조기기 필요"/"독립"` | `adl: "반신마비, ..."` | `adl: "도움 필요"` / `ltciGrade: "필요(선행)"` |

**문제의 핵심**:
1. **키 이름이 다르다**: persona는 한글 키 `대상`, questionnaire/slot-dict는 영문 `target`. persona는 픽스처일 뿐이라 엔진엔 직접 안 들어가지만, **"persona.input(자연어)을 엔진에 넣으면 expectedSlots가 재현되는가"를 테스트하려면 키가 일치해야** 비교 가능. 현재로는 `대상` vs `target`이라 자동 대조 불가.
2. **curated의 `eligibility.slots`는 사람이 읽는 자유문자열**이지 매칭용 enum이 아니다(예: `age: ">=65 또는 노인성질병"`). **즉 슬롯→제도 매칭은 `eligibility.slots`로 직접 못 한다.** 실제 매칭은 **`situations` 배열**(노년진입/입원/퇴원ADL/...)로 돌아간다. 스펙 §5.2는 "슬롯 추출→규칙 매칭(situations 점등)"이라 적었는데, **슬롯(condition/adl/incomeBand)이 어떻게 situation으로 변환되는지의 규칙 테이블이 어디에도 없다.** questionnaire는 `situation→followup`(역방향)만 있고, slot-dictionary는 `평어→slot`만 있다. **`slot→situation` 매핑(예: condition=뇌졸중 & lifeEvent=퇴원 → 퇴원ADL·입원·장애등록 점등)이 빠진 결정적 조각이다.** 04-feasibility §3 표가 그 초안이지만 **코드/데이터로 고정된 산출물이 아직 없음.**
3. **slot-dictionary는 `situation`을 직접 emit하기도 한다**(학대→`situation: 권리안전`). 즉 일부는 slot, 일부는 situation을 바로 뱉어 **층위가 섞여 있다.** 매칭 함수가 두 경로를 다 받도록 설계해야.

→ 🔴 **빌드 전 산출물 2개를 반드시 만들어라**:
   (a) **canonical 슬롯 스키마 1장**(키 영문 통일, enum 고정) — persona 한글 키도 여기에 맞춰 정렬.
   (b) **`slot+situation → 후보 situations 점등` 규칙 테이블**(04 §3을 코드 상수로 확정). 이게 "규칙 매칭"의 실체인데 지금 비어 있다. 이거 없이 빌드 들어가면 매칭이 안 돈다.

### 4-3. 폴백 동작 명세 충분성 🟡
- 폴백 시 "자연어→슬롯"을 slot-dictionary 키워드 includes로 한다는 방향은 맞고 데이터(slot-dictionary)도 충분. 단 **"왜 해당되나" 1줄**을 폴백에서 뭘로 채울지 미명세 → `eligibility.summary` 첫 문장을 그대로 쓰는 식의 폴백 규칙을 박을 것. (AI 없이도 카드가 빈 줄 없이 차도록)

---

## 5. 심사 방어 — 05 킬러를 선제 제거하나

- 05의 **단일 킬러 = Q1(복지로 맞춤형급여안내가 이미 맞춤으로 찾아줌)**. 스펙은 §1.1·§4·§7에서 "평어 입력 → 순서·의존성"으로 차별화를 잡았고 **데이터가 그 순서를 실제로 생성**하므로 방어의 실탄은 있다.
- 🔴 그러나 **05가 "발표 첫 30초 before/after(복지로 6단계 vs 우리 1문장) 못 박지 못하면 패배"**라고 못 박았는데, **스펙 어디에도 "복지로 비교 화면/컷"이 화면 요소로 없다.** §5.3 하단 P2에 "공식 복지 검색" 링크만 있을 뿐, **차별점을 화면에 보여주는 비교 UI가 P0/P1에 없다.** → 발표 슬라이드로 때울 수는 있으나, 05의 권고("눈에 보이게")를 살리려면 **결과 화면에 "복지로엔 이게 순서로 안 나와요" 같은 1줄 대비 카피**라도 P1으로 넣을지 결정 필요.
- 🟡 02 빈틈의 핵심 **"등급 판정 대기 공백기(최대 30일)에 지금 뭘 하나"** — 데이터엔 `ltci-recognition.deadline.note`에 "최대 30일 공백, 퇴원 전 미리 신청"이 들어있고 `deadline.type="대기공백"`까지 있다(좋음). 그런데 **스펙 카드 필드(§5.3)에 `deadline`/"대기공백" 표시가 없다.** 이 "공백기 안내"가 02·05가 짚은 진짜 빈틈인데 **화면에 안 나오면 차별점을 데이터만 갖고 발표에서 말로 때우게 된다.** → 카드에 `deadline.note`(특히 대기공백·사건상대기한) 노출을 P0 필드로 추가 권장.

---

## 6. 정직성 리스크 — 자격 단정/환각 링크/미확인 표시

- ✅ 링크 환각 방지: `applyUrl`이 curated 화이트리스트라 AI가 링크 생성 안 함. 스펙 §3·§9 일치. `lib/llm.ts`도 링크를 만들 경로 없음(텍스트만).
- 🔴 **`confidence="미확인"(12건) + `regionVaries=true`(21건)가 출력에 반영되는지 스펙이 불명확**(§1-2와 동일 지적). regionVaries=true인데 지역 미선택이면 "지역마다 다름 → 거주지 확인" 문구를 강제 노출해야 정직. 스펙 §5.3 카드에 `regionVaries` 배지/문구 필드가 없음 → **추가 필요.** 데이터엔 `amount`나 `notes`에 "지역마다 다름"이 들어있지만 구조화 플래그(`regionVaries`)를 UI가 안 읽으면 묻힌다.
- 🟡 `amount` 필드에 구체 금액(예: 기초연금 "월 최대 349,360원")이 박혀 있다. 이건 신뢰를 주지만 **고시 변경 시 거짓이 될 수 있는 자산**. 05-Q8 방어("우리 DB 낡아도 URL로 백업")와 정합하려면 amount 옆에 "2026 기준, 공식 링크 확인" 캡션을 카드에 고정할 것.

---

## 7. 병합 점검 — dedup 2건

- **`senior-outpatient-flatrate`**: 병합 후 남은 버전(01-senior-onset.json)은 `confidence="잠재후보"`, `amount`는 "구간별 본인부담률 차등 경감(구체 금액·구간은 공식 링크 재확인)"으로 **일반표기**. notes에 "2026 수치 단정 확인 못 해 잠재후보"라고 적힘.
  - ⚠️ **사용자 우려가 정확하다**: 입원 agent(02-hospitalization.json)는 이걸 `confidence="확인"`으로 썼다고 함. **병합이 "확인" 버전을 버리고 "잠재후보" 버전을 남겼다.** 정직성 관점에선 보수적(잠재후보)이 더 안전하므로 **데모엔 문제없음** — 오히려 단정 안 하는 쪽이 가드레일에 부합. 단 **"확인" 근거가 입원 버전에 있었다면 그 정보(구간별 수치)가 유실됐을 수 있으니**, senior-outpatient를 데모에서 강조할 거면 입원 버전 notes를 한 번 회수해 amount를 채울지 검토. 강조 안 할 거면 현 상태로 OK.
- **`dementia-public-guardian`**: 04-frailty-dementia.json 버전 유지, situations=노쇠치매/가족환경/권리안전로 3분류 태깅. `dementia-center.prerequisiteOf`에 포함돼 의존성 체인에 정상 편입됨(확인). 병합 손실 징후 없음. ✅
- dangling 참조 0·비표준 situation 키 0(VALIDATION.md)은 신뢰 가능 — 단 **persona가 참조하는 9 id가 전부 실재함을 §2에서 독립 재확인**했으므로 교차검증 통과.

---

## 8. 우선순위 매긴 수정 제안

### 🔴 P0 — 빌드 전 필수 (안 하면 4시간 안에 못 끝나거나 데모가 자기모순)
1. **canonical 슬롯 스키마 1장 확정 + `slot/situation → situations 점등` 규칙 테이블 작성**(§4-2). 04-feasibility §3을 코드 상수로 고정. **이게 "규칙 매칭"의 실체인데 현재 비어 있다 — 최우선.** persona 한글 키(`대상`)도 영문(`target`)으로 정렬해 자동 대조 가능하게.
2. **timeline 불일치 해소**(§2-1): `disability-registration`/`disability-pension`/`family-care-leave`의 `timeline`을 데모 대본(§7)과 일치시킬 것(장기로 옮기거나, 섹션을 2개로 축소). **데이터의 timeline이 화면 섹션의 진실원천**이므로 persona showcase 텍스트가 아니라 데이터 기준으로 통일.
3. **confidence 3값 → 배지 2값 매핑 규칙 명시**(§1-2): 확인→"받을 가능성" / 잠재후보·미확인→"확인 필요". "미확인"이 "받을 가능성"으로 새지 않게.
4. **LLM provider를 스펙에 박기**(§3-3): 스캐폴드는 OpenAI. 키 모달 카피·문서를 OpenAI로 맞추거나, 바꿀 거면 지금 결정.
5. **curated-benefits.json의 web/ 읽기 경로 배선 명세**(§3-1): `fs` from `../data` vs `public/`로 복사. 첫 15분 안에.

### 🟡 P1/나중 — 데모 견고성·발표 방어 강화
6. **빈결과·applyUrl=null·LLM실패·폴백로딩 4개 상태 화면 명세**(§4-1).
7. **카드에 `deadline.note`(대기공백·기한) + `regionVaries` 문구 노출 필드 추가**(§5·§6). 02·05가 짚은 "대기공백기 안내"·정직성을 화면에 살리는 핵심. 데이터는 이미 있음 — UI가 안 읽을 뿐.
8. **"복지로 6단계 vs 우리 1문장" 대비를 화면 1줄 카피로**라도 넣을지 결정(§5). 05 킬러 방어의 가시화.
9. **폴백 시 "왜 해당되나" 1줄 = `eligibility.summary` 첫 문장 사용** 규칙 명시(§4-3).
10. **amount 카드에 "2026 기준·공식 링크 확인" 캡션 고정**(§6) + senior-outpatient 강조 시 입원 버전 수치 회수 검토(§7).

---

## 9. 검토 못 한 것 (정직 표기)
- **링크 라이브 점검**: applyUrl 79개의 실제 생존은 확인 안 함(VALIDATION.md도 "별도 검토 에이전트" 몫이라 명시). 발표 전 핵심 데모 경로 9개 링크는 직접 접속 확인 권장.
- **나머지 4개 페르소나**(dementia 일부만 확인)의 expectedKeyPrograms 전수 대조는 안 함 — 메인 Wow 1개 + dementia 의존성 체인만 정밀 확인. 나머지는 동일 데이터 구조라 동작 가능성 높으나 미검증.
- curated-benefits.json 79제도 전수가 아니라 persona 참조분 위주로 열람.
