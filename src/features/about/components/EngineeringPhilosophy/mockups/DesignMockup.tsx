import { motion } from 'framer-motion';

export const DesignMockup = () => {
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
      {/* Background UI */}
      <rect width="280" height="160" rx="10" className="mockup-bg" />
      
      {/* Sidebar */}
      <rect width="60" height="160" rx="10" className="mockup-panel" />
      <rect x="10" y="20" width="40" height="4" rx="2" fill="currentColor" className="text-foreground/20" />
      <rect x="10" y="32" width="30" height="3" rx="1.5" fill="currentColor" className="text-foreground/10" />
      <rect x="10" y="42" width="35" height="3" rx="1.5" fill="currentColor" className="text-foreground/10" />
      
      {/* Design Canvas */}
      <rect x="80" y="20" width="180" height="120" rx="6" className="mockup-panel" strokeWidth="0.5" strokeDasharray="2 2" />
      
      {/* UI Elements on Canvas */}
      <motion.rect 
        x="100" y="40" width="140" height="40" rx="4" className="mockup-panel" strokeWidth="0.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.rect 
        x="110" y="50" width="40" height="6" rx="3" fill="currentColor" className="text-foreground/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      />
      
      {/* Button that gets redesigned */}
      <motion.rect 
        x="110" y="95" width="80" height="24" rx="4"
        fill="#7C5CFC"
        initial={{ backgroundColor: "var(--border)", opacity: 0.5 }}
        animate={{ backgroundColor: "#7C5CFC", opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.6 }}
      />
      
      {/* Cursor Animation */}
      <motion.g
        initial={{ x: 250, y: 130, scale: 0 }}
        animate={{ x: 140, y: 105, scale: 1 }}
        transition={{ 
          x: { duration: 1, delay: 0.6, ease: "easeOut" },
          y: { duration: 1, delay: 0.6, ease: "easeOut" },
          scale: { duration: 0.3, delay: 0.6 }
        }}
      >
        <path d="M0,0 L0,14 L4,11 L7,17 L9,16 L6,10 L11,10 Z" fill="#00D4FF" stroke="#000" strokeWidth="0.5" />
        <motion.circle 
          cx="0" cy="0" r="12" fill="#00D4FF" opacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6, delay: 1.5 }}
        />
      </motion.g>

    </motion.svg>
  );
};
