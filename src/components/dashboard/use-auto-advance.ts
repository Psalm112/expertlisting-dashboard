'use client';

import { useEffect, useRef } from 'react';

interface Options {
  enabled: boolean;
  intervalMs: number;
  onTick: () => void;
}

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
