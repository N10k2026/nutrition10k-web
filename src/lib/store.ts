import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devError } from "./dev-log";
import { isProductSizeOutOfStock } from "./product-utils";
import {
  PRODUCTS as STATIC_PRODUCTS,
  type NutritionProduct,
  type ProductCategory,
} from "@/data/products";

const MAX_CART_QUANTITY = 99;

/**
 * Product shape used by the storefront (a slim view of NutritionProduct
 * plus e-commerce fields like images/outOfStock that may come from the API
 * or static fallback).
 */
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  /** Images grouped by flavor name (for Whey Protein). */
  flavorImages?: Record<string, string[]>;
  sizes: string[];
  /** Sizes/presentations that are currently out of stock. */
  outOfStock?: string[];
  /** Per-size pricing override (size label → price in USD). */
  sizePricing?: Record<string, number>;
  /** Flavors with their brand color swatch (only for Whey Protein). */
  flavors?: { name: string; hex: string }[];
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  /** Product video URL for hover/preview playback (optional). */
  video?: string;
  rating?: number;
  slug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedFlavor: string;
  /** Precio unitario resuelto según la presentación seleccionada al agregar. */
  unitPrice: number;
}

export interface WishlistItem {
  productId: string;
  flavorName: string;
}

export const categories: { id: ProductCategory | "Todos"; label: string }[] = [
  { id: "Todos", label: "Todos" },
  { id: "Digestión", label: "Digestión" },
  { id: "Quemadores", label: "Quemadores" },
  { id: "Inhibidores", label: "Inhibidores" },
  { id: "Cetogénicos", label: "Cetogénicos" },
  { id: "Proteínas", label: "Proteínas" },
  { id: "Rendimiento", label: "Rendimiento" },
  { id: "Nutracéuticos", label: "Nutracéuticos" },
  { id: "Longevidad", label: "Longevidad" },
];

// Guard to prevent concurrent fetch calls
export const fetchGuard = { inProgress: false };

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Convert a NutritionProduct (rich, typed catalog entry) into the slim
 * Product shape the storefront components expect.
 */
export function toStoreProduct(p: NutritionProduct): Product {
  // Placeholder image until the client provides real product photos.
  // Uses the product's brand color as a data-URI SVG so cards always render.
  const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='${p.brandColor}'/><text x='50%' y='50%' font-family='sans-serif' font-size='28' font-weight='bold' fill='${p.brandColorFg}' text-anchor='middle' dominant-baseline='middle'>${p.name}</text></svg>`,
  )}`;

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price ?? 0,
    originalPrice: p.originalPrice,
    image: p.image ?? placeholder,
    images: p.images?.length ? p.images : [placeholder],
    sizes: p.sizes,
    outOfStock: [],
    sizePricing: p.sizePricing,
    flavors:
      p.category === "Proteínas"
        ? [{ name: p.name, hex: p.brandColor }]
        : undefined,
    description: p.description,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    rating: p.rating,
    slug: p.slug,
  };
}

