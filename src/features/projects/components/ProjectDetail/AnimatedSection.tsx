import React from 'react';
import { motion } from 'framer-motion';

// ── Animated Section ────────────────────────────────────────────────────────
const AnimatedSection = ({ 
  children, 
  delay = 0, 
  id, 
  direction = 'up' 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  id?: string, 
  direction?: 'up' | 'left' | 'right' 
}) => {
  const initial = {
    up: { opacity: 0, y: 40 },
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 }
  }[direction];

  return (
    <motion.section
      id={id}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100px]"
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
