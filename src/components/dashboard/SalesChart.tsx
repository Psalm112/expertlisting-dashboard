'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { POP } from '@/lib/motion';
import { SALES_SERIES } from '@/lib/mock-data';
import { useElementWidth } from '@/lib/use-element-width';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import type { SalesPoint } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Bars are 4px, 3px apart inside a group, so a group is always 18px wide. The
 * band around it is whatever the container gives us, and the category gap is
 * derived from that, which keeps the bars themselves at their drawn size while
 * the chart scales.
 */
const BAR_SIZE = 4;
const BAR_GAP = 3;
const GROUP_WIDTH = BAR_SIZE * 3 + BAR_GAP * 2;
const Y_AXIS_WIDTH = 28;
const X_AXIS_HEIGHT = 22;

const RENDER_MAX = 55;
const PLOT_HEIGHT = 143;
const TICKS = [0, 10, 20, 30, 40, 50];

/** Below this the bars crowd, so the arrows start paging instead. */
const MIN_BAND = 30;
const MIN_VISIBLE = 4;
const DESIGN_BAND = 36;

const READOUT_GUTTER = 40;
const READOUT_MARGIN = 64;
const DIMMED = 0.4;

const TONE: Record<string, { fill: string; dot: string }> = {
  blue: { fill: 'var(--color-data-blue)', dot: 'bg-data-blue' },
  green: { fill: 'var(--color-data-green)', dot: 'bg-data-green' },
  red: { fill: 'var(--color-data-red)', dot: 'bg-data-red' },
};

const AXIS_TICK = { fill: 'var(--color-ink-faint)', fontSize: 10 };

const formatValue = (value: number) => `₦${value.toFixed(1)}m`;
const formatTick = (value: number) => (value === 0 ? '0' : `${value}m`);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function SalesChart({ data, rangeLabel }: { data: SalesPoint[]; rangeLabel: string }) {
  const [plot, plotWidth] = useElementWidth<HTMLDivElement>();
  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const capacity = plotWidth
    ? Math.max(MIN_VISIBLE, Math.floor((plotWidth - Y_AXIS_WIDTH) / MIN_BAND))
    : data.length;
  const visible = Math.min(capacity, data.length);
  const maxOffset = Math.max(0, data.length - visible);
  const start = Math.min(offset, maxOffset);

  /**
   * The chart shrinks to fit but never stretches past the design's 36px band.
   * Left to fill, a wide card spreads 4px bars 60px apart, which reads as a
   * different chart. Past that width it centres instead.
   */
  const maxWidth = Y_AXIS_WIDTH + DESIGN_BAND * visible;
  const innerWidth = plotWidth ? Math.min(plotWidth, maxWidth) : maxWidth;
  const inset = Math.max(0, (plotWidth - innerWidth) / 2);
  const band = (innerWidth - Y_AXIS_WIDTH) / visible;

  const windowed = useMemo(
    () =>
      data.slice(start, start + visible).map((point) => ({ month: point.month, ...point.values })),
    [data, start, visible],
  );

  const page = (direction: 1 | -1) => {
    setHovered(null);
    setOffset((value) => clamp(value + direction * visible, 0, maxOffset));
  };

  const track = (clientX: number, target: HTMLElement) => {
    const box = target.getBoundingClientRect();
    const index = Math.floor((clientX - box.left - inset - Y_AXIS_WIDTH) / band);
    setHovered(index >= 0 && index < visible ? index : null);
  };

  // Guarded rather than reset in an effect: the window can shrink under a stale
  // hover when the container resizes or the range changes.
  const index = hovered !== null && hovered < visible ? hovered : null;
  const active = index === null ? null : data[start + index];
  const readoutX =
    index === null || !plotWidth
      ? 0
      : clamp(
          inset + Y_AXIS_WIDTH + index * band + band / 2,
          READOUT_MARGIN,
          plotWidth - READOUT_MARGIN,
        );

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-w-0 items-start gap-2">
        <CarouselArrow
          variant="chart"
          direction="prev"
          disabled={start === 0}
          onClick={() => page(-1)}
          className="mt-16 shrink-0"
        />

        <div
          ref={plot}
          className="relative min-w-0 flex-1"
          style={{ paddingTop: READOUT_GUTTER }}
          onPointerMove={(event) => track(event.clientX, event.currentTarget)}
          onPointerLeave={() => setHovered(null)}
        >
          <div className="mx-auto" style={{ maxWidth }}>
            <ResponsiveContainer width="100%" height={PLOT_HEIGHT + X_AXIS_HEIGHT}>
              <BarChart
                data={windowed}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                barSize={BAR_SIZE}
                barGap={BAR_GAP}
                barCategoryGap={Math.max(6, Math.round(band - GROUP_WIDTH))}
              >
                <YAxis
                  width={Y_AXIS_WIDTH}
                  domain={[0, RENDER_MAX]}
                  ticks={TICKS}
                  tickFormatter={formatTick}
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <XAxis
                  dataKey="month"
                  height={X_AXIS_HEIGHT}
                  tick={{ ...AXIS_TICK, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />

                {SALES_SERIES.map((entry) => (
                  <Bar
                    key={entry.key}
                    dataKey={entry.key}
                    fill={TONE[entry.tone].fill}
                    radius={1}
                    isAnimationActive={!reducedMotion}
                    animationDuration={480}
                  >
                    {windowed.map((point, index) => (
                      <Cell
                        key={point.month}
                        fillOpacity={hovered !== null && hovered !== index ? DIMMED : 1}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <AnimatePresence>
            {active && (
              <m.div
                role="tooltip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={POP}
                style={{ left: readoutX, top: READOUT_GUTTER - 8, x: '-50%', y: '-100%' }}
                className={cn(
                  'pointer-events-none absolute z-30 origin-bottom',
                  'bg-surface-invert rounded-md px-2.5 py-1.5 whitespace-nowrap text-white shadow-lg',
                )}
              >
                <p className="text-2xs font-medium text-white/70">{active.month}</p>
                <ul className="mt-0.5 space-y-0.5">
                  {SALES_SERIES.map((entry) => (
                    <li key={entry.key} className="text-2xs flex items-center gap-1.5">
                      <span className={cn('size-1.5 rounded-full', TONE[entry.tone].dot)} />
                      {formatValue(active.values[entry.key])}
                    </li>
                  ))}
                </ul>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <CarouselArrow
          variant="chart"
          direction="next"
          disabled={start >= maxOffset}
          onClick={() => page(1)}
          className="mt-16 shrink-0"
        />
      </div>

      <table className="sr-only">
        <caption>Sales overview, {rangeLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {SALES_SERIES.map((entry) => (
              <th key={entry.key} scope="col">
                {entry.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.month}</th>
              {SALES_SERIES.map((entry) => (
                <td key={entry.key}>{formatValue(point.values[entry.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
