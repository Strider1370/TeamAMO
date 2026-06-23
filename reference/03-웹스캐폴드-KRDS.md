# 03. 웹 스캐폴드 + KRDS 사용 + 모바일 디자인 (레퍼런스)

> 사람이 읽는 참고 문서다. 자동화 엔진·게이트·단계 진행과는 무관하다.
> "무엇이 이미 준비돼 있고, 어떻게 재사용하며, 어디서 깨지는가"를 모아 둔 실전 메모.
> 검증된 `web/` 스캐폴드 위에서 KRDS 디자인을 쓰고, 모바일에서 안 깨지게 만드는 방법까지를 한 흐름으로 정리한다.

---

## 1. web/ 스캐폴드 재사용법

처음부터 만들지 마라. `web/`에는 이미 `install` + `build`가 통과하는 깨끗한 Next.js 스켈레톤이 있다.

### 명령어
```bash
cd web
npm install      # 최초 1회 (검증됨: Node 24 / npm 11)
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 검증
npm run lint
```
루트에서도 `npm run web:dev` / `npm run web:build` / `npm run web:lint`로 동일하게 동작한다.

스택: Next.js 14 (App Router) · React 18 · TypeScript · Tailwind 3 · `@krds-ui/core` (Apache-2.0).

### 구조 (자산 위치)
```
.
├── data/                      # 공개데이터 자산 (번들)
│   ├── boundaries/            # 전국 시도/시군구 경계 GeoJSON·TopoJSON
│   └── data-sources.md        # 공개데이터 입수 경로 + 정적/실시간 전략
├── design/krds/               # KRDS 토큰 원본(CSS/JSON/Figma) + SOURCE.md
└── web/                       # 작업할 Next.js 앱 (깨끗한 스켈레톤)
    ├── app/                   # layout.tsx, page.tsx(스켈레톤), globals.css
    ├── components/            # Header/Footer(범용)
    ├── lib/                   # regions.ts(시도→시군구) · shelters.ts(위치 유틸)
    ├── public/                # gov 엠블럼 · data(번들 JSON)
    └── scripts/build-shelters.mjs  # CP949 CSV → 정제 JSON 변환 패턴
```

### 재사용 가능한 자산 (먼저 쓸 수 있는지 확인하라)

| 자산 | 위치 | 쓸 수 있으면 |
|------|------|------|
| 검증된 스택 스캐폴드 | `web/` (Next.js+KRDS, `install`+`build` 통과) | init 생략하고 이걸로 시작 |
| 지역 데이터 | `web/lib/regions.ts` (전국 시도→시군구), `data/boundaries/` | 지역 선택/지도에 그대로 |
| 위치 유틸 | `web/lib/shelters.ts` (거리계산·정렬·필터, Haversine) | 위치 기반 정렬에 범용 재사용 |
| 데이터 가공 패턴 | `web/scripts/build-shelters.mjs` (CP949 CSV→정제 JSON) | 당일 받은 공개 CSV 가공에 |
| KRDS 디자인 | `design/krds/` (토큰), `web/public/gov/` (정부 엠블럼) | 정부 서비스 룩에 |
| 공개데이터 입수 경로 | `data/data-sources.md` | 당일 데이터 다운로드/신청 |
| LLM 호출 헬퍼 | `web/lib/llm.ts`(`openaiChat`) + `web/app/api/llm/route.ts` | 앱에서 LLM 쓸 때(키 없으면 폴백) — 새로 만들지 마라 |

사용 디테일:
- 시도 목록 = `Object.keys(SIGUNGU_BY_SIDO)` (`web/lib/regions.ts`).
- 거리계산은 Haversine — 위치 기반 정렬 어디에나 쓸 수 있다.

> ⚠️ **범용 부품(폼·지도 등)이 필요하면 말로 추가하라.** 입력 폼·지도 패널·카카오맵 같은 화면 부품은 스캐폴드에 상시 제공된다고 단정하지 마라(정리 과정에서 빠질 수 있다). 필요해지면 그때 KRDS 토큰을 입혀 직접 만들거나 가벼운 컴포넌트로 추가하면 된다. 레이아웃에 종속시키지 말고 필요한 화면에서만 import하는 형태로 둔다.

