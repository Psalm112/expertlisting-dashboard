'use client';

import { m } from 'framer-motion';
import type { ComponentProps } from 'react';
import { SPRING } from '@/lib/motion';
import { cn } from '@/lib/cn';

/** Outlined pill action, as on "View Transactions" in the sales card header. */
export function PillButton({ className, children, ...props }: ComponentProps<typeof m.button>) {
  return (
    <m.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      className={cn(
        'inline-flex h-[46px] items-center justify-center rounded-full px-6',
        'border-line-strong bg-surface text-ink-strong border text-xs font-medium',
        'hover:border-ink-faint hover:bg-surface-sunken transition-colors duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </m.button>
  );
}
