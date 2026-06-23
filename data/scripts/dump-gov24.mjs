// data/scripts/dump-gov24.mjs — 보조금24 공공서비스(혜택) 전수 덤프 (JSON).
// 엔드포인트(검증): https://api.odcloud.kr/api/gov24/v3/serviceList  (ID 15113968, 약 10,957건)
// 키: web/.env.local 의 DATA_GO_KR_KEY (URL Decoding 키, 커밋 금지). 실행: node data/scripts/dump-gov24.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'snapshots', 'gov24-services.json');

function loadKey() {
  if (process.env.DATA_GO_KR_KEY) return process.env.DATA_GO_KR_KEY;
  const envPath = join(HERE, '..', '..', 'web', '.env.local');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*DATA_GO_KR_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

const BASE = 'https://api.odcloud.kr/api/gov24/v3/serviceList';

async function main() {
  const KEY = loadKey();
  if (!KEY) { console.error('DATA_GO_KR_KEY 없음 — web/.env.local 에 Decoding 키를 넣으세요.'); process.exit(1); }
  const all = [];
  let total = null;
  for (let page = 1; ; page++) {
    const r = await fetch(`${BASE}?page=${page}&perPage=1000&serviceKey=${KEY}`);
    if (!r.ok) throw new Error(`HTTP ${r.status} @ page ${page}`);
    const j = await r.json();
    const rows = j.data || [];
    if (total === null) {
      total = j.totalCount ?? null;
      if (total === null) throw new Error('totalCount 없음 — 응답 명세 확인(전수 보장 불가)');
    }
    all.push(...rows);
    console.log(`page ${page}: +${rows.length} (누적 ${all.length} / 총 ${total})`);
    if (!rows.length || all.length >= total) break;
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(all));
  console.log(`보조금24 ${all.length}건 → ${OUT}`);
}
main().catch((e) => { console.error('dump-gov24 실패:', e.message); process.exit(1); });
