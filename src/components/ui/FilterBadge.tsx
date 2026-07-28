'use client';

import { Fragment } from 'react';
import { m } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface FilterOption {
  label: string;
  /** Set when there is nothing behind the option, e.g. no photographs. */
  disabled?: boolean;
}

/**
 * Live Listings / All Listings switch floating over the photo cards.
 *
 * The selected option is marked by a yellow dot as well as colour, and the dot
 * slides between options rather than jumping. Options are separated by the
 * hairline the design draws between them (`Line 164`, 1px at 16% white).
 *
 * Deliberately no backdrop blur: the design specifies a flat 60% black fill.
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
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="rounded-control inline-flex h-[26px] items-center gap-2 bg-black/60 px-2"
    >
      {options.map((option, index) => {
        const selected = index === value;

        return (
          <Fragment key={option.label}>
            {index > 0 && <span aria-hidden className="w-px self-stretch bg-white/[0.16]" />}

            <button
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
              {selected && (
                <m.span
                  aria-hidden
                  layoutId={`filter-dot-${label}`}
                  transition={SPRING}
                  className="bg-highlight size-1.5 rounded-full"
                />
              )}
              {option.label}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
