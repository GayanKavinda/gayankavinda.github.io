import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import maskImg from '@/assets/cyberpunk-design-mask.png';
import { useTheme } from '@/context/ThemeProvider';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const SKILLS_MARQUEE = [
  'SYSTEMS DESIGN', '·', 'DISTRIBUTED SYSTEMS', '·', 'MICROSERVICES', '·',
  'CLOUD ARCHITECTURE', '·', 'FULL-STACK', '·', 'DEVOPS', '·',
  'API DESIGN', '·', 'SCALABILITY', '·', 'EVENT-DRIVEN', '·', 'KUBERNETES', '·',
];

const TERMINAL_LEFT = [
  { text: '$ whoami', type: 'cmd' as const },
  { text: 'gara_yaka → senior software engineer', type: 'out' as const },
  { text: '$ cat philosophy.md', type: 'cmd' as const },
  { text: '> ship fast. ship right. sleep well.', type: 'out' as const },
  { text: '$ node --stack', type: 'cmd' as const },
  { text: 'react · node · go · aws · k8s', type: 'out' as const },
];

const TERMINAL_RIGHT = [
  { text: '$ sys status --verbose', type: 'cmd' as const },
  { text: 'uptime: 99.97% ████████████░', type: 'out' as const },
  { text: 'latency_p99: <48ms', type: 'out' as const },
  { text: 'deployments: 2,847', type: 'out' as const },
  { text: 'systems_built: 40+', type: 'out' as const },
  { text: '$ echo $STATUS', type: 'cmd' as const },
  { text: 'AVAILABLE_FOR_HIRE=true', type: 'out' as const },
];

const METRICS = [
  { label: 'SYSTEMS', value: '40+', sub: 'architected' },
  { label: 'UPTIME', value: '99.97%', sub: 'sla maintained' },
  { label: 'P99', value: '<48ms', sub: 'response time' },
  { label: 'SHIPPED', value: '2.8K', sub: 'deployments' },
];

const FIRE_PARTICLE_COUNT = 40;
const SPARK_COUNT = 18;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sr = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

/* ═══════════════════════════════════════════════════════════════════════════════
   FIRE SYSTEM — Multi-layered realistic fire
   ═══════════════════════════════════════════════════════════════════════════════ */

