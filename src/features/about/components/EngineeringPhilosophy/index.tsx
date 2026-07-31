// src/features/philosophy/components/EngineeringPhilosophy.tsx

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import { DiscoveryMockup } from './mockups/DiscoveryMockup';
import { DesignMockup } from './mockups/DesignMockup';
import { DevelopmentMockup } from './mockups/DevelopmentMockup';
import { DeliveryMockup } from './mockups/DeliveryMockup';
import { QAMockup } from './mockups/QAMockup';

// Canvas coordinate basis. All node boxes and connector paths are authored
// against this pixel space, then converted to percentages so the whole
// canvas can scale with an aspect-ratio wrapper without distorting curves.
const VB_W = 1850;
const VB_H = 750;

const pct = (px: number, axis: 'x' | 'y') => `${(px / (axis === 'x' ? VB_W : VB_H)) * 100}%`;

// Colors are CSS-variable references, not hex, so every node and connector
// tracks the site's theme (Obsidian Violet primary / Luminous Cyan secondary)
// in both light and dark mode instead of a hardcoded palette.
const hslVar = (cssVar: string, alpha = 1) => `hsl(var(${cssVar}) / ${alpha})`;

interface WorkflowNodeData {
  id: string;
  kind: 'trigger' | 'node';
  num: string;
  colorVar: string;
  icon: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  Mockup: React.ComponentType;
  box: { x: number; y: number; w: number; h: number };
  inYPct?: number;
  outYPct?: number;
}

const NODES: WorkflowNodeData[] = [
  {
    id: 'discovery',
    kind: 'trigger',
    num: '01',
    colorVar: '--primary',
    icon: '🔍',
    title: 'Discovery & Strategy',
    subtitle: 'Phase 1 · Research',
    body: "Understanding the problem, defining the scope, and aligning on goals before writing a single line of code.",
    tags: ['Research', 'Wireframes', 'Requirements'],
    Mockup: DiscoveryMockup,
    box: { x: 30, y: 190, w: 290, h: 220 },
    outYPct: 45,
  },
  {
    id: 'design',
    kind: 'node',
    num: '02',
    colorVar: '--secondary',
    icon: '🎨',
    title: 'UI/UX Design',
    subtitle: 'Phase 2 · Prototyping',
    body: 'Crafting intuitive user experiences and pixel-perfect interfaces that delight users and drive engagement.',
    tags: ['Figma', 'Prototyping', 'Design System'],
    Mockup: DesignMockup,
    box: { x: 400, y: 40, w: 290, h: 220 },
    inYPct: 55,
    outYPct: 70,
  },
  {
    id: 'development',
    kind: 'node',
    num: '03',
    colorVar: '--primary',
    icon: '💻',
    title: 'Development & Implementation',
    subtitle: 'Phase 3 · Code',
    body: 'Building scalable, performant systems rapidly by combining deep engineering expertise with modern AI workflows.',
    tags: ['Clean Code', 'Performance', 'Architecture'],
    Mockup: DevelopmentMockup,
    box: { x: 770, y: 285, w: 290, h: 220 },
    inYPct: 35,
    outYPct: 45,
  },
  {
    id: 'qa',
    kind: 'node',
    num: '04',
    colorVar: '--secondary',
    icon: '🧪',
    title: 'QA & Automated Testing',
    subtitle: 'Phase 4 · Validation',
    body: 'Ensuring absolute reliability through comprehensive integration tests, performance audits, and rigorous QA.',
    tags: ['E2E Tests', 'Performance', 'Reliability'],
    Mockup: QAMockup,
    box: { x: 1140, y: 110, w: 290, h: 220 },
    inYPct: 60,
    outYPct: 65,
  },
  {
    id: 'delivery',
    kind: 'node',
    num: '05',
    colorVar: '--primary',
    icon: '🚀',
    title: 'CI/CD Delivery',
    subtitle: 'Phase 5 · Launch',
    body: 'Deploying with confidence, monitoring performance, and iterating continuously based on real user feedback.',
    tags: ['Pipelines', 'Analytics', 'Iteration'],
    Mockup: DeliveryMockup,
    box: { x: 1510, y: 300, w: 290, h: 220 },
    inYPct: 40,
  },
];

// Data for connections
const CONNECTIONS_DATA = [
  { from: 'discovery', to: 'design' },
  { from: 'design', to: 'development' },
  { from: 'development', to: 'qa' },
  { from: 'qa', to: 'delivery' },
];

