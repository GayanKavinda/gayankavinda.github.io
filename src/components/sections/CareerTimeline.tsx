// src/components/sections/CareerTimeline.tsx
// Visual career + education timeline — distinct from the zigzag Experience section.
// Vertical centred spine · alternating cards on desktop · single-column on mobile.
// Crimson #C41E3A · Gold #D4891A · full dark/light theme.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type TimelineEntry = {
  year:  string;
  type:  'work' | 'edu' | 'milestone';
  title: string;
  place: string;
  desc:  string;
  color: string;
};

const ENTRIES: TimelineEntry[] = [
  { year: '2022–Now', type: 'work',      color: '#C41E3A', title: 'Senior Software Engineer', place: 'TechCorp Global', desc: 'Led microservices migration serving 2M+ users. Designed event-driven architecture cutting latency 40%.' },
  { year: '2021',     type: 'milestone', color: '#D4891A', title: 'CKA Certification',         place: 'CNCF',            desc: 'Certified Kubernetes Administrator — passed on first attempt.' },
  { year: '2020–22',  type: 'work',      color: '#C41E3A', title: 'Software Engineer II',      place: 'DataFlow Systems', desc: 'Real-time pipeline processing 500K events/sec. Architected PostgreSQL sharding for 10TB+ dataset.' },
  { year: '2019',     type: 'edu',       color: '#D4891A', title: 'M.Sc. Computer Science',    place: 'University of Colombo', desc: 'Distributed systems focus. Thesis: "Adaptive Load Balancing in Event-Driven Microservices".' },
  { year: '2018–20',  type: 'work',      color: '#C41E3A', title: 'Full Stack Developer',      place: 'WebScale Inc',    desc: 'React dashboard for 50K DAU. GraphQL consolidation of 12 REST endpoints.' },
  { year: '2016–18',  type: 'work',      color: '#C41E3A', title: 'Junior Developer',          place: 'StartupLab',      desc: '3 production apps from concept to launch. Introduced test coverage from 0 → 85%.' },
  { year: '2015',     type: 'edu',       color: '#D4891A', title: 'B.Sc. Software Engineering', place: 'University of Moratuwa', desc: 'First class honours. Final year project: real-time collaborative code editor.' },
];

const TYPE_ICON: Record<string, JSX.Element> = {
  work: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  edu: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  milestone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

const CareerTimeline = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tl-entry', {
        y: 24, opacity: 0, stagger: 0.12, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={ref} className="py-[80px] md:py-[100px] relative overflow-hidden bg-background">
      <div className="max-w-[900px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Career Path</p>
          <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
            The <em className="font-playfair italic font-medium text-[#C41E3A]">Journey</em>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,30,58,0.5) 10%, rgba(212,137,26,0.5) 90%, transparent)' }} />

          <div className="space-y-8 md:space-y-10">
            {ENTRIES.map((e, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`tl-entry relative flex md:items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 md:gap-6`}>

                  {/* Mobile: left offset layout */}
                  {/* Desktop: half-width alternating cards */}

                  {/* Year pill — absolute center on desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 top-3">
                    <div className="font-mono text-[10px] px-2.5 py-1 rounded-full border bg-background"
                      style={{ color: e.color, borderColor: `${e.color}40` }}>
                      {e.year}
                    </div>
                  </div>

                  {/* Mobile: dot + year inline */}
                  <div className="md:hidden flex items-center gap-3 absolute left-0 top-3 z-10">
                    <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: e.color, background: `${e.color}12`, color: e.color }}>
                      {TYPE_ICON[e.type]}
                    </div>
                  </div>

                  {/* Spacer for desktop side */}
                  <div className="hidden md:block w-[calc(50%-24px)]" />

                  {/* Card */}
                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-24px)] rounded-xl border border-border bg-card p-5 elevation-card hover:border-[${e.color}]/40 hover:-translate-y-[2px] transition-all duration-200 group relative overflow-hidden`}>
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: e.color }} />

                    {/* Mobile year */}
                    <div className="md:hidden font-mono text-[9px] mb-2" style={{ color: e.color }}>{e.year}</div>

                    <div className="flex items-start gap-3">
                      {/* Icon — desktop only */}
                      <div className="hidden md:flex w-8 h-8 rounded-lg flex-shrink-0 items-center justify-center"
                        style={{ background: `${e.color}12`, color: e.color }}>
                        {TYPE_ICON[e.type]}
                      </div>
                      <div>
                        <h3 className="font-jakarta font-bold text-[15px] text-foreground leading-tight tracking-tight">{e.title}</h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] mt-0.5" style={{ color: e.color }}>{e.place}</p>
                        <p className="font-sans text-[13px] text-foreground/55 mt-2 leading-relaxed">{e.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerTimeline;
