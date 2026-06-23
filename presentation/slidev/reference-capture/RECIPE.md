# 발표 덱 디자인 레퍼런스 & 레시피

발표 덱을 만들 때 참고할 **벤치마킹 자산**. (CLAUDE.md 6단계에서 사용)

## 레퍼런스 덱 — BaizeAI @ KubeCon HK 2025
- 라이브: https://baizeai.github.io/talks/2025-06-11-kubecon-hk/
- 소스(공개, **Apache-2.0**): https://github.com/BaizeAI/talks → `packages/2025-06-11-kubecon-hk/`
- 기술: **Slidev** (기본 테마 + 커스텀 CSS + UnoCSS)
- 스크린샷: `shots/kubecon-hk/` (`01.png`~`29.png`, 각 슬라이드 v-click/v-motion 다 펼친 최종 상태)
  - 없으면 재생성(이 폴더에서): `npm install && node capture.mjs <덱URL>`

## "폴리시"의 정체 — 재현 레시피
특별한 비밀 컴포넌트 없음. 아래 조합이 전부다:
1. **다크 테마 + DM Sans 폰트** (콘텐츠 배경 검정 override)
2. **UnoCSS 유틸 클래스**로 레이아웃 (Tailwind식: `text-red-400`, `rounded-xl`, `grid` 등)
3. **아이콘 세트**를 `i-` 프리픽스로 풍부하게 (carbon/logos/ph 등)
4. **`delay-*` + `v-click`/`v-motion`** 으로 요소 시차 등장(스태거) ← "움직이는 느낌"의 핵심
5. **커스텀 CSS 마감** — 코드블록 반투명+백드롭 블러(`#16161690`), 미세 전환, 페이드/블러로 시각 위계

색 코딩: 문제=빨강 계열, 해결=초록 계열, 강조=블루.

## 소스 파일별 볼 것 (그대로 참고 가능)
| 파일 | 내용 |
|---|---|
| [slides.md](https://github.com/BaizeAI/talks/blob/main/packages/2025-06-11-kubecon-hk/slides.md) | 레이아웃·구조 + 인라인 UnoCSS + v-click/v-motion 패턴 |
| [style.css](https://github.com/BaizeAI/talks/blob/main/packages/2025-06-11-kubecon-hk/style.css) | 커스텀 CSS(블러·전환·코드블록·모션) |
| [uno.config.ts](https://github.com/BaizeAI/talks/blob/main/packages/2025-06-11-kubecon-hk/uno.config.ts) | UnoCSS 프리셋·웹폰트(DM Sans)·`delay-*` 안전목록·아이콘 |
| [global-bottom.vue](https://github.com/BaizeAI/talks/blob/main/packages/2025-06-11-kubecon-hk/global-bottom.vue) | 전 슬라이드 공통 하단(브랜딩) |

## 우리 덱에 적용하는 법 (Slidev 기준)
- `npm init slidev` 후 `slides.md` frontmatter에 `colorSchema: dark`, `fonts.sans: DM Sans`
- `uno.config.ts`에 `delay-*` safelist + 아이콘 프리셋 추가
- 슬라이드마다 `<div v-click>` / `v-motion :initial :enter` 로 스태거 등장
- 마감용 `style.css`에 코드블록 블러·전환 추가 (위 style.css 참고)

## 라이선스
BaizeAI/talks는 **Apache-2.0**. 레이아웃 아이디어 참고는 제약 없음. `style.css`/`uno.config.ts`를 **상당 부분 복사하면** 출처와 라이선스 고지를 남길 것.
