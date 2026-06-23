# 공공데이터 전수 덤프 스크립트

검증된 엔드포인트로 보조금24·복지 데이터를 전수로 받아 `data/snapshots/`에 저장한다.
무키/미승인/네트워크 차단 시에는 앱이 인라인 샘플로 폴백하므로, 이 덤프는 "실데이터 데모"용 선택 자산이다.

## 절차
1. `web/.env.local` 에 `DATA_GO_KR_KEY=<서비스키>` (커밋 금지). **URL Decoding 키**를 넣는다.
2. 각 데이터셋 활용신청 승인 확인(보조금24=자동 즉시, 복지 2종=신청 필요). 엔드포인트·승인표는 `data/data-sources.md`.
3. `node data/scripts/dump-gov24.mjs` → `data/snapshots/gov24-services.json` (~10,957건)
4. `node data/scripts/dump-welfare.mjs` → `data/snapshots/welfare-central.json`(~452), `welfare-local.json`(~4,569)

## 규칙
- 공개 데이터의 사전 스냅샷은 허용된 사전 준비다. 완성형 미션 답안 서비스는 당일 조립한다.
- 출처/라이선스는 제출 시 `SOURCE_LOG`에 기록.
