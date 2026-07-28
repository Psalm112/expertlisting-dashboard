import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The dark label the prototype shows under each masthead icon on hover.
 *
 * CSS only, no positioning library. Tailwind compiles `hover:` inside
 * `@media (hover: hover)`, so this never sticks open after a tap on a
 * touchscreen, and `group-focus-within` covers keyboard users.
 */
export function Tooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('group/tip relative inline-flex', className)}>
      {children}

      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute top-full left-1/2 z-50 mt-2.5 -translate-x-1/2',
          'rounded-control bg-surface-invert px-3.5 py-2 text-sm whitespace-nowrap text-white',
          'opacity-0 shadow-lg transition-opacity duration-200',
          'group-focus-within/tip:opacity-100 group-hover/tip:opacity-100',
        )}
      >
        {/* Caret. A rotated square is cheaper than a second SVG. */}
        <span
          aria-hidden
          className="bg-surface-invert absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px]"
        />
        <span className="relative">{label}</span>
      </span>
    </span>
  );
}
