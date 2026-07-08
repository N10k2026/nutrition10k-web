'use client';

import { useRef, useMemo } from 'react';
import { useCartStore } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { BlurIn } from '@/components/n10k/TextAnimations';
import { useScrollVisibleWithRef } from '@/hooks/use-scroll-visible';
import { handleKeyboardClick, hasMultiPrice, getProductMinPrice } from '@/lib/product-utils';
import { Clock, Trash2, ArrowRight } from 'lucide-react';

export default function RecentlyViewedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibleWithRef(sectionRef, 0.1);

  const recentlyViewed = useCartStore((s) => s.recentlyViewed);
  const products = useCartStore((s) => s.products);
  const setSelectedProduct = useCartStore((s) => s.setSelectedProduct);
  const setDetailOpen = useCartStore((s) => s.setDetailOpen);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);
  const clearRecentlyViewed = useCartStore((s) => s.clearRecentlyViewed);

  const items = useMemo(() => {
    return recentlyViewed
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [recentlyViewed, products]);

  const handleClick = (product: typeof items[number]) => {
    setSelectedProduct(product);
    setDetailOpen(true);
    addRecentlyViewed(product.id);
  };

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="vistos-recientemente"
      className={`py-8 sm:py-12 animate-section-slide-up ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <BlurIn>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#E30613]" />
              <h2 className="font-display-bold text-xl sm:text-2xl">Vistos Recientemente</h2>
            </div>
          </BlurIn>
          <button
            onClick={clearRecentlyViewed}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#E30613] transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpiar
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x">
          {items.map((product) => {
            const richProduct = PRODUCTS.find((p) => p.id === product.id);
            const brandColor = richProduct?.brandColor ?? '#E30613';

            return (
              <div
                key={product.id}
                className="shrink-0 w-[160px] sm:w-[180px] snap-start glass-card group cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onClick={() => handleClick(product)}
                onKeyDown={(e) => handleKeyboardClick(e, () => handleClick(product))}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: brandColor }} />
                </div>
                <div className="p-2.5">
                  <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{product.category}</p>
                  <h3 className="font-display-bold text-xs line-clamp-1 mt-0.5">{product.name}</h3>
                  {product.price > 0 ? (
                    <span className="font-display-bold text-sm text-[#E30613]">
                      {hasMultiPrice(product) ? 'Desde ' : ''}${getProductMinPrice(product)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Por confirmar</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
