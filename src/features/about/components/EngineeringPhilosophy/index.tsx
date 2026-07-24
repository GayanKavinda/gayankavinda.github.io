// src/features/philosophy/components/EngineeringPhilosophy.tsx

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import { ObservabilityMockup } from './mockups/ObservabilityMockup';
import { SimplicityMockup } from './mockups/SimplicityMockup';
import { TestingMockup } from './mockups/TestingMockup';
import { FailureMockup } from './mockups/FailureMockup';

// Canvas coordinate basis. All node boxes and connector paths are authored
// against this pixel space, then converted to percentages so the whole
// canvas can scale with an aspect-ratio wrapper without distorting curves.
const VB_W = 1320;
const VB_H = 600;

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
    id: 'trigger',
    kind: 'trigger',
    num: '01',
    colorVar: '--primary',
    icon: '⚡',
    title: 'Observability-first',
    subtitle: 'Trigger · always on',
    body: "If you can't measure it, you can't improve it. Instrumented from day one.",
    tags: ['Traces', 'Metrics', 'Dashboards'],
    Mockup: ObservabilityMockup,
    box: { x: 30, y: 190, w: 260, h: 220 },
    outYPct: 45,
  },
  {
    id: 'simplicity',
    kind: 'node',
    num: '02',
    colorVar: '--secondary',
    icon: '◈',
    title: 'Simplicity over cleverness',
    subtitle: 'Node · code review',
    body: 'Boring technology for boring problems. Complexity only where it earns its place.',
    tags: ['Readable', 'Boring tech', 'Debuggable'],
    Mockup: SimplicityMockup,
    box: { x: 340, y: 40, w: 280, h: 220 },
    inYPct: 55,
    outYPct: 70,
  },
  {
    id: 'testing',
    kind: 'node',
    num: '03',
    colorVar: '--primary',
    icon: '◉',
    title: 'Test at the boundaries',
    subtitle: 'Node · CI pipeline',
    body: 'Integration over unit tests. Mock at the network edge, not inside the domain.',
    tags: ['Integration', 'Network mocks', 'Fast loop'],
    Mockup: TestingMockup,
    box: { x: 680, y: 285, w: 280, h: 220 },
    inYPct: 35,
    outYPct: 45,
  },
  {
    id: 'failure',
    kind: 'node',
    num: '04',
    colorVar: '--secondary',
    icon: '◇',
    title: 'Design for failure',
    subtitle: 'Node · resilience layer',
    body: 'Circuit breakers and graceful degradation are first-class, never afterthoughts.',
    tags: ['Circuit breakers', 'Retry budgets', 'Degradation'],
    Mockup: FailureMockup,
    box: { x: 1020, y: 160, w: 265, h: 220 },
    inYPct: 60,
  },
];

// Individual connections with natural horizontal-tangent cubic S-curves connecting exact node entry/exit dots
const CONNECTIONS = [
  {
    from: NODES[0],
    to: NODES[1],
    get path() {
      const a = { x: NODES[0].box.x + NODES[0].box.w, y: NODES[0].box.y + NODES[0].box.h * ((NODES[0].outYPct ?? 50) / 100) };
      const b = { x: NODES[1].box.x, y: NODES[1].box.y + NODES[1].box.h * ((NODES[1].inYPct ?? 50) / 100) };
      const dx = Math.max(45, (b.x - a.x) * 0.5);
      return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
    },
  },
  {
    from: NODES[1],
    to: NODES[2],
    get path() {
      const a = { x: NODES[1].box.x + NODES[1].box.w, y: NODES[1].box.y + NODES[1].box.h * ((NODES[1].outYPct ?? 50) / 100) };
      const b = { x: NODES[2].box.x, y: NODES[2].box.y + NODES[2].box.h * ((NODES[2].inYPct ?? 50) / 100) };
      const dx = Math.max(45, (b.x - a.x) * 0.5);
      return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
    },
  },
  {
    from: NODES[2],
    to: NODES[3],
    get path() {
      const a = { x: NODES[2].box.x + NODES[2].box.w, y: NODES[2].box.y + NODES[2].box.h * ((NODES[2].outYPct ?? 50) / 100) };
      const b = { x: NODES[3].box.x, y: NODES[3].box.y + NODES[3].box.h * ((NODES[3].inYPct ?? 50) / 100) };
      const dx = Math.max(45, (b.x - a.x) * 0.5);
      return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
    },
  },
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
const ConnectorLayer = ({ isInView }: { isInView: boolean }) => (
  <svg
    viewBox={`0 0 ${VB_W} ${VB_H}`}
    className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <marker id="wf-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0L8 4L0 8Z" fill={hslVar('--primary', 0.65)} />
      </marker>
    </defs>

    {CONNECTIONS.map((c, i) => {
      const d = c.path;
      return (
        <g key={`${c.from.id}-${c.to.id}`}>
          <motion.path
            d={d}
            fill="none"
            stroke={hslVar(c.to.colorVar, 0.35)}
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
              fill={hslVar(c.to.colorVar, 1)}
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

// ─── Workflow node ───────────────────────────────────────────────────────────
const WorkflowNode = ({ node, index }: { node: WorkflowNodeData; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const isTrigger = node.kind === 'trigger';

  return (
    <motion.div
      ref={ref}
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
        These principles guide every line of code I write. Want to see them in action?
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
        >
          <span className="text-sm">View Projects</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
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

      <div className="relative z-20 mx-auto max-w-[1380px] px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20 flex flex-col items-center"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Engineering{' '}
            <span className="font-playfair italic font-medium text-[#7C5CFC]">
              Philosophy
            </span>
          </h2>
          <p className="text-sm text-foreground/40 leading-relaxed max-w-[280px]">
            Architecting scalable systems and refined sensory experiences across 10 years of engineering.
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
          <ConnectorLayer isInView={canvasInView} />
          {NODES.map((node, i) => (
            <WorkflowNode key={node.id} node={node} index={i} />
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