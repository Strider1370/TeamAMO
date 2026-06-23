# 트랙 C — 해외 사례 + 메커니즘 (가족 복지·돌봄 내비게이터)

> 확인 시점: 2026-06-23 / 담당: 트랙 C
> 목적: 해외 복지·돌봄 발견/내비게이션/자격 진단 서비스에서 **검증된 메커니즘을 추출**, 한국 맥락에 이식 가능한 "킥 후보"를 도출. (기능 베끼기 아님)

---

## 0. 요약 (먼저 읽기)

해외 사례를 분석하면, "사용자 상황 → 받을 혜택" 연결 메커니즘은 크게 **4가지 패턴**으로 나뉜다:

| 패턴 | 작동 방식 | 대표 사례 | 정직성 처리 |
|---|---|---|---|
| **A. 자격 계산기 (Eligibility Calculator)** | 소득·자산·연령 등 수치 입력 → 룰 엔진이 금액·자격 추정 | Age UK / Turn2us, NCOA BenefitsCheckUp | "may be entitled" (잠재) + 전문가 상담 권유 |
| **B. 생애사건 기반 진단 (Life-event navigation)** | "퇴직했다/부모를 돌본다" 등 생애사건 선택 → 최소 질문으로 관련 스킴 묶음 제시 | Singapore SupportGoWhere, US Benefits.gov | "might qualify" (잠재) + 신청처로 연결 |
| **C. 단일 진입 평가 (Single front-door assessment)** | 한 번의 표준 평가(IAT/NBA) → 모든 후속 서비스 자격 결정 | Australia My Aged Care, Germany Pflegegrad | 평가는 정부가 확정. 도구는 "준비를 돕는 안내" |
| **D. 능동적 케이스 매니저 (Proactive human navigator)** | 사람이 찾아와 상황 듣고 → 맞춤 스킴 연결 | Singapore Silver Generation Ambassadors | 사람이 판단·연결, 기술은 보조 |

**핵심 통찰**: 신뢰받는 서비스는 **단 한 곳도 "당신은 받습니다"라고 단정하지 않는다.** 모두 "받을 가능성이 있습니다(may/might)"로 표시하고, 실제 자격 확정은 공식 기관/평가로 넘긴다. 우리 프로젝트의 정직성 설계는 여기서 가져와야 한다.

---

## 1. 영국 — Age UK Benefits Calculator / Turn2us (패턴 A: 자격 계산기)

**메커니즘**
- 일련의 질문(소득·저축·연금·기존 수급·배우자 정보)을 받아 **룰 기반으로 받을 수 있는 급여와 추정 금액을 계산**.
- Turn2us는 각 질문 아래 "왜 이 질문을 하는가/어떻게 답하나" 도움말 링크를 붙여 **질문의 맥락을 설명** (블랙박스 아님).
- 결과 페이지: ① 받을 수 있는 급여 목록, ② 예상 수령액, ③ **신청 방법**까지 한 화면.
- Age UK는 잉글랜드·스코틀랜드·웨일스 커버. Turn2us 엔진을 여러 지자체/Carers UK가 화이트라벨로 재사용.

**신뢰/정직성 처리**
- 결과는 "what you **could be** claiming", "benefits you **may be** entitled to"로 표시 — **단정하지 않음**.
- 명시적 한계 고지: "정확한 판단을 위해서는 전문 급여 상담사와 상의할 것을 권함." 계산기는 **인디케이터(지표)**라는 점을 분명히 함.
- 사전 준비 안내: "시작 전 본인·배우자의 소득·저축·연금·기존 급여 정보를 모아두라" — **준비서류 체크리스트를 앞단에 배치**.

**한국 이식 킥 후보**: *"왜 이 질문을 하는지" 인라인 설명 + 결과를 '추정 금액 범위'로 보여주되 끝에 '정확한 판단은 주민센터/전문 상담' 핸드오프를 박는다 = 신뢰를 잃지 않는 자격 추정.*

