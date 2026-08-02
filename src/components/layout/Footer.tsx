//src/components/layout/Footer.tsx

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import { QRCode } from '@components/ui/qr-code';
import logoMask from '@/assets/images/mask.png';

const CRIMSON = '#7C5CFC';
const GOLD    = '#00D4FF';
const YEAR    = new Date().getFullYear();

const NAV_LINKS = [
  { label: 'Home',       href: '/#home' },
  { label: 'About',      href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects',   href: '/#projects' },
  { label: 'Skills',     href: '/#skills' },
  { label: 'Contact',    href: '/#contact' },
];

const SOCIAL_LINKS: { label: string; href: string; icon: JSX.Element }[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/YOUR_USERNAME',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/YOUR_USERNAME',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/YOUR_USERNAME',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
      </svg>
    ),
  },
];

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
  return parseInt(
    new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour12: false, hour: '2-digit' })
  );
}

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const footerRef = useRef<HTMLElement>(null);
  const [hov, setHov] = useState<string | null>(null);

  const bg       = 'hsl(var(--background))';
  const t1       = 'hsl(var(--foreground))';
  const t2       = isDark ? 'hsl(var(--foreground) / 0.5)' : 'hsl(var(--foreground) / 0.82)';
  const t3       = isDark ? 'hsl(var(--foreground) / 0.35)' : 'hsl(var(--foreground) / 0.65)';
  const t4       = isDark ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--foreground) / 0.45)';
  const hairline = 'hsl(var(--foreground) / 0.08)';
  const iconBdr  = 'hsl(var(--foreground) / 0.12)';

  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] });
  const glowY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const colHead: React.CSSProperties = {
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: GOLD,
    marginBottom: '10px',
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

  const colomboHour = getColomboHour();
  const isAvailable = colomboHour >= 8 && colomboHour < 23;

  return (
    <footer
      ref={footerRef}
      className="relative w-full h-dvh overflow-hidden flex flex-col justify-between"
      style={{ background: bg }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          y: glowY,
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#7C5CFC]/10 via-[#00D4FF]/10 to-transparent blur-[80px]" />
      </motion.div>

      <div
        className="absolute bottom-0 right-0 w-[40vw] h-[40vw] -mr-[10vw] -mb-[10vw] opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${CRIMSON} 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      <div className="flex-1 min-h-0 overflow-hidden" style={{ padding: 'clamp(20px, 4vw, 60px) clamp(16px, 5vw, 60px) 0' }}>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="footer-grid-container h-full"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}
        >
          <div style={{ flex: '1 1 220px', minWidth: '200px' }} className="footer-col">
            <div className="mb-4 flex items-center gap-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden">
                <img src={logoMask} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: t1, letterSpacing: '-0.02em' }}>
                Gayan Kavinda
              </span>
            </div>
            <p style={{ fontSize: '12px', color: t2, maxWidth: '210px', marginBottom: '16px', lineHeight: '1.5' }}>
              Architecting precision-driven digital systems. heritage meets modern engineering.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: `1px solid ${iconBdr}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: t2,
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

          <div
            style={{ padding: '0 28px', borderRight: `1px solid ${hairline}`, borderLeft: `1px solid ${hairline}` }}
            className="footer-col footer-nav-col"
          >
            <span style={colHead}>Navigation</span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} style={linkStyle(l.label)} onMouseEnter={() => setHov(l.label)} onMouseLeave={() => setHov(null)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: '1 1 260px', minWidth: '220px' }} className="footer-col footer-vision-col">
            <span style={colHead}>Vision</span>
            <p style={{ fontSize: '12px', color: t2, marginBottom: '14px', lineHeight: '1.5' }}>
              Ready to architect the future. let's discuss your next breakthrough.
            </p>

            <div className="flex flex-col gap-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '10px', color: t4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Direct Line
                </span>
                <a
                  href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'hello@example.com'}`}
                  style={{ ...linkStyle('mail'), color: t1, fontWeight: 600, fontSize: '13px' }}
                >
                  {import.meta.env.VITE_CONTACT_EMAIL || 'hello@example.com'}
                </a>
              </div>

              <div className="footer-qr">
                <QRCode value="https://gayankav.github.io" size={56} />
              </div>

              <div className="pt-3 border-t" style={{ borderColor: hairline }}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#00D4FF]">Local Time</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-base font-bold text-foreground tabular-nums">{useColomboTime()}</span>
                      <span className="font-mono text-[9px] text-foreground/40">{useColomboDate()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.15)', animation: 'greenPulse 2s infinite' }}
                      />
                      <p className="font-sans text-[11px] text-foreground/60 leading-tight">
                        {import.meta.env.VITE_CONTACT_STATUS || 'Employed, open to the right thing.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pl-5">
                      <span
                        className="inline-flex items-center gap-1.5 font-mono text-[8px] px-2 py-0.5 rounded-full"
                        style={{
                          background: isAvailable ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
                          color: isAvailable ? '#22c55e' : '#f59e0b',
                          border: isAvailable ? '1px solid rgba(34,197,94,0.22)' : '1px solid rgba(245,158,11,0.22)',
                        }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ background: isAvailable ? '#22c55e' : '#f59e0b' }} />
                        {isAvailable ? 'At my desk' : 'Asleep, try tomorrow'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 footer-openTo">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/30">Open To</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(import.meta.env.VITE_CONTACT_OPEN_TO || 'Full-time, Contract, Consulting').split(',').map((role: string) => (
                        <span
                          key={role}
                          className="font-sans text-[9px] px-2 py-0.5 rounded-md border"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                            color: t2,
                            borderColor: hairline,
                          }}
                        >
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

      <div style={{ width: '100%', flexShrink: 0 }} className="footer-bottom-block">
        <div className="footer-watermark" style={{ width: '100%', overflow: 'hidden', userSelect: 'none', pointerEvents: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1440 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
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
                <rect x="0" y="0" width="1440" height="100" fill="url(#wm-mask)" />
              </mask>
              <linearGradient id="wm-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CRIMSON} stopOpacity={isDark ? 0.3 : 0.2} />
                <stop offset="50%" stopColor={GOLD} stopOpacity={isDark ? 0.25 : 0.15} />
                <stop offset="100%" stopColor={CRIMSON} stopOpacity={isDark ? 0.3 : 0.2} />
              </linearGradient>
            </defs>
            <text
              x="720"
              y="80"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fontSize="92"
              letterSpacing="-2"
              fill="url(#wm-brand)"
              stroke="url(#wm-stroke)"
              strokeWidth="0.6"
              paintOrder="stroke fill"
              mask="url(#wm-fade-mask)"
              opacity={isDark ? 0.55 : 0.45}
            >
              Gayan Kavinda
            </text>
          </svg>
        </div>

        <div style={{ width: '100%', padding: '0 clamp(16px, 5vw, 60px) 14px' }}>
          <div
            style={{
              borderTop: `1px solid ${hairline}`,
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: t4 }}>
              © {YEAR} Gayan Kavinda. All rights reserved.
            </span>
            <span className="footer-stack-tag" style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: t4 }}>
              React · Framer Motion · TypeScript · R3F
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: t3, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: '9px', textTransform: 'uppercase' }}
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes greenPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
          50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }

        @media (max-width: 1024px) {
          .footer-grid-container {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
            align-content: start;
          }
          .footer-col { border: none !important; padding: 0 !important; }
          .footer-vision-col { grid-column: 1 / -1; }
        }

        @media (max-width: 640px) {
          .footer-grid-container {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            overflow-y: auto;
          }
          .footer-nav-col { display: none !important; }
          .footer-qr { display: none !important; }
          .footer-watermark { display: none !important; }
          .footer-stack-tag { display: none !important; }
          .footer-openTo { display: none !important; }
          .footer-col p { margin-bottom: 10px !important; }
        }

        @media (max-width: 380px) {
          .footer-bottom-block > div:last-child { padding-bottom: 10px !important; }
        }
      `}</style>

      <div
        className="absolute inset-x-0 bottom-0 h-[18vh] pointer-events-none z-30"
        style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }}
      />
    </footer>
  );
};

export default Footer;