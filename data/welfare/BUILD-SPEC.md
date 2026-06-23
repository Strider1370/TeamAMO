# curated-benefits 빌드 스펙 (모든 분류 에이전트 공통 계약)

> 이 파일은 `data/welfare/curated/*.json`을 만드는 모든 에이전트가 **반드시 먼저 읽고 그대로 따르는** 단일 계약이다.
> 원자재(제도명·URL·절차)는 `research/06-situation-catalog.md`에 있다. 거기 시드를 자기 분류에 맞게 옮기고 **확장**한다.
> 확인 기준일(verifiedAt) = **2026-06-23**.

## 0. 정직성 규칙 (어기면 안 됨)
- 자격은 **단정 금지** → `eligibility.confidence`는 기본 `"잠재후보"`. 자가응답으로 확실한 하드규칙(만65세·독거 등)만 `"확인"`. 자료 불일치·못 찾음은 `"미확인"`.
- 금액·소득기준은 **2026 고시로 확인된 것만** 숫자. 변동·불명확은 `null` 또는 `"지역마다 다름"`. **틀린 액수는 독약 — 모르면 비운다.**
- 모든 항목에 `source.url`(공식 1차 링크 우선) + `verifiedAt`. URL은 실재 도메인만. 지어내기 금지.
- 지자체별 상이 제도는 `regionVaries: true` + `amount`는 `"지역마다 다름 → 링크 확인"`.

## 1. 표준 situation 키 (이 10개만 사용, 다중 가능)
`노년진입` · `입원` · `퇴원ADL` · `노쇠치매` · `가족환경` · `경제주거` · `말기임종` · `장애등록` · `권리안전` · `돌봄자지원`

## 2. JSON 스키마 (배열의 각 원소)
```json
{
  "id": "ltci-recognition",
  "name": "노인장기요양보험 장기요양인정 신청",
  "aliases": ["장기요양등급", "요양등급 신청"],
  "situations": ["퇴원ADL", "노쇠치매"],
  "attributeTags": [],
  "target": "parent",
  "agency": "국민건강보험공단",
  "track": "행정절차",
  "phone": "1577-1000",
  "eligibility": {
    "summary": "만 65세 이상, 또는 65세 미만 노인성 질병 & 거동/인지 저하",
    "slots": { "age": ">=65 또는 노인성질병", "adl": "도움 필요" },
    "incomeRule": null,
    "confidence": "잠재후보"
  },
  "deadline": { "type": "상시", "note": "신청→방문조사→판정 최대 30일 공백" },
  "howToApply": { "online": "longtermcare.or.kr·The건강보험앱", "offline": "공단 운영센터 방문·우편·팩스" },
  "applyUrl": "https://www.longtermcare.or.kr",
  "wlfareInfoId": null,
  "documents": ["장기요양인정신청서", "의사소견서", "신분증"],
  "procedure": ["신청", "방문 인정조사+의사소견서", "등급판정위 판정", "인정서·이용계획서 수령", "기관 계약·이용"],
  "sequence": { "order": 1, "prerequisiteOf": ["home-care-visit", "welfare-equipment", "day-night-care"] },
  "exclusiveWith": ["elderly-customized-care"],
  "timeline": "지금",
  "amount": "등급별 재가/시설 급여(본인부담 일부)",
  "regionVaries": false,
  "source": { "url": "https://www.longtermcare.or.kr", "verifiedAt": "2026-06-23" },
  "notes": ""
}
```

### 필드 규칙
- `id`: kebab-case slug, **전 분류에서 유일**해야 함(병합 키). 아래 §4 표준 id를 그대로 쓸 것.
- `track`: `현금급여` | `서비스` | `감면` | `의료` | `행정절차` 중 하나.
- `target`: `parent`(부모) | `caregiver`(자녀).
- `deadline.type`: `상시` | `사건상대기한`(예: 퇴원 후 180일) | `정기모집`(연초 등) | `대기공백`(판정 대기).
- `timeline`: `지금` | `퇴원후` | `장기` — 체크리스트 단계 분할용.
- `sequence.prerequisiteOf` / `exclusiveWith`: **다른 제도의 id로** 참조(이름 아님). 모르면 `[]`.
- 값이 없으면 `null` 또는 `[]`/`""`. 필드 자체를 빼지 말 것(스키마 고정).

## 3. 공유 제도 소유권 (중복 정의 금지)
여러 분류에 걸치는 제도는 **주인(primary) 분류 1곳에서만 정의**하고, situations에 관련 분류를 다 태깅한다. 다른 분류 에이전트는 이걸 **다시 정의하지 않는다**(병합 시 충돌 방지).
- `elderly-customized-care`(노인맞춤돌봄) → 주인: **노쇠치매**
- `housing-benefit`(주거급여) → 주인: **경제주거**
- `emergency-safety`(응급안전안심) → 주인: **가족환경**
- `family-care-leave`(가족돌봄휴직)·`family-care-vacation`(가족돌봄휴가) → 주인: **돌봄자지원**
- `survivor-pension`(유족연금)·`death-lumpsum`(사망일시금) → 주인: **말기임종**

## 4. 분류별 시드 id (06 기반, 각자 여기에 **추가 발굴**해 8~15개로)
- **노년진입**: basic-pension, nps-old-age, senior-jobs, telecom-discount, subway-free-ride, ktx-senior-discount, (지자체)longevity-allowance, eye-screening, farmland-pension[attributeTags:농어촌]
- **입원**: catastrophic-medical, special-copay(산정특례), integrated-nursing(간호간병통합), senior-outpatient-flatrate(노인외래정액제), knee-replacement-support
- **퇴원ADL**: ltci-recognition, home-care-visit(방문요양/간호), day-night-care(주야간보호), welfare-equipment(복지용구), short-term-care(단기보호), visiting-bath(방문목욕)
- **노쇠치매**: dementia-center(치매안심센터), dementia-treatment-cost(치매치료관리비), elderly-customized-care, wandering-id(배회인식표), dementia-public-guardian(치매공공후견), fingerprint-prereg(실종예방 지문등록), hearing-aid(보청기)
- **가족환경**: emergency-safety, survivor-pension(태깅만; 정의는 말기임종), solo-elder-checkin(안부확인), household-change-recheck(가구원변경 복지재점검)
- **경제주거**: basic-livelihood(기초생활보장), emergency-welfare(긴급복지), medical-aid(의료급여), energy-voucher(에너지바우처), housing-benefit(주거급여), utility-discount(요금감면), culture-voucher(통합문화이용권)
- **말기임종**: advance-directive(사전연명의료의향서), hospice(호스피스), funeral-benefit(장제급여), survivor-pension, death-lumpsum, safe-inheritance(안심상속 원스톱)
- **장애등록**: disability-registration, disability-pension(장애인연금), disability-activity-support(활동지원), disability-medical(의료비), assistive-device(보조기기 교부)
- **권리안전**: elder-protection(노인보호전문기관 1577-1389), adult-guardianship(성년후견), elder-abuse-shelter(학대피해노인 쉼터)
- **돌봄자지원**: family-care-leave, family-care-vacation, work-hour-reduction(근로시간단축), ltci-family-respite(장기요양 가족휴가제), caregiver-counseling(가족 심리상담)

> 위 추가 id는 권장 후보다. **실재 확인되면 채택, 못 찾으면 빼고 confidence/notes에 사유**를 남긴다. 각 분류 최소 6개 이상.
