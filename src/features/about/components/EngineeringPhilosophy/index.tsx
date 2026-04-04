//src/components/sections/EngineeringPhilosophy/index.tsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ObservabilityMockup } from './mockups/ObservabilityMockup';
import { SimplicityMockup } from './mockups/SimplicityMockup';
import { TestingMockup } from './mockups/TestingMockup';
import { FailureMockup } from './mockups/FailureMockup';

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  {
    num: 'STEP 1',
    color: '#C41E3A',
    title: 'Observability-first',
    body: "If you can't measure it, you can't improve it. I instrument from day one. Distributed traces, structured logs, Prometheus metrics, so production is never a black box.",
    tags: ['Distributed traces', 'Prometheus metrics', 'Dashboards first'],
    Mockup: ObservabilityMockup,
  },
  {
    num: 'STEP 2',
    color: '#D4891A',
    title: 'Simplicity over cleverness',
    body: "The best code is what your team can debug at 3am in an incident. Boring technology for boring problems. Complexity only where it genuinely earns its place.",
    tags: ['Readable over clever', 'Boring tech', 'Team-debuggable'],
    Mockup: SimplicityMockup,
  },
  {
    num: 'STEP 3',
    color: '#C41E3A',
    title: 'Test at the boundaries',
    body: "Integration tests over unit tests for distributed systems. Mock at the network boundary, not inside your domain. Fast feedback loops that catch production bugs early.",
    tags: ['Integration tests', 'Network mocks', 'Fast feedback'],
    Mockup: TestingMockup,
  },
  {
    num: 'STEP 4',
    color: '#D4891A',
    title: 'Design for failure',
    body: "Every external call can fail. Circuit breakers, bulkheads, retry budgets, and graceful degradation are first-class architectural concerns, never afterthoughts.",
    tags: ['Circuit breakers', 'Retry budgets', 'Graceful degradation'],
    Mockup: FailureMockup,
  },
];

const EngineeringPhilosophy = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.phil-step');
      if (elements.length > 0) {
        gsap.from(elements, {
          y: 28,
          opacity: 0,
          stagger: 0.13,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            once: true,
          },
        });
      }
    }, ref.current);
    
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="philosophy" ref={ref} className="relative py-[80px] md:py-[100px] bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#D4891A]">
              ▶▶
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
              Engineering Philosophy
            </span>
          </div>
          <h2 className="font-jakarta font-extrabold text-[clamp(30px,5vw,50px)] text-foreground leading-tight tracking-tight">
            How I{' '}
            <em className="font-playfair italic font-medium text-[#C41E3A]">
              Work
            </em>
          </h2>
          <p className="text-[14px] text-muted-foreground mt-3 max-w-[460px] mx-auto leading-relaxed">
            Principles I've earned through production incidents,
            architecture reviews, and a decade of shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-start">
          {PRINCIPLES.map((p) => (
            <div key={p.num} className="phil-step flex flex-col gap-4">
              <div
                className="w-full rounded-xl overflow-hidden border border-border bg-muted/30 elevation-card"
                style={{ aspectRatio: '4/3' }}
              >
                <p.Mockup />
              </div>

              <p
                className="font-mono text-[11px] font-semibold tracking-[.14em] uppercase"
                style={{ color: p.color }}
              >
                {p.num}
              </p>

              <h3 className="font-jakarta text-[18px] md:text-[19px] font-bold text-foreground leading-snug -mt-2 tracking-tight">
                {p.title}
              </h3>

              <p className="font-sans text-[13px] text-muted-foreground leading-[1.75]">
                {p.body}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-1">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-sans text-foreground/65 border border-border rounded-full px-3 py-1 bg-muted/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EngineeringPhilosophy;


