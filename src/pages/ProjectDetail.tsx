// src/pages/ProjectDetail.tsx
// Zen Redesign: Minimal • Spacious • Intentional • Calm

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { PROJECT_DETAILS } from '@constants/projectDetails';
import LightRays from '@components/LightRays';
import Aurora from '@components/Aurora';
import BorderGlow from '@components/BorderGlow';
import { CardStack } from '@components/ui/card-stack';
import ScrollImageSequence from '@components/animations/ScrollImageSequence';

// ── Reduced Motion Hook ─────────────────────────────────────────────────────
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return reducedMotion;
};


// ── Animated Section Wrapper ────────────────────────
const AnimatedSection = ({ 
  id, 
  children, 
  delay = 0,
  direction = 'up' 
}: { 
  id: string; 
  children: React.ReactNode; 
  delay?: number;
  direction?: 'up' | 'left' | 'right'
}) => {
  const initial = {
    up:    { opacity: 0, y: 50 },
    left:  { opacity: 0, x: -30 },
    right: { opacity: 0, x: 30 },
  }[direction];

  return (
    <motion.section
      id={id}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100px]"
    >
      {children}
    </motion.section>
  );
};

// ── Magnetic Cursor (Subtle Zen version) ───────────────────────────────
const MagneticCursor = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });
  const [label, setLabel] = useState('');

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const enter = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? '');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', enter);
    };
  }, [x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="rounded-full border border-white/40 flex items-center justify-center"
        animate={{ width: label ? 64 : 6, height: label ? 64 : 6 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        {label && <span className="font-mono text-[10px] uppercase tracking-widest text-white">{label}</span>}
      </motion.div>
    </motion.div>
  );
};

// ── Mouse Proximity Glow Text Effect ─────────────────────────────────────
const GlowText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative transition-all duration-700 ${className}`}
      style={{
        background: `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, hsla(var(--crimson), 0.08), transparent 70%)`,
      }}
    >
      {children}
    </div>
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

// ── Section Label (Zen) ───────────────────────────────────────────────────
const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <motion.div 
    className="flex items-center gap-6 mb-16"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    <span className="font-mono text-xs tracking-[0.125em] text-foreground/40">{num}</span>
    <div className="h-px flex-1 bg-foreground/10" />
    <span className="font-mono uppercase text-sm tracking-[0.1em] text-foreground/60">{title}</span>
  </motion.div>
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

// ── Real-time Streaming Architecture (Zen) ──────────────────────────────────
const StreamingArchitecture = ({ components, description }: { 
  components: { name: string; role: string; detail?: string }[];
  description: string;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-3xl mx-auto space-y-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 mb-6">
          <span className="text-[10px] font-mono tracking-widest text-crimson font-bold uppercase">Technical Schema</span>
        </div>
        <h3 className="text-4xl font-light tracking-tight">{description}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {components.map((comp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 rounded-3xl border border-foreground/10 hover:border-foreground/20 transition-all duration-500 hover:-translate-y-1"
          >
            <div className={`w-2 h-2 rounded-full mb-6 transition-all group-hover:scale-125 ${isDark ? 'bg-white' : 'bg-foreground'}`} />
            <h4 className="text-xl font-medium mb-3">{comp.name}</h4>
            <p className="text-foreground/70 leading-relaxed font-medium">{comp.role}</p>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 border-t border-foreground/10 text-center text-[11px] font-mono text-foreground/40 tracking-widest uppercase">
        Engineered for performance • Zero-downtime scalability
      </div>
    </div>
  );
};

// ── Timeline — Zen version ──────────────────────────────────────────────────
const Timeline = ({ items }: { items: { duration: string; phase: string; desc: string }[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-2 bottom-2 w-px bg-foreground/[0.08]" />
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          className="relative pb-16 last:pb-0 group"
        >
          <div
            className={`absolute -left-[25px] top-[7px] w-2 h-2 rounded-full transition-colors duration-300 ${isDark ? 'bg-foreground/20' : 'bg-foreground/40'}`}
            style={{ background: isDark ? 'hsl(var(--background))' : '#ffffff' }}
          />
          <div className="flex flex-col gap-2">
            <span className={`font-mono text-[11px] uppercase tracking-widest ${isDark ? 'text-foreground/40' : 'text-foreground/50'}`}>
              {item.duration}
            </span>
            <h5 className="text-xl font-medium tracking-tight mb-2">
              {item.phase}
            </h5>
            <p className={`text-[16px] leading-[1.8] font-medium max-w-[640px] ${isDark ? 'text-foreground/60' : 'text-foreground/70'}`}>
              {item.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── Debrief — Zen alternating pull quotes ───────────────────────────────────────
const Debrief = ({ learnings }: { learnings: string[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-12">
      {learnings.map((learning, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="group relative"
        >
          <GlowText className="p-8 rounded-3xl border border-foreground/5 hover:border-foreground/10 transition-all duration-700 bg-white shadow-sm dark:bg-transparent">
             <div className="flex gap-6">
               <span className="font-mono text-[11px] text-foreground/30 mt-1.5 uppercase tracking-widest font-bold">Point {String(i + 1).padStart(2, '0')}</span>
               <p className={`text-xl leading-relaxed font-medium transition-colors ${isDark ? 'text-foreground/70 group-hover:text-foreground/90' : 'text-foreground/80 group-hover:text-foreground/100'}`}>
                 {learning}
               </p>
             </div>
          </GlowText>
        </motion.div>
      ))}
    </div>
  );
};

// ── New Impact Metrics Section ──────────────────────────────────────────────
const ImpactMetrics = ({ metrics }: { metrics: Array<{ label: string; value: string; suffix?: string }> }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-foreground/[0.03] border border-foreground/[0.08] rounded-2xl p-6 text-center group hover:border-crimson/30 transition-all"
        >
          <div className="font-mono text-4xl md:text-5xl font-bold text-crimson mb-2 tabular-nums">
            {metric.value}{metric.suffix}
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/50 font-bold group-hover:text-foreground/70 transition-colors">
            {metric.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// ── Sticky TOC — left rail ───────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview',  label: 'ZEN',       num: '00' },
  { id: 'problem',   label: 'MISSION',   num: '01' },
  { id: 'system',    label: 'SCHEMA',    num: '02' },
  { id: 'impact',    label: 'IMPACT',    num: '03' },
  { id: 'evidence',  label: 'VIEW',      num: '04' },
  { id: 'timeline',  label: 'LOG',       num: '05' },
  { id: 'debrief',   label: 'WRAP',      num: '06' },
];

const SidebarTOC = ({ active }: { active: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
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
              style={{ color: isActive ? 'hsl(var(--crimson))' : (isDark ? 'hsl(var(--foreground) / 0.35)' : 'hsl(var(--foreground) / 0.5)') }}
            >
              {s.num}
            </span>
            <motion.div
              className="h-px transition-all"
              animate={{
                width: isActive ? 20 : 8,
                background: isActive ? 'hsl(var(--crimson))' : (isDark ? 'hsl(var(--foreground) / 0.12)' : 'hsl(var(--foreground) / 0.2)'),
              }}
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.15em] transition-colors font-medium"
              style={{ color: isActive ? (isDark ? 'hsl(var(--foreground) / 0.9)' : 'hsl(var(--foreground))') : (isDark ? 'hsl(var(--foreground) / 0.4)' : 'hsl(var(--foreground) / 0.6)') }}
            >
              {s.label}
            </span>
          </a>
        );
        })}
      </div>
    </aside>
  );
};

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
// ── Action Links (Zen Style) ─────────────────────────────────────────────
const ProjectActions = ({ project, hasCode, hasDoc, hasLive }: any) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-12">
      {hasCode && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="SOURCE"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-foreground/20 hover:border-foreground/40 transition-all group"
        >
          <span className="font-mono text-sm uppercase tracking-widest">View Source</span>
          <span className="text-xl group-hover:rotate-12 transition-transform">↗</span>
        </a>
      )}

      {hasDoc && (
        <a
          href={project.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="DOCS"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-foreground/20 hover:border-foreground/40 transition-all"
        >
          <span className="font-mono text-sm uppercase tracking-widest">Case Study</span>
        </a>
      )}

      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="LIVE"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background hover:bg-crimson transition-all font-medium"
        >
          See Live Demo →
        </a>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTOC, setActiveTOC] = useState('overview');
  const [previewIndex, setPreviewIndex] = useState<number>(-1);

  // Responsive card sizing — CardStack uses fixed pixel widths
  const [cardDims, setCardDims] = useState({ w: 420, h: 280 });
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
      if (vw < 480)      setCardDims({ w: Math.min(300, vw - 40), h: 200 });
      else if (vw < 768) setCardDims({ w: Math.min(360, vw - 60), h: 240 });
      else               setCardDims({ w: 420, h: 280 });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const project = PROJECT_DETAILS[slug ?? ''] ?? PROJECT_DETAILS['distributed-task-engine'];

  // Derive gallery images array once
  const galleryImages = (project.screenshots ?? []).map(
    (shot: any, idx: number) => {
      const img = isDark ? shot.image : (shot.lightImage || shot.image);
      return img || `https://picsum.photos/seed/${project.id}-${idx}/900/600`;
    }
  );
  const previewImage = previewIndex >= 0 ? galleryImages[previewIndex] : null;
  const goNext = () => setPreviewIndex(i => (i + 1) % galleryImages.length);
  const goPrev = () => setPreviewIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);

  const hasCode = !!(project.github && project.github !== '#' && project.github !== null);
  const hasDoc  = !!(project.docUrl && project.docUrl !== '#');
  const hasLive = !!(project.liveUrl);

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveTOC(e.target.id); }),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (previewIndex < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') setPreviewIndex(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewIndex, galleryImages.length]);

  return (
    <div ref={pageRef} className="min-h-screen relative" style={{ background: isDark ? '#0a0a0a' : '#f8f7f4' }}>
      {!reducedMotion && !isTouch && <MagneticCursor />}
      <Navbar />

      {/* Progress Bar (Zen) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-crimson via-purple-500 to-gold z-[200] origin-left"
        style={{ scaleX: progressScaleX }}
      />

      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ScrollImageSequence opacity={isDark ? 0.25 : 0.15} />
        <div className="absolute inset-0 opacity-30">
          {isDark ? (
             <LightRays raysColor="#4f46e5" raysSpeed={0.45} noiseAmount={0.01} />
          ) : (
             <Aurora amplitude={0.18} speed={0.35} colorStops={["#ddd6fe", "#fecdd3", "#fed7aa"]} />
          )}
        </div>
      </div>

      <div className="relative z-10 pt-28 pb-32 max-w-4xl mx-auto px-6 md:px-8">
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/projects')}
          data-cursor="BACK"
          className="flex items-center gap-2 text-sm font-mono tracking-widest text-foreground/50 hover:text-foreground mb-16 group"
        >
          ← <span className="group-hover:underline">All Projects</span>
        </motion.button>

        {/* Hero */}
        <div className="text-center mb-24">
          <div className="flex justify-center gap-4 mb-6">
            <PulseDot color={project.status === 'Production' ? 'crimson' : 'gold'} />
            <span className="font-mono text-xs tracking-[3px] text-foreground/50">{project.year} • {project.status}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-light text-7xl md:text-8xl leading-none tracking-tighter mb-8"
          >
            {project.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-foreground/70 max-w-2xl mx-auto leading-tight font-light"
          >
            {project.tagline}
          </motion.p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 text-center mb-20 text-sm">
          <div>
            <div className="text-foreground/40 text-xs tracking-widest mb-1 uppercase font-bold">Role</div>
            <div className="font-medium">{project.role}</div>
          </div>
          <div>
            <div className="text-foreground/40 text-xs tracking-widest mb-1 uppercase font-bold">Team</div>
            <div className="font-medium">{project.team}</div>
          </div>
          <div>
            <div className="text-foreground/40 text-xs tracking-widest mb-1 uppercase font-bold">Duration</div>
            <div className="font-medium">{project.duration}</div>
          </div>
        </div>

        {/* Project Actions */}
        <ProjectActions project={project} hasCode={hasCode} hasDoc={hasDoc} hasLive={hasLive} />

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-4 py-1.5 text-xs font-mono border border-foreground/10 rounded-full text-foreground/60">
              {tag}
            </span>
          ))}
        </div>

        <main className="mt-32 space-y-48">
          {/* ════════════════════════════════════════════
              00  ZEN OVERVIEW
          ════════════════════════════════════════════ */}
          <AnimatedSection id="overview" direction="up">
            <SectionLabel num="00" title="Overview" />
            <GlowText className="text-2xl leading-relaxed text-center text-foreground/80 font-light">
              {project.problem}
            </GlowText>
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              01  THE MISSION
          ════════════════════════════════════════════ */}
          <AnimatedSection id="problem" direction="left" delay={0.05}>
            <SectionLabel num="01" title="The Mission" />
            <GlowText className="text-xl md:text-2xl leading-relaxed text-center max-w-3xl mx-auto italic font-medium">
              {project.solution}
            </GlowText>
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              02  REAL-TIME ARCHITECTURE
          ════════════════════════════════════════════ */}
          <AnimatedSection id="system" direction="up" delay={0.05}>
            <SectionLabel num="02" title="Real-time Architecture" />
            <StreamingArchitecture 
              components={project.architecture.components}
              description={project.architecture.description}
            />
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              03  IMPACT
          ════════════════════════════════════════════ */}
          {project.metrics && (
            <AnimatedSection id="impact" direction="right" delay={0.05}>
              <SectionLabel num="03" title="Impact" />
              <ImpactMetrics metrics={project.metrics} />
            </AnimatedSection>
          )}

          {/* ════════════════════════════════════════════
              04  VISUAL EVIDENCE
          ════════════════════════════════════════════ */}
          <AnimatedSection id="evidence" direction="up">
            <SectionLabel num="04" title="Visual Evidence" />

            {/* Video Thumbnails */}
            {project.videoLinks?.length > 0 && (
              <BorderGlow glowColor="124 92 252" className="mb-20 rounded-[32px] overflow-hidden" borderRadius={32}>
                <div className="p-8 md:p-12">
                  <h4 className="font-mono uppercase tracking-widest text-sm mb-8 text-center text-foreground/40">Demonstrations</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.videoLinks.map((vid: any, i: number) => (
                      <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="group block">
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/10">
                          <img 
                            src={`https://picsum.photos/seed/video-${project.id}-${i}/800/450`} 
                            className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105" 
                            alt={vid.title}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                              <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-t-transparent border-b-transparent border-l-white ml-1" />
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-center font-medium group-hover:text-crimson transition-colors">{vid.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            )}

            {/* Screenshot Gallery */}
            {project.screenshots?.length > 0 && (
              <div className="flex justify-center mt-24">
                <CardStack
                  items={project.screenshots.map((shot: any, idx: number) => ({
                    id: idx,
                    title: shot.caption || `Artifact ${idx + 1}`,
                    imageSrc: (isDark ? shot.image : (shot.lightImage || shot.image)) || `https://picsum.photos/seed/${project.id}-${idx}/900/600`,
                  }))}
                  cardWidth={cardDims.w}
                  cardHeight={cardDims.h}
                  autoAdvance
                  intervalMs={4500}
                  renderCard={(item) => (
                    <div 
                      className="relative h-full w-full overflow-hidden rounded-[32px] cursor-zoom-in group shadow-2xl" 
                      onClick={() => setPreviewIndex(item.id as number)}
                    >
                      <img 
                        src={item.imageSrc} 
                        className={`w-full h-full object-cover transition-all duration-700 ${!isDark && !project.screenshots[item.id as number].lightImage ? 'invert-[0.9] hue-rotate-180 contrast-125' : 'grayscale-[0.4] group-hover:grayscale-0'}`} 
                        alt={item.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs tracking-widest">
                        {item.title}
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              05  EXECUTION LOG
          ════════════════════════════════════════════ */}
          <AnimatedSection id="timeline" direction="left" delay={0.05}>
            <SectionLabel num="05" title="Execution Log" />
            <Timeline items={project.timeline} />
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              06  RETROSPECTIVE
          ════════════════════════════════════════════ */}
          <AnimatedSection id="debrief" direction="up" delay={0.05}>
            <SectionLabel num="06" title="Retrospective" />
            <Debrief learnings={project.learnings} />
          </AnimatedSection>
        </main>

        {/* Final CTA (Zen) */}
        <div className="mt-64 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[4px] text-foreground/30 mb-8 font-bold">Colombo, Sri Lanka</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/#contact')}
            className="inline-block px-16 py-8 border border-foreground/10 hover:border-foreground/30 rounded-full text-xl font-light transition-all shadow-sm hover:shadow-md bg-white dark:bg-transparent"
          >
            Start a Conversation
          </motion.button>
        </div>
      </div>

      <Footer />

      {/* ── Image Expand Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-16"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={() => setPreviewIndex(-1)}
          >
            {/* ── Close button ─────────────────────────────── */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-white/80 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => { e.stopPropagation(); setPreviewIndex(-1); }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="font-mono text-[11px] uppercase tracking-widest">Close</span>
              <span className="font-mono text-[10px] text-white/40 ml-0.5">ESC</span>
            </motion.button>

            {/* ── Prev / Next ───────────────────────────────── */}
            {galleryImages.length > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: 0.12, duration: 0.2 }}
                className="absolute left-4 md:left-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
            )}
            {galleryImages.length > 1 && (
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: 0.12, duration: 0.2 }}
                className="absolute right-4 md:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            )}

            {/* ── Expanded image ────────────────────────────── */}
            <motion.div
              key={previewIndex}
              drag={!reducedMotion ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 150) setPreviewIndex(-1);
              }}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -12 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="relative w-full md:max-w-full h-full md:h-auto md:max-h-[84vh] rounded-none md:rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,92,252,0.25)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage!}
                alt={`Screenshot ${previewIndex + 1}`}
                className={`block w-full h-full md:max-h-[84vh] object-contain md:object-contain transition-all duration-500 ${!isDark && !project.screenshots[previewIndex].lightImage ? 'invert-[0.9] hue-rotate-180 contrast-125' : ''}`}
                draggable={false}
              />
              {/* Bottom info bar */}
              {galleryImages.length > 1 && (
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
                >
                  <span className="font-mono text-[12px] text-white/60 uppercase tracking-widest">
                    {previewIndex + 1} / {galleryImages.length}
                  </span>
                  {/* Dot strip */}
                  <div className="flex items-center gap-1.5">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setPreviewIndex(i); }}
                        style={{
                          width: i === previewIndex ? 18 : 5,
                          height: 5,
                          borderRadius: 3,
                          background: i === previewIndex ? '#7c5cfc' : 'rgba(255,255,255,0.25)',
                          transition: 'all 0.25s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;