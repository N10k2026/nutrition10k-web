'use client';

import { useRef, useEffect, useState } from 'react';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from '@/lib/site-config';

const TYPEWRITER_PHRASES = ['LOGRA TU CAMBIO', 'WEIGHT LOSS PARTNERS', 'N10K', 'NUTRITION'];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);

  // GSAP entrance
  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footerRef.current!,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.footer-col',
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          );
          gsap.fromTo(
            '.footer-bottom',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 },
          );
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  // Typewriter effect
  useEffect(() => {
    let typeInterval: ReturnType<typeof setInterval> | null = null;
    let pauseTimeout: ReturnType<typeof setTimeout> | null = null;
    let eraseInterval: ReturnType<typeof setInterval> | null = null;

    const clearAll = () => {
      if (typeInterval) clearInterval(typeInterval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
      if (eraseInterval) clearInterval(eraseInterval);
    };

    const current = TYPEWRITER_PHRASES[phraseIndex];
    let charIndex = 0;

    typeInterval = setInterval(() => {
      charIndex++;
      setTyped(current.substring(0, charIndex));
      if (charIndex >= current.length) {
        if (typeInterval) clearInterval(typeInterval);
        pauseTimeout = setTimeout(() => {
          eraseInterval = setInterval(() => {
            charIndex--;
            setTyped(current.substring(0, charIndex));
            if (charIndex <= 0) {
              if (eraseInterval) clearInterval(eraseInterval);
              setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
            }
          }, 40);
        }, 2000);
      }
    }, 80);

    return clearAll;
  }, [phraseIndex]);

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#1A1A1A] overflow-hidden"
      aria-label="Pie de página"
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-display-black text-[20vw] sm:text-[15vw] lg:text-[12rem] text-white/[0.03] tracking-tighter select-none whitespace-nowrap">
          NUTRITION 10K
        </span>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        {/* Typewriter */}
        <div className="text-center mb-10">
          <p className="font-display-black text-2xl sm:text-3xl text-white tracking-wide min-h-[2.5rem] flex items-center justify-center">
            {typed}
            <span className="animate-cursor-blink ml-1">|</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Brand + Social — full width on mobile */}
          <div className="footer-col flex flex-col items-center md:items-start gap-4 col-span-2 md:col-span-3">
            <div className="flex items-center gap-3">
              {/* Favicon circular */}
              <img
                src="/brand/favicon.png?v=3"
                alt="Nutrition 10K favicon"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0"
              />
              {/* Logo negativo (para fondos oscuros) */}
              <img
                src="/brand/logo-negative.png?v=3"
                alt="Nutrition 10K"
                className="h-11 sm:h-14 w-auto"
              />
            </div>
            <p className="text-white/70 text-xs sm:text-sm text-center md:text-left max-w-xs">
              Tu aliado para la pérdida de peso y el aumento de tu autoestima.
              Productos formulados y producidos en Estados Unidos.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col flex flex-col items-center md:items-start gap-3">
            <h3 className="font-display-bold text-white text-sm uppercase tracking-wide mb-1">
              Navegación
            </h3>
            {[
              { label: 'Inicio', href: '#inicio' },
              { label: 'Tienda', href: '#catalogo' },
              { label: 'Novedades', href: '#novedades' },
              { label: 'Nosotros', href: '#nosotros' },
              { label: 'Contacto', href: '#newsletter' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="footer-col flex flex-col items-center md:items-start gap-3">
            <h3 className="font-display-bold text-white text-sm uppercase tracking-wide mb-1">
              Contacto
            </h3>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="mailto:info@nutrition10k.com"
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              info@nutrition10k.com
            </a>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="h-4 w-4" />
              Venezuela 🇻🇪
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Nutrition 10K. Weight Loss Partners.
          </p>
          <p className="text-white/50 text-xs">
            Formulado y producido en Estados Unidos 🇺🇸
          </p>
        </div>
      </div>
    </footer>
  );
}
