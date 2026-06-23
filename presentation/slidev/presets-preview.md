---
# 프리셋 미리보기 덱 — BaizeAI/talks(Apache-2.0) 레이아웃 12종 재현.
# 빌드: pnpm exec slidev build presets-preview.md --out dist-presets
# 각 슬라이드 = 프리셋 1종(샘플 내용). 실제 사용은 presets/GALLERY.md 의 스니펫 복사.
theme: none
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: 레이아웃 프리셋 갤러리
lang: ko
lineNumbers: false
mdc: true
clicks: 0
glowSeed: 12
glow: full
---

<div class="text-center">
<div class="text-cyan-300 tracking-widest text-sm font-semibold uppercase opacity-90">Layout Presets</div>

# 레이아웃 프리셋 갤러리

<div class="mt-4 opacity-70">BaizeAI/talks 카드 언어 · 12종 · 복사해서 채워 쓰기</div>
</div>

---
layout: default
title: 1. signature-cards
glow: left
glowSeed: 31
clicks: 3
---

# 1. signature-cards

<span class="opacity-70">시그니처 — 3칼럼 프로스트 카드 + 아이콘 헤더 바 + v-click 스태거</span>

<div mt-6 />

<div grid grid-cols-3 gap-3 h-75>
<v-clicks>

<div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
  <div flex items-center bg="white/10" backdrop-blur px-3 py-2 rounded-md>
    <div i-carbon:warning-alt text-amber-300 text-sm mr-2 />
    <div font-semibold>카드 제목 A</div>
  </div>
  <div px-4 py-3>
    <div flex flex-col gap-3>
      <div><div text-sm font-medium>항목 하나</div><div text-xs opacity-70>한 줄 설명이 들어갑니다</div></div>
      <div><div text-sm font-medium>항목 둘</div><div text-xs opacity-70>한 줄 설명이 들어갑니다</div></div>
    </div>
  </div>
</div>

<div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
  <div flex items-center bg="white/10" backdrop-blur px-3 py-2 rounded-md>
    <div i-carbon:download text-blue-300 text-sm mr-2 />
    <div font-semibold>카드 제목 B</div>
  </div>
  <div px-4 py-3>
    <div flex flex-col gap-3>
      <div><div text-sm font-medium>항목 하나</div><div text-xs opacity-70>한 줄 설명이 들어갑니다</div></div>
      <div><div text-sm font-medium>항목 둘</div><div text-xs opacity-70>한 줄 설명이 들어갑니다</div></div>
    </div>
  </div>
</div>

<div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
  <div flex items-center bg="white/10" backdrop-blur px-3 py-2 rounded-md>
    <div i-carbon:data-check text-green-300 text-sm mr-2 />
    <div font-semibold>카드 제목 C</div>
  </div>
  <div px-4 py-3>
    <div flex flex-col gap-3>
      <div><div text-sm font-medium>항목 하나</div><div text-xs opacity-70>한 줄 설명이 들어갑니다</div></div>
      <div><div text-sm font-medium>항목 둘</div><div text-xs opacity-70>한 줄 설명이 들어갑니다</div></div>
    </div>
  </div>
</div>

</v-clicks>
</div>

---
layout: default
title: 2. compare-2col
glow: right
glowSeed: 71
clicks: 2
---

# 2. compare-2col

<span class="opacity-70">빨강 문제 vs 초록 해결 — 2칼럼 비교</span>

<div mt-6 />

<div grid grid-cols-2 gap-6>

<div v-click border="2 solid red-800" bg="red-800/20" rounded-lg overflow-hidden>
  <div bg="red-800/40" px-4 py-2 flex items-center>
    <div i-carbon:warning-alt text-red-300 text-xl mr-2 />
    <span font-bold>기존 방식</span>
  </div>
  <div px-4 py-3 flex flex-col gap-2>
    <div flex items-center gap-2><div i-carbon:close text-red-400 /><span>문제점 하나</span></div>
    <div flex items-center gap-2><div i-carbon:close text-red-400 /><span>문제점 둘</span></div>
    <div flex items-center gap-2><div i-carbon:close text-red-400 /><span>문제점 셋</span></div>
  </div>
</div>

<div v-click border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
  <div bg="green-800/40" px-4 py-2 flex items-center>
    <div i-carbon:checkmark-outline text-green-300 text-xl mr-2 />
    <span font-bold>우리 접근</span>
  </div>
  <div px-4 py-3 flex flex-col gap-2>
    <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>개선점 하나</span></div>
    <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>개선점 둘</span></div>
    <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>개선점 셋</span></div>
  </div>
</div>

</div>

---
layout: default
title: 3. hero-cards-row
glow: bottom
glowSeed: 142
clicks: 4
---

