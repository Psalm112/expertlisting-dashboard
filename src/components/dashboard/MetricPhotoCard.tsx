'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { FilterBadge } from '@/components/ui/FilterBadge';
import { ProgressDots } from '@/components/ui/ProgressDots';
import type { MetricCard } from '@/lib/types';
import { cn } from '@/lib/cn';
import { LISTING_IMAGES } from './listing-images';

/**
 * Photograph-backed metric card with a small carousel.
 *
 * Slides change the caption rather than the photograph: the design supplies one
 * image per card, and the extra slides are mock data (see README > Assumptions).
 */
export function MetricPhotoCard({ card, priority }: { card: MetricCard; priority?: boolean }) {
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState(card.defaultFilter ?? 0);

  const current = card.slides[slide];
  const total = card.slides.length;

  const step = (delta: number) => setSlide((index) => (index + delta + total) % total);

  return (
    <article className="group relative isolate aspect-[418/378] overflow-hidden rounded-panel bg-surface-invert">
      <Image
        src={LISTING_IMAGES[card.image]}
        alt={card.imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 418px"
        placeholder="blur"
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />

      <div aria-hidden className="media-scrim absolute inset-0" />

      {card.filters && (
        <div className="absolute top-4 left-4 z-10">
          <FilterBadge
            label={`Listing filter for ${current.eyebrow}`}
            options={card.filters}
            value={filter}
            onChange={setFilter}
          />
        </div>
      )}

      {card.showArrows && total > 1 && (
        <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between">
          <CarouselArrow
            direction="prev"
            onClick={() => step(-1)}
            className="opacity-90 transition-opacity duration-200 group-hover:opacity-100"
          />
          <CarouselArrow
            direction="next"
            onClick={() => step(1)}
            className="opacity-90 transition-opacity duration-200 group-hover:opacity-100"
          />
        </div>
      )}

      {/* Caption. Keyed on the slide so the fade replays on every change. */}
      <div
        key={current.id}
        className={cn(
          'absolute inset-x-4 bottom-11 z-10 motion-safe:animate-[fade-up_320ms_ease-out]',
        )}
      >
        <p className="text-base font-medium tracking-wide text-white uppercase">
          {current.eyebrow}
        </p>

        {current.title && (
          <h3 className="mt-1 text-lg font-semibold text-balance text-white">{current.title}</h3>
        )}
        {current.location && <p className="text-sm text-ink-on-media">{current.location}</p>}

        <p className="mt-1 text-lg font-semibold text-highlight tabular-nums">{current.figure}</p>
      </div>

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <ProgressDots
            count={total}
            active={slide}
            onSelect={setSlide}
            label={current.eyebrow}
          />
        </div>
      )}
    </article>
  );
}
