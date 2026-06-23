import fs from 'fs';
import { keywordExtract } from '../web/lib/extract.mjs';
const dict = JSON.parse(fs.readFileSync(new URL('../data/questionnaire/slot-dictionary.json', import.meta.url), 'utf8'));
const text = '아버지가 뇌졸중으로 쓰러져 곧 퇴원하시는데 반신마비가 왔어요. 어머니 혼자 못 모시고 형편도 빠듯해요.';
console.log('dict entries:', dict.entries?.length);
console.log('keywordExtract:', JSON.stringify(keywordExtract(text, dict)));
// 직접 매칭 점검
const hit = dict.entries.filter((e) => e.synonyms.some((s) => text.includes(s)));
console.log('매칭된 entries 수:', hit.length);
console.log('매칭 emits:', hit.map((e) => JSON.stringify(e.emits)).join(' | '));
