import { NextResponse } from 'next/server';
import { openaiChat } from '@/lib/llm';

export const runtime = 'nodejs';

// 서버사이드 전용. system/user 한 쌍을 받는 얇은 라우트. 키 없으면 폴백(text:null).
export async function POST(req: Request) {
  let body: { system?: string; user?: string; json?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  if (!body.user) {
    return NextResponse.json({ error: 'user required' }, { status: 400 });
  }
  const text = await openaiChat({
    system: body.system ?? '',
    user: body.user,
    json: body.json,
  });
  if (text == null) {
    return NextResponse.json({ text: null, provider: 'fallback' });
  }
  return NextResponse.json({ text, provider: 'openai' });
}
