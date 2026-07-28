'use client';

import { cn } from '@/lib/cn';

/**
 * Slide indicator on the photo cards. Dots are interactive - the design shows
 * them as a passive indicator, but making them clickable costs nothing and
 * gives the carousel a second way in.
 */
export function ProgressDots({
  count,
  active,
  onSelect,
  label,
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`${label}: go to slide ${index + 1} of ${count}`}
          aria-current={index === active}
          onClick={() => onSelect(index)}
          className={cn(
            'size-[7px] rounded-full transition-colors duration-200',
            index === active ? 'border border-line-faint bg-white' : 'bg-white/20 hover:bg-white/50',
          )}
        />
      ))}
    </div>
  );
}
