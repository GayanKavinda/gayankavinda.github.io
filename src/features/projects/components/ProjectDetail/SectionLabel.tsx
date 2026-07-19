import { motion } from 'framer-motion';

// ── Section Label (Zen) ───────────────────────────────────────────────────
const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <motion.div 
    className="flex items-center gap-6 mb-16"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    <span className="font-mono text-[10px] tracking-[0.2em] text-foreground/30 font-bold">{num}</span>
    <div className="h-[0.5px] flex-1 bg-foreground/5" />
    <span className="font-mono uppercase text-[11px] tracking-[0.15em] text-foreground/40 font-medium">{title}</span>
  </motion.div>
);

export default SectionLabel;