### 번들 공개데이터 인덱스 포인터
키 없이 바로 쓸 수 있는 공개데이터(경계·시설·POI 등)가 레포에 번들돼 있다. 새로 찾거나 API를 호출하기 전에 먼저 번들 인덱스(`data/INDEX.md`)와 `data/data-sources.md`를 확인하라. 모집단은 전수로 두고, 화면에는 일부만 표시하는 패턴을 권장한다(시간이 부족하면 데이터가 아니라 화면 수를 줄인다).

> ⚠️ 주제가 공공/지역 기반이 **아니면** KRDS·공개데이터 자산은 짐이 된다. `web/` 스캐폴드와 워크플로우만 쓰고 나머지는 떼어내라.

---

## 2. KRDS 사용 시 함정 (실측)

- **Tailwind 플러그인은 `screens` 기반 리터럴 프리셋이다.** `@krds-ui/tailwindcss-plugin` v0.6.0은 CSS 변수(`var(--krds-color-*)`)를 주입하지 **않고** 리터럴 테마 프리셋을 주입한다. `web/tailwind.config.ts`가 정답 설정이다 — `design/krds/`에 있는 드롭인 config는 변수 방식이라 그대로 쓰면 색이 깨진다(참고용으로만).
- **CSS 변수가 없다.** 위와 같은 이유로 `var(--krds-*)`에 의존하는 코드를 가져오면 안 된다. 토큰은 Tailwind 유틸리티 클래스로 쓴다.
- **컴포넌트 스타일은 import로 들어온다.** `globals.css`의 `@krds-ui/core/dist/style.css` import가 컴포넌트 스타일의 출처다. 이 import가 빠지면 KRDS 컴포넌트가 스타일 없이 렌더된다.
- **`Badge`는 children이 아니라 `label` prop.** `<Badge label="위험" variant="danger" size="small" />`.
- **`@krds-ui/core`의 `Select`는 비제어형이다.** 폼 상태 연동이 필요하면 KRDS 토큰을 입힌 native `<select>`를 쓰라(스켈레톤 `page.tsx` 참고).
- **커스텀 토큰**: `rounded-krds`(6px) · `rounded-krds-lg`(12px) · `max-w-container`(1200px).

---

## 3. 카카오 키 / 403 차단 대응 (일반)

지도·위치 기능이나 외부 데이터 입수를 쓰는 주제에 해당한다.

### 카카오맵 JS 키 (미리 준비)
- developers.kakao.com에서 JS 키 발급 + **도메인 등록**이 필요하다. 당일에 하면 늦다.
- `web/.env.local.example` → `.env.local` 복사 후 `NEXT_PUBLIC_KAKAO_MAP_KEY`를 채운다.
- 지도를 안 써도 fallback으로 앱은 돈다(키 없으면 지도만 비활성).

### 카카오 도메인 등록 (401/referer)
- JS SDK는 페이지 **origin을 카카오 콘솔의 도메인 목록에 등록**해야 동작한다. 미등록 referer는 거부된다.
- localhost / 공인 IP / 배포처럼 origin이 바뀌면 그 origin을 각각 등록해야 한다.
- 실제 origin은 `console.log(location.origin)`으로 확인하라(추측 금지).

### https / geolocation
- `navigator.geolocation`은 **보안 출처(https)가 아니면 막힌다** — OS 권한을 줘도 안 된다. 로컬 http에서 위치가 필요하면 https로 배포하라.

### data.go.kr 등 403 차단 (데이터 입수)
환경에 따라 다르게 대응한다(포기·날조 금지):
- **막힌 환경(클라우드 등)**: `data.go.kr` 등이 403으로 막힌다 → 헛시도하지 말고 미리 받아둔 파일을 쓰라. 없으면 사용자에게 요청한다.
- **열린 환경(로컬/허용 정책)**: 직접 다운로드를 *시도*하라(로그인/키가 필요하면 브라우저로 폴백).
- **권위 단일 소스 1개 우선**, 못 받으면 화면에 "샘플"임을 명시한다.
- 받은 파일은 `web/scripts/build-shelters.mjs` 같은 변환 패턴(CP949 CSV → 정제 JSON)으로 가공한다. 상세 경로는 `data/data-sources.md`.

> **미리 준비 팁**: 주제에 필요한 권위 단일 데이터셋은 대회 전에 받아 `data/`에 넣어 두라 — 막힌 환경에선 당일 다운로드가 안 된다(403).
> **경로 공백 주의**: 폴더 경로(특히 윈도우 사용자명)에 공백이 있으면 일부 빌드 도구(Vite/Slidev)가 깨진다 → 공백 없는 경로(예: `C:\dev\<repo>`)에 두라.

