'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { FilterBadge } from '@/components/ui/FilterBadge';
import { ProgressDots } from '@/components/ui/ProgressDots';
import type { MetricCard } from '@/lib/types';
import { cn } from '@/lib/cn';
import { LISTING_IMAGES } from './listing-images';

/**
 * Photograph-backed metric card.
 *
 * Two separate axes, which the design keeps distinct:
 *
 * - The badge (and the dots) choose a *view*, i.e. Live Listings or All
 *   Listings. Each view has its own caption and its own set of photographs.
 * - The prev/next arrows step through the photographs *within* the selected
 *   view, so they only appear when a view holds more than one.
 *
 * The site visits card has no badge and cycles its views on a timer instead.
 */

/** The badge swap is instant in the prototype; a short fade reads better. */
const FILTER_CROSSFADE_MS = 220;

export function MetricPhotoCard({ card, priority }: { card: MetricCard; priority?: boolean }) {
  const [view, setView] = useState(card.defaultView ?? 0);
  const [photo, setPhoto] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const views = card.views;
  const current = views[view];
  const photoCount = current.photos.length;
  const autoplay = card.mode === 'auto' ? card.autoplay : undefined;
  const crossfadeMs = autoplay ? autoplay.crossfadeMs : FILTER_CROSSFADE_MS;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Cycles the site visits card. Held while the pointer or focus is inside, and
  // switched off entirely for anyone who has asked for reduced motion.
  useEffect(() => {
    if (!autoplay || paused || reduceMotion || views.length < 2) return;

    const timer = window.setInterval(() => {
      setView((i) => (i + 1) % views.length);
      setPhoto(0);
    }, autoplay.dwellMs + autoplay.crossfadeMs);

    return () => window.clearInterval(timer);
  }, [autoplay, paused, reduceMotion, views.length]);

  const selectView = (index: number) => {
    if (!views[index].photos.length) return;
    setView(index);
    setPhoto(0);
  };

  const stepPhoto = (delta: number) =>
    setPhoto((i) => (i + delta + photoCount) % photoCount);

  const imageFade = { transitionDuration: `${crossfadeMs}ms` };

  /**
   * Captions cannot cross-dissolve the same way: two different strings on top of
   * each other read as doubled text. The outgoing one clears first, then the
   * incoming one arrives.
   */
  const captionFade = (active: boolean) => ({
    transitionDuration: `${Math.round(crossfadeMs * (active ? 0.45 : 0.35))}ms`,
    transitionDelay: active ? `${Math.round(crossfadeMs * 0.4)}ms` : '0ms',
  });

  const hasBadge = card.mode === 'filter' && views.some((v) => v.label);

  return (
    <article
      className="group relative isolate aspect-[418/378] overflow-hidden rounded-panel bg-surface-invert"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {views.map((v, vi) =>
        v.photos.map((p, pi) => {
          const showing = vi === view && pi === photo;

          return (
            <Image
              key={`${v.id}-${p.key}`}
              src={LISTING_IMAGES[p.key]}
              alt={showing ? p.alt : ''}
              aria-hidden={!showing}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 418px"
              placeholder="blur"
              priority={priority && vi === (card.defaultView ?? 0) && pi === 0}
              className={cn(
                'object-cover transition-[opacity,transform] ease-linear',
                'group-hover:scale-[1.03]',
                showing ? 'opacity-100' : 'opacity-0',
              )}
              style={imageFade}
            />
          );
        }),
      )}

      <div aria-hidden className="media-scrim absolute inset-0" />

      {hasBadge && (
        <div className="absolute top-4 left-4 z-10">
          <FilterBadge
            label={`Listing filter for ${current.eyebrow}`}
            options={views.map((v) => ({
              label: v.label ?? v.id,
              disabled: v.photos.length === 0,
            }))}
            value={view}
            onChange={selectView}
          />
        </div>
      )}

      {photoCount > 1 && (
        <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between">
          <CarouselArrow direction="prev" onClick={() => stepPhoto(-1)} />
          <CarouselArrow direction="next" onClick={() => stepPhoto(1)} />
        </div>
      )}

      {/* Captions share one grid cell so they crossfade in place. */}
      <div className="absolute inset-x-4 bottom-11 z-10 grid items-end">
        {views.map((v, vi) => (
          <div
            key={v.id}
            aria-hidden={vi !== view}
            className={cn(
              'col-start-1 row-start-1 transition-opacity ease-linear',
              vi === view ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={captionFade(vi === view)}
          >
            <p className="text-base font-medium tracking-wide text-white uppercase">{v.eyebrow}</p>

            {v.title && (
              <h3 className="mt-1 text-lg font-semibold text-balance text-white">{v.title}</h3>
            )}
            {v.location && <p className="text-sm text-ink-on-media">{v.location}</p>}
            {v.figure && (
              <p className="mt-1 text-lg font-semibold text-highlight tabular-nums">{v.figure}</p>
            )}
          </div>
        ))}
      </div>

      {views.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <ProgressDots
            label={current.eyebrow}
            dots={views.map((v) => ({
              label: v.label ?? v.eyebrow,
              disabled: v.photos.length === 0,
            }))}
            active={view}
            onSelect={selectView}
          />
        </div>
      )}
    </article>
  );
}
