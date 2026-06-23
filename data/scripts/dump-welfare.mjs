// data/scripts/dump-welfare.mjs — 중앙부처·지자체 복지서비스 전수 덤프 (XML→JSON).
// 엔드포인트(검증): 중앙부처 15090532, 지자체 15108347. 활용신청 승인 필요.
// 키: web/.env.local 의 DATA_GO_KR_KEY (URL Decoding 키). 실행: node data/scripts/dump-welfare.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP = join(HERE, '..', 'snapshots');

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

const pick = (xml, tag) => { const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)); return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : ''; };

async function dump(KEY, name, base, outName) {
  const all = [];
  let total = null;
  for (let pageNo = 1; ; pageNo++) {
    const r = await fetch(`${base}?serviceKey=${KEY}&callTp=L&pageNo=${pageNo}&numOfRows=500&srchKeyCode=001`);
    if (!r.ok) throw new Error(`${name} HTTP ${r.status} @ page ${pageNo}`);
    const xml = await r.text();
    const items = xml.match(/<servList>[\s\S]*?<\/servList>/g) || [];
    for (const it of items) all.push({
      servId: pick(it, 'servId'), servNm: pick(it, 'servNm'), servDgst: pick(it, 'servDgst'),
      jurMnofNm: pick(it, 'jurMnofNm'), jurOrgNm: pick(it, 'jurOrgNm'),
      ctpvNm: pick(it, 'ctpvNm'), sgguNm: pick(it, 'sgguNm'),
      servDtlLink: pick(it, 'servDtlLink'), aplyMtdNm: pick(it, 'aplyMtdNm'),
      lifeArray: pick(it, 'lifeArray'), trgterIndvdlArray: pick(it, 'trgterIndvdlArray'),
      intrsThemaArray: pick(it, 'intrsThemaArray'),
    });
    if (total === null) total = Number(pick(xml, 'totalCount')) || 0;
    console.log(`${name} page ${pageNo}: +${items.length} (누적 ${all.length} / 총 ${total})`);
    if (!items.length || all.length >= total) break;
  }
  mkdirSync(SNAP, { recursive: true });
  const out = join(SNAP, outName);
  writeFileSync(out, JSON.stringify(all));
  console.log(`${name} ${all.length}건 → ${out}`);
}

async function main() {
  const KEY = loadKey();
  if (!KEY) { console.error('DATA_GO_KR_KEY 없음 — web/.env.local 에 Decoding 키를 넣으세요.'); process.exit(1); }
  await dump(KEY, '중앙부처복지', 'https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001', 'welfare-central.json');
  await dump(KEY, '지자체복지', 'https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist', 'welfare-local.json');
}
main().catch((e) => { console.error('dump-welfare 실패:', e.message); process.exit(1); });
