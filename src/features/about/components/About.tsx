//src/components/sections/About.tsx
// Fixed: removed duplicated/broken social icon block that caused a JSX syntax error
// (a stray <circle> was used outside an <svg>, and closing tags no longer matched up).
// New social icon design: glass circular buttons with a gradient ring that fades in on hover.
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useTheme } from '@app/providers/theme-provider';

// Impact-driven stats
const stats = [
  { num: '10+', label: 'YEARS', sub: 'Engineering' },
  { num: '50+', label: 'PROJECTS', sub: 'Shipped' },
  { num: '12+', label: 'SYSTEMS', sub: 'Architected' },
];

// Social links with dual light/dark mode color profiles
const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    Icon: Github,
    lightRing: 'from-slate-500 to-slate-700',
    darkRing: 'dark:from-purple-400 dark:to-indigo-500',
    lightIcon: 'text-slate-600',
    darkIcon: 'dark:text-purple-300',
    glow: 'rgba(167, 139, 250, 0.45)',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    Icon: Linkedin,
    lightRing: 'from-blue-500 to-blue-700',
    darkRing: 'dark:from-cyan-400 dark:to-blue-500',
    lightIcon: 'text-blue-600',
    darkIcon: 'dark:text-cyan-300',
    glow: 'rgba(34, 211, 238, 0.45)',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    Icon: Twitter,
    lightRing: 'from-sky-400 to-sky-600',
    darkRing: 'dark:from-sky-300 dark:to-pink-400',
    lightIcon: 'text-sky-500',
    darkIcon: 'dark:text-sky-200',
    glow: 'rgba(125, 211, 252, 0.45)',
  },
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

          {/* Photo with Framer Motion entry */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-fit mx-auto md:mx-0"
          >
            <div className="w-[280px] h-[340px] md:w-[340px] md:h-[400px] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden bg-background/50 dark:bg-white/[0.02] backdrop-blur-sm shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-gold/5" />
              <span className="relative z-10 font-mono text-[14px] text-foreground/40 dark:text-white/30 font-medium tracking-tight">[ Engineering Persona ]</span>
            </div>

            {/* Social row, glass ring icon buttons */}
            <div className="flex gap-6 mt-8 justify-center">
              {socials.map(({ name, href, Icon, lightRing, darkRing, lightIcon, darkIcon, glow }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  {/* Gradient ring, only appears on hover */}
                  <div
                    className={`absolute -inset-[1.5px] rounded-full bg-gradient-to-br ${lightRing} ${darkRing} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[1px]`}
                  />

                  {/* Glass circle body */}
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center bg-background/70 dark:bg-white/[0.04] border border-black/5 dark:border-white/10 backdrop-blur-md transition-shadow duration-300"
                    style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 22px ${glow}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 rgba(0,0,0,0)`;
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className={`transition-colors duration-300 ${lightIcon} ${darkIcon} group-hover:text-foreground`}
                    />
                  </div>

                  {/* Tooltip label */}
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50 dark:text-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {name}
                  </span>
                </motion.a>
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
                <span className="font-playfair italic font-medium text-[#d60d86]">
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