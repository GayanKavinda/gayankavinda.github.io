import { useEffect, useRef } from 'react';
import { motion, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
import { SkillMarquee } from './SkillMarquee';
import { SKILLS } from './constants';
import { useTheme } from '@app/providers/theme-provider';
import bgDark from '@assets/images/skills/sakuna-dark.webp';
import bgWhite from '@assets/images/skills/sakuna-white.webp';

// ── Animated count-up ────────────────────────────────────────────────────────
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, target, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const TechStack = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-[80px] md:py-[100px] relative overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
    >
      {/* Background Image - Sakuna */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.img
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: isDark ? 0.35 : 0.3, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          src={isDark ? bgDark : bgWhite}
          alt=""
          className="h-full w-full object-cover object-center transition-opacity duration-700"
        />
        {/* Stronger mobile fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 md:from-background/60 via-background/10 to-background/80 md:to-background/60" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

        {/* ── Header ────────────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 text-center mb-14 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Technical{' '}
            <span className="font-playfair italic font-medium text-[#7C5CFC]">
              Stack
            </span>
          </h2>
          <p className="text-sm text-foreground/50 dark:text-foreground/60 leading-relaxed max-w-[280px]">
            Architecting scalable systems and refined sensory experiences across 10 years of engineering.
          </p>
        </motion.div>

        {/* ── Stat row ─────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative z-10 flex justify-center mb-10 md:mb-14 px-6"
        >
          <div className="inline-flex border border-border rounded-2xl overflow-hidden divide-x divide-border bg-card/80 backdrop-blur-md shadow-xl shadow-background/20">
            {[
              { target: SKILLS.length, suffix: '+', label: 'Technologies' },
              { target: 10, suffix: '+', label: 'Years Experience' },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col items-center justify-center px-8 md:px-12 py-4 md:py-5 min-w-[100px] md:min-w-[140px]"
              >
                <div className="font-playfair text-[24px] md:text-[28px] font-bold text-foreground leading-none">
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>
                <div className="font-mono text-[8px] md:text-[9px] tracking-[.14em] uppercase text-muted-foreground/80 mt-1.5">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Marquee ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 mb-8"
        >
          <SkillMarquee />
        </motion.div>
      </div>
      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default TechStack;


