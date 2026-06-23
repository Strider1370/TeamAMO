# 한국 공공 서비스 해커톤 키트 (손으로 운전)

4시간 AI 해커톤에서 주제를 받자마자 "돌아가는 데모 + 발표"까지 만들기 위한 **참고 키트**입니다.

> **진행 체크리스트 + 참고 라이브러리 + 빈 스캐폴드.** 결과물(앱·발표)은 주제를 받고 새로 만듭니다.

## 구성
- **`PROCESS-CHECKLIST.md`** — 척추. 13단계 진행 방법(일반). 이걸 보며 단계를 직접 끌고 갑니다.
- **`reference/`** — 참고 라이브러리(6). 단계마다 필요한 것을 펼쳐 적용합니다.
- **`web/`** — Next.js 14 + KRDS **빈 스캐폴드**(정체성 자리표시). 폼·지도 같은 부품은 필요할 때 추가.
- **`presentation/`** — Slidev 발표 생성 도구(선택).
- **`data/`** — 키 없이 쓰는 공개데이터(인덱스 `data/INDEX.md`).
- `CLAUDE.md` — AI가 먼저 읽는 가벼운 안내(엔진 아님).

## 세팅
독립 npm 프로젝트 3곳을 한 번씩 설치:

| 위치 | 명령 | 용도 |
|---|---|---|
| 루트 | `npm install` | 발표 생성기·스크립트 도구 |
| `web/` | `npm install` | Next.js + KRDS 앱 |
| `presentation/slidev/` | `npm install` | 슬라이드 렌더·프리뷰 |

**키는 코드/저장소에 넣지 않습니다.** LLM 키는 앱 런타임에 직접 입력(설정 ⚙️·⋯ → 키 모달), 없으면 폴백 동작. (상세 `reference/06-AI연동.md`)

## 실행
| 명령 | 동작 |
|---|---|
| `npm run web:dev` | 웹앱 개발 서버 → http://localhost:3000 |
| `npm run presentation:build` | `deck.json` 검증 → Slidev `slides.md` 생성 → 슬라이드 검증 |
| `npm run presentation:gallery` | **16개 레이아웃을 한 장씩 채운 "갤러리" 생성** — 처음에 어떤 레이아웃 쓸지 훑어보기용 |
| `cd presentation/slidev && npm run dev` | Slidev 발표 미리보기 → http://localhost:3030 (`--host`로 LAN 공유 가능) |
| `npm run presentation:capture` | `slidev build`(dist) 정적 서빙 + Playwright 슬라이드 PNG 캡처 (Playwright 필요: `npm i -g playwright && npx playwright install chromium`) |
| `npm run generate-banner -- --topic "<주제>"` | 홈 히어로 배너 교체 (선택 — `OPENAI_API_KEY` 있을 때) |

## 쓰는 법
1. `PROCESS-CHECKLIST.md`를 펼친다 (인쇄 권장).
2. 단계를 직접 끌고 가며, 그 단계에 맞는 `reference/` 문서를 AI에게 펼쳐 시킨다.
3. 게이트·자동 진행은 없다 — **다음 단계로 갈지는 사람이 판단**, 품질은 체크리스트로 자가 점검.

## 참고 라이브러리 (`reference/`)
| 파일 | 내용 |
|---|---|
| `01-기획-인사이트.md` | 문제정의·Insight·JTBD·차별화·레드팀·발표 내러티브 |
| `02-기획-병렬리서치.md` | LLM 병렬 리서치(브리핑→발표맥락 포함→트랙 전파→통합) |
| `03-웹스캐폴드-KRDS.md` | web/ 스캐폴드·KRDS 사용·모바일 디자인 |
| `04-발표-Slidev.md` | Slidev 발표 제작·카피 작성·톤 |
| `05-배포-모바일-APK.md` | 자체 AWS https 배포·APK·scrcpy 미러링 |
| `06-AI연동.md` | LLM 키 런타임 입력·음성(GPT Realtime) |

## 폴더 구조
```
CLAUDE.md             AI용 가벼운 안내 (엔진 아님)
PROCESS-CHECKLIST.md  13단계 진행 체크리스트 (척추)
reference/            참고 라이브러리 (6)
web/                  Next.js + KRDS 빈 스캐폴드
data/                 공개데이터(경계·대피소 등) + data-sources.md + INDEX.md
design/krds/          KRDS 토큰·엠블럼
presentation/         Slidev 발표 생성 도구 + 결과물
docs/images/          발표 예시 이미지
research/             (선택) 리서치 보고서 둘 곳
```

## 대회 당일 컴플라이언스
- **신규 저장소** 생성 → 시작 직후 완성형 대량 커밋 금지 → **점진 커밋**(과정 보이게).
- 쓴 공개 템플릿/데이터/라이브러리는 **출처·URL·라이선스 기록**(제출).
- 애매하면 **사용 전 운영진 확인**.

## 라이선스와 출처
KRDS 이용약관 · `@krds-ui/core`(Apache-2.0) · 공공데이터포털. 발표 엔진은 BaizeAI/talks(Apache-2.0) 카드 디자인 이식.
자세한 출처: `design/krds/SOURCE.md`, `data/data-sources.md`, `presentation/sources/`.
