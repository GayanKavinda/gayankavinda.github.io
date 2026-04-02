// src/components/sections/OpenSource.tsx
// Open Source contributions section — matches Gara Yaka design DNA.
// Shows PR highlights, starred repos, and contribution stats.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTRIBUTIONS = [
  {
    repo:    'kubernetes/kubernetes',
    type:    'PR Merged',
    title:   'Fix race condition in kubelet pod lifecycle handler',
    number:  '#118432',
    impact:  'Resolved intermittent pod stuck-terminating in high-churn environments',
    stars:   '108k',
    color:   '#C41E3A',
  },
  {
    repo:    'apache/kafka',
    type:    'PR Merged',
    title:   'Add consumer group lag metric to JMX exporter',
    number:  '#14891',
    impact:  'Now used by 3 major monitoring tools as the canonical lag metric',
    stars:   '28.4k',
    color:   '#D4891A',
  },
  {
    repo:    'prometheus/prometheus',
    type:    'Documentation',
    title:   'Expand remote_write config docs with real-world examples',
    number:  '#12203',
    impact:  'Reduced most common support questions by ~30% per maintainer',
    stars:   '55.1k',
    color:   '#C41E3A',
  },
];

const OWN_PROJECTS = [
  { name: 'go-circuitbreaker', desc: 'Configurable circuit breaker for Go — bulkhead & retry budget patterns included', lang: 'Go',         stars: 612,  forks: 87  },
  { name: 'kafka-lag-exporter', desc: 'Prometheus exporter for Kafka consumer group lag with per-partition granularity', lang: 'Go',         stars: 1204, forks: 193 },
  { name: 'ts-event-bus',       desc: 'Type-safe in-process event bus for TypeScript with dead-letter queue support',    lang: 'TypeScript', stars: 389,  forks: 44  },
];

const LANG_COLOR: Record<string, string> = { Go: '#00ADD8', TypeScript: '#3178C6', Python: '#3572A5' };

const OpenSource = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.os-card', {
        y: 24, opacity: 0, stagger: 0.09, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="opensource" ref={ref} className="py-[80px] md:py-[100px] bg-background overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Community</p>
          <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
            Open <em className="font-playfair italic font-medium text-[#C41E3A]">Source</em>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
          </div>
          <p className="font-sans text-[14px] text-foreground/50 mt-4 max-w-[440px] mx-auto leading-relaxed">
            Giving back to the ecosystem that built everything I use.
          </p>
        </div>

        {/* Upstream contributions */}
        <div className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-5">// Upstream contributions</p>
          <div className="space-y-3">
            {CONTRIBUTIONS.map((c, i) => (
              <div key={i} className="os-card elevation-card group rounded-xl border border-border bg-card p-5 hover:border-[#E8A820]/40 hover:-translate-y-[2px] transition-all duration-200 relative overflow-hidden cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: `linear-gradient(to bottom, ${c.color}, ${c.color}60)` }} />
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-[11px] font-semibold" style={{ color: c.color }}>{c.repo}</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border"
                        style={{ color: c.color, borderColor: `${c.color}30`, background: `${c.color}10` }}>
                        {c.type}
                      </span>
                      <span className="font-mono text-[10px] text-foreground/30">{c.number}</span>
                    </div>
                    <h3 className="font-jakarta font-bold text-[14px] text-foreground leading-tight mb-1.5">{c.title}</h3>
                    <p className="font-sans text-[12px] text-foreground/50 leading-relaxed">{c.impact}</p>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-foreground/30 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {c.stars}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Own projects */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-5">// My own projects</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OWN_PROJECTS.map((p, i) => (
              <div key={i} className="os-card elevation-card group rounded-xl border border-border bg-card p-5 hover:border-[#D4891A]/40 hover:-translate-y-[2px] transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4891A]/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4891A" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] text-foreground/30 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {p.stars.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-mono text-[13px] font-semibold text-[#C41E3A] mb-1.5">{p.name}</h3>
                <p className="font-sans text-[12px] text-foreground/50 leading-relaxed mb-3">{p.desc}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLOR[p.lang] ?? '#888' }} />
                  <span className="font-mono text-[10px] text-foreground/40">{p.lang}</span>
                  <span className="ml-auto font-mono text-[10px] text-foreground/25">{p.forks} forks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
