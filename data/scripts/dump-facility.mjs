// data/scripts/dump-facility.mjs — 전국사회복지시설 기본정보 전수 덤프 (XML→JSON).
// 데이터셋: 전국사회복지시설표준데이터(15096296), 서비스 sclWlfrFcltInfoInqirService1 / getFcltByBassInfoInqire
// 키: web/.env.local 의 DATA_GO_KR_KEY (raw 로 전달 — encode 금지). 실행: node data/scripts/dump-facility.mjs
// 주의: 이 API는 시설명·주소·전화·종류코드만 제공(위도/경도 없음). 지도 거리정렬은 별도 지오코딩 필요.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'snapshots', 'facilities.json');
const BASE = 'http://apis.data.go.kr/B554287/sclWlfrFcltInfoInqirService1/getFcltByBassInfoInqire';

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

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
};
// 주소 앞부분에서 시도/시군구 추출(필터용)
const sidoOf = (addr) => (addr.split(/\s+/)[0] || '');
const sgguOf = (addr) => (addr.split(/\s+/)[1] || '');

function toFacility(it) {
  const addr = pick(it, 'fcltAddr');
  return {
    id: pick(it, 'srvInstId') || pick(it, 'fcltNm'),
    name: pick(it, 'fcltNm'),
    typeCode: pick(it, 'fcltKindCd'),
    corp: pick(it, 'cprNm') || undefined,
    address: addr,
    sido: sidoOf(addr),
    sigungu: sgguOf(addr),
    zip: pick(it, 'fcltZipcd') || undefined,
    phone: pick(it, 'fcltTelNo') || undefined,
    sggCode: pick(it, 'jrsdSggCd') || undefined,
    lat: undefined, // 이 API 미제공 — 필요 시 주소 지오코딩
    lng: undefined,
    sourceName: '전국사회복지시설표준데이터',
    sourceUrl: 'https://www.data.go.kr/data/15096296/standard.do',
    asOf: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const KEY = loadKey();
  if (!KEY) { console.error('DATA_GO_KR_KEY 없음 — web/.env.local 에 Decoding 키를 넣으세요.'); process.exit(1); }
  const all = [];
  let total = null;
  for (let pageNo = 1; ; pageNo++) {
    const url = `${BASE}?serviceKey=${KEY}&pageNo=${pageNo}&numOfRows=1000`;
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw new Error(`HTTP ${r.status} @ page ${pageNo}`);
    const xml = await r.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    if (total === null) {
      total = Number(pick(xml, 'totalCount')) || null;
      if (total === null) throw new Error('totalCount 없음 — 응답 명세 확인(전수 보장 불가)');
    }
    for (const it of items) all.push(toFacility(it));
    console.log(`page ${pageNo}: +${items.length} (누적 ${all.length} / 총 ${total})`);
    if (!items.length || all.length >= total) break;
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(all));
  console.log(`\n전국사회복지시설 ${all.length}건 → ${OUT}`);
}
main().catch((e) => { console.error('dump-facility 실패:', e.message); process.exit(1); });
