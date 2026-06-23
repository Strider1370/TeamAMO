import type { MetadataRoute } from 'next';

// PWA 매니페스트 — 폰 크롬 "홈 화면에 추가" 시 앱처럼(아이콘·전체화면·스플래시).
// 주제에 맞게 name/short_name/색만 교체. 아이콘은 web/public/icon-{192,512}.png.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '공공 서비스 스타터',
    short_name: '공공서비스',
    description: '한국 공공 서비스 해커톤 스타터',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#256ef4',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
