import { DeltaBadge } from '@/components/ui/DeltaBadge';
import type { SalesMetric } from '@/lib/types';
import { cn } from '@/lib/cn';

const TONE: Record<SalesMetric['tone'], string> = {
  blue: 'text-data-blue',
  green: 'text-data-green',
  orange: 'text-data-orange',
  deep: 'text-brand-deep',
};

/** One of the four figures beside the sales chart. */
export function SalesMetricTile({ metric }: { metric: SalesMetric }) {
  return (
    <div className="flex flex-col justify-center gap-2 rounded-panel border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong">
      <p className={cn('text-xl font-semibold tabular-nums', TONE[metric.tone])}>{metric.value}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-2xs font-medium text-ink-body">{metric.label}</span>
        <DeltaBadge value={metric.delta.value} trend={metric.delta.trend} />
      </div>
    </div>
  );
}
