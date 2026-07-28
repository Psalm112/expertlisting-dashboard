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


const SalesChart = dynamic(() => import('./SalesChart').then((m) => m.SalesChart), {
  loading: () => <ChartSkeleton />,
});

export function SalesOverviewCard() {
  const [range, setRange] = useState(DEFAULT_SALES_RANGE);
  const rangeLabel = SALES_RANGES.find((option) => option.id === range)?.label ?? '';

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
