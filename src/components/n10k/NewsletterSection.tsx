'use client';

import { Button } from '@/components/ui/button';
import { Instagram, MessageCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { SplitChars, BlurFadeUp, BlurIn } from '@/components/n10k/TextAnimations';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useScrollVisibleWithRef } from '@/hooks/use-scroll-visible';
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from '@/lib/site-config';

export default function NewsletterSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibleWithRef(sectionRef, 0.1);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { autoAlpha: 0, y: 40, scale: 0.97 });
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(cardRef.current, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
          });
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // Build the WhatsApp deep-link with a pre-filled message.
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola Nutrition 10K, quiero información sobre sus productos'
  )}`;

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className={`py-5 sm:py-24 md:py-32 px-4 relative overflow-hidden animate-section-fade-scale ${isVisible ? 'is-visible' : ''}`}
    >
      {/* ===== Moving Background Text (4 rows at various speeds) ===== */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[5%] left-0 w-full">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee-scroll 45s linear infinite' }}>
            {[...Array(8)].map((_, i) => (
              <span
                key={`r1-${i}`}
                className="font-display-black text-[12vw] sm:text-[10vw] md:text-[8vw] uppercase tracking-[0.08em] text-white/[0.08] blur-[2px] px-4 select-none"
              >
                N10K
              </span>
            ))}
          </div>
        </div>
        <div className="absolute top-[30%] left-0 w-full">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee-scroll 55s linear infinite reverse' }}>
            {[...Array(6)].map((_, i) => (
              <span
                key={`r2-${i}`}
                className="font-display-black text-[14vw] sm:text-[12vw] md:text-[10vw] uppercase tracking-[0.05em] text-white/[0.07] blur-[3px] px-6 select-none"
              >
                LOGRA TU CAMBIO
              </span>
            ))}
          </div>
        </div>
        <div className="absolute top-[60%] left-0 w-full hidden sm:block">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee-scroll 65s linear infinite' }}>
            {[...Array(8)].map((_, i) => (
              <span
                key={`r3-${i}`}
                className="font-display-black text-[11vw] sm:text-[9vw] md:text-[7vw] uppercase tracking-[0.1em] text-white/[0.06] blur-[2px] px-4 select-none"
              >
                NUTRITION 10K
              </span>
            ))}
          </div>
        </div>
        <div className="absolute top-[85%] left-0 w-full hidden sm:block">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee-scroll 75s linear infinite reverse' }}>
            {[...Array(10)].map((_, i) => (
              <span
                key={`r4-${i}`}
                className="font-display-black text-[8vw] sm:text-[7vw] md:text-[5vw] uppercase tracking-[0.12em] text-white/[0.06] blur-[1px] px-3 select-none"
              >
                N10K ✦
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000000]/20 to-transparent" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div ref={cardRef} className="glass-card-pro p-4 sm:p-10 md:p-12">
          <BlurIn delay={0.1} duration={0.8}>
            <div className="mx-auto mb-2 sm:mb-6">
              <img
                src="/brand/logo.png?v=2"
                alt="Nutrition 10K®"
                className="h-14 sm:h-28 md:h-32 w-auto object-contain mx-auto"
                style={{ filter: 'none' }}
              />
            </div>
            <p className="text-gradient-red font-display-black text-[10px] sm:text-sm tracking-[0.3em] uppercase mt-2 sm:mt-3">
              Weight Loss Partners
            </p>
          </BlurIn>
          <SplitChars
            text="ÚNETE AL MOVIMIENTO"
            tag="h2"
            className="text-base sm:text-3xl md:text-4xl font-display-extrabold text-foreground tracking-[-0.01em] mb-2 sm:mb-4 break-words"
            staggerDelay={0.04}
            threshold={0.2}
          />
          <BlurFadeUp delay={0.3} duration={0.8} translateY={20} threshold={0.1}>
            <p className="text-foreground/80 text-[11px] sm:text-base md:text-lg mb-4 sm:mb-8 leading-relaxed font-display-medium break-words">
              Súmate a la comunidad Nutrition 10K. Sé el primero en conocer nuevos lanzamientos, ofertas exclusivas y los hábitos que están ayudando a miles de personas a lograr su cambio.
            </p>
          </BlurFadeUp>

          {/* Social Media Contact — Instagram & WhatsApp only */}
          <BlurFadeUp delay={0.35} duration={0.8} translateY={20} threshold={0.1}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-md mx-auto">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-display-bold h-10 sm:h-14 px-4 sm:px-6 rounded-xl tracking-wider uppercase whitespace-nowrap sm:hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 cursor-pointer text-xs sm:text-sm cta-shimmer"
              >
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5" />
                  Instagram
                </a>
              </Button>
              <Button
                asChild
                className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white font-display-bold h-10 sm:h-14 px-4 sm:px-6 rounded-xl tracking-wider uppercase whitespace-nowrap sm:hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 cursor-pointer text-xs sm:text-sm"
              >
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1.5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </BlurFadeUp>

          <BlurIn delay={0.5} duration={0.8}>
            <div className="mt-3 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1 text-white/80 text-[9px] sm:text-xs">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Respuesta rápida
              </div>
              <div className="w-px h-3 bg-white/30" aria-hidden="true" />
              <div className="flex items-center gap-1 text-white/80 text-[9px] sm:text-xs">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                Atención personalizada
              </div>
            </div>
          </BlurIn>
        </div>
      </div>
    </section>
  );
}
