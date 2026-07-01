'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore, selectTotalItems } from '@/lib/store';
import { useFocusTrap } from '@/hooks/use-focus-trap';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const setSearchOpen = useCartStore((s) => s.setSearchOpen);
  const setWishlistOpen = useCartStore((s) => s.setWishlistOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const totalItems = useCartStore(selectTotalItems);

  // Hydration-safe: don't render localStorage-dependent UI until client mounts
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFocusTrap(menuOpen, () => setMenuOpen(false));

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Tienda', href: '#catalogo' },
    { label: 'Novedades', href: '#novedades' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#newsletter' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href === '#inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(227,6,19,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inicio');
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <img
              src="/brand/logo.png?v=2"
              alt="Nutrition 10K"
              className="h-11 sm:h-14 w-auto transition-all duration-300"
              style={{
                filter: 'none',
              }}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-sm font-display-semibold transition-colors gradient-underline ${
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                scrolled ? 'hover:bg-foreground/5' : 'hover:bg-white/10'
              }`}
              aria-label="Buscar productos"
            >
              <Search className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                scrolled ? 'hover:bg-foreground/5' : 'hover:bg-white/10'
              }`}
              aria-label="Ver favoritos"
            >
              <Heart className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            </button>

            <button
              onClick={() => setOpen(true)}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                scrolled ? 'hover:bg-foreground/5' : 'hover:bg-white/10'
              }`}
              aria-label={`Carrito${mounted && totalItems > 0 ? `, ${totalItems} artículos` : ''}`}
            >
              <ShoppingBag className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E30613] text-white text-[10px] font-black rounded-full h-5 min-w-[20px] flex items-center justify-center shadow-md animate-pulse-red">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors cursor-pointer ${
                scrolled ? 'hover:bg-foreground/5' : 'hover:bg-white/10'
              }`}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} />
              ) : (
                <Menu className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-background border-l border-border shadow-2xl animate-slide-in-right p-6 pt-20">
            <nav className="flex flex-col gap-4" aria-label="Navegación móvil">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-lg font-display-bold text-foreground hover:text-[#E30613] transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
