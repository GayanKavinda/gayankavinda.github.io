import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
import { SkillMarquee } from './SkillMarquee';
import { SKILLS } from './constants';

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
    <section id="skills" ref={sectionRef} className="py-[80px] md:py-[100px] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

        {/* ── Header ────────────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="font-playfair text-[clamp(32px,5vw,56px)] font-bold text-foreground leading-tight">
            The <em className="italic text-primary">Stack</em>
          </h2>
          <p className="text-[13px] md:text-[14px] text-muted-foreground mt-3 max-w-[360px] mx-auto leading-relaxed">
            Technologies I use to build production-ready systems.
          </p>
        </motion.div>

        {/* ── Stat row ─────────────────── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center mb-10 md:mb-14 px-6"
        >
          <div className="inline-flex border border-border rounded-2xl overflow-hidden divide-x divide-border bg-card/30 backdrop-blur-sm">
            {[
              { target: SKILLS.length, suffix: '+', label: 'Technologies'   },
              { target: 10,            suffix: '+', label: 'Years Experience' },
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
          className="mb-8"
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


