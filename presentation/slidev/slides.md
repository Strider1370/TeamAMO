---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: "첫걸음 — 누구나 맞이하는 처음을 위한 정책 가이드 플랫폼"
lang: ko
lineNumbers: false
mdc: true
clicks: 0
glowSeed: 284
glow: full
slideId: "slide-01"
semanticLayout: "hero"
durationSeconds: 30
impl: "implemented"
---
<div class="absolute top-5 right-5 text-center z-10">
  <img src="https://projectamo.co.kr/firststep-qr.png" class="w-28 h-28 rounded bg-white p-1" />
  <div class="text-sm mt-1 opacity-80">APK 설치</div>
</div>

<div class="flex flex-col items-center justify-center text-center">

<div class="text-cyan-300 tracking-widest text-sm font-semibold uppercase opacity-90">공공 정책 · 공개데이터 + AI</div>

<h1 class="text-[1.5em]">첫걸음</h1>

<div class="mt-4 max-w-3xl opacity-80 text-xl">누구나 맞이하는 처음을 위한<br/>당신에게 드리는 정책 가이드 플랫폼</div>
</div>

<!--
처음 맞이하는 상황 — 부모님이 갑자기 아프거나, 치매 진단을 받거나. 누구에게나 이런 '처음'이 옵니다. 그 막막함을 '오늘 할 일'로 바꾸는 정책 가이드 플랫폼, 첫걸음입니다.
-->

---
class: px-14 py-10
title: "문제점"
glowSeed: 285
glow: left
slideId: "slide-02"
semanticLayout: "problem-flow"
durationSeconds: 40
impl: "implemented"
---

<h1>문제점</h1>

<div mt-8>
  <div border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-amber-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>세 가지 장벽</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>매칭 부재</div><div text-base opacity-80>정책을 안내해주는 서비스는 많지만, 내 상황에 맞게 매칭해주는 서비스는 적다</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>첫걸음을 모름</div><div text-base opacity-80>처음 맞이하는 상황에 어떻게 시작해야 할지 모르는 경우가 대부분</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>몰라서 못 받음</div><div text-base opacity-80>정책은 많지만 몰라서 신청하지 못하는 경우가 많다</div></div>
      </div>
    </div>
  </div>
</div>

<!--
세 가지 문제가 겹칩니다. 매칭 서비스 부재, 어디서 시작해야 할지 모름, 그리고 정책 자체를 몰라서 못 받는 것. 이 세 장벽이 동시에 작용합니다.
-->

---
class: px-14 py-10
title: "모순"
glowSeed: 286
glow: right
slideId: "slide-03"
semanticLayout: "contrast"
durationSeconds: 40
impl: "implemented"
---

<h1>모순</h1>

<div text-xl opacity-70 mt-1>안내 사이트는 충분한데, 정책 접근성은 여전히 낮다</div>

<div mt-8 grid grid-cols-2 gap-6 items-stretch>
  <div border="2 solid sky-800" bg="sky-800/20" rounded-lg overflow-hidden>
    <div bg="sky-800/40" px-5 py-3 flex items-center>
      <div i-carbon:search text-sky-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>현실</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-sky-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정부24 · 복지로</div><div text-base opacity-80>정책 안내 사이트는 이미 많다</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-sky-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>인터넷 검색</div><div text-base opacity-80>치매 등 처음 맞이하는 상황에 검색해보지만 자료가 너무 많음</div></div>
      </div>
    </div>
  </div>
  <div border="2 solid red-800" bg="red-800/20" rounded-lg overflow-hidden>
    <div bg="red-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-red-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>문제</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>여전히 낮은 접근성</div><div text-base opacity-80>사이트가 많아도 내 상황에 맞는 안내는 없다</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정보 과잉 → 막막함</div><div text-base opacity-80>너무 많은 정보에 오히려 막막함을 느끼는 경우가 많다</div></div>
      </div>
    </div>
  </div>
</div>

<!--
안내 사이트가 없는 게 아닙니다. 오히려 너무 많아서 문제입니다. 치매 진단을 받으면 검색부터 하지만, 쏟아지는 정보에 오히려 첫걸음을 못 떼게 됩니다.
-->

---
class: px-14 py-10
title: "해결"
glowSeed: 287
glow: center
slideId: "slide-04"
semanticLayout: "solution-flow"
durationSeconds: 40
impl: "implemented"
---

<h1>해결</h1>

