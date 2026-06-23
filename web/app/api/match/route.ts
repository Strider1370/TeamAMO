import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// @ts-expect-error — 순수 .mjs 엔진/추출 모듈(공유). 타입 없음.
import { extractSignals, visionExtract, mergeSignals, rankByRelevance } from '@/lib/extract.mjs';
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
  let body: { text?: string; region?: string; image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  const text = (body.text || '').trim();
  const image = (body.image || '').trim();
  if (!text && !image) return NextResponse.json({ error: 'text or image required' }, { status: 400 });

  const { rules, curated, dict } = data();
  // 런타임 키(설정 모달) 우선 → 없으면 서버 env. 키 없으면 키워드 폴백.
  const apiKey = req.headers.get('x-openai-key') || process.env.OPENAI_API_KEY || undefined;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  // 텍스트 경로(기존)와 이미지 경로(신규)를 각각 추출해 병합. 둘 다 있으면 키워드(text) ∪ vision.
  let signals: any = null;
  if (text) signals = await extractSignals(text, { dict, apiKey, model });
  if (image) {
    try {
      const v = await visionExtract(image, { apiKey, model });
      signals = signals ? mergeSignals(signals, v) : v;
    } catch (e: any) {
      // 비전 실패 시 텍스트 신호가 있으면 그것으로 진행, 아니면 에러.
      if (!signals) return NextResponse.json({ error: 'vision extract failed: ' + (e?.message || 'error') }, { status: 502 });
    }
  }
  if (!signals) return NextResponse.json({ error: 'no signals' }, { status: 422 });
  if (body.region) signals.slots = { ...signals.slots, region: body.region };
  const result = matchPrograms(
    { situations: signals.situations, slots: signals.slots, primaryConcern: signals.primaryConcern },
    { rules, curated },
  );

  // LLM 관련도 정렬 — 코드가 고른 후보의 '순서'만 재정렬(선택·추가는 코드). 실패 시 결정론 순서 유지.
  const rankText = text || Object.values(signals.slots || {}).flat().join(', ');
  if (apiKey && rankText) {
    try {
      const items: { id: string; name: string }[] = [];
      for (const b of Object.keys(result.timeline)) for (const c of result.timeline[b]) items.push({ id: c.id, name: c.name });
      const order = await rankByRelevance({ text: rankText, items }, { apiKey, model });
      if (order) {
        const idx = new Map<string, number>(order.map((id: string, i: number) => [id, i]));
        for (const b of Object.keys(result.timeline)) {
          result.timeline[b].sort((a: any, c: any) => (idx.get(a.id) ?? 1e9) - (idx.get(c.id) ?? 1e9));
          result.timeline[b].forEach((c: any, i: number) => { c.core = c.boosted || i < 4; });
        }
        result.rankedBy = 'llm';
      }
    } catch { /* 결정론 순서 유지 */ }
  }

  return NextResponse.json({ signals, result });
}
