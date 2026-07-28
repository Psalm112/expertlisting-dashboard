'use client';

import { cn } from '@/lib/cn';

export interface FilterOption {
  label: string;
  /** Set when there is nothing behind the option, e.g. no photographs. */
  disabled?: boolean;
}

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
  options: FilterOption[];
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
      className="rounded-control inline-flex h-[26px] items-center gap-2 bg-black/60 px-2"
    >
      {options.map((option, index) => {
        const selected = index === value;

        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            title={option.disabled ? `No listings under ${option.label}` : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(index)}
            className={cn(
              'inline-flex items-center gap-1 rounded-sm text-sm font-medium transition-colors duration-150',
              selected && 'text-highlight',
              !selected && !option.disabled && 'text-ink-on-media-dim hover:text-white',
              option.disabled && 'cursor-not-allowed text-white/35',
            )}
          >
            {selected && <span aria-hidden className="bg-highlight size-1.5 rounded-full" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
