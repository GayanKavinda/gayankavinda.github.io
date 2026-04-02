// src/pages/ProjectDetail.tsx
// Case Study page — matches existing Gara Yaka design system exactly.
// Crimson #C41E3A · Gold #D4891A · Playfair headings · DM Mono labels · Jakarta body
// GSAP ScrollTrigger reveals · full dark/light theme via CSS vars

import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeProvider';

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Record<string, CaseStudy> = {
  'distributed-task-engine': {
    id: 'distributed-task-engine',
    title: 'Distributed Task Engine',
    tagline: 'Orchestrating 10M+ daily events across 40+ microservices at 99.99% uptime.',
    year: '2023',
    role: 'Lead Architect & Engineer',
    team: '6 Engineers',
    duration: '8 months',
    tags: ['Go', 'Kafka', 'Redis', 'Kubernetes', 'gRPC', 'PostgreSQL'],
    status: 'Production',
    links: { live: '#', github: '#' },
    overview:
      'A high-throughput, horizontally scalable task orchestration platform built to replace a brittle monolith that was dropping 3% of tasks under peak load. The system needed to handle Black-Friday-scale traffic spikes without manual intervention.',
    problem:
      'The legacy cron-based system was processing tasks sequentially, causing cascading failures when any single worker went down. With 50K tasks/hour becoming 500K tasks/hour over 18 months, the architecture was fundamentally broken.',
    solution:
      'Re-architected the entire pipeline around an event-driven model. Kafka became the durable backbone, Go workers consumed from partitioned topics with consumer-group offsets, Redis handled distributed state and pub/sub coordination, and Kubernetes HPA scaled workers automatically based on consumer lag exported to Prometheus.',
    metrics: [
      { value: '10M+',   label: 'Daily Tasks Processed'  },
      { value: '99.99%', label: 'Uptime SLA Maintained'  },
      { value: '40%',    label: 'Latency Reduction'      },
      { value: '0',      label: 'Data Loss Incidents'    },
    ],
    timeline: [
      { phase: 'Discovery',     duration: '2 wks', desc: 'Load analysis, failure mode mapping, stakeholder alignment on SLAs.' },
      { phase: 'Architecture',  duration: '3 wks', desc: 'System design, ADRs written, tech spike on Kafka consumer group behavior.' },
      { phase: 'Core Build',    duration: '10 wks', desc: 'Go workers, Kafka topology, Redis state layer, gRPC service mesh.' },
      { phase: 'Observability', duration: '3 wks', desc: 'Prometheus metrics, Grafana dashboards, distributed tracing via Jaeger.' },
      { phase: 'Migration',     duration: '6 wks', desc: 'Dark-launch dual-write, traffic shadow, gradual 10→100% cutover.' },
      { phase: 'Hardening',     duration: '4 wks', desc: 'Chaos engineering, runbook authoring, on-call training.' },
    ],
    learnings: [
      'Consumer lag is a better scaling signal than CPU — wire it to HPA from day one.',
      'Schema registries are not optional on a multi-team Kafka cluster.',
      'Idempotency keys on every task prevented duplicate processing during rebalances.',
      'Synthetic canaries that mimic real traffic caught 4 regressions before users saw them.',
    ],
    techBreakdown: [
      { name: 'Go',          role: 'Worker runtime — goroutine-per-task, graceful shutdown' },
      { name: 'Kafka',       role: 'Durable event bus, 7-day retention, 3× replication'    },
      { name: 'Redis',       role: 'Distributed lock, LRU cache, pub/sub coordination'      },
      { name: 'Kubernetes',  role: 'HPA on Kafka lag metric, pod disruption budgets'        },
      { name: 'PostgreSQL',  role: 'Task audit trail, 8-shard hash on task_id'             },
      { name: 'Prometheus',  role: 'Custom metrics: lag, throughput, DLQ depth'            },
    ],
  },
};

interface Metric   { value: string; label: string }
interface Timeline { phase: string; duration: string; desc: string }
interface TechItem { name: string; role: string }
interface CaseStudy {
  id: string; title: string; tagline: string; year: string;
  role: string; team: string; duration: string; tags: string[];
  status: string; links: { live: string; github: string };
  overview: string; problem: string; solution: string;
  metrics: Metric[]; timeline: Timeline[]; learnings: string[];
  techBreakdown: TechItem[];
}

