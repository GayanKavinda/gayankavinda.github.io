//src/components/sections/TechStack/index.tsx
// Upgraded "The Stack" section.
// KEY CHANGES from previous version:
//   - Radar chart replaced with SystemPillars (4 architectural pillars)
//   - "Avg proficiency %" stat removed — subjective and junior-looking
//   - Stat row now shows: Technologies · Domains · Years
//   - Top-4 featured cards retain progress bars (useful for recruiters) but are
//     repositioned below the marquee, right column beside the pillars
//   - Full mobile responsiveness

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SkillMarquee } from './SkillMarquee';
import { SystemPillars } from '../SystemPillars';
import { TechGraph } from './TechGraph';
import { SKILLS, CAT_META, rm } from './constants';

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
            Technologies grouped by the engineering pillar they serve.
          </p>
        </div>

        {/* ── Stat row — no subjective percentages ─────────────────── */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="inline-flex border border-border rounded-2xl overflow-hidden divide-x divide-border">
            {[
              { target: SKILLS.length, suffix: '',  label: 'Technologies'   },
              { target: 99.9,          suffix: '%', label: 'Uptime Focused' },
              { target: 10,            suffix: '+', label: 'Years Experience' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center px-6 md:px-10 py-4 md:py-5 min-w-[90px] md:min-w-[120px]">
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
        <div className="mb-12 md:mb-16">
          <SkillMarquee />
        </div>

        {/* ── System Pillars & TechGraph ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">

          {/* Left — pillars */}
          <div>
            <p className="font-mono text-[9px] tracking-[.16em] uppercase text-muted-foreground/80 mb-1">
              // System design pillars
            </p>
            <SystemPillars />
          </div>

          {/* Right — TechGraph Radar Chart */}
          <div className="relative">
            <p className="font-mono text-[9px] tracking-[.16em] uppercase text-muted-foreground/80 mb-6 lg:text-right">
              // Proficiency Graph
            </p>
            <div className="flex justify-center lg:justify-end">
              <TechGraph />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechStack;

