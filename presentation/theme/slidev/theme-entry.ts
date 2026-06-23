/**
 * theme/slidev/theme-entry.ts — Slidev 테마 진입점 (최소 스캐폴드).
 *
 * 기본 출력은 Slidev 기본 테마를 쓴다(slides.md frontmatter 에서 theme 키 생략).
 * 커스텀 테마가 필요할 때 styles/·layouts/·components/ 를 채우고 여기서 연결한다.
 */

/**
 * layout-registry.json 의 renderers.slidev 값과 매칭되는 Slidev layout 이름들.
 */
export const slidevLayouts = [
  "cover",
  "default",
  "two-cols",
  "image",
  "image-right",
  "center",
  "statement",
  "quote",
  "end",
] as const;

export default {
  /* TODO(Stage 09): Slidev 테마 config(fonts, defaults) 정의. */
};
