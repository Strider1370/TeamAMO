import type { CapacitorConfig } from '@capacitor/cli';

// WebView 래퍼 — 화면은 배포 https 서버에서 실시간 로드(server.url).
// JS/CSS만 바꾸면 재빌드 불필요(서버 배포만으로 폰 앱이 최신 반영).
const config: CapacitorConfig = {
  appId: 'kr.projectamo.firststep',
  appName: '첫걸음',
  webDir: 'capacitor-www', // server.url 사용 → 자리표시 폴더(index.html 한 장)
  server: { url: 'https://projectamo.co.kr' }, // https라 cleartext 불필요
};

export default config;
