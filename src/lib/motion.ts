import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion vocabulary, so timings stay consistent instead of every
 * component inventing its own.
 */

/** Standard ease-out curve. Quick to start, settles gently. */
export const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1];

export const SPRING: Transition = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 };

export const POP: Transition = { duration: 0.18, ease: EASE_OUT };

/** Panels that hang off a trigger: tooltips, the account card. */
export const hoverPanel: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

/** Sections easing in on first paint. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};
