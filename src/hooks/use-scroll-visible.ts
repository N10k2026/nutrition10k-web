'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Trigger-once IntersectionObserver hook for section reveals.
 * Returns `[isVisible, ref]`.
 */
export function useScrollVisible<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
): [boolean, RefObject<T | null>] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, isVisible]);

  return [isVisible, ref];
}

/**
 * Variant that accepts an external ref + threshold.
 */
export function useScrollVisibleWithRef<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  threshold = 0.15,
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, isVisible]);

  return isVisible;
}

/**
 * Apply staggered `animation-delay` to children matching a selector
 * once the container becomes visible. Returns nothing — mutates DOM.
 */
export function useStaggerChildren(
  containerRef: RefObject<HTMLElement | null>,
  isVisible: boolean,
  selector: string,
  stepMs = 0.08,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVisible) return;

    const children = container.querySelectorAll<HTMLElement>(selector);
    children.forEach((child, index) => {
      child.style.animationDelay = `${index * stepMs}s`;
      child.style.opacity = '1';
    });
  }, [containerRef, isVisible, selector, stepMs]);
}
