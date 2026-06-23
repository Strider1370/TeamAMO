# 발표자료 제작 (Slidev)

> 해커톤 발표자료를 만드는 **참고서**다. 자동화 엔진이 아니라, "어떻게 만들면 좋은지"를 모아둔 문서다.
> 따라야 할 강제 절차는 없다 — 필요한 부분만 골라 쓰고, 마지막에 스스로 점검한다.
>
> 담는 내용: ① Slidev로 슬라이드 만드는 법 · ② `deck.json`/레이아웃 규칙 · ③ 발표 카피 작성법(AI 초안 + 사람 덮어쓰기 + 잠금) · ④ 톤 가이드.

---

## 1. 큰 그림 — 무엇을, 어떤 순서로

발표자료는 보통 이런 흐름으로 만든다(전부 다 거칠 필요는 없다 — 시간·규모에 맞게 줄여라).

```text
발표 대본(script)
→ 장면 분해(scenes)
→ 슬라이드 계약(deck.json)  (+ copy.md 함께 — §5.2)
→ Slidev 슬라이드(slides.md)
→ slidev build (dist)
→ dist 정적 서빙으로 캡처해 눈으로 점검
```

핵심 원칙은 **"사람이 만든 템플릿·스타일을 보존하고, 내용만 채운다"**는 것이다. 슬라이드마다 CSS를 새로 짜지 말고, 이미 있는 레이아웃을 골라 슬롯에 내용을 넣는다.

```text
사람이 만든 템플릿/스타일 유지
→ 각 장면의 목적을 해석
→ 어울리는 레이아웃 선택
→ 슬롯(빈칸)에 내용·이미지 삽입
→ 렌더링
```

### 엔진 = Slidev 단일
- **발표 엔진은 Slidev로 고정.** `deck.json` 하나가 진실의 원천이고, 렌더러는 Slidev 하나뿐이다(이중 렌더러가 만들던 슬롯 필드명 불일치도 사라짐 — §3 슬롯 필드맵).
- **오프라인/백업도 Slidev로**: `slidev build` 결과(`dist/`)를 정적 서빙하면 인터넷 없이도 발표·캡처가 된다(별도 HTML 엔진 불필요). dev 서버는 헤드리스에서 charset이 깨지니 **캡처·발표는 dist 정적 서빙 경로**를 쓴다(§7).
- 다른 엔진(Notion 정적 HTML·Reveal·Marp)은 이 키트에서 쓰지 않는다.

---

## 2. 디자인 보존 — 해도 되는 것 / 하면 안 되는 것

이미 검증된 템플릿이 있다면 그 시각 정체성을 지킨다. AI가 매번 HTML/CSS를 자유 생성하면 슬라이드마다 디자인이 따로 놀게 된다.

**해도 되는 것**
- 발표 가독성을 위한 폰트 크기 조정
- 16:9에 맞춘 간격 조정
- 반복 가능한 레이아웃 정리, 슬롯화, 스타일 토큰화, 컴포넌트화
- 접근성·overflow 수정

**하면 안 되는 것**
- 새 컬러 팔레트·다른 폰트 임의 도입
- 원본과 무관한 카드 스타일, 불필요한 그라디언트·글로우
- 슬라이드마다 다른 CSS 생성
- 원본 템플릿 파일 덮어쓰기 (원본은 분석·추출용으로만 두고, 결과물은 별도 경로에 둔다)

### CSS 우선순위 (충돌 시)
```text
1. Slidev 엔진 base
2. 기존 Slidev 템플릿 base
3. Notion 디자인 토큰
4. Notion 컴포넌트 적응
5. 프로젝트별 override
6. 긴급 text-fit override
```
슬라이드별 inline style로 충돌을 해결하거나 `!important`를 남용하지 마라. 같은 역할의 스타일을 여러 파일에 중복 정의하지 마라.

### ⚠️ 폰트 크기 override 함정 (attributify)
생성기는 UnoCSS **attributify** 문법(`<div text-lg>` — 클래스가 아니라 **속성**)으로 출력한다. 그래서 덱 `style.css`에서 크기를 키울 때:
- ❌ `.text-lg { … }` (클래스 선택자) — **안 먹는다.**
- ✅ `[text-lg] { … }` (**속성 선택자**) 로 타깃. + 크기 속성이 없는 plain 텍스트까지 덮으려면 `.slidev-layout` **베이스 폰트**를 함께 상향.

> 근본 해결은 override보다 **생성기 기본 사이즈 상향**(이미 한 단계 키워둠 — §6.2 크기 기준). 그래도 특정 덱만 더 키울 때 위 속성 선택자를 쓴다.

