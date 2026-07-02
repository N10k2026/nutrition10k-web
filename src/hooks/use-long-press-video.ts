'use client';

import { useRef, useCallback, useState } from 'react';

/**
 * Long-press hook for video preview on mobile.
 * After `delay` ms of press, fires `onLongPress`.
 * The subsequent click (tap) is consumed so it doesn't trigger navigation.
 */
export function useLongPressVideo(delay = 350) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const start = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return;
      longPressedRef.current = false;
      timerRef.current = setTimeout(() => {
        longPressedRef.current = true;
        setIsLongPressing(true);
        video.play().catch(() => {});
      }, delay);
    },
    [delay],
  );

  const cancel = useCallback((video: HTMLVideoElement | null) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressing(false);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const consumedClick = useCallback(() => {
    const wasLongPress = longPressedRef.current;
    longPressedRef.current = false;
    return wasLongPress;
  }, []);

  return { start, cancel, consumedClick, isLongPressing };
}
