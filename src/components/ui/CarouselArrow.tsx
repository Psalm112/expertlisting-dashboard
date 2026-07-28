import type { ButtonHTMLAttributes } from 'react';
import { CarouselNext, CarouselPrev, ChartNext, ChartPrev } from '@/components/icons';
import { cn } from '@/lib/cn';

type Direction = 'prev' | 'next';

/**
 * Circular step control. Two sizes appear in the design: small grey discs beside
 * the chart, and larger translucent discs over the photo cards.
 *
 * The chart discs carry a real disabled state - in the source design the left
 * disc is a lighter grey than the right, because the chart is parked at its
 * starting position.
 */
export function CarouselArrow({
  direction,
  variant = 'media',
  className,
  ...props
}: {
  direction: Direction;
  variant?: 'chart' | 'media';
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const isChart = variant === 'chart';
  const Icon = isChart
    ? direction === 'prev'
      ? ChartPrev
      : ChartNext
    : direction === 'prev'
      ? CarouselPrev
      : CarouselNext;

  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition',
        'disabled:cursor-not-allowed',
        isChart
          ? [
              'size-[18px] bg-line text-ink-strong hover:bg-line-strong',
              'disabled:bg-surface-sunken disabled:text-ink-faint disabled:hover:bg-surface-sunken',
            ]
          : 'size-8 bg-black/60 text-white backdrop-blur-[2px] hover:bg-black/75 active:scale-95 disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <Icon className={isChart ? 'size-3.5' : 'size-[18px]'} />
    </button>
  );
}
