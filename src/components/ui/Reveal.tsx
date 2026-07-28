import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Fades a section up on first paint.
 *
 * Plain CSS on purpose. A JS-driven entrance has to render `opacity: 0` into the
 * server HTML, which leaves the page blank until hydration on a slow connection.
 * The reduced-motion rule in `globals.css` collapses this to an instant reveal.
 *
 * `className` passes straight through so this can be the grid item itself rather
 * than adding a wrapper that breaks layout.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={cn('rise-in', className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
