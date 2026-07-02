/**
 * Runtime performance preferences for progressive degradation.
 * Desktop keeps full effects; mobile / reduced-motion / save-data get lighter paths.
 */

export interface PerformancePrefs {
  reducedMotion: boolean;
  reducedData: boolean;
  isMobile: boolean;
  /** Skip WebGL Plasma (CSS gradients remain) */
  disablePlasma: boolean;
  /** Cap canvas / WebGL devicePixelRatio */
  canvasDprCap: number;
  /** Disable InteractiveBackground parallax loop */
  disableBackgroundParallax: boolean;
}

const MOBILE_BREAKPOINT = 768;

function readReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readReducedData(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return conn?.saveData === true;
}

function readIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/** Read prefs once on the client (call inside useEffect / event handlers). */
export function getPerformancePrefs(): PerformancePrefs {
  const reducedMotion = readReducedMotion();
  const reducedData = readReducedData();
  const isMobile = readIsMobile();

  const disablePlasma = reducedMotion || reducedData || isMobile;
  const disableBackgroundParallax = reducedMotion || isMobile;

  return {
    reducedMotion,
    reducedData,
    isMobile,
    disablePlasma,
    canvasDprCap: isMobile ? 1.5 : 2,
    disableBackgroundParallax,
  };
}

/** Default prefs for SSR / first paint (assume desktop-capable). */
export function getDefaultPerformancePrefs(): PerformancePrefs {
  return {
    reducedMotion: false,
    reducedData: false,
    isMobile: false,
    disablePlasma: false,
    canvasDprCap: 2,
    disableBackgroundParallax: false,
  };
}
