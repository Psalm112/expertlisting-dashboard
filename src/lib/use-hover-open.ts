'use client';

import { useEffect, useState } from 'react';

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
