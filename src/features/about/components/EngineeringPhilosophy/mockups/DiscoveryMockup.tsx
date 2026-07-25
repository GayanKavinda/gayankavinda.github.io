import { motion } from 'framer-motion';

export const DiscoveryMockup = () => {
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
      {/* Background */}
      <rect width="280" height="160" rx="10" className="mockup-bg" />
      <rect width="280" height="24" rx="10" className="mockup-panel" />
      <circle cx="16" cy="12" r="4" fill="#7C5CFC" opacity="0.8" />
      <rect x="28" y="10" width="40" height="4" rx="2" fill="currentColor" className="text-foreground/20" />
      
      {/* Kanban Board Layout */}
      {/* Column 1 */}
      <rect x="16" y="36" width="74" height="110" rx="4" className="mockup-panel" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="24" y="44" width="30" height="4" rx="2" fill="currentColor" className="text-foreground/30" />
      
      <motion.rect 
        x="24" y="56" width="58" height="24" rx="3" fill="#7C5CFC" opacity="0.15" stroke="#7C5CFC" strokeWidth="0.5"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <rect x="30" y="62" width="20" height="3" rx="1.5" fill="#7C5CFC" opacity="0.8" />
      
      <motion.rect 
        x="24" y="86" width="58" height="24" rx="3" className="mockup-panel" strokeWidth="0.5"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      />
      <rect x="30" y="92" width="30" height="3" rx="1.5" fill="currentColor" className="text-foreground/30" />

      {/* Column 2 */}
      <rect x="102" y="36" width="74" height="110" rx="4" className="mockup-panel" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="110" y="44" width="30" height="4" rx="2" fill="currentColor" className="text-foreground/30" />
      
      {/* Moving Card from Col 1 to Col 2 */}
      <motion.rect
        width="58" height="24" rx="3" fill="#00D4FF" opacity="0.2" stroke="#00D4FF" strokeWidth="0.5"
        initial={{ x: 24, y: 116 }}
        animate={{ x: 110, y: 56 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeInOut" }}
      />
      <motion.rect
        width="25" height="3" rx="1.5" fill="#00D4FF" opacity="0.8"
        initial={{ x: 30, y: 122 }}
        animate={{ x: 116, y: 62 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeInOut" }}
      />

      {/* Column 3 */}
      <rect x="188" y="36" width="74" height="110" rx="4" className="mockup-panel" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="196" y="44" width="30" height="4" rx="2" fill="currentColor" className="text-foreground/30" />

      <motion.rect 
        x="196" y="56" width="58" height="34" rx="3" className="mockup-panel" strokeWidth="0.5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <rect x="202" y="62" width="35" height="3" rx="1.5" fill="currentColor" className="text-foreground/30" />
      <circle cx="210" cy="76" r="6" fill="#22c55e" opacity="0.5" />
      <circle cx="226" cy="76" r="6" fill="#7C5CFC" opacity="0.5" />
    </motion.svg>
  );
};
