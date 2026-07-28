'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { SALES_AXIS_MAX, SALES_SERIES, SALES_TICKS } from '@/lib/mock-data';
import type { SalesPoint } from '@/lib/types';
import { cn } from '@/lib/cn';

/**
 * Grouped bar chart, hand-built rather than pulled from a charting library.
 *
 * The design needs exactly one chart type with fixed geometry (4px bars, 3px
 * apart, 18px between groups) and no axes, grid or legend. Recharts or similar
 * would add ~90 KB to render markup we can express in a few divs, and would
 * fight the pixel spacing rather than help it.
 *
 * Geometry comes straight from the Figma frame: the 0-50m axis spans 130px, and
 * bars are free to overshoot it, as June's does in the source design.
 */

/** Pixels per million naira, from the Figma axis. */
const SCALE = 130 / SALES_AXIS_MAX;
/** Bar area height, leaving headroom for the overshooting bar. */
const PLOT_HEIGHT = 150;
/** Breathing room above the bars. */
const PLOT_GUTTER = 36;
/** Keeps the readout from hanging off the side of the card. */
const TOOLTIP_MARGIN = 64;

const TONE: Record<string, string> = {
  blue: 'bg-data-blue',
  green: 'bg-data-green',
  red: 'bg-data-red',
};

const formatValue = (value: number) => `₦${value.toFixed(1)}m`;

export function SalesChart({ data, rangeLabel }: { data: SalesPoint[]; rangeLabel: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });
  const [hover, setHover] = useState<{ index: number; x: number } | null>(null);

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
      // The readout is positioned against the plot, so drop it while scrolling
      // rather than let it drift away from its bar group.
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
   * The readout lives outside the scroll container. A horizontally scrollable
   * element cannot also overflow visibly on the vertical axis, so a tooltip
   * rendered inside it gets clipped at the top of the plot.
   */
  const showReadout = (index: number, group: HTMLElement) => {
    const bounds = plot.current?.getBoundingClientRect();
    if (!bounds) return;

    const rect = group.getBoundingClientRect();
    const centre = rect.left + rect.width / 2 - bounds.left;
    const clamped = Math.min(Math.max(centre, TOOLTIP_MARGIN), bounds.width - TOOLTIP_MARGIN);

    setHover({ index, x: clamped });
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

        <div className="flex min-w-0 flex-1 gap-3">
          {/* Value axis. Labels sit on the same scale as the bars. */}
          <div aria-hidden className="relative w-7 shrink-0" style={{ height: PLOT_HEIGHT }}>
            {SALES_TICKS.map((tick) => (
              <span
                key={tick}
                className="absolute right-0 translate-y-1/2 text-2xs text-ink-faint tabular-nums"
                style={{ bottom: tick * SCALE }}
              >
                {tick === 0 ? '0' : `${tick}m`}
              </span>
            ))}
          </div>

          <div ref={plot} className="relative min-w-0 flex-1">
            {/* Plot. Scrolls horizontally when the card is narrower than the series. */}
            <div
              ref={scroller}
              className={cn(
                'overflow-x-auto overflow-y-hidden',
                '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              )}
              style={{ paddingTop: PLOT_GUTTER }}
              onMouseLeave={() => setHover(null)}
            >
              {/*
                `mx-auto` centres the series when the card is wider than the
                306px it needs. Once the content overflows the auto margins
                resolve to zero, so nothing gets pushed out of reach.
              */}
              <div
                className="mx-auto flex w-max items-end gap-[18px]"
                style={{ height: PLOT_HEIGHT }}
              >
                {data.map((point, index) => (
                  <div
                    key={point.month}
                    className="flex h-full items-end gap-[3px]"
                    tabIndex={0}
                    onMouseEnter={(event) => showReadout(index, event.currentTarget)}
                    onFocus={(event) => showReadout(index, event.currentTarget)}
                    onBlur={() => setHover(null)}
                    aria-label={`${point.month}: ${SALES_SERIES.map(
                      (series) => `${series.label} ${formatValue(point.values[series.key])}`,
                    ).join(', ')}`}
                  >
                    {SALES_SERIES.map((series) => (
                      <div
                        key={series.key}
                        className={cn(
                          'w-1 rounded-[1px] transition-opacity duration-150',
                          TONE[series.tone],
                          hover && hover.index !== index && 'opacity-45',
                        )}
                        style={{ height: Math.max(2, point.values[series.key] * SCALE) }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Category axis, aligned to the bar groups. */}
              <div className="mx-auto mt-2.5 flex w-max gap-[18px]">
                {data.map((point, index) => (
                  <span
                    key={point.month}
                    className={cn(
                      'w-[18px] text-center text-2xs font-medium transition-colors duration-150',
                      hover?.index === index ? 'text-ink-strong' : 'text-ink-faint',
                    )}
                  >
                    {point.month}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft edge showing there is more chart out of view.
                The design draws this as a hard white panel because it sits past
                the final bar; as a live scroll affordance a gradient reads better
                and never hides a bar outright. */}
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute right-0 w-10 transition-opacity duration-200',
                'bg-gradient-to-l from-surface via-surface/85 to-transparent',
                overflow.right ? 'opacity-100' : 'opacity-0',
              )}
              style={{ top: PLOT_GUTTER, height: PLOT_HEIGHT }}
            />

            {active && hover && (
              <div
                role="tooltip"
                className={cn(
                  'pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full',
                  'rounded-md bg-surface-invert px-2.5 py-1.5 whitespace-nowrap text-white shadow-lg',
                  'motion-safe:animate-[fade-up_140ms_ease-out]',
                )}
                style={{ left: hover.x, top: PLOT_GUTTER - 8 }}
              >
                <p className="text-2xs font-medium text-white/70">{active.month}</p>
                <ul className="mt-0.5 space-y-0.5">
                  {SALES_SERIES.map((series) => (
                    <li key={series.key} className="flex items-center gap-1.5 text-2xs">
                      <span className={cn('size-1.5 rounded-full', TONE[series.tone])} />
                      {formatValue(active.values[series.key])}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <CarouselArrow
          variant="chart"
          direction="next"
          disabled={!overflow.right}
          onClick={() => scrollBy(1)}
          className="mt-16 shrink-0"
        />
      </div>

      {/* Non-visual equivalent of the chart. */}
      <table className="sr-only">
        <caption>Sales overview, {rangeLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {SALES_SERIES.map((series) => (
              <th key={series.key} scope="col">
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <th scope="row">{point.month}</th>
              {SALES_SERIES.map((series) => (
                <td key={series.key}>{formatValue(point.values[series.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
