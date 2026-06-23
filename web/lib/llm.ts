// web/lib/llm.ts — OpenAI(ChatGPT) Chat Completions 호출 헬퍼 (서버 전용)
//
// 키(OPENAI_API_KEY) 없으면 null → 호출부가 폴백(드롭다운/템플릿/기본문구)으로 동작.
// 모델은 OPENAI_MODEL 로 교체 (기본 gpt-4.1-mini). gpt-5.x / o-시리즈는 파라미터가 달라
// 자동 대응(max_completion_tokens, temperature 미지정).

const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// gpt-5 계열·o 시리즈는 max_tokens 대신 max_completion_tokens, 커스텀 temperature 미지원.
const isNewGen = /^(gpt-5|o\d)/.test(MODEL);

export async function openaiChat(opts: {
  system: string;
  user: string;
  json?: boolean; // response_format json_object 강제
  maxTokens?: number;
  temperature?: number; // 추출/충실도 중요한 경우 0 권장 (newgen 모델은 무시됨)
}): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
  };
  if (isNewGen) {
    body.max_completion_tokens = opts.maxTokens ?? 300;
  } else {
    body.max_tokens = opts.maxTokens ?? 300;
    body.temperature = opts.temperature ?? 0.3;
  }
  if (opts.json) body.response_format = { type: 'json_object' };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? '';
    return text.trim() || null;
  } catch {
    return null;
  }
}