# 3. hero-cards-row

<span class="opacity-70">가로 카드들 좌→우 슬라이드인 (큰 아이콘)</span>

<div mt-8 />

<div flex items-center gap-4 h-60>
<v-clicks>

<div rounded-lg border="2 solid yellow-800" bg="yellow-800/20" backdrop-blur flex-1 h-full transition duration-500 ease-in-out>
  <div px-2 py-8 flex items-center justify-center><div i-carbon:rocket text-yellow-300 h-16 w-16 /></div>
  <div bg="yellow-800/30" w-full px-4 py-2 flex items-center justify-center text-center><span>특징 하나</span></div>
</div>

<div rounded-lg border="2 solid lime-800" bg="lime-800/20" backdrop-blur flex-1 h-full transition duration-500 ease-in-out>
  <div px-2 py-8 flex items-center justify-center><div i-carbon:flash text-lime-300 h-16 w-16 /></div>
  <div bg="lime-800/30" w-full px-4 py-2 flex items-center justify-center text-center><span>특징 둘</span></div>
</div>

<div rounded-lg border="2 solid emerald-800" bg="emerald-800/20" backdrop-blur flex-1 h-full transition duration-500 ease-in-out>
  <div px-2 py-8 flex items-center justify-center><div i-carbon:idea text-emerald-300 h-16 w-16 /></div>
  <div bg="emerald-800/30" w-full px-4 py-2 flex items-center justify-center text-center><span>특징 셋</span></div>
</div>

<div rounded-lg border="2 solid sky-800" bg="sky-800/20" backdrop-blur flex-1 h-full transition duration-500 ease-in-out>
  <div px-2 py-8 flex items-center justify-center><div i-carbon:chart-line text-sky-300 h-16 w-16 /></div>
  <div bg="sky-800/30" w-full px-4 py-2 flex items-center justify-center text-center><span>특징 넷</span></div>
</div>

</v-clicks>
</div>

---
layout: center
class: text-center
title: 4. centered-statement
glow: center
glowSeed: 205
---

<div class="text-cyan-300 font-bold tracking-widest text-sm">STATEMENT</div>

# 한 문장으로<br><span class="text-cyan-300">핵심 메시지</span>를 박는다

<div v-click class="mt-6 mx-auto max-w-2xl opacity-80">
부연 설명 한 줄. 중앙 정렬 대형 타이포로 시선을 잡는 프리셋.
</div>

---
layout: default
title: 5. steps-3col
glow: top-left
glowSeed: 17
clicks: 3
---

# 5. steps-3col

<span class="opacity-70">번호 매긴 프로세스 3단계 카드</span>

<div mt-6 />

<div grid grid-cols-3 gap-4>
<v-clicks>

<div border="2 solid indigo-800" bg="indigo-800/20" rounded-lg overflow-hidden>
  <div bg="indigo-800/40" px-4 py-2 flex items-center justify-center>
    <div i-carbon:download text-indigo-300 text-xl mr-2 />
    <span font-bold>1: 수집</span>
  </div>
  <div px-3 py-3 flex flex-col gap-1>
    <div text-sm opacity-80>단계 설명이 들어갑니다</div>
    <div flex items-center gap-2><div i-carbon:checkmark text-green-400 /><span text-sm>체크 항목</span></div>
  </div>
</div>

<div border="2 solid purple-800" bg="purple-800/20" rounded-lg overflow-hidden>
  <div bg="purple-800/40" px-4 py-2 flex items-center justify-center>
    <div i-carbon:tools text-purple-300 text-xl mr-2 />
    <span font-bold>2: 처리</span>
  </div>
  <div px-3 py-3 flex flex-col gap-1>
    <div text-sm opacity-80>단계 설명이 들어갑니다</div>
    <div flex items-center gap-2><div i-carbon:checkmark text-green-400 /><span text-sm>체크 항목</span></div>
  </div>
</div>

<div border="2 solid pink-800" bg="pink-800/20" rounded-lg overflow-hidden>
  <div bg="pink-800/40" px-4 py-2 flex items-center justify-center>
    <div i-carbon:rocket text-pink-300 text-xl mr-2 />
    <span font-bold>3: 배포</span>
  </div>
  <div px-3 py-3 flex flex-col gap-1>
    <div text-sm opacity-80>단계 설명이 들어갑니다</div>
    <div flex items-center gap-2><div i-carbon:checkmark text-green-400 /><span text-sm>체크 항목</span></div>
  </div>
</div>

</v-clicks>
</div>

---
layout: default
title: 6. stat-grid
glow: top-right
glowSeed: 229
clicks: 3
---

