//src/components/sections/Projects.tsx
// Mobile: all cards stacked single-column
// Desktop: original hero + 2-col row layout preserved
// Added: architecture diagram hint on hero card, case study CTA

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const heroProject = {
  name: 'Distributed Task Engine',
  desc: 'High-throughput task orchestration system handling 10M+ daily events across 40+ microservices',
  tags: ['Go', 'Kafka', 'Redis', 'K8s'],
  metrics: ['10M events/day', '40% latency↓', '99.99% uptime'],
};

const microProjects = [
  { name: 'AuthShield',  tech: 'TypeScript', desc: 'Zero-trust auth SDK' },
  { name: 'DataPipe',    tech: 'Python',      desc: 'Real-time ETL pipeline' },
  { name: 'CloudDash',   tech: 'React',       desc: 'Infrastructure monitor' },
  { name: 'APIForge',    tech: 'Go',          desc: 'API gateway framework' },
];

const sideProject = {
  name: 'Real-time Analytics Platform',
  desc: 'WebSocket-driven dashboard with D3 visualizations for 50K DAU',
  tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
};

const LinkBtn = ({ icon, text, color }: { icon: string; text: string; color: string }) => (
  <button className={`font-mono text-[12px] hover:underline transition-colors ${color}`}>
    {icon} {text}
  </button>
);

const Projects = () => {
  const ref      = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: ref.current!, start: 'top 85%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={ref} className="py-[80px] md:py-[100px] mt-[-60px] relative z-20 bg-background">
      <div className="text-center mb-12 md:mb-16 px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Featured Work</p>
        <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
          Selected <span className="font-playfair italic font-medium text-crimson">Projects</span>
        </h2>
        {/* Minimal divider */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
          <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Hero card */}
        <div className="project-card elevation-card rounded-xl border border-border overflow-hidden hover:border-crimson/40 hover:-translate-y-[2px] transition-all duration-300 bg-card">
          <div className="h-[180px] md:h-[280px] overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(var(--muted)) 100%)' }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'linear-gradient(rgba(192,39,45,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,39,45,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <div className="absolute top-0 left-0 w-0 h-[2px] bg-crimson hover-line transition-all duration-500" />
            <div className="w-full h-full flex items-center justify-center font-mono text-[13px] text-foreground/20 z-10">
              [ Project Screenshot ]
            </div>
            <div className="absolute bottom-4 right-6 font-playfair text-[60px] md:text-[80px] font-black text-crimson/[0.06] leading-none select-none">01</div>
          </div>
          <div className="p-5 md:p-7 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <h3 className="font-jakarta font-bold text-[20px] md:text-[24px] text-foreground tracking-tight">{heroProject.name}</h3>
              <p className="font-sans text-[14px] md:text-[15px] text-foreground/80 mt-1">{heroProject.desc}</p>
              {/* Impact metrics row */}
              <div className="flex gap-4 mt-3 flex-wrap">
                {heroProject.metrics.map(m => (
                  <span key={m} className="font-mono text-[10px] text-gold">{m}</span>
                ))}
              </div>
              <div className="flex gap-[6px] mt-3 flex-wrap">
                {heroProject.tags.map(t => (
                  <span key={t} className="font-mono text-[11px] text-crimson border border-crimson/25 bg-crimson/[0.12] px-[10px] py-[3px] rounded-[3px]">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-4 md:gap-2 md:items-end">
              <LinkBtn icon="↗" text="Live Demo"   color="text-crimson" />
              <LinkBtn icon="{ }" text="GitHub"    color="text-foreground/75 hover:text-gold" />
              <LinkBtn icon="→" text="Case Study"  color="text-gold" />
            </div>
          </div>
        </div>

        {/* Row 2 — stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          {/* Micro project grid */}
          <div className="project-card elevation-card rounded-xl border border-border p-5 md:p-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[11px] uppercase text-gold">Recent Projects</span>
              <span className="font-mono text-[11px] text-foreground/65">4 projects</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {microProjects.map(p => (
                <div key={p.name}
                  className="rounded-lg border border-border p-[14px] cursor-pointer hover:border-crimson/35 hover:bg-crimson/[0.04] transition-all flex flex-col justify-between bg-muted min-h-[100px]"
                >
                  <p className="font-mono text-[12px] md:text-[13px] text-foreground font-medium">{p.name}</p>
                  <p className="font-mono text-[10px] md:text-[11px] text-crimson mt-1">{p.tech}</p>
                  <p className="font-sans text-[12px] md:text-[13px] text-foreground/70 mt-1">{p.desc}</p>
                  <div className="text-right mt-1"><span className="text-gold text-[13px]">↗</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Side project */}
          <div className="project-card elevation-card rounded-xl border border-border overflow-hidden hover:border-crimson/40 hover:-translate-y-[2px] transition-all duration-300 bg-card">
            <div className="h-[140px] md:h-[180px] overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(var(--muted)) 100%)' }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(192,39,45,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,39,45,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-crimson hover-line transition-all duration-500" />
              <div className="w-full h-full flex items-center justify-center font-mono text-[13px] text-foreground/20 z-10">[ Project Screenshot ]</div>
              <div className="absolute bottom-2 right-4 font-playfair text-[50px] md:text-[60px] font-black text-crimson/[0.06] leading-none select-none">02</div>
            </div>
            <div className="p-4 md:p-5">
              <h3 className="font-jakarta font-bold text-[18px] md:text-[22px] text-foreground tracking-tight">{sideProject.name}</h3>
              <p className="font-sans text-[13px] md:text-[15px] text-foreground/75 mt-1">{sideProject.desc}</p>
              <div className="flex gap-[6px] mt-3 flex-wrap">
                {sideProject.tags.map(t => (
                  <span key={t} className="font-mono text-[11px] text-crimson border border-crimson/25 bg-crimson/[0.12] px-[10px] py-[3px] rounded-[3px]">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <LinkBtn icon="↗" text="Live Demo"  color="text-crimson" />
                <LinkBtn icon="{ }" text="GitHub"   color="text-foreground/75 hover:text-gold" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 md:mt-12">
          <button
            onClick={() => navigate('/projects')}
            className="font-mono text-[12px] md:text-[13px] text-crimson border border-crimson/40 px-7 md:px-8 py-2.5 md:py-3 rounded hover:bg-crimson/[0.08] transition-colors"
          >
            View All Projects →
          </button>
        </div>
      </div>
    </section>
  );
};

const style = typeof document !== 'undefined' ? (() => {
  const s = document.createElement('style');
  s.textContent = '.project-card:hover .hover-line { width: 100% !important; }';
  document.head.appendChild(s);
  return s;
})() : null;

export default Projects;

