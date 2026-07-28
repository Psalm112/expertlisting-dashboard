import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';


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
