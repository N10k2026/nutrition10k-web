'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCartStore } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { getProductShareUrl, getProductPrice } from '@/lib/product-utils';
import { WHATSAPP_NUMBER } from '@/lib/site-config';
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Pill,
  Beaker,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function ProductDetail() {
  const isOpen = useCartStore((s) => s.isDetailOpen);
  const setDetailOpen = useCartStore((s) => s.setDetailOpen);
  const selectedProduct = useCartStore((s) => s.selectedProduct);
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlistItem = useCartStore((s) => s.toggleWishlistItem);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Reset when product changes
  useEffect(() => {
    if (isOpen && selectedProduct) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuantity(1);
      setSelectedSize(selectedProduct.sizes[0] ?? '');
      setActiveSlideIndex(0);
      addRecentlyViewed(selectedProduct.id);
    }
  }, [isOpen, selectedProduct, addRecentlyViewed]);

  // Look up the rich NutritionProduct data for ingredients/nutrition facts
  const richProduct = useMemo(
    () => (selectedProduct ? PRODUCTS.find((p) => p.id === selectedProduct.id) : null),
    [selectedProduct],
  );

  // Gallery images from the rich product (or fallback to product.image)
  const galleryImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (richProduct?.images && richProduct.images.length > 0) return richProduct.images;
    return [selectedProduct.image];
  }, [selectedProduct, richProduct]);

  const isWishlisted = selectedProduct
    ? wishlist.some((w) => w.productId === selectedProduct.id)
    : false;

  // Recommended products (same category, exclude current)
  const recommendedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return PRODUCTS.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id,
    ).slice(0, 4);
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addItem({
      product: selectedProduct,
      quantity,
      selectedSize,
      selectedFlavor: selectedProduct.flavors?.[0]?.name ?? selectedProduct.name,
      unitPrice: getProductPrice(selectedProduct, selectedSize),
    });
    toast.success(`${quantity} × ${selectedProduct.name} agregado al carrito`);
    setDetailOpen(false);
  };

  const handleShare = (method: 'copy' | 'whatsapp') => {
    if (!selectedProduct) return;
    const url = getProductShareUrl(selectedProduct);
    if (method === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Enlace copiado');
    } else {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Mira este producto: ${selectedProduct.name} ${url}`)}`,
        '_blank',
      );
    }
    setShareOpen(false);
  };

  if (!selectedProduct) return null;

  const brandColor = richProduct?.brandColor ?? '#E30613';
  const currentPrice = getProductPrice(selectedProduct, selectedSize);
  const subtotal = currentPrice * quantity;
  const currentImage = galleryImages[activeSlideIndex] || selectedProduct.image;

  // Info block (shared between mobile and desktop)
  const infoBlock = (
    <>
      {/* Header: category + name + tagline */}
      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          {selectedProduct.category}
        </p>
        <h2 className="font-display-black text-xl sm:text-2xl md:text-3xl mb-1 leading-tight">
          {selectedProduct.name}
        </h2>
        {richProduct && (
          <p className="text-sm text-muted-foreground">{richProduct.tagline}</p>
        )}
      </div>

      {/* Price + badges */}
      <div className="flex items-center gap-3 mb-4">
        {currentPrice > 0 ? (
          <span className="font-display-black text-2xl sm:text-3xl" style={{ color: brandColor }}>
            ${currentPrice}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground italic">Precio por confirmar</span>
        )}
        {selectedProduct.isNew && (
          <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
            Nuevo
          </span>
        )}
        {selectedProduct.isBestSeller && (
          <span className="bg-foreground text-background text-[10px] font-black px-2 py-1 rounded-full uppercase">
            Top Ventas
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground/90 leading-relaxed mb-5">
        {selectedProduct.description}
      </p>

      {/* Size selector */}
      {selectedProduct.sizes.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-display-bold uppercase tracking-wide text-muted-foreground mb-2">
            Presentación
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedProduct.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-xl text-sm font-display-semibold border transition-all cursor-pointer ${
                  selectedSize === size
                    ? 'border-[#E30613] bg-[#E30613]/10 text-[#E30613]'
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Subtotal */}
      <div className="mb-5">
        <p className="text-xs font-display-bold uppercase tracking-wide text-muted-foreground mb-2">
          Cantidad
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-display-bold tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            Subtotal:{' '}
            <span className="font-display-bold text-foreground">
              ${subtotal > 0 ? subtotal.toFixed(2) : '—'}
            </span>
          </span>
        </div>
      </div>

      {/* Add to cart + wishlist + share */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E30613] hover:bg-[#c50511] text-white font-display-bold transition-colors btn-press cursor-pointer"
        >
          <ShoppingBag className="h-5 w-5" />
          Agregar al Carrito
        </button>
        <button
          onClick={() =>
            toggleWishlistItem(
              selectedProduct.id,
              selectedProduct.flavors?.[0]?.name ?? selectedProduct.name,
            )
          }
          className="w-12 h-12 rounded-xl border border-border hover:border-foreground/30 flex items-center justify-center transition-colors cursor-pointer"
          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={`h-5 w-5 ${isWishlisted ? 'fill-[#E30613] text-[#E30613]' : ''}`}
          />
        </button>
        <div className="relative">
          <button
            onClick={() => setShareOpen(!shareOpen)}
            className="w-12 h-12 rounded-xl border border-border hover:border-foreground/30 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Compartir producto"
          >
            <Share2 className="h-5 w-5" />
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-20">
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted cursor-pointer"
              >
                <Check className="h-4 w-4" /> Copiar enlace
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted cursor-pointer"
              >
                <Share2 className="h-4 w-4" /> WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      {richProduct && richProduct.ingredients.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Beaker className="h-4 w-4" style={{ color: brandColor }} />
            <h3 className="font-display-bold text-sm uppercase tracking-wide">
              Ingredientes
            </h3>
          </div>
          <div className="space-y-2">
            {richProduct.ingredients.map((ing, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                <span className="text-xl shrink-0">{ing.emoji}</span>
                <div>
                  <p className="font-display-bold text-sm">{ing.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ing.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition facts */}
      {richProduct && richProduct.nutritionFacts && richProduct.nutritionFacts.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-4 w-4" style={{ color: brandColor }} />
            <h3 className="font-display-bold text-sm uppercase tracking-wide">
              Información Nutricional
            </h3>
          </div>
          <div className="bg-muted/50 rounded-xl overflow-hidden">
            {richProduct.nutritionFacts.map((fact, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  i % 2 === 0 ? 'bg-muted/30' : ''
                }`}
              >
                <span className="text-muted-foreground">{fact.label}</span>
                <span className="font-display-bold">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage */}
      {richProduct && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4" style={{ color: brandColor }} />
            <h3 className="font-display-bold text-sm uppercase tracking-wide">
              Modo de Empleo
            </h3>
          </div>
          <p className="text-sm text-muted-foreground/90 leading-relaxed p-3 bg-muted/50 rounded-xl">
            {richProduct.usage}
          </p>
        </div>
      )}

      {/* Benefits */}
      {richProduct && richProduct.benefits.length > 0 && (
        <div className="mb-5">
          <h3 className="font-display-bold text-sm uppercase tracking-wide mb-2">
            Beneficios
          </h3>
          <div className="space-y-1.5">
            {richProduct.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Gallery block (shared between mobile and desktop)
  const galleryBlock = (
    <div className="relative">
      {/* Main image */}
      <div className="relative aspect-[5/6] overflow-hidden bg-muted/30 rounded-xl">
        <img
          src={currentImage}
          alt={`${selectedProduct.name} - imagen ${activeSlideIndex + 1}`}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: brandColor }} />

        {/* Navigation arrows (if multiple images) */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveSlideIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveSlideIndex((i) => (i + 1) % galleryImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Slide counter */}
            <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-display-bold">
              {activeSlideIndex + 1} / {galleryImages.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                activeSlideIndex === idx
                  ? 'border-[#E30613]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Recommended products block
  const recommendedBlock = recommendedProducts.length > 0 && (
    <div className="mt-4 pt-3 border-t border-border">
      <h3 className="font-display-bold text-xs uppercase tracking-wide mb-2">
        Porque te puede interesar
      </h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {recommendedProducts.map((rec) => {
          const storeProduct = useCartStore.getState().products.find((p) => p.id === rec.id);
          if (!storeProduct) return null;
          return (
            <button
              key={rec.id}
              onClick={() => {
                useCartStore.getState().setSelectedProduct(storeProduct);
                useCartStore.getState().setDetailOpen(true);
              }}
              className="shrink-0 w-16 text-left cursor-pointer group"
            >
              <div className="aspect-[4/5] rounded-md overflow-hidden mb-1 bg-muted/30">
                <img
                  src={storeProduct.image}
                  alt={rec.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[10px] font-display-bold line-clamp-1">{rec.name}</p>
              {rec.price ? (
                <p className="text-[10px] font-display-bold" style={{ color: rec.brandColor }}>
                  ${rec.price}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setDetailOpen}>
      <DialogContent className="!max-w-4xl !w-[95vw] !h-[90vh] !p-0 !gap-0 overflow-hidden bg-background border-border">
        <VisuallyHidden>
          <DialogTitle>{selectedProduct.name}</DialogTitle>
          <DialogDescription>
            Detalle del producto {selectedProduct.name} de Nutrition 10K
          </DialogDescription>
        </VisuallyHidden>

        {/* Mobile layout: info → gallery → recommended */}
        <div className="flex flex-col h-full overflow-y-auto md:hidden">
          <div className="p-5 pb-3">
            {infoBlock}
          </div>
          <div className="px-5">
            {galleryBlock}
          </div>
          <div className="px-5 pb-5">
            {recommendedBlock}
          </div>
        </div>

        {/* Desktop layout: split lateral — gallery+recommended left, info right */}
        <div className="hidden md:flex h-full overflow-y-auto">
          <div className="md:w-[55%] shrink-0 p-5 overflow-y-auto">
            {galleryBlock}
            {recommendedBlock}
          </div>
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {infoBlock}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
