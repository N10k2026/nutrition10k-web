'use client';

import { useEffect, useRef, type DependencyList } from 'react';

/**
 * Invoke `callback` at most once per animation frame on scroll/resize.
 * Avoids React setState storms during scroll.
 */
export function useScrollRaf(
  callback: () => void,
  deps: DependencyList = [],
  options?: { listenResize?: boolean },
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    let rafId = 0;

    const onEvent = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        callbackRef.current();
      });
    };

    window.addEventListener('scroll', onEvent, { passive: true });
    if (options?.listenResize !== false) {
      window.addEventListener('resize', onEvent, { passive: true });
    }
    onEvent();

    return () => {
      window.removeEventListener('scroll', onEvent);
      if (options?.listenResize !== false) {
        window.removeEventListener('resize', onEvent);
      }
      cancelAnimationFrame(rafId);
    };
  }, deps);
}
