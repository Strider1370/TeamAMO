// scripts/generate-banner.mjs — 주제에 맞는 "공공기관 사진풍" 상단 배너를 자동 생성.
//
// 흐름: 주제 결정 → (LLM) 주제를 공공기관 히어로 장면으로 확장 → 고정 스타일 래퍼 →
//        gpt-image-2(없으면 gpt-image-1 폴백)로 와이드 배너 생성 → web/public/hero-banner.png 저장.
// 키(OPENAI_API_KEY) 없으면 건너뜀(기존 기본 배너 유지). data.go.kr 무관, OpenAI 키만 사용.
//
// 사용:
//   node scripts/generate-banner.mjs --topic "동네별 폭염 행동 가이드"
//   node scripts/generate-banner.mjs                 # 주제 자동: workflow/state.yaml 의 project.topic/name
//   node scripts/generate-banner.mjs --out web/public/hero-banner.png --topic "청년 주거 지원"
// env override: OPENAI_API_KEY, OPENAI_MODEL(채팅), OPENAI_IMAGE_MODEL, OPENAI_IMAGE_SIZE
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── 인자 파싱 ───────────────────────────────────────────────
function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}
const OUT = resolve(ROOT, arg('--out') || 'web/public/hero-banner.png');

// ── 주제 결정: --topic > env BANNER_TOPIC > state.yaml project.topic/name ──
function resolveTopic() {
  const cli = arg('--topic');
  if (cli) return cli.trim();
  if (process.env.BANNER_TOPIC) return process.env.BANNER_TOPIC.trim();
  const statePath = join(ROOT, 'workflow', 'state.yaml');
  if (existsSync(statePath)) {
    try {
      const s = yaml.load(readFileSync(statePath, 'utf8'));
      const t = s?.project?.topic || s?.project?.name;
      if (t && String(t).trim()) return String(t).trim();
    } catch { /* ignore */ }
  }
  return null;
}

function loadKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const envPath = join(ROOT, 'web', '.env.local');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*OPENAI_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

// 공공기관 메인 배너 고정 스타일(실측: 국민연금·건보·코레일 등 = 사진풍 배경 + 왼쪽 텍스트 여백)
const STYLE =
  '대한민국 공공기관 웹사이트 메인 히어로용 가로로 넓은 사진풍 이미지. 밝고 신뢰감 있는 공공 분위기, ' +
  '파란 하늘/밝은 자연광, 전문적인 사진 느낌. 화면 왼쪽 절반은 텍스트가 올라갈 수 있도록 비교적 비우고 ' +
  '주요 피사체는 오른쪽에 배치. 사람 얼굴 클로즈업, 글자, 로고는 넣지 않는다.';

// ── (선택) LLM 으로 주제 → 장면 한 문장 확장 ──
async function expandScene(key, topic) {
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const isNewGen = /^(gpt-5|o\d)/.test(model);
  const body = {
    model,
    messages: [
      { role: 'system', content: '너는 한국 공공기관 웹사이트 히어로 배너용 사진 장면을 묘사하는 아트디렉터다. 장소·환경·분위기 중심으로, 사람 얼굴 클로즈업과 글자는 배제한다.' },
      { role: 'user', content: `다음 주제에 어울리는 공공기관 홈페이지 상단 배너용 사진 장면을 한국어 한 문장으로만 묘사해줘. 주제: ${topic}` },
    ],
  };
  if (isNewGen) body.max_completion_tokens = 120;
  else { body.max_tokens = 120; body.temperature = 0.5; }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.choices?.[0]?.message?.content ?? '').trim() || null;
  } catch { return null; }
}

// ── 이미지 생성: gpt-image-2 우선, 실패 시 gpt-image-1 폴백 ──
async function generate(key, prompt) {
  const attempts = [
    { model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2', size: process.env.OPENAI_IMAGE_SIZE || '1536x512' },
    { model: 'gpt-image-1', size: '1536x1024' }, // 폴백(고정 크기)
  ];
  for (const { model, size } of attempts) {
    console.log(`이미지 생성 시도: ${model}, ${size}`);
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model, prompt, n: 1, size }),
        signal: AbortSignal.timeout(180000),
      });
      if (!res.ok) { console.warn(`  실패 HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`); continue; }
      const data = await res.json();
      const d = data.data?.[0];
      if (d?.b64_json) return Buffer.from(d.b64_json, 'base64');
      if (d?.url) {
        const ir = await fetch(d.url, { signal: AbortSignal.timeout(60000) });
        if (ir.ok) return Buffer.from(await ir.arrayBuffer());
      }
      console.warn('  응답에 이미지 없음');
    } catch (e) { console.warn(`  오류: ${e.message}`); }
  }
  return null;
}

async function main() {
  const key = loadKey();
  if (!key) { console.error('OPENAI_API_KEY 없음 — 배너 생성을 건너뜁니다(기존 기본 배너 유지).'); process.exit(0); }

  const topic = resolveTopic();
  if (!topic) {
    console.error('주제를 찾지 못함 — --topic "<주제>" 를 주거나 workflow/state.yaml 의 project.topic 을 채우세요.');
    process.exit(1);
  }
  console.log(`주제: ${topic}`);

  const scene = await expandScene(key, topic);
  console.log(scene ? `장면(LLM): ${scene}` : '장면: LLM 미사용 — 주제를 직접 사용');
  const prompt = `${STYLE}\n주제: ${topic}\n장면: ${scene || topic + ' 와 관련된 한국의 공공장소/상황'}`;

  const t = Date.now();
  const buf = await generate(key, prompt);
  if (!buf) { console.error('모든 이미지 모델 시도 실패 — 기존 배너 유지.'); process.exit(1); }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, buf);
  console.log(`배너 저장: ${OUT} (${Math.round(buf.length / 1024)}KB, ${Date.now() - t}ms)`);
}
main().catch((e) => { console.error('generate-banner 실패:', e.message); process.exit(1); });
