# 공공데이터 소스 목록 (해커톤용)

> 구분 원칙: **자주 안 바뀌는 위치/시설/조건 = 정적 다운로드**, **시시각각 바뀌는 상태/경보/측정값 = 실시간 API**
>
> ⚠️ **데이터 입수 — 환경에 따라 다르게 행동하라 (포기 말고, 지어내지도 마라):**
> - **권위 단일 소스 우선**: 웹을 흩어 크롤하지 말고, 아래 표의 *권위 있는 단일 데이터셋 1개*를 받아 변환하라(예: 복지=복지로 복지서비스정보 `15083323`). 단일 소스 1개가 크롤 50번보다 빠르고 정확하다.
> - **막힌 환경(예: 이 클라우드 컨테이너)**: `data.go.kr`·`safetydata.go.kr`·`data.seoul.go.kr`이 `403 host_not_allowed`로 차단된다(네트워크 정책 — 사이트가 아니라 환경이 막는 것). **헛시도로 시간 버리지 말고**, 사람이 미리 받아 레포 `data/`에 둔 파일을 써라. 없으면 사용자에게 "이 파일을 받아 `data/`에 넣어 달라"고 *구체적으로 요청*하라.
> - **열린 환경(로컬/허용된 네트워크 정책)**: 직접 다운로드를 **시도하라.** 단 `fileData.do`는 로그인/회원가입, `openapi.do`는 키 신청이 필요할 수 있어 자동화가 막히면 브라우저 다운로드로 폴백.
> - **금지**: 데이터를 못 받았다고 수치를 *지어내지* 마라. 받은 1차 데이터만 쓰고, 못 받았으면 화면·발표에 "샘플/예시"로 명시하라.

## 검증된 작동 엔드포인트 (실측, 2026-06-19 확인)

> 대회 전날 5분에 미리 활용신청하세요. 승인은 데이터셋에 따라 즉시~1·2일.

| 데이터셋 | ID | 엔드포인트 | 형식 | 승인 | 전체건수 | 비고 |
|---|---|---|---|---|---|---|
| 보조금24 공공서비스(혜택) | 15113968 | `https://api.odcloud.kr/api/gov24/v3/serviceList` | JSON | 자동(즉시) | 10,957 | LIKE/EQ 필터, 상세는 `gov24/v3/serviceDetail` |
| 중앙부처복지서비스 | 15090532 | `https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001` | XML | 활용신청 필요(미승인 시 Forbidden) | 452 | 대분류 코드 필터 |
| 지자체복지서비스 | 15108347 | `https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist` | XML | 활용신청 필요 | 4,569 | 지역 필터 |
| 복지로 복지서비스정보 | 15083323 | data.go.kr fileData | CSV | 로그인 다운로드 | - | 자격요건 필드 없음(명칭·링크만) |

합계 ≈ 15,978건. 키는 `web/.env.local`의 `DATA_GO_KR_KEY`(URL Decoding 키)로 둔다 — 커밋 금지.

**교훈(실측):**
- 정밀 자격기준은 대부분 *산문*이라 자동 전수 판정 불가 → 큐레이션 fixture(`data/welfare/curated-benefits.example.json`)를 병행한다.
- 진짜 개인 맞춤 자격 판정(보조금24 맞춤안내)은 행정정보 연계라 외부 API로 안 온다 — 데모는 "잠재 적격 후보"까지만 정직하게 표현한다.

**준비된 스크립트·스냅샷 (키 있으면 전수 적재):**
- 전수 덤프: `node data/scripts/dump-gov24.mjs`(보조금24 JSON) · `node data/scripts/dump-welfare.mjs`(중앙부처·지자체 XML) · `node data/scripts/dump-facility.mjs`(전국사회복지시설 38,440건, 주소·전화·종류 — **좌표는 없음**, 지도 거리정렬은 주소 지오코딩 필요) → `data/snapshots/*.json`. 상세 `data/scripts/README.md`.
- 스냅샷 활용: `data/snapshots/gov24-services.json`(전수 ~10,957건)은 **사전 준비된 공개 데이터**다(반입 허용). 구현 단계에서 키 있으면 라이브 API, 없으면 이 스냅샷을 키워드 필터해 쓰도록 연결한다 — **연동 라우트/UI는 당일 구현**(완성품 사전 반입 금지).
- 큐레이션 양식: `data/welfare/curated-benefits.example.json`(정밀 매칭용 빈 양식 — 대표 혜택 8~15개를 손으로 규칙화).
- **복지·혜택 주제면** 상세(표준 스키마 `Benefit`/`EvidenceStat`/`Facility` · `SOURCE_LOG` · 데이터 우선순위)는 `docs/welfare-benefit-dataset-prep.md` 참조.

