//src/components/sections/About.tsx
// Changes from original:
// - Replaced "∞ Lines of Code" with "12+ Systems Architected" (senior impact metric)
// - Replaced "10+ Years" stat with cleaner layout
// - Full mobile: single-column stacked, photo first, bio below
// - Photo placeholder with corner brackets preserved
// - Typography tightened on mobile

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import maskImg from '@shared/assets/mask.png';
import { useTheme } from '@app/providers/theme-provider';

// Impact-driven stats — no subjective percentages
const stats = [
  { num: '10+',  label: 'YEARS',    sub: 'Engineering'      },
  { num: '50+',  label: 'PROJECTS', sub: 'Shipped'          },
  { num: '12+',  label: 'SYSTEMS',  sub: 'Architected'      },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskRef    = useRef<HTMLImageElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for mask image - enhanced visibility
      gsap.to(maskRef.current!, {
        y: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      gsap.from(photoRef.current!, {
        x: -60, opacity: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%' },
      });
      gsap.from('.about-text-anim', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 70%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-[80px] md:py-[120px] relative overflow-hidden">
      <img
        ref={maskRef} src={maskImg} alt=""
        className="absolute left-[-80px] top-1/2 -translate-y-1/2 h-[70%] md:h-[80%] w-auto opacity-[0.06] pointer-events-none z-0"
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
      />

      <div className="relative z-[1] max-w-[1100px] mx-auto px-6 md:px-10">
        {/* Mobile: stacked; Desktop: two-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

          {/* Photo */}
          <div ref={photoRef} className="relative w-fit mx-auto md:mx-0">
            <div className="w-[260px] h-[320px] md:w-[320px] md:h-[380px] rounded-lg border-2 border-crimson/40 overflow-hidden bg-card elevation-card flex items-center justify-center">
              <span className="font-mono text-[13px] text-foreground/20">[ Your Photo ]</span>
            </div>
            {/* Corner brackets */}
            {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((pos, i) => (
              <svg key={i} className={`absolute ${pos} w-5 h-5 md:w-6 md:h-6`} viewBox="0 0 24 24">
                <path d="M0 8V0h8" fill="none" stroke="#E8A820" strokeWidth="1.5" />
              </svg>
            ))}
            <div className="flex gap-4 mt-5">
              {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
                <a key={s} href="#" className="font-mono text-[11px] md:text-[12px] text-foreground/50 hover:text-gold transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="about-text-anim font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// About Me</p>
            <h2 className="about-text-anim font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
              I code with <em className="font-playfair italic font-medium text-crimson">intent</em>.
            </h2>
            {/* Minimal divider */}
            <div className="flex items-start gap-3 mt-5">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
              <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            </div>
            <div className="about-text-anim mt-5 md:mt-6 space-y-4 font-sans text-[14px] md:text-[16px] leading-[1.7] text-foreground/70">
              <p>With over a decade in the trenches, I've learned that great software isn't just about clean code — it's about understanding the problem deeply before writing a single line.</p>
              <p>I specialize in distributed systems, cloud architecture, and building developer tools that teams actually enjoy using. My approach combines battle-tested engineering principles with a relentless focus on user experience.</p>
              <p>When I'm not architecting systems, you'll find me contributing to open source, writing about software design patterns, or exploring the intersection of technology and traditional art forms.</p>
            </div>

            {/* Stats — impact-driven, no subjective percentages */}
            <div className="about-text-anim stats-row grid grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-10 border-t border-border pt-6 md:pt-8">
              {stats.map(s => (
                <div key={s.label} className="bg-card elevation-card border border-border p-3 md:p-4 rounded-xl text-center md:text-left">
                  <p className="font-jakarta font-bold text-[clamp(24px,4vw,36px)] text-crimson leading-none tracking-tighter">{s.num}</p>
                  <p className="font-mono text-[9px] md:text-[10px] text-gold uppercase tracking-wider mt-1">{s.label}</p>
                  <p className="font-sans text-[10px] md:text-[12px] text-foreground/50 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;

