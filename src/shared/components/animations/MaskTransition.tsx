import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import maskImg from '@shared/assets/cyberpunk-design-mask.png';
import { useTheme } from '@app/providers/theme-provider';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const STATS = [
  { value: '40+', label: 'Systems Built' },
  { value: '99.97%', label: 'Uptime SLA' },
  { value: '<48ms', label: 'P99 Latency' },
  { value: '2.8K', label: 'Deployments' },
];

const PROFILE_LINES = [
  { text: '$ whoami', type: 'cmd' as const },
  { text: 'senior software engineer', type: 'out' as const },
  { text: '$ stack --primary', type: 'cmd' as const },
  { text: 'react · node · go · aws · k8s', type: 'out' as const },
  { text: '$ echo $PHILOSOPHY', type: 'cmd' as const },
  { text: '"ship fast. ship right. sleep well."', type: 'out' as const },
];

const STATUS_LINES = [
  { text: '$ sys status', type: 'cmd' as const },
  { text: 'all systems operational ✓', type: 'out' as const },
  { text: '$ uptime --sla', type: 'cmd' as const },
  { text: '99.97% — 365 days tracked', type: 'out' as const },
  { text: '$ echo $AVAILABILITY', type: 'cmd' as const },
  { text: 'OPEN_TO_OPPORTUNITIES=true', type: 'out' as const },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════════════════════════════
   TERMINAL PANEL
   ═══════════════════════════════════════════════════════════════════════════════ */

const TerminalPanel = ({
  isDark,
  lines,
  side,
  title,
}: {
  isDark: boolean;
  lines: { text: string; type: 'cmd' | 'out' }[];
  side: 'left' | 'right';
  title: string;
}) => {
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';
  const bg = isDark ? 'rgba(12,12,12,' : 'rgba(255,255,255,';

  return (
    <div
      style={{
        position: 'absolute',
        [side]: 'clamp(20px, 4vw, 60px)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 16,
        maxWidth: 'clamp(200px, 22vw, 280px)',
        pointerEvents: 'none',
        background: `${bg}0.82)`,
        border: `1px solid ${ac}0.08)`,
        borderRadius: '10px',
        padding: 'clamp(12px, 1.8vw, 20px)',
        boxShadow: isDark
          ? `0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 ${ac}0.05)`
          : `0 12px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          paddingBottom: '10px',
          borderBottom: `1px solid ${ac}0.07)`,
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0.35, 0.2, 0.12].map((op, i) => (
            <div
              key={i}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: `${ac}${op})`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            marginLeft: '4px',
            fontSize: '0.44rem',
            fontFamily: "'DM Mono', monospace",
            color: `${ac}0.4)`,
            letterSpacing: '0.12em',
          }}
        >
          {title}
        </span>
      </div>

      {/* Lines */}
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 'clamp(0.42rem, 0.65vw, 0.54rem)',
            lineHeight: 2,
            color: line.type === 'cmd' ? `${ac}0.6)` : `${tx}0.38)`,
            letterSpacing: '0.02em',
          }}
        >
          {line.text}
        </div>
      ))}

      {/* Blinking cursor. CSS-only. No JS animation here. */}
      <div
        style={{
          width: '6px',
          height: '12px',
          background: `${ac}0.4)`,
          marginTop: '6px',
          borderRadius: '1px',
          animation: 'yakaTermCursor 1.1s step-end infinite',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   STAT ROW
   ═══════════════════════════════════════════════════════════════════════════════ */

const StatRow = ({ isDark }: { isDark: boolean }) => {
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';
  const bg = isDark ? 'rgba(12,12,12,' : 'rgba(255,255,255,';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'clamp(28px, 5vh, 60px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 16,
        display: 'flex',
        gap: 'clamp(8px, 2vw, 20px)',
        pointerEvents: 'none',
      }}
    >
      {STATS.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: `${bg}0.82)`,
            border: `1px solid ${ac}0.06)`,
            borderRadius: '8px',
            padding: 'clamp(8px, 1.2vw, 14px) clamp(12px, 1.6vw, 20px)',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.25)'
              : '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(0.9rem, 1.6vw, 1.3rem)',
              fontWeight: 800,
              color: `${tx}0.85)`,
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 'clamp(0.34rem, 0.5vw, 0.42rem)',
              color: `${ac}0.4)`,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   AMBIENT RINGS  —  pure SVG, no JS animation, no willChange
   ═══════════════════════════════════════════════════════════════════════════════ */

const AmbientRings = ({ isDark }: { isDark: boolean }) => {
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';

  return (
    <svg
      viewBox="-320 -320 640 640"
      style={{
        position: 'absolute',
        width: 'clamp(420px, 58vw, 720px)',
        height: 'clamp(420px, 58vw, 720px)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        overflow: 'visible',
        opacity: 0.9,
      }}
    >
      {/* Slow CSS rotation baked in — one layer, no JS */}
      <g style={{ animation: 'yakaRingRotate 40s linear infinite', transformOrigin: '0 0' }}>
        {[90, 150, 220, 295].map((r, i) => (
          <circle
            key={r}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke={`${ac}${0.05 - i * 0.008})`}
            strokeWidth={0.8}
            strokeDasharray={`${4 + i * 5} ${30 + i * 18}`}
          />
        ))}
      </g>
      {/* Static cross-hairs */}
      {[0, 45, 90, 135].map((angle) => (
        <line
          key={angle}
          x1={Math.cos((angle * Math.PI) / 180) * 50}
          y1={Math.sin((angle * Math.PI) / 180) * 50}
          x2={Math.cos((angle * Math.PI) / 180) * 310}
          y2={Math.sin((angle * Math.PI) / 180) * 310}
          stroke={`${ac}0.018)`}
          strokeWidth="0.5"
          strokeDasharray="1 60"
        />
      ))}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

const MaskTransition = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Individual parallax layer refs
  const gridRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const maskInnerRef = useRef<HTMLDivElement>(null); // mouse-tilt target only
  const titleRef = useRef<HTMLDivElement>(null);
  const termLRef = useRef<HTMLDivElement>(null);
  const termRRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';

  /* ─── Mouse tilt (single rAF, no React state) ─── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 22;
      targetY = (e.clientY / window.innerHeight - 0.5) * 14;
    };

    const tick = () => {
      // Lerp for smooth damping — no GSAP needed
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (maskInnerRef.current) {
        maskInnerRef.current.style.transform = `translate3d(${currentX}px,${currentY}px,0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ─── Scroll parallax — ONE timeline, ONE ScrollTrigger ─── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const st = {
        trigger: outerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      };

      /*
       * Parallax depths (all transform-only, GPU-accelerated):
       *   grid        0 → +18vh  (scrolls down. slowest, creates depth illusion)
       *   rings       0 → -8vh   (drifts up gently + fades)
       *   mask        0 → -22vh  (main subject, mid speed)
       *   title       0 → -30vh  (slightly faster than mask)
       *   termL/R     0 → -40vh  (foreground, fastest)
       *   stats       0 → -44vh  (furthest foreground)
       *
       * Opacity: handled here too so there is only ONE timeline per element.
       */

      gsap.fromTo(gridRef.current,
        { y: 0 },
        { y: '18vh', ease: 'none', scrollTrigger: st }
      );

      gsap.fromTo(ringsRef.current,
        { y: 0, opacity: 0.9 },
        { y: '-8vh', opacity: 0, ease: 'none', scrollTrigger: st }
      );

      // Mask: fade in over first 40%, hold, fade out last 40%
      gsap.fromTo(maskWrapRef.current,
        { y: '10vh', opacity: 0, scale: 0.92 },
        {
          y: '-22vh',
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            ...st,
            scrub: 1.2,
            onUpdate: (self) => {
              if (!maskWrapRef.current) return;
              const p = self.progress;
              // Fade in 0→0.3, full 0.3→0.7, fade out 0.7→1
              const op =
                p < 0.3 ? p / 0.3 :
                p < 0.7 ? 1 :
                (1 - p) / 0.3;
              maskWrapRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            },
          },
        }
      );

      // Title: same fade envelope, slightly faster y travel
      gsap.fromTo(titleRef.current,
        { y: '18vh', opacity: 0 },
        {
          y: '-30vh',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            ...st,
            onUpdate: (self) => {
              if (!titleRef.current) return;
              const p = self.progress;
              const op = p < 0.25 ? p / 0.25 : p < 0.75 ? 1 : (1 - p) / 0.25;
              titleRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            },
          },
        }
      );

      // Terminals. Left leads slightly
      gsap.fromTo(termLRef.current,
        { y: '30vh', opacity: 0 },
        {
          y: '-40vh',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            ...st,
            onUpdate: (self) => {
              if (!termLRef.current) return;
              const p = self.progress;
              const op = p < 0.2 ? p / 0.2 : p < 0.8 ? 1 : (1 - p) / 0.2;
              termLRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            },
          },
        }
      );

      gsap.fromTo(termRRef.current,
        { y: '38vh', opacity: 0 },
        {
          y: '-40vh',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            ...st,
            onUpdate: (self) => {
              if (!termRRef.current) return;
              const p = self.progress;
              const op = p < 0.22 ? p / 0.22 : p < 0.78 ? 1 : (1 - p) / 0.22;
              termRRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            },
          },
        }
      );

      gsap.fromTo(statsRef.current,
        { y: '44vh', opacity: 0 },
        {
          y: '-44vh',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            ...st,
            onUpdate: (self) => {
              if (!statsRef.current) return;
              const p = self.progress;
              const op = p < 0.25 ? p / 0.25 : p < 0.75 ? 1 : (1 - p) / 0.25;
              statsRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            },
          },
        }
      );
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Inject CSS-only keyframes once */}
      <style>{`
        @keyframes yakaTermCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes yakaRingRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div ref={outerRef} style={{ height: '300vh', position: 'relative' }}>
        <div
          ref={stickyRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'hsl(var(--background))',
          }}
        >

          {/* ── Layer 0: Subtle grid (deepest, scrolls down) ── */}
          <div
            ref={gridRef}
            style={{
              position: 'absolute',
              inset: '-20%',
              zIndex: 0,
              backgroundImage: isDark
                ? 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)'
                : 'linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              // No willChange here — it just translates slowly
            }}
          />

          {/* ── Vignette (static, no animation) ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
              background: isDark
                ? 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, hsl(var(--background)) 100%)'
                : 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, hsl(var(--background)) 100%)',
            }}
          />

          {/* ── Layer 1: Ambient rings (CSS rotation only, scrolls up) ── */}
          <div
            ref={ringsRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform, opacity',
            }}
          >
            <AmbientRings isDark={isDark} />
          </div>

          {/* ── Layer 2: The mask (centerpiece) ── */}
          <div
            ref={maskWrapRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            {/* Mouse tilt only on this inner div */}
            <div ref={maskInnerRef} style={{ position: 'relative' }}>
              <img
                src={maskImg}
                alt="Gara Yaka"
                style={{
                  width: 'clamp(240px, 34vw, 460px)',
                  height: 'auto',
                  pointerEvents: 'none',
                  display: 'block',
                }}
              />
              {/* Aura — no willChange, no animation, pure CSS */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-50%',
                  zIndex: -1,
                  borderRadius: '50%',
                  background: isDark
                    ? 'radial-gradient(circle, rgba(232,168,32,0.05) 0%, transparent 65%)'
                    : 'radial-gradient(circle, rgba(192,39,45,0.04) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* ── Layer 3: Title ── */}
          <div
            ref={titleRef}
            style={{
              position: 'absolute',
              bottom: 'clamp(10vh, 15vh, 150px)',
              left: 0,
              right: 0,
              zIndex: 15,
              textAlign: 'center',
              pointerEvents: 'none',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)',
                fontWeight: 900,
                fontFamily: "'Playfair Display', serif",
                color: `${tx}1)`,
                letterSpacing: '0.15em',
              }}
            >
              GARA YAKA
            </div>
            <div
              style={{
                fontSize: 'clamp(0.58rem, 1.1vw, 0.82rem)',
                fontFamily: "'DM Mono', monospace",
                color: `${ac}0.65)`,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginTop: '12px',
              }}
            >
              PRECISION ENGINEERING
            </div>
          </div>

          {/* ── Layer 4: Terminal L ── */}
          <div
            ref={termLRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <TerminalPanel isDark={isDark} title="SYSTEM.INIT" side="left" lines={PROFILE_LINES} />
          </div>

          {/* ── Layer 4: Terminal R ── */}
          <div
            ref={termRRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <TerminalPanel isDark={isDark} title="STATUS.LOG" side="right" lines={STATUS_LINES} />
          </div>

          {/* ── Layer 4: Stats ── */}
          <div
            ref={statsRef}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <StatRow isDark={isDark} />
          </div>

          {/* ── Top + bottom fades (static, no animation) ── */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '22vh',
              background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
              zIndex: 35,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '22vh',
              background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
              zIndex: 35,
              pointerEvents: 'none',
            }}
          />

        </div>
      </div>
    </>
  );
};

export default MaskTransition;