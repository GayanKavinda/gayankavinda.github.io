import { motion } from 'framer-motion';

export const DevelopmentMockup = () => {
  return (
    <motion.svg
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full block"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Editor Background */}
      <rect width="280" height="160" rx="10" className="mockup-bg" />
      <rect width="280" height="24" rx="10" className="mockup-panel" />
      <circle cx="16" cy="12" r="3" fill="#ff5f57" />
      <circle cx="28" cy="12" r="3" fill="#febc2e" />
      <circle cx="40" cy="12" r="3" fill="#28c840" />
      <rect x="110" y="8" width="60" height="8" rx="4" fill="currentColor" className="text-foreground/10" />

      {/* Code Lines with AI generation animation */}
      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 1 },
          visible: {
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
          }
        }}
      >
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 80 } }} x="16" y="40" height="6" rx="3" fill="#7C5CFC" opacity="0.8" />
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 120 } }} x="16" y="52" height="6" rx="3" fill="#00D4FF" opacity="0.6" />
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 100 } }} x="28" y="64" height="6" rx="3" fill="currentColor" className="text-foreground/30" />
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 140 } }} x="28" y="76" height="6" rx="3" fill="currentColor" className="text-foreground/30" />
        
        {/* AI Autocomplete suggestion block */}
        <motion.rect 
          variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { delay: 1.2 } } }} 
          x="28" y="88" width="160" height="30" rx="4" fill="#7C5CFC" opacity="0.15" stroke="#7C5CFC" strokeWidth="0.5" strokeDasharray="2 2"
        />
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 120, transition: { delay: 1.4 } } }} x="34" y="96" height="4" rx="2" fill="#7C5CFC" opacity="0.6" />
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 90, transition: { delay: 1.5 } } }} x="34" y="106" height="4" rx="2" fill="#7C5CFC" opacity="0.6" />
        
        <motion.rect variants={{ hidden: { width: 0 }, visible: { width: 40 } }} x="16" y="126" height="6" rx="3" fill="#00D4FF" opacity="0.6" />
      </motion.g>

      {/* AI Sparkle Icon */}
      <motion.g
        initial={{ scale: 0, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <path d="M198 90 L202 98 L210 102 L202 106 L198 114 L194 106 L186 102 L194 98 Z" fill="#00D4FF" />
      </motion.g>
    </motion.svg>
  );
};
