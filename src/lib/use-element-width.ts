'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Observes an element's content width. Returns the ref to attach and the current
 * width, 0 until the first measurement lands.
 */
export function useElementWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    setWidth(node.clientWidth);

    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
