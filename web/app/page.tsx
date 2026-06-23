'use client';

import { useState } from 'react';

type Card = {
  id: string; name: string; agency?: string; phone?: string | null; badge: string;
  eligibility?: { summary?: string }; deadline?: { type?: string; note?: string };
  documents?: string[]; applyUrl?: string | null; prerequisiteOf: string[];
  exclusiveChoice: string[]; boosted: boolean; core?: boolean; timeline: string;
};
type Result = { litSituations: string[]; timeline: Record<string, Card[]>; exclusivePairs: any[]; rankedBy?: string };
type Signals = { situations: string[]; slots: Record<string, any>; primaryConcern: string | null; via: string };

const SIDO = ['서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도','제주특별자치도'];
const EXAMPLES = [
  { label: '치매 의심·독거', text: '어머니가 자꾸 깜빡하시고 길을 잃으세요. 혼자 사시는데 어떻게 해야 할지 모르겠어요.' },
  { label: '말기 진단', text: '아버지가 말기 암 진단을 받으셨어요. 병원비도 걱정이고 마음의 준비도 안 됐습니다.' },
  { label: '뇌졸중 퇴원', text: '아버지가 뇌졸중으로 쓰러져 곧 퇴원하시는데 반신마비가 왔어요. 어머니 혼자 못 모시고 형편도 빠듯해요.' },
];
const BUCKETS = [
  { key: '지금', label: '지금', sub: '가장 급함', dot: 'bg-danger' },
  { key: '퇴원후', label: '퇴원 후', sub: '등급이 나오면', dot: 'bg-info' },
  { key: '장기', label: '장기', sub: '놓치기 쉬운 것', dot: 'bg-gray-50' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ signals: Signals; result: Result } | null>(null);
  const [err, setErr] = useState('');

  async function submit() {
    if (!text.trim() || loading) return;
    setLoading(true); setErr(''); setData(null);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, region }),
      });
      if (!res.ok) throw new Error('요청에 실패했어요 (' + res.status + ')');
      setData(await res.json());
    } catch (e: any) { setErr(e.message || '오류가 발생했어요'); }
    finally { setLoading(false); }
  }

  return (
    <main>
      {/* 상단 히어로 — 색 띠로 감싼 영역 */}
      <section className="bg-primary-5">
        <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
          <span className="inline-block rounded-krds bg-white px-3 py-1 text-label-s font-bold text-primary">
            가족 복지·돌봄 내비게이터
          </span>
          <h1 className="mt-3 break-keep text-display-s font-bold text-gray-90 md:text-display-m">첫걸음</h1>
          <p className="mt-2.5 break-keep text-body-m text-gray-70 md:text-body-l">
            누구나 맞이하는 처음을 위한, 당신에게 드리는 정책 가이드 플랫폼
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 pb-20">
        {/* 입력 카드 */}
        <section className="mt-6 rounded-krds-lg border border-gray-20 bg-white p-4 shadow-sm md:p-5">
          <label htmlFor="situation" className="block text-label-m font-bold text-gray-80">어떤 상황이신가요?</label>
          <textarea
            id="situation" value={text} onChange={(e) => setText(e.target.value)} rows={4}
            placeholder="예) 아버지가 뇌졸중으로 입원하셨다가 곧 퇴원하시는데, 어머니 혼자 못 모시고 형편도 빠듯해요…"
            className="mt-2 w-full resize-none rounded-krds border border-gray-30 bg-white p-3 text-body-m text-gray-90 placeholder:text-gray-50 focus:border-primary focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button key={ex.label} onClick={() => setText(ex.text)}
                className="rounded-full border border-gray-30 bg-gray-5 px-3 py-1.5 text-label-s text-gray-70 hover:bg-gray-10">
                {ex.label}
              </button>
            ))}
          </div>

          <select value={region} onChange={(e) => setRegion(e.target.value)}
            className="mt-3 w-full rounded-krds border border-gray-30 bg-white px-3 py-2.5 text-body-s text-gray-80">
            <option value="">지역 선택 (선택사항)</option>
            {SIDO.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <button onClick={submit} disabled={loading || !text.trim()}
            className="mt-3 h-12 w-full rounded-krds bg-primary text-title-s font-bold text-white transition-colors hover:bg-primary-60 disabled:bg-gray-30 disabled:text-gray-50">
            {loading ? '상황을 이해하는 중…' : '오늘 할 일로 정리해 드릴게요'}
          </button>
        </section>

        {err && (
          <p className="mt-4 rounded-krds border border-danger-20 bg-danger-5 px-4 py-3 text-body-s text-danger-60">{err}</p>
        )}

        {/* 결과 */}
        {data && (
          <section className="mt-7" aria-live="polite">
            <h2 className="text-heading-s font-bold text-gray-90">오늘 할 일을 정리했어요</h2>
            <p className="mt-1 break-keep text-body-s text-gray-60">
              관련도·시급도 높은 순. 자격은 <b className="font-bold text-gray-80">받을 가능성</b>이며 공식 링크로 꼭 확인하세요.
              {data.signals.via === 'keyword' ? ' (키워드 모드)' : ''}
            </p>

            <div className="mt-3 rounded-krds-lg border border-primary-10 bg-primary-5 p-3">
              <p className="text-detail-m font-bold text-primary">AI가 읽은 내용 — 맞는지 확인해 주세요</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {slotsToChips(data.signals).map((c, i) => (
                  <span key={i} className="rounded-full bg-white px-2.5 py-1 text-label-s font-medium text-primary ring-1 ring-primary-10">{c}</span>
                ))}
              </div>
            </div>

            {BUCKETS.map((bk) => {
              const cards = data.result.timeline[bk.key] || [];
              if (!cards.length) return null;
              return (
                <div key={bk.key} className="mt-6">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${bk.dot}`} />
                    <h3 className="text-title-s font-bold text-gray-90">{bk.label}</h3>
                    <span className="text-detail-s text-gray-50">{bk.sub}</span>
                  </div>
                  <div className="mt-2.5 space-y-2.5">
                    {cards.map((c) => <ProgramCard key={c.id} c={c} />)}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function ProgramCard({ c }: { c: Card }) {
  const ok = c.badge === '받을 가능성';
  return (
    <article className="rounded-krds-lg border border-gray-20 bg-white p-4">
      <div className="flex items-start justify-between gap-2.5">
        <h4 className="break-keep text-body-m font-bold text-gray-90">{c.name}</h4>
        <span className={`flex-none rounded-krds px-2 py-1 text-detail-s font-bold ${ok ? 'bg-success-5 text-success-60' : 'bg-warning-5 text-warning-70'}`}>
          {c.badge}
        </span>
      </div>
      {c.eligibility?.summary && <p className="mt-2 break-keep text-body-s text-gray-70">{c.eligibility.summary}</p>}

      {(c.prerequisiteOf.length > 0 || c.exclusiveChoice.length > 0 || (c.deadline?.type === '사건상대기한' && c.deadline?.note)) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.prerequisiteOf.length > 0 && (
            <span className="rounded-krds bg-info-5 px-2 py-1 text-detail-s font-medium text-info-60">이게 되면 → {c.prerequisiteOf.length}개 열림</span>
          )}
          {c.exclusiveChoice.length > 0 && (
            <span className="rounded-krds bg-gray-10 px-2 py-1 text-detail-s font-medium text-gray-60">택일</span>
          )}
          {c.deadline?.type === '사건상대기한' && c.deadline?.note && (
            <span className="rounded-krds bg-danger-5 px-2 py-1 text-detail-s font-medium text-danger-60">기한 주의</span>
          )}
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-detail-m text-gray-60">
        {c.agency && <span>{c.agency}</span>}
        {c.phone && <a href={`tel:${c.phone}`} className="font-medium text-primary">☎ {c.phone}</a>}
        {c.applyUrl && <a href={c.applyUrl} target="_blank" rel="noreferrer" className="font-medium text-primary">공식 안내 ↗</a>}
      </div>
      {c.documents && c.documents.length > 0 && (
        <p className="mt-2 text-detail-s text-gray-50">서류: {c.documents.join(' · ')}</p>
      )}
    </article>
  );
}

function slotsToChips(sig: Signals): string[] {
  const s = sig.slots || {};
  const out: string[] = [];
  const label: Record<string, string> = { 부: '아버지', 모: '어머니', 본인: '본인', 배우자: '배우자' };
  if (s.target) out.push(label[s.target] || s.target);
  for (const axis of ['condition', 'adl', 'household', 'incomeBand', 'lifeEvent', 'caregiver', 'permanentDisability']) {
    const v = s[axis]; if (!v) continue;
    (Array.isArray(v) ? v : [v]).forEach((x) => out.push(String(x)));
  }
  if (s.region) out.push(String(s.region));
  if (sig.primaryConcern) out.push('걱정: ' + sig.primaryConcern);
  return out;
}
