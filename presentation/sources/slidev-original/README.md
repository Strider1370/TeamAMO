# sources/slidev-original/ — Slidev 원본 템플릿 보관소

> Doc2 §4. **원본 자산은 분석·추출에만 쓴다. 직접 덮어쓰지 않는다.**

## 무엇을 두나
- 보유한 **Slidev 템플릿/테마 원본**(layouts, components, global CSS, UnoCSS/Tailwind 설정).
- 목록화 대상: 모든 layout 이름, 각 layout 의 slot, 커스텀 component, 글로벌 CSS,
  전환·애니메이션·아이콘, 발표자 노트, build/export 명령 (Doc2 §7.2).

## 어떻게 쓰나
1. 원본을 여기 그대로 둔다(수정 금지).
2. layout 인벤토리를 만들어 → `presentation/generator/layout-registry.json` 의
   `renderers.slidev` 값으로 등록한다(등록 안 된 layout 임의 생성 금지, Doc2 §17 #2).
3. 재사용 가능한 layout/component/style 은 `presentation/theme/slidev/`로 정리해 이식한다.

## 기존 Slidev 자산과의 관계
- 작업용 Slidev 프로젝트는 `presentation/slidev/`(보존 — 소스 수정 금지, 참조만).
- 잘 만든 덱 벤치마킹은 `presentation/slidev/reference-capture/RECIPE.md`.
- 이 폴더는 그 중 **재사용할 원본 템플릿**을 분석용으로 따로 보관하는 곳이다.

## 현재 상태
- 비어 있음(스캐폴드). 기본 엔진은 `presentation/slidev/`의 `@slidev/theme-default`.

## 출처/라이선스
새 원본을 넣으면 `../ASSET_LICENSES.md` 와 `../provenance.json` 에 출처를 기록한다.
