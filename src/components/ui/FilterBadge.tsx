'use client';

import { cn } from '@/lib/cn';

/**
 * Live Listings / All Listings switch floating over the photo cards.
 * The selected option is marked by a yellow dot as well as colour.
 */
export function FilterBadge({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  label: string;
}) {
  // Deliberately no backdrop blur. The design specifies a flat 60% black fill,
  // and a backdrop-filter draws a visible seam between the two buttons in Chrome
  // because each one composites its own backdrop.
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex h-[26px] items-center gap-2 rounded-control bg-black/60 px-2"
    >
      {options.map((option, index) => {
        const selected = index === value;

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(index)}
            className={cn(
              'inline-flex items-center gap-1 rounded-sm text-sm font-medium transition-colors duration-150',
              selected ? 'text-highlight' : 'text-ink-on-media-dim hover:text-white',
            )}
          >
            {selected && <span aria-hidden className="size-1.5 rounded-full bg-highlight" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}