---

## 4. 모바일 디자인 체크 (실전)

> "폰 폭에서 안 깨진다 ≠ 모바일 앱"이다. 반응형 웹을 그대로 두면 "폰에 욱여넣은 웹사이트"로 보인다.
> 전부 JS/CSS라 빠르게 고칠 수 있다. 데모를 폰/미러링으로 보여줄 때 차이가 크게 드러난다.

### 4-1. 데스크톱 크롬을 모바일에선 걷어내라 (`md:` 분기)
데스크톱 웹의 흔적을 모바일에서 숨기고 **앱 셸**(컴팩트 헤더 + 본문 + 핵심 행동)로 재구성한다. `md:` 분기로 데스크톱은 그대로 보존.
- **상단 GNB·정부 Masthead 같은 큰 헤더** → 모바일 숨김(`hidden md:block`). 앱 헤더는 로고+이름 1줄로 충분.
- **큰 히어로 배너** → 모바일에서 패딩·폰트 축소(예: `pb-5 pt-6 md:pb-16`, `text-heading-m md:text-display-m`).
- **핵심 입력/행동이 첫 화면(fold)에 보이게.** 슬로건이 입력보다 위 무게를 차지하면 우선순위가 틀린 것.
- **하단 탭바는 목적지가 있을 때만.** 단일 행동 앱(입력→결과)엔 과하다. "최근 내역" 같은 destination이 생기면 그때.

### 4-2. 한국어·터치·입력 디테일
- **한글 줄바꿈**: 제목에 `break-keep`(word-break: keep-all). 안 주면 음절 중간에서 깨진다("쉬운 첫 걸/음"). 전역 적용을 권장(스캐폴드 `globals.css`에서 처리).
- **하단 고정(sticky) CTA는 양날의 검**: 엄지 접근성↑이지만 결과가 길어지면 스크롤 중 오탭 위험. 결과형 화면에선 인라인이 안전할 때가 많다.
- **사진/파일 입력**: 작은 "첨부됨" 배지보다 입력창(textarea)을 미리보기 블록으로 대체하는 게 상태가 분명하다. 빼기·초기화 버튼 같이.
- **입력 충돌 주의**: 예시 텍스트를 채운 뒤 사진을 첨부하면 텍스트가 같이 전송돼 결과가 섞이는 버그가 흔하다 → 첨부 시 텍스트 비우기.
- 칩/버튼 라벨은 짧게 — 한 줄에 들어가게. 버튼이 줄바꿈되면 size를 medium으로.

### 4-3. fold 기준
첫 화면(스크롤 0 = fold)에 핵심 입력/행동이 보이는지를 항상 따로 본다. 데스크톱에서 멀쩡해 보여도 390px에선 슬로건·배너가 fold를 잡아먹는 경우가 많다.

---

## 5. Playwright 뷰포트 검증

폰 WebView는 `adb screencap`이 검은 화면(보안 서피스)으로 나온다. 그래서 모바일 화면 검증은 Playwright 모바일 뷰포트로 한다.

```js
// 390px 모바일 뷰포트로 캡처
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
});
```
- **fold(스크롤 0)와 full(전체) 둘 다** 캡처해 본다.
- 파일 첨부 상태는 `setInputFiles`로 시뮬레이션해 검증할 수 있다.
- 가능하면 **실기기·실입력으로 도그푸드**하라 — 데스크톱에선 안 보이던 게 폰에서 드러난다(첫 화면 위치 밀림, 키보드 가림, 사진 입력 흐름, 실제 데이터의 매칭 품질).

---

## 6. 선택 보조 명령 (없어도 됨)

엔진/게이트와 무관한 편의 스크립트다. **필수가 아니며 없어도 작업은 진행된다.**
- `npm run check-identity` — 산출물 정합성 점검(선택).
- `npm run generate-banner -- --topic "<주제>"` — 홈 hero 배너를 주제 맞춤 이미지로 교체(선택). `OPENAI_API_KEY`가 없으면 건너뛰고 기본 배너를 유지한다(앱은 안 깨짐). 기본 배너는 `web/public/hero-banner.png`(범용 청사 사진).

이 명령들은 통과해야 다음으로 넘어가는 "게이트"가 아니라, 있으면 편한 보조 도구로만 취급한다.
