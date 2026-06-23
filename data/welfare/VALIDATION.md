# curated-benefits 병합·검증 (VALIDATION)

- 원본 10파일 합계: **81제도** → dedup 후 **79제도**
- domain: parent 79
- confidence 분포: 확인 15 · 잠재후보 52 · 미확인 12
- regionVaries(지역상이): 21
- 중복 병합: 2건
  - senior-outpatient-flatrate: 01-senior-onset.json + 02-hospitalization.json → kept 01-senior-onset.json, situations=노년진입/입원
  - dementia-public-guardian: 04-frailty-dementia.json + 09-rights-safety.json → kept 04-frailty-dementia.json, situations=노쇠치매/가족환경/권리안전
- dangling 참조(없는 id): 0건
  - 없음
- 비표준 situation 키: 0건
  - 없음

> 생성: data/welfare/merge.mjs (결정론적). 링크 라이브 점검은 별도 검토 에이전트가 수행.
