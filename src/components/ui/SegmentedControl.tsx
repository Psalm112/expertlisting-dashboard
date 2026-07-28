'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';

interface Option {
  id: string;
  label: string;
}

/**
 * The 1 Week / 1 Month / 1 Year switch above the sales chart.
 *
 * Implemented with radio semantics plus roving focus so it behaves like the
 * single-choice control it looks like: one tab stop, arrow keys to move.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  className?: string;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = options.findIndex((option) => option.id === value);

  const moveFocus = (delta: number) => {
    const next = (activeIndex + delta + options.length) % options.length;
    onChange(options[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={cn('flex items-center gap-3', className)}>
      {options.map((option, index) => {
        const selected = option.id === value;

        return (
          <button
            key={option.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                moveFocus(1);
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                moveFocus(-1);
              }
            }}
            className={cn(
              'h-[33px] rounded-control px-4 text-base whitespace-nowrap transition-colors duration-150',
              selected
                ? 'bg-surface-sunken font-semibold text-ink-body'
                : 'font-normal text-ink-body hover:bg-surface-sunken/60',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
