import { useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

/**
 * ScrollToTop Component
 * 
 * Synchronizes route changes with the Lenis smooth scroll engine.
 * Ensures the page resets to top IMMEDIATELY on navigation by using useLayoutEffect.
 * Also disables the browser's default scroll restoration to avoid flickers.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  // Disable browser's internal scroll restoration globally on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Use useLayoutEffect to trigger scroll reset BEFORE the browser paints.
  // This eliminates the visual "jump" seen with standard useEffect.
  useLayoutEffect(() => {
    if (lenis) {
      // Force Lenis to scroll to top immediately (0ms duration)
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Standard window fallback
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
