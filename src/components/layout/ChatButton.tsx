'use client';

import { motion } from 'framer-motion';
import { ChatBubble } from '@/components/icons';
import { EASE_OUT, SPRING } from '@/lib/motion';

/**
 * Floating support entry point.
 *
 * The Figma frame parks this mid-canvas, which is an artefact of a static
 * mockup. Here it is pinned to the bottom-right of the viewport, which is what a
 * floating action button is for.
 */
export function ChatButton() {
  return (
    <motion.button
      type="button"
      aria-label="Open support chat"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.4, ease: EASE_OUT }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="bg-surface-invert fixed right-5 bottom-5 z-50 grid size-[58px] place-items-center rounded-full border border-white/20 text-white shadow-lg md:right-8 md:bottom-8"
    >
      <motion.span transition={SPRING}>
        <ChatBubble className="size-6" />
      </motion.span>
    </motion.button>
  );
}
