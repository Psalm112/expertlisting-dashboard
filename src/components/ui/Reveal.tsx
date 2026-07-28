'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_OUT, riseIn } from '@/lib/motion';

/**
 * Fades a section up on first paint. `className` passes straight through so this
 * can be the grid item itself rather than adding a wrapper that breaks layout.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={riseIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.42, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
