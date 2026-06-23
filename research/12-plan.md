# 12. Plan (04 단계) — 빌드 작업분해·파일소유권·병렬화

> 기준: [[09-spec]]. 레이아웃: `design/mockups/01·02`. 목표: 4시간 안에 P0 데모 + 시간 되는 만큼 P1.
> 원칙: **코어(P0) 먼저, 한 경로 끝까지.** 과병렬 금지 — 엔진(T1·T2)은 단독이 빠르다. UI·네이티브만 병렬.

## 재사용 자산 (새로 만들지 말 것)
- `web/` 스캐폴드: `app/layout.tsx`·`app/page.tsx`·`components/Header·Footer`·`app/globals.css`
- **`web/lib/llm.ts`** (OpenAI 배선 — 모델 id만 `gpt-5.5`로, 비전 경로 추가) · **`web/app/api/llm/route.ts`**
- **`web/lib/regions.ts`** (시도→시군구 — 지역 선택/자동선택)
- **데이터**: `data/welfare/curated-benefits.json`(79) · `data/questionnaire/*` · `data/personas/*`(테스트 픽스처)
- **KRDS**: `design/krds` 토큰 + `web/tailwind.config` + `@krds-ui/*` npm
- `data/snapshots/*`(P2 광역검색) · `data/boundaries`(P2 지도 베이스)

## 작업 분해 (소유권 = 파일 1:1, 충돌 0)

### Phase 0 — 엔진 (P0, 임계경로, 우선·단독)
- **T1 규칙엔진 데이터** ⭐ — `data/welfare/rules.json` 생성: `슬롯/키워드 → situation 점등 → 제도 랭킹`. **슬롯 어휘 1개로 통일**(canonical = `questionnaire.json slotSchema`); persona·slot-dictionary·curated 정렬. + `curated-benefits.json` **timeline 교정**(별도트랙·돌봄자=장기 등) + confidence→badge 규칙 명시. *(검토 #1·#2·#3 해소)*
- **T2 엔진 코드** — `web/lib/engine.ts`: slots → 점등 → 제도 수집 → **위상정렬(prerequisiteOf) 순서** → `exclusiveWith` 가지치기 → timeline 버킷 → confidence→badge. 순수 결정론, **personas로 단위검증**(매칭 0건 방지).
- **T3 슬롯 추출** — `web/lib/extract.ts` + `app/api/extract`: NL→slots(GPT-5.5). **폴백**=slot-dictionary 키워드 매칭. 비전(카메라) 입력도 같은 함수.

### Phase 1 — 코어 UI (P0)
- **T4 입력 화면** — `web/app/page.tsx` + `components/InputForm.tsx` + `components/KeyModal.tsx`: 자연어 textarea + 예시칩(personas) + 지역(regions.ts) + 질문지 입구 + ⚙️ 키 모달. 블루프린트 = mockup 01.
- **T5 처리·결과** — `components/ProcessingSlots.tsx` + `ResultTimeline.tsx` + `ProgramCard.tsx`: "이해중" 슬롯칩 + 「지금/퇴원후/장기」 카드(배지·왜·**tel:전화**·의존성·중복배제·서류·공식링크). 블루프린트 = mockup 01.

### Phase 2 — 질문지·네이티브 (P1, 코어 후 병렬)
- **T6 질문지** — `components/Questionnaire.tsx`: 10카드 복수선택 + 후속(questionnaire.json) → slots(같은 엔진 합류). 블루프린트 = mockup 02.
- **T7 GPS+카카오 지도** — `web/lib/kakao.ts` + `components/NearbyMap.tsx`: geolocation → 카카오 로컬 키워드검색(가까운 센터) → 지도·길찾기. 키 없으면 주소+전화로 폴백.
- **T8 카메라 서류** — `components/CameraInput.tsx`: `<input capture>` → GPT-5.5 비전 → slots(T3 재사용). 폴백=수동 텍스트.
- **T9 이미지 저장/공유** — `components/ShareExport.tsx`: html2canvas(CDN) PNG + Web Share. 폴백=다운로드.

### Phase 3 — stretch (P2)
- **T10** 푸시 알림 껍데기(시연용·정직 프레이밍) · 광역 16,000 검색(`app/api/search` + snapshots fs).

## 병렬화 / 임계경로
```
T1 ──> T2 ──┬─> T5 ──> [P0 데모 작동] ──> T6,T7,T8,T9 (병렬) ──> T10
            └─> T4 (T2와 병렬 가능, 인터페이스 합의 후)
T3 ──────────┘ (T2와 병렬)
```
- **단독·우선**: T1(판단 무거움)·T2(엔진). 여기 과병렬 ❌.
- **병렬 가능**: T4↔T5↔T3(엔진 타입 합의 후) / Phase2 T6~T9 서로 독립(파일 1:1) → 백그라운드 서브에이전트 분담.
- **데이터 경로**(검토 #5): API 라우트가 `process.cwd()→../data/welfare/curated-benefits.json`·`rules.json`·`../data/questionnaire/*`를 서버사이드 `fs`로 읽기. (web/ 밖)

## 폴백 요약 (task별)
- 추출: 키 없음 → 키워드 매칭 · 카카오: 키/실패 → 주소+전화 · 카메라: 비전 실패 → 수동입력 · 엔진: 매칭 0 → 빈결과 안내(+광역검색) · 이미지공유: Web Share 불가 → 다운로드.

## 컷 라인 (시간 부족 시)
P0(T1~T5)는 사수. P1은 **T6 → T7 → T8 → T9** 순서로 되는 만큼. 못 넣는 건 확장 슬라이드(데이터·디자인·목업 다 있어 진짜로 보임). 데이터·핵심경로는 절대 안 줄인다.
