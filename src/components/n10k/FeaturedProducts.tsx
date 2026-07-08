'use client';

import { useRef, useMemo } from 'react';
import { useCartStore } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { BlurIn, SplitWords } from '@/components/n10k/TextAnimations';
import { useScrollVisibleWithRef, useStaggerChildren } from '@/hooks/use-scroll-visible';
import { handleKeyboardClick, hasMultiPrice, getProductMinPrice } from '@/lib/product-utils';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
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

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x">
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
  const n10kProduct = PRODUCTS.find((p) => p.id === product.id);
  const brandColor = n10kProduct?.brandColor ?? '#E30613';

  return (
    <div className="glass-card group cursor-pointer h-full overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[20px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
              Top Ventas
            </span>
          )}
          {product.isNew && (
            <span className="bg-white/90 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
              Nuevo
            </span>
          )}
        </div>

        {/* Quick add */}
        <button
          onClick={onQuickAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#E30613] hover:bg-[#c50511] text-white flex items-center justify-center shadow-lg shadow-black/25 transition-all duration-300 translate-y-12 group-hover:translate-y-0 cursor-pointer"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="font-display-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-[#E30613] text-[#E30613]" />
            <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.price > 0 ? (
              <span className="font-display-bold text-lg text-[#E30613]">
                {hasMultiPrice(product) ? 'Desde ' : ''}${getProductMinPrice(product)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">Por confirmar</span>
            )}
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}
