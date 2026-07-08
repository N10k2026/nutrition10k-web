'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useCartStore } from '@/lib/store';
import { PRODUCTS } from '@/data/products';
import { parseStoredStringArray, getProductShareUrl, hasMultiPrice, getProductMinPrice } from '@/lib/product-utils';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

const RECENT_SEARCHES_KEY = 'n10k-nutrition-recent-searches';

export default function SearchModal() {
  const isOpen = useCartStore((s) => s.isSearchOpen);
  const setSearchOpen = useCartStore((s) => s.setSearchOpen);
  const setSelectedProduct = useCartStore((s) => s.setSelectedProduct);
  const setDetailOpen = useCartStore((s) => s.setDetailOpen);
  const addRecentlyViewed = useCartStore((s) => s.addRecentlyViewed);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, () => setSearchOpen(false), containerRef);

  // Load recent searches
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecentSearches(parseStoredStringArray(localStorage.getItem(RECENT_SEARCHES_KEY)));
    }
  }, [isOpen]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [debouncedQuery]);

  const handleSelectProduct = (productId: string, productName: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    // Save to recent searches
    const current = parseStoredStringArray(localStorage.getItem(RECENT_SEARCHES_KEY));
    const updated = [productName, ...current.filter((s) => s !== productName)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    // Open product detail (convert NutritionProduct to store Product shape)
    const storeProduct = useCartStore.getState().products.find((p) => p.id === productId);
    if (storeProduct) {
      setSelectedProduct(storeProduct);
      setDetailOpen(true);
      addRecentlyViewed(productId);
    }
    setSearchOpen(false);
  };

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelectProduct(results[selectedIndex].id, results[selectedIndex].name);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, results, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[10vh]">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setSearchOpen(false)}
      />
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar productos..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
            aria-label="Buscar productos"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results / Recent */}
        <div className="max-h-[50vh] overflow-y-auto">
          {debouncedQuery.trim() && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron productos para "{debouncedQuery}"
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id, product.name)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                    index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 overflow-hidden border border-border bg-muted"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: product.brandColor }}
                      >
                        {product.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display-bold text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
                  </div>
                  {product.price ? (
                    <span className="font-display-bold text-sm text-[#E30613] shrink-0">
                      {hasMultiPrice(product) ? 'Desde ' : ''}${getProductMinPrice(product)}
                    </span>
                  ) : null}
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {!debouncedQuery.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Búsquedas recientes
              </p>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(search)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer text-left"
                >
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
