---
# Engine ported from BaizeAI/talks (Apache-2.0) — glow background + fade transitions + v-click reveals.
# See presentation/sources/ASSET_LICENSES.md
# theme 키 생략 = Slidev 기본 테마 (BaizeAI 와 동일 — heading 크기/레이아웃을 기본 테마가 제공).
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: "곁에 — 가족 복지·돌봄 내비게이터"
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
<div class="flex flex-col items-center justify-center text-center">

<div class="text-cyan-300 tracking-widest text-sm font-semibold uppercase opacity-90">공공 복지·돌봄 · 공개데이터 + AI</div>

<h1>부모님이 갑자기 아프면, 누구나 처음입니다</h1>

<div class="mt-4 max-w-3xl opacity-80 text-xl">상황을 한 문장으로 말하면, 받을 가능성 있는 지원을 ‘오늘 할 일’ 순서로</div>
</div>

<div class="mt-8"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-base opacity-80">보조금24·복지로 등 공개데이터, 손으로 검증한 79개 제도 (2026 확인)</div></div>

<!--
어느 날 갑자기 부모님이 쓰러지면 자녀는 누구나 처음입니다. 받을 도움은 분명 있는데 무엇부터 할지 막막한 그 밤 — 그 막막함을 ‘오늘 할 일’로 바꿉니다.
-->

---
class: px-14 py-10
title: "정보는 공개돼 있는데, 왜 못 받을까"
glowSeed: 285
glow: left
slideId: "slide-02"
semanticLayout: "problem-flow"
durationSeconds: 40
impl: "implemented"
---

<h1>정보는 공개돼 있는데, 왜 못 받을까</h1>

<div mt-8>
  <div border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-amber-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>문제</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>인지</div><div text-base opacity-80>받을 수 있는 게 있는지조차 모른다</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>번역</div><div text-base opacity-80>‘치매’는 알아도 ‘장기요양인정신청’은 모른다</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>실행</div><div text-base opacity-80>기관이 흩어져 무엇부터 할지 순서를 모른다</div></div>
      </div>
    </div>
  </div>
</div>

<!--
정보는 이미 복지로·정부24에 다 있습니다. 그런데도 못 받습니다. 막힘은 인지·번역·실행의 3중 장벽입니다.
-->

---
class: px-14 py-10
title: "검색이 아니라, 내비게이터"
glowSeed: 286
glow: right
slideId: "slide-03"
semanticLayout: "contrast"
durationSeconds: 45
impl: "implemented"
---

<h1>검색이 아니라, 내비게이터</h1>

<div text-xl opacity-70 mt-1>문제는 정보 부족이 아니라 ‘첫걸음’의 부재</div>

<div mt-8 grid grid-cols-2 gap-6 items-start>
  <div border="2 solid red-800" bg="red-800/20" rounded-lg overflow-hidden>
    <div bg="red-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-red-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>복지로 · 정부24</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>아는 사람용</div><div text-base opacity-80>제도 이름·소득인정액을 안다는 전제</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>목록에서 끝</div><div text-base opacity-80>받을 수 있는 것을 보여주고 멈춘다</div></div>
      </div>
    </div>
  </div>
  <div border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-5 py-3 flex items-center>
      <div i-carbon:idea text-green-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>곁에</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>처음인 사람용</div><div text-base opacity-80>‘엄마가 쓰러졌어요’만 아는 자녀</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>순서를 준다</div><div text-base opacity-80>오늘 무엇부터 할지 행동계획으로</div></div>
      </div>
    </div>
  </div>
</div>

<!--
복지로는 제도 언어를 아는 사람용입니다. 우리는 ‘엄마가 쓰러졌어요’밖에 말 못 하는 자녀용입니다. 검색 엔진이 아니라 내비게이터예요.
-->

---
class: px-14 py-10
title: "한 문장을 넣어봅니다"
glowSeed: 287
glow: center
slideId: "slide-04"
semanticLayout: "demo-fullscreen"
durationSeconds: 30
impl: "implemented"
---

