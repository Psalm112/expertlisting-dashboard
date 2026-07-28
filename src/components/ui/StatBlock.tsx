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
      <dt className="text-ink-muted text-base font-medium">{label}</dt>
      <dd className="text-ink text-3xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