# 6. stat-grid

<span class="opacity-70">큰 지표 카드 — 대형 아이콘 + 값 + 화살표 + 디테일</span>

<div mt-6 />

<div grid grid-cols-3 gap-4 h-75>
<v-clicks>

<div border="2 solid lime-800" bg="lime-800/20" rounded-lg p-5 flex flex-col items-center h-full>
  <div mb-2 flex-1 flex items-center justify-center><div i-carbon:flash text-lime-500 text-7xl /></div>
  <div font-bold text-xl>준비 시간</div>
  <div text-lime-300 text-2xl font-bold mt-2 flex items-center gap-1><span>8분 → 5초</span><div i-carbon:arrow-down text-green-400 /></div>
  <div text-xs mt-3 bg="lime-900/30" rounded-lg px-3 py-1>내부 측정</div>
</div>

<div border="2 solid cyan-800" bg="cyan-800/20" rounded-lg p-5 flex flex-col items-center h-full>
  <div mb-2 flex-1 flex items-center justify-center><div i-carbon:save text-cyan-500 text-7xl /></div>
  <div font-bold text-xl>저장 절감</div>
  <div text-cyan-300 text-2xl font-bold mt-2 flex items-center gap-1><span>-70%</span><div i-carbon:arrow-down text-green-400 /></div>
  <div text-xs mt-3 bg="cyan-900/30" rounded-lg px-3 py-1>중복 제거</div>
</div>

<div border="2 solid purple-800" bg="purple-800/20" rounded-lg p-5 flex flex-col items-center h-full>
  <div mb-2 flex-1 flex items-center justify-center><div i-carbon:badge text-purple-500 text-7xl /></div>
  <div font-bold text-xl>만족도</div>
  <div text-purple-300 text-2xl font-bold mt-2 flex items-center gap-1><span>+42%</span><div i-carbon:arrow-up text-green-400 /></div>
  <div text-xs mt-3 bg="purple-900/30" rounded-lg px-3 py-1>설문 n=120</div>
</div>

</v-clicks>
</div>

---
layout: default
title: 7. code-callout
glow: right
glowSeed: 88
clicks: 1
---

# 7. code-callout

<span class="opacity-70">코드 블록 + 우측에 떠있는 주석 박스</span>

<div class="flex relative mt-4">
  <div class="w-75%">
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1">

```yaml
apiVersion: example.io/v1
kind: Guide
metadata:
  name: my-region
spec:
  region: 관악구
  family: [성인2, 유아1]
```

</div>
  </div>
  <div v-click class="absolute right-0 top-16">
    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 w-52">
      <div text-lg>동작 방식</div>
      <span class="text-neutral-400 text-xs">핵심 필드 설명</span>
      <div mt-3 flex flex-col gap-2 text-sm>
        <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>region 자동 매칭</span></div>
        <div flex items-center gap-2><div i-carbon:checkmark-outline text-green-400 /><span>family 맞춤 재구성</span></div>
      </div>
    </div>
  </div>
</div>

---
layout: center
title: 8. person-cards
glow: bottom
glowSeed: 205
clicks: 3
---

<div flex items-center justify-center gap-16>
  <div v-click="1" flex flex-col items-center transition duration-500 ease-in-out :class="$clicks < 1 ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'">
    <div w-40 h-40 rounded-full bg="white/10" border="2 solid white/15" flex items-center justify-center mb-5><div i-carbon:user-avatar text-7xl opacity-60 /></div>
    <span font-semibold text-3xl>홍길동</span>
    <div text-center>
      <div><span class="opacity-70">팀 리드 · 백엔드</span></div>
      <div text-sm flex items-center justify-center gap-2 mt-3><div i-carbon:logo-github /><span underline decoration-dashed font-mono decoration-zinc-300>gildong</span></div>
    </div>
  </div>

  <div v-click="2" flex flex-col items-center transition duration-500 ease-in-out :class="$clicks < 2 ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'">
    <div w-40 h-40 rounded-full bg="white/10" border="2 solid white/15" flex items-center justify-center mb-5><div i-carbon:user-avatar text-7xl opacity-60 /></div>
    <span font-semibold text-3xl>김영희</span>
    <div text-center>
      <div><span class="opacity-70">프론트엔드 · 디자인</span></div>
      <div text-sm flex items-center justify-center gap-2 mt-3><div i-carbon:logo-github /><span underline decoration-dashed font-mono decoration-zinc-300>younghee</span></div>
    </div>
  </div>
</div>

---
layout: center
title: 9. logo-hero
glow: center
glowSeed: 333
clicks: 4
---

