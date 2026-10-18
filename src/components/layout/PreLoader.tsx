//src/components/layout/PreLoader.tsx

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
// Import hero images so Vite resolves the correct hashed URLs at build time
import heroEve from '@assets/images/hero/eve.png';
import heroMidnight from '@assets/images/hero/midnight.png';
import heroCamper from '@assets/images/hero/person_camping_area.png';

// Critical assets that must be ready before page is revealed
const CRITICAL_IMAGES: string[] = [heroEve, heroMidnight, heroCamper];
const CRITICAL_MODEL = '/models/shrine.glb';

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block on error
    img.src = src;
  });
}

async function preloadModel(url: string): Promise<void> {
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) return;
    await res.arrayBuffer(); // consume so browser caches it
  } catch {
    // Don't block on network error
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const COLD_START_KEY = 'gy-cold-start-done';

export const PreLoader = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Only run the preloader on the very first cold start of the session.
  // On cached/back navigations the flag is already set, so we skip straight to children.
  const coldStart = !sessionStorage.getItem(COLD_START_KEY);

  useEffect(() => {
    if (!coldStart) {
      setLoading(false);
      return;
    }
    let isMounted = true;

    const runChecks = async () => {
      // Phase 1 — fonts + DOM ready
      const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
      const docPromise = new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      });
      await Promise.all([fontsPromise, docPromise]);
      if (isMounted) setProgress(20);

      // Phase 2 — hero images (parallel, 4s timeout)
      await Promise.race([
        Promise.all(CRITICAL_IMAGES.map(preloadImage)),
        wait(4000),
      ]);
      if (isMounted) setProgress(65);

      // Phase 3 — 3D model (4s timeout)
      await Promise.race([preloadModel(CRITICAL_MODEL), wait(4000)]);
      if (isMounted) setProgress(100);

      // Brief pause at 100%
      await wait(300);
      sessionStorage.setItem(COLD_START_KEY, '1');
      if (isMounted) setLoading(false);
    };

    runChecks();
    return () => { isMounted = false; };
  }, [coldStart]);

  return (
    <>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-3 py-2 rounded-full pointer-events-none"
            style={{
              background: isDark ? 'rgba(15,16,24,0.8)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)'}`,
              boxShadow: isDark ? '0 8px 32px -8px rgba(0,0,0,0.6)' : '0 8px 32px -8px rgba(15,23,42,0.12)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'hsl(var(--gold))' }}
            />
            <span className="font-mono text-[10px] text-foreground/60 tabular-nums">
              {progress}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
