'use client';

import type { ComponentProps } from 'react';
import { CarouselNext, CarouselPrev, ChartNext, ChartPrev } from '@/components/icons';
import { IconButton } from './IconButton';
import { cn } from '@/lib/cn';

type Direction = 'prev' | 'next';

const ICONS = {
  chart: { prev: ChartPrev, next: ChartNext },
  media: { prev: CarouselPrev, next: CarouselNext },
} as const;

/**
 * Circular step control. Two sizes appear in the design: small grey discs beside
 * the chart, and larger translucent discs over the photo cards.
 *
 * The chart discs carry a real disabled state. In the source design the left
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
} & Omit<ComponentProps<typeof IconButton>, 'label' | 'children'>) {
  const isChart = variant === 'chart';
  const Icon = ICONS[variant][direction];

  return (
    <IconButton
      label={direction === 'prev' ? 'Previous' : 'Next'}
      whileHover={props.disabled ? undefined : { scale: 1.12 }}
      whileTap={props.disabled ? undefined : { scale: 0.9 }}
      className={cn(
        'transition-colors disabled:cursor-not-allowed',
        isChart
          ? [
              'bg-line text-ink-strong hover:bg-line-strong size-[18px]',
              'disabled:bg-surface-sunken disabled:text-ink-faint disabled:hover:bg-surface-sunken',
            ]
          : 'size-8 bg-black/60 text-white hover:bg-black/75 disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <Icon className={isChart ? 'size-3.5' : 'size-[18px]'} />
    </IconButton>
  );
}