## ✅ 이미 받아둔 데이터 (인증 불필요, GitHub 미러)

`data/boundaries/` — 출처: southkorea/southkorea-maps (kostat 2018)

| 파일 | 내용 | 비고 |
|---|---|---|
| `skorea-provinces-geo.json` | 시도 경계 17개 (GeoJSON, props: name/code/name_eng) | 바로 사용 가능 |
| `skorea-provinces-topo.json` | 시도 경계 (TopoJSON, 경량 860KB) | topojson-client 변환 |
| `skorea-municipalities-topo.json` | 시군구 경계 (TopoJSON, 1.9MB) | topojson-client 변환 |

## 🔑 직접 신청 필요 (사용자가 미리 발급해둘 것)

### 지도
- **카카오맵 JS SDK 키** — developers.kakao.com (도메인 등록 필요). UTMK(EPSG:5179) 좌표 변환은 proj4js.

### 복지·혜택 (정적 비중 높음 — 받아서 박제)
CSV/파일 다운로드 (fileData.do):
| 데이터 | 다운로드 페이지 |
|---|---|
| 한국사회보장정보원_복지서비스정보 (복지로, 핵심) | https://www.data.go.kr/data/15083323/fileData.do |
| 한국사회보장정보원_민간복지서비스정보 | https://www.data.go.kr/data/15116392/fileData.do |

API 키 신청 (openapi.do):
| 데이터 | 페이지 |
|---|---|
| 보조금24 대한민국 공공서비스(혜택) 정보 | https://www.data.go.kr/data/15113968/openapi.do |
| 한국사회보장정보원_중앙부처복지서비스 | https://www.data.go.kr/data/15090532/openapi.do |

### 생활·안전 (실시간 API 비중 높음)
정적 — CSV/파일 바로 다운로드 (standard.do/fileData.do, 다운로드 버튼 있음):
| 데이터 | 다운로드 페이지 |
|---|---|
| 전국무더위쉼터표준데이터 (한파쉼터 통합) | https://www.data.go.kr/data/15013199/standard.do |
| 전국어린이보호구역표준데이터 | https://www.data.go.kr/data/15012891/standard.do |
| 전국CCTV표준데이터 | https://www.data.go.kr/data/15013094/standard.do |
| 전국지진옥외대피장소표준데이터 | https://www.data.go.kr/data/15072620/standard.do |
| 전국민방위대피시설표준데이터 | https://www.data.go.kr/data/15021098/standard.do |
| 전국도시공원정보표준데이터 | https://www.data.go.kr/data/15012890/standard.do |
| 전국공공시설개방정보표준데이터 | https://www.data.go.kr/data/15013117/standard.do |
| 행정안전부_안전비상벨위치정보 | https://www.data.go.kr/data/15075539/fileData.do |
| 행정안전부_CCTV정보 | https://www.data.go.kr/data/15075538/fileData.do |

정적/API — 키 신청 필요 (openapi.do, 다운로드 버튼 없음):
| 데이터 | 페이지 |
|---|---|
| 생활안전지도 치안안전시설(경찰/지구대) | https://www.data.go.kr/data/15101889/openapi.do |
| 행정안전부_민방위대피시설 | https://www.data.go.kr/data/15115459/openapi.do |
| 산사태위험지구/우려지역 | https://www.data.go.kr/data/15139763/openapi.do |

실시간 API (키 발급 + 호출코드 미리 작성):
| API | 출처 | 내용 |
|---|---|---|
| 긴급재난문자 | safetydata.go.kr (가입+활용신청) | 실시간 재난문자 |
| 대기오염정보(에어코리아) | data.go.kr/data/15073861 | 실시간 미세먼지/PM2.5 |
| 기상특보 | data.go.kr (기상청) | 한파·폭염·호우 등 12종 |
| 단기예보/초단기실황 | data.go.kr (기상청) | 동네날씨 |
| 지진정보 | data.go.kr (기상청) | 지진 통보 |
| 침수/도로통제·IoT센싱 | safetydata.go.kr | 실시간 |

## ⚠️ 리스크 메모
- data.go.kr API: 신청 후 자동승인(즉시)도 있으나 일부 1~2일 심사. **지금 미리 신청.**
- safetydata.go.kr: 별도 가입 + 활용신청 필요.
- 모든 실시간 API는 **호출 실패 시 정적 백업으로 fallback** 하도록 구현 → 데모 안정성.
