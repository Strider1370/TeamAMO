import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// @ts-expect-error — 순수 .mjs 엔진/추출 모듈(공유). 타입 없음.
import { extractSignals } from '@/lib/extract.mjs';
// @ts-expect-error
import { matchPrograms } from '@/lib/engine.mjs';

export const runtime = 'nodejs';

// data/ 는 web/ 밖 → process.cwd()(=web) 기준 ../data 를 서버사이드 fs로 읽음 (INDEX 패턴).
let cache: { rules: any; curated: any; dict: any } | null = null;
function data() {
  if (!cache) {
    const root = path.join(process.cwd(), '..', 'data');
    const load = (p: string) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
    cache = {
      rules: load('welfare/rules.json'),
      curated: load('welfare/curated-benefits.json'),
      dict: load('questionnaire/slot-dictionary.json'),
    };
  }
  return cache;
}

export async function POST(req: Request) {
  let body: { text?: string; region?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  const text = (body.text || '').trim();
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 });

  const { rules, curated, dict } = data();
  // 런타임 키(설정 모달) 우선 → 없으면 서버 env. 키 없으면 키워드 폴백.
  const apiKey = req.headers.get('x-openai-key') || process.env.OPENAI_API_KEY || undefined;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const signals = await extractSignals(text, { dict, apiKey, model });
  if (body.region) signals.slots = { ...signals.slots, region: body.region };
  const result = matchPrograms(
    { situations: signals.situations, slots: signals.slots, primaryConcern: signals.primaryConcern },
    { rules, curated },
  );
  return NextResponse.json({ signals, result });
}
