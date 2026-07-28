'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { FilterBadge } from '@/components/ui/FilterBadge';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import type { MetricCard } from '@/lib/types';
import { cn } from '@/lib/cn';
import { useAutoAdvance } from './use-auto-advance';
import { LISTING_IMAGES } from './listing-images';

/**
 * Two axes, which the design keeps distinct:
 *
 * - The badge and the dots choose a view, Live Listings or All Listings. Each
 *   view has its own caption and its own photographs.
 * - The arrows step through the photographs inside the selected view, so they
 *   only appear where a view holds more than one.
 *
 * The site visits card has no badge and cycles its views on a timer instead.
 */

/** The badge swap is instant in the prototype; a short fade reads better. */
const FILTER_CROSSFADE_MS = 220;

export function MetricPhotoCard({ card, priority }: { card: MetricCard; priority?: boolean }) {
  const [view, setView] = useState(card.defaultView ?? 0);
  const [photo, setPhoto] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const { views, mode } = card;
  const current = views[view];
  const autoplay = mode === 'auto' ? card.autoplay : undefined;
  const crossfadeMs = autoplay?.crossfadeMs ?? FILTER_CROSSFADE_MS;

  const selectView = (index: number) => {
    if (!views[index].photos.length) return;
    setView(index);
    setPhoto(0);
  };

  useAutoAdvance({
    enabled: Boolean(autoplay) && !paused && !reducedMotion && views.length > 1,
    intervalMs: autoplay ? autoplay.dwellMs + autoplay.crossfadeMs : 0,
    onTick: () => {
      setView((index) => (index + 1) % views.length);
      setPhoto(0);
    },
  });

  const stepPhoto = (delta: number) =>
    setPhoto((index) => (index + delta + current.photos.length) % current.photos.length);

  const imageFade = { transitionDuration: `${crossfadeMs}ms` };

  // Two different captions dissolving on top of each other read as doubled text,
  // so the outgoing one clears before the incoming one arrives.
  const captionFade = (active: boolean) => ({
    transitionDuration: `${Math.round(crossfadeMs * (active ? 0.45 : 0.35))}ms`,
    transitionDelay: active ? `${Math.round(crossfadeMs * 0.4)}ms` : '0ms',
  });

  return (
    <article
      className="group rounded-panel bg-surface-invert relative isolate aspect-[418/378] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {views.map((entry, viewIndex) =>
        entry.photos.map((image, photoIndex) => {
          const showing = viewIndex === view && photoIndex === photo;

          return (
            <Image
              key={`${entry.id}-${image.key}`}
              src={LISTING_IMAGES[image.key]}
              alt={showing ? image.alt : ''}
              aria-hidden={!showing}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 418px"
              placeholder="blur"
              priority={priority && viewIndex === (card.defaultView ?? 0) && photoIndex === 0}
              className={cn(
                'object-cover transition-[opacity,transform] ease-linear group-hover:scale-[1.03]',
                showing ? 'opacity-100' : 'opacity-0',
              )}
              style={imageFade}
            />
          );
        }),
      )}

      <div aria-hidden className="media-scrim absolute inset-0" />

      {mode === 'filter' && (
        <div className="absolute top-4 left-4 z-10">
          <FilterBadge
            label={`Listing filter for ${current.eyebrow}`}
            options={views.map((entry) => ({
              label: entry.label ?? entry.id,
              disabled: entry.photos.length === 0,
            }))}
            value={view}
            onChange={selectView}
          />
        </div>
      )}

      {current.photos.length > 1 && (
        <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between">
          <CarouselArrow direction="prev" onClick={() => stepPhoto(-1)} />
          <CarouselArrow direction="next" onClick={() => stepPhoto(1)} />
        </div>
      )}

      {/* Captions share one grid cell so they crossfade in place. */}
      <div className="absolute inset-x-4 bottom-11 z-10 grid items-end">
        {views.map((entry, index) => (
          <div
            key={entry.id}
            aria-hidden={index !== view}
            className={cn(
              'col-start-1 row-start-1 transition-opacity ease-linear',
              index === view ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={captionFade(index === view)}
          >
            <p className="text-base font-medium tracking-wide text-white uppercase">
              {entry.eyebrow}
            </p>

            {entry.title && (
              <h3 className="mt-1 text-lg font-semibold text-balance text-white">{entry.title}</h3>
            )}
            {entry.location && <p className="text-ink-on-media text-sm">{entry.location}</p>}
            {entry.figure && (
              <p className="text-highlight mt-1 text-lg font-semibold tabular-nums">
                {entry.figure}
              </p>
            )}
          </div>
        ))}
      </div>

      {views.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <ProgressDots
            label={current.eyebrow}
            dots={views.map((entry) => ({
              label: entry.label ?? entry.eyebrow,
              disabled: entry.photos.length === 0,
            }))}
            active={view}
            onSelect={selectView}
          />
        </div>
      )}
    </article>
  );
}
