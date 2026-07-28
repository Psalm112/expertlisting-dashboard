'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  DEFAULT_SALES_RANGE,
  SALES_DATA,
  SALES_METRICS,
  SALES_RANGES,
  SALES_SUBTITLE,
} from '@/lib/mock-data';
import { ChartSkeleton } from './ChartSkeleton';
import { SalesMetricTile } from './SalesMetricTile';

// Recharts is by far the heaviest thing on the page, and it is the only route
// that needs it. Splitting it out keeps it off the initial bundle.
const SalesChart = dynamic(() => import('./SalesChart').then((m) => m.SalesChart), {
  loading: () => <ChartSkeleton />,
});

export function SalesOverviewCard() {
  const [range, setRange] = useState(DEFAULT_SALES_RANGE);
  const rangeLabel = SALES_RANGES.find((option) => option.id === range)?.label ?? '';

  // `min-w-0` matters: as a grid item the card would otherwise refuse to shrink
  // below the chart's intrinsic width and push the page into overflow.
  return (
    <Card className="flex min-w-0 flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-ink-strong text-2xl font-semibold">Sales Overview</h2>
          <p className="text-ink-subtle mt-1.5 max-w-60 text-xs">{SALES_SUBTITLE[range]}</p>
        </div>

        <PillButton>View Transactions</PillButton>
      </div>

      <SegmentedControl
        label="Sales period"
        options={SALES_RANGES}
        value={range}
        onChange={setRange}
        className="mt-2 self-end"
      />

      {/* Chart and tiles pair up from 960, the first width where the series, its
          axis and both arrows clear the 394px tile column. */}
      <div className="mt-4 flex flex-col gap-6 min-[960px]:flex-row min-[960px]:items-center min-[960px]:gap-4">
        <div className="min-w-0 flex-1">
          <SalesChart data={SALES_DATA[range]} rangeLabel={rangeLabel} />
        </div>

        <div className="grid grid-cols-1 gap-3.5 min-[960px]:w-[394px] min-[960px]:shrink-0 sm:grid-cols-2">
          {SALES_METRICS.map((metric) => (
            <SalesMetricTile key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </Card>
  );
}
