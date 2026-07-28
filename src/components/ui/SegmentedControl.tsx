'use client';

import { useRef } from 'react';
import { m } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface Option {
  id: string;
  label: string;
}

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
              'rounded-control text-ink-body relative h-[33px] px-4 text-base whitespace-nowrap',
              'transition-colors duration-150',
              selected ? 'font-semibold' : 'hover:bg-surface-sunken/60 font-normal',
            )}
          >
            {selected && (
              <m.span
                layoutId="sales-range-pill"
                transition={SPRING}
                className="bg-surface-sunken rounded-control absolute inset-0"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
