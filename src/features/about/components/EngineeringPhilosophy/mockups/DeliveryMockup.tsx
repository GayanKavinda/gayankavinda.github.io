import { motion } from 'framer-motion';

export const DeliveryMockup = () => {
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
      
      {/* CI/CD Pipeline Steps */}
      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 1 },
          visible: { transition: { staggerChildren: 0.3 } }
        }}
      >
        {/* Step 1: Build */}
        <motion.g variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
          <rect x="20" y="30" width="50" height="50" rx="8" className="mockup-panel" />
          <circle cx="45" cy="55" r="12" fill="#7C5CFC" opacity="0.2" />
          <path d="M40 55 L43 58 L50 51" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="25" y="90" width="40" height="4" rx="2" fill="currentColor" className="text-foreground/30" />
        </motion.g>

        {/* Arrow 1 */}
        <motion.path 
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          d="M75 55 L100 55" stroke="currentColor" className="text-foreground/20" strokeWidth="2" strokeDasharray="3 3"
        />

        {/* Step 2: Test */}
        <motion.g variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
          <rect x="105" y="30" width="50" height="50" rx="8" className="mockup-panel" />
          <circle cx="130" cy="55" r="12" fill="#00D4FF" opacity="0.2" />
          <path d="M125 55 L128 58 L135 51" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="110" y="90" width="40" height="4" rx="2" fill="currentColor" className="text-foreground/30" />
        </motion.g>

        {/* Arrow 2 */}
        <motion.path 
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          d="M160 55 L185 55" stroke="currentColor" className="text-foreground/20" strokeWidth="2" strokeDasharray="3 3"
        />

        {/* Step 3: Deploy */}
        <motion.g variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
          <rect x="190" y="30" width="50" height="50" rx="8" className="mockup-panel" />
          
          <motion.g 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 1.5, type: "spring" }}
          >
            {/* Rocket Icon */}
            <path d="M215 45 C 215 45, 218 50, 218 55 C 218 58, 212 58, 212 55 C 212 50, 215 45, 215 45 Z" fill="#22c55e" />
            <path d="M213 55 L210 58 L212 58 Z" fill="#22c55e" />
            <path d="M217 55 L220 58 L218 58 Z" fill="#22c55e" />
            
            {/* Flames */}
            <motion.path 
              d="M213 59 L215 63 L217 59 Z" fill="#febc2e"
              animate={{ opacity: [0.4, 1, 0.4], scaleY: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          </motion.g>

          <rect x="195" y="90" width="40" height="4" rx="2" fill="currentColor" className="text-foreground/30" />
        </motion.g>
      </motion.g>

      {/* Deployment Status Bar */}
      <rect x="20" y="125" width="220" height="8" rx="4" className="mockup-panel" />
      <motion.rect 
        x="20" y="125" height="8" rx="4" fill="#22c55e"
        initial={{ width: 0 }}
        animate={{ width: 220 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
      
      <motion.rect 
        x="20" y="140" width="60" height="4" rx="2" fill="#22c55e" opacity="0.8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      />

    </motion.svg>
  );
};
