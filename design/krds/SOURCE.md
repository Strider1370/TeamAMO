# KRDS 디자인 토큰 (대한민국 디지털정부 디자인시스템)

해커톤 템플릿의 **디자인 베이스**. KRDS 공식 토큰을 그대로 차용해 "정부 서비스 룩"을 확보한다.

## 출처 / 라이선스
- 출처: [KRDS-uiux/krds-uiux](https://github.com/KRDS-uiux/krds-uiux) (v1.1.0)
- 공식 사이트: https://www.krds.go.kr/
- 라이선스: **KRDS 이용약관**을 따름 → https://www.krds.go.kr/html/site/utility/utility_06.html
  - 공공/정부 디지털 서비스용 디자인 시스템. 해커톤 프로토타입 용도엔 적합.
  - 상업적 재배포 시 이용약관 재확인 필요.

## 파일
| 파일 | 내용 | 용도 |
|---|---|---|
| `tokens/transformed_tokens.json` | 토큰 원본 (primitive·semantic·mode-light·high-contrast·responsive) | Tailwind config 매핑 소스 |
| `tokens/figma_token.json` | Figma용 토큰 | 디자인 작업 시 |
| `krds_tokens.css` | CSS 변수 768개 (바로 사용) | `globals.css`에 import |
| `krds.min.css` | KRDS 컴포넌트 전체 스타일 | 컴포넌트 빠른 프로토타이핑 |

## 사용법 (Next.js + Tailwind)
1. `krds_tokens.css`를 `app/globals.css` 상단에서 import → CSS 변수 활성화
2. Tailwind `theme.extend`에서 변수 참조:
   ```js
   colors: { primary: 'var(--krds-color-light-primary-50)' }  // #256ef4
   ```
3. semantic 토큰(`gap`, `radius` 등)은 `transformed_tokens.json`에서 매핑

## React 컴포넌트 + Tailwind 플러그인 (npm, Apache-2.0)
공식 토큰(위 파일들)과 별개로, 커뮤니티 React 라이브러리를 **npm으로 설치**해 컴포넌트와
Tailwind 토큰 매핑을 한 번에 가져올 수 있다. (레포에 벤더링하지 않음 — 설치만)

- 출처: [KRDS-community/krds-react](https://github.com/KRDS-community/krds-react) — **Apache-2.0**
- 패키지: `@krds-ui/core` (컴포넌트), `@krds-ui/icon` (아이콘), `@krds-ui/tailwindcss-plugin` (토큰)

```bash
npm i @krds-ui/core @krds-ui/icon @krds-ui/tailwindcss-plugin
```

### 셋업 (이 폴더의 드롭인 파일 사용)
1. `tailwind.config.js` → 프로젝트 루트로 복사 (플러그인 등록 + 시맨틱 별칭 포함)
2. `globals.css` → `app/globals.css` 로 사용
3. 컴포넌트: `import { Button } from '@krds-ui/core'`
4. 타이포 유틸 바로 사용: `text-display-l`(66px), `text-heading-*`, `text-body-*`
5. 색상: `bg-primary`, `text-primary-70`, `border-line` 등

> 플러그인은 `--krds-color-primary-50`(= #256ef4) 형태로 변수를 주입한다.
> 벤더링된 `krds_tokens.css`는 `--krds-color-light-primary-50` 형태(접두어 `light`) — 둘이 값은 동일.

## 핵심 값 (참고)
- Primary: `#256ef4` (krds-color-light-primary-50) — 정부 블루
- 색상: primary/secondary/gray + 시맨틱 5~95 스케일
- 모드: light / high-contrast(고대비, 접근성) / 반응형(pc·mobile)
