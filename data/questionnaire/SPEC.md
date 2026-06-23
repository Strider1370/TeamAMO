# 질문지(Structured Input) + 슬롯 사전 스펙

> 확인 기준일: **2026-06-23**
> 산출물: `questionnaire.json`(진입 카드 + situation별 후속 문항), `slot-dictionary.json`(평어 동의어 → canonical 슬롯)
> 핵심 계약: **자연어 입력과 질문지 입력이 동일한 `slots` 객체로 수렴**해 같은 매칭 엔진(규칙 테이블, research/06 Task3)에 들어간다.

## 1. 흐름: 질문지 → 슬롯 → 규칙 매칭

```
[진입 카드] "어떤 일이 생겼나요?"
   → 표준 10 situation 키 중 1개 이상 선택 (multiSelect)
        │
        ▼
[situation별 후속 2~4문항]  ── 각 답 옵션이 emit: { slot: value }
        │
        ▼
[누적 slots 객체]  ◀────  (다른 경로) 자연어 한 문장
        │                       │  AI 추출 + slot-dictionary 동의어 매핑
        ▼                       ▼
        └──────── 동일 스키마의 slots ────────┘
                        │
                        ▼
[규칙 매칭 엔진]  research/06-situation-catalog.md Task3 규칙 테이블
  키워드/슬롯 → 점등 제도. 다축 동시 점등. 의존성·중복배제 적용.
                        │
                        ▼
[「지금 / 퇴원후 / 장기」 타임라인 체크리스트]  + 각 제도 공식 링크 + "확인 필요"
```

- 두 입력 경로(질문지·자연어)는 **같은 `slots` 키/값 어휘**를 쓴다. 그래야 한 엔진이 양쪽을 처리한다.
- 질문지는 자연어 추출이 놓치기 쉬운 슬롯(소득밴드·연령 구간·재직 여부)을 **명시적으로** 채워 보강한다.

## 2. 슬롯 어휘 표 (canonical — curated 정합)

| 슬롯 축 | canonical 값 | curated 근거 |
|---|---|---|
| `target` | 부 / 모 / 본인 / 배우자 | curated `target`은 parent/caregiver이나, 사용자 표현축으로 부/모/본인/배우자 사용(엔진에서 parent로 매핑) |
| `age` | `>=65` / `>=60` / `>=18` / `>=19` / `<65` | eligibility.slots `age`: `>=65`, `>=60`, `>=18`, `>=19` 그대로 |
| `condition` | 치매 / 뇌졸중 / 골절 / 암 / 파킨슨 / 중증화상 / 희귀난치 / 기타 | Task3 키워드(치매·뇌졸중·골절·암·파킨슨) + special-copay 진단 어휘(암·중증화상·희귀·중증난치) |
| `adl` | 도움 필요 / 보조기기 필요 / 독립 | discharge eligibility.slots `adl`: `"도움 필요"`, `"보조기기 필요"` 그대로 |
| `household` | 독거 / 노인2인 / 조손 / 동거 | family-change eligibility.slots `household`: `"독거"`, `"노인2인·조손"` |
| `incomeBand` | 기초수급 / 차상위 / 기초연금 / 일반 | 전반 incomeRule 어휘: 기초생활수급자 / 차상위 / 기초연금 수급자 |
| `lifeEvent` | 입원 / 퇴원 / 진단 / 사별 / 은퇴 / 위기사유 | deadline·slots: 퇴원(catastrophic-medical), 사망/가구원변경(end-of-life·family-change), 위기사유(emergency-welfare) |
| `caregiver` | 자녀 직장병행 / 소진 | caregiver eligibility.slots `employment`(재직 근로자), purpose `"보호자 휴식(레스핏)"` |
| `permanentDisability` | 후유장애 / 없음 | disability-registration slots `condition`: `"장애 고착·영구화"` |
| `region` | 자유 문자열(시군구) | regionVaries 제도용(지자체 확인) |

## 3. curated와 어긋나는 지점 (보고)

curated의 `eligibility.slots`는 **제도별로 키 이름이 자유로운 상태**(통일된 슬롯 사전이 아님)다. 질문지는 사용자 표현에 맞는 **통일 슬롯 축**을 정의했고, 다음 지점은 엔진에서 정규화(매핑)가 필요하다:

1. **`target` 어휘 불일치(설계상 의도된 갈래)**: curated `target`은 `parent`/`caregiver` 두 값뿐. 질문지는 사용자가 말하는 대로 `부/모/본인/배우자`를 받는다. → 엔진에서 부/모/배우자/본인 → `parent`(돌봄 대상), 돌봄자 문맥은 `caregiver`로 매핑. **curated를 바꾸지 말 것.**

2. **`condition` 통합 키 없음**: curated는 같은 의미를 `diagnosis`(special-copay), `condition`(disability·rehab) 등 서로 다른 키로 적었다. 질문지·사전은 단일 축 `condition`으로 통일. 매칭 시 두 키를 함께 조회.

3. **`incomeBand` vs 원자료의 서술형 incomeRule**: curated는 `"기준중위소득 48% 이하"` 같은 **서술형**을 쓰고 자격 판정에 쓴다. 질문지는 사용자가 아는 수준(`기초수급/차상위/기초연금/일반`)만 받는다. → 질문지 슬롯은 **자격 판정용이 아니라 점등 힌트용**. 실제 소득 충족 여부는 공식 링크에서 확인.

4. **`household` 복합값 분해**: curated `"노인2인·조손"`을 질문지는 `노인2인`, `조손`으로 분리 제공. 의미 동일, 표현만 분해.

5. **`lifeEvent: 위기사유`**: curated `crisisEvent`/`crisis` 키에 대응. 동의어 사전에서 "형편이 빠듯"류는 `incomeBand:일반` + `lifeEvent:위기사유`를 함께 emit(과점등보다 누락 방지 우선, 최종은 링크 확인).

6. **`slot-dictionary`의 `situation` 직접 emit**: 학대·금융착취 평어는 슬롯 축이 아니라 situation `권리안전`을 직접 점등(해당 트랙은 슬롯값보다 상황 자체가 트리거).

## 4. 정직성 (Guardrail)

- **질문지는 자격을 판정하지 않는다.** 답변은 `slots`(점등 힌트)만 만든다. "받을 수 있다"가 아니라 "받을 가능성이 있으니 확인해 보세요"까지만.
- 소득·연령·재산 충족 여부의 **최종 확인은 각 제도의 공식 링크**(curated `applyUrl`/`source.url`)에서. 금액·기준은 매년 고시로 바뀐다.
- 모르는 항목은 비운다(emit `{}`). 슬롯이 비어도 엔진은 동작하며, 정보가 적으면 점등 제도가 줄 뿐이다 — **틀린 단정보다 빈 슬롯이 안전**.
- 슬롯 어휘는 curated와 어긋나면 안 된다. 새 축이 필요하면 먼저 curated 정합성을 확인하고 위 §3에 보고한다.
