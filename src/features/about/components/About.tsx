//src/components/sections/About.tsx
// Changes from original:
// - Replaced "∞ Lines of Code" with "12+ Systems Architected" (senior impact metric)
// - Replaced "10+ Years" stat with cleaner layout
// - Full mobile: single-column stacked, photo first, bio below
// - Photo placeholder with corner brackets preserved
// - Typography tightened on mobile
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import maskImg from '@shared/assets/images/mask.png';
import { useTheme } from '@app/providers/theme-provider';

// Impact-driven stats
const stats = [
  { num: '10+',  label: 'YEARS',    sub: 'Engineering'      },
  { num: '50+',  label: 'PROJECTS', sub: 'Shipped'          },
  { num: '12+',  label: 'SYSTEMS',  sub: 'Architected'      },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskRef    = useRef<HTMLImageElement>(null);
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // KEEP GSAP ONLY FOR CONTINUOUS PARALLAX
      gsap.to(maskRef.current!, {
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-[100px] md:py-[140px] relative overflow-hidden">
      <img
        ref={maskRef} src={maskImg} alt=""
        className="absolute left-[-80px] top-1/2 -translate-y-1/2 h-[75%] md:h-[85%] w-auto opacity-[0.06] pointer-events-none z-0"
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
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
                <a key={s} href="#" className="font-mono text-[11px] uppercase tracking-widest text-foreground/50 hover:text-crimson hover:translate-y-[-1px] transition-all">{s}</a>
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
            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold mb-4">// Technical Profile</motion.p>
            <motion.h2 variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="font-jakarta font-extrabold text-[clamp(34px,5vw,50px)] text-foreground tracking-tight leading-[1.1]">
              Engineering with <br />
              <span className="font-playfair italic font-medium text-crimson">strategic intent</span>.
            </motion.h2>

            <motion.div variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }} className="flex items-center gap-4 mt-7 origin-left">
              <div className="w-16 h-px bg-crimson" />
              <div className="w-2 h-2 rounded-full bg-gold" />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-8 space-y-5 font-sans text-[15px] md:text-[17px] leading-[1.75] text-foreground/70 max-w-[500px]">
              <p>With over a decade of production experience, I've learned that elite engineering isn't just about syntax — it's about architecting systems that scale gracefully while remaining radically simple to maintain.</p>
              <p>I specialize in distributed systems and high-throughput cloud architectures. My focus is on the pivot between complex back-end engineering and pixel-perfect sensory experiences.</p>
            </motion.div>

            {/* Stats grid */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-3 gap-3 md:gap-5 mt-10 pt-10 border-t border-black/5 dark:border-white/5">
              {stats.map(s => (
                <div key={s.label} className="group">
                  <p className="font-jakarta font-black text-[clamp(26px,4vw,38px)] text-crimson leading-none tracking-tighter group-hover:text-gold transition-colors duration-500">{s.num}</p>
                  <p className="font-mono text-[9px] md:text-[11px] text-foreground/40 uppercase tracking-widest mt-2">{s.label}</p>
                  <p className="font-sans text-[11px] md:text-[13px] text-foreground/60 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

      </div>
    </div>
    <div className="section-fade-top" />
    <div className="section-fade-bottom" />
  </section>
  );
};

export default About;

