// src/features/home/components/Hero/Hero.tsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dancerImg from '@shared/assets/dancer human+robot.png';
import { useTheme } from '@app/providers/theme-provider';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const dancerRef = useRef<HTMLImageElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Text entrance — runs on all breakpoints
      gsap.from('.hero-text-anim', {
        y: 40, opacity: 0,
        stagger: 0.12, duration: 0.9,
        ease: 'power2.out', delay: 0.2,
      });

      if (!isMobile) {
        // Desktop: dancer slides in from the left
        gsap.from(dancerRef.current!, {
          x: -180, opacity: 0,
          duration: 1.4, ease: 'power3.out', delay: 0.5,
        });

        // Desktop: dancer drifts out on scroll
        ScrollTrigger.create({
          trigger: heroRef.current!,
          start: 'center top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: self => {
            gsap.set(dancerRef.current!, {
              x: -self.progress * 250,
              opacity: 1 - self.progress,
            });
          },
        });
      } else {
        // Mobile: dancer fades in subtly
        gsap.from(dancerRef.current!, {
          opacity: 0, duration: 1.8, ease: 'power2.out', delay: 0.6,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="h-screen overflow-hidden relative"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* ── Decorative cobra SVG ────────────────────────────────────
          Desktop: top-right large
          Mobile:  top-right small, reduced opacity              */}
      <svg
        className="absolute top-16 right-5 md:right-20 w-16 h-16 md:w-32 md:h-32 opacity-10 md:opacity-20 pointer-events-none"
        style={{ animation: 'float 4s ease-in-out infinite' }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 C30 25 20 50 35 70 C40 78 50 85 50 90 C50 85 60 78 65 70 C80 50 70 25 50 10Z"
          stroke="hsl(var(--crimson))" strokeWidth="0.5"
        />
        <circle cx="42" cy="45" r="2" fill="hsl(var(--crimson))" opacity="0.5" />
        <circle cx="58" cy="45" r="2" fill="hsl(var(--crimson))" opacity="0.5" />
      </svg>

      {/* ── Dancer image ─────────────────────────────────────────────
          Mobile:  absolute, centered, bottom-anchored, small + faint
                   sits BEHIND text via z-index
          Desktop: absolute left-0 bottom-0, full height, original    */}
      <img
        ref={dancerRef}
        src={dancerImg}
        alt=""
        aria-hidden
        className={[
          // shared
          'absolute bottom-0 object-contain pointer-events-none select-none',
          // mobile — centered ghost behind text
          'left-1/2 -translate-x-1/2 h-[52vh] w-auto opacity-30 z-0',
          // desktop — original position, full opacity handled by GSAP
          'md:left-0 md:translate-x-0 md:h-[92vh] md:opacity-100 md:z-0',
        ].join(' ')}
        style={{
          mixBlendMode: isDark ? 'screen' : 'multiply',
          filter: `drop-shadow(40px 0px 70px hsla(var(--crimson), 0.2))`,
        }}
      />

      {/* ── Text content ─────────────────────────────────────────────
          Mobile:  full-width, left-aligned, starts near top
          Desktop: right 55 %, original padding                      */}
      <div
        className={[
          'relative z-10 h-full flex flex-col justify-start',
          // mobile: full width, horizontal padding
          'w-full px-7 pt-[18vh]',
          // desktop: right 55 %, original right padding
          'md:ml-auto md:w-[55%] md:px-0 md:pr-[max(60px,6vw)]',
        ].join(' ')}
      >
        {/* Eyebrow */}
        <p className="hero-text-anim font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-gold">
          // Senior Software Engineer
          <span style={{ animation: 'blink 0.8s infinite' }}>|</span>
        </p>

        {/* Name */}
        <h1 className="hero-text-anim font-jakarta font-extrabold leading-none mt-4 text-foreground
                        text-[clamp(52px,12vw,72px)] tracking-tight">
          Gara Yaka
        </h1>

        {/* Tagline */}
        <h2 className="hero-text-anim font-jakarta font-bold leading-none text-crimson
                        text-[clamp(28px,7vw,70px)] tracking-tight">
          Crafting <em className="font-playfair italic font-medium">Systems</em>.
        </h2>

        {/* Description — shorter on mobile to avoid overflow */}
        <p className="hero-text-anim font-sans leading-[1.7] mt-4 text-foreground/85
                       text-[14px] max-w-[320px]
                       md:text-[16px] md:max-w-[480px]">
          Building scalable distributed systems and elegant interfaces. Passionate about
          clean architecture, performance optimization, and developer experience.
        </p>

        {/* CTA buttons */}
        <div className="hero-text-anim flex gap-3 mt-6 md:mt-8 flex-wrap">
          <button
            className="font-mono text-[12px] md:text-[13px] bg-crimson text-white
                        px-6 md:px-7 py-2.5 md:py-3 rounded
                        hover:brightness-110 transition-all"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            View My Work
          </button>
          <button
            className="font-mono text-[12px] md:text-[13px] border border-foreground/40
                        text-foreground px-6 md:px-7 py-2.5 md:py-3 rounded
                        transition-all hover:border-foreground/50"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Let's Talk
          </button>
        </div>

        {/* Code block — slightly smaller on mobile */}
        <div
          className="hero-text-anim mt-6 md:mt-8 rounded-lg p-3.5 md:p-4
                      max-w-[340px] md:max-w-[440px] backdrop-blur-[2px]"
          style={{
            background: 'hsla(var(--muted), 0.5)',
            border: '1px solid hsla(var(--border), 0.5)',
          }}
        >
          <pre className="font-mono text-[11px] md:text-[13px] leading-relaxed overflow-x-auto">
            <span className="text-crimson">const</span>{' '}
            <span className="text-amber-500">engineer</span>{' '}
            <span className="text-foreground/60">=</span>
            {' {\n'}
            {'  '}
            <span className="text-indigo-500">stack</span>
            {': ['}
            <span className="text-emerald-500">"TypeScript"</span>
            {', '}
            <span className="text-emerald-500">"React"</span>
            {', '}
            <span className="text-emerald-500">"Go"</span>
            {'],\n'}
            {'  '}
            <span className="text-rose-500">focus</span>
            {': '}
            <span className="text-emerald-500">"distributed systems"</span>
            {',\n'}
            {'  '}
            <span className="text-indigo-500">coffee</span>
            {': '}
            <span className="text-amber-500">Infinity</span>
            {'\n}'}
            {';'}
          </pre>
        </div>
      </div>

      {/* ── Section Fades ────────────────────────────────────────── */}
      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default Hero;