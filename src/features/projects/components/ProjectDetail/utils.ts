import { useState, useEffect } from 'react';

// ── Reduced Motion Hook ─────────────────────────────────────────────────────
export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  
  return reducedMotion;
};

// ── Dynamic Tag Colors ───────────────────────────────────────────────────────
export const getTagColors = (tag: string, isDark: boolean) => {
  const hash = Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = [270, 190, 150, 45, 340, 210]; // Purple, Cyan, Emerald, Amber, Rose, Blue
  const hue = hues[hash % hues.length];
  
  if (isDark) {
    return {
      color: `hsl(${hue} 80% 75%)`,
      background: `hsl(${hue} 80% 50% / 0.1)`,
      borderColor: `hsl(${hue} 80% 50% / 0.2)`,
      boxShadow: `inset 0 1px 3px hsl(${hue} 80% 50% / 0.1)`,
    };
  } else {
    return {
      color: `hsl(${hue} 80% 35%)`,
      background: `hsl(${hue} 80% 50% / 0.08)`,
      borderColor: `hsl(${hue} 80% 50% / 0.15)`,
      boxShadow: `none`,
    };
  }
};
