import { cn } from '@/lib/cn';

/**
 * A labelled figure - "Published / 1.2k". Used across both overview panels.
 */
export function StatBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <dt className="text-base font-medium text-ink-muted">{label}</dt>
      <dd className="text-3xl font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}
