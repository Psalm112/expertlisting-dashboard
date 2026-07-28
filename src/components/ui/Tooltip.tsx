'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { hoverPanel, POP } from '@/lib/motion';
import { useHoverOpen } from '@/lib/use-hover-open';
import { cn } from '@/lib/cn';

/** The dark label the prototype shows under each masthead icon on hover. */
export function Tooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const { open, triggerProps } = useHoverOpen();

  return (
    <span className={cn('relative inline-flex', className)} {...triggerProps}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            variants={hoverPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={POP}
            style={{ x: '-50%' }}
            className={cn(
              'pointer-events-none absolute top-full left-1/2 z-50 mt-2.5 origin-top',
              'rounded-control bg-surface-invert px-3.5 py-2 text-sm whitespace-nowrap text-white shadow-lg',
            )}
          >
            {/* Caret. A rotated square is cheaper than a second SVG. */}
            <span
              aria-hidden
              className="bg-surface-invert absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px]"
            />
            <span className="relative">{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