---

## 3. 레이아웃 규칙 — Semantic Layout

실제 Slidev 레이아웃 이름을 바로 고르지 말고, 먼저 **공통 의미 ID(semantic layout)** 중 하나를 고른다. 렌더러가 이를 실제 Slidev 레이아웃으로 매핑한다(`layout-registry.json`).

공통 semantic ID(16종):
```text
hero · problem-flow · contrast · insight-statement · product-overview
demo-fullscreen · demo-callout · architecture · before-after · big-number
card-grid · timeline · quote · limitation-guardrail · expansion-map · closing
```

매핑 예(Slidev 단일 렌더러):
```json
{ "semanticId": "contrast", "renderers": { "slidev": "two-cols" } }
```

### 레이아웃별 슬롯 필드맵 (한 장)
> `deck.json`의 `content`에 넣는 슬롯 이름. **이 이름 그대로** 채운다(예전 이중 렌더러 시절의 `heading/num` 같은 변형명 쓰지 말 것). 배열 슬롯(`items`·`cards`·`features`·`steps`·`tiers`)의 각 항목은 `{ title, desc }` 형태.

| semanticId | content 슬롯 |
|---|---|
| hero | `eyebrow` · `title` · `subtitle` · `footnote` |
| problem-flow | `title` · `items[]` |
| contrast | `title` · `lead` · `leftLabel` · `left` · `rightLabel` · `right` |
| insight-statement | `title` · `subtitle` |
| product-overview | `title` · `features[]` |
| demo-fullscreen | `title` · `subtitle` |
| demo-callout | `title` · `callout` · `points` |
| architecture | `title` · `steps[]` · `result` |
| before-after | `title` · `beforeLabel` · `afterLabel` · `beforeCaption` · `afterCaption` |
| big-number | `label` · `number` · `caption` |
| card-grid | `title` · `cards[]` |
| timeline | `title` · `steps[]` |
| quote | `quote` · `attribution` |
| limitation-guardrail | `title` · `limitations` · `guardrails` |
| expansion-map | `title` · `tiers[]` |
| closing | `title` · `subtitle` · `cta` · `tags` · `contact` |

### 어떤 레이아웃을 고르나 (규칙 우선 + 판단 보조)
```text
답을 먼저(answer-first)        → hero
마무리                         → closing
데모                          → demo-fullscreen
데모 + Wow 순간 강조           → demo-callout
작동 원리                      → architecture
인사이트 + 가정/현실 대비       → contrast
인사이트 + 강한 한 문장         → insight-statement
임팩트 + 과정 비교             → before-after
임팩트 + 검증된 숫자           → big-number
한계/안전장치                  → limitation-guardrail
확장 계획                      → expansion-map
```
후보가 여러 개면 메시지 길이·비교 구조·숫자 유무·이미지 유무·앞 슬라이드와의 반복·시각적 강도 등을 따져 고른다. **같은 레이아웃 3장 연속은 피한다.**

---

## 4. 데이터 계약 — `scenes.json` / `deck.json`

발표를 "장면 → 슬라이드"로 나눠 적는 중간 파일이다. 손으로 써도 되고, 생성기를 써도 된다(§7).

### `scenes.json` — 대본을 시각 장면으로 분해
```json
{
  "version": 1,
  "title": "프로젝트명",
  "totalDurationSeconds": 300,
  "scenes": [
    {
      "id": "scene-01",
      "role": "answer-first",
      "durationSeconds": 20,
      "message": "한 문장으로 요약된 핵심 가치",
      "script": "발표자가 말할 대본…",
      "visualIntent": "첫 5초 안에 가치를 이해시킨다.",
      "contentType": "hero-message",
      "requiredAssets": []
    }
  ]
}
```

### `deck.json` — Slidev 슬라이드의 단일 계약
```json
{
  "version": 1,
  "meta": {
    "title": "프로젝트명", "engine": "slidev",
    "aspectRatio": "16:9", "language": "ko"
  },
  "slides": [
    {
      "id": "slide-01",
      "sceneId": "scene-01",
      "role": "answer-first",
      "semanticLayout": "hero",
      "engineLayout": "cover",
      "content": {
        "eyebrow": "한 줄 분류",
        "title": "핵심 약속 한 문장",
        "subtitle": "보조 설명"
      },
      "assets": {},
      "speakerNotes": "발표자가 말할 내용…",
      "durationSeconds": 20
    }
  ]
}
```
- `deck.json` 하나가 진실의 원천이다. 슬롯 이름은 §3 필드맵을 따른다.
- 검증 가능한 주장·수치는 출처 ID와 연결할 수 있다(예: `"claimIds": [...], "sourceIds": [...]`).
- 구현 상태가 실제(`implemented`)가 아닌 기능은 실제처럼 표현하지 않는다 — 목업(`mocked`)·폴백(`fallback`)은 그렇게 표시하고, 제거된(`dropped`/`blocked`) 기능은 발표에서 뺀다.

