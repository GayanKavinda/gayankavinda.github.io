//src/components/layout/PreLoader.tsx

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signature } from '@shared/registry/spell-ui/signature';
import maskImg from '@shared/assets/images/cyberpunk-design-mask.png';

export const PreLoader = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>(['> INITIALIZING CORE SYSTEMS...']);

  useEffect(() => {
    let isMounted = true;
    const addLog = (msg: string) => {
      if (isMounted) setLogs(prev => [...prev, `> ${msg}`]);
    };

    const runChecks = async () => {
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 3800));

      // 1. Check Fonts
      const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
      fontsPromise.then(() => addLog('FONTS LOADED... [OK]'));

      // 2. Check Document Load
      const docPromise = new Promise<void>(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', () => resolve());
        }
      });
      docPromise.then(() => addLog('DOM & ASSETS LOADED... [OK]'));

      // 3. Optional: Custom arbitrary check to pad out logs realistically
      const scriptPromise = new Promise(resolve => setTimeout(resolve, 1500));
      scriptPromise.then(() => addLog('COMPILING SECURE WIDGETS... [SUCCESS]'));

      // Wait for everything (Real loading + minimum animation time)
      await Promise.all([minTimePromise, fontsPromise, docPromise, scriptPromise]);

      addLog('SYSTEM READY.');
      
      // Give the user a brief moment to read "SYSTEM READY" before fading out
      setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 400);
    };

    runChecks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-auto overflow-hidden"
          >
            {/* Minimal Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20"
                 style={{
                   backgroundImage: 'linear-gradient(rgba(196,30,58,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.05) 1px, transparent 1px)',
                   backgroundSize: '32px 32px'
                 }} 
            />

            {/* Logo Image */}
            <motion.img
              src={maskImg}
              alt="Gara Yaka Logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-[280px] h-auto z-10 filter drop-shadow-[0_0_30px_rgba(212,137,26,0.3)]"
            />

            {/* Signature */}
            <div className="relative z-20 mt-4 filter drop-shadow-md">
              <Signature
                text="Gara Yaka"
                fontSize={84}
                color="#D4891A" /* Portfolio Gold */
                duration={1.2}
              />
            </div>
            
            {/* Accent Line */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120px", opacity: 0.6 }}
              transition={{ delay: 2.2, duration: 1, ease: "easeInOut" }}
              className="h-[1.5px] bg-[#7C5CFC] mt-6 relative z-20 mb-8" /* Portfolio Violet */
            />

            {/* Realtime Terminal Logs */}
            <div className="relative z-20 flex flex-col items-start w-[320px] mt-4 font-mono text-[10px] sm:text-xs text-[#D4891A]/70 uppercase tracking-widest min-h-[120px]">
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-1.5"
                >
                  {log}
                </motion.div>
              ))}
              {/* Blinking Cursor - stops blinking when ready */}
              <motion.div 
                animate={{ opacity: logs.includes('> SYSTEM READY.') ? 0 : [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-3 bg-[#7C5CFC]/80 mt-1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!loading && children}
    </>
  );
};


