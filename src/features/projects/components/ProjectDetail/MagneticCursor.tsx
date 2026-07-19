import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ── Magnetic Cursor (Subtle Zen version) ───────────────────────────────
const MagneticCursor = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });
  const [label, setLabel] = useState('');

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const enter = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? '');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', enter);
    };
  }, [x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="rounded-full border border-white/40 flex items-center justify-center"
        animate={{ width: label ? 64 : 6, height: label ? 64 : 6 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        {label && <span className="font-mono text-[10px] uppercase tracking-widest text-white">{label}</span>}
      </motion.div>
    </motion.div>
  );
};

export default MagneticCursor;
