'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { PRODUCTS, CATEGORIES, type ProductCategory } from '@/data/products';
import { BlurIn, SplitWords } from '@/components/n10k/TextAnimations';
import { useScrollVisibleWithRef, useStaggerChildren } from '@/hooks/use-scroll-visible';
import { handleKeyboardClick, getProductShareUrl, hasMultiPrice, getProductMinPrice } from '@/lib/product-utils';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { ShoppingBag, Star, Heart, Share2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export default function ProductGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollVisibleWithRef(sectionRef, 0.05);
  useStaggerChildren(gridRef, isVisible, '.pg-card', 0.06);

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'Todos'>('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const products = useCartStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const setSelectedProduct = useCartStore((s) => s.setSelectedProduct);
  const setDetailOpen = useCartStore((s) => s.setDetailOpen);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlistItem = useCartStore((s) => s.toggleWishlistItem);

  const wishlistSet = useMemo(
    () => new Set(wishlist.map((w) => w.productId)),
    [wishlist],
  );

  const filteredSorted = useMemo(() => {
    let result = products;
    if (activeCategory !== 'Todos') {
      result = result.filter((p) => p.category === activeCategory);
    }
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result = [...result].sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
    }
    return result;
  }, [products, activeCategory, sortBy]);

  // GSAP entrance for cards
  useEffect(() => {
    if (!isVisible || !gridRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current!.querySelectorAll('.pg-card');
      cards.forEach((card, index) => {
        const el = card as HTMLElement;
        const colIndex = index % 4;
        gsap.set(el, { autoAlpha: 0, y: 60 + colIndex * 10 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 108%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              delay: colIndex * 0.1,
              ease: 'power3.out',
            });
          },
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [isVisible, filteredSorted.length]);

  const handleQuickAdd = (product: typeof products[number]) => {
    const size = product.sizes[0] ?? 'Único';
    addItem({
      product,
      quantity: 1,
      selectedSize: size,
      selectedFlavor: product.flavors?.[0]?.name ?? product.name,
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleViewDetail = (product: typeof products[number]) => {
    setSelectedProduct(product);
    setDetailOpen(true);
    addRecentlyViewed(product.id);
  };

  const handleShare = (product: typeof products[number], e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getProductShareUrl(product));
    toast.success('Enlace copiado');
  };

  const sortLabels: Record<SortOption, string> = {
    featured: 'Destacados',
    'price-asc': 'Precio: menor a mayor',
    'price-desc': 'Precio: mayor a menor',
    'name-asc': 'Nombre: A-Z',
  };

  return (
    <section
      ref={sectionRef}
      id="catalogo"
      className="py-12 sm:py-16 border-t border-border/40"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <BlurIn>
            <p className="text-[#E30613] font-display-bold text-sm uppercase tracking-[0.2em] mb-2">
              Catálogo completo
            </p>
          </BlurIn>
          <SplitWords
            text="Nuestros Productos"
            className="font-display-black text-3xl sm:text-4xl lg:text-5xl tracking-tight"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'Todos' as const, label: 'Todos' },
              ...CATEGORIES.filter((c) =>
                products.some((p) => p.category === c.id),
              ),
            ]).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-display-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#E30613] text-white shadow-md shadow-black/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-display-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
            >
              {sortLabels[sortBy]}
              <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-20">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      sortBy === option
                        ? 'bg-[#E30613]/10 text-[#E30613] font-bold'
                        : 'hover:bg-muted text-foreground'
                    }`}
                    role="option"
                    aria-selected={sortBy === option}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {filteredSorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlistSet={wishlistSet}
              onQuickAdd={(e) => {
                e.stopPropagation();
                handleQuickAdd(product);
              }}
              onViewDetail={() => handleViewDetail(product)}
              onWishlistToggle={(e) => {
                e.stopPropagation();
                toggleWishlistItem(product.id, product.flavors?.[0]?.name ?? product.name);
              }}
              onShare={(e) => handleShare(product, e)}
            />
          ))}
        </div>

        {filteredSorted.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No hay productos en esta categoría.
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  wishlistSet,
  onQuickAdd,
  onViewDetail,
  onWishlistToggle,
  onShare,
}: {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    isNew?: boolean;
    isBestSeller?: boolean;
    rating?: number;
    category: string;
    description: string;
    sizes: string[];
  };
  wishlistSet: Set<string>;
  onQuickAdd: (e: React.MouseEvent) => void;
  onViewDetail: () => void;
  onWishlistToggle: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}) {
  const n10kProduct = PRODUCTS.find((p) => p.id === product.id);
  const brandColor = n10kProduct?.brandColor ?? '#E30613';
  const isWishlisted = wishlistSet.has(product.id);

  return (
    <div
      className="pg-card glass-card group cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onClick={onViewDetail}
      onKeyDown={(e) => handleKeyboardClick(e, onViewDetail)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[20px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Brand color bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: brandColor }} />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
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

        {/* Wishlist */}
        <button
          onClick={onWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={`h-4 w-4 transition-all ${isWishlisted ? 'fill-[#E30613] text-[#E30613] heart-animate' : 'text-white'}`}
          />
        </button>

        {/* Quick add */}
        <button
          onClick={onQuickAdd}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#E30613] hover:bg-[#c50511] text-white flex items-center justify-center shadow-lg shadow-black/25 transition-all duration-300 translate-y-10 group-hover:translate-y-0 cursor-pointer"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-0.5">
          {product.category}
        </p>
        <h3 className="font-display-bold text-xs sm:text-sm mb-1 line-clamp-1">{product.name}</h3>
        {product.rating && (
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-3 w-3 fill-[#E30613] text-[#E30613]" />
            <span className="text-[10px] text-muted-foreground">{product.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {product.price > 0 ? (
            <span className="font-display-bold text-sm sm:text-base text-[#E30613]">
              {hasMultiPrice(product) ? 'Desde ' : ''}${getProductMinPrice(product)}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground italic">Por confirmar</span>
          )}
          <button
            onClick={onShare}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Compartir producto"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
