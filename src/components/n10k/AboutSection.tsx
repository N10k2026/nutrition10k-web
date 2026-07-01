'use client';

import { useRef, useEffect } from 'react';
import { SplitChars, SplitWords, BlurIn } from '@/components/n10k/TextAnimations';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { INSTAGRAM_URL, SITE_URL } from '@/lib/site-config';

/**
 * AboutSection — Brand story for Nutrition 10K.
 *
 * Adapted from /tmp/n10k-store/src/components/n10k/AboutSection.tsx.
 * - Streetwear story → weight-loss + self-esteem supplement story.
 * - "Live Limitless" → "Weight Loss Partners" / "Logra tu cambio".
 * - Value cards: Fuerza / Resistencia / Energía / Bienestar (lucide icons).
 * - Moving marquee background now shows: "NUTRITION 10K", "LOGRA TU CAMBIO",
 *   "WEIGHT LOSS PARTNERS".
 * - GSAP ScrollTrigger entrance kept (story card x:-60, value cards stagger
 *   y:40 scale:0.95) with gsap.context() + ctx.revert() cleanup.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Story card slides in from the left.
      if (storyRef.current) {
        gsap.set(storyRef.current, { autoAlpha: 0, x: -60 });
        ScrollTrigger.create({
          trigger: storyRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(storyRef.current, {
              autoAlpha: 1,
              x: 0,
              duration: 1,
              ease: 'power3.out',
            });
          },
        });
      }

      // Value cards staggered reveal.
      if (valuesRef.current) {
        const cards = valuesRef.current.querySelectorAll('.value-card');
        gsap.set(cards, { autoAlpha: 0, y: 40, scale: 0.95 });
        ScrollTrigger.create({
          trigger: valuesRef.current,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power3.out',
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-5 sm:py-20 px-4 relative overflow-hidden"
    >
      {/* ===== Moving Background Text (3 rows at different speeds) ===== */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Row 1 - scrolling right */}
        <div className="absolute top-[10%] left-0 w-full">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'marquee-scroll 50s linear infinite' }}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={`a1-${i}`}
                className="font-display-black text-[10vw] sm:text-[8vw] uppercase tracking-[0.06em] text-white/[0.08] blur-[2px] px-4 select-none"
              >
                NUTRITION 10K
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 - scrolling left, "LOGRA TU CAMBIO" */}
        <div className="absolute top-[30%] left-0 w-full">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'marquee-scroll 55s linear infinite reverse' }}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={`a1b-${i}`}
                className="font-display-black text-[8vw] sm:text-[6vw] uppercase tracking-[0.15em] text-white/[0.06] blur-[2px] px-4 select-none"
              >
                LOGRA TU CAMBIO
              </span>
            ))}
          </div>
        </div>

        {/* Row 3 - scrolling left, "WEIGHT LOSS PARTNERS" */}
        <div className="absolute top-[50%] left-0 w-full">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'marquee-scroll 60s linear infinite reverse' }}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={`a2-${i}`}
                className="font-display-black text-[12vw] sm:text-[10vw] uppercase tracking-[0.04em] text-white/[0.06] blur-[3px] px-6 select-none"
              >
                WEIGHT LOSS PARTNERS
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay on top of moving text */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E30613]/0 rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-4 sm:mb-16 text-center">
          <BlurIn delay={0.1} duration={0.8}>
            <p className="text-[.65rem] font-display-bold tracking-[.2em] uppercase text-white mb-6 sm:mb-10">
              Nuestra Esencia
            </p>
          </BlurIn>
          <SplitChars
            text="SOMOS NUTRITION 10K"
            tag="h2"
            className="font-display-extrabold text-white leading-[.95] break-words"
            style={{ fontSize: 'clamp(2rem, 8vw, 5.5rem)', letterSpacing: '.04em' }}
            staggerDelay={0.06}
            threshold={0.2}
          />
          {/* Inline section divider */}
          <div className="relative mt-3 sm:mt-4 mx-auto w-[120px] h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[0.6rem] px-2"
            >
              ◆
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-12 items-center">
          {/* Left - Brand Story */}
          <div ref={storyRef}>
            <div className="glass-card-strong gradient-border p-3 sm:p-8">
              <div className="flex items-center gap-3 mb-2 sm:mb-6">
                <img
                  src="/brand/logo.png?v=2"
                  alt="Nutrition 10K®"
                  className="h-14 sm:h-28 w-auto object-contain"
                  style={{
                    filter: 'none',
                  }}
                />
              </div>

              <SplitWords
                text="Nutrition 10K es una empresa comprometida con la transformación integral, la pérdida de peso y el aumento de tu autoestima. Sabemos que tu cuerpo es tu mayor proyecto, y por eso te acompañamos en cada paso hacia la mejor versión de ti."
                className="text-foreground/80 text-[10px] sm:text-sm md:text-base leading-relaxed mb-1 sm:mb-4 font-display-medium"
                staggerDelay={0.04}
                threshold={0.1}
              />
              <SplitWords
                text="Nuestros productos están formulados y producidos en EE. UU. con los más altos estándares de calidad. Combinamos ciencia, energía y motivación para que logres tu cambio en tiempo récord."
                className="text-foreground/80 text-[10px] sm:text-sm md:text-base leading-relaxed mb-1 sm:mb-4 font-display-medium"
                staggerDelay={0.04}
                threshold={0.1}
              />
              <SplitWords
                text="Desde quemadores y detox hasta proteínas y vitaminas: cada fórmula está diseñada para que bajes de 6,8 hasta 10 kilos y sientas la confianza que mereces."
                className="text-foreground/80 text-[10px] sm:text-sm md:text-base leading-relaxed mb-2 sm:mb-6 font-display-medium"
                staggerDelay={0.04}
                threshold={0.1}
              />

              <div className="flex items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E30613] font-bold text-xs sm:text-sm tracking-wider uppercase hover:underline"
                >
                  @NUTRITION10K
                </a>
                <span className="text-foreground/60" aria-hidden="true">|</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 font-bold text-xs sm:text-sm tracking-wider uppercase hover:text-[#E30613] hover:underline"
                >
                  NUTRITION10K.COM
                </a>
              </div>
            </div>
          </div>

          {/* Right - Values */}
          <div ref={valuesRef} className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-4">
            <div className="value-card glass-card-pro p-2.5 sm:p-6 group">
              <h4 className="text-foreground font-display-extrabold text-xs sm:text-lg sm:text-xl mb-0.5 sm:mb-2">
                Fuerza <span aria-hidden="true" className="text-base sm:text-2xl">🔋</span>
              </h4>
              <p className="text-foreground/80 text-[9px] sm:text-xs sm:text-sm leading-snug sm:leading-relaxed font-display-medium line-clamp-2 sm:line-clamp-none">
                Fórmulas que potencian tu rendimiento y te dan la chispa para no rendirte.
              </p>
            </div>
            <div className="value-card glass-card-pro p-2.5 sm:p-6 group">
              <h4 className="text-foreground font-display-extrabold text-xs sm:text-lg sm:text-xl mb-0.5 sm:mb-2">
                Resistencia <span aria-hidden="true" className="text-base sm:text-2xl">🛡️</span>
              </h4>
              <p className="text-foreground/80 text-[9px] sm:text-xs sm:text-sm leading-snug sm:leading-relaxed font-display-medium line-clamp-2 sm:line-clamp-none">
                Energía sostenida todo el día. Soporta tu rutina sin caídas ni rebotes.
              </p>
            </div>
            <div className="value-card glass-card-pro p-2.5 sm:p-6 group">
              <h4 className="text-foreground font-display-extrabold text-xs sm:text-lg sm:text-xl mb-0.5 sm:mb-2">
                Energía <span aria-hidden="true" className="text-base sm:text-2xl">⚡</span>
              </h4>
              <p className="text-foreground/80 text-[9px] sm:text-xs sm:text-sm leading-snug sm:leading-relaxed font-display-medium line-clamp-2 sm:line-clamp-none">
                Despierta con vitalidad. Quema grasa desde las primeras horas de la mañana.
              </p>
            </div>
            <div className="value-card glass-card-pro p-2.5 sm:p-6 group">
              <h4 className="text-foreground font-display-extrabold text-xs sm:text-lg sm:text-xl mb-0.5 sm:mb-2">
                Bienestar <span aria-hidden="true" className="text-base sm:text-2xl">💚</span>
              </h4>
              <p className="text-foreground/80 text-[9px] sm:text-xs sm:text-sm leading-snug sm:leading-relaxed font-display-medium line-clamp-2 sm:line-clamp-none">
                Cuida tu cuerpo y tu mente. Más autoestima, más confianza, más vida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
