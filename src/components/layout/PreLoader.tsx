// src/components/layout/PreLoader.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import logoMask from '@assets/images/mask.png';

// Critical hero assets to ensure instant zero-layout-shift render
import heroEve from '@assets/images/hero/eve.png';
import heroMidnight from '@assets/images/hero/midnight.png';
import heroCamper from '@assets/images/hero/person_camping_area.png';

// Critical UI assets
import yujiDark from '@assets/images/contact/Yuji_Itadori_dark.webp';
import yujiWhite from '@assets/images/contact/Yuji_Itadori_white.webp';
import mapDark from '@assets/images/map-dark.webp';
import mapWhite from '@assets/images/map-white.webp';

const CRITICAL_IMAGES: string[] = [
  heroEve,
  heroMidnight,
  heroCamper,
  logoMask,
  yujiDark,
  yujiWhite,
  mapDark,
  mapWhite,
];

const CRITICAL_MODEL = '/models/shrine.glb';

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function preloadModel(url: string): Promise<void> {
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) return;
    await res.arrayBuffer();
  } catch {
    // Non-blocking fallback
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const PreLoader = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing runtime');

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const MINIMUM_LOADER_TIME = 1400; // Guarantee deliberate, smooth, premium perception (no jerky flashes)

    const runChecks = async () => {
      // 1. Core DOM & Font engines
      if (isMounted) {
        setStatusText('Loading design tokens & typography');
        setProgress(15);
      }
      const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
      const docPromise = new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      });
      await Promise.all([fontsPromise, docPromise]);
      if (isMounted) setProgress(35);

      // 2. High-res Visual Assets (Hero Eve/Midnight, Camper, Maps, Stickers)
      if (isMounted) {
        setStatusText('Caching high-res graphics & layers');
      }
      let loadedImagesCount = 0;
      await Promise.all(
        CRITICAL_IMAGES.map((src) =>
          preloadImage(src).then(() => {
            loadedImagesCount++;
            if (isMounted) {
              const imgProgress = 35 + Math.floor((loadedImagesCount / CRITICAL_IMAGES.length) * 35);
              setProgress(Math.min(imgProgress, 70));
            }
          })
        )
      );

      // 3. 3D Model & Interactive Shaders
      if (isMounted) {
        setStatusText('Compiling 3D mesh & assets');
        setProgress(75);
      }
      await preloadModel(CRITICAL_MODEL);
      if (isMounted) setProgress(90);

      // 4. Verification & State Hydration
      if (isMounted) {
        setStatusText('Finalizing workspace');
      }
      
      // Ensure the minimum graceful time elapsed so user perceives solid loading
      const elapsed = Date.now() - startTime;
      if (elapsed < MINIMUM_LOADER_TIME) {
        await wait(MINIMUM_LOADER_TIME - elapsed);
      }

      if (isMounted) setProgress(100);

      // Brief finish pause at 100%
      await wait(350);
      if (isMounted) {
        setLoading(false);
      }
    };

    runChecks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="fullscreen-preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.01,
              filter: 'blur(12px)',
              transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 select-none"
            style={{
              background: isDark ? '#06080F' : '#FAFBFD',
              color: isDark ? '#F8FAFC' : '#0F172A',
            }}
          >
            {/* Ambient Background Glow */}
            <div 
              className="absolute w-[380px] h-[380px] rounded-full pointer-events-none opacity-20 blur-[100px]"
              style={{
                background: isDark 
                  ? 'radial-gradient(circle, #3B82F6 0%, #1D4ED8 100%)' 
                  : 'radial-gradient(circle, #93C5FD 0%, #3B82F6 100%)'
              }}
            />

            {/* Central Brand Box */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Logo with breathing ambient aura */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-7"
              >
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center p-3 shadow-2xl relative overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)'}`,
                    boxShadow: isDark 
                      ? '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : '0 20px 40px rgba(15,23,42,0.08), inset 0 1px 0 #ffffff',
                  }}
                >
                  <img
                    src={logoMask}
                    alt="Gara Yaka Mask Logo"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </motion.div>

              {/* Title & Role */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-8"
              >
                <h1 className="font-roboto font-bold text-lg sm:text-xl tracking-tight text-foreground">
                  GAYAN KAVINDA
                </h1>
                <p className="font-roboto text-xs uppercase tracking-[0.2em] text-foreground/50 mt-1 font-medium">
                  Systems Architect & Engineer
                </p>
              </motion.div>

              {/* Progress Bar Container */}
              <div className="w-[220px] sm:w-[260px] flex flex-col items-center gap-3">
                <div 
                  className="w-full h-[3.5px] rounded-full overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
                  }}
                >
                  <motion.div
                    className="h-full rounded-full transition-all duration-200 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
                      boxShadow: '0 0 12px rgba(59,130,246,0.6)',
                    }}
                  />
                </div>

                {/* Percentage & Live Stage Status */}
                <div className="flex items-center justify-between w-full px-0.5">
                  <span className="font-roboto text-[11px] tracking-wide text-foreground/45 font-medium truncate max-w-[170px]">
                    {statusText}
                  </span>
                  <span className="font-roboto font-semibold text-xs tabular-nums text-foreground/85">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children underneath so they are mounted and ready */}
      <div className={loading ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </div>
    </>
  );
};

export default PreLoader;
