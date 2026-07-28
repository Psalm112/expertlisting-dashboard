import { DeltaDown, DeltaUp } from '@/components/icons';
import type { Trend } from '@/lib/types';
import { cn } from '@/lib/cn';

export function DeltaBadge({ value, trend }: { value: string; trend: Trend }) {
  const Icon = trend === 'up' ? DeltaUp : DeltaDown;

  return (
    <span className="inline-flex items-center gap-1">
      <Icon
        className={cn('size-3.5 shrink-0', trend === 'up' ? 'text-data-green' : 'text-negative')}
      />
      <span className={cn('text-2xs', trend === 'up' ? 'text-data-green' : 'text-negative')}>
        <span className="sr-only">{trend === 'up' ? 'Up ' : 'Down '}</span>
        {value}
      </span>
    </span>
  );
}
