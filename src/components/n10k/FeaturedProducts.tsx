'use client';

import { useRef, useMemo } from 'react';
import { useCartStore } from '@/lib/store';
import { BlurIn, SplitWords } from '@/components/n10k/TextAnimations';
import { useScrollVisibleWithRef, useStaggerChildren } from '@/hooks/use-scroll-visible';
import { handleKeyboardClick, hasMultiPrice, getProductMinPrice } from '@/lib/product-utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibleWithRef(sectionRef, 0.1);
  useStaggerChildren(sectionRef, isVisible, '.fp-card', 0.1);

  const products = useCartStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const setSelectedProduct = useCartStore((s) => s.setSelectedProduct);
  const setDetailOpen = useCartStore((s) => s.setDetailOpen);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);

  const featured = useMemo(() => {
    const bestSellers = products.filter((p) => p.isBestSeller);
    const news = products.filter((p) => p.isNew && !p.isBestSeller);
    const fill = products.filter((p) => !p.isBestSeller && !p.isNew);
    return [...bestSellers, ...news, ...fill].slice(0, 8);
  }, [products]);

  const handleQuickAdd = (product: typeof featured[number]) => {
    const size = product.sizes[0] ?? 'Único';
    addItem({
      product,
      quantity: 1,
      selectedSize: size,
      selectedFlavor: product.flavors?.[0]?.name ?? product.name,
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleViewDetail = (product: typeof featured[number]) => {
    setSelectedProduct(product);
    setDetailOpen(true);
    addRecentlyViewed(product.id);
  };

  if (featured.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="destacados"
      className={`py-12 sm:py-16 animate-section-fade-left ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <BlurIn>
            <p className="text-[#E30613] font-display-bold text-sm uppercase tracking-[0.2em] mb-2">
              Los más vendidos
            </p>
          </BlurIn>
          <SplitWords
            text="Productos Destacados"
            className="font-display-black text-3xl sm:text-4xl lg:text-5xl tracking-tight"
          />
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 pr-8 snap-x">
          {featured.map((product) => (
            <div
              key={product.id}
              className="fp-card shrink-0 w-[260px] sm:w-[300px] snap-start"
              role="button"
              tabIndex={0}
              onClick={() => handleViewDetail(product)}
              onKeyDown={(e) => handleKeyboardClick(e, () => handleViewDetail(product))}
              style={{ opacity: 0 }}
            >
              <FeaturedCard
                product={product}
                onQuickAdd={(e) => {
                  e.stopPropagation();
                  handleQuickAdd(product);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  product,
  onQuickAdd,
}: {
  product: { id: string; name: string; image: string; price: number; originalPrice?: number; isNew?: boolean; isBestSeller?: boolean; rating?: number; category: string; description: string };
  onQuickAdd: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="group cursor-pointer h-full overflow-hidden rounded-[20px] border border-border relative aspect-[4/5] bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image fills entire card */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {product.isBestSeller && (
          <span className="bg-[#E30613] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
            Top
          </span>
        )}
        {product.isNew && (
          <span className="bg-white/90 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
            Nuevo
          </span>
        )}
      </div>

      {/* Quick add — estático en la esquina inferior derecha (no se solapa con wishlist) */}
      <button
        onClick={onQuickAdd}
        className="absolute bottom-12 right-2 w-7 h-7 rounded-full bg-[#E30613] hover:bg-[#c50511] text-white flex items-center justify-center shadow-lg shadow-black/25 transition-colors cursor-pointer z-20"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        <ShoppingBag className="h-3.5 w-3.5" />
      </button>

      {/* Glassmorphism info overlay at bottom — compacto
          - Mobile: always visible (dark glass + white text)
          - Desktop (md): hidden, shows on hover */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 bg-black/50 backdrop-blur-md transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
        <p className="text-[8px] uppercase tracking-wide text-white/60 leading-tight">
          {product.category}
        </p>
        <h3 className="font-display-bold text-[11px] sm:text-sm leading-tight line-clamp-1 text-white">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          {product.price > 0 ? (
            <span className="font-display-bold text-xs sm:text-base text-white">
              {hasMultiPrice(product) ? 'Desde ' : ''}${getProductMinPrice(product)}
            </span>
          ) : (
            <span className="text-[10px] text-white/60 italic">Por confirmar</span>
          )}
          <ArrowRight className="h-3 w-3 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </div>
    </div>
  );
}
