//src/components/sections/SystemPillars.tsx
// Replaces the subjective radar chart.
// Skills are grouped into 4 engineering pillars: Scalability, Observability, Security, Reliability.
// Each pillar has an icon, a one-line mission statement, and the specific tech that fulfills it.
// Mobile: 1-col stacked. Desktop: 2x2 grid.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Pillar {
  name: string;
  mission: string;
  color: string;
  tags: string[];
  icon: JSX.Element;
}

const PILLARS: Pillar[] = [
  {
    name: 'Scalability',
    mission: 'Handle 10M+ events per day',
    color: '#7C5CFC',
    tags: ['Kafka', 'Kubernetes', 'Go', 'Redis', 'gRPC', 'Horizontal Scaling'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    name: 'Observability',
    mission: 'See everything, miss nothing',
    color: '#00D4FF',
    tags: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Jaeger', 'Loki', 'SLOs'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    name: 'Security',
    mission: 'Zero-trust by default',
    color: '#7C5CFC',
    tags: ['OAuth 2.0', 'JWT', 'mTLS', 'HashiCorp Vault', 'SAST', 'RBAC'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    name: 'Reliability',
    mission: '99.99% uptime — engineered in',
    color: '#00D4FF',
    tags: ['Circuit Breaker', 'Chaos Engineering', 'Bulkhead', 'PagerDuty', 'SLAs', 'DR'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export const SystemPillars = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pillar-card', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
      {PILLARS.map(p => (
        <div
          key={p.name}
          className="pillar-card elevation-card group relative bg-card border border-border rounded-2xl p-5 overflow-hidden
                     transition-all duration-200 hover:border-border/50"
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: p.color }}
          />

          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
            style={{ background: p.color + '14' }}
          >
            {p.icon}
          </div>

          {/* Name + mission */}
          <h3 className="font-jakarta text-[17px] font-bold text-foreground leading-tight tracking-tight">
            {p.name}
          </h3>
          <p
            className="font-mono text-[9px] tracking-[.1em] uppercase mt-1 mb-4"
            style={{ color: p.color }}
          >
            {p.mission}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map(t => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-[3px] rounded border border-border text-muted-foreground
                           group-hover:border-border/60 transition-colors duration-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

