import type { Config } from 'tailwindcss';
import krdsPlugin from '@krds-ui/tailwindcss-plugin';

/**
 * KRDS(대한민국 디지털정부 디자인시스템) 공식 셋업.
 *
 * design/krds/SOURCE.md 가이드(옵션 A)에 따라 @krds-ui/tailwindcss-plugin 을
 * 토큰 소스로 등록한다. 플러그인이 KRDS 색상(primary/secondary/gray/point/
 * danger/warning/success/info 등)과 타이포 스케일(display/heading/title/body/
 * detail/label/link + -mobile)을 Tailwind 테마로 주입한다.
 *
 * ※ 설치된 플러그인 v0.6.0 실측 결과:
 *   - 플러그인은 CSS 변수(--krds-color-*)를 주입하지 않고 "테마 프리셋"으로
 *     리터럴 값(hex/px)을 제공한다. 따라서 SOURCE.md 드롭인 config 의
 *     `var(--krds-color-*)` 별칭은 사용하지 않는다(미정의 변수 → 색 깨짐).
 *   - 플러그인은 컴포넌트 스타일을 주입하지 않는다. @krds-ui/core 의 프리빌드
 *     컴포넌트는 globals.css 의 `@krds-ui/core/dist/style.css` import 로 스타일링.
 *   - 플러그인은 screens 를 mobile/tablet/desktop 으로 "교체"하므로, 기존
 *     마크업의 sm/md/lg 가 사라진다 → 아래 extend.screens 로 복원한다.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@krds-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 플러그인이 교체한 screens 위에 표준 브레이크포인트 복원
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      fontFamily: {
        sans: [
          'Pretendard GOV',
          'Pretendard',
          'system-ui',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      // 프로젝트 전용 토큰 (플러그인 미제공)
      borderRadius: { krds: '6px', 'krds-lg': '12px' },
      maxWidth: { container: '1200px' },
    },
  },
  plugins: [krdsPlugin],
};

export default config;