<h1>한 문장을 넣어봅니다</h1>

<div mt-4>

<div border="2 solid white/10" bg="white/5" backdrop-blur-sm rounded-xl grid place-items-center text-center class="h-[55vh]" data-asset-status="placeholder">
  <div><div i-carbon:image text-6xl opacity-40 mx-auto /><div opacity-60 mt-2>데모 화면</div><div text-xs opacity-40 mt-2 break-all>/captures/shot-01-input.png</div></div>
</div>

</div>

<div opacity-60 mt-3>“아버지가 뇌졸중으로 곧 퇴원하시는데 반신마비가 왔어요. 어머니 혼자 못 모시고 형편도 빠듯해요.”</div>

<!--
실제 앱입니다. 두서없는 한 문단을 그대로 적습니다. 폼도, 제도 이름도 필요 없습니다.
-->

---
class: px-14 py-10
title: "AI가 ‘읽은 것’을 먼저 보여줍니다"
glowSeed: 288
glow: bottom
slideId: "slide-05"
semanticLayout: "demo-callout"
durationSeconds: 40
impl: "implemented"
---

<h1>AI가 ‘읽은 것’을 먼저 보여줍니다</h1>

<div mt-6 grid grid-cols-2 gap-8 items-center>

<div>

<div border="2 solid white/10" bg="white/5" backdrop-blur-sm rounded-xl grid place-items-center text-center class="h-[55vh]" data-asset-status="placeholder">
  <div><div i-carbon:image text-6xl opacity-40 mx-auto /><div opacity-60 mt-2>데모 화면</div></div>
</div>

</div>

<div grid gap-3>

<div border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-cyan-300 text-xl shrink-0 /><span font-medium text-xl>아버지 · 뇌졸중 · 거동 도움</span></div>
</div>

<div border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-amber-300 text-xl shrink-0 /><span font-medium text-xl>어머니 · 독거</span></div>
</div>

<div border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-green-300 text-xl shrink-0 /><span font-medium text-xl>자녀 · 직장 병행</span></div>
</div>

<div border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-sky-300 text-xl shrink-0 /><span font-medium text-xl>가장 큰 걱정 · 돌봄공백</span></div>
</div>

</div>

</div>

<div mt-4 text-base opacity-70>
- AI는 ‘이해’만
- 사용자 확인
</div>

<!--
결과로 바로 가지 않고 AI가 읽어낸 상황을 칩으로 먼저 보여줍니다. 사용자가 확인하는 순간이자, AI 역할이 ‘이해’에 한정된다는 증거입니다.
-->

---
class: px-14 py-10
title: "막막함이 ‘오늘 할 일’로"
glowSeed: 289
glow: top
slideId: "slide-06"
semanticLayout: "demo-fullscreen"
durationSeconds: 60
impl: "implemented"
---

<h1>막막함이 ‘오늘 할 일’로</h1>

<div mt-4>

<div border="2 solid white/10" bg="white/5" backdrop-blur-sm rounded-xl grid place-items-center text-center class="h-[55vh]" data-asset-status="placeholder">
  <div><div i-carbon:image text-6xl opacity-40 mx-auto /><div opacity-60 mt-2>데모 화면</div><div text-xs opacity-40 mt-2 break-all>/captures/shot-02-result.png</div></div>
</div>

</div>

<div opacity-60 mt-3>지금 / 퇴원 후 / 장기 — 순서·의존성·중복배제까지 한 화면에</div>

<!--
한 문단이 시간순 체크리스트가 됩니다. ‘장기요양 등급부터 → 그래야 복지용구가 열린다’는 순서, ‘장기요양과 노인맞춤돌봄은 택일’이라는 중복배제, 뇌졸중 후유장애면 장애등록이라는 별도 트랙. 각 항목엔 공식 링크와 전화가 붙습니다.
-->

---
class: px-14 py-10
title: "AI가 틀려도, 엉뚱한 제도는 안 나옵니다"
glowSeed: 290
glow: full
slideId: "slide-07"
semanticLayout: "architecture"
durationSeconds: 40
impl: "implemented"
---