출처:
- "Benefits Calculator - What benefits am I entitled to?", Age UK, https://www.ageuk.org.uk/information-advice/money-legal/benefits-entitlements/benefits-calculator/ (확인 2026-06-23)
- "Using the Turn2us Benefits Calculator", Turn2us, https://www.turn2us.org.uk/get-support/information-about-benefits/using-the-benefits-calculator (확인 2026-06-23)

---

## 2. 미국 — NCOA BenefitsCheckUp (패턴 A+B 혼합: 노인 특화 자격 진단)

**메커니즘** — *우리 프로젝트와 가장 가까운 레퍼런스 (노인 돌봄 특화)*
- NCOA(전미노화협의회) 운영. **노인·장애인 대상**으로 약 2,000개 혜택 프로그램(식비·약값·공과금·의료 등)을 커버.
- 3단계 작동: ① **우편번호(ZIP) + 관심 카테고리** 입력으로 지역 기반 1차 필터 → ② SNAP·메디케어 저소득 보조 등 특정 프로그램에 한해 **추가 질문으로 개인화** → ③ **맞춤 리포트** 생성.
- 결과 리포트: PDF 저장/이메일/답변 수정 가능, **"다른 사람을 대신해 진단" 기능** 존재(= 돌봄 자녀가 부모를 대신 진단하는 우리 타깃과 정확히 일치).
- 각 프로그램마다 ① 온라인 신청, ② 상세 정보, ③ 기관 직접 연락처 — **신청 경로 3종 분기**.

**신뢰/정직성 처리**
- 버튼 문구 자체가 "**See If You May Be Eligible**" — 단정 회피가 UI 카피에 박혀 있음.
- "추가 질문으로 자격 판단을 **도울(help determine)** 것"이라는 표현 — 최종 확정은 기관 몫.
- 막힐 경우 **사람 지원**(채팅/헬프라인 1-800/등록 전문가)으로 폴백.

**한국 이식 킥 후보**: *"본인이 아니라 부모를 대신 진단" 모드를 1급 기능으로 — 자녀가 부모 상황을 입력하면 부모 명의 리포트가 나오고, 결과를 PDF/공유로 가족·기관에 전달. 우리 타깃(돌봄 시작 자녀)에 직격.*

출처:
- "What Is BenefitsCheckUp and How Does It Help People Find Benefits Assistance?", NCOA, https://www.ncoa.org/article/what-is-benefitscheckup-and-how-does-it-help-people-find-benefits-assistance/ (확인 2026-06-23)
- BenefitsCheckUp 공식, https://benefitscheckup.org/ (확인 2026-06-23)

---

## 3. 싱가포르 — SupportGoWhere 자격 셀프체커 (패턴 B: 생애사건 기반 내비게이션)

**메커니즘** — *"검색이 아니라 내비게이터" 킥의 정수*
- LifeSG/GovTech 운영. 23개 이상 정부 기관의 지원 스킴을 **한 곳에서** 셀프체크하는 허브.
- 두 진입 방식: ① **인적사항/생활 상황 기반 셀프체커**, ② **생애사건(life event)별 탐색** — "부모 됨 / 은퇴 / 실직" 등 사건을 고르면 관련 스킴 묶음 제시.
- **설계 철학이 핵심**: "**가능한 한 적은 질문으로 정확한 결과를 반환**"하도록 설계. 모든 스킴 요건을 다 묻지 않고 **가장 관련성 높은 질문만으로 좁혀** 전환율(실제 신청까지)을 높이는 것이 목표. (GovTech 개발자 웨비나에서 명시)
- 영어/중국어/말레이어/타밀어 다국어.

**신뢰/정직성 처리**
- 결과는 "schemes you **might qualify for** based on your profile" — 셀프체크는 자격 보장 아님, **신청으로 연결**.

