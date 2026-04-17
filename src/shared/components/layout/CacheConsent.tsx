import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import { Button } from '@shared/components/ui/button';
import { Switch } from '@shared/components/ui/switch';
import { Label } from '@shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@shared/components/ui/card';
import { Cog, Shield, Zap, Activity, X, Database } from 'lucide-react';

interface ConsentPrefs {
  essential: true;
  assets: boolean;
  analytics: boolean;
}

export const CacheConsent = () => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'info' | 'config'>('info');
  const [prefs, setPrefs] = useState<ConsentPrefs>({
    essential: true,
    assets: true,
    analytics: false,
  });

  const { theme } = useTheme();
  // Using direct theme check for zero-latency detection
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const saved = localStorage.getItem('gara-yaka-consent');
    if (!saved) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveAndClose = (p: ConsentPrefs) => {
    localStorage.setItem('gara-yaka-consent', JSON.stringify(p));
    if (p.assets) preFetch();
    setShow(false);
  };

  const preFetch = () => {
    ['/noise.png', '/map-dark.webp', '/map-white.webp'].forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="fixed bottom-6 right-6 z-[9999] w-[310px] pointer-events-auto"
        >
          <Card className={`border-2 backdrop-blur-md shadow-2xl relative overflow-hidden ${
            isDark ? 'bg-zinc-950/80 border-white/10' : 'bg-white/90 border-black/5'
          }`}>
            <CardHeader className="p-4 pb-2 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-60">
                    Persistence Config
                  </span>
                </div>
                {mode === 'config' && (
                  <button onClick={() => setMode('info')} className="opacity-40 hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              {mode === 'info' && (
                <CardTitle className="text-[14px] font-display font-medium tracking-tight mt-1">
                  Runtime Optimization
                </CardTitle>
              )}
            </CardHeader>

            <CardContent className="p-4 pt-1 space-y-4">
              {mode === 'info' ? (
                <div className="space-y-4">
                  <p className="font-sans text-[12.5px] leading-relaxed text-muted-foreground">
                    Maintaining stable workspace state via predictive media caching and persistent session tokens for low-latency interactions.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => saveAndClose({ essential: true, assets: true, analytics: true })}
                      className="flex-1 h-9 rounded-lg bg-[hsl(var(--crimson))] text-white hover:bg-[hsl(var(--crimson)/0.9)] text-[11.5px] font-bold font-mono border-none"
                    >
                      ACCEPT ALL
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setMode('config')}
                      className="h-9 w-9 p-0 rounded-lg border-muted-foreground/20 hover:bg-muted/5"
                    >
                      <Cog className="w-4 h-4 opacity-60" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="space-y-3.5">
                    {/* Essential */}
                    <div className="flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-3">
                        <Zap className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                        <Label className="font-mono text-[10px] uppercase tracking-wider">Core Runtime</Label>
                      </div>
                      <span className="font-mono text-[8.5px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-muted-foreground/10 uppercase tracking-tighter">Locked</span>
                    </div>

                    {/* Assets */}
                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setPrefs(p => ({ ...p, assets: !p.assets }))}>
                      <div className="flex items-center gap-3">
                        <Zap className={`w-3.5 h-3.5 transition-colors ${prefs.assets ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        <Label className={`font-mono text-[10px] uppercase tracking-wider cursor-pointer ${prefs.assets ? 'opacity-100' : 'opacity-40'}`}>Media Assets</Label>
                      </div>
                      <Switch 
                        checked={prefs.assets} 
                        onCheckedChange={(v) => setPrefs(p => ({ ...p, assets: v }))} 
                        className="scale-90 data-[state=checked]:bg-[hsl(var(--crimson))]"
                      />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}>
                      <div className="flex items-center gap-3">
                        <Activity className={`w-3.5 h-3.5 transition-colors ${prefs.analytics ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        <Label className={`font-mono text-[10px] uppercase tracking-wider cursor-pointer ${prefs.analytics ? 'opacity-100' : 'opacity-40'}`}>Telemetry</Label>
                      </div>
                      <Switch 
                        checked={prefs.analytics} 
                        onCheckedChange={(v) => setPrefs(p => ({ ...p, analytics: v }))} 
                        className="scale-90 data-[state=checked]:bg-[hsl(var(--crimson))]"
                      />
                    </div>
                  </div>

                  <Button 
                    variant="default"
                    onClick={() => saveAndClose(prefs)}
                    className="w-full h-9 rounded-lg bg-[hsl(var(--crimson))] text-white hover:bg-[hsl(var(--crimson)/0.9)] text-[11.5px] font-bold font-mono border-none"
                  >
                    DEPLOY POLICY
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
