'use client';

import { motion } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface Dot {
  label: string;
  disabled?: boolean;
}

/**
 * Slide indicator on the photo cards. The design draws these as a passive
 * indicator; making them clickable costs nothing and gives the card a second
 * way in.
 */
export function ProgressDots({
  dots,
  active,
  onSelect,
  label,
}: {
  dots: Dot[];
  active: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dots.map((dot, index) => (
        <button
          key={dot.label}
          type="button"
          aria-label={`${label}: ${dot.label}`}
          aria-current={index === active}
          disabled={dot.disabled}
          onClick={() => onSelect(index)}
          className={cn(
            'relative size-[7px] rounded-full transition-colors duration-200',
            index !== active && !dot.disabled && 'bg-white/20 hover:bg-white/50',
            index !== active && dot.disabled && 'cursor-not-allowed bg-white/10',
          )}
        >
          {index === active && (
            <motion.span
              layoutId={`dots-${label}`}
              transition={SPRING}
              className="border-line-faint absolute inset-0 rounded-full border bg-white"
            />
          )}
        </button>
      ))}
    </div>
  );
}
