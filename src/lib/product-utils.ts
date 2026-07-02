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

/** Product-like shape for pricing helpers. */
type ProductPricingShape = {
  price?: number;
  sizes: string[];
  sizePricing?: Record<string, number>;
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

/**
 * Resuelve el precio de un producto para una presentación (size) específica.
 * Si el producto tiene `sizePricing` y el size coincide, usa ese precio;
 * si no, usa el precio base `product.price`. Devuelve 0 si no hay precio.
 */
export function getProductPrice(
  product: ProductPricingShape,
  size?: string,
): number {
  if (size && product.sizePricing && product.sizePricing[size] != null) {
    return product.sizePricing[size];
  }
  return product.price ?? 0;
}

/**
 * Devuelve el precio mínimo de un producto entre todas sus presentaciones.
 * Útil para mostrar "Desde $X" en cards de productos con múltiples presentaciones.
 * Si el producto no tiene `sizePricing`, devuelve `product.price` (o 0).
 */
export function getProductMinPrice(product: ProductPricingShape): number {
  const prices: number[] = [];
  if (product.price && product.price > 0) prices.push(product.price);
  if (product.sizePricing) {
    for (const size of product.sizes) {
      const p = product.sizePricing[size];
      if (p != null && p > 0) prices.push(p);
    }
  }
  return prices.length > 0 ? Math.min(...prices) : 0;
}

/**
 * Indica si un producto tiene múltiples precios según la presentación
 * (es decir, tiene `sizePricing` con al menos un precio diferente al base).
 */
export function hasMultiPrice(product: ProductPricingShape): boolean {
  if (!product.sizePricing) return false;
  const base = product.price ?? 0;
  return Object.values(product.sizePricing).some((p) => p !== base);
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
