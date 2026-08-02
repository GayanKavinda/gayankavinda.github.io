//src/components/layout/PreLoader.tsx

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import maskImg from '@assets/logos/Sticker_PNG_Archive-removebg-preview.png';
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

export const PreLoader = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
      if (isMounted) setLoading(false);
    };

    runChecks();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-auto overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at center, rgba(124,92,252,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(124,92,252,0.05) 0%, transparent 70%)',
              }}
            />

            {/* Logo + progress */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -15, 0] }}
              transition={{
                opacity: { duration: 1.2 },
                scale: { duration: 1.2 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <img
                src={maskImg}
                alt="Logo"
                className={`w-[180px] h-auto object-contain ${
                  isDark
                    ? 'filter drop-shadow-[0_0_40px_rgba(124,92,252,0.4)] brightness-110'
                    : 'filter drop-shadow-[0_0_25px_rgba(124,92,252,0.2)]'
                }`}
              />

              {/* Progress bar */}
              <div
                className="mt-8 w-24 h-[1.5px] rounded-full overflow-hidden"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7C5CFC, #00D4FF)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && children}
    </>
  );
};
