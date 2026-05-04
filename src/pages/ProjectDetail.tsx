// src/pages/ProjectDetail.tsx
// Redesign: Editorial dossier — dense, layered, ink-meets-digital craft.
// No wasted air. Every element earns its place.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { PROJECT_DETAILS } from '@constants/projectDetails';
import LightRays from '@components/LightRays';

// ── Cursor follower ──────────────────────────────────────────────────────────
const MagneticCursor = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const [label, setLabel] = useState('');

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const enter = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? '');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', enter);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', enter); };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="rounded-full bg-white flex items-center justify-center overflow-hidden"
        animate={{ width: label ? 72 : 10, height: label ? 72 : 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {label && (
          <span className="font-mono text-[11px] uppercase tracking-widest text-black whitespace-nowrap px-2">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

// ── Ticker tape header ───────────────────────────────────────────────────────
const TickerTape = ({ items }: { items: string[] }) => {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-b border-t border-foreground/[0.06] py-2 relative">
      <div className="flex gap-0 ticker-inner" style={{ width: 'max-content' }}>
        {repeated.map((item, i) => (
          <span key={i} className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground/50 px-6 flex-shrink-0 flex items-center gap-6">
            {item}
            <span className="w-px h-3 bg-foreground/10 inline-block" />
          </span>
        ))}
      </div>
      <style>{`
        .ticker-inner { animation: ticker 28s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
      `}</style>
    </div>
  );
};

// ── Redacted text reveal ─────────────────────────────────────────────────────
const Redacted = ({ children }: { children: string }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      onClick={() => setRevealed(true)}
      data-cursor={revealed ? '' : 'REVEAL'}
      className="relative inline-block cursor-pointer group"
    >
      <span className={`transition-all duration-500 ${revealed ? 'blur-0 opacity-100' : 'blur-sm opacity-0 select-none'}`}>
        {children}
      </span>
      {!revealed && (
        <span
          className="absolute inset-0 rounded-sm flex items-center"
          style={{ background: 'hsl(var(--foreground) / 0.85)' }}
        />
      )}
    </span>
  );
};

// ── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ index, title }: { index: string; title: string }) => (
  <div className="flex items-center gap-4 mb-10">
    <span className="font-mono text-[12px] text-foreground/40 tracking-[0.3em] select-none">{index}</span>
    <div className="h-px flex-1 bg-foreground/[0.06]" />
    <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground/50">{title}</span>
    <div className="w-1.5 h-1.5 border border-foreground/20 rotate-45 flex-shrink-0" />
  </div>
);

// ── Pulse dot ───────────────────────────────────────────────────────────────
const PulseDot = ({ color = 'crimson' }: { color?: string }) => (
  <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
    <span
      className="absolute inline-flex w-full h-full rounded-full opacity-40 animate-ping"
      style={{ background: `hsl(var(--${color}))` }}
    />
    <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: `hsl(var(--${color}))` }} />
  </span>
);

