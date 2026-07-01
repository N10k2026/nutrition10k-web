'use client';

import { useMemo, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { getFirstAvailableSize } from '@/lib/product-utils';
import { WHATSAPP_NUMBER } from '@/lib/site-config';
import { Heart, X, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function WishlistSidebar() {
  const isOpen = useCartStore((s) => s.isWishlistOpen);
  const setWishlistOpen = useCartStore((s) => s.setWishlistOpen);
  const wishlist = useCartStore((s) => s.wishlist);
  const products = useCartStore((s) => s.products);
  const removeWishlistItem = useCartStore((s) => s.removeWishlistItem);
  const addItem = useCartStore((s) => s.addItem);
  const clearWishlist = useCartStore((s) => s.clearWishlist);
  const setSelectedProduct = useCartStore((s) => s.setSelectedProduct);
  const setDetailOpen = useCartStore((s) => s.setDetailOpen);
  const setPreselectedFlavor = useCartStore((s) => s.setPreselectedFlavor);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);

  const entries = useMemo(() => {
    return wishlist
      .map((w) => {
        const product = products.find((p) => p.id === w.productId);
        return product ? { product, flavorName: w.flavorName } : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [wishlist, products]);

  const handleAddAll = useCallback(() => {
    let added = 0;
    let skipped = 0;
    for (const entry of entries) {
      const size = getFirstAvailableSize(entry.product) ?? entry.product.sizes[0];
      if (!size) {
        skipped++;
        continue;
      }
      addItem({
        product: entry.product,
        quantity: 1,
        selectedSize: size,
        selectedFlavor: entry.flavorName,
      });
      added++;
    }
    toast.success(`${added} producto${added === 1 ? '' : 's'} agregado${added === 1 ? '' : 's'} al carrito${skipped > 0 ? ` (${skipped} sin stock)` : ''}`);
  }, [entries, addItem]);

  const handleShare = useCallback(() => {
    const lines = ['*Mi lista de favoritos - NUTRITION 10K*', ''];
    entries.forEach((e, i) => {
      lines.push(`${i + 1}. ${e.product.name} - $${e.product.price}`);
    });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  }, [entries]);

  const handleProductClick = (productId: string, flavorName: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setSelectedProduct(product);
    setPreselectedFlavor(flavorName);
    setDetailOpen(true);
    addRecentlyViewed(productId);
    setWishlistOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="left" className="!w-full sm:!max-w-md !p-0 flex flex-col bg-background">
        <VisuallyHidden>
          <SheetTitle>Lista de favoritos</SheetTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#E30613] fill-[#E30613]" />
            <h2 className="font-display-bold text-lg">
              Favoritos
              {entries.length > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">({entries.length})</span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setWishlistOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
            aria-label="Cerrar favoritos"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <Heart className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Tu lista de favoritos está vacía</p>
            <button
              onClick={() => setWishlistOpen(false)}
              className="px-6 py-2 rounded-full bg-[#E30613] hover:bg-[#c50511] text-white text-sm font-display-bold transition-colors cursor-pointer"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {entries.map(({ product, flavorName }) => {
                const richProduct = PRODUCTS.find((p) => p.id === product.id);
                const brandColor = richProduct?.brandColor ?? '#E30613';

                return (
                  <div
                    key={`${product.id}-${flavorName}`}
                    className="wishlist-item-enter flex gap-3 p-3 glass-card"
                  >
                    <button
                      onClick={() => handleProductClick(product.id, flavorName)}
                      className="shrink-0 cursor-pointer"
                      aria-label={`Ver ${product.name}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-display-bold text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <span className="text-xs text-muted-foreground">{flavorName}</span>
                      </div>
                      {product.price > 0 && (
                        <span className="font-display-bold text-sm text-[#E30613]">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          const size = getFirstAvailableSize(product) ?? product.sizes[0];
                          if (size) {
                            addItem({ product, quantity: 1, selectedSize: size, selectedFlavor: flavorName });
                            toast.success(`${product.name} agregado al carrito`);
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-[#E30613] hover:bg-[#c50511] text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`Agregar ${product.name} al carrito`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeWishlistItem(product.id, flavorName)}
                        className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-[#E30613] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Quitar de favoritos"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-2 shrink-0">
              <button
                onClick={handleAddAll}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E30613] hover:bg-[#c50511] text-white font-display-bold transition-colors btn-press cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                Agregar Todo al Carrito
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-display-bold transition-colors cursor-pointer"
                >
                  Compartir
                </button>
                <button
                  onClick={() => {
                    clearWishlist();
                    toast.success('Favoritos vaciados');
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-display-bold transition-colors cursor-pointer"
                >
                  Vaciar
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