<div class="flex justify-center">
  <div class="relative w-120 h-60">
    <div v-click class="absolute inset-0 flex items-center justify-center"><div class="text-[150px] i-logos:kubernetes" /></div>
    <div v-click class="absolute top-16 left-0"><div class="text-7xl i-logos:python" /></div>
    <div v-click class="absolute top-20 right-2"><div class="text-6xl i-logos:docker-icon" /></div>
    <div v-click class="absolute bottom-2 left-24"><div class="text-6xl i-logos:react" /></div>
  </div>
</div>

<div class="text-center mt-4 opacity-70">중앙 주인공 로고 + 주변 로고 시차 등장</div>

---
layout: center
title: 10. vs-overlay
glow: full
glowSeed: 142
clicks: 1
---

<div flex items-center justify-center>
  <div v-click flex flex-col gap-2 items-center justify-center transition duration-500 ease-in-out :class="$clicks < 1 ? 'translate-x--20 opacity-0' : 'translate-x-0 opacity-100'">
    <div flex items-center gap-3><div i-logos:python text-8xl /><span text-4xl>Python</span></div>
  </div>
  <div v-after pl-12 pr-12 transition duration-500 ease-in-out :class="$clicks < 1 ? 'scale-80' : 'scale-100'">
    <div i-carbon:close text-8xl opacity-70 />
  </div>
  <div v-after flex flex-col gap-2 items-center justify-center transition duration-500 ease-in-out :class="$clicks < 1 ? 'translate-x-20 opacity-0' : 'translate-x-0 opacity-100'">
    <div flex items-center gap-3><div i-logos:kubernetes text-7xl /><span text-4xl text="[#5791f7]">Kubernetes</span></div>
  </div>
</div>

<div class="text-center mt-10 opacity-70">A × B 인트로 (v-after 동시 등장)</div>

---
layout: center
title: 11. arrow-flow
glow: right
glowSeed: 71
clicks: 3
---

<div flex items-center justify-center gap-8>
  <div v-click="1">
    <div border="2 solid red-800" bg="red-800/20" rounded-lg p-6 w-80>
      <div flex items-center mb-4><div i-carbon:warning-alt text-red-300 text-2xl mr-2 /><span font-bold text-xl>문제 상황</span></div>
      <div flex flex-col gap-2 text-sm opacity-90>
        <div>· 흩어진 정보</div>
        <div>· 제각각 출처</div>
      </div>
    </div>
  </div>
  <div v-click="2" flex items-center><div i-carbon:arrow-right text-4xl text-green-400 animate-pulse /></div>
  <div v-click="3">
    <div border="2 solid green-800" bg="green-800/20" rounded-lg p-6 w-80>
      <div flex items-center mb-4><div i-carbon:checkmark-outline text-green-300 text-2xl mr-2 /><span font-bold text-xl>해결 상태</span></div>
      <div flex flex-col gap-2 text-sm>
        <div>· 한 화면 통합</div>
        <div>· 맞춤 재구성</div>
      </div>
    </div>
  </div>
</div>

---
layout: default
title: 12. bar-chart
glow: bottom
glowSeed: 17
clicks: 0
---

# 12. bar-chart

<span class="opacity-70">비교 막대 — 승자에 pulse (작을수록 좋음)</span>

<div mt-4 relative h-90 w-full>
  <div border="2 solid neutral-700" bg="neutral-800/50" rounded-t-lg px-3 py-2>
    <div flex items-center justify-between>
      <div flex items-center gap-2><div i-carbon:chart-column text-xl text-sky-300 /><div font-bold text-sm>처리 시간 비교</div></div>
      <div text-sm text-zinc-400>작을수록 좋음</div>
    </div>
  </div>
  <div border-x="2 solid neutral-700" border-b="2 solid neutral-700" bg="neutral-900/50" rounded-b-lg px-3 pb-3 h-75 pt-6>
    <div flex items-end justify-center gap-20 h-full>
      <div flex flex-col items-center justify-end h-full>
        <div h="75%" w-28 bg="red-800/40" rounded-t-lg flex items-center justify-center relative>
          <span text-2xl font-bold text-red-300>8분</span>
          <div absolute top="-9" w-full flex justify-center><div bg="red-900/60" border="2 solid red-700" rounded-full px-2 py-1 text-xs w-fit text-nowrap>~100× 느림</div></div>
        </div>
        <div py-2 font-semibold>기존</div>
      </div>
      <div flex flex-col items-center justify-end h-full>
        <div h-10 w-28 bg="green-800/40" rounded-t-lg flex items-center justify-center relative animate-pulse>
          <span text-2xl font-bold text-green-300>5초</span>
        </div>
        <div py-2 font-semibold>개선</div>
      </div>
    </div>
  </div>
</div>
