import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SkillMarquee } from './SkillMarquee';

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="skills" ref={sectionRef} className="py-[80px] md:py-[100px] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <motion.div
          className="relative z-10 text-center mb-14 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Technical{' '}
            <span className="font-playfair italic font-medium text-[#d60d86]">Stack</span>
          </h2>
          <p className="text-sm text-foreground/50 dark:text-foreground/60 leading-relaxed max-w-[280px]">
            Architecting scalable systems and refined sensory experiences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
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