// ─── Dot-grid canvas background ─────────────────────────────────────────────
const CanvasGrid = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `radial-gradient(circle, ${hslVar('--foreground', 0.08)} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '-9px -9px',
    }}
  />
);

// ─── Connector layer ─────────────────────────────────────────────────────────
const ConnectorLayer = ({ isInView, anchors }: { isInView: boolean; anchors: Record<string, { x: number; y: number; outX: number; outY: number; inX: number; inY: number }> }) => {
  if (Object.keys(anchors).length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
    >
      <defs>
        <marker id="wf-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L8 4L0 8Z" fill={hslVar('--primary', 0.65)} />
        </marker>
      </defs>

      {CONNECTIONS_DATA.map((c, i) => {
        const fromNode = NODES.find((n) => n.id === c.from);
        const toNode = NODES.find((n) => n.id === c.to);
        if (!fromNode || !toNode) return null;

        const fromAnchor = anchors[c.from];
        const toAnchor = anchors[c.to];
        if (!fromAnchor || !toAnchor) return null;

        const a = { x: fromAnchor.outX, y: fromAnchor.outY };
        const b = { x: toAnchor.inX, y: toAnchor.inY };
        const dx = (b.x - a.x) * 0.5;
        const d = `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;

        return (
          <g key={`${c.from}-${c.to}`}>
            <motion.path
              d={d}
              fill="none"
              stroke={hslVar(toNode.colorVar, 0.35)}
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#wf-arrow)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.25 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
            {isInView && (
              <motion.circle
                r="3.5"
                fill={hslVar(toNode.colorVar, 1)}
                style={{ offsetPath: `path("${d}")`, offsetRotate: '0deg' }}
                animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 1.2 + i * 0.5 }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Workflow node ───────────────────────────────────────────────────────────
const WorkflowNode = ({ node, index, registerNode }: { node: WorkflowNodeData; index: number; registerNode: (id: string, el: HTMLDivElement | null) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const isTrigger = node.kind === 'trigger';

  return (
    <motion.div
      ref={(el) => {
        if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        registerNode(node.id, el);
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group absolute z-10"
      style={{ left: pct(node.box.x, 'x'), top: pct(node.box.y, 'y'), width: pct(node.box.w, 'x') }}
    >
      <div
        className="relative overflow-hidden border border-border bg-card/95 backdrop-blur-md transition-all duration-400 hover:border-foreground/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        style={{ borderRadius: isTrigger ? '999px 14px 14px 999px' : '14px' }}
      >
        <span className="absolute right-3 top-3 z-10 flex h-2 w-2">
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full"
            style={{ backgroundColor: hslVar(node.colorVar) }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          />
        </span>

        <div className={isTrigger ? 'px-5 py-4' : 'px-4 py-3.5'}>
          <div className="mb-2 flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[13px]"
              style={{
                backgroundColor: hslVar(node.colorVar, 0.1),
                color: hslVar(node.colorVar),
                border: `1px solid ${hslVar(node.colorVar, 0.25)}`,
              }}
            >
              {node.icon}
            </span>
            <div className="min-w-0">
              <p className="font-jakarta text-[13px] font-semibold leading-tight text-foreground">{node.title}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">{node.subtitle}</p>
            </div>
          </div>

          <p className="mb-3 text-[11.5px] leading-[1.55] text-muted-foreground">{node.body}</p>

          <div className="mb-3 h-[64px] overflow-hidden rounded-md border border-border bg-foreground/[0.02]">
            <div className="flex h-full items-center justify-center p-1.5">
              <node.Mockup />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {node.tags.map((tag) => (
              <span key={tag} className="rounded border border-border px-[6px] py-[2px] font-mono text-[8.5px] tracking-[0.02em] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {!isTrigger && node.inYPct !== undefined && (
          <span
            className="absolute -left-[5px] h-[10px] w-[10px] -translate-y-1/2 rounded-full border-2 bg-background z-20"
            style={{ top: `${node.inYPct}%`, borderColor: hslVar(node.colorVar) }}
          />
        )}
        {index < NODES.length - 1 && node.outYPct !== undefined && (
          <span
            className="absolute -right-[5px] h-[10px] w-[10px] -translate-y-1/2 rounded-full border-2 z-20"
            style={{ top: `${node.outYPct}%`, borderColor: hslVar(node.colorVar), backgroundColor: hslVar(node.colorVar) }}
          />
        )}
      </div>
    </motion.div>
  );
};

// ─── Mobile fallback ─────────────────────────────────────────────────────────
const MobileNodeStack = () => (
  <div className="flex flex-col gap-0 sm:hidden">
    {NODES.map((node, i) => (
      <div key={node.id} className="relative">
        <div
          className="relative overflow-hidden border border-border bg-card/95 px-4 py-4"
          style={{ borderRadius: node.kind === 'trigger' ? '999px 14px 14px 999px' : '14px', borderLeft: `2px solid ${hslVar(node.colorVar, 0.5)}` }}
        >
          <div className="mb-2 flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[13px]"
              style={{
                backgroundColor: hslVar(node.colorVar, 0.1),
                color: hslVar(node.colorVar),
                border: `1px solid ${hslVar(node.colorVar, 0.25)}`,
              }}
            >
              {node.icon}
            </span>
            <div>
              <p className="font-jakarta text-[13px] font-semibold text-foreground">{node.title}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">{node.subtitle}</p>
            </div>
          </div>
          <p className="mb-3 text-[12px] leading-[1.6] text-muted-foreground">{node.body}</p>
          <div className="flex flex-wrap gap-1">
            {node.tags.map((tag) => (
              <span key={tag} className="rounded border border-border px-[6px] py-[2px] font-mono text-[8.5px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {i < NODES.length - 1 && <div className="ml-7 h-8 w-px border-l border-dashed border-border" />}
      </div>
    ))}
  </div>
);

// ─── Canvas chrome ───────────────────────────────────────────────────────────
const CanvasChrome = () => (
  <div className="absolute left-4 top-4 z-20 hidden items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-1.5 backdrop-blur-sm sm:flex">
    <div className="flex gap-1.5">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]/70" />
    </div>
  </div>
);

// ─── CTA Section ─────────────────────────────────────────────────────────────
const CTASection = ({ isInView }: { isInView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.7, delay: 0.4 }}
    className="mt-12 flex flex-col items-center gap-5 text-center md:mt-16"
  >
    <div className="flex flex-col items-center gap-3">
      <p className="max-w-[480px] text-sm leading-relaxed text-muted-foreground">
        Ready to start a project? Download my resume or get in touch to discuss how we can work together.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-[#d60d86]/30 bg-[#d60d86] px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:border-[#d60d86]/50 hover:shadow-md"
        >
          <svg className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-sm">Download Resume (PDF)</span>
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 font-medium text-foreground shadow-sm transition-all hover:border-foreground/20 hover:shadow-md"
        >
          <span className="text-sm">Get in Touch</span>
        </a>
      </div>
    </div>
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const EngineeringPhilosophy = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasInView = useInView(canvasRef, { once: true, margin: '-120px' });
  
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [anchors, setAnchors] = useState<Record<string, {x:number;y:number;outX:number;outY:number;inX:number;inY:number}>>({});

  const registerNode = (id: string, el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  };

  useEffect(() => {
    const measure = () => {
      if (!canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const next: typeof anchors = {};
      
      NODES.forEach((node) => {
        const el = nodeRefs.current[node.id];
        if (!el) return;
        const r = el.getBoundingClientRect();
        next[node.id] = {
          x: r.left - canvasRect.left,
          y: r.top - canvasRect.top,
          outX: r.right - canvasRect.left,
          outY: r.top - canvasRect.top + r.height * ((node.outYPct ?? 50) / 100),
          inX: r.left - canvasRect.left,
          inY: r.top - canvasRect.top + r.height * ((node.inYPct ?? 50) / 100),
        };
      });
      
      setAnchors(next);
    };

    // Use ResizeObserver for accurate sizing changes, plus window resize as backup
    const resizeObserver = new ResizeObserver(() => measure());
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }
    
    measure();
    window.addEventListener('resize', measure);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background py-[90px] md:py-[120px]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-100"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${hslVar('--primary', 0.25)}, transparent 70%)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[20vh]"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)' }}
      />

      <div className="relative z-20 mx-auto max-w-[1850px] px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20 flex flex-col items-center"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Workflow &{' '}
            <span className="font-playfair italic font-medium text-[#d60d86]">
              Process
            </span>
          </h2>
          <p className="text-sm text-foreground/40 leading-relaxed max-w-[280px]">
            From initial concept to final deployment, here's how I bring ideas to life.
          </p>
        </motion.div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative hidden overflow-hidden rounded-2xl border border-border bg-card/40 shadow-[0_30px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:block"
          style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
        >
          <CanvasGrid />
          <CanvasChrome />
          <ConnectorLayer isInView={canvasInView} anchors={anchors} />
          {NODES.map((node, i) => (
            <WorkflowNode key={node.id} node={node} index={i} registerNode={registerNode} />
          ))}
        </div>

        <div className="sm:hidden">
          <MobileNodeStack />
        </div>

        {/* CTA Section */}
        <CTASection isInView={isInView} />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[100px]"
        style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }}
      />
    </section>
  );
};

export default EngineeringPhilosophy;