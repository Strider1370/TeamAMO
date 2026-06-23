# 레이아웃 프리셋 갤러리 (Slidev · BaizeAI 카드 언어)

> **출처:** [BaizeAI/talks](https://github.com/BaizeAI/talks) `2025-06-11-kubecon-hk` (Apache-2.0). 레이아웃 구조를 프리셋으로 추출.
> **미리보기 덱:** `presentation/slidev/presets-preview.md` — 12종을 한 장씩 렌더. 빌드해서 눈으로 고르세요.
> **사용법:** 아래 스니펫을 `slidev/slides.md` 슬라이드 본문에 복사 → `{{...}}` placeholder를 내용으로 교체.

이 프리셋들은 `presentation/slidev/` 엔진(theme:none + UnoCSS presetWind3/presetAttributify + glow `global-bottom.vue`) 위에서만 동작합니다. `mdc: true` headmatter 필요.

## 미리보기 빌드/캡처

```bash
cd presentation/slidev
pnpm exec slidev build presets-preview.md --out dist-presets   # 빌드
# 캡처는 generator/capture 류 도구로 dist-presets 를 띄워서 확인
```

---

## 공통 어휘 (먼저 이것만 익히면 됨)

**시그니처 프로스트 카드** — 중립 카드의 기본형:
```html
<div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm>
  <div flex items-center bg="white/10" backdrop-blur px-3 py-2 rounded-md>   <!-- 아이콘 헤더 바 -->
    <div i-carbon:{{ICON}} text-{{COLOR}}-300 text-sm mr-2 />
    <div font-semibold>{{TITLE}}</div>
  </div>
  <div px-4 py-3>{{BODY}}</div>
</div>
```

**색 코딩** (헤더 바는 `{color}-800/40`, 본문 배경은 `{color}-800/20`, 보더는 `{color}-800`):
| 의미 | 색 | 아이콘 예 |
|------|-----|-----------|
| 문제·경고 | `red`, `amber` | `i-carbon:warning-alt`, `i-carbon:close` |
| 해결·성공 | `green`, `lime`, `emerald` | `i-carbon:checkmark-outline`, `i-carbon:checkmark` |
| 중립·기술 | `blue`, `sky`, `indigo`, `cyan` | `i-carbon:download`, `i-carbon:data-check` |
| 강조·보조 | `purple`, `pink`, `yellow` | 맥락에 맞게 |
| 중립 카드 | `white/5` (+헤더 `white/10`) | — |

**스태거(시차) 등장** — 두 가지:
```html
<v-clicks>           <!-- 자식 블록들이 순서대로 등장 -->
  <div>...</div>
  <div>...</div>
</v-clicks>

<div v-click>...</div>                 <!-- 개별 클릭 -->
<div v-click="2">...</div>             <!-- 2번째 클릭에 등장 -->
<div v-after>...</div>                  <!-- 직전 v-click 과 동시 -->
<div :class="$clicks < 1 ? 'translate-x--20 opacity-0' : 'translate-x-0 opacity-100'"
     transition duration-500 ease-in-out>...</div>   <!-- 클릭 상태로 직접 애니메이션 -->
```

**아이콘 세트** (이 엔진에 설치된 것만 사용): `i-carbon:*`, `i-ph:*`, `i-logos:*`, `i-simple-icons:*`, `i-twemoji:*`.
⚠️ 소스 덱의 `i-devicon:*`·`i-ri:*` 는 미설치 — `i-logos:*` / `i-carbon:logo-*` 로 치환할 것.

**per-slide frontmatter 옵션:** `layout: center|default`, `glow: full|left|right|center|bottom|top|top-left|top-right|bottom-left|bottom-right`, `glowSeed: <숫자>`, `clicks: <개수>`, `class: text-center|px-24|py-10`.

---

## 1. signature-cards — 3칼럼 프로스트 카드 (시그니처)
> 도전과제·기능 묶음을 카드 3개로. 가장 많이 쓰는 기본형. `layout: default`.

```html
# {{TITLE}}

<span class="opacity-70">{{SUBTITLE}}</span>

<div grid grid-cols-3 gap-3 h-75>
<v-clicks>

<div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
  <div flex items-center bg="white/10" backdrop-blur px-3 py-2 rounded-md>
    <div i-carbon:warning-alt text-amber-300 text-sm mr-2 />
    <div font-semibold>{{CARD_TITLE}}</div>
  </div>
  <div px-4 py-3>
    <div flex flex-col gap-3>
      <div><div text-sm font-medium>{{ITEM}}</div><div text-xs opacity-70>{{ITEM_DESC}}</div></div>
    </div>
  </div>
</div>

<!-- 카드 2, 3 반복 (아이콘/색만 교체: i-carbon:download text-blue-300, i-carbon:data-check text-green-300) -->

</v-clicks>
</div>
```

## 2. compare-2col — 빨강 문제 vs 초록 해결
> 기존 방식 ↔ 우리 접근 2칼럼 대비. `layout: default`.

```html
# {{TITLE}}

<div grid grid-cols-2 gap-6>

<div v-click border="2 solid red-800" bg="red-800/20" rounded-lg overflow-hidden>
  <div bg="red-800/40" px-4 py-2 flex items-center>
    <div i-carbon:warning-alt text-red-300 text-xl mr-2 /><span font-bold>{{LEFT_TITLE}}</span>
  </div>
  <div px-4 py-3 flex flex-col gap-2>
    <div flex items-center gap-2><div i-carbon:close text-red-400 /><span>{{PROBLEM}}</span></div>
  </div>
</div>

<div v-click border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
  <div bg="green-800/40" px-4 py-2 flex items-center>
    <div i-carbon:checkmark-outline text-green-300 text-xl mr-2 /><span font-bold>{{RIGHT_TITLE}}</span>
  </div>
  <div px-4 py-3 flex flex-col gap-2>
    <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>{{SOLUTION}}</span></div>
  </div>
</div>

</div>
```

## 3. hero-cards-row — 가로 카드 좌→우 슬라이드인
> 핵심 특징 4개를 큰 아이콘 카드로 나열. 위험도/단계별 색. `layout: default`.

```html
# {{TITLE}}

<div flex items-center gap-4 h-60>
<v-clicks>

<div rounded-lg border="2 solid yellow-800" bg="yellow-800/20" backdrop-blur flex-1 h-full transition duration-500 ease-in-out>
  <div px-2 py-8 flex items-center justify-center><div i-carbon:{{ICON}} text-yellow-300 h-16 w-16 /></div>
  <div bg="yellow-800/30" w-full px-4 py-2 flex items-center justify-center text-center><span>{{LABEL}}</span></div>
</div>

<!-- 카드 반복: lime-800 / emerald-800 / sky-800 로 색 단계화 -->

</v-clicks>
</div>
```

## 4. centered-statement — 중앙 대형 문장
> 섹션 전환·핵심 한 문장. `layout: center`, `class: text-center`.

```html
<div class="text-cyan-300 font-bold tracking-widest text-sm">{{EYEBROW}}</div>

# {{BIG_LINE_1}}<br><span class="text-cyan-300">{{ACCENT}}</span>

<div v-click class="mt-6 mx-auto max-w-2xl opacity-80">{{SUBTITLE}}</div>
```

## 5. steps-3col — 번호 매긴 프로세스 3단계
> 수집→처리→배포 같은 순차 단계. `layout: default`.

```html
# {{TITLE}}

<div grid grid-cols-3 gap-4>
<v-clicks>

<div border="2 solid indigo-800" bg="indigo-800/20" rounded-lg overflow-hidden>
  <div bg="indigo-800/40" px-4 py-2 flex items-center justify-center>
    <div i-carbon:download text-indigo-300 text-xl mr-2 /><span font-bold>{{N}}: {{STEP_TITLE}}</span>
  </div>
  <div px-3 py-3 flex flex-col gap-1>
    <div text-sm opacity-80>{{DESC}}</div>
    <div flex items-center gap-2><div i-carbon:checkmark text-green-400 /><span text-sm>{{CHECK}}</span></div>
  </div>
</div>

<!-- 반복: purple-800 / pink-800 -->

</v-clicks>
</div>
```

## 6. stat-grid — 큰 지표 카드 (아이콘 + 값 + 화살표 + 디테일)
> 임팩트 수치 요약. 상승=`i-carbon:arrow-up`, 하락=`i-carbon:arrow-down`(개선이면 보통 초록). `layout: default`.

```html
# {{TITLE}}

<div grid grid-cols-3 gap-4 h-75>
<v-clicks>

<div border="2 solid lime-800" bg="lime-800/20" rounded-lg p-5 flex flex-col items-center h-full>
  <div mb-2 flex-1 flex items-center justify-center><div i-carbon:{{ICON}} text-lime-500 text-7xl /></div>
  <div font-bold text-xl>{{METRIC_NAME}}</div>
  <div text-lime-300 text-2xl font-bold mt-2 flex items-center gap-1><span>{{VALUE}}</span><div i-carbon:arrow-down text-green-400 /></div>
  <div text-xs mt-3 bg="lime-900/30" rounded-lg px-3 py-1>{{DETAIL}}</div>
</div>

<!-- 반복: cyan-800 / purple-800 -->

</v-clicks>
</div>
```

## 7. code-callout — 코드 블록 + 우측 떠있는 주석 박스
> CRD/설정 YAML을 보여주며 옆에 핵심 설명. 부모에 `relative`, 콜아웃은 `absolute`. `layout: default`.

```html
# {{TITLE}}

<div class="flex relative mt-4">
  <div class="w-75%">
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1">

    ```yaml
    {{CODE}}
    ```

    </div>
  </div>
  <div v-click class="absolute right-0 top-16">
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 w-52">
      <div text-lg>{{CALLOUT_TITLE}}</div>
      <span class="text-neutral-400 text-xs">{{CALLOUT_SUB}}</span>
      <div mt-3 flex flex-col gap-2 text-sm>
        <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>{{POINT}}</span></div>
      </div>
    </div>
  </div>
</div>
```

## 8. person-cards — 발표자 소개 (아바타 + 이름 + github)
> 팀/스피커 소개. 사진이 있으면 `<img src="/person/{{name}}.png" w-40 h-40 rounded-full object-cover>` 로 교체. `layout: center`.

```html
<div flex items-center justify-center gap-16>
  <div v-click="1" flex flex-col items-center transition duration-500 ease-in-out
       :class="$clicks < 1 ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'">
    <div w-40 h-40 rounded-full bg="white/10" border="2 solid white/15" flex items-center justify-center mb-5>
      <div i-carbon:user-avatar text-7xl opacity-60 />
    </div>
    <span font-semibold text-3xl>{{NAME}}</span>
    <div text-center>
      <div><span class="opacity-70">{{ROLE}}</span></div>
      <div text-sm flex items-center justify-center gap-2 mt-3>
        <div i-carbon:logo-github /><span underline decoration-dashed font-mono decoration-zinc-300>{{HANDLE}}</span>
      </div>
    </div>
  </div>
  <!-- 인물 2: v-click="2", $clicks < 2 -->
</div>
```

## 9. logo-hero — 중앙 주인공 로고 + 주변 시차 등장
> 기술 스택/제품 소개. 절대 위치로 흩뿌림. `layout: center`.

```html
<div class="flex justify-center">
  <div class="relative w-120 h-60">
    <div v-click class="absolute inset-0 flex items-center justify-center"><div class="text-[150px] i-logos:{{MAIN}}" /></div>
    <div v-click class="absolute top-16 left-0"><div class="text-7xl i-logos:{{A}}" /></div>
    <div v-click class="absolute top-20 right-2"><div class="text-6xl i-logos:{{B}}" /></div>
    <div v-click class="absolute bottom-2 left-24"><div class="text-6xl i-logos:{{C}}" /></div>
  </div>
</div>
```

## 10. vs-overlay — A × B 인트로 (동시 등장)
> "X meets Y" 도입. 가운데 `i-carbon:close`, 양옆 `v-after` 로 동시 슬라이드인. `layout: center`.

```html
<div flex items-center justify-center>
  <div v-click flex flex-col gap-2 items-center justify-center transition duration-500 ease-in-out
       :class="$clicks < 1 ? 'translate-x--20 opacity-0' : 'translate-x-0 opacity-100'">
    <div flex items-center gap-3><div i-logos:{{A}} text-8xl /><span text-4xl>{{A_NAME}}</span></div>
  </div>
  <div v-after pl-12 pr-12 transition duration-500 ease-in-out :class="$clicks < 1 ? 'scale-80' : 'scale-100'">
    <div i-carbon:close text-8xl opacity-70 />
  </div>
  <div v-after flex flex-col gap-2 items-center justify-center transition duration-500 ease-in-out
       :class="$clicks < 1 ? 'translate-x-20 opacity-0' : 'translate-x-0 opacity-100'">
    <div flex items-center gap-3><div i-logos:{{B}} text-7xl /><span text-4xl>{{B_NAME}}</span></div>
  </div>
</div>
```

## 11. arrow-flow — 문제 → 화살표 → 해결
> 흐름/전환을 한 줄로. 가운데 `animate-pulse` 화살표. `layout: center`.

```html
<div flex items-center justify-center gap-8>
  <div v-click="1">
    <div border="2 solid red-800" bg="red-800/20" rounded-lg p-6 w-80>
      <div flex items-center mb-4><div i-carbon:warning-alt text-red-300 text-2xl mr-2 /><span font-bold text-xl>{{PROBLEM_TITLE}}</span></div>
      <div flex flex-col gap-2 text-sm opacity-90><div>· {{PROBLEM_ITEM}}</div></div>
    </div>
  </div>
  <div v-click="2" flex items-center><div i-carbon:arrow-right text-4xl text-green-400 animate-pulse /></div>
  <div v-click="3">
    <div border="2 solid green-800" bg="green-800/20" rounded-lg p-6 w-80>
      <div flex items-center mb-4><div i-carbon:checkmark-outline text-green-300 text-2xl mr-2 /><span font-bold text-xl>{{SOLUTION_TITLE}}</span></div>
      <div flex flex-col gap-2 text-sm><div>· {{SOLUTION_ITEM}}</div></div>
    </div>
  </div>
</div>
```

## 12. bar-chart — 비교 막대 (승자에 pulse)
> 시간·크기 극적 비교. 막대 높이 `h="75%"` / `h-10` 로 대비, 승자에 `animate-pulse`. `layout: default`.

```html
# {{TITLE}}

<div mt-4 relative h-90 w-full>
  <div border="2 solid neutral-700" bg="neutral-800/50" rounded-t-lg px-3 py-2>
    <div flex items-center justify-between>
      <div flex items-center gap-2><div i-carbon:chart-column text-xl text-sky-300 /><div font-bold text-sm>{{CHART_TITLE}}</div></div>
      <div text-sm text-zinc-400>{{HINT}}</div>
    </div>
  </div>
  <div border-x="2 solid neutral-700" border-b="2 solid neutral-700" bg="neutral-900/50" rounded-b-lg px-3 pb-3 h-75 pt-6>
    <div flex items-end justify-center gap-20 h-full>
      <div flex flex-col items-center justify-end h-full>
        <div h="75%" w-28 bg="red-800/40" rounded-t-lg flex items-center justify-center relative>
          <span text-2xl font-bold text-red-300>{{BIG_VALUE}}</span>
          <div absolute top="-9" w-full flex justify-center><div bg="red-900/60" border="2 solid red-700" rounded-full px-2 py-1 text-xs w-fit text-nowrap>{{BADGE}}</div></div>
        </div>
        <div py-2 font-semibold>{{LEFT_LABEL}}</div>
      </div>
      <div flex flex-col items-center justify-end h-full>
        <div h-10 w-28 bg="green-800/40" rounded-t-lg flex items-center justify-center relative animate-pulse>
          <span text-2xl font-bold text-green-300>{{SMALL_VALUE}}</span>
        </div>
        <div py-2 font-semibold>{{RIGHT_LABEL}}</div>
      </div>
    </div>
  </div>
</div>
```

---

## 라이선스
레이아웃 구조 출처: **BaizeAI/talks** (Apache-2.0). 엔진(`global-bottom.vue`/`style.css`/`uno.config.ts`)은 `../sources/ASSET_LICENSES.md` 참조. 글로우 폴리곤 크레딧: @pi0, @Atinux.
