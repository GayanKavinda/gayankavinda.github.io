import { motion } from 'framer-motion';

export const QAMockup = () => {
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
      <rect width="280" height="160" rx="10" className="mockup-bg" />
      <rect x="10" y="10" width="260" height="30" rx="6" className="mockup-panel" />
      <rect x="20" y="21" width="80" height="8" rx="4" fill="currentColor" className="text-foreground/20" />
      
      {/* Test Progress Bar */}
      <rect x="120" y="23" width="130" height="4" rx="2" className="mockup-panel" strokeWidth="0" />
      <motion.rect 
        x="120" y="23" height="4" rx="2" fill="#22c55e"
        initial={{ width: 0 }}
        animate={{ width: 130 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Test list items */}
      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 1 },
          visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
        }}
      >
        {[55, 75, 95, 115].map((y, i) => (
          <motion.g key={i} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
            <rect x="20" y={y} width="240" height="14" rx="3" className="mockup-panel" />
            
            {/* Checkmark Circle */}
            <circle cx="32" cy={y + 7} r="4" fill="#22c55e" opacity="0.2" />
            <motion.path 
              d={`M29 ${y+7} L31 ${y+9} L35 ${y+5}`} 
              stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: (i + 1) * 0.3 }}
            />
            
            <rect x="44" y={y + 5} width="60" height="4" rx="2" fill="currentColor" className="text-foreground/30" />
            <rect x="230" y={y + 5} width="20" height="4" rx="2" fill="currentColor" className="text-foreground/10" />
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
};
