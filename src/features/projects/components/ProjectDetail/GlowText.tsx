import React, { useRef } from 'react';
import { useTheme } from '@app/providers/theme-provider';

// ── Mouse Proximity Glow Text Effect ─────────────────────────────────────
const GlowText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mouse-x', `${Math.max(0, Math.min(100, x))}%`);
    ref.current.style.setProperty('--mouse-y', `${Math.max(0, Math.min(100, y))}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative transition-[background-color,shadow,transform] duration-700 ${className}`}
      style={{
        background: isDark 
          ? `radial-gradient(circle 240px at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(var(--crimson), 0.08), transparent 70%)`
          : `radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.02), transparent 70%)`,
      } as any}
    >
      {children}
    </div>
  );
};

export default GlowText;
