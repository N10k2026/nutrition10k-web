'use client';

import { useRef, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { BlurIn } from '@/components/n10k/TextAnimations';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';
import { useScrollVisibleWithRef, useStaggerChildren } from '@/hooks/use-scroll-visible';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'María G.',
    location: 'Caracas',
    text: 'Bajé 8 kilos en 2 meses con Keto 10K y DeTox. ¡Mi autoestima está por las nubes! Me siento más fuerte y con mucha más energía.',
    rating: 5,
    product: 'Keto 10K + DeTox',
  },
  {
    name: 'Carlos R.',
    location: 'Maracaibo',
    text: 'El Magic 10K me da la energía para entrenar todos los días. Resultados increíbles en pocas semanas. Lo recomiendo al 100%.',
    rating: 5,
    product: 'Magic 10K',
  },
  {
    name: 'Ana M.',
    location: 'Valencia',
    text: 'Bye Bye Belly cambió mi vida. La inflamación desapareció y me siento mucho mejor después de cada comida. ¡Un salvavidas!',
    rating: 5,
    product: 'Bye Bye Belly',
  },
  {
    name: 'José P.',
    location: 'Barquisimeto',
    text: 'La Whey Protein Space Edition tiene el mejor sabor que he probado. 25g de proteína pura por servicio y se disuelve perfecto.',
    rating: 5,
    product: 'Whey Protein Space Edition',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibleWithRef(sectionRef, 0.1);
  useStaggerChildren(sectionRef, isVisible, '.testimonial-card', 0.15);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.testimonial-card');
      gsap.set(cards, { autoAlpha: 0, y: 40, scale: 0.95 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`py-8 sm:py-20 px-4 relative overflow-hidden bg-[#D5D5D5] animate-section-slide-up ${isVisible ? 'is-visible' : ''}`}
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <BlurIn delay={0.1} duration={0.8}>
          <div className="text-center mb-6 sm:mb-12">
            <p className="text-[.65rem] font-display-bold tracking-[.2em] uppercase text-[#E30613] mb-2 flex items-center justify-center gap-2.5">
              <span className="inline-block w-5 h-[1.5px] bg-[#E30613]" />
              Lo que dicen nuestros clientes
              <span className="inline-block w-5 h-[1.5px] bg-[#E30613]" />
            </p>
            <h2 className="font-display-extrabold text-foreground leading-[.95] text-2xl sm:text-4xl md:text-5xl tracking-[-0.01em]">
              OPINIONES REALES
            </h2>
          </div>
        </BlurIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="testimonial-card glass-card-pro p-4 sm:p-6 group transition-all duration-500"
            >
              {/* Quote icon */}
              <Quote className="h-6 w-6 text-[#E30613] mb-3 transition-colors" />

              {/* Rating */}
              <div className="flex gap-0.5 mb-3" role="img" aria-label={`${testimonial.rating} de 5 estrellas`}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 ${si < testimonial.rating ? 'text-[#E30613] fill-[#E30613]' : 'text-foreground/30'}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/90 text-xs sm:text-sm leading-relaxed mb-4 font-display-medium">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#E30613]/15">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E30613] to-[#ff4d4f] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-display-black">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-foreground text-xs font-display-bold">{testimonial.name}</p>
                  <p className="text-muted-foreground text-[10px] font-display-medium">{testimonial.location}</p>
                </div>
              </div>

              {/* Product badge */}
              <div className="mt-3">
                <span className="inline-block bg-[#E30613]/10 text-[#E30613] text-[9px] font-display-bold tracking-wider uppercase px-2 py-0.5 rounded-full">
                  {testimonial.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