---

## 5. 발표 카피 작성법 — "사람이 카피라이터, AI가 편집·배치"

> 기본 동작("AI가 카피를 다 쓰고 사람이 검수")을 **역전**한다. 화면에 박히는 카피는 사람이 쓰고, AI는 구조·배치·렌더·안전점검만 한다.
> 배경: "AI가 만드는 발표 문구가 오글거린다. 내가 직접 넣고 싶다." → 화면 카피의 저작권을 사람에게.

### 5.1 두 층 구분 — 어디를 사람이 쓰나
- **① 화면에 박히는 글 = `deck.json`의 슬롯** (제목·콜아웃·불릿 등). ← **사람이 쓴다. 오글거림의 본진.**
- **② 말로 하는 대본 = `script.md` 스피커 노트.** ← AI 초안 허용(애드립 가능). 단 톤 가이드는 적용.

### 5.2 방식 — "AI 초안 + 사람 덮어쓰기 + 잠금"
빈칸을 던지는 게 아니다. **AI가 초안을 다 채워두고**, 사람은 마음에 안 드는 칸만 갈아끼운다. 손 안 댄 칸은 AI 초안이 그대로 남는다.

**(a) AI가 초안을 채운 양식을 깐다 — `copy.md`는 항상 함께 만든다**
- AI는 구조(슬라이드 수·`semanticLayout`·슬롯·**슬롯별 글자 수 한도**)를 정하고, 각 슬롯에 톤 가이드를 적용한 초안을 채워 넣는다.
- **초안은 풍부하게.** 빈칸·한 단어로 두지 말고 슬롯마다 **1~2문장 구체 내용**(숫자·근거)으로 꽉 채운다 — 사람은 초안을 보고 **덜어내며** 다듬으니, 부족하게보다 꽉 차게 시작한다. (덱은 `meta.clicks:false`로 모든 내용을 즉시 노출해 사람이 실제 밀도를 판단하게 한다. 오버플로만 §8로 점검.)
- **`copy.md`는 선택이 아니라 필수.** `deck.json`을 만들면 **항상** `presentation/copy.md`(슬롯마다 "AI초안 + 내수정 자리")를 함께 만든다. 슬라이드 구조가 바뀌면 `copy.md`도 다시 만든다.
- 양식(`copy.md`) — 슬롯마다 "AI초안 + 내수정 자리":
  ```
  slide-03 (hero)
    title     [≤22자] | AI초안: 핵심 약속 한 줄        | 내수정:
    subtitle  [≤40자] | AI초안: 보조 설명 한 줄        | 내수정:
  slide-04 (demo-callout)
    title     [≤20자] | AI초안: 실제로 돌려보면        | 내수정:
    callout   [≤30자] | AI초안: 한 동작이면 자동 처리   | 내수정:
  ```
  → 사람은 "내수정:" 칸에 **고치고 싶은 것만** 적는다. 비워두면 AI초안 채택.
- 슬롯 이름은 레이아웃 정의 기준(예: hero=eyebrow/title/subtitle/footnote, demo-callout=title/callout/points, big-number=label/number/caption, insight-statement=title/subtitle, closing=title/subtitle/cta/tags/contact).

**(b) 사람이 문구를 주는 2통로 (조합 가능)**
- **A. 채팅 주소 지정**: "slide-03 title을 '○○'로." → 해당 필드만 고침.
- **B. 양식 직접 편집**: `copy.md`의 "내수정:" 칸을 채움 → `deck.json`에 반영.

**(c) 잠금 — 사람 카피 보호 (핵심)**
- 사람이 고친/지정한 슬롯만 `deck.json`에서 **`"authoredBy": "user"`(또는 `"locked": true`)** 로 표시.
- 손 안 댄 슬롯은 `authoredBy: ai` — AI 초안 유지, 이후 다듬어도 됨.
- 잠긴(user) 슬롯은 재렌더/재생성이 **글자를 절대 안 바꾼다.** 배치·렌더만. 잠긴 칸에 대한 AI의 유일한 행동 = **경고**(§5.3).

