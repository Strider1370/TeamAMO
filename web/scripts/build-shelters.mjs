// 민방위 대피시설 표준 CSV → 시/도별 JSON 변환 (앱은 선택 지역 파일만 fetch)
//
// 사용법: node scripts/build-shelters.mjs <utf8-csv-path>
//   ※ 원본 CSV는 CP949 인코딩이므로 호출 전 UTF-8로 트랜스코딩해서 넘긴다.
//
// 출력: public/data/shelters/civildefense/<시도>.json  (+ _index.json)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(WEB_ROOT, 'public', 'data', 'shelters', 'civildefense');

// 시/도 명칭 정규화 (CSV 주소의 구명칭 → 앱 SIDO 표준명)
const SIDO_NORMALIZE = {
  강원도: '강원특별자치도',
  전라북도: '전북특별자치도',
};

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const csvPath = process.argv[2];
if (!csvPath) { console.error('usage: node build-shelters.mjs <utf8-csv-path>'); process.exit(1); }

const text = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(text);
const header = rows[0].map((h) => h.trim());
const col = (name) => header.indexOf(name);

const iName = col('시설명');
const iJibun = col('소재지전체주소');
const iRoad = col('도로명전체주소');
const iState = col('운영상태');
const iRelease = col('해제일자');
const iLat = col('위도(EPSG4326)');
const iLng = col('경도(EPSG4326)');
const iMng = col('관리번호');

const byeSido = new Map();
let kept = 0;

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length < header.length - 2) continue;
  if ((row[iState] || '').trim() !== '사용중') continue;
  if ((row[iRelease] || '').trim() !== '') continue;
  const lat = Number(row[iLat]);
  const lng = Number(row[iLng]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
  if (lat < 33 || lat > 39 || lng < 124 || lng > 132) continue;

  const jibun = (row[iJibun] || '').trim();
  const parts = jibun.split(/\s+/);
  let sido = parts[0] || '';
  sido = SIDO_NORMALIZE[sido] || sido;
  const sigungu = parts[1] || '';
  if (!sido) continue;

  const item = {
    id: (row[iMng] || `cd-${r}`).trim(),
    type: 'civildefense',
    name: (row[iName] || '민방위 대피시설').trim(),
    address: ((row[iRoad] || '').trim() || jibun),
    sido,
    sigungu,
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
  };
  if (!byeSido.has(sido)) byeSido.set(sido, []);
  byeSido.get(sido).push(item);
  kept++;
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const index = {};
for (const [sido, list] of byeSido) {
  fs.writeFileSync(path.join(OUT_DIR, `${sido}.json`), JSON.stringify(list));
  index[sido] = list.length;
}
fs.writeFileSync(path.join(OUT_DIR, '_index.json'), JSON.stringify(index, null, 2));

console.log(`민방위 대피시설: ${kept}곳 / ${byeSido.size}개 시도`);
console.log(JSON.stringify(index, null, 2));
