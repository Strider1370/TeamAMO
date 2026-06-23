import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';

/** @type {(phase: string) => import('next').NextConfig} */
export default (phase) => ({
  // build 는 .next-build, dev 는 .next 로 분리 → 동시 사용 시 충돌 없음.
  distDir: phase === PHASE_PRODUCTION_BUILD ? '.next-build' : '.next',
  // 공유 .mjs(엔진/추출) 모듈은 타입 선언이 없다 — 런타임은 검증됨. 배포 빌드가 타입/lint로 막히지 않게.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
});