// ── Section divider (matches all other sections) ─────────────────────────────
const SectionHead = ({ tag, title, accent }: { tag: string; title: string; accent: string }) => (
  <div className="mb-10 md:mb-14">
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#D4891A] mb-3">{tag}</p>
    <h2 className="font-jakarta font-extrabold text-[clamp(26px,4vw,40px)] text-foreground tracking-tight">
      {title.split('__').map((part, i) =>
        i % 2 === 1
          ? <em key={i} className="font-playfair italic font-medium text-[#C41E3A]">{accent}</em>
          : <span key={i}>{part}</span>
      )}
    </h2>
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#D4891A]" />
      <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const pageRef   = useRef<HTMLDivElement>(null);

  const project = PROJECTS[slug ?? ''] ?? PROJECTS['distributed-task-engine'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.cs-reveal', {
        y: 32, opacity: 0, stagger: 0.09, duration: 0.75, ease: 'power2.out',
        scrollTrigger: { trigger: pageRef.current, start: 'top 80%', once: true },
      });
      gsap.from('.cs-block', {
        y: 24, opacity: 0, stagger: 0.07, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: '.cs-metrics', start: 'top 85%', once: true },
      });
      gsap.from('.tl-item', {
        x: -20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.cs-timeline', start: 'top 85%', once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, [slug]);

  const hairline = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <div className="pt-28 md:pt-36 pb-16 md:pb-20 relative overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 40%,transparent 30%,hsl(var(--background)) 75%)' }} />

        <div className="relative max-w-[1100px] mx-auto px-6 md:px-10">
          {/* Back */}
          <button
            onClick={() => navigate('/#projects')}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/40 hover:text-[#D4891A] transition-colors mb-8 group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-1 transition-transform">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to home
          </button>

          {/* Status + year */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[9px] px-2.5 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 uppercase tracking-[0.1em]">
              {project.status}
            </span>
            <span className="font-mono text-[10px] text-foreground/30 uppercase tracking-[0.1em]">{project.year}</span>
          </div>

          {/* Title */}
          <h1 className="font-playfair font-black text-[clamp(36px,7vw,72px)] text-foreground leading-[1.05] tracking-tight max-w-[800px]">
            {project.title}
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-foreground/55 mt-4 max-w-[580px] leading-relaxed">
            {project.tagline}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8" style={{ borderTop: `1px solid ${hairline}` }}>
            {[
              { label: 'Role',     value: project.role     },
              { label: 'Team',     value: project.team     },
              { label: 'Duration', value: project.duration },
            ].map(m => (
              <div key={m.label}>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/35 mb-1">{m.label}</p>
                <p className="font-jakarta font-semibold text-[14px] text-foreground">{m.value}</p>
              </div>
            ))}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/35 mb-1">Stack</p>
              <div className="flex gap-1.5 flex-wrap">
                {project.tags.map(t => (
                  <span key={t} className="font-mono text-[10px] text-[#C41E3A] border border-[#C41E3A]/25 bg-[#C41E3A]/[0.08] px-2.5 py-0.5 rounded-[3px]">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA links */}
          <div className="flex gap-3 mt-8">
            <a href={project.links.live}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] bg-[#C41E3A] text-white px-5 py-2.5 rounded hover:brightness-110 transition-all">
              ↗ Live Demo
            </a>
            <a href={project.links.github}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] border border-foreground/15 text-foreground/60 px-5 py-2.5 rounded hover:border-foreground/30 hover:text-foreground transition-all">
              {'{ }'} GitHub
            </a>
          </div>
        </div>
      </div>

      {/* ── Screenshot placeholder ── */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 mb-20">
        <div className="w-full rounded-2xl overflow-hidden border border-border"
          style={{ aspectRatio: '16/7', background: `linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(var(--muted)) 100%)` }}>
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(196,30,58,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,0.15) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <span className="font-mono text-[13px] text-foreground/20 relative z-10">[ Project Screenshot / Demo GIF ]</span>
            <div className="absolute bottom-4 right-6 font-playfair text-[80px] font-black text-[#C41E3A]/[0.05] leading-none select-none">01</div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pb-24">

        {/* Metrics */}
        <div className="cs-metrics grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {project.metrics.map((m, i) => (
            <div key={i} className="cs-block elevation-card rounded-xl border border-border bg-card p-5 text-center relative overflow-hidden group hover:-translate-y-[2px] transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: i % 2 === 0 ? '#C41E3A' : '#D4891A' }} />
              <p className="font-playfair font-black text-[clamp(28px,4vw,40px)] leading-none text-foreground tracking-tighter">{m.value}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/75 mt-2">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Two-col narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <div className="cs-reveal">
            <SectionHead tag="// Context" title="The __Problem__" accent="Problem" />
            <p className="font-sans text-[15px] leading-[1.8] text-foreground/65">{project.problem}</p>
          </div>
          <div className="cs-reveal">
            <SectionHead tag="// Approach" title="The __Solution__" accent="Solution" />
            <p className="font-sans text-[15px] leading-[1.8] text-foreground/65">{project.solution}</p>
          </div>
        </div>

        {/* Overview */}
        <div className="cs-reveal mb-20 rounded-2xl border border-border bg-card p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#C41E3A] to-[#D4891A]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D4891A] mb-3 ml-4">// Overview</p>
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.85] text-foreground/70 ml-4 max-w-[700px]">{project.overview}</p>
        </div>

        {/* Timeline */}
        <div className="cs-timeline mb-20">
          <SectionHead tag="// Execution" title="Project __Timeline__" accent="Timeline" />
          <div className="space-y-0">
            {project.timeline.map((t, i) => (
              <div key={i} className="tl-item flex gap-5 md:gap-8 group">
                {/* Left: phase number + connector */}
                <div className="flex flex-col items-center gap-0 flex-shrink-0 w-8">
                  <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold transition-all duration-200 mt-0.5"
                    style={{ borderColor: i % 2 === 0 ? '#C41E3A' : '#D4891A', color: i % 2 === 0 ? '#C41E3A' : '#D4891A', background: `${i % 2 === 0 ? '#C41E3A' : '#D4891A'}12` }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {i < project.timeline.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: hairline, minHeight: '36px' }} />
                  )}
                </div>
                {/* Right: content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-jakarta font-bold text-[16px] text-foreground">{t.phase}</h3>
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#D4891A]/10 text-[#D4891A] border border-[#D4891A]/20 uppercase tracking-[0.08em]">{t.duration}</span>
                  </div>
                  <p className="font-sans text-[14px] text-foreground/55 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech breakdown */}
        <div className="cs-reveal mb-20">
          <SectionHead tag="// Engineering" title="Tech __Breakdown__" accent="Breakdown" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.techBreakdown.map((t, i) => (
              <div key={i} className="rounded-lg border border-border bg-card elevation-card p-4 hover:border-[#D4891A]/40 hover:-translate-y-[2px] transition-all duration-200 group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[12px] font-semibold text-[#C41E3A]">{t.name}</span>
                </div>
                <p className="font-sans text-[12px] text-foreground/50 leading-relaxed">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learnings */}
        <div className="cs-reveal mb-20">
          <SectionHead tag="// Retrospective" title="Key __Learnings__" accent="Learnings" />
          <div className="space-y-3">
            {project.learnings.map((l, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg border border-border bg-card elevation-card px-5 py-4 hover:border-[#C41E3A]/30 transition-colors">
                <span className="font-mono text-[11px] text-[#C41E3A] mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-sans text-[14px] text-foreground/65 leading-relaxed">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next project CTA */}
        <div className="cs-reveal text-center pt-12" style={{ borderTop: `1px solid ${hairline}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/30 mb-4">// What's next</p>
          <h3 className="font-playfair font-black text-[clamp(24px,4vw,36px)] text-foreground mb-6">
            Want to build something like this?
          </h3>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/#contact')}
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] bg-[#C41E3A] text-white px-7 py-3 rounded hover:brightness-110 transition-all">
              Start a conversation
            </button>
            <button onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] border border-foreground/15 text-foreground/60 px-7 py-3 rounded hover:border-foreground/30 hover:text-foreground transition-all">
              View all projects
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
