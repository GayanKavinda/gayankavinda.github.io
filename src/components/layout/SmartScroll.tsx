import { useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

/**
 * SmartScroll Component
 *
 * Responsibilities:
 * 1. Disables the browser's built-in scroll restoration so we control it fully.
 * 2. On route change (same page nav like clicking a nav link) → scrolls to the
 *    target section WITHOUT writing a `#id` hash into the URL.
 * 3. On actual page navigation (different route) → resets to top.
 * 4. On hard refresh → restores the last known scroll position so the user
 *    lands exactly where they were.
 *
 * The key insight: we use `sessionStorage` to persist scroll position per route,
 * and we intercept the hash scroll in Home.tsx's useEffect so it doesn't fight us.
 */

const SCROLL_KEY = 'gy-scroll-pos';

const SmartScroll = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  // Disable browser's internal scroll restoration globally on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save scroll position before any navigation away
  useEffect(() => {
    const save = () => {
      const pos = lenis ? lenis.scroll : window.scrollY;
      sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ pathname, pos }));
    };
    window.addEventListener('beforeunload', save);
    return () => window.removeEventListener('beforeunload', save);
  }, [pathname, lenis]);

  useLayoutEffect(() => {
    // If there's a hash in the URL (e.g. /#contact), scroll to that element
    // WITHOUT keeping the hash visible — we handle it then clear it.
    if (hash && lenis) {
      const id = hash.replace('#', '');
      // Small delay to let lazy components render
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          lenis.scrollTo(el as HTMLElement, { offset: -100 });
        }
      });
      return;
    }

    // On a true route change (different pathname) → reset to top
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, lenis]);

  // On mount / refresh: restore saved scroll position
  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved && lenis) {
        const { pos } = JSON.parse(saved);
        if (typeof pos === 'number' && pos > 0) {
          // Wait for content to paint before restoring
          requestAnimationFrame(() => {
            lenis.scrollTo(pos, { immediate: true });
          });
        }
      }
    } catch {
      // ignore — sessionStorage may be unavailable
    }
  }, [lenis]);

  return null;
};

export default SmartScroll;