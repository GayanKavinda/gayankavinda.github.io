//src/components/layout/Footer.tsx

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import maskImg from '@shared/assets/images/mask.png';
import mapDark from '@shared/assets/images/map-dark.webp';
import mapWhite from '@shared/assets/images/map-white.webp';
import { useTheme } from '@app/providers/theme-provider';
import { QRCode } from '@shared/components/ui/qr-code';

gsap.registerPlugin(ScrollTrigger);

// ── Static design tokens ───────────────────────────────────────────────────────
const CRIMSON = '#7C5CFC';
const GOLD    = '#00D4FF';
const YEAR    = new Date().getFullYear();

// ── Data ───────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',       href: '/#home' },
  { label: 'About',      href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects',   href: '/#projects' },
  { label: 'Skills',     href: '/#skills' },
  { label: 'Contact',    href: '/#contact' },
];

const SOCIAL_LINKS = [
  {
    label: 'GitHub', href: 'https://github.com',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>,
  },
  {
    label: 'Twitter', href: 'https://twitter.com',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z"/></svg>,
  },
];

// ── Colombo clock hooks ───────────────────────────────────────────────────────

function useColomboTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Colombo',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 60000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function useColomboDate() {
  const [date, setDate] = useState('');
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleDateString('en-US', {
        timeZone: 'Asia/Colombo',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    setDate(fmt());
    const t = setInterval(() => setDate(fmt()), 60000);
    return () => clearInterval(t);
  }, []);
  return date;
}

function getColomboHour() {
  return parseInt(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour12: false, hour: '2-digit' }));
}

// ── Components ────────────────────────────────────────────────────────────────

