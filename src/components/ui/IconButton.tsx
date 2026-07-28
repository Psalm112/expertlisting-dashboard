'use client';

import { motion } from 'framer-motion';
import type { ComponentProps, ReactNode } from 'react';
import { SPRING } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Props = {
  /** Required, since these render without a visible label. */
  label: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof motion.button>, 'children'>;

/**
 * Icon-only button with a consistent press response. Sizing is left to the
 * caller so the same component covers the masthead, cards and overlays.
 */
export function IconButton({ label, children, className, ...props }: Props) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.08 }}
      transition={SPRING}
      className={cn('grid place-items-center rounded-full', className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
