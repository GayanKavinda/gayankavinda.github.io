//src/components/layout/PreLoader.tsx

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import maskImg from '@assets/logos/Sticker_PNG_Archive-removebg-preview.png';

export const PreLoader = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const runChecks = async () => {
      // Shorter minimum time for production feel
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));

      const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
      const docPromise = new Promise<void>(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve());
      });

      await Promise.all([minTimePromise, fontsPromise, docPromise]);
      
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
            {/* Background Glow Overlay */}
            <div 
              className="absolute inset-0 opacity-40 transition-opacity duration-1000"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at center, rgba(124,92,252,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(124,92,252,0.05) 0%, transparent 70%)'
              }}
            />

            {/* Glowing Logo Image with smooth hover animation */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -15, 0] 
              }}
              transition={{ 
                opacity: { duration: 1.2 },
                scale: { duration: 1.2 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <img
                src={maskImg}
                alt="Logo"
                className={`w-[180px] h-auto transition-all duration-700 object-contain ${
                  isDark 
                    ? 'filter drop-shadow-[0_0_40px_rgba(124,92,252,0.4)] brightness-110' 
                    : 'filter drop-shadow-[0_0_25px_rgba(124,92,252,0.2)]'
                }`}
              />
              {/* Subtle underline glow */}
              <motion.div 
                className={`mt-8 h-[1.5px] w-12 blur-[1px] transition-colors duration-700 ${
                  isDark ? 'bg-[#7C5CFC]/50' : 'bg-[#7C5CFC]/30'
                }`}
                animate={{ width: [32, 64, 32], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
};


