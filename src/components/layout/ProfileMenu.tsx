'use client';

import { AnimatePresence, m } from 'framer-motion';
import { hoverPanel, POP, SPRING } from '@/lib/motion';
import { useHoverOpen } from '@/lib/use-hover-open';
import { CURRENT_USER } from '@/lib/mock-data';

export function ProfileMenu() {
  const { open, triggerProps } = useHoverOpen();

  return (
    <div className="relative shrink-0" {...triggerProps}>
      <m.button
        type="button"
        aria-label={`Account menu for ${CURRENT_USER.name}`}
        aria-expanded={open}
        whileTap={{ scale: 0.94 }}
        transition={SPRING}
        className="text-brand grid size-10 place-items-center rounded-full border border-white/50 bg-white text-[1.4375rem]/[1.875rem] font-medium"
      >
        {CURRENT_USER.initial}

        {/* Ring grows out of the avatar rather than snapping on. */}
        <m.span
          aria-hidden
          initial={false}
          animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }}
          transition={POP}
          className="pointer-events-none absolute inset-0 rounded-full ring-4 ring-white/30"
        />
      </m.button>

      <AnimatePresence>
        {open && (
          <m.div
            role="tooltip"
            variants={hoverPanel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={POP}
            className="rounded-panel bg-surface-sunken pointer-events-none absolute top-full right-0 z-50 mt-2.5 origin-top-right px-4 py-3 text-right shadow-xl"
          >
            <p className="text-md text-ink-strong font-semibold whitespace-nowrap">
              {CURRENT_USER.name}
            </p>
            <p className="text-ink-subtle mt-0.5 text-sm whitespace-nowrap">{CURRENT_USER.email}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
