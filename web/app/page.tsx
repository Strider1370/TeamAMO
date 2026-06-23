'use client';

import { useEffect, useState, type ChangeEvent } from 'react';

type Card = {
  id: string; name: string; agency?: string; phone?: string | null; badge: string;
  eligibility?: { summary?: string }; deadline?: { type?: string; note?: string };
  documents?: string[]; applyUrl?: string | null; prerequisiteOf: string[];
  exclusiveChoice: string[]; boosted: boolean; timeline: string;
};
type Result = { litSituations: string[]; timeline: Record<string, Card[]>; exclusivePairs: any[] };
type Signals = { situations: string[]; slots: Record<string, any>; primaryConcern: string | null; via: string };

const SIDO = ['서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도','제주특별자치도'];
const EXAMPLES = [
  '어머니가 자꾸 깜빡하시고 길을 잃으세요. 혼자 사시는데 어떻게 해야 할지 모르겠어요.',
  '아버지가 말기 암 진단을 받으셨어요. 병원비도 걱정이고 마음의 준비도 안 됐습니다.',
  '아버지가 뇌졸중으로 쓰러져 곧 퇴원하시는데 반신마비가 왔어요. 어머니 혼자 못 모시고 형편도 빠듯해요.',
];
const BUCKET_META: Record<string, { dot: string; sub: string }> = {
  '지금': { dot: '#A32D2D', sub: '가장 급함' },
  '퇴원후': { dot: '#185FA5', sub: '등급이 나오면' },
  '장기': { dot: '#888780', sub: '놓치기 쉬운 것' },
};
const C = {
  border: '0.5px solid rgba(0,0,0,0.15)', border2: '0.5px solid rgba(0,0,0,0.3)',
  sec: '#5F5E5A', ter: '#888780', info: '#185FA5', infoBg: '#E6F1FB',
  okBg: '#E1F5EE', ok: '#0F6E56', warnBg: '#FAEEDA', warn: '#854F0B', dangerBg: '#FCEBEB', danger: '#A32D2D', sub: '#f5f4ef',
};

