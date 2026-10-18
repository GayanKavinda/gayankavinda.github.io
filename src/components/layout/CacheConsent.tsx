// src/components/layout/CacheConsent.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, X, Cog, Zap, Activity } from 'lucide-react';
import { useTheme } from '@app/providers/theme-provider';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';

const CONSENT_KEY = 'gy_runtime_optimization_consent';

interface CachePreferences {
  essential: boolean;
  assets: boolean;
  analytics: boolean;
}

export const CacheConsent: React.FC = () => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'info' | 'config'>('info');
  const [prefs, setPrefs] = useState<CachePreferences>({
    essential: true,
    assets: true,
    analytics: true,
  });

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      const timer = setTimeout(() => setShow(true), 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveAndClose = (newPrefs: CachePreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newPrefs));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9999] w-[calc(100vw-32px)] sm:w-[320px] max-w-[340px] pointer-events-auto"
        >
          {/* Explicit clean rectangle card with sharp modern corners (rounded-lg / rounded-md) */}
          <div
            className={`border rounded-xl backdrop-blur-xl shadow-2xl relative overflow-hidden font-roboto ${
              isDark
                ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.6)]'
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_12px_32px_rgba(15,23,42,0.1)]'
            }`}
          >
            {/* Header */}
            <div className="p-4 pb-2 flex items-center justify-between border-b border-inherit/40">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="font-roboto text-[11px] uppercase tracking-wider font-semibold opacity-70">
                  Persistence Config
                </span>
              </div>
              {mode === 'config' && (
                <button
                  onClick={() => setMode('info')}
                  className="p-1 rounded-md opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Back to overview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Title & Body */}
            <div className="p-4 pt-3 space-y-3">
              {mode === 'info' ? (
                <>
                  <h4 className="text-[14px] font-roboto font-semibold tracking-tight text-foreground">
                    Runtime Optimization
                  </h4>
                  <p className="font-roboto text-[12px] leading-relaxed text-foreground/70">
                    Maintaining stable workspace state via predictive media caching and persistent session tokens for low-latency interactions.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => saveAndClose({ essential: true, assets: true, analytics: true })}
                      className="flex-1 h-9 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-roboto text-[12px] font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
                    >
                      ACCEPT ALL
                    </button>
                    <button
                      onClick={() => setMode('config')}
                      className={`h-9 w-9 flex items-center justify-center rounded-md border transition-colors cursor-pointer ${
                        isDark 
                          ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300' 
                          : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      aria-label="Configure preferences"
                    >
                      <Cog className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="space-y-2.5">
                    {/* Core Runtime */}
                    <div className="flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                        <Label className="font-roboto text-[11px] uppercase tracking-wider font-medium">Core Runtime</Label>
                      </div>
                      <span className="font-roboto text-[9px] px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/60 uppercase font-semibold">Locked</span>
                    </div>

                    {/* Media Assets */}
                    <div
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() => setPrefs((p) => ({ ...p, assets: !p.assets }))}
                    >
                      <div className="flex items-center gap-2.5">
                        <Zap className={`w-3.5 h-3.5 transition-colors ${prefs.assets ? 'text-blue-500' : 'text-foreground/30'}`} />
                        <Label className={`font-roboto text-[11px] uppercase tracking-wider cursor-pointer font-medium ${prefs.assets ? 'opacity-100' : 'opacity-50'}`}>
                          Media Assets
                        </Label>
                      </div>
                      <Switch
                        checked={prefs.assets}
                        onCheckedChange={(v) => setPrefs((p) => ({ ...p, assets: v }))}
                        className="scale-90 data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    {/* Telemetry */}
                    <div
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className={`w-3.5 h-3.5 transition-colors ${prefs.analytics ? 'text-blue-500' : 'text-foreground/30'}`} />
                        <Label className={`font-roboto text-[11px] uppercase tracking-wider cursor-pointer font-medium ${prefs.analytics ? 'opacity-100' : 'opacity-50'}`}>
                          Telemetry
                        </Label>
                      </div>
                      <Switch
                        checked={prefs.analytics}
                        onCheckedChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                        className="scale-90 data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => saveAndClose(prefs)}
                    className="w-full h-9 mt-2 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-roboto text-[12px] font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
                  >
                    DEPLOY POLICY
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CacheConsent;
