import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@shared/components/ui/badge';
import { useTheme } from '@app/providers/theme-provider';

gsap.registerPlugin(ScrollTrigger);

// ─── Data Types & Mock Data ───────────────────────────────────────────────────

type TagColor = 'crimson' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate' | 'ocean';

const getTagColor = (tag: string): TagColor => {
  const t = tag.toLowerCase();
  if (t.includes('go') || t.includes('k8s') || t.includes('aws') || t.includes('docker')) return 'ocean';
  if (t.includes('react') || t.includes('ts') || t.includes('typescript') || t.includes('graphql')) return 'indigo';
  if (t.includes('kafka') || t.includes('redis') || t.includes('node') || t.includes('express')) return 'amber';
  if (t.includes('python') || t.includes('d3') || t.includes('mongo')) return 'rose';
  return 'emerald';
};

interface Entry {
  company: string;
  role: string;
  period: string;
  year: string;
  durationYears: number;
  durationLabel: string;
  bullets: string[];
  tags: string[];
  current?: boolean;
}

const entries: Entry[] = [
  {
    company: 'TechCorp Global',
    role: 'Senior Software Engineer',
    period: '2022 — Present',
    year: '2022',
    durationYears: 3,
    durationLabel: '3 yrs',
    bullets: [
      'Led migration of monolith to microservices serving 2M+ users',
      'Designed event-driven architecture reducing latency by 40%',
      'Mentored team of 6 engineers on distributed systems patterns',
    ],
    tags: ['Go', 'Kafka', 'K8s', 'AWS'],
    current: true,
  },
  {
    company: 'DataFlow Systems',
    role: 'Software Engineer II',
    period: '2020 — 2022',
    year: '2020',
    durationYears: 2,
    durationLabel: '2 yrs',
    bullets: [
      'Built real-time data pipeline processing 500K events/sec',
      'Implemented CI/CD reducing deployment time by 60%',
      'Architected PostgreSQL sharding strategy for 10TB+ dataset',
    ],
    tags: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    company: 'WebScale Inc',
    role: 'Full Stack Developer',
    period: '2018 — 2020',
    year: '2018',
    durationYears: 2,
    durationLabel: '2 yrs',
    bullets: [
      'Developed React dashboard used by 50K+ daily active users',
      'Created GraphQL API layer consolidating 12 REST endpoints',
      'Optimized bundle size by 45% through code splitting',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
  },
  {
    company: 'StartupLab',
    role: 'Junior Developer',
    period: '2016 — 2018',
    year: '2016',
    durationYears: 2,
    durationLabel: '2 yrs',
    bullets: [
      'Shipped 3 production apps from concept to launch',
      'Introduced automated testing increasing coverage to 85%',
      'Built responsive UI components used across 4 products',
    ],
    tags: ['JavaScript', 'React', 'Express', 'MongoDB'],
  },
];

const MAX_DURATION = Math.max(...entries.map(e => e.durationYears));

// ─── Sub-Components ───────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-[3px] text-crimson">
    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Main Card Component ──────────────────────────────────────────────────────

const ExperienceCard = React.memo(({ entry, index }: { entry: Entry; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configurations for smooth movement
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Update spotlight position
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    // Calculate rotation for 3D effect (subtle)
    const rotateVal = 4; // Max rotation degrees
    rotateX.set((e.clientY - centerY) / (rect.height / 2) * -rotateVal);
    rotateY.set((e.clientX - centerX) / (rect.width / 2) * rotateVal);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const pct = (entry.durationYears / MAX_DURATION) * 100;

  return (
    <motion.div
      ref={cardRef}
      className="relative z-10 my-3 perspective-1000"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        layout
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        className={`
          relative w-full cursor-pointer overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-card/70 dark:bg-zinc-900/80 shadow-sm dark:shadow-none
          transition-all duration-500 ease-out
          ${isHovered ? 'border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-card/80 dark:bg-background/80 -translate-y-1' : 'hover:border-black/10 dark:hover:border-white/10'}
        `}
      >
        {/* Spotlight Effect Background */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
          style={{
            background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(199,55,55,0.08), transparent 40%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <div className="relative z-10 flex flex-col p-5">
          {/* ── Header (Always Visible) ────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Timeline Node */}
              <div className="hidden sm:flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${entry.current ? 'bg-crimson shadow-[0_0_8px_hsl(358_72%_46%/0.6)]' : 'bg-muted-foreground/20'} transition-colors duration-300`} />
                {index < entries.length - 1 && (
                   <div className="w-px h-8 bg-gradient-to-b from-white/10 to-transparent mt-1" />
                )}
              </div>

              <div>
                <motion.p 
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold flex items-center gap-2"
                  animate={{ color: isHovered ? 'hsl(var(--gold))' : 'hsl(var(--muted-foreground))' }}
                >
                  {entry.year}
                  {entry.current && (
                    <span className="flex items-center gap-1.5 text-crimson text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 bg-crimson rounded-full animate-pulse" />
                      Present
                    </span>
                  )}
                </motion.p>
                <h3 className="font-jakarta font-bold text-[17px] text-foreground mt-0.5 tracking-tight">
                  {entry.role}
                </h3>
              </div>
            </div>

            {/* Right Side: Company Badge */}
            <div className="text-right hidden sm:block">
               <div className="font-mono text-[11px] uppercase tracking-wider text-foreground/50">
                 {entry.company}
               </div>
            </div>
          </div>

          {/* ── Expandable Content (The "Popup" Data) ─────────────── */}
          <motion.div
            layout
            initial={false}
            animate={{ 
              height: isHovered ? 'auto' : 0, 
              opacity: isHovered ? 1 : 0,
              marginTop: isHovered ? 16 : 0 
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] pt-4 mt-2">
              
              {/* Tenure Bar & Tags */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 w-full max-w-[200px]">
                  <div className="flex-1 h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div 
                       className="h-full rounded-full bg-gradient-to-r from-crimson to-gold"
                       initial={{ width: 0 }}
                       animate={{ width: isHovered ? `${pct}%` : 0 }}
                       transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-foreground/40 whitespace-nowrap">
                    {entry.durationLabel}
                  </span>
                </div>

                <div className="flex gap-1.5 flex-wrap justify-end">
                  {entry.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="premium"
                      color={getTagColor(tag)}
                      className="text-[9px] uppercase tracking-wider px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bullets */}
              <ul className="space-y-2.5">
                {entry.bullets.map((b, j) => (
                  <motion.li 
                    key={j} 
                    className="flex items-start gap-2.5 text-[13px] text-foreground/70 leading-relaxed"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.3, delay: j * 0.05 }}
                  >
                    <ArrowIcon />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-4 sm:hidden text-left">
                 <div className="font-mono text-[11px] uppercase tracking-wider text-foreground/50">
                   {entry.company}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

// ─── Main Section Component ───────────────────────────────────────────────────

const Experience = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-[100px] md:py-[140px] overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 800px'
      }}
    >
      {/* Background Styling */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-transparent" />
      
      {/* Ambient Light Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-crimson/5 rounded-full blur-[120px] pointer-events-none will-change-transform" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none will-change-transform" />

      <div className="relative z-10 container max-w-3xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold/80 mb-4">
              <span className="text-crimson">///</span> Timeline
            </p>
            <h2 className="font-jakarta font-extrabold text-4xl md:text-5xl text-foreground tracking-tight">
              Professional{' '}
              <span className="bg-gradient-to-r from-crimson to-gold bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Timeline List */}
        <div className="relative pl-0 md:pl-6 border-l border-white/[0.05] ml-3">
          {entries.map((entry, i) => (
            <ExperienceCard key={entry.company} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;