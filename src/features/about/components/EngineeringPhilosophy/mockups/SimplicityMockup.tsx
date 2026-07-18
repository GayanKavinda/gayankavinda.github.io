import { motion } from 'framer-motion';

export const SimplicityMockup = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, x: -6 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.svg
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <rect width="280" height="160" rx="10" className="mockup-bg" />
      <rect width="280" height="24" rx="10" className="mockup-panel" />
      <rect y="14" width="280" height="10" className="mockup-panel" />
      <circle cx="18" cy="12" r="4" fill="#ff5f57" />
      <circle cx="32" cy="12" r="4" fill="#febc2e" />
      <circle cx="46" cy="12" r="4" fill="#28c840" />
      <rect x="96" y="8" width="88" height="8" rx="3" fill="currentColor" className="text-foreground/5 opacity-50" />

      <motion.g variants={lineVariants}>
        <rect x="14" y="33" width="18" height="6" rx="2" fill="#7C5CFC" opacity="0.85" />
        <rect x="38" y="33" width="50" height="6" rx="2" fill="#00D4FF" opacity="0.8" />
        <rect x="94" y="33" width="34" height="6" rx="2" fill="#7ec8a0" opacity="0.7" />
      </motion.g>
      <motion.g variants={lineVariants}>
        <rect x="24" y="47" width="14" height="6" rx="2" fill="#7ec8a0" opacity="0.6" />
        <rect x="44" y="47" width="70" height="6" rx="2" fill="#8888b0" />
        <rect x="120" y="47" width="28" height="6" rx="2" fill="#7C5CFC" opacity="0.55" />
      </motion.g>
      <motion.g variants={lineVariants}>
        <rect x="24" y="61" width="90" height="6" rx="2" fill="#8888b0" />
        <rect x="120" y="61" width="46" height="6" rx="2" fill="#00D4FF" opacity="0.6" />
      </motion.g>
      <motion.g variants={lineVariants}>
        <rect x="14" y="75" width="14" height="6" rx="2" fill="#7ec8a0" opacity="0.6" />
        <rect x="34" y="75" width="38" height="6" rx="2" fill="#8888b0" />
      </motion.g>
      <motion.g variants={lineVariants}>
        <rect x="14" y="89" width="18" height="6" rx="2" fill="#7C5CFC" opacity="0.7" />
        <rect x="38" y="89" width="56" height="6" rx="2" fill="#00D4FF" opacity="0.65" />
        <rect x="100" y="89" width="40" height="6" rx="2" fill="#8888b0" />
      </motion.g>
      <motion.g variants={lineVariants}>
        <rect x="24" y="103" width="80" height="6" rx="2" fill="#8888b0" />
        <rect x="110" y="103" width="22" height="6" rx="2" fill="#7ec8a0" opacity="0.6" />
      </motion.g>

      <rect x="160" y="101" width="100" height="14" rx="5" fill="#00D4FF" opacity="0.12" />
      <rect x="166" y="104" width="60" height="5" rx="2" fill="#00D4FF" opacity="0.5" />
      <motion.rect
        x="134" y="103" width="2" height="8" rx="1"
        fill="currentColor" opacity="0.7"
        className="text-foreground"
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: t => t < 0.5 ? 0 : 1 }}
      />
      <rect x="0" y="148" width="280" height="12" className="mockup-panel" />
      <rect x="10" y="151" width="30" height="5" rx="2" fill="#22c55e" opacity="0.45" />
      <rect x="220" y="151" width="44" height="5" rx="2" fill="#8888b0" opacity="0.5" />
    </motion.svg>
  );
};


