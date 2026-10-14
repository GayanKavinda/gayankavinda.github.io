import { motion } from 'framer-motion';
import { Award, GraduationCap, Sparkles } from 'lucide-react';
import { useTheme } from '@app/providers/theme-provider';

// ─── Data ─────────────────────────────────────────────────────────────────────

const degree = {
  institution: 'University of Colombo',
  title: 'Bachelor of Science in Computer Science',
  period: '2018 — 2022',
  status: 'Graduated',
  description:
    'Focused on distributed systems, algorithms, and software engineering principles. Completed with First Class Honours.',
  highlights: ["Dean's List 2020, 2021", 'Thesis on Distributed Consensus'],
  earlier: {
    title: 'Advanced Diploma in Software Engineering',
    institution: 'Institute of Software',
    period: '2016 — 2018',
  },
};

const HIGHLIGHT_ICONS = [Award, Sparkles];

// Quiet stars drifting in the card — echo of the Hero night sky
const STARS = [
  { x: '12%', y: '18%', size: 2, delay: 0, duration: 6 },
  { x: '86%', y: '26%', size: 1.5, delay: 1.4, duration: 7.5 },
  { x: '72%', y: '12%', size: 2.5, delay: 2.6, duration: 5.5 },
  { x: '24%', y: '78%', size: 1.5, delay: 0.9, duration: 6.8 },
];

// ─── Main Section ─────────────────────────────────────────────────────────────

const Education = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="education"
      className="relative py-14 md:py-24 overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 560px' }}
    >
      {/* First light — slow breathing warmth, mirroring the Hero's lantern glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(255,178,102,0.10) 0%, rgba(124,92,252,0.05) 45%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(184,120,60,0.10) 0%, rgba(184,120,60,0.03) 45%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">

        {/* ── Centered header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center md:mb-14"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Academic{' '}
            <span className="font-playfair italic font-medium text-[#d60d86]">
              Foundation
            </span>
          </h2>
          <p className="mx-auto max-w-[420px] text-sm text-foreground/40 leading-relaxed">
            Where the journey began — the academic roots that shaped how I build systems today.
          </p>
        </motion.div>

        {/* ── Degree card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-10 md:p-16"
        >
          {/* Horizon wash at the base of the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
            style={{
              background: isDark
                ? 'linear-gradient(to top, rgba(255,178,102,0.05), transparent)'
                : 'linear-gradient(to top, rgba(184,120,60,0.06), transparent)',
            }}
          />

          {/* Quiet stars (dark only) */}
          {isDark &&
            STARS.map((star, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="pointer-events-none absolute rounded-full bg-white"
                style={{ left: star.x, top: star.y, width: star.size, height: star.size }}
                animate={{ opacity: [0.12, 0.5, 0.12] }}
                transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon with breathing halo */}
            <div className="relative mb-7">
              <motion.div
                aria-hidden
                className="absolute -inset-3.5 rounded-full blur-md"
                style={{
                  background: isDark
                    ? 'radial-gradient(circle, rgba(255,190,110,0.22), transparent 70%)'
                    : 'radial-gradient(circle, rgba(184,120,60,0.16), transparent 70%)',
                }}
                animate={{ opacity: [0.45, 1, 0.45], scale: [0.94, 1.07, 0.94] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-background/60 dark:bg-white/[0.03]">
                <GraduationCap strokeWidth={1.5} className="h-5 w-5 text-foreground/70" />
              </div>
            </div>

            {/* Institution */}
            <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#B8783C] dark:text-[#F5B86B]/80">
              {degree.institution}
            </span>

            {/* Degree title */}
            <h3 className="font-jakarta font-semibold text-xl md:text-[26px] text-foreground tracking-tight leading-[1.25] max-w-[400px]">
              {degree.title}
            </h3>

            {/* Hairline divider with a single diamond */}
            <div className="my-6 flex w-full max-w-[240px] items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-black/[0.12] dark:to-white/[0.12]" />
              <span className="text-[8px] text-[#d60d86]">◆</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-black/[0.12] dark:to-white/[0.12]" />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] text-foreground/45">
              <span>{degree.period}</span>
              <span className="text-foreground/20">·</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600/80 dark:text-emerald-400/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {degree.status}
              </span>
            </div>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-[46ch] text-sm leading-[1.9] text-foreground/55">
              {degree.description}
            </p>

            {/* Highlights */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {degree.highlights.map((highlight, i) => {
                const Icon = HIGHLIGHT_ICONS[i] ?? Award;
                return (
                  <motion.span
                    key={highlight}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.1 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/50"
                  >
                    <Icon strokeWidth={1.5} className="h-3 w-3 text-foreground/40" />
                    {highlight}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Earlier credential — quiet footnote ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-center font-mono text-[11px] text-foreground/35"
        >
          Earlier — {degree.earlier.title} · {degree.earlier.institution} ·{' '}
          {degree.earlier.period}
        </motion.p>
      </div>
    </section>
  );
};

export default Education;
