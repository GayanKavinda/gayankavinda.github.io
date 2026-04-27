import { motion } from 'framer-motion';

export const TestingMockup = () => {
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

  const rowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 1, ease: "easeInOut", delay: 0.6 }
    }
  };

  const rows = [
    { y: 35,  pass: true,  w: 80 },
    { y: 52,  pass: true,  w: 100 },
    { y: 69,  pass: false, w: 92 },
    { y: 86,  pass: true,  w: 76 },
    { y: 103, pass: true,  w: 110 },
  ];

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
      <rect width="280" height="26" rx="10" className="mockup-panel" />
      <rect y="16" width="280" height="10" className="mockup-panel" />
      <rect x="12" y="9" width="60" height="7" rx="3" fill="currentColor" className="text-foreground/5 opacity-50" />
      <rect x="202" y="8" width="66" height="10" rx="5" fill="#22c55e" opacity="0.18" />
      <rect x="214" y="10" width="42" height="5" rx="2" fill="#22c55e" opacity="0.7" />

      {rows.map((r, i) => (
        <motion.g key={i} variants={rowVariants}>
          <circle
            cx="22" cy={r.y + 6} r="6"
            fill={r.pass ? '#22c55e' : '#7C5CFC'}
            opacity={r.pass ? 0.8 : 0.85}
          />
          {r.pass ? (
            <motion.polyline
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              points={`${18},${r.y + 6} ${21},${r.y + 9} ${26},${r.y + 3}`}
              stroke="#fff" strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            />
          ) : (
            <motion.g 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              style={{ transformOrigin: `22px ${r.y + 6}px` }}
            >
              <line x1="18" y1={r.y + 3} x2="26" y2={r.y + 9}
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1={r.y + 3} x2="18" y2={r.y + 9}
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          )}
          <rect x="36" y={r.y + 2} width={r.w} height="6" rx="2"
            fill="currentColor" className="text-foreground/10" opacity="0.85" />
          <rect x={r.w + 44} y={r.y + 2}
            width={r.pass ? 30 : 48} height="6" rx="2"
            fill={r.pass ? '#00D4FF' : '#7C5CFC'} opacity="0.4" />
          <rect x="236" y={r.y + 2} width="34" height="6" rx="2" fill="currentColor" className="text-foreground/5" />
        </motion.g>
      ))}

      {/* Progress bar track */}
      <rect x="12" y="128" width="256" height="6" rx="3" fill="currentColor" className="text-foreground/5" />
      <motion.rect
        variants={progressVariants}
        x="12" y="128" width="200" height="6" rx="3"
        fill="#22c55e" opacity="0.55"
        style={{ originX: 0 }}
      />

      <rect x="12" y="140" width="40" height="5" rx="2" fill="#22c55e" opacity="0.4" />
      <rect x="58" y="140" width="30" height="5" rx="2" fill="#7C5CFC" opacity="0.4" />
      <rect x="94" y="140" width="50" height="5" rx="2" fill="currentColor" className="text-foreground/10" />
    </motion.svg>
  );
};


