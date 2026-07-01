import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import { toStoreProduct } from '@/lib/store';

/**
 * GET /api/products — Returns the full catalog.
 * Uses static products from src/data/products.ts as the source of truth.
 * Supports optional ?category= filter.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let products = PRODUCTS;

  if (category && category !== 'Todos') {
    products = products.filter((p) => p.category === category);
  }

  return NextResponse.json(products.map(toStoreProduct));
}
