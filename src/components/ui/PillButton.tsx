import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Outlined pill action - "View Transactions" in the sales card header.
 */
export function PillButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-[46px] items-center justify-center rounded-full px-6',
        'border-line-strong bg-surface text-ink-strong border text-xs font-medium',
        'hover:border-ink-faint hover:bg-surface-sunken transition-colors duration-150',
        'active:bg-line-soft',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
