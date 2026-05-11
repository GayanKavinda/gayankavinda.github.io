// src/features/about/components/Experience.tsx

import { motion, useMotionValue, useMotionTemplate, useSpring, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { Badge } from '@components/ui/badge';
import { useTheme } from '@app/providers/theme-provider';

// Asset imports
import yutaDark from '@assets/images/experience/yuta-dark.webp';
import yutaWhite from '@assets/images/experience/yuta-white.webp';

// ─── Data ─────────────────────────────────────────────────────────────────────

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
      'Optimised bundle size by 45% through code splitting',
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

const TOTAL_YEARS = entries.reduce((acc, e) => acc + e.durationYears, 0);
const MAX_DURATION = Math.max(...entries.map(e => e.durationYears));

// ─── Stat pill ────────────────────────────────────────────────────────────────

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-display font-semibold text-xl text-foreground leading-none">{value}</span>
    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/30">{label}</span>
  </div>
);

// ─── Arrow icon ───────────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg
    width="11" height="11" viewBox="0 0 12 12" fill="none"
    className="shrink-0 mt-[4px] text-[#7C5CFC]"
  >
    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Experience Card ──────────────────────────────────────────────────────────

const ExperienceCard = React.memo(({ entry, index }: { entry: Entry; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(entry.current || index === 0);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRect = useRef<DOMRect | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { damping: 30, stiffness: 150 };
  const rotateX = useSpring(0, springCfg);
  const rotateY = useSpring(0, springCfg);

  const spotlightBg = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, hsla(var(--primary-hsl), 0.07), transparent 40%)`;

  const updateRect = () => {
    if (cardRef.current) {
      cardRect.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRect.current) updateRect();
    const rect = cardRect.current;
    if (!rect) return;

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    const maxRot = 3;
    rotateX.set(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -maxRot);
    rotateY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * maxRot);
  };

  const pct = (entry.durationYears / MAX_DURATION) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Timeline connector dot — sits to the left, lines up with the spine */}
      <div className="absolute -left-[46px] top-7 flex flex-col items-center gap-1 hidden md:flex">
        <div
          className={`
            w-3 h-3 rounded-full border-2 transition-all duration-300
            ${entry.current
              ? 'bg-[#7C5CFC] border-[#7C5CFC] shadow-[0_0_10px_rgba(124,92,252,0.5)]'
              : 'bg-background border-white/20 group-hover:border-white/40'
            }
          `}
        />
        {index < entries.length - 1 && (
          <div className="w-px flex-1 min-h-[calc(100%+1.5rem)] bg-gradient-to-b from-white/10 to-transparent" />
        )}
      </div>

      <motion.div
        ref={cardRef}
        layout="position"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setHovered(true);
          updateRect();
        }}
        onMouseLeave={() => {
          setHovered(false);
          rotateX.set(0);
          rotateY.set(0);
          cardRect.current = null;
        }}
        animate={{
          y: hovered ? -6 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer
          border transition-[border-color,box-shadow] duration-400 glass shimmer-border elevation-card
          ${hovered
            ? 'border-black/12 dark:border-white/12 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]'
            : 'border-black/[0.07] dark:border-white/[0.06] shadow-sm dark:shadow-none'
          }
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{ background: spotlightBg, opacity: hovered ? 1 : 0 }}
        />

        {/* Cyan/Violet top-edge accent on current role */}
        {entry.current && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFC] via-[#00D4FF] to-transparent" />
        )}

        <div className="relative z-10 p-6 md:p-7">

          {/* ── Top row ── */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Year + current badge */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#00D4FF]/70">
                  {entry.year}
                </span>
                {entry.current && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#7C5CFC]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
                    Now
                  </span>
                )}
              </div>

              {/* Role */}
              <h3 className="font-jakarta font-semibold text-base md:text-[18px] text-foreground/80 dark:text-foreground tracking-tight leading-tight">
                {entry.role}
              </h3>

              {/* Company + period */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[12px] text-foreground/40 uppercase tracking-wider font-medium">
                  {entry.company}
                </span>
                <span className="text-foreground/20 text-xs">·</span>
                <span className="font-mono text-[11px] text-foreground/30">
                  {entry.period}
                </span>
              </div>
            </div>

            {/* Duration bar — always visible */}
            <div className="shrink-0 flex flex-col items-end gap-2.5 pt-0.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-foreground/40 tabular-nums">
                  {entry.durationLabel}
                </span>
                {/* Chevron icon */}
                <motion.svg
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-foreground/20"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </div>

              <div className="w-16 h-1 rounded-full bg-white/8 dark:bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </div>

          {/* ── Expandable Details ── */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? 20 : 0
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden will-change-[height,opacity]"
          >
            <div className="pt-4 border-t border-white/[0.08]">
              <ul className="space-y-3 mb-6">
                {entry.bullets.map((b, j) => (
                  <motion.li
                    key={j}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/60"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -8 }}
                    transition={{ duration: 0.3, delay: j * 0.05 }}
                  >
                    <ArrowIcon />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

// ─── Main Section ─────────────────────────────────────────────────────────────

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Scroll progress for the timeline spine
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  const spineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-[100px] md:py-[140px] overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 900px' }}
    >
      {/* Ambient glow — tighter, more intentional */}
      <div className="absolute top-1/4 left-0 w-[480px] h-[480px] bg-hsla(var(--primary-hsl), 0.04) rounded-full blur-[80px] pointer-events-none -translate-x-1/2 will-change-[filter]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-hsla(var(--secondary-hsl), 0.04) rounded-full blur-[80px] pointer-events-none translate-x-1/2 will-change-[filter]" />

      {/* Yuta Background Artwork */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[85%] pointer-events-none z-0 overflow-hidden">
        <motion.img
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isDark ? 0.55 : 0.45, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={isDark ? yutaDark : yutaWhite}
          alt="Experience Background"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-right"
          style={{ mixBlendMode: isDark ? 'screen' : 'multiply', willChange: 'opacity, transform' }}
        />
        {/* Soft fade gradients - Fading from the left so the character on the right remains visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">

        {/* ── Two-column layout: sticky left / scrolling right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 xl:gap-20 items-start">

          {/* ── LEFT: sticky header column ── */}
          <div className="lg:sticky lg:top-28 flex flex-col gap-10">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
                Professional{' '}
                <span className="font-playfair italic font-medium text-[#7C5CFC]">
                  Experience
                </span>
              </h2>
              <p className="text-sm text-foreground/40 leading-relaxed max-w-[280px]">
                Architecting scalable systems and refined sensory experiences across 10 years of engineering.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex flex-wrap gap-x-8 gap-y-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Stat value={`${TOTAL_YEARS}+`} label="Years" />
              <div className="w-px bg-white/[0.07]" />
              <Stat value={`${entries.length}`} label="Companies" />
              <div className="w-px bg-white/[0.07]" />
              <Stat value="2M+" label="Users served" />
            </motion.div>

            {/* Divider */}
            <motion.div
              className="h-px bg-gradient-to-r from-[#00D4FF]/20 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />

            {/* Mini legend */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7C5CFC] shadow-[0_0_8px_rgba(124,92,252,0.5)]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">Current role</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">Past role</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-1 rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">Tenure length</span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: scrolling card column with timeline spine ── */}
          <div className="relative md:pl-10">

            {/* Vertical spine — only visible on md+ */}
            <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-white/[0.06] hidden md:block overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-[#7C5CFC] via-[#00D4FF] to-transparent origin-top will-change-[height]"
                style={{ height: spineHeight }}
              />
            </div>

            <div className="flex flex-col gap-5">
              {entries.map((entry, i) => (
                <ExperienceCard key={entry.company} entry={entry} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;