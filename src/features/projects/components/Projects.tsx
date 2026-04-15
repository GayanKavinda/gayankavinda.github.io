// src/features/projects/components/Projects.tsx

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Badge } from '@shared/components/ui/badge';

// ─── Types ────────────────────────────────────────────────────────────────────

type TagColor = 'crimson' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate' | 'ocean';
type VizType = 'nodes' | 'chart' | 'rings' | 'stream';

interface Project {
  name: string;
  desc: string;
  tags: string[];
  metrics?: string[];
  viz: VizType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const allProjects: Project[] = [
  {
    name: 'Distributed Task Engine',
    desc: 'High-throughput task orchestration handling 10M+ daily events across distributed nodes.',
    tags: ['Go', 'Kafka', 'Redis', 'K8s'],
    metrics: ['10M events/day', '40% latency↓'],
    viz: 'nodes',
  },
  {
    name: 'Real-time Analytics',
    desc: 'WebSocket-driven dashboard with D3 visualizations serving 50K daily active users.',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    viz: 'chart',
  },
  {
    name: 'AuthShield SDK',
    desc: 'Zero-trust authentication SDK with OAuth 2.0, biometric, and WebAuthn support.',
    tags: ['TypeScript', 'OAuth', 'WebAuthn'],
    metrics: ['< 80ms auth', '0 breaches'],
    viz: 'rings',
  },
  {
    name: 'DataPipe',
    desc: 'Real-time ETL pipeline processing 1M+ records per minute with zero data loss.',
    tags: ['Python', 'Kafka', 'Airflow'],
    metrics: ['1M rec/min'],
    viz: 'stream',
  },
  {
    name: 'CloudDash',
    desc: 'Infrastructure monitoring dashboard for multi-cloud deployments with alerting.',
    tags: ['React', 'AWS', 'Terraform'],
    viz: 'chart',
  },
  {
    name: 'APIForge',
    desc: 'API gateway framework with intelligent rate limiting, auth, and routing.',
    tags: ['Go', 'gRPC', 'Protobuf'],
    metrics: ['2ms p99'],
    viz: 'nodes',
  },
  {
    name: 'ChatScale',
    desc: 'Scalable chat infrastructure supporting 100K concurrent WebSocket connections.',
    tags: ['Node.js', 'WebSocket', 'Redis'],
    metrics: ['100K concurrent'],
    viz: 'stream',
  },
  {
    name: 'MobileTrack',
    desc: 'GPS tracking app with real-time location sharing and geofence alerts.',
    tags: ['React Native', 'Firebase', 'Maps API'],
    viz: 'rings',
  },
];

const getTagColor = (tag: string): TagColor => {
  const t = tag.toLowerCase();
  if (t.includes('go') || t.includes('k8s') || t.includes('aws') || t.includes('cloud') || t.includes('oauth')) return 'ocean';
  if (t.includes('react') || t.includes('ts') || t.includes('typescript') || t.includes('grpc') || t.includes('native')) return 'indigo';
  if (t.includes('kafka') || t.includes('redis') || t.includes('node') || t.includes('firebase') || t.includes('terraform')) return 'amber';
  if (t.includes('python') || t.includes('d3') || t.includes('maps')) return 'rose';
  return 'emerald';
};

// ─── Visualization Components ──────────────────────────────────────────────────

const VizNodes = React.memo(({ accent }: { accent: string }) => (
  <svg viewBox="0 0 340 180" fill="none" className="w-full h-full">
    <circle cx="170" cy="90" r="32" stroke={accent} strokeWidth="1" strokeOpacity="0.35" />
    <circle cx="170" cy="90" r="18" fill={accent} fillOpacity="0.1" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
    <circle cx="78" cy="48" r="16" stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
    <circle cx="262" cy="132" r="20" stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
    <circle cx="78" cy="132" r="12" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2" />
    <circle cx="262" cy="48" r="14" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2" />
    <line x1="138" y1="78" x2="94" y2="58" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="202" y1="102" x2="242" y2="122" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="138" y1="102" x2="90" y2="122" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="202" y1="78" x2="248" y2="56" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <circle cx="170" cy="90" r="4" fill={accent} />
  </svg>
));

VizNodes.displayName = 'VizNodes';

const VizChart = React.memo(({ accent, idx }: { accent: string; idx: number }) => {
  const pts = [28, 55, 40, 72, 58, 85, 70, 62, 90, 75, 88, 95].map(
    (p, i) => p + Math.sin(i + idx * 1.3) * 8,
  );
  const w = 340, h = 180, pad = 24;
  const xs = pts.map((_, j) => pad + j * ((w - 2 * pad) / (pts.length - 1)));
  const ys = pts.map(p => h - pad - (p * (h - 2 * pad)) / 100);
  const line = xs.map((x, j) => `${j === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[j].toFixed(1)}`).join(' ');
  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${(h - pad).toFixed(1)} L${xs[0].toFixed(1)},${(h - pad).toFixed(1)} Z`;
  const peakIdx = pts.indexOf(Math.max(...pts));
  return (
    <svg viewBox="0 0 340 180" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`ag-${idx}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#ag-${idx})`} />
      <path d={line} stroke={accent} strokeWidth="1.5" strokeOpacity="0.75" />
      <circle cx={xs[peakIdx]} cy={ys[peakIdx]} r="3.5" fill={accent} fillOpacity="0.9" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={accent} fillOpacity="0.7" />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
    </svg>
  );
});

