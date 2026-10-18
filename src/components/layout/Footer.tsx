//src/components/layout/Footer.tsx

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import logoMask from '@/assets/images/mask.png';
const CRIMSON = 'hsl(var(--primary))';
  const GOLD    = 'hsl(var(--gold))';
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
    href: import.meta.env.VITE_CONTACT_GITHUB || 'https://github.com/GayanKavinda',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: import.meta.env.VITE_CONTACT_LINKEDIN || 'https://linkedin.com/in/yourprofile',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: import.meta.env.VITE_CONTACT_X || 'https://twitter.com',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
      </svg>
    ),
  },
];

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

  const colHeadClass = 'font-mono text-[10px] uppercase tracking-widest text-foreground/40';

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
      className="relative w-full overflow-hidden flex flex-col justify-between"
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-primary/10 via-gold/10 to-transparent blur-[80px]" />
      </motion.div>

      <div
        className="absolute bottom-0 right-0 w-[40vw] h-[40vw] -mr-[10vw] -mb-[10vw] opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${CRIMSON} 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 pt-14 pb-8 flex flex-col justify-between min-h-full">
        {/* ── Top Header / Call to Action ── */}
        <div className="pb-10 sm:pb-14 border-b border-foreground/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80 mb-3 block">
                ✦ Get In Touch
              </span>
              <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.1]">
                Ready to architect the{' '}
                <span className="font-playfair italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  future
                </span>
                ?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-foreground/60 max-w-lg leading-relaxed">
                Open for senior frontend architectures, modern interactive web experiences, and scalable digital solutions.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <a
                href="/#contact"
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, hsl(38 65% 32%) 100%)`,
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                  boxShadow: isDark ? '0 4px 20px rgba(217,119,6,0.4)' : '0 6px 20px rgba(217,119,6,0.35)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span>Start a conversation</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Content Grid (Brand, Links, Vision) ── */}
        <div className="py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Brand & Bio */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shadow-sm"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${hairline}`,
                  }}
                >
                  <img src={logoMask} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-jakarta text-lg font-bold tracking-tight text-foreground block">
                    Gayan Kavinda
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40 block">
                    Software Engineer & Architect
                  </span>
                </div>
              </div>

              <p className="text-sm text-foreground/60 leading-relaxed max-w-sm mb-6">
                Architecting precision-driven digital systems where cultural heritage and authentic craftsmanship meet modern software engineering.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    border: `1px solid ${iconBdr}`,
                    color: t2,
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = t1;
                    e.currentTarget.style.borderColor = CRIMSON;
                    e.currentTarget.style.background = isDark ? 'rgba(124,92,252,0.1)' : 'rgba(124,92,252,0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = t2;
                    e.currentTarget.style.borderColor = iconBdr;
                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <span className={colHeadClass}>Navigation</span>
            <ul className="mt-4 space-y-2.5 list-none p-0 m-0">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={linkStyle(l.label)}
                    onMouseEnter={() => setHov(l.label)}
                    onMouseLeave={() => setHov(null)}
                    className="hover:translate-x-1 transition-transform"
                  >
                    <span className="text-primary/60 font-mono text-xs">/</span>
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vision & Ethics */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <span className={colHeadClass}>Philosophy</span>
              <p className="mt-4 text-sm text-foreground/70 leading-relaxed font-sans">
                "Long-term thinking over short-term hacks. Systems and experiences designed with enduring resilience, intentional aesthetics, and precision performance."
              </p>
            </div>

            <div
              className="mt-6 p-4 rounded-xl border backdrop-blur-md"
              style={{
                borderColor: hairline,
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 font-semibold">
                  Status: Open for Opportunities
                </span>
              </div>
              <p className="text-xs text-foreground/60 leading-normal">
                Based in Sri Lanka (UTC+05:30), collaborating with teams worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* ── Brand Watermark (contained, non-overlapping) ── */}
        <div className="w-full overflow-hidden select-none pointer-events-none my-2 sm:my-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 1440 85"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="block opacity-40 dark:opacity-35"
          >
            <defs>
              <linearGradient id="wm-brand" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CRIMSON} />
                <stop offset="50%" stopColor={GOLD} />
                <stop offset="100%" stopColor={CRIMSON} />
              </linearGradient>
              <linearGradient id="wm-mask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="60%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="wm-fade-mask">
                <rect x="0" y="0" width="1440" height="85" fill="url(#wm-mask)" />
              </mask>
            </defs>
            <text
              x="720"
              y="68"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fontSize="84"
              letterSpacing="-2"
              fill="url(#wm-brand)"
              mask="url(#wm-fade-mask)"
            >
              Gayan Kavinda
            </text>
          </svg>
        </div>

        {/* ── Bottom Sub-footer Bar ── */}
        <div className="pt-6 border-t border-foreground/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-foreground/50 text-center sm:text-left">
            © {YEAR} Gayan Kavinda. All rights reserved.
          </span>

          <span className="hidden md:inline-block font-mono text-[11px] text-foreground/40">

          </span>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
          >
            <span>Back to top</span>
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;