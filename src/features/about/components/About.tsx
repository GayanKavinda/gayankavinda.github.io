//src/components/sections/About.tsx
// Changes from previous version:
// - Removed the "status: available" line and all terminal/HUD framing
// - Photo block redesigned as an editorial plate: sharp corners, single gold
//   hairline accent, museum-placard caption bar below (name / role / mark)
// - Socials are now understated text links with an animated underline reveal,
//   set beneath the plate, not boxed or iconed, quieter and more senior
// - Dark mode nebula glow and top/bottom section fades kept as-is
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// Impact-driven stats
const stats = [
  { num: '10+', label: 'YEARS', sub: 'Engineering' },
  { num: '50+', label: 'PROJECTS', sub: 'Shipped' },
  { num: '12+', label: 'SYSTEMS', sub: 'Architected' },
];

// Social links, plain text, underline reveal on hover
const socials = [
  { name: 'GitHub', href: 'https://github.com' },
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'Twitter', href: 'https://twitter.com' },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-[100px] md:py-[140px] relative overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
    >
      {/* Dark mode magenta nebula glow */}
      {isDark && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236, 72, 153, 0.18), transparent 70%)',
          }}
        />
      )}

      {/* Top fade, blends Hero bottom into About */}
      <div
        className="absolute inset-x-0 top-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />

      {/* Bottom fade, blends About bottom into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-[1] max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Editorial photo plate */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-fit mx-auto md:mx-0"
          >
            <div className="relative flex">
              {/* Single gold hairline accent, offset behind the frame */}
              <div className="absolute -left-4 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent hidden md:block" />

              <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[400px] bg-background/50 dark:bg-white/[0.015] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.04] to-gold/[0.04]" />
                {/* Fine grain texture for depth */}
                <div
                  className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  }}
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <span className="font-mono text-[13px] text-foreground/35 dark:text-white/25 font-medium tracking-tight">
                    [ Engineering Persona ]
                  </span>
                </div>
              </div>
            </div>

            {/* Placard caption, name / role / index mark */}
            <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-black/[0.08] dark:border-white/[0.1] w-[280px] md:w-[320px]">
              <div>
                <p className="font-jakarta font-semibold text-sm text-foreground tracking-tight">Gara Yaka</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 dark:text-white/35 mt-0.5">
                  Software Engineer
                </p>
              </div>
              <span className="font-mono text-[10px] text-foreground/25 dark:text-white/20">01</span>
            </div>

            {/* Socials, quiet underline-reveal text links */}
            <div className="flex gap-6 mt-5">
              {socials.map(({ name, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative font-mono text-[11px] uppercase tracking-widest text-foreground/45 dark:text-white/40 hover:text-crimson transition-colors duration-300"
                >
                  {name}
                  <span className="absolute left-0 -bottom-1 h-px w-0 bg-crimson transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Bio with staggered Framer Motion items */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.1 }
              }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mb-8">
              <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
                About the{' '}
                <span className="font-playfair italic font-medium text-[#7C5CFC]">
                  Engineer
                </span>
              </h2>
              <p className="text-sm text-foreground/50 dark:text-foreground/60 leading-relaxed max-w-[280px]">
                Architecting scalable systems and refined sensory experiences across 10 years of engineering.
              </p>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 }}} className="mb-6">
              <h3 className="font-jakarta font-medium text-lg text-500 text-foreground/80 mb-3">
                Professional Impact
              </h3>
              <ul className="space-y-3 text-sm text-foreground/60 dark:text-foreground/50">
                <li>Designed a multi‑region, event‑driven platform handling {'>'}2M RPS with {'<'}50 ms p99 latency.</li>
                <li>Introduced observability‑first practices (OpenTelemetry, SLO‑based alerting) reducing MTTR by 40%.</li>
                <li>Led migration from monolith to Kubernetes‑microservices, reducing deploy‑time from hours to {'<'}15 min.</li>
                <li>Authored internal library for distributed tracing adopted by 8+ teams.</li>
              </ul>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mb-4">
              <div className="flex flex-wrap gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-jakarta font-bold text-2xl text-foreground">{stat.num}</span>
                      <span className="font-mono text-xs text-foreground/50 uppercase tracking-wider">{stat.label}</span>
                      <span className="font-mono text-xs text-foreground/40">{stat.sub}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;