import Image from 'next/image';
import { Label, Body, Detail } from '@krds-ui/core';

// 범용 푸터 스켈레톤 — 서비스명/문구만 교체하세요.
export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-10 bg-gray-5">
      <div className="mx-auto max-w-container px-4 py-10">
        <Image
          src="/gov/gov-emblem-horizontal.svg"
          alt="대한민국정부"
          width={120}
          height={30}
          className="h-6 w-auto"
          unoptimized
        />
        <Label size="m" color="gray-90" className="mt-4 block">
          공공 서비스 스타터
        </Label>
        <Detail size="s" color="gray-50" className="mt-4 block">
          KRDS(대한민국 디지털정부 디자인시스템) 기반 해커톤 프로토타입입니다.
          데이터 출처는 사용한 공공데이터에 맞게 표기하세요.
        </Detail>
      </div>
    </footer>
  );
}
