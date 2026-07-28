'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { SALES_SERIES } from '@/lib/mock-data';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import type { SalesPoint } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Geometry is taken from the Figma frame rather than left to the library.
 * Bars are 4px, 3px apart inside a group, with 18px between groups, which makes
 * each category band 36px. Sizing the chart to `bands x 36` holds Recharts to
 * those numbers instead of stretching them to fill the container.
 */
const BAR_SIZE = 4;
const BAR_GAP = 3;
const CATEGORY_GAP = 18;
const BAND = BAR_SIZE * 3 + BAR_GAP * 2 + CATEGORY_GAP;
const Y_AXIS_WIDTH = 28;
const X_AXIS_HEIGHT = 22;

/**
 * The axis is labelled to 50m but June's MRR bar runs past it, as in the design.
 * Rendering against a 55m domain over 143px puts the 50m label at 130px and that
 * bar at 136px, which is what the frame measures.
 */
const RENDER_MAX = 55;
const PLOT_HEIGHT = 143;
const TICKS = [0, 10, 20, 30, 40, 50];

/** Room above the plot for the hover readout. */
const READOUT_GUTTER = 36;
const READOUT_MARGIN = 64;
const DIMMED = 0.45;

const TONE: Record<string, { fill: string; dot: string }> = {
  blue: { fill: 'var(--color-data-blue)', dot: 'bg-data-blue' },
  green: { fill: 'var(--color-data-green)', dot: 'bg-data-green' },
  red: { fill: 'var(--color-data-red)', dot: 'bg-data-red' },
};

const AXIS_TICK = { fill: 'var(--color-ink-faint)', fontSize: 10 };

const formatValue = (value: number) => `₦${value.toFixed(1)}m`;
const formatTick = (value: number) => (value === 0 ? '0' : `${value}m`);

interface Hover {
  index: number;
  /** Offset within the plot wrapper, already clamped to stay on the card. */
  x: number;
}

export function SalesChart({ data, rangeLabel }: { data: SalesPoint[]; rangeLabel: string }) {
  const plot = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const chart = useRef<HTMLDivElement>(null);

  const [overflow, setOverflow] = useState({ left: false, right: false });
  const [hover, setHover] = useState<Hover | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const series = useMemo(
    () => data.map((point) => ({ month: point.month, ...point.values })),
    [data],
  );
  const chartWidth = Y_AXIS_WIDTH + BAND * data.length;

  const sync = useCallback(() => {
    const node = scroller.current;
    if (!node) return;

    setOverflow({
      left: node.scrollLeft > 1,
      right: node.scrollLeft + node.clientWidth < node.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;

    const onScroll = () => {
      sync();
      setHover(null);
    };

    sync();
    node.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [sync, data]);

  const scrollBy = (direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: 'smooth' });
  };

  /**
   * Bands are a fixed width, so the hovered index is arithmetic rather than a
   * reach into Recharts' internal tooltip state. The readout is positioned
   * against the plot wrapper because a horizontally scrolling element cannot
   * also overflow visibly on the vertical axis, and anything rendered inside it
   * gets clipped at the top of the plot.
   */
  const track = (clientX: number) => {
    const chartBox = chart.current?.getBoundingClientRect();
    const plotBox = plot.current?.getBoundingClientRect();
    if (!chartBox || !plotBox) return;

    const index = Math.floor((clientX - chartBox.left - Y_AXIS_WIDTH) / BAND);
    if (index < 0 || index >= data.length) {
      setHover(null);
      return;
    }

    const centre = chartBox.left - plotBox.left + Y_AXIS_WIDTH + index * BAND + BAND / 2;

    setHover({
      index,
      x: Math.min(Math.max(centre, READOUT_MARGIN), plotBox.width - READOUT_MARGIN),
    });
  };

  const active = hover ? data[hover.index] : null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-w-0 items-start gap-2">
        <CarouselArrow
          variant="chart"
          direction="prev"
          disabled={!overflow.left}
          onClick={() => scrollBy(-1)}
          className="mt-16 shrink-0"
        />

        <div ref={plot} className="relative min-w-0 flex-1">
          <div
            ref={scroller}
            className={cn(
              'overflow-x-auto overflow-y-hidden',
              '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
            )}
            style={{ paddingTop: READOUT_GUTTER }}
            onPointerMove={(event) => track(event.clientX)}
            onPointerLeave={() => setHover(null)}
          >
            <div ref={chart} className="mx-auto w-max">
              <BarChart
                width={chartWidth}
                height={PLOT_HEIGHT + X_AXIS_HEIGHT}
                data={series}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                barSize={BAR_SIZE}
                barGap={BAR_GAP}
                barCategoryGap={CATEGORY_GAP}
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
                    animationDuration={520}
                  >
                    {data.map((point, index) => (
                      <Cell
                        key={point.month}
                        fillOpacity={hover && hover.index !== index ? DIMMED : 1}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </div>
          </div>

          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute right-0 w-10 transition-opacity duration-200',
              'from-surface via-surface/85 bg-gradient-to-l to-transparent',
              overflow.right ? 'opacity-100' : 'opacity-0',
            )}
            style={{ top: READOUT_GUTTER, height: PLOT_HEIGHT }}
          />

          {active && hover && (
            <div
              role="tooltip"
              className={cn(
                'pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full',
                'bg-surface-invert rounded-md px-2.5 py-1.5 whitespace-nowrap text-white shadow-lg',
                'motion-safe:animate-[fade-up_140ms_ease-out]',
              )}
              style={{ left: hover.x, top: READOUT_GUTTER - 8 }}
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
            </div>
          )}
        </div>

        <CarouselArrow
          variant="chart"
          direction="next"
          disabled={!overflow.right}
          onClick={() => scrollBy(1)}
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
