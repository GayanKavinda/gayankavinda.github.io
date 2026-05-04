// src/pages/ProjectDetail.tsx
// Practical technical case study — not a blog, not a card stack
// Muted color scheme with bento grid layout for professional presentation

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import bgDark from '@assets/images/project_details/maki-dark2.jpeg';
import bgWhite from '@assets/images/project_details/maki-white.jpeg';
import { PROJECT_DETAILS } from '@constants/projectDetails';

// ── Character reveal ─────────────────────────────────────────────────────────
const SplitChars = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: delay + i * 0.025, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </span>
);

const ScrambleText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split('').map((_, index) => {
          if(index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="font-mono">{displayText}</span>;
};

// ── Sticky sidebar TOC ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'problem',   label: 'Problem'   },
  { id: 'system',    label: 'System'    },
  { id: 'timeline',  label: 'Timeline'  },
  { id: 'debrief',   label: 'Debrief'   },
];

const SidebarTOC = ({ active }: { active: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <aside className="hidden xl:flex flex-col sticky top-32 w-[140px] shrink-0 self-start pt-4 border-l border-foreground/5 pl-6">
      <div className="absolute left-0 top-4 bottom-0 w-px bg-foreground/5" />
      <p
        className="font-mono text-[9px] uppercase tracking-[0.25em] mb-6 flex items-center gap-2"
        style={{ color: isDark ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--foreground) / 0.55)' }}
      >
        <span className="w-1 h-1 rounded-full bg-foreground/20" />
        PRJ_INDEX
      </p>
      <div className="flex flex-col gap-4">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{ textDecoration: 'none' }}
              className="relative flex items-center group py-0.5"
            >
              {/* Active indicator track */}
              {isActive && (
                <motion.div
                  layoutId="active-toc-line"
                  className="absolute -left-[25px] w-[3px] h-full bg-foreground/80"
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2"
                style={{ 
                  color: isActive ? 'hsl(var(--foreground))' : isDark ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--foreground) / 0.5)',
                  fontWeight: isActive ? 700 : 400
                }}
              >
                <span className="opacity-30">//</span>
                {s.label}
              </span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};

// ── System architecture map (bento grid layout) ───────────────────────────────
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

  return (
    <div className="relative">
      <div className="absolute -left-10 top-0 bottom-0 w-px bg-foreground/[0.03] hidden md:block" />
      
      <p
        className="text-[14px] leading-relaxed mb-10 font-medium"
        style={{ color: isDark ? 'hsl(var(--foreground) / 0.45)' : 'hsl(var(--foreground) / 0.85)', maxWidth: 620 }}
      >
        {description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-px bg-foreground/[0.05] border border-foreground/[0.05] rounded-xl overflow-hidden">
        {components.map((comp, idx) => {
          const isActive = active === idx;
          
          return (
            <motion.div
              key={idx}
              onHoverStart={() => setActive(idx)}
              onHoverEnd={() => setActive(null)}
              className="relative p-6 bg-background group cursor-crosshair transition-colors duration-300"
              style={{
                backgroundColor: isActive ? 'hsl(var(--foreground) / 0.015)' : 'hsl(var(--background))'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <span className={`font-mono text-[8px] ${isDark ? 'text-foreground/20' : 'text-foreground/55'}`}>UNIT_ID: {String(idx + 1).padStart(2, '0')}</span>
                    <p
                      className="font-mono text-[11px] font-black tracking-tight uppercase"
                      style={{
                        color: isActive ? 'hsl(var(--foreground))' : isDark ? 'hsl(var(--foreground) / 0.6)' : 'hsl(var(--foreground) / 0.9)',
                        transition: 'color 0.18s ease',
                      }}
                    >
                      {comp.name}
                    </p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/10 group-hover:bg-slate-400 transition-colors" />
                </div>
                
                <p
                  className="text-[12px] leading-[1.6] font-medium"
                  style={{ color: 'hsl(var(--foreground) / 0.35)' }}
                >
                  {comp.role}
                </p>
              </div>

              {/* HUD Corner Accents */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-foreground/10 group-hover:border-foreground/30 transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-foreground/10 group-hover:border-foreground/30 transition-colors" />
              
              {/* Focus Bar */}
              {isActive && (
                <motion.div
                  layoutId="system-focus-bar"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-slate-500"
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTOC, setActiveTOC] = useState('overview');

  const project = PROJECT_DETAILS[slug ?? ''] ?? PROJECT_DETAILS['distributed-task-engine'];

  const hasCode    = !!(project.github && project.github !== '#' && project.github !== null);
  const hasDoc     = !!(project.docUrl && project.docUrl !== '#');
  const hasDiagram = !!(project.diagramUrl && project.diagramUrl !== '#');

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // Scroll-spy for TOC
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveTOC(e.target.id); }),
      { rootMargin: '-25% 0px -65% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen relative"
      style={{ background: 'hsl(var(--background))' }}
    >
      <Navbar />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[200] origin-left"
        style={{
          height: 2,
          scaleX: scrollYProgress,
          background: 'linear-gradient(to right, hsl(var(--slate)), hsl(var(--stone)))',
        }}
      />

      {/* Cinematic Parallax Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: bgY }} 
          className="absolute inset-x-0 -top-[10%] -bottom-[10%] w-full h-[120%]"
        >
          <img
            src={isDark ? bgDark : bgWhite}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              opacity: isDark ? 0.35 : 0.45,
              mixBlendMode: isDark ? 'overlay' : 'normal',
              filter: isDark ? 'none' : 'contrast(1.1) brightness(1.05)',
            }}
          />
        </motion.div>
        
        {/* Mesh Gradient Polish - Softened */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 80% 20%, hsla(var(--slate-hsl), 0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, hsla(var(--stone-hsl), 0.1) 0%, transparent 60%)'
              : 'radial-gradient(circle at 80% 20%, hsla(var(--slate-hsl), 0.05) 0%, transparent 60%), radial-gradient(circle at 20% 80%, hsla(var(--stone-hsl), 0.04) 0%, transparent 60%)',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 50% 50%, transparent 20%, hsl(var(--background)) 90%)'
              : 'radial-gradient(ellipse at 50% 50%, transparent 30%, hsl(var(--background)) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 pt-20 md:pt-28">

        {/* ─── Layout shell ─────────────────────────────────────────────── */}
        <div className="flex gap-12 px-5 md:px-10 max-w-[1280px] mx-auto">
          <SidebarTOC active={activeTOC} />

          <main className="flex-1 min-w-0">

            {/* ══════════════════════════════════════════════════════════
                01  OVERVIEW
            ══════════════════════════════════════════════════════════ */}
            <section id="overview" className="mb-20">

              {/* Back */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-1.5 mb-10 group"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg
                  width="10" height="10" viewBox="0 0 14 14" fill="none"
                  className="group-hover:-translate-x-0.5 transition-transform"
                >
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="hsl(var(--foreground) / 0.28)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.16em]"
                  style={{ color: 'hsl(var(--foreground) / 0.28)' }}
                >
                  Projects
                </span>
              </motion.button>

              {/* Status pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-wrap items-center gap-3 mb-5"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="block w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        project.status === 'Production'
                          ? 'hsl(210 40% 35%)'
                          : 'hsl(30 30% 50%)',
                      boxShadow:
                        project.status === 'Production'
                          ? '0 0 0 3px hsl(210 40% 35% / 0.1)'
                          : '0 0 0 3px hsl(30 30% 50% / 0.1)',
                    }}
                  />
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: 'hsl(var(--foreground) / 0.3)' }}
                  >
                    {project.status}
                  </span>
                </span>

                <span className="font-mono text-[9px]" style={{ color: 'hsl(var(--foreground) / 0.1)' }}>
                  ·
                </span>
                <span
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: 'hsl(var(--foreground) / 0.2)' }}
                >
                  {project.year}
                </span>

                {!hasCode && (
                  <>
                    <span
                      className="font-mono text-[9px]"
                      style={{ color: 'hsl(var(--foreground) / 0.1)' }}
                    >
                      ·
                    </span>
                    <span
                      className="font-mono text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest"
                      style={{
                        border: '1px solid hsl(var(--foreground) / 0.06)',
                        color: 'hsl(var(--foreground) / 0.25)',
                      }}
                    >
                      Enterprise · Private
                    </span>
                  </>
                )}
              </motion.div>

               {/* Title */}
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.01, delay: 0.18 }}
                 className="mb-5"
               >
                  <h1
                    className="font-winner font-black tracking-tighter leading-[0.88] mb-2 uppercase"
                    style={{
                      fontSize: 'clamp(48px, 8.5vw, 92px)',
                      color: 'hsl(var(--foreground))',
                      letterSpacing: '-0.06em'
                    }}
                  >
                    <ScrambleText text={project.title} />
                  </h1>
               </motion.div>

               {/* Tagline */}
               <motion.p
                 initial={{ opacity: 0, y: 8 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.45, delay: 0.9 }}
                 className="text-[15px] leading-relaxed mb-10"
                                   style={{ color: isDark ? 'hsl(var(--foreground) / 0.42)' : 'hsl(var(--foreground) / 0.85)', maxWidth: 600 }}
               >
                 {project.tagline}
               </motion.p>

               {/* Technical Manifest Card */}
               <motion.div
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.8 }}
                 className="p-6 md:p-8 rounded-xl mb-12 border border-foreground/5 relative overflow-hidden bg-foreground/[0.02]"
               >
                 {/* HUD Brackets */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-foreground/20" />
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-foreground/20" />
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-foreground/20" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-foreground/20" />

                 <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-foreground/10 uppercase tracking-widest select-none flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full bg-slate-500 animate-pulse" />
                   REVISION_{project.year}.04
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                   {[
                     { label: 'System Role', val: project.role, id: 'SR-01' },
                     { label: 'Lead Unit', val: project.team, id: 'LU-04' },
                     { label: 'Deployment', val: project.duration, id: 'DP-99' },
                   ].map((m) => (
                     <div key={m.label} className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <span className={`font-mono text-[8px] ${isDark ? 'text-foreground/20' : 'text-foreground/50'}`}>[{m.id}]</span>
                          <p className={`font-mono text-[9px] uppercase tracking-[0.25em] ${isDark ? 'text-foreground/40' : 'text-foreground/75'}`}>
                            {m.label}
                          </p>
                       </div>
                       <p className="font-mono text-[14px] font-bold text-foreground tracking-tight">
                         {m.val}
                       </p>
                     </div>
                   ))}
                 </div>

                 <div className="mt-8 pt-8 border-t border-foreground/5 flex flex-wrap gap-2 items-center">
                   <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/30 mr-2">
                     Stack_Trace
                   </p>
                   {project.tags.map((tag) => (
                     <span
                       key={tag}
                       className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${isDark ? 'border-foreground/10 bg-foreground/[0.03] text-foreground/60' : 'border-foreground/20 bg-foreground/[0.05] text-foreground/80'}`}
                     >
                       {tag}
                     </span>
                   ))}
                 </div>
               </motion.div>

               {/* Action links */}
               <motion.div
                 initial={{ opacity: 0, y: 8 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.4, delay: 1.08 }}
                 className="flex flex-wrap gap-2.5 mb-14"
               >
                 {hasCode && (
                   <a
                     href={project.github!}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] px-5 py-2.5 rounded-lg transition-all hover:brightness-110"
                     style={{ background: 'hsl(var(--slate))', color: '#fff' }}
                   >
                     <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
                     className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] px-5 py-2.5 rounded-lg transition-all"
                     style={{
                       border: '1px solid hsl(var(--foreground) / 0.08)',
                       color: 'hsl(var(--foreground) / 0.45)',
                     }}
                   >
                     Documentation →
                   </a>
                 )}
                 {hasDiagram && (
                   <a
                     href={project.diagramUrl!}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] px-5 py-2.5 rounded-lg transition-all"
                     style={{
                       border: '1px solid hsl(var(--foreground) / 0.08)',
                       color: 'hsl(var(--foreground) / 0.45)',
                     }}
                   >
                     Architecture Diagrams →
                   </a>
                 )}
                 {!hasCode && !hasDoc && !hasDiagram && (
                   <span
                     className="font-mono text-[10px] italic"
                     style={{ color: 'hsl(var(--foreground) / 0.18)' }}
                   >
                     Source restricted — artifacts available on request
                   </span>
                 )}
               </motion.div>

               {/* Resource pills — lean, not a 3-col section */}
               {([...project.videoLinks, ...project.extraLinks]).length > 0 && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.4 }}
                   className="flex flex-wrap items-center gap-2 pb-14"
                   style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.03)' }}
                 >
                   <span
                     className="font-mono text-[8px] uppercase tracking-widest mr-1"
                     style={{ color: 'hsl(var(--foreground) / 0.16)', lineHeight: '26px' }}
                   >
                     Resources
                   </span>
                   {[...project.videoLinks, ...project.extraLinks].map((link, i) => (
                     <a
                       key={i}
                       href={link.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-1.5 font-mono text-[10px] px-3 py-1 rounded-full transition-colors"
                       style={{
                         border: '1px solid hsl(var(--foreground) / 0.05)',
                         color: 'hsl(var(--foreground) / 0.35)',
                       }}
                     >
                       {link.title}
                       <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                         <path
                           d="M2 10L10 2M10 2H5M10 2v5"
                           stroke="currentColor"
                           strokeWidth="1.4"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         />
                       </svg>
                     </a>
                   ))}
                 </motion.div>
               )}
            </section>

            {/* ══════════════════════════════════════════════════════════
                02  PROBLEM & FIX
            ══════════════════════════════════════════════════════════ */}
            <section id="problem" className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.22em]"
                    style={{ color: isDark ? 'hsl(var(--foreground) / 0.18)' : 'hsl(var(--foreground) / 0.4)' }}
                  >
                    // 01 — Mission Parameters
                  </p>
                  <div className="flex-1 h-px bg-foreground/[0.03]" />
                </div>

                <div
                  className="grid grid-cols-1 lg:grid-cols-2 bg-foreground/[0.01] border border-foreground/[0.08] rounded-xl overflow-hidden relative"
                >
                  {/* Problem */}
                  <div className="p-8 lg:p-12 lg:border-r border-foreground/[0.08] relative group">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground/20 group-hover:border-slate-500 transition-colors" />
                    <h4 className={`font-mono text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-foreground/30' : 'text-foreground/55'} mb-8 flex items-center gap-2`}>
                      <span className="w-1 h-1 bg-slate-500" />
                      CRITICAL_FRICTION
                    </h4>
                    <p
                      className="text-[15px] leading-[1.8] font-medium"
                      style={{ color: isDark ? 'hsl(var(--foreground) / 0.7)' : 'hsl(var(--foreground) / 0.88)' }}
                    >
                      {project.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="p-8 lg:p-12 relative group">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/20 group-hover:border-stone-500 transition-colors" />
                    <h4 className={`font-mono text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-foreground/30' : 'text-foreground/55'} mb-8 flex items-center gap-2`}>
                      <span className="w-1 h-1 bg-stone-500" />
                      ENGINEERING_FIX
                    </h4>
                    <p
                      className="text-[15px] leading-[1.8] font-medium"
                      style={{ color: isDark ? 'hsl(var(--foreground) / 0.7)' : 'hsl(var(--foreground) / 0.88)' }}
                    >
                      {project.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                03  SYSTEM MAP
            ══════════════════════════════════════════════════════════ */}
            <section id="system" className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.25em] flex items-center gap-2"
                    style={{ color: isDark ? 'hsl(var(--foreground) / 0.18)' : 'hsl(var(--foreground) / 0.4)' }}
                  >
                    <span className="w-1.5 h-1.5 border border-foreground/30" />
                    SYSTEM_ARCHITECTURE // TOPOLOGY
                  </p>
                  <div className="flex-1 h-px bg-foreground/[0.03]" />
                </div>

                <SystemMap
                  components={project.architecture.components}
                  description={project.architecture.description}
                />
              </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                04  TIMELINE
            ══════════════════════════════════════════════════════════ */}
            <section id="timeline" className="mb-20 relative">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.25em] flex items-center gap-2"
                    style={{ color: 'hsl(var(--foreground) / 0.18)' }}
                  >
                    <span className="w-1.5 h-1.5 border border-foreground/30 rotate-45" />
                    EXECUTION_LOG // AUDIT_STAMP
                  </p>
                  <div className="flex-1 h-px bg-foreground/[0.03]" />
                </div>

                <div className="space-y-0 relative">
                  {/* Vertical line for the log */}
                  <div className="absolute left-[3px] top-2 bottom-2 w-px bg-foreground/[0.08]" />

                  {project.timeline.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="relative pl-8 pb-10 last:pb-0 group"
                    >
                      {/* Log node */}
                      <div 
                        className="absolute left-0 top-[6px] w-[7px] h-[7px] bg-background border border-foreground/30 group-hover:border-slate-500 transition-colors z-10" 
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                        <span className={`font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-foreground/20' : 'text-foreground/65'} shrink-0 w-28 flex items-center gap-2`}>
                           <span className="opacity-50">#</span>{item.duration}
                        </span>
                        <div className="flex-1">
                          <h4 className={`font-mono text-[12px] font-black uppercase tracking-tight ${isDark ? 'text-foreground/70' : 'text-foreground/90'} mb-2 flex items-center gap-3`}>
                            {item.phase}
                            <span className="h-px flex-1 bg-foreground/[0.03] group-hover:bg-foreground/[0.08] transition-colors" />
                          </h4>
                          <p className={`text-[13px] leading-[1.6] ${isDark ? 'text-foreground/40' : 'text-foreground/85'} max-w-[540px] font-medium`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Terminal Marker */}
                  <div className="relative pl-8 mt-4">
                     <div className="absolute left-0 top-[6px] w-[7px] h-px bg-foreground/40" />
                     <p className={`font-mono text-[9px] uppercase tracking-widest ${isDark ? 'text-foreground/20' : 'text-foreground/45'}`}>
                       // EOF_EXECUTION
                     </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                05  DEBRIEF
            ══════════════════════════════════════════════════════════ */}
            <section id="debrief" className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.25em]"
                    style={{ color: isDark ? 'hsl(var(--foreground) / 0.18)' : 'hsl(var(--foreground) / 0.45)' }}
                  >
                    // 04 — RETROSPECTIVE // POST_MORTEM
                  </p>
                  <div className="flex-1 h-px bg-foreground/[0.03]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/[0.05] border border-foreground/[0.05] rounded-xl overflow-hidden">
                  {project.learnings.map((learning, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="relative p-8 bg-background group"
                    >
                      {/* Watermark ID */}
                      <span
                        className="absolute right-4 top-4 font-mono text-[10px] font-bold select-none pointer-events-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
                      >
                        LOG_ENTRY_0{i + 1}
                      </span>

                      <div className="relative">
                        <div
                          className="w-4 h-px mb-6 bg-foreground/20 group-hover:w-8 transition-all duration-300"
                        />
                        <p
                          className="text-[14px] leading-[1.75] font-medium"
                          style={{ color: 'hsl(var(--foreground) / 0.4)' }}
                        >
                          {learning}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                CTA + MORE PROJECTS
            ══════════════════════════════════════════════════════════ */}
            <section className="mb-0">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-2 relative p-6 rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid hsl(var(--slate) / 0.1)',
                    background: 'hsl(var(--slate) / 0.02)',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 pointer-events-none"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'hsl(var(--slate) / 0.05)',
                      filter: 'blur(30px)',
                      transform: 'translate(35%, -35%)',
                    }}
                  />
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.18em] mb-3"
                    style={{ color: isDark ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--foreground) / 0.45)' }}
                  >
                    // Colombo, LK
                  </p>
                  <h3
                    className="font-winner font-black leading-tight mb-3"
                    style={{
                      fontSize: 'clamp(18px, 2.2vw, 23px)',
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    Open to the right opportunity.
                  </h3>
                  <p
                    className="text-[12px] leading-relaxed mb-5"
                    style={{ color: isDark ? 'hsl(var(--foreground) / 0.36)' : 'hsl(var(--foreground) / 0.72)' }}
                  >
                    Full-time, contract, or consulting — distributed systems, frontend architecture, and AI-integrated products.
                  </p>
                  <button
                    onClick={() => navigate('/#contact')}
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] px-5 py-2.5 rounded-lg w-full justify-center transition-all hover:brightness-110"
                    style={{ background: 'hsl(var(--slate))', color: '#fff' }}
                  >
                    Get in touch
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 7H13M13 7L8 2M13 7L8 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </motion.div>

                {/* More projects scroll */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="lg:col-span-3 rounded-2xl overflow-hidden"
                  style={{ border: '1px solid hsl(var(--foreground) / 0.04)' }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid hsl(var(--foreground) / 0.03)' }}
                  >
                    <p
                      className="font-mono text-[9px] uppercase tracking-[0.2em]"
                      style={{ color: isDark ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--foreground) / 0.5)' }}
                    >
                      // More Projects
                    </p>
                  </div>
                  <div className="relative overflow-hidden py-3" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                    <style dangerouslySetInnerHTML={{ __html: `
                      @keyframes moreScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                      .more-scroll-inner { animation: moreScroll 22s linear infinite; }
                      .more-scroll-inner:hover { animation-play-state: paused; }
                    ` }} />
                    <div
                      className="flex more-scroll-inner gap-3 cursor-pointer"
                      onClick={() => navigate('/projects')}
                      style={{ width: 'fit-content', minWidth: '100%' }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-44 p-3 rounded-xl transition-all"
                          style={{
                            border: '1px solid hsl(var(--foreground) / 0.03)',
                            background: 'hsl(var(--card) / 0.15)',
                          }}
                        >
                          <div
                            className="aspect-video rounded-lg mb-2 flex items-center justify-center"
                            style={{ background: 'hsl(var(--foreground) / 0.02)' }}
                          >
                            <span
                              className="font-mono text-[8px]"
                              style={{ color: 'hsl(var(--foreground) / 0.08)' }}
                            >
                              {String((i % 4) + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p
                            className="font-jakarta font-semibold text-[11px] mb-0.5"
                            style={{ color: isDark ? 'hsl(var(--foreground) / 0.4)' : 'hsl(var(--foreground) / 0.8)' }}
                          >
                            View all →
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: isDark ? 'hsl(var(--foreground) / 0.16)' : 'hsl(var(--foreground) / 0.5)' }}
                          >
                            Explore full portfolio
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

              </div>
            </section>

          </main>
        </div>

        {/* Tactical Fade into Footer */}
        <div
          className="h-64 relative z-10 -mt-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, hsl(var(--background)) 50%, hsl(var(--background)))',
          }}
        />

        <Footer />
      </div>
    </div>
  );
};

export default ProjectDetail;