// ── System architecture — horizontal scroll bento ────────────────────────────
const SystemMap = ({
  components,
  description,
}: {
  components: { name: string; role: string }[];
  description: string;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [active, setActive] = useState<number | null>(null);

  const COLORS = [
    { bg: 'hsl(var(--crimson) / 0.06)', border: 'hsl(var(--crimson) / 0.25)', accent: 'hsl(var(--crimson))' },
    { bg: 'hsl(var(--gold) / 0.06)',    border: 'hsl(var(--gold) / 0.25)',    accent: 'hsl(var(--gold))'    },
    { bg: 'hsl(var(--foreground) / 0.03)', border: 'hsl(var(--foreground) / 0.12)', accent: 'hsl(var(--foreground) / 0.6)' },
    { bg: 'hsl(var(--crimson) / 0.04)', border: 'hsl(var(--crimson) / 0.18)', accent: 'hsl(var(--crimson) / 0.7)' },
  ];

  return (
    <div>
      <p className="text-[15px] leading-[1.8] text-foreground/70 mb-8 max-w-[560px] font-medium">
        {description}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {components.map((comp, idx) => {
          const c = COLORS[idx % COLORS.length];
          const isActive = active === idx;
          return (
            <motion.div
              key={idx}
              onHoverStart={() => setActive(idx)}
              onHoverEnd={() => setActive(null)}
              data-cursor="DETAIL"
              className={`relative p-5 rounded-xl cursor-crosshair ${isDark ? 'glow-card' : ''}`}
              style={{
                background: isActive ? c.bg : undefined,
                border: isActive ? `1px solid ${c.border}` : undefined,
                boxShadow: isActive ? `0 0 20px ${c.accent}20` : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-[12px] text-foreground/40 tracking-widest">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{ background: isActive ? c.accent : 'hsl(var(--foreground) / 0.1)' }}
                />
              </div>
              <p
                className="font-mono text-[13px] font-bold uppercase tracking-tight mb-2"
                style={{ color: isActive ? c.accent : 'hsl(var(--foreground) / 0.7)' }}
              >
                {comp.name}
              </p>
              <p className="text-[14px] leading-[1.6] text-foreground/60 font-medium">
                {comp.role}
              </p>
              {isActive && (
                <motion.div
                  layoutId="arch-accent"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: c.accent }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── Timeline — vertical log ──────────────────────────────────────────────────
const Timeline = ({ items }: { items: { duration: string; phase: string; desc: string }[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative pl-6">
      {/* Vertical thread */}
      <div className="absolute left-0 top-2 bottom-2 w-px bg-foreground/[0.08]" />

      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          className="relative pb-8 last:pb-0 group"
        >
          {/* Node */}
          <div
            className="absolute -left-[25px] top-[7px] w-[9px] h-[9px] border border-foreground/20 group-hover:border-crimson transition-colors duration-300 rotate-45"
            style={{ background: 'hsl(var(--background))' }}
          />
          {/* Phase duration */}
          <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6">
            <span className="font-mono text-[12px] uppercase tracking-widest text-foreground/50 shrink-0 w-24 flex items-center gap-1.5">
              <span className="text-foreground/30">/</span>{item.duration}
            </span>
            <div>
              <h5 className="font-mono text-[14px] font-bold uppercase tracking-tight text-foreground/80 group-hover:text-foreground/100 transition-colors mb-1.5">
                {item.phase}
              </h5>
              <p className="text-[15px] leading-[1.8] text-foreground/60 font-medium max-w-[500px]">
                {item.desc}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative pl-0 pt-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/30 flex items-center gap-2">
          <span className="w-2 h-px bg-foreground/20" />
          eof
        </span>
      </div>
    </div>
  );
};

// ── Debrief — alternating pull quotes ───────────────────────────────────────
const Debrief = ({ learnings }: { learnings: string[] }) => (
  <div className="space-y-px">
    {learnings.map((learning, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.06 }}
        className="group relative flex gap-5 py-5 px-5 rounded-lg hover:bg-foreground/[0.02] transition-colors border border-transparent hover:border-foreground/[0.06]"
      >
        <div className="flex-shrink-0 flex flex-col items-center pt-1 gap-2">
          <span className="font-mono text-[12px] text-foreground/40 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
          <div
            className="w-px flex-1 min-h-[24px]"
            style={{ background: i % 2 === 0 ? 'hsl(var(--crimson) / 0.2)' : 'hsl(var(--gold) / 0.2)' }}
          />
        </div>
        <p className="text-[15px] leading-[1.8] text-foreground/70 font-medium group-hover:text-foreground/90 transition-colors">
          {learning}
        </p>
        <div
          className="absolute top-5 left-0 w-0.5 h-5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          style={{ background: i % 2 === 0 ? 'hsl(var(--crimson))' : 'hsl(var(--gold))' }}
        />
      </motion.div>
    ))}
  </div>
);

// ── Sticky TOC — left rail ───────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview',  label: 'OVERVIEW',  num: '00' },
  { id: 'problem',   label: 'MISSION',   num: '01' },
  { id: 'system',    label: 'ARCH',      num: '02' },
  { id: 'evidence',  label: 'EVIDENCE',  num: '03' },
  { id: 'timeline',  label: 'LOG',       num: '04' },
  { id: 'debrief',   label: 'DEBRIEF',   num: '05' },
];

const SidebarTOC = ({ active }: { active: string }) => (
  <aside className="hidden xl:flex flex-col sticky top-32 w-[80px] shrink-0 self-start">
    <div className="flex flex-col gap-1">
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{ textDecoration: 'none' }}
            className="group flex items-center gap-2 py-2 px-2 rounded-md transition-colors hover:bg-foreground/[0.03]"
          >
            <span
              className="font-mono text-[11px] transition-colors"
              style={{ color: isActive ? 'hsl(var(--crimson))' : 'hsl(var(--foreground) / 0.35)' }}
            >
              {s.num}
            </span>
            <motion.div
              className="h-px transition-all"
              animate={{
                width: isActive ? 20 : 8,
                background: isActive ? 'hsl(var(--crimson))' : 'hsl(var(--foreground) / 0.12)',
              }}
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.15em] transition-colors font-medium"
              style={{ color: isActive ? 'hsl(var(--foreground) / 0.9)' : 'hsl(var(--foreground) / 0.4)' }}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </div>
  </aside>
);

// ── Dynamic Tag Colors ───────────────────────────────────────────────────────
const getTagColors = (tag: string, isDark: boolean) => {
  const hash = Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = [270, 190, 150, 45, 340, 210]; // Purple, Cyan, Emerald, Amber, Rose, Blue
  const hue = hues[hash % hues.length];
  
  if (isDark) {
    return {
      color: `hsl(${hue} 80% 75%)`,
      background: `hsl(${hue} 80% 50% / 0.1)`,
      borderColor: `hsl(${hue} 80% 50% / 0.2)`,
      boxShadow: `inset 0 1px 3px hsl(${hue} 80% 50% / 0.1)`,
    };
  } else {
    return {
      color: `hsl(${hue} 80% 35%)`,
      background: `hsl(${hue} 80% 50% / 0.08)`,
      borderColor: `hsl(${hue} 80% 50% / 0.15)`,
      boxShadow: `none`,
    };
  }
};

// ── Main component ───────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTOC, setActiveTOC] = useState('overview');
  const [tagHovered, setTagHovered] = useState<string | null>(null);

  const project = PROJECT_DETAILS[slug ?? ''] ?? PROJECT_DETAILS['distributed-task-engine'];

  const hasCode    = !!(project.github && project.github !== '#' && project.github !== null);
  const hasDoc     = !!(project.docUrl && project.docUrl !== '#');
  const hasDiagram = !!(project.diagramUrl && project.diagramUrl !== '#');

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveTOC(e.target.id); }),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen relative" style={{ background: 'hsl(var(--background))' }}>
      <MagneticCursor />
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" style={{ mixBlendMode: isDark ? 'screen' : 'normal', opacity: isDark ? 0.5 : 0.6 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#7c5cfc"
          raysSpeed={1.2}
          lightSpread={isDark ? 0.8 : 0.6}
          rayLength={isDark ? 1.5 : 1.2}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={isDark ? 0.05 : 0.02}
          distortion={0.05}
          fadeDistance={isDark ? 0.8 : 0.6}
          pulsating={true}
          className="w-full h-full"
        />
      </div>

      {/* Reading progress — crimson thread */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[200] origin-left h-[2px]"
        style={{
          scaleX: progressScaleX,
          background: 'linear-gradient(to right, hsl(var(--crimson)), hsl(var(--gold)))',
        }}
      />

      {/* Subtle paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10 pt-20 md:pt-24">

        {/* ── Ticker tape ───────────────────────────────────────── */}
        <TickerTape items={[project.title, project.role, project.year, project.status, ...project.tags]} />

        {/* ── Layout shell ──────────────────────────────────────── */}
        <div className="flex gap-8 xl:gap-24 px-5 md:px-10 max-w-[1240px] mx-auto pt-12 relative z-10">
          <SidebarTOC active={activeTOC} />

          <main className="flex-1 min-w-0">

            {/* ════════════════════════════════════════════
                00  OVERVIEW
            ════════════════════════════════════════════ */}
            <section id="overview" className="mb-24">

              {/* Back nav */}
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                onClick={() => navigate('/projects')}
                data-cursor="BACK"
                className="inline-flex items-center gap-2 mb-12 group cursor-pointer"
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <div className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.18em] text-foreground/50 group-hover:text-foreground/90 transition-colors">
                  <svg width="8" height="8" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Projects
                </div>
              </motion.button>

              {/* Status row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                <div className="flex items-center gap-2">
                  <PulseDot color={project.status === 'Production' ? 'crimson' : 'gold'} />
                  <span className="font-mono text-[12px] uppercase tracking-widest text-foreground/60">
                    {project.status}
                  </span>
                </div>
                <span className="font-mono text-[12px] text-foreground/30">·</span>
                <span className="font-mono text-[12px] uppercase tracking-widest text-foreground/50">{project.year}</span>
                {!hasCode && (
                  <>
                    <span className="font-mono text-[12px] text-foreground/30">·</span>
                    <span
                      className="font-mono text-[11px] px-2.5 py-0.5 uppercase tracking-widest"
                      style={{
                        border: '1px solid hsl(var(--foreground) / 0.15)',
                        color: 'hsl(var(--foreground) / 0.5)',
                        borderRadius: 4,
                      }}
                    >
                      Private
                    </span>
                  </>
                )}
              </motion.div>

              {/* Title — tight, compressed */}
              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className={`font-winner uppercase leading-[0.9] tracking-tighter text-foreground ${isDark ? 'font-black' : 'font-semibold'}`}
                  style={{ fontSize: 'clamp(52px, 9vw, 104px)', letterSpacing: '-0.04em' }}
                >
                  {project.title}
                </motion.h1>
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className={`text-[16px] leading-[1.8] mb-10 max-w-[560px] ${isDark ? 'text-foreground/70 font-medium' : 'text-foreground/70 font-normal'}`}
              >
                {project.tagline}
              </motion.p>

              {/* Meta strip — horizontal, compact */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
                className="flex flex-col sm:flex-row sm:items-stretch gap-px mb-10 rounded-lg overflow-hidden border border-foreground/[0.07]"
              >
                {[
                  { label: 'Role', val: project.role },
                  { label: 'Team', val: project.team },
                  { label: 'Span', val: project.duration },
                ].map((m, i) => (
                  <div
                    key={m.label}
                    className="flex-1 px-4 py-3 flex flex-col gap-1"
                    style={{
                      background: i === 1 ? 'hsl(var(--foreground) / 0.02)' : 'hsl(var(--foreground) / 0.015)',
                      borderRight: i < 2 ? '1px solid hsl(var(--foreground) / 0.05)' : 'none',
                    }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">{m.label}</span>
                    <span className={`font-mono text-[14px] text-foreground/90 ${isDark ? 'font-bold' : 'font-medium'}`}>{m.val}</span>
                  </div>
                ))}

                {/* Stack inline */}
                <div
                  className="flex-[2] px-4 py-3 flex flex-col gap-2"
                  style={{ background: 'hsl(var(--foreground) / 0.01)', borderLeft: '1px solid hsl(var(--foreground) / 0.05)' }}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => {
                      const colors = getTagColors(tag, isDark);
                      return (
                        <span
                          key={tag}
                          onMouseEnter={() => setTagHovered(tag)}
                          onMouseLeave={() => setTagHovered(null)}
                          className="font-mono text-[12px] px-4 py-1.5 uppercase tracking-widest transition-all cursor-default rounded-full"
                          style={{
                            color: colors.color,
                            backgroundColor: colors.background,
                            borderColor: colors.borderColor,
                            boxShadow: colors.boxShadow,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            opacity: tagHovered && tagHovered !== tag ? 0.5 : 1,
                            transform: tagHovered === tag ? 'translateY(-1px)' : 'none',
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Action links */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.78 }}
                className="flex flex-wrap items-center gap-2 mb-10"
              >
                {hasCode && (
                  <a
                    href={project.github!}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="OPEN"
                    className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] px-5 py-2.5 rounded transition-all"
                    style={{
                      background: 'hsl(var(--foreground))',
                      color: 'hsl(var(--background))',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Source Code
                  </a>
                )}
                {hasDoc && (
                  <a
                    href={project.docUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="READ"
                    className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] px-5 py-2.5 rounded transition-all hover:bg-foreground/[0.04]"
                    style={{ border: '1px solid hsl(var(--foreground) / 0.15)', color: 'hsl(var(--foreground) / 0.6)' }}
                  >
                    Docs →
                  </a>
                )}
                {hasDiagram && (
                  <a
                    href={project.diagramUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="VIEW"
                    className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] px-5 py-2.5 rounded transition-all hover:bg-foreground/[0.04]"
                    style={{ border: '1px solid hsl(var(--foreground) / 0.15)', color: 'hsl(var(--foreground) / 0.6)' }}
                  >
                    Diagrams →
                  </a>
                )}
                {!hasCode && !hasDoc && !hasDiagram && (
                  <span className="font-mono text-[12px] text-foreground/40 italic">
                    Source restricted. Artifacts available on request.
                  </span>
                )}
              </motion.div>

              {/* Resource links */}
              {([...project.videoLinks, ...project.extraLinks]).length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/50 mr-1">
                    Resources /
                  </span>
                  {[...project.videoLinks, ...project.extraLinks].map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="OPEN"
                      className="inline-flex items-center gap-1.5 font-mono text-[12px] px-4 py-1.5 rounded-full transition-all border hover:border-foreground/30"
                      style={{
                        border: '1px solid hsl(var(--foreground) / 0.1)',
                        color: 'hsl(var(--foreground) / 0.5)',
                      }}
                    >
                      {link.title}
                      <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ))}
                </motion.div>
              )}
            </section>

            {/* ════════════════════════════════════════════
                01  MISSION PARAMETERS
            ════════════════════════════════════════════ */}
            <section id="problem" className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionLabel index="01" title="Mission Parameters" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {/* Problem */}
                  <div
                    className={`relative p-8 rounded-xl overflow-hidden group ${isDark ? 'glow-card' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <div
                        className="w-1.5 h-6 rounded-full shadow-[0_0_10px_rgba(124,92,252,0.8)]"
                        style={{ background: 'hsl(var(--crimson))' }}
                      />
                      <span className="font-mono text-[12px] uppercase tracking-[0.25em] text-foreground/60 font-medium">
                        Critical Friction
                      </span>
                    </div>
                    <p className="text-[15px] leading-[1.8] text-foreground/70 font-medium">
                      {project.problem}
                    </p>
                    {/* Corner accent */}
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-25 transition-opacity"
                      style={{
                        borderTop: '1px solid hsl(var(--crimson))',
                        borderLeft: '1px solid hsl(var(--crimson))',
                        transform: 'rotate(180deg)',
                      }}
                    />
                  </div>

                  {/* Solution */}
                  <div
                    className={`relative p-8 rounded-xl overflow-hidden group ${isDark ? 'glow-card' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <div
                        className="w-1.5 h-6 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                        style={{ background: 'hsl(var(--gold))' }}
                      />
                      <span className="font-mono text-[12px] uppercase tracking-[0.25em] text-foreground/60 font-medium">
                        Engineering Fix
                      </span>
                    </div>
                    <p className="text-[15px] leading-[1.8] text-foreground/70 font-medium">
                      {project.solution}
                    </p>
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-25 transition-opacity"
                      style={{
                        borderTop: '1px solid hsl(var(--gold))',
                        borderLeft: '1px solid hsl(var(--gold))',
                        transform: 'rotate(180deg)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ════════════════════════════════════════════
                02  SYSTEM ARCHITECTURE
            ════════════════════════════════════════════ */}
            <section id="system" className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionLabel index="02" title="System Architecture" />
                <SystemMap
                  components={project.architecture.components}
                  description={project.architecture.description}
                />
              </motion.div>
            </section>

            {/* ════════════════════════════════════════════
                03  EVIDENCE & ARTIFACTS
            ════════════════════════════════════════════ */}
            {(project.screenshots?.length > 0 || project.videoLinks?.length > 0) && (
              <section id="evidence" className="mb-24">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <SectionLabel index="03" title="Visual Evidence" />
                  
                  {project.screenshots && project.screenshots.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {project.screenshots.map((shot: any, idx: number) => (
                        <div key={idx} className={`relative rounded-xl overflow-hidden group ${isDark ? 'glow-card' : 'bg-foreground/[0.02] border border-foreground/[0.05]'}`} style={{ border: isDark ? 'none' : undefined }}>
                          <div className="aspect-video overflow-hidden bg-foreground/[0.03]">
                            <img 
                              src={`https://picsum.photos/seed/${project.id}-${idx}/800/450`} 
                              alt={shot.caption}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4 border-t border-foreground/[0.05]" style={{ background: 'hsl(var(--background) / 0.5)' }}>
                            <p className="text-[13px] text-foreground/70 font-medium">
                              {shot.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {project.videoLinks && project.videoLinks.length > 0 && (
                    <div className={`relative p-8 rounded-xl overflow-hidden group ${isDark ? 'glow-card' : 'bg-foreground/[0.02] border border-foreground/[0.05]'}`} style={{ border: isDark ? 'none' : undefined }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full shadow-[0_0_10px_rgba(124,92,252,0.8)]" style={{ background: 'hsl(var(--crimson))' }} />
                        <h4 className="font-mono text-[14px] uppercase tracking-widest text-foreground/80">Video Demonstrations</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.videoLinks.map((vid: any, idx: number) => (
                          <a key={idx} href={vid.url} target="_blank" rel="noopener noreferrer" className={`relative rounded-xl overflow-hidden group/link block ${isDark ? 'bg-foreground/[0.02] border border-foreground/[0.05]' : 'bg-background border border-foreground/[0.08]'}`}>
                            <div className="relative aspect-video overflow-hidden">
                              <img 
                                src={`https://picsum.photos/seed/video-${project.id}-${idx}/800/450`} 
                                alt={vid.title}
                                className="w-full h-full object-cover opacity-80 group-hover/link:opacity-100 transition-opacity duration-500"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-xl border border-foreground/10 group-hover/link:scale-110 transition-transform duration-300">
                                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-t-transparent border-b-transparent border-l-crimson ml-1" />
                                </div>
                              </div>
                            </div>
                            <div className="p-4 border-t border-foreground/[0.05]">
                              <p className="text-[15px] font-medium text-foreground/90 mb-1 group-hover/link:text-crimson transition-colors">{vid.title}</p>
                              <p className="text-[13px] text-foreground/50">{vid.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </section>
            )}

            {/* ════════════════════════════════════════════
                04  EXECUTION LOG
            ════════════════════════════════════════════ */}
            <section id="timeline" className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionLabel index="04" title="Execution Log" />
                <Timeline items={project.timeline} />
              </motion.div>
            </section>

            {/* ════════════════════════════════════════════
                05  DEBRIEF
            ════════════════════════════════════════════ */}
            <section id="debrief" className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionLabel index="05" title="Retrospective" />
                <Debrief learnings={project.learnings} />
              </motion.div>
            </section>

            {/* ════════════════════════════════════════════
                CTA STRIP + MORE PROJECTS
            ════════════════════════════════════════════ */}
            <section className="mb-0">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="lg:col-span-2 relative p-6 rounded-lg overflow-hidden"
                  style={{
                    background: isDark
                      ? 'hsl(var(--crimson) / 0.06)'
                      : 'hsl(var(--crimson) / 0.03)',
                    border: '1px solid hsl(var(--crimson) / 0.15)',
                  }}
                >
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3 block"
                    style={{ color: 'hsl(var(--crimson) / 0.7)' }}
                  >
                    Colombo, LK
                  </span>
                  <h3
                    className="font-winner font-black leading-tight mb-2 uppercase"
                    style={{
                      fontSize: 'clamp(16px, 2vw, 20px)',
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    Open to the right opportunity.
                  </h3>
                  <p className="text-[14px] leading-relaxed text-foreground/70 mb-5">
                    Full-time, contract, or consulting.
                  </p>
                  <button
                    onClick={() => navigate('/#contact')}
                    data-cursor="GO"
                    className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] px-5 py-2.5 rounded transition-all"
                    style={{
                      background: 'hsl(var(--crimson))',
                      color: '#fff',
                    }}
                  >
                    Get in touch
                    <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Decorative mask silhouette hint */}
                  <div
                    className="absolute bottom-0 right-0 w-20 h-20 opacity-[0.04]"
                    style={{
                      background: 'hsl(var(--crimson))',
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                  />
                </motion.div>

                {/* More projects ticker */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="lg:col-span-3 rounded-lg overflow-hidden"
                  style={{
                    border: '1px solid hsl(var(--foreground) / 0.07)',
                    background: isDark ? 'hsl(var(--foreground) / 0.015)' : 'hsl(var(--foreground) / 0.01)',
                  }}
                >
                  <div
                    className="px-4 py-2.5 flex items-center justify-between"
                    style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.05)' }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                      More Projects
                    </span>
                    <button
                      onClick={() => navigate('/projects')}
                      className="font-mono text-[11px] uppercase tracking-widest text-foreground/50 hover:text-foreground/90 transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="relative overflow-hidden py-3">
                    <style>{`
                      @keyframes moreScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                      .more-scroll { animation: moreScroll 20s linear infinite; }
                      .more-scroll:hover { animation-play-state: paused; }
                    `}</style>
                    <div
                      className="flex more-scroll gap-2 cursor-pointer"
                      onClick={() => navigate('/projects')}
                      style={{ width: 'fit-content' }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-36 p-3 rounded-lg hover:-translate-y-0.5 transition-transform"
                          style={{
                            border: '1px solid hsl(var(--foreground) / 0.06)',
                            background: isDark ? 'hsl(var(--foreground) / 0.03)' : 'hsl(var(--foreground) / 0.025)',
                          }}
                        >
                          <div
                            className="aspect-video rounded-md mb-2 flex items-center justify-center"
                            style={{ background: 'hsl(var(--foreground) / 0.03)' }}
                          >
                            <span className="font-mono text-[11px] text-foreground/30">
                              {String((i % 4) + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] font-semibold text-foreground/60">View all →</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

              </div>
            </section>

          </main>
        </div>

        {/* Footer fade */}
        <div
          className="h-48 relative z-10 -mt-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, hsl(var(--background)) 60%)',
          }}
        />

        <Footer />
      </div>
    </div>
  );
};

export default ProjectDetail;