const MapThumbnail = ({ isDark }: { isDark: boolean }) => (
  <div 
    className="relative w-[110px] h-[72px] rounded-lg overflow-hidden border group"
    style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
  >
    <img 
      src={isDark ? mapDark : mapWhite} 
      alt="Colombo, Sri Lanka" 
      className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    {/* Animated marker */}
    <div className="absolute left-[55%] top-[45%] -translate-x-1/2 -translate-y-1/2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D4FF]"></span>
      </span>
    </div>
  </div>
);

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const footerRef = useRef<HTMLElement>(null);
  const wmRef = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState<string | null>(null);

  const bg        = isDark ? '#0A0A0A'              : '#FFFFFF';
  const t1        = isDark ? '#F0EEE8'              : '#0C0C0E';
  const t2        = isDark ? 'rgba(240,238,232,.45)' : 'rgba(12,12,14,.50)';
  const t3        = isDark ? 'rgba(240,238,232,.35)' : 'rgba(12,12,14,.45)';
  const t4        = isDark ? 'rgba(240,238,232,.25)' : 'rgba(12,12,14,.35)';
  const hairline  = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)';
  const iconBdr   = isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.12)';

  const colHead: React.CSSProperties = {
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: GOLD,
    marginBottom: '18px',
  };

  const linkStyle = (key: string): React.CSSProperties => ({
    fontSize: '13px',
    color: hov === key ? t1 : t2,
    textDecoration: 'none',
    transition: 'color 160ms',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  });

  return (
    <footer 
      ref={footerRef}
      className="relative w-full border-t overflow-hidden"
      style={{ 
        background: bg,
        borderColor: hairline
      }}
    >
      {/* ── Background decoration ──────────────────────────────────────────────── */}
      <div 
        className="absolute bottom-0 right-0 w-[40vw] h-[40vw] -mr-[10vw] -mb-[10vw] opacity-[0.03] pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${CRIMSON} 0%, transparent 70%)`,
          filter: 'blur(100px)'
        }}
      />

      <div style={{ padding: '100px 60px 60px' }}>
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '60px' }}
          className="footer-grid-container"
        >
          {/* Column 1: Brand */}
          <div style={{ flex: '1 1 280px', minWidth: '240px' }} className="footer-col">
            <div className="mb-8 flex items-center gap-4">
               <img src={maskImg} alt="" style={{ width: '24px', height: '24px', mixBlendMode: isDark ? 'screen' : 'multiply', filter: isDark ? 'brightness(1.5)' : 'none' }} />
               <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: t1, letterSpacing: '-0.02em' }}>Gara Yaka</span>
            </div>
            <p style={{ fontSize: '13px', color: t2, maxWidth: '210px', marginBottom: '24px', lineHeight: '1.6' }}>
              Architecting precision-driven digital systems where heritage meets modern engineering.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SOCIAL_LINKS.map(s => (
                <a 
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${iconBdr}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: t2,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = t1; e.currentTarget.style.borderColor = t1; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t2; e.currentTarget.style.borderColor = iconBdr; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Pages */}
          <div style={{ padding: '0 36px 52px', borderRight: `1px solid ${hairline}` }} className="footer-col">
             <span style={colHead}>Navigation</span>
             <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {NAV_LINKS.map(l => <li key={l.label}><a href={l.href} style={linkStyle(l.label)} onMouseEnter={() => setHov(l.label)} onMouseLeave={() => setHov(null)}>{l.label}</a></li>)}
             </ul>
          </div>

          {/* Column 3: Socials */}
          <div style={{ padding: '0 36px 52px', borderRight: `1px solid ${hairline}` }} className="footer-col">
             <span style={colHead}>Ecosystem</span>
             <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {SOCIAL_LINKS.map(s => <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer" style={linkStyle(s.label)} onMouseEnter={() => setHov(s.label)} onMouseLeave={() => setHov(null)}>{s.label}</a></li>)}
             </ul>
          </div>

          {/* Column 4: Contact */}
          <div style={{ paddingLeft: '46px', paddingBottom: '32px' }} className="footer-col">
             <span style={colHead}>Vision</span>
             <p style={{ fontSize: '13px', color: t2, marginBottom: '24px', lineHeight: '1.6' }}>
               Ready to architect the future? Let's discuss your next breakthrough.
             </p>
             <div className="flex flex-col gap-6">
               <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <QRCode value="https://garayaka.com" size={72} />
                  <MapThumbnail isDark={isDark} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '10px', color: t4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Direct Line</span>
                    <a href="mailto:hello@garayaka.com" style={{ ...linkStyle('mail'), color: t1, fontWeight: 600, fontSize: '14px' }}>hello@garayaka.com</a>
                  </div>
               </div>

                <div className="pt-6 border-t" style={{ borderColor: hairline }}>
                  <div className="flex flex-col gap-4">
                    {/* Time */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#00D4FF]">Local Time</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono text-lg font-bold text-foreground tabular-nums">{useColomboTime()}</span>
                          <span className="font-mono text-[9px] text-foreground/40">{useColomboDate()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <span className="block w-2 h-2 rounded-full" 
                            style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.15)', animation: 'greenPulse 2s infinite' }} />
                        </div>
                        <p className="font-sans text-[11px] text-foreground/60 leading-tight">
                           {import.meta.env.VITE_CONTACT_STATUS || 'Employed. open to the right thing.'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 pl-5">
                        <span
                          className="inline-flex items-center gap-1.5 font-mono text-[8px] px-2 py-0.5 rounded-full"
                          style={{
                            background: getColomboHour() >= 8 && getColomboHour() < 23 ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
                            color: getColomboHour() >= 8 && getColomboHour() < 23 ? '#22c55e' : '#f59e0b',
                            border: getColomboHour() >= 8 && getColomboHour() < 23 ? '1px solid rgba(34,197,94,0.22)' : '1px solid rgba(245,158,11,0.22)',
                          }}>
                          <span className="w-1 h-1 rounded-full" style={{ background: getColomboHour() >= 8 && getColomboHour() < 23 ? '#22c55e' : '#f59e0b' }} />
                          {getColomboHour() >= 8 && getColomboHour() < 23 ? 'At my desk' : 'Asleep — try tomorrow'}
                        </span>
                      </div>
                    </div>

                    {/* Open To */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/30">Open To</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(import.meta.env.VITE_CONTACT_OPEN_TO || 'Full-time, Contract, Consulting').split(',').map((role: string) => (
                          <span key={role}
                            className="font-sans text-[9px] px-2 py-0.5 rounded-md border"
                            style={{ 
                              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 
                              color: t2,
                              borderColor: hairline
                            }}>
                            {role.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ width: '100%', flexShrink: 0 }}
      >
        <div ref={wmRef} style={{ width: '100%', overflow: 'hidden', userSelect: 'none', pointerEvents: 'none', marginBottom: '4px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1440 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="wm-brand" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CRIMSON} />
                <stop offset="50%" stopColor={GOLD} />
                <stop offset="100%" stopColor={CRIMSON} />
              </linearGradient>
              <linearGradient id="wm-mask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="45%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="wm-fade-mask">
                <rect x="0" y="0" width="1440" height="180" fill="url(#wm-mask)" />
              </mask>
              <linearGradient id="wm-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CRIMSON} stopOpacity={isDark ? 0.3 : 0.2} />
                <stop offset="50%" stopColor={GOLD} stopOpacity={isDark ? 0.25 : 0.15} />
                <stop offset="100%" stopColor={CRIMSON} stopOpacity={isDark ? 0.3 : 0.2} />
              </linearGradient>
            </defs>
            <text x="720" y="148" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="168" letterSpacing="-4" fill="url(#wm-brand)" stroke="url(#wm-stroke)" strokeWidth="0.8" paintOrder="stroke fill" mask="url(#wm-fade-mask)" opacity={isDark ? 0.55 : 0.45}>
              GaraYaka
            </text>
          </svg>
        </div>
        <div style={{ width: '100%', padding: '0 60px 28px' }}>
          <div style={{ borderTop: `1px solid ${hairline}`, paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
             <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', color: t4 }}>© {YEAR} Gara Yaka. All rights reserved.</span>
             <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', color: t4 }}>React · GSAP · TypeScript · D3</span>
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', color: t3, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: '9.5px', textTransform: 'uppercase' }}>Back to top</button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes greenPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
          50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @media (max-width: 1024px) {
          .footer-grid-container {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .footer-col {
            border-right: none !important;
            padding: 0 !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid-container {
            grid-template-columns: 1fr !important;
          }
          .footer-col {
            padding: 0 !important;
          }
          footer > div:first-of-type {
            padding: 60px 40px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