**한국 이식 킥 후보**: *"부모 돌봄 시작"을 하나의 생애사건으로 정의하고, 모든 요건을 묻는 대신 '가장 변별력 높은 3~5개 질문'만으로 후보 제도를 좁힌다 = 질문 피로 없는 내비게이션. (해커톤 데모에서 "5문항으로 끝난다"는 체감 가능)*

출처:
- SupportGoWhere 자격 체커, https://supportgowhere.life.gov.sg/eligibility (확인 2026-06-23)
- "Supporting the Community - SupportGoWhere (Part 2)", Singapore Government Developer Portal, https://www.developer.tech.gov.sg/communities/events/stack-meetups/past-webinars/supporting-the-community-part-2.html (확인 2026-06-23)

---

## 4. 호주 — My Aged Care (패턴 C: 단일 진입 + 대리 신청)

**메커니즘**
- 노인 돌봄의 **단일 정부 진입점(single front door)**. 온라인/전화/대면으로 정보 제공.
- 핵심: **본인 또는 가족·친구가 대신** 메디케어 카드로 10~15분 온라인 신청 가능 → My Aged Care가 필요에 따라 적합한 평가자에게 의뢰 → 표준화 평가도구(Integrated Assessment Tool, IAT)로 가정 방문 평가 → 지역 제공기관 검색.
- **자격 평가와 비용 산정을 분리**: 평가는 "서비스 자격"만 결정, 실제 부담금은 Services Australia가 소득·자산으로 별도 산정.

**신뢰/정직성 처리**
- 도구가 자격을 단정하지 않고, **표준 평가(IAT)로 정부가 확정**. 앱/사이트는 "신청과 평가 준비를 안내"하는 역할.
- 자격 결정과 비용 결정을 **명확히 분리**해 사용자 혼란/오해 방지.

**한국 이식 킥 후보**: *"받을 자격이 있는지"와 "얼마를 내는지"를 화면에서 분리 표기 — 자격 추정에서 비용을 함부로 단정하지 않음으로써 신뢰 유지. + 자녀의 '대리 신청' 흐름을 1순위로.*

출처:
- "How to get assessed", My Aged Care, https://www.myagedcare.gov.au/assessment (확인 2026-06-23)
- "How aged care needs assessments work", Australian Dept of Health, Disability and Ageing, https://www.health.gov.au/our-work/single-assessment-system/needs/how-it-works (확인 2026-06-23)

---

## 5. 독일 — Pflegegrad (요양등급) 안내 (패턴 C: 평가 준비 코칭)

**메커니즘**
- Pflegekasse(요양보험금고)에 **비공식 신청(전화·이메일·서면) → 전화한 날이 공식 신청일** → MDK(건강보험 의료심사단) 평가자가 가정 방문, **6개 모듈 기반 NBA(신평가체계)**로 5등급 중 등급 산정 → 5주 내 통보.
- 안내 콘텐츠(gesund.bund.de 등)는 **신청 절차 + 평가 대비 코칭**에 집중.

**신뢰/정직성 처리 — 매우 차별적**
- 단순 자격 안내를 넘어 **"평가에서 어떻게 행동하라"는 실행 코칭** 제공:
  - 최소 2주간 **돌봄 일지(care diary)** 작성 — 도움이 필요한 모든 일상 활동·소요시간·어려움 기록
  - 진단서·퇴원기록·약물목록·의사 소견서 등 **관련 서류 사전 수집**
  - 평가 시 **가족/돌봄자 동석**으로 관찰 보강
  - "가장 나쁜 날 기준으로 솔직하게" 답하라 (등급=수년간의 급여를 좌우하므로)

**한국 이식 킥 후보**: *장기요양등급 신청 같은 '방문 평가'가 있는 제도에 대해, 단순 자격 안내가 아니라 "평가 D-14 준비 코칭"을 붙인다 — 돌봄일지 작성 가이드, 챙길 서류, 동석 안내, 솔직하게 답하기. (검색엔진이 절대 못 주는 '내비게이터'의 결정적 차별점)*

