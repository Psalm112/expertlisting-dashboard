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
 * Each card is a two-variant component in Figma, and the whole card swaps
 * between variants: photograph, caption and arrows change together. The site
 * visits card does it on a timer, the other two from the Live/All badge.
 */

/** The badge swap is instant in the prototype; a short fade reads better. */
const FILTER_CROSSFADE_MS = 220;

export function MetricPhotoCard({ card, priority }: { card: MetricCard; priority?: boolean }) {
  const [index, setIndex] = useState(card.defaultState ?? 0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const total = card.states.length;
  const current = card.states[index];
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
    if (!autoplay || paused || reduceMotion || total < 2) return;

    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % total),
      autoplay.dwellMs + autoplay.crossfadeMs,
    );
    return () => window.clearInterval(timer);
  }, [autoplay, paused, reduceMotion, total]);

  const step = (delta: number) => setIndex((i) => (i + delta + total) % total);

  /** Photographs cross-dissolve over the full duration; they blend cleanly. */
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

  return (
    <article
      className="group relative isolate aspect-[418/378] overflow-hidden rounded-panel bg-surface-invert"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {card.states.map((state, i) => (
        <Image
          key={state.id}
          src={LISTING_IMAGES[state.image]}
          alt={i === index ? state.imageAlt : ''}
          aria-hidden={i !== index}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 418px"
          placeholder="blur"
          priority={priority && i === (card.defaultState ?? 0)}
          className={cn(
            'object-cover transition-[opacity,transform] ease-linear',
            'group-hover:scale-[1.03]',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
          style={imageFade}
        />
      ))}

      <div aria-hidden className="media-scrim absolute inset-0" />

      {card.filters && card.mode === 'filter' && (
        <div className="absolute top-4 left-4 z-10">
          <FilterBadge
            label={`Listing filter for ${current.eyebrow}`}
            options={card.filters}
            value={index}
            onChange={setIndex}
          />
        </div>
      )}

      {current.showArrows && total > 1 && (
        <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between">
          <CarouselArrow direction="prev" onClick={() => step(-1)} />
          <CarouselArrow direction="next" onClick={() => step(1)} />
        </div>
      )}

      {/* Captions share one grid cell so they crossfade in place. */}
      <div className="absolute inset-x-4 bottom-11 z-10 grid items-end">
        {card.states.map((state, i) => (
          <div
            key={state.id}
            aria-hidden={i !== index}
            className={cn(
              'col-start-1 row-start-1 transition-opacity ease-linear',
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={captionFade(i === index)}
          >
            <p className="text-base font-medium tracking-wide text-white uppercase">
              {state.eyebrow}
            </p>

            {state.title && (
              <h3 className="mt-1 text-lg font-semibold text-balance text-white">{state.title}</h3>
            )}
            {state.location && <p className="text-sm text-ink-on-media">{state.location}</p>}

            <p className="mt-1 text-lg font-semibold text-highlight tabular-nums">{state.figure}</p>
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
          <ProgressDots count={total} active={index} onSelect={setIndex} label={current.eyebrow} />
        </div>
      )}
    </article>
  );
}
