/**
 * KRDS 기반 Tailwind 설정 (드롭인 템플릿)
 *
 * 사전 설치:
 *   npm i @krds-ui/tailwindcss-plugin @krds-ui/core @krds-ui/icon
 *
 * @krds-ui/tailwindcss-plugin 이 KRDS 색상/타이포 토큰을 Tailwind에 주입한다.
 *   - CSS 변수: --krds-color-primary-50 (= #256ef4) 등
 *   - 타이포 유틸: text-display-l/m/s, text-heading-*, text-body-* 등
 *
 * 아래 theme.extend 의 시맨틱 별칭으로 bg-primary / text-primary 처럼 짧게 사용.
 * @type {import('tailwindcss').Config}
 */
import krdsPlugin from '@krds-ui/tailwindcss-plugin';

const krds = (name) => `var(--krds-color-${name})`;

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@krds-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 시맨틱 별칭 (플러그인이 주입한 KRDS 변수를 참조)
        primary: {
          DEFAULT: krds('primary-50'),
          fg: krds('gray-0'),
          5: krds('primary-5'), 10: krds('primary-10'), 20: krds('primary-20'),
          30: krds('primary-30'), 40: krds('primary-40'), 50: krds('primary-50'),
          60: krds('primary-60'), 70: krds('primary-70'), 80: krds('primary-80'),
          90: krds('primary-90'), 95: krds('primary-95'),
        },
        secondary: { DEFAULT: krds('secondary-50') },
        // 안전 주제용 상태 색 (KRDS gray 스케일 + 의미색은 프로젝트에서 확장)
        surface: krds('gray-0'),
        muted: krds('gray-50'),
        line: krds('gray-20'),
      },
      borderRadius: { krds: '6px' },
    },
  },
  plugins: [krdsPlugin],
};