### 5.3 AI가 유지하는 안전망 (잠겨 있어도 침범 아님 — 경고만)
- **오버플로우 경고**: 사람이 쓴 글이 슬롯 글자수/박스를 넘치면 "넘침 — 줄일지?" 알림(자동 삭제 X).
- **허위주장 경고**: 구현 목록(`implementation/manifest.json`)에 없는 기능을 카피가 주장하면 경고(해커톤 규칙: 미구현 발표 금지).
- 둘 다 **사람에게 묻고**, 사람이 결정. AI가 임의로 카피를 고치지 않는다.

---

## 6. 톤 가이드 (오글거림 방지)

> AI가 카피·대본 초안을 쓸 때 적용한다. 시작본이며 — 콘셉트가 정해진 뒤 프로젝트 목소리에 맞게 §6.4를 채운다.
> 사람이 잠근(`authoredBy: user`) 카피는 이 가이드를 위반해도 AI가 고치지 않는다(사람 결정 우선).

### 6.1 금지어·금지 패턴 (기본값 — 프로젝트에 맞게 가감)
- 과장 형용사: "혁신적인", "획기적인", "놀라운", "압도적인", "최고의"
- 공허한 연결: "~를 통해", "~함으로써", "~라는 점에서"
- 마케팅 클리셰: "게임 체인저", "패러다임", "여정(journey)", "경험을 제공합니다"
- 영혼 없는 구호: "여러분", "함께", "꿈꿉니다", 느낌표 남발
- 근거 없는 수치: 구현·검증에 없는 숫자, "N% 향상" 류

### 6.2 말투 규칙
- **구어체 단문.** 한 슬롯 = 한 메시지. 접속사로 늘이지 말 것.
- **명사로 끝내거나 동사 원형으로 끊기** (슬라이드 카피는 문장보다 구).
- 화면 카피는 **짧게** — 레이아웃 글자수 한도 안에서. 설명은 스피커 노트로. (※ "짧게"는 **분량** 축이다. 초안을 비우라는 뜻이 아니다 — §5.2(a)대로 초안은 풍부히 채우고, 사람이 덜어내며 최종을 짧게 만든다.)
- **글자 크기는 분량과 별개의 축.** 빔 뒤쪽 좌석에서도 읽히게 **본문은 슬라이드 높이의 ≥ ~3%**(720p 기준 ≈ 22px+, 18~24pt 상당)로. 생성기 기본 사이즈를 이미 한 단계 키워뒀다(§2 attributify override). 키워서 넘치면 분량을 줄이거나 미세조정(§8 overflow).
- 숫자는 **근거 있는 것만**. 없으면 정성적으로.
- **톤 = 인물.** 화자를 추상어("전문적인")가 아니라 구체적 인물로 설정하고 그 말투로 쓴다. (예: "과장에 회의적인 시니어 엔지니어" / "현장 담당자") — §6.4에서 이 프로젝트 인물 확정.
- **첫 문장은 사람이 쓴다.** 슬라이드1 제목 + 오프닝 한 줄은 발표 인상을 좌우한다 → AI는 후보 2~3개만 제시하고, 확정 카피는 사람이 고르거나 직접 쓴다(=잠금).
- **발표장 어투인지 소리 내어 확인.** 슬라이드 카피는 발표자가 입으로 말해도 어색하지 않아야 한다(과한 일상 줄임말도, 딱딱한 문어체도 지양).

### 6.3 좋은 예 / 나쁜 예
- ❌ "혁신적인 AI 기술을 통해 사용자에게 놀라운 경험을 제공합니다"
- ✅ "신청서 3장, 30초에 끝" (구체·검증가능·짧음)
- ❌ "우리는 모두가 함께하는 더 나은 세상을 꿈꿉니다"
- ✅ "12일 걸리던 일, 이제 하루." (대비·숫자, 발표장에서 그대로 말해도 자연스러운 어투)

### 6.4 프로젝트별 보강 (콘셉트 확정 후 채움)
- 우리 제품 한 문장(피치): _(미정)_
- 톤 한 단어(예: 담백 / 단호 / 따뜻): _(미정)_
- 화자 인물(톤): _(미정)_
- 이 프로젝트에서 추가로 금지할 단어: _(미정)_

---

## 7. 생성기 — 선택적 도구 (쓰면 편하다)

`presentation/generator/`에 `deck.json` → `slides.md` 변환, 슬라이드 검증, 캡처 스크립트가 있다. **필수가 아니다** — 손으로 슬라이드를 짜도 되고, 양이 많거나 반복 작업이 많을 때 쓰면 편하다.

