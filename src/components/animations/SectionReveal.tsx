import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, VariantLabels } from 'framer-motion';

interface SectionRevealProps {
  children: ReactNode;
  /** Optional id so scroll-into-view still works */
  id?: string;
  /** Offset from bottom of viewport before triggering (0-1, default 0.15) */
  threshold?: number;
  /** Reveal variant: 'rise' | 'fade' | 'scale' | 'none' */
  variant?: 'rise' | 'fade' | 'scale' | 'none';
  /** Stagger delay between child elements (seconds) */
  stagger?: number;
  className?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

const variants: Record<string, { hidden: VariantLabels; visible: VariantLabels }> = {
  rise: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease } },
  },
  none: {
    hidden: {},
    visible: { transition: { duration: 0 } },
  },
};

export function SectionReveal({
  children,
  id,
  threshold = 0.15,
  variant = 'rise',
  stagger = 0,
  className,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${1 - threshold + 0.1} end`, `end ${0.1 - threshold} start`],
  });

  // Map scroll progress to a 0→1 opacity for a buttery fade-in on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [40, 0, 0, 20]);

  if (variant === 'none') {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const v = variants[variant];

  return (
    <motion.div
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: threshold }}
      variants={v}
      style={{
        opacity,
        y,
      }}
    >
      {children}
    </motion.div>
  );
}

export default SectionReveal;