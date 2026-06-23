// APK 다운로드 URL QR 생성. 실행: node scripts/gen-qr.mjs
import QRCode from 'qrcode';
const url = 'https://projectamo.co.kr/firststep.apk';
const opts = { width: 720, margin: 2, color: { dark: '#1D1D1D', light: '#FFFFFF' }, errorCorrectionLevel: 'M' };
await QRCode.toFile(new URL('../dist/firststep-qr.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), url, opts);
await QRCode.toFile(new URL('../dist/firststep-qr.svg', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), url, { ...opts, type: 'svg' });
console.log('QR 생성: dist/firststep-qr.png, dist/firststep-qr.svg');
console.log('대상 URL:', url);
console.log('\n터미널 미리보기:');
console.log(await QRCode.toString(url, { type: 'terminal', small: true }));
