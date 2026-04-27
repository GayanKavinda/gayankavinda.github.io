import React, { useRef } from 'react'
import { motion, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.15 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { stiffness: 100, damping: 20, mass: 1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    x.set(middleX * strength);
    y.set(middleY * strength);
  }

  const reset = () => {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ position: "relative", x, y, willChange: 'transform' }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}
