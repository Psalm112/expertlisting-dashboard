'use client';

import { useEffect, useState } from 'react';

/**
 * Open/close state for hover panels.
 *
 * Pointer events only open it on devices that actually hover, so a tap on a
 * touchscreen does not leave a tooltip stuck open. Focus opens it either way,
 * which is what keyboard users need.
 */
export function useHoverOpen() {
  const [open, setOpen] = useState(false);
  const [hoverable, setHoverable] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover)');
    const sync = () => setHoverable(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const triggerProps = {
    onPointerEnter: () => {
      if (hoverable) setOpen(true);
    },
    onPointerLeave: () => setOpen(false),
    onFocusCapture: () => setOpen(true),
    onBlurCapture: () => setOpen(false),
  };

  return { open, triggerProps };
}
