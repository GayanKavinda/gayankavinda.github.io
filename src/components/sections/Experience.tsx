//src/components/sections/Experience.tsx
// Mobile: single-column vertical timeline with left border accent
// Desktop: original alternating zigzag layout preserved
// Tags, bullets, hover effects all preserved

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import crowdImg from '@/assets/crowd.png';
import { useTheme } from '@/context/ThemeProvider';
import { TracingBeam } from '@/components/ui/tracing-beam';

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface Entry {
  company: string; role: string; period: string; year: string;
  bullets: string[]; tags: string[]; current?: boolean;
}

const entries: Entry[] = [
  {
    company: 'TechCorp Global', role: 'Senior Software Engineer', period: '2022 — Present', year: '2022',
    bullets: ['Led migration of monolith to microservices serving 2M+ users', 'Designed event-driven architecture reducing latency by 40%', 'Mentored team of 6 engineers on distributed systems patterns'],
    tags: ['Go', 'Kafka', 'K8s', 'AWS'], current: true,
  },
  {
    company: 'DataFlow Systems', role: 'Software Engineer II', period: '2020 — 2022', year: '2020',
    bullets: ['Built real-time data pipeline processing 500K events/sec', 'Implemented CI/CD reducing deployment time by 60%', 'Architected PostgreSQL sharding strategy for 10TB+ dataset'],
    tags: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    company: 'WebScale Inc', role: 'Full Stack Developer', period: '2018 — 2020', year: '2018',
    bullets: ['Developed React dashboard used by 50K+ daily active users', 'Created GraphQL API layer consolidating 12 REST endpoints', 'Optimized bundle size by 45% through code splitting'],
    tags: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
  },
  {
    company: 'StartupLab', role: 'Junior Developer', period: '2016 — 2018', year: '2016',
    bullets: ['Shipped 3 production apps from concept to launch', 'Introduced automated testing increasing coverage to 85%', 'Built responsive UI components used across 4 products'],
    tags: ['JavaScript', 'React', 'Express', 'MongoDB'],
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';
  const entryRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      entryRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          x: i % 2 === 0 ? -40 : 40, opacity: 0,
          duration: 0.8, ease: EASING, immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 82%' },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-[80px] md:py-[120px] relative overflow-hidden">
      <img
        src={crowdImg} alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none z-0"
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
      />
      <div className="absolute inset-0 z-[1]" style={{ background: 'hsl(var(--background))' }} />

      <div className="relative z-[2] text-center mb-12 md:mb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Career</p>
        <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
          Professional <span className="font-playfair italic font-medium text-crimson">Experience</span>
        </h2>
        {/* Minimal divider */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
          <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
        </div>
      </div>

      {/* ── content wrapped in Tracing Beam ── */}
      <TracingBeam className="px-6 relative z-[2]">
        {/* ── Mobile timeline — single column with tracing beam ── */}
        <div className="md:hidden max-w-[900px] w-full mx-auto mt-4 px-2">
          <div className="pl-[44px] pr-2 space-y-8">
          {entries.map((e, i) => (
            <div
              key={e.company}
              ref={el => { entryRefs.current[i] = el; }}
              className="relative"
            >

              <div
                className={`elevation-card rounded-lg border border-border p-4 bg-card ${e.current ? 'border-l-[3px] border-l-crimson' : ''}`}
              >
                <p className="font-mono text-[12px] text-gold">{e.company}</p>
                <p className="font-jakarta font-bold text-[17px] text-foreground mt-0.5 tracking-tight">{e.role}</p>
                <p className="font-mono text-[10px] text-foreground/40 mt-0.5">{e.period}</p>
                <ul className="mt-3 space-y-1.5">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="font-sans text-[13px] text-foreground/65 flex items-start gap-1.5">
                      <span className="text-crimson shrink-0 mt-0.5">›</span>{b}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {e.tags.map(t => (
                    <span key={t} className="font-mono text-[10px] text-crimson border border-crimson/25 bg-crimson/[0.10] px-2.5 py-0.5 rounded-[3px]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop zigzag layout — original preserved ── */}
      <div className="hidden md:block relative z-[2] max-w-[900px] mx-auto px-10">
        {entries.map((e, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={e.company} className="relative mb-16" ref={el => { entryRefs.current[i] = el; }}>
              <div className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-gold z-10 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border" style={{ top: 20 }}>{e.year}</div>
              <div className={`w-[44%] ${isLeft ? 'mr-auto pr-10 text-right' : 'ml-auto pl-10'}`}>
                <div
                  className={`elevation-card rounded-lg border border-border p-5 bg-card transition-all duration-300 hover:scale-[1.02] ${e.current ? 'border-l-[3px] border-l-crimson border-crimson/35' : ''}`}
                >
                  <p className="font-mono text-[13px] text-gold">{e.company}</p>
                  <p className="font-jakarta font-bold text-[18px] text-foreground mt-1 tracking-tight">{e.role}</p>
                  <p className="font-mono text-[11px] text-foreground/40">{e.period}</p>
                  <ul className="mt-3 space-y-1.5">
                    {e.bullets.map((b, j) => (
                      <li key={j} className={`font-sans text-[14px] text-foreground/65 ${isLeft ? 'text-right' : 'text-left'}`}>
                        <span className="text-crimson mr-1.5">›</span>{b}
                      </li>
                    ))}
                  </ul>
                  <div className={`flex gap-[6px] mt-3 flex-wrap ${isLeft ? 'justify-end' : ''}`}>
                    {e.tags.map(t => (
                      <span key={t} className="font-mono text-[11px] text-crimson border border-crimson/25 bg-crimson/[0.12] px-[10px] py-[3px] rounded-[3px]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </TracingBeam>
    </section>
  );
};

export default Experience;