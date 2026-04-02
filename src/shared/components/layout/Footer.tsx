//src/components/layout/Footer.tsx

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import maskImg from '@shared/assets/mask.png';
import { useTheme } from '@app/providers/theme-provider';
import { QRCode } from '@shared/components/ui/qr-code';

gsap.registerPlugin(ScrollTrigger);

// ── Static design tokens ───────────────────────────────────────────────────────
const CRIMSON = '#C41E3A';
const GOLD    = '#D4891A';
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
  {
    label: 'Dribbble', href: 'https://dribbble.com',
    icon: <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8c4.408 0 8-3.584 8-8s-3.592-8-8-8zm5.284 3.688a6.802 6.802 0 011.545 4.251c-.226-.043-2.482-.503-4.755-.217-.052-.112-.096-.234-.148-.355-.139-.33-.295-.668-.451-.99 2.516-1.023 3.662-2.498 3.81-2.69zM8 1.18c1.735 0 3.323.65 4.53 1.718-.122.174-1.155 1.553-3.584 2.464-1.12-2.056-2.36-3.74-2.551-4A6.95 6.95 0 018 1.18zm-2.907.642A43.123 43.123 0 017.627 5.77c-3.193.85-6.013.833-6.317.833a6.865 6.865 0 013.783-4.78zM1.163 8.01V7.8c.295.01 3.61.053 7.02-.971.196.381.381.772.555 1.162l-.27.078c-3.54 1.137-5.42 4.24-5.576 4.504A6.824 6.824 0 011.163 8.01zm2.838 5.532c.104-.17 1.49-2.858 5.262-4.174.018-.008.035-.008.053-.017.94 2.442 1.329 4.49 1.433 5.073a6.84 6.84 0 01-6.748-.882zm8.017.654a28.09 28.09 0 00-1.329-4.816c2.143-.347 4.023.226 4.252.296a6.842 6.842 0 01-2.923 4.52z"/></svg>,
  },
];