자주 쓰는 명령:
```bash
npm run presentation:scenes          # script → scenes.json
npm run presentation:layouts         # 레이아웃 선택
npm run presentation:slidev          # deck.json → slides.md
npm run presentation:validate-deck   # deck.json 계약 점검
npm run presentation:validate-slides # 생성된 슬라이드 점검(overflow 등)
npm run presentation:capture         # dist 정적 서빙 + Playwright 스크린샷
npm run presentation:pdf             # PDF 내보내기
npm run presentation:build           # validate-deck → slidev → validate-slides
npm run presentation:gallery         # 16개 레이아웃 한 장씩 채운 갤러리
```
생성기를 쓰든 손으로 짜든, 결과 품질은 §8로 스스로 점검한다.

### Slidev 빌드/서빙 팁
- 헤드리스/미리보기 환경에서는 `slidev dev`가 검은 화면·charset 깨짐이 날 수 있다. 이때는 `slidev build` 결과물을 정적 서빙하면 UTF-8·다크 테마가 정상 렌더된다(캡처·발표 모두 이 경로 권장).
- 시각 검증은 `npm run presentation:capture`로 — **dist 정적 서빙 + Playwright 스크린샷**을 한 번에 한다(미리보기 스크린샷은 헤드리스에서 타임아웃 남). 매번 직접 셋업하지 말 것.
- 발표자 노트는 반드시 포함한다. 실제 앱 캡처가 있으면 placeholder·목업보다 우선한다.
- 외부 URL 자산(폰트·아이콘·이미지)은 로컬로 복사해 **인터넷 없이도 발표 가능**하게 한다.

---

## 8. 스스로 점검 (완성 전 눈으로 확인)

만든 슬라이드를 다시 캡처해 아래를 직접 본다. 픽셀 복제가 아니라 **일관된 디자인 언어 유지**가 목표다.

**기계적 점검**
- Slidev 빌드 성공, 모든 레이아웃·필수 슬롯 존재
- 자산 경로 정상(이미지 404 없음), JS 오류 없음
- 스피커 노트 존재, 총 발표 시간 제한 이내, overflow 없음

**시각 점검**
- 같은 레이아웃 3장 연속 사용하지 않았는가?
- 제목 3줄 초과, 본문 과다, 대본 통째 복사 아닌가?
- **빔 뒤쪽 좌석에서 본문이 읽히나?** (본문 ≥ 슬라이드 높이 3% — §6.2)
- 데모 이미지가 화면의 60% 이상인가?
- 강조색 과다, 원본과 다른 폰트, 정보 밀도 과다 아닌가?
- 실제 구현 화면 대신 목업만 쓰고 있지 않은가?

---

## 9. 데모 백업 & 자산 출처

- **데모 백업은 단계별 스크린샷(.png)** + Wow 캡처로 한다. 영상/GIF는 만들지 않는다. 동적 Wow가 정지 컷에 안 담기면, 그 순간 전후 2~3장을 연속으로 찍어 변화를 보여준다.
- 외부 Slidev 템플릿·폰트·아이콘·이미지의 사용·수정·배포 가능 여부를 기록한다(예: `ASSET_LICENSES.md`, `provenance.json`).
- 참고 캡처는 레이아웃·밀도·리듬의 **품질 기준으로만** 쓰고, 최종 슬라이드에 그대로 삽입하지 않는다.

---

## 핵심 규칙 요약

1. 원본 템플릿을 덮어쓰지 않는다.
2. 등록되지 않은 레이아웃을 임의로 만들지 않는다. 기존 스타일·컴포넌트를 먼저 재사용한다.
3. 참고 캡처를 최종 발표에 그대로 넣지 않는다.
4. 대본을 슬라이드에 그대로 복사하지 않는다.
5. 슬라이드마다 CSS를 새로 만들지 않는다.
6. 빌드 실패를 완료로 처리하지 않는다.
7. 실제 앱 캡처가 있으면 목업보다 우선한다. 외부 URL 자산은 로컬로 복사한다.
8. 인터넷 없이 발표 가능해야 한다.
9. 엔진은 Slidev 단일. `deck.json`을 만들면 **`copy.md`도 항상 함께** 만든다(슬롯 이름은 §3 필드맵).
10. **화면 카피는 사람이 쓴다.** 잠긴 카피의 글자를 AI가 바꾸지 않는다 — 경고만.
11. 구현되지 않은 기능을 실제처럼 발표하지 않는다.
