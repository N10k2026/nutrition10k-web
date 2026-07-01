import type { KeyboardEvent } from 'react';

/**
 * Product utilities for Nutrition 10K.
 * Adapted from n10k-store (clothing) → supplements.
 */

/** Product-like shape for stock helpers. */
type ProductStockShape = {
  sizes: string[];
  outOfStock?: string[];
};

export function isProductSizeOutOfStock(
  product: ProductStockShape,
  size: string,
): boolean {
  return (product.outOfStock ?? []).includes(size);
}

/** First in-stock size, or null if every size is marked outOfStock. */
export function getFirstAvailableSize(product: ProductStockShape): string | null {
  return product.sizes.find((size) => !isProductSizeOutOfStock(product, size)) ?? null;
}

/** Safe parse for localStorage JSON arrays. */
export function parseStoredStringArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

/** Shareable product URL with ?product= slug or id. */
export function getProductShareUrl(product: { id: string; slug?: string }): string {
  if (typeof window === 'undefined') return '';
  const key = encodeURIComponent(product.slug || product.id);
  return `${window.location.origin}/?product=${key}`;
}

/** Keyboard activation for div/span elements acting as buttons (Enter/Space). */
export function handleKeyboardClick(
  event: KeyboardEvent,
  action: () => void,
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
}

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