출처:
- "care grades at a glance" / "care assessment", gesund.bund.de(독일 연방보건부), https://gesund.bund.de/en/care-grades-at-a-glance · https://gesund.bund.de/en/care-assessment (확인 2026-06-23)
- "Apply for a Care Level: Step by Step Guide 2026", Pflege Orga, https://pflege-orga.de/en/how-to-apply-for-a-care-level-step-by-step-guide-2026/ (확인 2026-06-23)

---

## 6. 미국 — Benefits.gov / USA.gov Benefit Finder (패턴 B: 생애사건 + 다기관 통합)

**메커니즘**
- USA.gov가 운영하는 **Benefit Finder**: 몇 가지 기본 질문 답 → 1,000개 이상 주·연방 프로그램 중 **받을 가능성 있는 혜택 맞춤 목록**을 한 페이지에서 비교.
- **생애사건(life events) 기반**으로 의료·재정·대출·재난구호 등 분류, 각 결과를 **신청 기관으로 연결**.
- 2~3분 내 완료 지향(저마찰).

**신뢰/정직성 처리**
- "benefits you **may be eligible** to receive" — 잠재 표시 일관.

**한국 이식 킥 후보**: *결과를 '비교 가능한 한 페이지'로 — 후보 제도들을 나란히 놓고 (받을 확률/예상 혜택/신청 난이도)를 비교표로. 돌봄 자녀가 우선순위를 정하기 쉬움.*

출처:
- "Find government benefits and financial help", USAGov, https://www.usa.gov/benefit-finder (확인 2026-06-23)

---

## 7. 싱가포르 — Silver Generation Ambassadors (패턴 D: 능동적 휴먼 내비게이터)

**메커니즘 — 디지털이 못하는 부분을 보여주는 대조군**
- AIC(통합돌봄청) 산하. **3,000+ 자원봉사 대사**가 노인 가정을 **직접 방문**, 상황을 듣고 → Merdeka Generation Package 혜택, 지역 활동 프로그램, Moments of Life 앱(본인의 자격 스킴/할인 확인) 등 **맞춤 연결**.
- "복지·커뮤니티 돌봄 서비스와 정부 사업 사이의 **간극을 메우는**" 역할 — 어디서 어떻게 도움받는지 모르는 노인을 능동적으로 발굴.

**신뢰/정직성 처리**
- 사람이 직접 판단·공감·연결. 기술(앱)은 사후 추적·확인 보조 도구.

**한국 이식 킥 후보(주의)**: *완전 자동화의 한계를 인정하는 설계 — 자동 진단 끝에 "막히면 여기로"(거주지 치매안심센터/주민센터/노인복지관 연락처·예약)를 항상 붙여, AI를 '사람 케이스매니저로 가는 길 안내'로 포지셔닝. 단정 대신 핸드오프.*

출처:
- "Silver Generation Office Ambassadors", Singapore Ministry of Health, https://www.moh.gov.sg/newsroom/silver-generation-office-ambassadors_2mar2022/ (확인 2026-06-23)
- "About SGO", Agency for Integrated Care, https://www.aic.sg/Age-Well/Silver-Generation-Office/About-SGO (확인 2026-06-23)

---

## 8. 결론 — 우리 프로젝트에 이식 가능한 킥 후보 종합

### 8-1. 3대 핵심 메커니즘 (반드시 가져갈 것)

1. **[정직성 = 신뢰의 핵심] "받습니다" 금지, "받을 가능성이 있습니다"로 통일**
   - 영국·미국·싱가포르·호주 **단 한 곳도 자격을 단정하지 않는다.** UI 카피부터 "See **If You May Be** Eligible".
   - 우리도 결과를 **"잠재 후보"**로 표시 + 각 제도에 **공식 출처(법령/정부 페이지) 인용** + 끝에 "정확한 판단은 주민센터/치매안심센터" **핸드오프** 고정.
   - → 이게 빠지면 "잘못된 정보 주는 위험한 봇"이 됨. 해커톤 심사에서 **책임 있는 AI 설계**로 어필 가능.

