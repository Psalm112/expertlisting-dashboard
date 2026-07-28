'use client';

import { useEffect, useRef } from 'react';

interface Options {
  enabled: boolean;
  intervalMs: number;
  onTick: () => void;
}

/**
 * Fires `onTick` on an interval while `enabled`.
 *
 * The callback is held in a ref so changing it does not restart the timer, which
 * would otherwise reset the countdown on every render.
 */
export function useAutoAdvance({ enabled, intervalMs, onTick }: Options) {
  const callback = useRef(onTick);

  useEffect(() => {
    callback.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return;

    const timer = window.setInterval(() => callback.current(), intervalMs);
    return () => window.clearInterval(timer);
  }, [enabled, intervalMs]);
}
