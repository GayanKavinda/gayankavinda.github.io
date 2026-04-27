import { motion } from 'framer-motion';

export const ObservabilityMockup = () => {
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

  const barVariants = {
    hidden: { scaleY: 0 },
    visible: { 
      scaleY: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const sparklineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 }
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
      {/* Background */}
      <rect width="280" height="160" rx="10" className="mockup-bg" />

      {/* Top bar */}
      <rect width="280" height="28" rx="10" className="mockup-panel" />
      <rect y="18" width="280" height="10" className="mockup-panel" />
      <motion.circle
        cx="16" cy="14" r="4"
        fill="#7C5CFC" 
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="26" y="10" width="50" height="8" rx="3" fill="currentColor" className="text-foreground/5 opacity-50" />
      <rect x="218" y="10" width="44" height="8" rx="3" fill="#00D4FF" opacity="0.22" />

      {/* Stat cards */}
      <rect x="10" y="36" width="72" height="30" rx="6" className="mockup-panel" strokeWidth="0.8" />
      <rect x="14" y="42" width="28" height="4" rx="2" fill="currentColor" className="text-foreground/10" />
      <rect x="14" y="50" width="44" height="8" rx="3" fill="#7C5CFC" opacity="0.72" />

      <rect x="92" y="36" width="72" height="30" rx="6" className="mockup-panel" strokeWidth="0.8" />
      <rect x="96" y="42" width="28" height="4" rx="2" fill="currentColor" className="text-foreground/10" />
      <rect x="96" y="50" width="44" height="8" rx="3" fill="#00D4FF" opacity="0.62" />

      <rect x="174" y="36" width="72" height="30" rx="6" className="mockup-panel" strokeWidth="0.8" />
      <rect x="178" y="42" width="28" height="4" rx="2" fill="currentColor" className="text-foreground/10" />
      <rect x="178" y="50" width="44" height="8" rx="3" fill="#22c55e" opacity="0.62" />

      {/* Chart area */}
      <rect x="10" y="76" width="260" height="72" rx="6" className="mockup-panel" strokeWidth="0.8" />

      {/* Bars */}
      {[
        { x: 24,  y: 108, h: 28, opacity: 0.58 },
        { x: 50,  y: 100, h: 36, opacity: 0.72 },
        { x: 76,  y: 92,  h: 44, opacity: 0.82 },
        { x: 102, y: 98,  h: 38, opacity: 0.68 },
        { x: 128, y: 88,  h: 48, opacity: 0.88 },
      ].map((bar, i) => (
        <motion.rect
          key={i}
          variants={barVariants}
          x={bar.x}
          y={bar.y}
          width="16"
          height={bar.h}
          rx="2"
          fill="#7C5CFC"
          opacity={bar.opacity}
          style={{
            transformOrigin: `${bar.x + 8}px ${bar.y + bar.h}px`,
          }}
        />
      ))}

      {/* Sparklines */}
      <motion.polyline
        variants={sparklineVariants}
        points="20,130 46,118 72,110 98,115 124,105 150,112 176,98 202,106 228,94 254,100"
        stroke="#00D4FF"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.polyline
        variants={sparklineVariants}
        points="20,136 46,132 72,128 98,130 124,124 150,128 176,120 202,124 228,118 254,121"
        stroke="#00D4FF"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 2"
      />
    </motion.svg>
  );
};