2. **[차별점의 씨앗] 평어→제도 언어 번역 + "평가/신청 준비 코칭"** (독일 Pflegegrad에서 추출)
   - 검색엔진/단순 챗봇과의 결정적 차이: **자격 안내에서 끝내지 않고 "그 다음 행동"을 코칭**.
   - 장기요양등급처럼 **방문 평가가 있는 제도**에는 → 돌봄일지 작성 가이드, 챙길 서류 목록, 평가 시 동석/솔직히 답하기 안내.
   - = 잠정 킥 "검색이 아니라 내비게이터"를 **실증하는 구체 기능**.

3. **[타깃 적중] "부모를 대신 진단" 대리 모드 + 생애사건 진입** (NCOA + SupportGoWhere)
   - 우리 사용자는 **돌봄 시작 자녀**. NCOA의 "screen for someone else", 호주의 "가족 대신 신청", 싱가포르의 "부모 돌봄=생애사건"을 합쳐:
   - **"부모님 상황을 자연어로 설명" → 부모 명의 맞춤 체크리스트** 생성 → PDF/공유로 가족·기관 전달.
   - **모든 요건을 묻지 않고 변별력 높은 3~5문항**으로 후보를 좁힘(SupportGoWhere의 "최소 질문" 철학) = 질문 피로 제거.

### 8-2. 보조 킥 (여유 시)
- **결과 비교표**(Benefits.gov): 후보 제도들을 (받을 확률·예상 혜택·신청 난이도)로 나란히 비교 → 자녀가 우선순위 결정.
- **자격/비용 분리 표기**(호주): 자격 추정에서 금액을 함부로 단정하지 않아 신뢰 유지.
- **"왜 이 질문을 하나" 인라인 설명**(Turn2us): 블랙박스 회피, 신뢰 형성.

### 8-3. 한 줄 차별화 선언 (피칭용)
> 해외의 자격 계산기들은 **"얼마 받는지"를 추정**하는 데서 멈춘다.
> 우리는 거기서 한 발 더 가서, **"무엇을, 어떤 순서로, 무엇을 준비해 신청하고, 방문 평가를 어떻게 대비하는지"**까지 코칭한다 (독일 Pflegegrad 모델).
> 그리고 우리 사용자는 노인 본인이 아니라 **돌봄을 막 시작한 자녀**다 — **대리 진단**과 **평어→제도 언어 번역**이 그래서 핵심이다.

---

## 9. 완료 기준 체크

- [x] 해외 사례 ≥3개 → **7개 확인** (英 Age UK/Turn2us, 美 NCOA·Benefits.gov, 濠 My Aged Care, 獨 Pflegegrad, 星 SupportGoWhere·Silver Generation)
- [x] 각 사례 핵심 메커니즘 분류 (4패턴: 계산기 / 생애사건 / 단일진입평가 / 휴먼 케이스매니저)
- [x] 신뢰/정직성 처리 방식 정리 (공통: "may/might be eligible" 잠재 표시 + 공식 핸드오프)
- [x] 각 사례 한국 이식 킥 후보 1줄
- [x] 출처(제목·URL·발행처·확인시점 2026-06-23) 명기
- [x] 결론: 이식 가능 킥 후보 종합 (3대 핵심 + 보조 + 피칭 선언)

> 주: SupportGoWhere 자격 체커 페이지는 JS 렌더링으로 본문 직접 확인 불가 → GovTech 개발자 웨비나(공식)에서 설계 철학 교차 확인. 그 외 사례는 모두 공식 출처 또는 운영기관 페이지로 실재 확인됨. 미확인 항목 없음.