// ── Footer component ───────────────────────────────────────────────────────────
const Footer = () => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const footerRef = useRef<HTMLElement>(null);
  const wmRef     = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState<string | null>(null);

  // ── Theme tokens: pure white vs pure near-black ──────────────────────────────
  //
  // LIGHT: pure #FFFFFF background. All text is dark ink on white.
  //   t1 = near-black primary text       (#0C0C0E)
  //   t2 = mid-grey secondary text
  //   t3 = faint tertiary / back-to-top
  //   t4 = very faint micro text (stack / copyright)
  //   hairline = thin separator lines
  //   iconBdr  = icon circle borders
  //   badgeBg  = pill background
  //   wmColor  = watermark text: dark ink at low opacity, NO gradient
  //
  // DARK: pure #0A0A0A background. All text is white ink on black.
  //   Same slots, inverted.

  const bg        = isDark ? '#0A0A0A'              : '#FFFFFF';
  const t1        = isDark ? '#F0EEE8'              : '#0C0C0E';
  const t2        = isDark ? 'rgba(240,238,232,.45)' : 'rgba(12,12,14,.50)';
  const t3        = isDark ? 'rgba(240,238,232,.35)' : 'rgba(12,12,14,.45)';
  const t4        = isDark ? 'rgba(240,238,232,.25)' : 'rgba(12,12,14,.35)';
  const hairline  = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)';
  const iconBdr   = isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.12)';
  const badgeBg   = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)';

  // ── Watermark: pure solid ghost, NO gradient ─────────────────────────────────
  // Dark mode:  white text at low alpha, fine white stroke.
  // Light mode: black text at low alpha, fine black stroke.
  // Result: a clean outlined ghost letterform, equally readable in both themes.

  // ── GSAP animations ──────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gy-fade', { y: 26, opacity: 0 }, {
        y: 0, opacity: 1,
        stagger: 0.055,
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          once: true,
        },
      });
      if (wmRef.current) {
        gsap.fromTo(wmRef.current, { y: 14 }, {
          y: -14, ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    }, footerRef);
    return () => ctx.revert();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const linkStyle = (key: string): React.CSSProperties => ({
    fontSize: '13px',
    color: hov === key ? t1 : t2,
    textDecoration: 'none',
    transition: 'color 160ms',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  });

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

  return (
    <footer
      ref={footerRef}
      style={{
        background: bg,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >


      {/* ── Main content area (Centered) ─────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        padding: '80px 80px 40px',
      }}>

        {/* ── 4-column grid with hairline vertical dividers ─────────────────── */}
        <div
          className="gy-fade"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(280px,1.4fr) 1px minmax(140px,1fr) 1px minmax(140px,1fr) 1px minmax(240px,1.2fr)',
            width: '100%',
          }}
        >

          {/* ── Brand ───────────────────────────────────────────────────────── */}
          <div style={{ paddingRight: '36px', paddingBottom: '52px' }}>

            {/* Logo row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px' }}>
              <img
                src={maskImg}
                alt=""
                style={{
                  width: '24px', height: '24px',
                  mixBlendMode: isDark ? 'screen' : 'multiply',
                  filter: isDark ? 'brightness(2)' : 'none',
                }}
              />
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '19px', fontWeight: 700,
                color: t1, letterSpacing: '-0.02em', lineHeight: 1,
              }}>
                Gara Yaka
              </span>
            </div>

            {/* Tagline */}
            <p style={{
              fontSize: '13px', lineHeight: 1.78,
              color: t2, maxWidth: '210px', marginBottom: '20px',
            }}>
              Crafting purposeful digital experiences — where tradition meets precision.
            </p>

            {/* Availability badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: badgeBg,
              border: `1px solid ${hairline}`,
              borderRadius: '999px', padding: '5px 13px', marginBottom: '22px',
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#22c55e', flexShrink: 0,
                animation: 'gyPulse 2.2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '9px', letterSpacing: '0.14em',
                textTransform: 'uppercase' as const, color: t2,
              }}>
                Available for work
              </span>
            </div>

            {/* Social icon row */}
            <div style={{ display: 'flex', gap: '7px' }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    border: `1px solid ${hov === `si-${s.label}` ? `${CRIMSON}60` : iconBdr}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: hov === `si-${s.label}` ? CRIMSON : t2,
                    transition: 'all 180ms',
                    transform: hov === `si-${s.label}` ? 'translateY(-2px)' : 'none',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={() => setHov(`si-${s.label}`)}
                  onMouseLeave={() => setHov(null)}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ background: hairline }} />

          {/* ── Pages ───────────────────────────────────────────────────────── */}
          <div style={{ padding: '0 26px 52px' }}>
            <span style={colHead}>Pages</span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    style={linkStyle(`nav-${l.label}`)}
                    onMouseEnter={() => setHov(`nav-${l.label}`)}
                    onMouseLeave={() => setHov(null)}
                  >
                    {hov === `nav-${l.label}` && (
                      <span style={{ color: CRIMSON, fontSize: '11px', lineHeight: 1 }}>›</span>
                    )}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div style={{ background: hairline }} />

          {/* ── Socials ─────────────────────────────────────────────────────── */}
          <div style={{ padding: '0 26px 52px' }}>
            <span style={colHead}>Socials</span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={linkStyle(`soc-${s.label}`)}
                    onMouseEnter={() => setHov(`soc-${s.label}`)}
                    onMouseLeave={() => setHov(null)}
                  >
                    {s.label}
                    <svg
                      style={{ opacity: 0.4, flexShrink: 0 }}
                      width="9" height="9" viewBox="0 0 12 12"
                      fill="none" stroke="currentColor"
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div style={{ background: hairline }} />

          {/* ── Connect & Collaborate ───────────────────────────────────────── */}
          <div style={{ paddingLeft: '40px', paddingBottom: '32px' }}>
            <span style={colHead}>Connect & Collaborate</span>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: t2, marginBottom: '20px', maxWidth: '260px' }}>
              Have a visionary project? Let's create something extraordinary together.
            </p>

            {/* QR Code + Email side by side */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
                <div style={{
                  padding: '7px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: isDark
                    ? '0 0 0 1px rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.5)'
                    : '0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)',
                  lineHeight: 0,
                }}>
                  <QRCode 
                    value="https://garayaka.com" 
                    size={100}
                    logo={
                      <img 
                        src={maskImg} 
                        alt="Gara Yaka Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    }
                  />
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '8.5px', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: t3,
                }}>
                  Scan to visit
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: t3 }}>
                  Or reach out directly
                </span>
                <a
                  href="mailto:contact@garayaka.com"
                  style={{ ...linkStyle('mail'), fontSize: '13px', fontWeight: 500, color: t1, wordBreak: 'break-all' }}
                  onMouseEnter={() => setHov('mail')}
                  onMouseLeave={() => setHov(null)}
                >
                  contact@garayaka.com
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ opacity: 0.5, flexShrink: 0 }}>
                    <path d="M1 11L11 1M11 1H4M11 1V8" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CTA button */}
            <a
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: hov === 'cta' ? '#fff' : t1,
                background: hov === 'cta' ? CRIMSON : 'transparent',
                border: `1px solid ${hov === 'cta' ? CRIMSON : hairline}`,
                borderRadius: '6px', padding: '11px 20px',
                textDecoration: 'none', transition: 'all 240ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={() => setHov('cta')}
              onMouseLeave={() => setHov(null)}
            >
              Start a conversation
            </a>
          </div>
        </div>
      </div>

      {/* ── WATERMARK & BOTTOM BAR ────────────────────────────────────────────── */}
      <div style={{ width: '100%', flexShrink: 0 }}>
        {/* SVG Watermark — using portfolio crimson/gold palette */}
<div
  ref={wmRef}
  className="gy-fade"
  style={{
    width: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    pointerEvents: 'none',
    lineHeight: 0,
    marginBottom: '4px',
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 1440 180"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <defs>
      {/* 
        Horizontal gradient: Crimson → Gold (your brand colors)
        Vertical mask gradient: visible top → fade to transparent bottom
      */}

      {/* Brand color horizontal sweep */}
      <linearGradient id="wm-brand" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor={CRIMSON} />
        <stop offset="50%"  stopColor={GOLD} />
        <stop offset="100%" stopColor={CRIMSON} />
      </linearGradient>

      {/* Vertical opacity fade mask */}
      <linearGradient id="wm-mask" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="white" stopOpacity="1" />
        <stop offset="45%"  stopColor="white" stopOpacity="0.6" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>

      {/* Combine: brand colors + vertical fade */}
      <mask id="wm-fade-mask">
        <rect
          x="0" y="0"
          width="1440" height="180"
          fill="url(#wm-mask)"
        />
      </mask>

      {/* Stroke gradient: Crimson → Gold with fade */}
      <linearGradient id="wm-stroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor={CRIMSON} stopOpacity={isDark ? 0.3 : 0.2} />
        <stop offset="50%"  stopColor={GOLD}    stopOpacity={isDark ? 0.25 : 0.15} />
        <stop offset="100%" stopColor={CRIMSON} stopOpacity={isDark ? 0.3 : 0.2} />
      </linearGradient>
    </defs>

    <text
      x="720"
      y="148"
      textAnchor="middle"
      fontFamily="'Plus Jakarta Sans', sans-serif"
      fontWeight="900"
      fontSize="168"
      letterSpacing="-4"
      fill="url(#wm-brand)"
      stroke="url(#wm-stroke)"
      strokeWidth="0.8"
      paintOrder="stroke fill"
      mask="url(#wm-fade-mask)"
      opacity={isDark ? 0.55 : 0.45}
    >
      GaraYaka
    </text>
  </svg>
</div>

        {/* Bottom bar container */}
        <div style={{ width: '100%', padding: '0 60px 28px' }}>
          <div
            className="gy-fade"
            style={{
              borderTop: `1px solid ${hairline}`,
              paddingTop: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
          {/* Copyright */}
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '9.5px', letterSpacing: '0.07em', color: t4,
          }}>
            © {YEAR} Gara Yaka. All rights reserved.
          </span>

          {/* Stack */}
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '9.5px', letterSpacing: '0.07em', color: t4,
          }}>
            React · GSAP · TypeScript · D3
          </span>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '9.5px', letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: hov === 'top' ? GOLD : t3,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color 200ms',
            }}
            onMouseEnter={() => setHov('top')}
            onMouseLeave={() => setHov(null)}
          >
            Back to top
            <svg
              style={{
                transform: hov === 'top' ? 'translateY(-2px)' : 'none',
                transition: 'transform 200ms',
              }}
              width="11" height="11" viewBox="0 0 14 14"
              fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

      {/* ── Injected keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes gyPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
          50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        /* Responsive: collapse grid to wrap layout below 960px */
        @media (max-width: 960px) {
          footer > div > div[style*="grid-template-columns"] {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 36px 20px !important;
          }
          footer > div > div[style*="grid-template-columns"] > div {
            flex: 1 1 140px;
          }
          footer > div > div[style*="grid-template-columns"] > div[style*="background"] {
            display: none;  /* hide vertical dividers in wrap mode */
          }
        }
        @media (max-width: 560px) {
          footer > div > div[style*="grid-template-columns"] > div {
            flex: 1 1 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

