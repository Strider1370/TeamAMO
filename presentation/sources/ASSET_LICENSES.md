# 자산 라이선스 및 출처 (ASSET_LICENSES)

> 외부 Slidev 템플릿·폰트·아이콘·이미지의 **사용/수정/배포 가능 여부**를 기록한다.
> 참고 캡처는 시각 기준으로만 쓰고 최종 슬라이드에 그대로 삽입하지 않는다.
> 기계 판독용 메타는 `provenance.json` 참조.
> (※ 이전 Notion 정적 HTML·Marp·Reveal 백업 엔진은 키트에서 제거됨 — 엔진은 Slidev 단일.)

## 폰트

| 폰트 | 출처 | 라이선스 | 비고 |
|------|------|----------|------|
| Pretendard | orioncactus/pretendard | OFL-1.1 | 본문 기본. **Slidev 로컬 번들** `presentation/slidev/public/fonts/PretendardVariable.woff2` |
| Noto Sans KR | Google Fonts | OFL-1.1 | 한글 폴백 |
| Inter | Google Fonts | OFL-1.1 | 라틴 |
| Fraunces | Google Fonts | OFL-1.1 | 세리프 강조 |

> ⚠️ 오프라인 발표: 위 폰트는 CDN 의존이 아니라 **로컬 번들**로 가져와야 인터넷 없이 깨지지 않는다.
> - **Slidev: 완료** — Pretendard 변수 폰트를 `presentation/slidev/public/fonts/`에 번들하고 `style.css` `@font-face`로 연결(CDN 무관).

## 아이콘

| 세트 | 출처 | 라이선스 | 비고 |
|------|------|----------|------|
| Carbon | @iconify-json/carbon | Apache-2.0 | slidev 의존성에 포함 |
| Phosphor (ph) | @iconify-json/ph | MIT | |
| Twemoji | @iconify-json/twemoji | CC-BY-4.0 | 출처표기 필요 |

## Slidev 엔진 (코드 차용 — 시각 기준 아님)

`presentation/slidev/`의 글로우 배경·페이드 전환·v-click 등장 "엔진"은 **BaizeAI/talks** 덱에서 이식했다.

| 자산 | 출처 | 라이선스 | 사용 범위 / 비고 |
|------|------|----------|------------------|
| `global-bottom.vue` (글로우 배경 컴포넌트) | github.com/BaizeAI/talks → `packages/2025-06-11-kubecon-hk/global-bottom.vue` | Apache-2.0 | 사용/수정/배포 가능. **글로우 폴리곤 시스템 크레딧: @pi0, @Atinux** (컴포넌트 주석 명시). seedrandom 기반. |
| `style.css` (페이드 전환·v-click 블러·코드블록 폴리시) | github.com/BaizeAI/talks → 동 패키지 `style.css` | Apache-2.0 | 사용/수정/배포 가능. Slidev 루트 자동 로드. |
| `uno.config.ts` (presetWind3 dark·presetIcons·webfonts·delay-* safelist) | github.com/BaizeAI/talks → 동 패키지 `uno.config.ts` | Apache-2.0 | 사용/수정/배포 가능. 폰트만 한국어(Noto Sans KR)로 적응. |
| `slides.md` headmatter 규약 (colorSchema:dark, transition:fade-out, css:unocss, mdc:true, glowSeed/glow) | github.com/BaizeAI/talks | Apache-2.0 | 규약 차용, 본문은 자체 작성(재난 가이드 데모). |

- 저장소: https://github.com/BaizeAI/talks
- 라이선스 전문: https://github.com/BaizeAI/talks/blob/main/LICENSE.md (Apache License 2.0)
- 외부 에셋(KubeCon.svg, DaoCloud.svg 등 BaizeAI 고유 자산)은 가져오지 않았다.

## 참고 캡처

| 자산 | 출처 | 라이선스 | 사용 범위 |
|------|------|----------|-----------|
| BaizeAI KubeCon 덱 | slidev/reference-capture/RECIPE.md 링크 | Apache-2.0 | **시각 기준만** — 최종 슬라이드 삽입 금지 |

## TODO (실사용 시 채울 것)
- [ ] 당일 추가한 외부 이미지/스크린샷의 출처·라이선스
- [ ] 데모 화면 캡처(자체 제작 → 팀 소유)
- [ ] 외부 URL 자산을 로컬 복사했는지 체크
