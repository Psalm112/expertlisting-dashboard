'use client';

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
import { SalesChart } from './SalesChart';
import { SalesMetricTile } from './SalesMetricTile';

/**
 * Owns the selected range and feeds both the subtitle and the chart, so the
 * 1 Week / 1 Month / 1 Year control actually does something.
 */
export function SalesOverviewCard() {
  const [range, setRange] = useState(DEFAULT_SALES_RANGE);
  const rangeLabel = SALES_RANGES.find((option) => option.id === range)?.label ?? '';

  // `min-w-0` on the card matters: as a grid item it would otherwise refuse to
  // shrink below the chart's intrinsic width and push the page into overflow.
  return (
    <Card className="flex min-w-0 flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink-strong">Sales Overview</h2>
          <p className="mt-1.5 max-w-[15rem] text-xs text-ink-subtle">{SALES_SUBTITLE[range]}</p>
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

      {/*
        Chart and tiles sit side by side from 960, the first width where the
        306px series, its axis and both arrows clear the 394px tile column.
        Leaving it until xl left the chart alone on a full-width card with a lot
        of dead space beside it.
      */}
      <div className="mt-4 flex flex-col gap-6 min-[960px]:flex-row min-[960px]:items-center min-[960px]:gap-4">
        <div className="min-w-0 flex-1">
          <SalesChart data={SALES_DATA[range]} rangeLabel={rangeLabel} />
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 min-[960px]:w-[394px] min-[960px]:shrink-0">
          {SALES_METRICS.map((metric) => (
            <SalesMetricTile key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </Card>
  );
}