<h1>AI가 틀려도, 엉뚱한 제도는 안 나옵니다</h1>

<div mt-8>
  <div border="2 solid blue-800" bg="blue-800/20" rounded-lg overflow-hidden>
    <div bg="blue-800/40" px-5 py-3 flex items-center>
      <div i-carbon:flow text-blue-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>동작 흐름</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-center gap-3 py-1><div w-6 h-6 shrink-0 grid place-items-center rounded-full bg="blue-800/60" text-blue-100 text-sm font-bold>1</div><div><div font-medium text-xl>이해 (AI)</div><div text-base opacity-70>자연어 → 상황 신호 추출</div></div></div>
      <div flex items-center gap-3 py-1><div w-6 h-6 shrink-0 grid place-items-center rounded-full bg="blue-800/60" text-blue-100 text-sm font-bold>2</div><div><div font-medium text-xl>판정 (코드)</div><div text-base opacity-70>신호 → 규칙으로 매칭·순서화</div></div></div>
      <div flex items-center gap-3 py-1><div w-6 h-6 shrink-0 grid place-items-center rounded-full bg="blue-800/60" text-blue-100 text-sm font-bold>3</div><div><div font-medium text-xl>근거 (데이터)</div><div text-base opacity-70>공식 링크·서류·기한은 검증 데이터만</div></div></div>
    </div>
  </div>
</div>

<div mt-6 flex justify-center>
  <div border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-3>
    <div i-carbon:idea text-yellow-300 text-2xl shrink-0 />
    <span text-xl><b>결과:</b> 자격은 단정 안 함 — ‘받을 가능성 + 공식 확인’</span>
  </div>
</div>

<!--
AI는 사용자가 무엇을 걱정하는지 이해만 합니다. 무엇을 받는지는 결정론적 코드가 공식 데이터로 정합니다. 그래서 AI가 흔들려도 없는 제도·가짜 링크가 나가지 않습니다. ‘똑똑함’이 아니라 ‘정직함’이 차별점입니다.
-->

---
class: px-14 py-10
title: "헛것이 아닙니다"
glowSeed: 291
glow: left
slideId: "slide-08"
semanticLayout: "card-grid"
durationSeconds: 30
impl: "implemented"
---

<h1>헛것이 아닙니다</h1>

<div mt-6 grid grid-cols-3 gap-4 h-75>

  <div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-cyan-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-xl>79개 제도</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-base opacity-80>출처·신청절차·기한까지 손으로 정리 (2026 확인)</div>
    </div>
  </div>

  <div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-amber-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-xl>5개 사례 전수 통과</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-base opacity-80>가상 페르소나로 매칭이 실제 코드로 점등됨을 검증</div>
    </div>
  </div>

  <div border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-green-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-xl>키 없어도 작동</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-base opacity-80>LLM 실패 시 키워드 폴백 — 데모 안전망</div>
    </div>
  </div>

</div>

<!--
데이터는 79개 제도를 절차·기한까지 손으로 정리했습니다. 5개 사례로 매칭을 실제 코드로 검증했고, 키가 없어도 키워드로 동작하는 폴백을 둬 데모가 끊기지 않습니다.
-->

---
class: px-14 py-10
title: "같은 엔진, 더 멀리"
glowSeed: 292
glow: right
slideId: "slide-09"
semanticLayout: "expansion-map"
durationSeconds: 40
impl: "mocked"
---

<div class="absolute top-4 right-6 text-xs px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-200">MOCKED</div>

<h1>같은 엔진, 더 멀리</h1>

