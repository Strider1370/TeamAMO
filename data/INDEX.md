# 번들 데이터 인덱스 (키 없이 바로 쓸 수 있는 것)

> ⚠️ **데이터 작업(검색·매칭·지도) 전에 이 파일부터 읽어라.** 아래는 레포에 **이미 들어있는 공개 데이터**다 — API 호출·새로 찾기 전에 이걸 먼저 쓴다.
> 전부 공개 공공데이터(반입 허용). 출처는 각 행의 sourceUrl/문서 참고. 재생성·신규 적재는 `data/scripts/` + `data/data-sources.md`.
> 💡 **실제 레코드 값이 궁금하면 `data/samples/`** — 각 데이터셋 앞 3건을 떠 둔 미리보기다. 아래 표는 필드 이름·용도만 알려주니, 필드에 실제로 어떤 문장/값이 들어있는지는 샘플로 확인하라(무거운 전체 스냅샷 없이도 기획 단계에서 볼 수 있게).

## 혜택·복지·공공서비스 카탈로그 (검색/매칭 모집단)
| 파일 | 건수 | 주요 필드 | 좌표 | 쓰임 |
|---|---|---|---|---|
| `data/snapshots/gov24-services.json` | **10,957** | 서비스명·서비스목적요약·서비스분야·지원대상·선정기준·신청기한·신청방법·소관기관명·**상세조회URL(gov.kr)** | ❌ | 보조금24 공공서비스(혜택) 전수 — 지원금·혜택 검색의 본체 |
| `data/snapshots/welfare-central.json` | **452** | servNm·servDgst·jurMnofNm·lifeArray·trgterIndvdlArray·**servDtlLink(복지로)**·aplyMtdNm | ❌ | 중앙부처 복지서비스 |
| `data/snapshots/welfare-local.json` | **4,569** | 위 + **ctpvNm·sgguNm(지역)** | ❌ | 지자체 복지서비스(지역 필터 가능) |
| `data/welfare/curated-benefits.example.json` | (빈 양식) | id·name·rules(eligibility·slots)·applyUrl | — | 정밀 룰 매칭용 — 대표 8~15개 손으로 채움 |

→ 검색: 사용자 키워드(지역·대상·관심)로 `서비스명/지원대상/서비스목적요약`에 `includes` 필터. 자격기준은 산문이라 정밀판정 불가 → "잠재 후보"로 정직하게, **공식 URL 인용**.

## 시설·장소 (다음 행동 / 지도)
| 파일 | 건수 | 주요 필드 | 좌표 | 쓰임 |
|---|---|---|---|---|
| `data/snapshots/facilities.json` | **38,440** | name·typeCode·address·sido·sigungu·phone | ❌(주소O) | 전국 사회복지시설(노인 24k·아동 7k·장애인 4k…) — "가까운 복지관/시설 안내". 거리정렬은 주소 지오코딩 필요 |
| `web/public/data/shelters/civildefense/*.json` (+`_index.json`) | **17,197** | id·type·name·address·sido·sigungu·**lat·lng** | ✅ | 민방위 대피소 — **좌표 있어 지도·거리정렬 바로 됨** |

## 지역·경계 (필터/지도 베이스)
| 파일 | 내용 | 쓰임 |
|---|---|---|
| `web/lib/regions.ts` | 전국 시도→시군구 | 지역 선택 UI(`UserInfoForm`) |
| `data/boundaries/skorea-provinces-{geo,topo}.json` | 시도 경계 | 지도 행정경계 |
| `data/boundaries/skorea-municipalities-topo.json` | 시군구 경계(TopoJSON) | 지도 행정경계 |

## 앱에서 읽는 법 (주의)
- 스냅샷은 **`data/`(web/ 밖)** 에 있어 클라이언트가 직접 못 읽고 용량도 큼(수MB~16MB).
- **서버사이드(API route)에서 `fs`로 읽어 필터해 작은 결과만 반환**하라(`process.cwd()`는 `web/` → `../data/snapshots/...`). 전체를 클라로 내려보내지 말 것.
- 대피소(`web/public/`)는 fetch로 클라에서 바로 가능(좌표 있음).

## 한 줄
**지원금·복지·공공서비스 질문 = gov24+복지 스냅샷(~16,000건)으로 검색(공식 URL 인용). 시설/장소 = facilities·대피소. 지역 = regions/boundaries.** 새로 찾기 전에 여기 있는지부터 본다.
