# presentation/ — 발표 덱 만들기 안내

해커톤 발표 자료를 만드는 곳. **엔진은 Slidev 단일.**

> 상세 방법·톤·카피 작성법은 **`reference/04-발표-Slidev.md`** 가 본체다. 이 파일은 폴더 지도와 명령만 담는다.

## 흐름

```
발표 대본(script)
  → deck.json            ← 슬라이드 계약(단일 진실원). 슬롯 이름 = reference/04 §3 필드맵
  → copy.md              ← 카피 검토/수정 양식(항상 함께 — reference/04 §5.2)
  → slides.md            ← Slidev 마크다운 (generate-slidev)
  → slidev build (dist)  ← 정적 서빙으로 발표·캡처(dev 서버 charset 깨짐 회피)
```

- AI는 슬라이드마다 HTML/CSS를 자유 생성하지 않는다. **등록된 semantic layout**(`layout-registry.json`)을 골라 슬롯에 내용을 채우면 `generate-slidev.mjs`가 렌더한다.
- 카피 편집은 `copy.md`로(편집 오버레이는 없앴다 — reference/04 §5.2).

## 명령 (루트에서)

```bash
npm run presentation:validate-deck   # deck.json 계약 검증
npm run presentation:slidev          # deck.json → slides.md
npm run presentation:validate-slides # slides.md ↔ deck 슬라이드 수
npm run presentation:build           # 위 셋을 한 번에
npm run presentation:gallery         # 16개 레이아웃 한 장씩 채운 갤러리
npm run presentation:capture         # slidev build(dist) 서빙 + Playwright PNG 캡처
npm run presentation:pdf             # PDF 내보내기
```
> `generate-scenes.mjs`/`select-layouts.mjs`는 스캐폴드다 — deck.json을 AI가 직접 쓰면 불필요.
> 입력(deck.json)이 없으면 생성기는 안내만 내고 종료(exit 0)한다.

## 디렉터리

```
presentation/
├── deck.json / copy.md / slides.md   # 산출물(실사용 때 생성)
├── generator/                  # 계약·레지스트리·생성기
│   ├── deck.schema.json        # deck.json 스키마
│   ├── layout-registry.json    # 16 semantic layout + 슬롯 + role→layout 규칙
│   ├── engine-registry.json    # slidev 단일
│   ├── generate-slidev.mjs     # deck.json → slides.md
│   ├── validate-deck.mjs / validate-slides.mjs
│   └── capture.mjs / make-pdf.mjs / make-gallery.mjs
├── slidev/                     # Slidev 프로젝트(slides.md·style.css·uno.config·public)
├── theme/slidev/               # 커스텀 테마 자리(기본은 Slidev 기본 테마)
├── serve-static.mjs            # dist 정적 서빙(UTF-8 강제) — 발표·캡처용
└── sources/                    # 원본/라이선스 기록
```

## 16 Semantic Layout
`hero · problem-flow · contrast · insight-statement · product-overview · demo-fullscreen · demo-callout · architecture · before-after · big-number · card-grid · timeline · quote · limitation-guardrail · expansion-map · closing`
→ `layout-registry.json`에서 Slidev 렌더러·슬롯으로 매핑. **등록 안 된 layout 임의 생성 금지.**

## Hard Rules (reference/04 §핵심 규칙 요약)
- 등록 안 된 layout 임의 생성 금지 / 슬라이드마다 새 CSS 생성 금지 / 원본 템플릿 덮어쓰기 금지.
- 발표 대본을 슬라이드에 그대로 복사 금지. 참고 캡처를 최종 슬라이드에 그대로 삽입 금지.
- 실제 앱 캡처가 있으면 목업보다 우선. 외부 URL 자산은 로컬 복사(오프라인 시연 가능).
- **화면 카피는 사람이 쓴다**(copy.md). 구현 안 한 기능 실제처럼 발표 금지.
- 데모 백업은 **단계별 스크린샷(.png)** — 영상/GIF는 만들지 않는다.

## 슬라이드 구조 (5분 / 8장 안팎)
**타이틀 후크 → 문제(Before) → 솔루션 → 데모(2분+) → 킥(차별점) → 임팩트·공공가치 → 확장+팀**
- 데모+킥에 시간 50%+. 슬라이드 제목 = 한 문장 주장. 장당 메시지 1개. **본문도 빔 뒤에서 읽히게 크게**(reference/04 §6.2).
