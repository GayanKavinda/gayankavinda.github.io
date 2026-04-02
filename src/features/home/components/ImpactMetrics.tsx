//src/components/sections/ImpactMetrics.tsx
// Senior impact metrics — no vanity stats.
// Replaces "Lines of Code: Infinity" with real engineering outcomes.
// Mobile: 2x2 grid; Desktop: 4-column row with crimson dividers.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const metrics = [
  { value: '10M+',   suffix: '',  label: 'Daily Users Served'      },
  { value: '99.99',  suffix: '%', label: 'Uptime Maintained'       },
  { value: '40',     suffix: '%', label: 'Latency Reduction'       },
  { value: '12+',    suffix: '',  label: 'Systems Architected'     },
];

const ImpactMetrics = () => {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0, y: 30, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('.metric-val').forEach(el => {
        const raw     = el.dataset.raw!;
        const suffix  = el.dataset.suffix!;
        const isFloat = raw.includes('.');
        const end     = parseFloat(raw);
        const obj     = { val: 0 };
        gsap.to(obj, {
          val: end, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = (isFloat ? obj.val.toFixed(2) : Math.round(obj.val)) + suffix;
          },
          onComplete: () => {
            // Restore full string for non-numeric suffixes like "10M+"
            el.textContent = el.dataset.display!;
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 border-y border-border bg-background">
      <div ref={containerRef} className="max-w-[1100px] mx-auto px-6 md:px-10">

        {/* Mobile: 2×2 grid; Desktop: single row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center md:px-6 relative"
            >
              <span
                className="metric-val font-jakarta text-[clamp(36px,7vw,56px)] font-bold text-gold leading-tight tracking-tighter"
                data-raw={m.value.replace(/[^0-9.]/g, '')}
                data-suffix={m.suffix}
                data-display={m.value + m.suffix}
              >
                {m.value}{m.suffix}
              </span>
              <span className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.12em] text-foreground/75 mt-2">
                {m.label}
              </span>

              {/* Desktop vertical divider */}
              {i < metrics.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-crimson/25" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ImpactMetrics;