<div mt-8>
  <div border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-5 py-3 flex items-center>
      <div i-carbon:idea text-green-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>세 가지 해답</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>첫걸음 가이드 제공</div><div text-base opacity-80>한번 해보면 쉽지만 처음인 사람을 위해, 순서가 있는 첫걸음을 제공</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>분야를 좁혀 매칭</div><div text-base opacity-80>막막함을 느낄 수 있는 상황으로 분야를 좁혀 정확한 매칭 서비스 제공</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>LLM으로 상황 정의</div><div text-base opacity-80>막연한 상황도 LLM이 분명하게 정의한 후 솔루션 제공</div></div>
      </div>
    </div>
  </div>
</div>

<!--
세 문제에 세 해결입니다. 순서를 주고, 분야를 좁히고, LLM으로 막연한 상황도 구체화합니다. 검색이 아니라 내비게이터입니다.
-->

---
class: px-14 py-10
title: "시연"
glowSeed: 288
glow: bottom
slideId: "slide-05"
semanticLayout: "demo-fullscreen"
durationSeconds: 60
impl: "implemented"
---

<h1>시연</h1>

<div text-lg opacity-70 mt-1>자연어 입력 → LLM 분석·분류 → 매칭 정책 자동정렬 → 정책 안내</div>

<div mt-6 grid grid-cols-4 gap-3>
  <div border="2 solid blue-800" bg="blue-800/20" rounded-lg overflow-hidden>
    <div bg="blue-800/40" px-4 py-2 flex items-center justify-center>
      <div i-carbon:edit text-blue-300 text-xl mr-2 shrink-0 />
      <span font-bold>자연어 입력</span>
    </div>
    <div px-4 py-3>
      <div text-sm opacity-80>"아버지가 뇌졸중으로 퇴원하는데 어머니 혼자 못 모시겠어요"</div>
    </div>
  </div>
  <div border="2 solid purple-800" bg="purple-800/20" rounded-lg overflow-hidden>
    <div bg="purple-800/40" px-4 py-2 flex items-center justify-center>
      <div i-carbon:ai-status text-purple-300 text-xl mr-2 shrink-0 />
      <span font-bold>LLM 분석</span>
    </div>
    <div px-4 py-3>
      <div text-sm opacity-80>AI가 상황 신호 추출 — 뇌졸중·거동 도움·독거·돌봄공백</div>
    </div>
  </div>
  <div border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-4 py-2 flex items-center justify-center>
      <div i-carbon:code text-amber-300 text-xl mr-2 shrink-0 />
      <span font-bold>코드 매칭</span>
    </div>
    <div px-4 py-3>
      <div text-sm opacity-80>규칙으로 적합 제도 자동정렬 (AI가 판정하지 않음)</div>
    </div>
  </div>
  <div border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-4 py-2 flex items-center justify-center>
      <div i-carbon:list-checked text-green-300 text-xl mr-2 shrink-0 />
      <span font-bold>정책 안내</span>
    </div>
    <div px-4 py-3>
      <div text-sm opacity-80>오늘 할 일·공식 링크·전화번호까지 한 화면에</div>
    </div>
  </div>
</div>

<div mt-6 flex justify-center>
  <img src="/captures/demo.png" class="rounded-xl object-contain max-h-[42vh] max-w-full" />
</div>

<!--
실제 앱입니다. 두서없는 한 문단을 그대로 적으면 — AI가 상황을 이해하고, 코드가 정책을 매칭하고, 오늘 할 일 순서로 보여줍니다.
-->

---
class: px-14 py-10
title: "한계 & 보완"
glowSeed: 289
glow: top
slideId: "slide-06"
semanticLayout: "limitation-guardrail"
durationSeconds: 40
impl: "implemented"
---

<h1>한계 & 보완</h1>

<div mt-8 grid grid-cols-2 gap-6 items-stretch>
  <div border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-amber-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>한계</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정책 커버리지 제한</div><div text-base opacity-80>매칭 완성도를 위해 모든 정책을 커버하지 못함</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>LLM 비용 발생</div><div text-base opacity-80>자연어 분석에 AI 모델 활용 → 토큰 사용료 발생</div></div>
      </div>
    </div>
  </div>
  <div border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-5 py-3 flex items-center>
      <div i-carbon:idea text-green-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>보완</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>단계적 분야 확장</div><div text-base opacity-80>엔진은 그대로, 데이터만 교체하는 구조로 분야를 순차 확장</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>LLM 호출 최소화</div><div text-base opacity-80>판정 핵심은 코드가 담당, 반복 패턴은 키워드 폴백·캐싱으로 비용 절감</div></div>
      </div>
    </div>
  </div>
</div>

<!--
솔직하게 말씀드립니다. 모든 정책은 아직 못 담았고, LLM 비용도 발생합니다. 하지만 엔진 구조상 데이터 교체만으로 분야를 넓힐 수 있고, 코드 기반 판정으로 LLM 호출을 최소화해 비용을 줄여갈 수 있습니다.
-->
