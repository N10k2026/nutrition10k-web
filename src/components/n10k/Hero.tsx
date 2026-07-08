'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap-init';
import { BlurIn } from '@/components/n10k/TextAnimations';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

const ROTATING_PHRASES: { line1: string; line2: string }[] = [
  { line1: 'LOGRA TU', line2: 'CAMBIO' },
  { line1: 'TU MOMENTO', line2: 'ES HOY' },
];

// Banners del hero — mismas dimensiones (2688×1152 · ratio 2.333), optimizados a WebP.
// Se rotan con cross-fade como fondo del hero.
const HERO_BANNERS: string[] = [
  '/brand/hero-banners/BannerWheyProtein_Chocolate01.webp',
  '/brand/hero-banners/BannerWheyProtein_Chocolate02.webp',
  '/brand/hero-banners/BannerWheyProtein_Cookiesandcream01.webp',
  '/brand/hero-banners/BannerWheyProtein_Cookiesandcream02.webp',
  '/brand/hero-banners/BannerWheyProtein_Envase01.webp',
  '/brand/hero-banners/BannerWheyProtein_Envase02.webp',
  '/brand/hero-banners/BannerWheyProtein_Vainilla01.webp',
  '/brand/hero-banners/BannerWheyProtein_aminostack01.webp',
  '/brand/hero-banners/BannerWheyProtein_aminostackframbuesa01.webp',
  '/brand/hero-banners/BannerWheyProtein_byebyebelly01.webp',
  '/brand/hero-banners/BannerWheyProtein_chocopuff01.webp',
  '/brand/hero-banners/BannerWheyProtein_cla01.webp',
  '/brand/hero-banners/BannerWheyProtein_detox01.webp',
  '/brand/hero-banners/BannerWheyProtein_forever01.webp',
  '/brand/hero-banners/BannerWheyProtein_magic01.webp',
  '/brand/hero-banners/BannerWheyProtein_omg01.webp',
];
const BANNER_INTERVAL = 5000;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Carrusel de banners de fondo (mount-on-demand + cross-fade)
  const [bannerIndex, setBannerIndex] = useState(0);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    if (HERO_BANNERS.length <= 1) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setBannerIndex((prev) => {
        const next = (prev + 1) % HERO_BANNERS.length;
        // Precarga la imagen siguiente para un cross-fade suave
        const preload = new Image();
        preload.src = HERO_BANNERS[(next + 1) % HERO_BANNERS.length];
        setMounted((m) => {
          const copy = new Set(m);
          copy.add(next);
          copy.add((next + 1) % HERO_BANNERS.length);
          return copy;
        });
        return next;
      });
    }, BANNER_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Floating particles entrance
  useEffect(() => {
    if (!particlesRef.current) return;
    const particles = particlesRef.current.querySelectorAll('.hero-particle');
    if (particles.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    gsap.fromTo(
      particles,
      { autoAlpha: 0, scale: 0, y: 50 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        delay: 0.5,
      },
    );
  }, []);

  // Scroll hint
  useEffect(() => {
    const hint = heroRef.current?.querySelector('.scroll-hint');
    if (!hint) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    gsap.to(hint, {
      y: 8,
      duration: 1.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2,
    });
  }, []);

  // Rotating phrases — change every 3.5 seconds with GSAP animation
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const interval = setInterval(() => {
      if (!phraseRef.current) return;

      // Fade out current phrase
      gsap.to(phraseRef.current, {
        autoAlpha: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
          // Fade in new phrase
          gsap.fromTo(
            phraseRef.current,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            },
          );
        },
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentPhrase = ROTATING_PHRASES[phraseIndex];

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative w-full flex items-center justify-center overflow-hidden min-h-[88svh] md:min-h-[600px] md:aspect-[2688/1152]"
    >
      {/* Background — carrusel de banners con cross-fade (ratio 2688×1152) */}
      <div className="absolute inset-0 z-0">
        {HERO_BANNERS.map((src, i) =>
          mounted.has(i) ? (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={i !== bannerIndex}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === bannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E30613]/15 via-transparent to-[#E30613]/15" />
      </div>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 z-[1] pointer-events-none">
        {[
          { x: '15%', y: '20%', size: 6, opacity: 0.4 },
          { x: '80%', y: '25%', size: 4, opacity: 0.3 },
          { x: '25%', y: '70%', size: 8, opacity: 0.25 },
          { x: '70%', y: '65%', size: 5, opacity: 0.35 },
          { x: '50%', y: '15%', size: 3, opacity: 0.3 },
          { x: '90%', y: '50%', size: 7, opacity: 0.2 },
        ].map((p, i) => (
          <div
            key={i}
            className="hero-particle absolute rounded-full bg-[#E30613]"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-16 md:py-0">
        <BlurIn delay={0.2}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-display-bold uppercase tracking-[0.2em] mb-6">
            Weight Loss Partners
          </span>
        </BlurIn>

        {/* Rotating phrases */}
        <div ref={phraseRef} className="mb-2" style={{ minHeight: '2.5em' }}>
          <h1 className="font-display-black text-4xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.1]">
            <span className="block text-white">{currentPhrase.line1}</span>
            <span className="block text-[#E30613]">{currentPhrase.line2}</span>
          </h1>
        </div>

        <BlurIn delay={1}>
          <p className="text-lg sm:text-xl text-white/80 mt-6 max-w-2xl mx-auto">
            Tu aliado para la pérdida de peso y el aumento de tu autoestima.
            Productos formulados y producidos en Estados Unidos.
          </p>
        </BlurIn>

        <BlurIn delay={1.2}>
          <p className="text-[#E30613] font-display-bold text-base sm:text-lg mt-4">
            BAJA DE 6,8 HASTA 10 KILOS
          </p>
        </BlurIn>

        <BlurIn delay={1.4}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button
              size="lg"
              className="bg-[#E30613] hover:bg-[#c50511] text-white font-display-bold px-8"
              onClick={() => {
                document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Productos
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#E30613] font-display-bold px-8"
              onClick={() => {
                document.querySelector('#nosotros')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Conoce la Marca
            </Button>
          </div>
        </BlurIn>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-hint">
        <ChevronDown className="h-6 w-6 text-white/50" />
      </div>
    </section>
  );
}