export default function Home() {
  const [text, setText] = useState('');
  const [region, setRegion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ signals: Signals; result: Result } | null>(null);
  const [err, setErr] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => { setApiKey(localStorage.getItem('openai_key') || ''); }, []);

  // 공통 호출 — 텍스트/이미지 어느 쪽이든 같은 결과 렌더링(setData) 재사용.
  async function callMatch(payload: { text?: string; region?: string; image?: string }) {
    setLoading(true); setErr(''); setData(null); setExpanded({});
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(apiKey ? { 'x-openai-key': apiKey } : {}) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('요청 실패 (' + res.status + ')');
      setData(await res.json());
    } catch (e: any) { setErr(e.message || '오류'); }
    finally { setLoading(false); }
  }

  async function run() {
    if (!text.trim()) return;
    await callMatch({ text, region });
  }

  // 📷 서류 사진 → dataURL → /api/match {image}. 기존 결과 렌더링 그대로 재사용.
  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // 같은 파일 재선택 허용
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => setErr('사진을 읽지 못했어요. 다시 시도해 주세요.');
    reader.onload = () => { void callMatch({ image: String(reader.result), region }); };
    reader.readAsDataURL(file);
  }

  const slotChips = data ? slotsToChips(data.signals) : [];
  const total = data ? Object.values(data.result.timeline).reduce((n, a) => n + a.length, 0) : 0;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px', fontFamily: 'system-ui, -apple-system, "Malgun Gothic", sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 17 }}>곁에</span>
          <span style={{ fontSize: 12, color: C.ter }}>가족 돌봄 길잡이</span>
        </div>
        <button onClick={() => setModal(true)} style={btn(32)} aria-label="설정">⚙</button>
      </div>

      <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, margin: '6px 0 4px' }}>부모님이 갑자기 아프시면,<br />누구나 처음입니다.</p>
      <p style={{ fontSize: 13, color: C.sec, margin: '0 0 14px' }}>무엇부터 해야 할지 막막한 그 순간 — 상황을 편하게 적어주세요.</p>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="예) 아버지가 뇌졸중으로 입원하셨다가 곧 퇴원하시는데…"
        style={{ width: '100%', fontSize: 14, lineHeight: 1.6, padding: 10, border: C.border2, borderRadius: 8, resize: 'none', boxSizing: 'border-box' }} />

      <div style={{ margin: '10px 0' }}>
        <span style={{ fontSize: 11, color: C.ter }}>예시로 채우기</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {['치매 의심·독거', '말기 진단', '뇌졸중 퇴원'].map((label, i) => (
            <button key={i} onClick={() => setText(EXAMPLES[i])} style={chip()}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 2px' }}>
        <span style={{ flex: 1, height: 0.5, background: 'rgba(0,0,0,0.12)' }} />
        <span style={{ fontSize: 11, color: C.ter }}>또는</span>
        <span style={{ flex: 1, height: 0.5, background: 'rgba(0,0,0,0.12)' }} />
      </div>
      <label style={{ display: 'block', margin: '8px 0 10px' }}>
        <input type="file" accept="image/*" capture="environment" onChange={onPhoto} disabled={loading} style={{ display: 'none' }} />
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, fontSize: 14, color: C.sec, border: C.border2, borderRadius: 8, cursor: loading ? 'default' : 'pointer', background: '#f5f4ef' }}>
          📷 서류 사진으로 (진단서·영수증)
        </span>
      </label>

      <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: '100%', margin: '6px 0 12px', padding: 8, border: C.border2, borderRadius: 8 }}>
        <option value="">지역 선택 (선택사항)</option>
        {SIDO.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <button onClick={run} disabled={loading || !text.trim()} style={cta()}>
        {loading ? '상황을 이해하는 중…' : '✦ 오늘 할 일로 정리해줘'}
      </button>

      {err && <p style={{ color: C.danger, fontSize: 13, marginTop: 12 }}>{err}</p>}

      {data && (
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 500, margin: '0 0 4px' }}>오늘 할 일 {total}가지를 찾았어요</p>
          <p style={{ fontSize: 12, color: C.sec, margin: '0 0 8px' }}>
            AI가 읽은 내용 (확인해 주세요){data.signals.via === 'keyword' ? ' · 키워드 모드' : ''}. 자격은 <b style={{ fontWeight: 500 }}>받을 가능성</b>이며 공식 링크로 꼭 확인하세요.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            {slotChips.map((c, i) => <span key={i} style={chip(true)}>{c}</span>)}
          </div>

          {['지금', '퇴원후', '장기'].map((b) => {
            const cards = data.result.timeline[b] || [];
            if (!cards.length) return null;
            const open = expanded[b];
            const core = cards.filter((c) => c.boosted || cards.indexOf(c) < 4);
            const shown = open ? cards : cards.filter((c) => c.core);
            const meta = BUCKET_META[b];
            return (
              <div key={b}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 10px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: meta.dot }} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{b === '퇴원후' ? '퇴원 후' : b}</span>
                  <span style={{ fontSize: 11, color: C.ter }}>{meta.sub}</span>
                </div>
                {shown.map((c) => <ProgramCard key={c.id} c={c} />)}
                {cards.length > shown.length && (
                  <button onClick={() => setExpanded((e) => ({ ...e, [b]: true }))} style={{ ...btn(0), width: '100%', padding: '8px', fontSize: 12, color: C.sec }}>
                    + {cards.length - shown.length}개 더 보기
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div onClick={() => setModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 10 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 20, maxWidth: 360, width: '100%' }}>
            <p style={{ fontWeight: 500, margin: '0 0 6px' }}>OpenAI API 키 (선택)</p>
            <p style={{ fontSize: 12, color: C.sec, margin: '0 0 10px' }}>키는 이 브라우저에만 저장되며 서버·저장소에 기록되지 않습니다. 비워두면 서버 키 또는 키워드 모드로 동작합니다.</p>
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." type="password"
              style={{ width: '100%', padding: 8, border: C.border2, borderRadius: 8, boxSizing: 'border-box', fontSize: 13 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => { localStorage.setItem('openai_key', apiKey); setModal(false); }} style={{ ...cta(), height: 38, fontSize: 13 }}>저장</button>
              <button onClick={() => { localStorage.removeItem('openai_key'); setApiKey(''); setModal(false); }} style={{ ...btn(0), padding: '0 14px', fontSize: 13 }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgramCard({ c }: { c: Card }) {
  const badgeStyle = c.badge === '받을 가능성'
    ? { background: C.okBg, color: C.ok } : { background: C.warnBg, color: C.warn };
  return (
    <div style={{ border: C.border, borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</span>
        <span style={{ ...badgeStyle, fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 8, whiteSpace: 'nowrap' }}>{c.badge}</span>
      </div>
      {c.eligibility?.summary && <p style={{ fontSize: 12.5, color: C.sec, margin: '7px 0 0' }}>{c.eligibility.summary}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 7 }}>
        {c.prerequisiteOf.length > 0 && <Tag bg={C.infoBg} fg={C.info}>이게 되면 → {c.prerequisiteOf.length}개 열림</Tag>}
        {c.exclusiveChoice.length > 0 && <Tag bg={C.sub} fg={C.sec}>택일</Tag>}
        {c.deadline?.type === '사건상대기한' && c.deadline?.note && <Tag bg={C.dangerBg} fg={C.danger}>기한 주의</Tag>}
      </div>
      <div style={{ fontSize: 12, color: C.sec, marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {c.agency && <span>{c.agency}</span>}
        {c.phone && <a href={`tel:${c.phone}`} style={{ color: C.info, textDecoration: 'none' }}>☎ {c.phone}</a>}
        {c.applyUrl && <a href={c.applyUrl} target="_blank" rel="noreferrer" style={{ color: C.info, textDecoration: 'none' }}>공식 안내 ↗</a>}
      </div>
      {c.documents && c.documents.length > 0 && <p style={{ fontSize: 11.5, color: C.ter, margin: '7px 0 0' }}>서류: {c.documents.join(' · ')}</p>}
    </div>
  );
}

const Tag = ({ children, bg, fg }: any) => <span style={{ background: bg, color: fg, fontSize: 11, padding: '3px 8px', borderRadius: 8 }}>{children}</span>;
const btn = (sz: number) => ({ width: sz || undefined, height: sz || undefined, padding: sz ? 0 : '6px 10px', border: '0.5px solid rgba(0,0,0,0.3)', background: 'transparent', borderRadius: 8, cursor: 'pointer', fontSize: 15 } as const);
const chip = (active = false) => ({ fontSize: 12, padding: '5px 10px', borderRadius: 999, border: '0.5px solid rgba(0,0,0,0.3)', background: active ? '#E6F1FB' : '#f5f4ef', color: active ? '#185FA5' : '#5F5E5A', cursor: 'pointer' } as const);
const cta = () => ({ width: '100%', height: 44, fontSize: 15, fontWeight: 500, border: '2px solid #378ADD', color: '#185FA5', background: 'transparent', borderRadius: 8, cursor: 'pointer' } as const);

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
