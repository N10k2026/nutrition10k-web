'use client';

import { useMemo, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store';
import { WHATSAPP_NUMBER } from '@/lib/site-config';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function CartSidebar() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const buildWhatsAppMessage = useCallback(() => {
    const lines = ['*NUEVO PEDIDO - NUTRITION 10K*', ''];
    items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.product.name}`,
        `   Presentación: ${item.selectedSize}`,
        `   Cantidad: ${item.quantity}`,
        `   Subtotal: $${(item.product.price * item.quantity).toFixed(2)}`,
        '',
      );
    });
    lines.push('────────────');
    lines.push(`*Total: $${totalPrice.toFixed(2)}*`);
    return lines.join('\n');
  }, [items, totalPrice]);

  const handleCheckout = useCallback(() => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, [buildWhatsAppMessage]);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="!w-full sm:!max-w-md !p-0 flex flex-col bg-background">
        <VisuallyHidden>
          <SheetTitle>Carrito de compras</SheetTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#E30613]" />
            <h2 className="font-display-bold text-lg">
              Carrito
              {totalItems > 0 && (
                <span key={totalItems} className="ml-2 text-sm text-muted-foreground animate-bounce inline-block">
                  ({totalItems})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-2 rounded-full bg-[#E30613] hover:bg-[#c50511] text-white text-sm font-display-bold transition-colors cursor-pointer"
            >
              Ver productos
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedFlavor}`}
                  className="cart-item-enter flex gap-3 p-3 glass-card"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display-bold text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.selectedSize}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedSize, item.selectedFlavor, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded hover:bg-background flex items-center justify-center cursor-pointer"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedSize, item.selectedFlavor, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded hover:bg-background flex items-center justify-center cursor-pointer"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-display-bold text-sm text-[#E30613]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedFlavor)}
                    className="shrink-0 p-1 text-muted-foreground hover:text-[#E30613] transition-colors cursor-pointer"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  clearCart();
                  toast.success('Carrito vaciado');
                }}
                className="w-full text-xs text-muted-foreground hover:text-[#E30613] transition-colors py-2 cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display-black text-2xl text-[#E30613]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-display-bold transition-colors btn-press cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                Pedir por WhatsApp
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
