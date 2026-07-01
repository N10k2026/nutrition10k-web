'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import Header from '@/components/n10k/Header';
import Hero from '@/components/n10k/Hero';
import FeaturedProducts from '@/components/n10k/FeaturedProducts';
import ProductGrid from '@/components/n10k/ProductGrid';
import InteractiveBackground from '@/components/n10k/InteractiveBackground';
import FloatingNavBar from '@/components/n10k/FloatingNavBar';
import BackToTop from '@/components/n10k/BackToTop';
import ScrollProgress from '@/components/n10k/ScrollProgress';
import CookieConsent from '@/components/n10k/CookieConsent';
import WhatsAppButton from '@/components/n10k/WhatsAppButton';
import DeferredSection from '@/components/n10k/DeferredSection';
import { Marquee } from '@/components/n10k/TextAnimations';
import { usePerformancePrefs } from '@/hooks/use-performance-prefs';

const Plasma = dynamic(() => import('@/components/n10k/Plasma'), {
  ssr: false,
  loading: () => null,
});

const AboutSection = dynamic(() => import('@/components/n10k/AboutSection'), {
  loading: () => null,
});
const TestimonialsSection = dynamic(() => import('@/components/n10k/TestimonialsSection'), {
  loading: () => null,
});
const StatsSection = dynamic(() => import('@/components/n10k/StatsSection'), {
  loading: () => null,
});
const RecentlyViewedSection = dynamic(() => import('@/components/n10k/RecentlyViewedSection'), {
  loading: () => null,
});
const NewsletterSection = dynamic(() => import('@/components/n10k/NewsletterSection'), {
  loading: () => null,
});
const Footer = dynamic(() => import('@/components/n10k/Footer'), {
  loading: () => null,
});

const CartSidebar = dynamic(() => import('@/components/n10k/CartSidebar'), {
  ssr: false,
  loading: () => null,
});
const ProductDetail = dynamic(() => import('@/components/n10k/ProductDetail'), {
  ssr: false,
  loading: () => null,
});
const WishlistSidebar = dynamic(() => import('@/components/n10k/WishlistSidebar'), {
  ssr: false,
  loading: () => null,
});
const SearchModal = dynamic(() => import('@/components/n10k/SearchModal'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const prefs = usePerformancePrefs();
  const isCartOpen = useCartStore((state) => state.isOpen);
  const isDetailOpen = useCartStore((state) => state.isDetailOpen);
  const isWishlistOpen = useCartStore((state) => state.isWishlistOpen);
  const isSearchOpen = useCartStore((state) => state.isSearchOpen);

  // Rehydrate persisted store after mount
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // Cross-tab product refresh
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'n10k-nutrition-products-updated') {
        useCartStore.getState().invalidateProducts();
        useCartStore.getState().fetchProducts(true);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Mount-on-first-open pattern for heavy modals
  const [cartMounted, setCartMounted] = useState(false);
  const [detailMounted, setDetailMounted] = useState(false);
  const [wishlistMounted, setWishlistMounted] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isCartOpen) setCartMounted(true);
  }, [isCartOpen]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isDetailOpen) setDetailMounted(true);
  }, [isDetailOpen]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isWishlistOpen) setWishlistMounted(true);
  }, [isWishlistOpen]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isSearchOpen) setSearchMounted(true);
  }, [isSearchOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

      <ScrollProgress />
      <InteractiveBackground />

      <div className="relative z-10 flex flex-col min-h-screen pb-20">
        <Header />

        <main id="main-content" className="flex-1">
          <h1 className="sr-only">Nutrition 10K — Suplementos nutricionales para pérdida de peso y bienestar</h1>
          <Hero />

          {/* Red N10K marquee bar */}
          <section className="py-2 sm:py-3 bg-[#E30613] text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.15) 20px, rgba(0,0,0,0.15) 21px)`,
              }}
            />
            <Marquee
              texts={['NUTRITION 10K', 'LOGRA TU CAMBIO', 'WEIGHT LOSS PARTNERS']}
              speed={80}
              separator="✦"
            />
          </section>

          <FeaturedProducts />

          {/* Second marquee bar (reverse) */}
          <section className="py-2 sm:py-3 bg-[#E30613] text-white relative overflow-hidden">
            <Marquee
              texts={['N10K', 'FUEL YOUR BODY', 'NUTRITION']}
              speed={70}
              reverse
              separator="◆"
            />
          </section>

          <ProductGrid />

          <DeferredSection minHeight="200px">
            <RecentlyViewedSection />
          </DeferredSection>

          {/* Cashea marquee — yellow bar with black text */}
          <div className="bg-[#FFD700] py-2 overflow-hidden relative">
            <div className="flex items-center whitespace-nowrap marquee-cashea">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="flex items-center gap-12 px-6">
                  <span className="text-xs sm:text-sm font-display-bold text-black tracking-[0.08em] uppercase">
                    Compra ahora y paga después
                  </span>
                  <span className="text-xs sm:text-sm font-display-black text-black tracking-[0.1em] uppercase">
                    CASHEA
                  </span>
                </span>
              ))}
            </div>
          </div>

          <StatsSection />

          <TestimonialsSection />

          {/* Unified red gradient section — About + Newsletter share the same background */}
          <div
            className="relative overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at center, #ff1a2e 0%, #E30613 25%, #a80510 50%, #6b030c 75%, #3d0106 100%)',
            }}
          >
            <DeferredSection minHeight="480px" className="relative z-[2]">
              <div id="nosotros">
                <AboutSection />
              </div>
              <div id="newsletter">
                <NewsletterSection />
              </div>
            </DeferredSection>
          </div>
        </main>

        <DeferredSection minHeight="240px">
          <Footer />
        </DeferredSection>
      </div>

      <FloatingNavBar />
      <BackToTop />
      <CookieConsent />
      <WhatsAppButton />

      {cartMounted && <CartSidebar />}
      {detailMounted && <ProductDetail />}
      {wishlistMounted && <WishlistSidebar />}
      {searchMounted && <SearchModal />}
    </div>
  );
}