<div mt-6 grid grid-cols-3 gap-4 h-75>

  <div border="2 solid sky-800" bg="sky-800/20" rounded-lg overflow-hidden h-full>
    <div bg="sky-800/40" px-4 py-2 flex items-center justify-center>
      <span font-bold text-xl>지금</span>
    </div>
    <div px-4 py-4 flex flex-col gap-1>
      <div text-base opacity-80>부모 돌봄 — 한 문장이 오늘 할 일로 (작동)</div>
    </div>
  </div>

  <div border="2 solid purple-800" bg="purple-800/20" rounded-lg overflow-hidden h-full>
    <div bg="purple-800/40" px-4 py-2 flex items-center justify-center>
      <span font-bold text-xl>곧</span>
    </div>
    <div px-4 py-4 flex flex-col gap-1>
      <div text-base opacity-80>서류 사진 입력 · 가까운 기관 길찾기 · 가족 공유 (개발 중)</div>
    </div>
  </div>

  <div border="2 solid indigo-800" bg="indigo-800/20" rounded-lg overflow-hidden h-full>
    <div bg="indigo-800/40" px-4 py-2 flex items-center justify-center>
      <span font-bold text-xl>다음</span>
    </div>
    <div px-4 py-4 flex flex-col gap-1>
      <div text-base opacity-80>아이 돌봄(출산·발달)으로 확장 — 데이터만 교체</div>
    </div>
  </div>

</div>

<!--
엔진은 그대로, 데이터만 교체합니다. 폰에 담기면 사진 한 장으로 입력하고 위치로 길을 찾습니다. 더 멀리는 ‘처음 겪는 가족 사건’이라는 같은 구조로 아이 돌봄까지. ‘곧·다음’은 아직 개발 중임을 분명히 합니다.
-->

---
class: px-14 py-10
title: "한계와 안전장치"
glowSeed: 314
glow: center
slideId: "slide-10"
semanticLayout: "limitation-guardrail"
durationSeconds: 30
impl: "implemented"
---

<h1>한계와 안전장치</h1>

<div mt-8 grid grid-cols-2 gap-6 items-start>
  <div border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-amber-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>한계</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정밀 자격판정 불가</div><div text-base opacity-80>자격기준이 산문이라</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>지역 편차</div><div text-base opacity-80>지자체 제도는 지역마다 다름</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정보 불확실</div><div text-base opacity-80>일부 제도는 ‘확인 필요’</div></div>
      </div>
    </div>
  </div>
  <div border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-5 py-3 flex items-center>
      <div i-carbon:shield-checkmark text-green-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>안전장치</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>단정 안 함</div><div text-base opacity-80>‘받을 가능성 + 공식 링크’로만</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>코드가 판정</div><div text-base opacity-80>매칭·순서는 결정론</div></div>
      </div>
      <div flex items-start gap-2 py-1>
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정직 표기</div><div text-base opacity-80>불확실은 ‘확인 필요’ 배지</div></div>
      </div>
    </div>
  </div>
</div>

<!--
자격은 산문이라 정밀판정이 불가능합니다. 단정하지 않고 ‘받을 가능성과 공식 확인’으로만 안내하며, 불확실한 항목은 숨기지 않고 표시합니다.
-->

---
layout: center
title: "처음이라 막막한 그 순간, 첫 줄을 대신 써드립니다"
glowSeed: 315
glow: bottom
slideId: "slide-11"
semanticLayout: "closing"
durationSeconds: 25
impl: "implemented"
---

<div class="text-center">

<h1>처음이라 막막한 그 순간, 첫 줄을 대신 써드립니다</h1>

<div class="opacity-70 mt-3 max-w-2xl mx-auto">곁에 — 가족 복지·돌봄 내비게이터</div>

</div>

<div class="mt-8"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-base text-cyan-100"><span class="i-carbon:play" /> 데모: (배포 URL 기입)</div></div>

<div class="mt-4 flex flex-wrap gap-2 justify-center"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-base text-xs opacity-75">막막함 → 오늘 할 일</div><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-base text-xs opacity-75">판정은 코드</div><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-base text-xs opacity-75">공개데이터 79제도</div></div>

<div class="mt-8"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-base opacity-80"><span class="i-carbon:logo-github" /> github.com/Strider1370/TeamAMO</div></div>

<!--
받을 수 있었는데 몰라서 못 받는 일을, 한 문장으로 끝냅니다. 처음이라 막막한 그 순간, 첫 줄을 대신 써드립니다. 감사합니다.
-->
