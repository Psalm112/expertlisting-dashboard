'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** `reducedMotion="user"` makes every Framer animation honour the OS setting. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
