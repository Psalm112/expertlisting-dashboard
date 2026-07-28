import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The panel shape used by every boxed section in the design: 16px radius,
 * white fill, hairline border, and an optional tinted header strip.
 */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn('rounded-card border border-line bg-surface', className)}>
      {children}
    </section>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex h-[50px] items-center justify-between gap-3 rounded-t-card',
        'border-b border-line bg-surface-muted px-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('px-4 py-3.5', className)}>{children}</div>;
}
