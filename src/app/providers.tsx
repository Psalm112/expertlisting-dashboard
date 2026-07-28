'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Framer's feature set is loaded on demand rather than bundled with the shell,
 * which keeps roughly 45 KB gzipped off the critical path. `domMax` is the bundle
 * that includes layout animations, which the sliding nav and segmented pills need.
 *
 * Nothing on the page depends on Framer to become visible, so the page is fully
 * readable before this chunk arrives. `strict` makes that guarantee enforceable:
 * it throws on `motion.*`, so every component has to use the lightweight `m.*`.
 */
const loadFeatures = () => import('framer-motion').then((mod) => mod.domMax);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