const FireColumn = ({
  side,
  isDark,
}: {
  side: 'left' | 'right';
  isDark: boolean;
}) => {
  const baseX = side === 'left' ? 6 : 94;
  const seedOffset = side === 'left' ? 0 : 500;

  // Core fire particles
  const coreParticles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: baseX + (sr(i * 7 + seedOffset) - 0.5) * 3,
    width: 4 + sr(i * 11 + seedOffset) * 12,
    height: 15 + sr(i * 13 + seedOffset) * 35,
    delay: sr(i * 17 + seedOffset) * 1.2,
    duration: 0.6 + sr(i * 19 + seedOffset) * 0.8,
    yStart: 75 + sr(i * 23 + seedOffset) * 10,
    intensity: sr(i * 29 + seedOffset),
  }));

  // Outer glow particles (wider, softer)
  const glowParticles = Array.from({ length: 6 }, (_, i) => ({
    id: i + 100,
    x: baseX + (sr(i * 31 + seedOffset) - 0.5) * 6,
    width: 20 + sr(i * 37 + seedOffset) * 30,
    height: 25 + sr(i * 41 + seedOffset) * 45,
    delay: sr(i * 43 + seedOffset) * 2,
    duration: 1 + sr(i * 47 + seedOffset) * 1.5,
    yStart: 78 + sr(i * 53 + seedOffset) * 8,
  }));

  // Flying sparks
  const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => ({
    id: i + 200,
    x: baseX + (sr(i * 59 + seedOffset) - 0.5) * 5,
    size: 1 + sr(i * 61 + seedOffset) * 2.5,
    delay: sr(i * 67 + seedOffset) * 4,
    duration: 1.5 + sr(i * 71 + seedOffset) * 3,
    drift: (sr(i * 73 + seedOffset) - 0.5) * 120,
    yStart: 72 + sr(i * 79 + seedOffset) * 12,
  }));

  return (
    <div
      className={`fire-column fire-${side}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 8,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Ambient ground glow */}
      <div
        className="fire-ground-glow"
        style={{
          position: 'absolute',
          left: `${baseX}%`,
          bottom: '10%',
          transform: 'translateX(-50%)',
          width: 'clamp(100px, 15vw, 200px)',
          height: '60px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(ellipse, rgba(255,120,20,0.12) 0%, rgba(255,80,10,0.04) 50%, transparent 80%)'
            : 'radial-gradient(ellipse, rgba(192,39,45,0.08) 0%, rgba(200,80,20,0.03) 50%, transparent 80%)',
          filter: 'blur(10px)',
          animation: 'fireGroundPulse 1.5s ease-in-out infinite alternate',
        }}
      />

      {/* Glow particles (outer, soft) */}
      {glowParticles.map((p) => (
        <div
          key={p.id}
          className="fire-glow-particle"
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: `${100 - p.yStart}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            borderRadius: '45% 45% 35% 35%',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 80%, rgba(255,100,10,0.06) 0%, rgba(255,60,0,0.02) 50%, transparent 100%)'
              : 'radial-gradient(ellipse at 50% 80%, rgba(192,39,45,0.04) 0%, transparent 100%)',
            filter: 'blur(8px)',
            animation: `fireGlowRise ${p.duration}s ${p.delay}s ease-out infinite`,
            transform: 'translateX(-50%)',
          }}
        />
      ))}

      {/* Core fire particles */}
      {coreParticles.map((p) => {
        const hue = 15 + p.intensity * 30; // orange to yellow
        return (
          <div
            key={p.id}
            className="fire-core-particle"
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              bottom: `${100 - p.yStart}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              borderRadius: '40% 40% 35% 35% / 60% 60% 40% 40%',
              background: isDark
                ? `radial-gradient(ellipse at 50% 80%, 
                    rgba(255,${180 + Math.floor(p.intensity * 75)},${30 + Math.floor(p.intensity * 50)},${0.2 + p.intensity * 0.3}) 0%, 
                    rgba(255,${100 + Math.floor(p.intensity * 60)},10,${0.1 + p.intensity * 0.15}) 40%, 
                    rgba(200,40,0,0.02) 70%, 
                    transparent 100%)`
                : `radial-gradient(ellipse at 50% 80%, 
                    rgba(192,39,45,${0.12 + p.intensity * 0.18}) 0%, 
                    rgba(200,80,30,${0.06 + p.intensity * 0.1}) 40%, 
                    transparent 100%)`,
              filter: `blur(${1 + (1 - p.intensity) * 2}px)`,
              animation: `fireCoreRise ${p.duration}s ${p.delay}s ease-out infinite`,
              transform: 'translateX(-50%)',
              ['--fire-sway' as string]: `${(sr(p.id * 83) - 0.5) * 20}px`,
            }}
          />
        );
      })}

      {/* Flying sparks */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="fire-spark"
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            bottom: `${100 - s.yStart}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: isDark
              ? `rgba(255,${200 + Math.floor(sr(s.id) * 55)},${50 + Math.floor(sr(s.id + 1) * 80)},0.9)`
              : `rgba(192,39,45,0.7)`,
            boxShadow: isDark
              ? `0 0 ${s.size * 3}px rgba(255,160,30,0.4), 0 0 ${s.size * 6}px rgba(255,100,10,0.15)`
              : `0 0 ${s.size * 2}px rgba(192,39,45,0.3)`,
            animation: `sparkFly ${s.duration}s ${s.delay}s ease-out infinite`,
            ['--spark-drift' as string]: `${s.drift}px`,
          }}
        />
      ))}

      {/* Fire light cast on nearby area */}
      <div
        className="fire-light-cast"
        style={{
          position: 'absolute',
          left: `${baseX}%`,
          bottom: '5%',
          transform: 'translateX(-50%)',
          width: 'clamp(200px, 25vw, 400px)',
          height: 'clamp(200px, 30vh, 350px)',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 90%, rgba(255,120,20,0.04) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 90%, rgba(192,39,45,0.025) 0%, transparent 70%)',
          animation: 'fireLightFlicker 0.3s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   BERA CREW — Positioned as silhouette indicators (not dancing)
   Engineering context: "the rhythm of deployment, the beat of CI/CD"
   ═══════════════════════════════════════════════════════════════════════════════ */

const BeraCrew = ({ isDark }: { isDark: boolean }) => {
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';

  // Minimalist drum indicators — like system heartbeat monitors
  return (
    <div
      className="bera-crew"
      style={{
        position: 'absolute',
        bottom: 'clamp(30px, 6vh, 60px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 'clamp(24px, 5vw, 60px)',
        alignItems: 'flex-end',
        zIndex: 14,
        pointerEvents: 'none',
      }}
    >
      {/* Each "bera" = a system heartbeat channel */}
      {[
        { label: 'BUILD', bpm: 1.2, intensity: 0.8 },
        { label: 'TEST', bpm: 0.9, intensity: 0.6 },
        { label: 'DEPLOY', bpm: 1.5, intensity: 1 },
        { label: 'MONITOR', bpm: 0.7, intensity: 0.5 },
      ].map((drum, i) => (
        <div
          key={drum.label}
          className="bera-unit"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {/* Heartbeat line visualization */}
          <svg
            width="48"
            height="24"
            viewBox="0 0 48 24"
            style={{ overflow: 'visible' }}
          >
            <path
              d={`M0,12 L12,12 L16,${4 + (1 - drum.intensity) * 8} L20,${16 + drum.intensity * 4} L24,12 L28,${6 + (1 - drum.intensity) * 6} L32,${14 + drum.intensity * 6} L36,12 L48,12`}
              fill="none"
              stroke={`${ac}${0.2 + drum.intensity * 0.3})`}
              strokeWidth="1"
              strokeLinecap="round"
              className="heartbeat-line"
              style={{
                strokeDasharray: '100',
                strokeDashoffset: '100',
                animation: `heartbeatDraw ${drum.bpm}s ease-in-out infinite`,
              }}
            />
          </svg>

          {/* Pulse dot */}
          <div
            style={{
              width: `${4 + drum.intensity * 4}px`,
              height: `${4 + drum.intensity * 4}px`,
              borderRadius: '50%',
              background: `${ac}${0.3 + drum.intensity * 0.4})`,
              animation: `beraPulse ${drum.bpm}s ease-in-out infinite`,
              boxShadow: `0 0 ${6 + drum.intensity * 10}px ${ac}${0.1 + drum.intensity * 0.15})`,
            }}
          />

          {/* Label */}
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.4rem',
              letterSpacing: '0.18em',
              color: `${tx}0.2)`,
              textTransform: 'uppercase',
            }}
          >
            {drum.label}
          </span>
        </div>
      ))}
    </div>
  );
};

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
  const bg = isDark ? 'rgba(10,10,10,' : 'rgba(255,255,255,';

  return (
    <div
      className="terminal-panel"
      style={{
        position: 'absolute',
        [side]: 'clamp(16px, 3.5vw, 50px)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 16,
        maxWidth: 'clamp(180px, 20vw, 260px)',
        pointerEvents: 'none',
        background: `${bg}0.4)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${ac}0.06)`,
        borderRadius: '6px',
        padding: 'clamp(10px, 1.5vw, 16px)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: `1px solid ${ac}0.06)`,
        }}
      >
        <div style={{ display: 'flex', gap: '3px' }}>
          {['0.3', '0.18', '0.1'].map((op, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: `${ac}${op})`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            marginLeft: '6px',
            fontSize: '0.42rem',
            fontFamily: "'DM Mono', monospace",
            color: `${ac}0.3)`,
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
          className="term-line"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 'clamp(0.4rem, 0.6vw, 0.52rem)',
            lineHeight: '1.9',
            color:
              line.type === 'cmd'
                ? `${ac}0.5)`
                : `${tx}0.3)`,
            letterSpacing: '0.02em',
            opacity: 0,
            animation: `termLineIn 0.4s ${0.1 + i * 0.12}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          }}
        >
          {line.text}
        </div>
      ))}

      {/* Blinking cursor */}
      <div
        style={{
          width: '5px',
          height: '10px',
          background: `${ac}0.4)`,
          marginTop: '4px',
          animation: 'termCursorBlink 1s step-end infinite',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

const MaskTransition = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLImageElement>(null);
  const ghostLRef = useRef<HTMLImageElement>(null);
  const ghostRRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const fogFRef = useRef<HTMLDivElement>(null);
  const fogBRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const termLRef = useRef<HTMLDivElement>(null);
  const termRRef = useRef<HTMLDivElement>(null);
  const fireLRef = useRef<HTMLDivElement>(null);
  const fireRRef = useRef<HTMLDivElement>(null);
  const beraRef = useRef<HTMLDivElement>(null);
  const maskContainerRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* ─── Mouse tracking for parallax ──────────────────────────────────────── */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  /* ─── GSAP Scroll ──────────────────────────────────────────────────────── */

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          pin: false,
        },
      });

      /* Depth layer speeds (slowest → fastest):
         Grid    → 0.2x
         Fog     → 0.4x
         Fire    → 0.8x
         Mask    → 1.0x (hero)
         Text    → 1.1x
         Metrics → 1.2x (foreground)
      */

      // L0 — Grid
      tl.fromTo(gridRef.current,
        { y: 0, opacity: 0.3 },
        { y: -30, opacity: 0.7, ease: 'none' }, 0);

      // L1 — Fog back
      tl.fromTo(fogBRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'none' }, 0);

      // L3 — Fire columns
      tl.fromTo(fireLRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, ease: 'none' }, 0);
      tl.fromTo(fireRRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, ease: 'none' }, 0);

      // L4 — Mask Container (SCROLL TRANSFORM ONLY)
      tl.fromTo(maskContainerRef.current,
        { scale: 0.08, opacity: 0, y: 350 },
        { scale: 1, opacity: 1, y: 0, ease: 'none' }, 0);

      // L4 ghosts
      tl.fromTo(ghostLRef.current,
        { opacity: 0, x: 0 },
        { opacity: 0.2, x: -8, ease: 'none' }, 0);
      tl.fromTo(ghostRRef.current,
        { opacity: 0, x: 0 },
        { opacity: 0.2, x: 8, ease: 'none' }, 0);

      // L5 — Fog front clears
      tl.fromTo(fogFRef.current,
        { opacity: 0.7 },
        { opacity: 0, ease: 'none' }, 0);

      // L5 — Title
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 90, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, ease: 'none' }, 0);
      tl.fromTo(roleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'none' }, 0);
      tl.fromTo(tagRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'none' }, 0);

      // L5 — Terminals
      tl.fromTo(termLRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, ease: 'none' }, 0);
      tl.fromTo(termRRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, ease: 'none' }, 0);

      // L6 — Marquee
      tl.fromTo(marqueeRef.current,
        { y: 80, opacity: 0 },
        { y: -15, opacity: 1, ease: 'none' }, 0);

      // L6 — Bera heartbeats
      tl.fromTo(beraRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: 'none' }, 0);

      // Scanline
      tl.fromTo(scanRef.current,
        { y: '-100%' },
        { y: '200%', ease: 'none' }, 0);

    }, outerRef);

    return () => ctx.revert();
  }, []);

  /* ─── Parallax calculation ────────────────────────────────────────────── */

  const maskMx = (mousePos.x - 0.5) * 20;
  const maskMy = (mousePos.y - 0.5) * 15;

  /* ─── Colors ───────────────────────────────────────────────────────────── */

  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';

  const marqueeWords = [...SKILLS_MARQUEE, ...SKILLS_MARQUEE];

  return (
    <div ref={outerRef} className="mask-transition-outer" style={{ height: '280vh', position: 'relative' }}>

      {/* TOP FADE */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
        background: 'linear-gradient(to bottom, hsl(var(--background)), transparent)',
        zIndex: 35, pointerEvents: 'none',
      }} />

      {/* STICKY */}
      <div ref={stickyRef} style={{
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'hsl(var(--background))',
      }}>

        {/* Grid */}
        <div ref={gridRef} style={{
          position: 'absolute', inset: '-10%', zIndex: 0,
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          opacity: 0.3,
        }} />

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 65% 60% at center, transparent 20%, hsl(var(--background)) 68%)',
        }} />

        {/* Fog back */}
        <div ref={fogBRef} style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: isDark
            ? 'radial-gradient(ellipse 85% 55% at 50% 55%, rgba(20,15,5,0.6) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 85% 55% at 50% 55%, rgba(250,248,245,0.6) 0%, transparent 60%)',
        }} />

        {/* Marquee */}
        <div style={{
          position: 'absolute', top: '50%', left: '-5%', width: '110%',
          transform: 'translateY(-50%)', zIndex: 4, overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div ref={marqueeRef} style={{
            display: 'flex', whiteSpace: 'nowrap',
            animation: 'mqCinema 50s linear infinite', opacity: 0,
          }}>
            {marqueeWords.map((w, i) => (
              <span key={i} style={{
                fontSize: w === '·' ? '2rem' : 'clamp(3rem, 7vw, 6rem)',
                fontWeight: w === '·' ? 400 : 800,
                fontFamily: w === '·' ? 'serif' : "'Plus Jakarta Sans', sans-serif",
                color: `${ac}${w === '·' ? '0.08' : (i % 4 < 2 ? '0.03' : '0')})`,
                WebkitTextStroke: i % 4 >= 2 && w !== '·' ? `1px ${ac}0.03)` : 'none',
                lineHeight: 1, userSelect: 'none',
                margin: w === '·' ? '0 0.8rem' : '0 0.3rem',
              }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* FIRE COLUMNS */}
        <div ref={fireLRef} style={{ opacity: 0 }}>
          <FireColumn side="left" isDark={isDark} />
        </div>
        <div ref={fireRRef} style={{ opacity: 0 }}>
          <FireColumn side="right" isDark={isDark} />
        </div>

        {/* MASK CONTAINER (Managed by GSAP Scroll) */}
        <div
          ref={maskContainerRef}
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0,
            // y: 350 to 0 is handled via GSAP ref
          }}
        >
          {/* MASK INNER (Managed by Mouse Parallax) */}
          <div
            style={{
              transform: `translate(${maskMx}px, ${maskMy}px)`,
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img ref={ghostLRef} src={maskImg} alt="" aria-hidden="true" style={{
              position: 'absolute', width: 'clamp(200px, 30vw, 380px)', height: 'auto',
              opacity: 0,
              filter: isDark ? 'brightness(0.6)' : 'none',
              mixBlendMode: isDark ? 'screen' : 'multiply',
              pointerEvents: 'none',
            }} />
            <img ref={ghostRRef} src={maskImg} alt="" aria-hidden="true" style={{
              position: 'absolute', width: 'clamp(200px, 30vw, 380px)', height: 'auto',
              opacity: 0,
              filter: isDark ? 'brightness(0.6)' : 'none',
              mixBlendMode: isDark ? 'screen' : 'multiply',
              pointerEvents: 'none',
            }} />
            <img ref={maskRef} src={maskImg} alt="Gara Yaka" style={{
              width: 'clamp(200px, 30vw, 380px)', height: 'auto',
              position: 'relative', zIndex: 2,
              filter: isDark
                ? 'drop-shadow(0 0 40px rgba(232,168,32,0.15))'
                : 'drop-shadow(0 0 30px rgba(192,39,45,0.1))',
            }} />

            {/* Fire light reflection on mask */}
            <div style={{
              position: 'absolute', inset: '-30%', zIndex: 1,
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(255,120,20,0.05) 0%, transparent 60%)'
                : 'radial-gradient(circle, rgba(192,39,45,0.03) 0%, transparent 60%)',
              animation: 'fireLightFlicker 0.3s ease-in-out infinite alternate',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Fog front */}
        <div ref={fogFRef} style={{
          position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none',
          background: isDark
            ? 'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, transparent 40%, rgba(10,10,10,0.45) 100%)'
            : 'linear-gradient(180deg, rgba(250,250,250,0.4) 0%, transparent 40%, rgba(250,250,250,0.4) 100%)',
        }} />

        {/* Scanline */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 13, overflow: 'hidden', pointerEvents: 'none' }}>
          <div ref={scanRef} style={{
            width: '100%', height: '1px',
            background: `linear-gradient(90deg, transparent 10%, ${ac}0.05) 50%, transparent 90%)`,
          }} />
        </div>

        {/* Title block */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(90px, 15vh, 150px)',
          left: 0, right: 0, zIndex: 15,
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div ref={titleRef} style={{
            fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            color: `${tx}0.92)`, letterSpacing: '0.1em', opacity: 0,
            textShadow: isDark ? '0 0 60px rgba(232,168,32,0.08)' : 'none',
          }}>
            GARA YAKA
          </div>
          <div ref={roleRef} style={{
            fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)',
            fontFamily: "'DM Mono', monospace",
            color: `${ac}0.55)`,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            marginTop: '8px', opacity: 0,
          }}>
            SENIOR SOFTWARE ENGINEER
          </div>
          <div ref={tagRef} style={{
            fontSize: 'clamp(0.48rem, 0.8vw, 0.6rem)',
            fontFamily: "'DM Mono', monospace",
            color: `${tx}0.25)`,
            letterSpacing: '0.1em', marginTop: '6px', opacity: 0,
          }}>
            building systems that scale — shipping code that lasts
          </div>
        </div>

        {/* Terminal panels */}
        <div ref={termLRef} style={{ opacity: 0 }}>
          <TerminalPanel isDark={isDark} lines={TERMINAL_LEFT} side="left" title="sys.profile" />
        </div>
        <div ref={termRRef} style={{ opacity: 0 }}>
          <TerminalPanel isDark={isDark} lines={TERMINAL_RIGHT} side="right" title="metrics.live" />
        </div>

        {/* Bera crew heartbeats */}
        <div ref={beraRef} style={{ opacity: 0 }}>
          <BeraCrew isDark={isDark} />
        </div>

        {/* HUD top */}
        <div style={{
          position: 'absolute', top: 24, left: 24, right: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 20, fontFamily: "'DM Mono', monospace",
          fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          <span style={{ color: `${ac}0.3)` }}>gara_yaka.dev</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '4px', height: '4px', borderRadius: '50%',
                background: 'rgba(34,197,94,0.6)',
                animation: 'greenPulse 2s ease-in-out infinite',
              }} />
              <span style={{ color: `${ac}0.22)` }}>open to work</span>
            </div>
          </div>
        </div>

        {/* Corner brackets */}
        {[
          { top: 44, left: 24, bT: true, bL: true },
          { top: 44, right: 24, bT: true, bR: true },
          { bottom: 24, left: 24, bB: true, bL: true },
          { bottom: 24, right: 24, bB: true, bR: true },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...(p.top !== undefined ? { top: p.top } : {}),
            ...(p.bottom !== undefined ? { bottom: p.bottom } : {}),
            ...(p.left !== undefined ? { left: p.left } : {}),
            ...(p.right !== undefined ? { right: p.right } : {}),
            width: 18, height: 18, zIndex: 20,
            borderTop: p.bT ? `1px solid ${ac}0.1)` : 'none',
            borderBottom: p.bB ? `1px solid ${ac}0.1)` : 'none',
            borderLeft: p.bL ? `1px solid ${ac}0.1)` : 'none',
            borderRight: p.bR ? `1px solid ${ac}0.1)` : 'none',
          }} />
        ))}

      </div>

      {/* BOTTOM FADE */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
        background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
        zIndex: 35, pointerEvents: 'none',
      }} />
    </div>
  );
};

export default MaskTransition;