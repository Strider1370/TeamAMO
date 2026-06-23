import fs from 'fs';
const dir = 'data/welfare/curated';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const STD = ['노년진입','입원','퇴원ADL','노쇠치매','가족환경','경제주거','말기임종','장애등록','권리안전','돌봄자지원'];
const filled = o => Object.values(o).filter(v => v!==null && v!=='' && !(Array.isArray(v)&&v.length===0)).length;
let all = [];
for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
  arr.forEach(o => { o._src = f; all.push(o); });
}
const merges = [];
const byId = {};
for (const o of all) {
  o.domain = 'parent';
  if (o.sequence && o.sequence.exclusiveWith) {
    o.exclusiveWith = [...new Set([...(o.exclusiveWith||[]), ...o.sequence.exclusiveWith])];
    delete o.sequence.exclusiveWith;
  }
  if (!byId[o.id]) { byId[o.id] = o; }
  else {
    const a = byId[o.id], b = o;
    const keep = filled(b) > filled(a) ? b : a;
    keep.situations = [...new Set([...(a.situations||[]), ...(b.situations||[])])];
    keep.exclusiveWith = [...new Set([...(a.exclusiveWith||[]), ...(b.exclusiveWith||[])])];
    merges.push(`${o.id}: ${a._src} + ${b._src} → kept ${keep._src}, situations=${keep.situations.join('/')}`);
    byId[o.id] = keep;
  }
}
let merged = Object.values(byId);
merged.forEach(o => delete o._src);
const ids = new Set(merged.map(o => o.id));
const dangling = [], badSit = [], conf = {};
let region = 0;
for (const o of merged) {
  (o.sequence?.prerequisiteOf||[]).forEach(r => { if(!ids.has(r)) dangling.push(`${o.id} -prereq→ ${r}`); });
  (o.exclusiveWith||[]).forEach(r => { if(!ids.has(r)) dangling.push(`${o.id} -excl→ ${r}`); });
  (o.situations||[]).forEach(s => { if(!STD.includes(s)) badSit.push(`${o.id}:${s}`); });
  const c = o.eligibility?.confidence || '?'; conf[c] = (conf[c]||0)+1;
  if (o.regionVaries) region++;
}
fs.writeFileSync('data/welfare/curated-benefits.json', JSON.stringify(merged, null, 2));
const md = `# curated-benefits 병합·검증 (VALIDATION)

- 원본 10파일 합계: **${all.length}제도** → dedup 후 **${merged.length}제도**
- domain: parent ${merged.length}
- confidence 분포: ${Object.entries(conf).map(([k,v])=>`${k} ${v}`).join(' · ')}
- regionVaries(지역상이): ${region}
- 중복 병합: ${merges.length}건
${merges.map(m=>`  - ${m}`).join('\n')}
- dangling 참조(없는 id): ${dangling.length}건
${dangling.map(d=>`  - ${d}`).join('\n') || '  - 없음'}
- 비표준 situation 키: ${badSit.length}건
${badSit.map(b=>`  - ${b}`).join('\n') || '  - 없음'}

> 생성: data/welfare/merge.mjs (결정론적). 링크 라이브 점검은 별도 검토 에이전트가 수행.
`;
fs.writeFileSync('data/welfare/VALIDATION.md', md);
console.log(`원본 ${all.length} → 병합 ${merged.length} | confidence ${JSON.stringify(conf)} | 중복 ${merges.length} | dangling ${dangling.length} | badSit ${badSit.length}`);
console.log('중복 처리:'); merges.forEach(m=>console.log('  '+m));
if(dangling.length) { console.log('DANGLING:'); dangling.forEach(d=>console.log('  '+d)); }