interface CartStore {
  items: CartItem[];
  products: Product[];
  productsStatus: FetchStatus;
  productsError: string | null;
  isOpen: boolean;
  isDetailOpen: boolean;
  selectedProduct: Product | null;
  preselectedFlavor: string | null;
  // Recently viewed
  recentlyViewed: string[];
  // Search modal
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setOpen: (open: boolean) => void;
  setDetailOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setPreselectedFlavor: (flavor: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, flavor: string) => void;
  updateQuantity: (productId: string, size: string, flavor: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  fetchProducts: (force?: boolean) => Promise<void>;
  invalidateProducts: () => void;
  // Wishlist
  wishlist: WishlistItem[];
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  toggleWishlistItem: (productId: string, flavorName: string) => void;
  removeWishlistItem: (productId: string, flavorName: string) => void;
  clearWishlist: () => void;
  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Seed products from static catalog immediately so the storefront
      // always has data (no flash of empty grid).
      items: [],
      products: STATIC_PRODUCTS.map(toStoreProduct),
      productsStatus: 'success' as FetchStatus,
      productsError: null,
      isOpen: false,
      isDetailOpen: false,
      selectedProduct: null,
      preselectedFlavor: null,
      recentlyViewed: [],
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setOpen: (open) => set({ isOpen: open }),
      setDetailOpen: (open) => set({ isDetailOpen: open }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setPreselectedFlavor: (flavor) => set({ preselectedFlavor: flavor }),
      addItem: (item) => {
        if (isProductSizeOutOfStock(item.product, item.selectedSize)) return;
        const qty = Math.min(Math.max(1, item.quantity), MAX_CART_QUANTITY);
        const items = get().items;
        // Resolver el precio unitario según la presentación seleccionada
        const resolvedUnitPrice =
          item.unitPrice ??
          (item.product.sizePricing?.[item.selectedSize] ?? item.product.price);
        const existing = items.find(
          (i) =>
            i.product.id === item.product.id &&
            i.selectedSize === item.selectedSize &&
            i.selectedFlavor === item.selectedFlavor
        );
        if (existing) {
          const nextQty = Math.min(existing.quantity + qty, MAX_CART_QUANTITY);
          set({
            items: items.map((i) =>
              i.product.id === item.product.id &&
              i.selectedSize === item.selectedSize &&
              i.selectedFlavor === item.selectedFlavor
                ? { ...i, quantity: nextQty, unitPrice: resolvedUnitPrice }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: qty, unitPrice: resolvedUnitPrice }] });
        }
      },
      removeItem: (productId, size, flavor) => {
        set({
          items: get().items.filter(
            (i) =>
              !(i.product.id === productId &&
                i.selectedSize === size &&
                i.selectedFlavor === flavor)
          ),
        });
      },
      updateQuantity: (productId, size, flavor, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, flavor);
          return;
        }
        const capped = Math.min(quantity, MAX_CART_QUANTITY);
        set({
          items: get().items.map((i) =>
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedFlavor === flavor
              ? { ...i, quantity: capped }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + (i.unitPrice ?? i.product.price) * i.quantity, 0),
      wishlist: [],
      isWishlistOpen: false,
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      toggleWishlistItem: (productId, flavorName) => {
        const current = get().wishlist;
        const existing = current.find((w) => w.productId === productId && w.flavorName === flavorName);
        if (existing) {
          set({ wishlist: current.filter((w) => !(w.productId === productId && w.flavorName === flavorName)) });
        } else {
          set({ wishlist: [...current, { productId, flavorName }] });
        }
      },
      removeWishlistItem: (productId, flavorName) => {
        set({ wishlist: get().wishlist.filter((w) => !(w.productId === productId && w.flavorName === flavorName)) });
      },
      clearWishlist: () => set({ wishlist: [] }),
      addRecentlyViewed: (productId) => {
        const current = get().recentlyViewed.filter((id) => id !== productId);
        set({ recentlyViewed: [productId, ...current].slice(0, 10) });
      },
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
      fetchProducts: async (force?: boolean) => {
        const state = get();
        if ((!force && state.productsStatus === 'success') || fetchGuard.inProgress) return;
        fetchGuard.inProgress = true;
        set({ productsStatus: 'loading', productsError: null });

        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1500;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            const res = await fetch(`/api/products?_t=${Date.now()}`, {
              cache: 'no-store',
            });
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
              if (attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
                continue;
              }
              throw new Error('El servidor no está disponible. Intenta de nuevo más tarde.');
            }
            if (!res.ok) {
              const errorData = await res.json().catch(() => null);
              const msg = errorData?.error || `Error del servidor (${res.status})`;
              throw new Error(msg);
            }
            const data = await res.json();
            if (!Array.isArray(data)) {
              throw new Error('Respuesta de catálogo inválida');
            }
            set({ products: data, productsStatus: 'success', productsError: null });
            fetchGuard.inProgress = false;
            return;
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            if (attempt < MAX_RETRIES) {
              await new Promise(r => setTimeout(r, RETRY_DELAY * attempt));
              continue;
            }
            devError('Failed to fetch products after retries:', message);
            // Fallback to static products on error
            set({
              products: STATIC_PRODUCTS.map(toStoreProduct),
              productsStatus: 'success',
              productsError: null,
            });
          }
        }

        fetchGuard.inProgress = false;
      },
      invalidateProducts: () => {
        set({ productsStatus: 'idle', productsError: null });
      },
    }),
    {
      name: 'n10k-nutrition-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
      }),
      skipHydration: true,
    }
  )
);

/** Derived selector: total cart item count */
export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

/** Derived selector: wishlist as a Set of composite keys for O(1) lookups */
export const selectWishlistSet = (state: CartStore) =>
  new Set(state.wishlist.map((w) => `${w.productId}|${w.flavorName}`));
