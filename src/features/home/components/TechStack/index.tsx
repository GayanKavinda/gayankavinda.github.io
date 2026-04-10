//src/components/sections/TechStack/index.tsx
// Clean "The Stack" section — essential parts only.
// Features:
//   - Animated skill marquee with gradient fades
//   - Clean stat row: Technologies + Years Experience
//   - No subjective proficiency percentages
//   - Full mobile responsiveness

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkillMarquee } from './SkillMarquee';
import { SKILLS, rm } from './constants';

gsap.registerPlugin(ScrollTrigger);

// TOP_4 removed (dead code)

// ── Animated count-up ────────────────────────────────────────────────────────
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (rm()) { el.textContent = String(target) + suffix; return; }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
    });
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // feat-bar animation removed (no target elements)
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-[80px] md:py-[100px] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <p className="font-mono text-[10px] tracking-[.18em] uppercase text-[#D4891A] mb-2.5">
            // Technology
          </p>
          <h2 className="font-playfair text-[clamp(32px,5vw,56px)] font-bold text-foreground leading-tight">
            The <em className="italic text-[#C41E3A]">Stack</em>
          </h2>
          <p className="text-[13px] md:text-[14px] text-muted-foreground mt-3 max-w-[360px] mx-auto leading-relaxed">
            Technologies I use to build production-ready systems.
          </p>
        </div>

        {/* ── Stat row ─────────────────── */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="inline-flex border border-border rounded-2xl overflow-hidden divide-x divide-border">
            {[
              { target: SKILLS.length, suffix: '+', label: 'Technologies'   },
              { target: 10,            suffix: '+', label: 'Years Experience' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center px-8 md:px-12 py-4 md:py-5 min-w-[100px] md:min-w-[140px]">
                <div className="font-playfair text-[24px] md:text-[28px] font-bold text-foreground leading-none">
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>
                <div className="font-mono text-[8px] md:text-[9px] tracking-[.14em] uppercase text-muted-foreground/80 mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Marquee ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <SkillMarquee />
        </div>
      </div>
      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default TechStack;

