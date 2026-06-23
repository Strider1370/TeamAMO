import Image from 'next/image';
import { Display, Body, Badge } from '@krds-ui/core';

// ─────────────────────────────────────────────────────────────
// 빈 스캐폴드 홈. 주제가 정해지면 이 파일을 새로 짜라.
// 폼·지도 등 부품은 기본 포함돼 있지 않다 — 필요하면 그때 추가(말로 요청하면 금방).
// 배너는 기본 이미지(/hero-banner.png). 주제 맞춤으로 바꾸려면: npm run generate-banner -- --topic "<주제>"
// ─────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary-5">
        <Image src="/hero-banner.png" alt="" aria-hidden fill priority unoptimized className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-5 via-primary-5/85 to-primary-5/20" />
        <div className="relative mx-auto max-w-container px-4 py-12 md:py-16">
          <Badge label="KRDS 스타터 키트" variant="primary" size="small" />
          <Display size="s" color="gray-90" className="mt-3 !text-heading-l md:!text-display-s">
            한국 공공 서비스 해커톤 스타터
          </Display>
          <Body size="l" color="gray-70" className="mt-3 max-w-xl">
            Next.js + KRDS 가 셋업된 빈 스캐폴드입니다. 새 주제를 받으면 이 화면부터 새로 만드세요.
          </Body>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 py-12">
        <div className="rounded-krds border border-dashed border-gray-30 bg-gray-5 px-4 py-6">
          <Body size="m" color="gray-70">
            여기에 주제 화면을 만드세요. 입력 폼·지도·결과 카드 같은 부품은 필요할 때 추가하면 됩니다.
          </Body>
        </div>
      </section>
    </>
  );
}
