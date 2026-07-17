//src/components/sections/About.tsx
// Changes from original:
// - Replaced "∞ Lines of Code" with "12+ Systems Architected" (senior impact metric)
// - Replaced "10+ Years" stat with cleaner layout
// - Full mobile: single-column stacked, photo first, bio below
// - Photo placeholder with corner brackets preserved
// - Typography tightened on mobile
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// Impact-driven stats
const stats = [
  { num: '10+', label: 'YEARS', sub: 'Engineering' },
  { num: '50+', label: 'PROJECTS', sub: 'Shipped' },
  { num: '12+', label: 'SYSTEMS', sub: 'Architected' },
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
            <div className="w-[280px] h-[340px] md:w-[340px] md:h-[400px] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden bg-background/50 backdrop-blur-sm shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-gold/5" />
              <span className="relative z-10 font-mono text-[14px] text-foreground/40 font-medium tracking-tight">[ Engineering Persona ]</span>
            </div>
            {/* Corner brackets */}
            {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((pos, i) => (
              <svg key={i} className={`absolute ${pos} w-6 h-6`} viewBox="0 0 24 24">
                <path d="M0 8V0h8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60" />
              </svg>
            ))}
            <div className="flex gap-5 mt-6 justify-center md:justify-start">
              {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
                <a key={s} href={`https://${s.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-foreground/50 hover:text-crimson hover:translate-y-[-1px] transition-all">{s}</a>
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