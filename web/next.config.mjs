import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';

/** @type {(phase: string) => import('next').NextConfig} */
export default (phase) => ({
  // build 는 .next-build, dev 는 .next 로 분리 → 동시 사용 시 충돌 없음.
  distDir: phase === PHASE_PRODUCTION_BUILD ? '.next-build' : '.next',
});