VizChart.displayName = 'VizChart';

const VizRings = React.memo(({ accent, idx }: { accent: string; idx: number }) => {
  const secondAccent = '#D4891A';
  const pct1 = 68 + (idx * 7) % 24;
  const pct2 = 48 + (idx * 11) % 34;
  const r1 = 56, r2 = 40, cx = 170, cy = 90;
  const arc = (r: number, pct: number) => {
    const a = (pct / 100) * 2 * Math.PI;
    const x1 = cx, y1 = cy - r;
    const x2 = cx + r * Math.sin(a), y2 = cy - r * Math.cos(a);
    const lg = a > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${r},${r},0,${lg},1,${x2.toFixed(2)},${y2.toFixed(2)}`;
  };
  return (
    <svg viewBox="0 0 340 180" fill="none" className="w-full h-full">
      <circle cx={cx} cy={cy} r={r1} stroke="currentColor" strokeOpacity="0.07" strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r2} stroke="currentColor" strokeOpacity="0.07" strokeWidth="6" />
      <path d={arc(r1, pct1)} stroke={accent} strokeWidth="8" strokeLinecap="round" strokeOpacity="0.8" />
      <path d={arc(r2, pct2)} stroke={secondAccent} strokeWidth="6" strokeLinecap="round" strokeOpacity="0.7" />
      <text x={cx} y={cy + 6} textAnchor="middle" fill={accent} fontSize="20" fontWeight="700" fontFamily="monospace">
        {pct1}%
      </text>
    </svg>
  );
});

VizRings.displayName = 'VizRings';

const VizStream = React.memo(({ accent, idx }: { accent: string; idx: number }) => {
  const bars = Array.from({ length: 20 }, (_, j) => ({
    x: 20 + j * 15.5,
    h: 18 + Math.abs(Math.sin(j * 0.85 + idx * 1.2)) * 60 + (j % 3) * 12,
  }));
  return (
    <svg viewBox="0 0 340 180" fill="none" className="w-full h-full">
      {bars.map((b, j) => (
        <rect
          key={j}
          x={b.x}
          y={150 - b.h}
          width="10"
          height={b.h}
          rx="2"
          fill={accent}
          fillOpacity={0.12 + (b.h / 90) * 0.35}
        />
      ))}
      <line x1="20" y1="150" x2="320" y2="150" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
    </svg>
  );
});

VizStream.displayName = 'VizStream';

const ProjectViz = ({ viz, idx }: { viz: VizType; idx: number }) => {
  const accent = idx % 2 === 0 ? '#C41E3A' : '#D4891A';
  if (viz === 'nodes') return <VizNodes accent={accent} />;
  if (viz === 'chart') return <VizChart accent={accent} idx={idx} />;
  if (viz === 'rings') return <VizRings accent={accent} idx={idx} />;
  return <VizStream accent={accent} idx={idx} />;
};

// ─── Card ──────────────────────────────────────────────────────────────────────

const ProjectCard = React.memo(({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => (
  <div className="group flex-shrink-0 w-[340px] will-change-transform">
    <div className="h-full rounded-3xl border border-black/5 dark:border-white/5 bg-card/70 dark:bg-zinc-900/80 shadow-sm dark:shadow-none hover:bg-card/90 dark:hover:bg-card/80 hover:border-black/10 dark:hover:border-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-black/40 hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer overflow-hidden">

      {/* Viz area */}
      <div className="h-[175px] relative overflow-hidden bg-black/20">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-crimson via-gold to-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        <ProjectViz viz={project.viz} idx={index} />

        {/* Watermark number */}
        <div className="absolute -bottom-3 -right-1 font-playfair text-[76px] font-black leading-none select-none pointer-events-none"
          style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Mono label */}
        <span className="absolute bottom-3 left-4 font-mono text-[9px] tracking-[0.14em] uppercase text-foreground/20 group-hover:text-foreground/40 transition-colors duration-400">
          Data.Process_{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-jakarta font-bold text-[17px] tracking-tight text-foreground group-hover:text-gold transition-colors duration-300 leading-snug">
          {project.name}
        </h3>
        <p className="text-[13px] text-foreground/50 mt-2 leading-relaxed line-clamp-2">
          {project.desc}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3.5 flex-wrap">
          {project.tags.slice(0, 4).map(tag => (
            <Badge
              key={tag}
              variant="premium"
              color={getTagColor(tag)}
              className="text-[10px] uppercase tracking-wider px-2.5 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex gap-1.5 flex-wrap">
            {project.metrics?.map(m => (
              <span
                key={m}
                className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                style={{
                  color: '#e07050',
                  borderColor: 'rgba(199,89,48,0.25)',
                  background: 'rgba(199,89,48,0.08)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
          <span className="font-mono text-[11px] text-crimson group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-1">
            Explore <span>→</span>
          </span>
        </div>
      </div>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

// ─── Section ───────────────────────────────────────────────────────────────────

// Card width (340px) + gap (20px) = 360px per card.
// Total track width for one set = 360 * allProjects.length.
// We duplicate the array and animate by exactly -50% (one full set width).
const CARD_W = 340;
const GAP = 20;
const STRIDE = CARD_W + GAP; // 360px per card

const Projects = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-100px' });

  const displayProjects = [...allProjects, ...allProjects, ...allProjects];
  const totalPx = STRIDE * allProjects.length;

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-[100px] md:py-[140px] relative z-20 bg-background overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 1000px'
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl will-change-transform"
          style={{ background: 'hsl(358 72% 46% / 0.04)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl will-change-transform"
          style={{ background: 'hsl(40 80% 42% / 0.04)' }} />
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-14 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold mb-3">
          <span className="text-crimson">/</span> Featured Work
        </p>
        <h2 className="font-jakarta font-extrabold text-[clamp(34px,6vw,50px)] tracking-tight text-foreground">
          Selected{' '}
          <span className="font-playfair italic font-medium bg-gradient-to-r from-crimson to-gold bg-clip-text text-transparent">
            Projects
          </span>
        </h2>
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(358 72% 46% / 0.5))' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-crimson to-gold" />
          <div className="w-12 h-px" style={{ background: 'linear-gradient(270deg, transparent, hsl(40 80% 42% / 0.5))' }} />
        </div>
      </motion.div>

      {/* Single Row Marquee - Constrained to Container */}
      <motion.div
        className="relative max-w-[1280px] mx-auto px-6 md:px-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scrollProjects {
            from { transform: translateX(0); }
            to { transform: translateX(-${totalPx}px); }
          }
          .animate-scroll-projects {
            animation: scrollProjects 50s linear infinite;
            animation-play-state: ${isInView ? 'running' : 'paused'};
          }
          .animate-scroll-projects:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="py-4">
          <div
            className="flex animate-scroll-projects"
            style={{ gap: GAP, width: 'max-content' }}
          >
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={`${project.name}-${index}`}
                project={project}
                index={index % allProjects.length}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <button
          onClick={() => navigate('/projects')}
          className="group font-mono text-[12px] tracking-wide text-crimson border border-crimson/30 px-10 py-4 rounded-full hover:border-gold/50 hover:text-gold hover:bg-gold/5 hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 hover:scale-105"
        >
          <span className="inline-flex items-center gap-2">
            View All Projects
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </button>
      </motion.div>

      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default Projects;
