'use client';

import { m } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface Dot {
  label: string;
  disabled?: boolean;
}


 
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
            <m.span
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
