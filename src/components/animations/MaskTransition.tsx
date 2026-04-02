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
   TERMINAL PANEL — Clean glassmorphic terminal
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
      className="terminal-panel"
      style={{
        position: 'absolute',
        [side]: 'clamp(20px, 4vw, 60px)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 16,
        maxWidth: 'clamp(200px, 22vw, 280px)',
        pointerEvents: 'none',
        background: `${bg}0.5)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${ac}0.06)`,
        borderRadius: '10px',
        padding: 'clamp(12px, 1.8vw, 20px)',
        boxShadow: isDark
          ? `0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 ${ac}0.04)`
          : `0 12px 40px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)`,
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
          borderBottom: `1px solid ${ac}0.06)`,
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
            color: `${ac}0.35)`,
            letterSpacing: '0.12em',
          }}
        >
          {title}
        </span>
      </div>

      {lines.map((line, i) => (
        <div
          key={i}
          className="term-line"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 'clamp(0.42rem, 0.65vw, 0.54rem)',
            lineHeight: 2,
            color:
              line.type === 'cmd' ? `${ac}0.55)` : `${tx}0.35)`,
            letterSpacing: '0.02em',
            opacity: 0,
            animation: `termFadeIn 0.5s ${0.15 + i * 0.12}s cubic-bezier(0.22,1,0.36,1) forwards`,
          }}
        >
          {line.text}
        </div>
      ))}

      <div
        style={{
          width: '6px',
          height: '12px',
          background: `${ac}0.35)`,
          marginTop: '6px',
          borderRadius: '1px',
          animation: 'cursorBlink 1.1s step-end infinite',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   STAT CARDS — Minimal floating metric cards
   ═══════════════════════════════════════════════════════════════════════════════ */

const StatRow = ({ isDark }: { isDark: boolean }) => {
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';
  const bg = isDark ? 'rgba(12,12,12,' : 'rgba(255,255,255,';

  return (
    <div
      className="stat-row"
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
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="stat-card"
          style={{
            background: `${bg}0.45)`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${ac}0.05)`,
            borderRadius: '8px',
            padding: 'clamp(8px, 1.2vw, 14px) clamp(12px, 1.6vw, 20px)',
            textAlign: 'center',
            opacity: 0,
            animation: `statSlideUp 0.6s ${0.4 + i * 0.1}s cubic-bezier(0.22,1,0.36,1) forwards`,
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(0.9rem, 1.6vw, 1.3rem)',
              fontWeight: 800,
              color: `${tx}0.8)`,
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
              color: `${ac}0.35)`,
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
   AMBIENT PARTICLE FIELD — Gentle floating dots (canvas-based)
   ═══════════════════════════════════════════════════════════════════════════════ */

const ParticleField = ({
  isDark,
  mousePos,
}: {
  isDark: boolean;
  mousePos: { x: number; y: number };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const nodesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      pulsePhase: number;
      pulseSpeed: number;
    }>
  >([]);
  const timeRef = useRef(0);
  const mousePosRef = useRef(mousePos);
  mousePosRef.current = mousePos;

  const PARTICLE_COUNT = 35;
  const CONNECTION_DIST = 150;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const seed = (n: number) => {
      const x = Math.sin(n * 9301 + 49297) * 49297;
      return x - Math.floor(x);
    };

    nodesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: seed(i * 31) * canvas.width,
      y: seed(i * 37) * canvas.height,
      vx: (seed(i * 41) - 0.5) * 0.15,
      vy: (seed(i * 43) - 0.5) * 0.15,
      size: 0.6 + seed(i * 47) * 1.2,
      alpha: 0.06 + seed(i * 53) * 0.12,
      pulsePhase: seed(i * 59) * Math.PI * 2,
      pulseSpeed: 0.3 + seed(i * 61) * 1.2,
    }));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const color = isDark ? [232, 168, 32] : [192, 39, 45];

    const draw = () => {
      timeRef.current += 0.012;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const mp = mousePosRef.current;
      const mx = mp.x * w;
      const my = mp.y * h;

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // Update
      nodes.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Subtle mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * 0.08;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const a = (1 - dist / CONNECTION_DIST) * 0.035;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Dots
      nodes.forEach((p) => {
        const pulse =
          Math.sin(t * p.pulseSpeed + p.pulsePhase) * 0.5 + 0.5;
        const a = p.alpha * (0.5 + pulse * 0.5);

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${a * 0.15})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${a})`;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion()) {
      frameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CONCENTRIC RINGS — Minimal geometric accent
   ═══════════════════════════════════════════════════════════════════════════════ */

const ConcentricRings = ({ isDark }: { isDark: boolean }) => {
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';

  return (
    <svg
      className="concentric-rings"
      viewBox="-300 -300 600 600"
      style={{
        position: 'absolute',
        width: 'clamp(400px, 55vw, 700px)',
        height: 'clamp(400px, 55vw, 700px)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {[100, 160, 230].map((r, i) => (
        <circle
          key={r}
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={`${ac}${0.03 + (2 - i) * 0.01})`}
          strokeWidth={0.6}
          strokeDasharray={`${3 + i * 4} ${25 + i * 15}`}
          className="ring-circle"
          style={{
            animation: `ringRotate ${50 + i * 30}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            transformOrigin: 'center',
          }}
        />
      ))}

      {/* Subtle crosshairs */}
      {[0, 90].map((angle) => (
        <line
          key={angle}
          x1={Math.cos((angle * Math.PI) / 180) * 40}
          y1={Math.sin((angle * Math.PI) / 180) * 40}
          x2={Math.cos((angle * Math.PI) / 180) * 260}
          y2={Math.sin((angle * Math.PI) / 180) * 260}
          stroke={`${ac}0.015)`}
          strokeWidth="0.5"
          strokeDasharray="1 40"
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
  const maskContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLImageElement>(null);
  const ghostLRef = useRef<HTMLImageElement>(null);
  const ghostRRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const fogBackRef = useRef<HTMLDivElement>(null);
  const fogFrontRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const termLRef = useRef<HTMLDivElement>(null);
  const termRRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* ── Mouse Tracking ── */
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

  /* ── GSAP Scroll Timeline ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.6,
        },
      });

      // Grid (deepest)
      tl.fromTo(
        gridRef.current,
        { y: 0, opacity: 0.15 },
        { y: -25, opacity: 0.5, ease: 'none' },
        0
      );

      // Particles
      tl.fromTo(
        particlesRef.current,
        { opacity: 0, y: 30 },
        { opacity: 0.7, y: -10, ease: 'none' },
        0
      );

      // Fog back
      tl.fromTo(
        fogBackRef.current,
        { opacity: 0.9 },
        { opacity: 0, ease: 'none' },
        0
      );

      // Rings
      tl.fromTo(
        ringsRef.current,
        { opacity: 0, scale: 0.6, rotation: -15 },
        { opacity: 1, scale: 1, rotation: 0, ease: 'none' },
        0
      );

      // Mask
      tl.fromTo(
        maskContainerRef.current,
        { scale: 0.06, opacity: 0, y: 380 },
        { scale: 1, opacity: 1, y: 0, ease: 'none' },
        0
      );

      // Ghosts
      tl.fromTo(
        ghostLRef.current,
        { opacity: 0, x: 0 },
        { opacity: 0.12, x: -10, ease: 'none' },
        0
      );
      tl.fromTo(
        ghostRRef.current,
        { opacity: 0, x: 0 },
        { opacity: 0.12, x: 10, ease: 'none' },
        0
      );

      // Fog front
      tl.fromTo(
        fogFrontRef.current,
        { opacity: 0.6 },
        { opacity: 0, ease: 'none' },
        0
      );

      // Title
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 90, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, ease: 'none' },
        0
      );
      tl.fromTo(
        roleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'none' },
        0
      );
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'none' },
        0
      );

      // Terminals
      tl.fromTo(
        termLRef.current,
        { opacity: 0, x: -70 },
        { opacity: 1, x: 0, ease: 'none' },
        0
      );
      tl.fromTo(
        termRRef.current,
        { opacity: 0, x: 70 },
        { opacity: 1, x: 0, ease: 'none' },
        0
      );

      // Stats
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: 'none' },
        0
      );

      // Marquee
      tl.fromTo(
        marqueeRef.current,
        { y: 80, opacity: 0 },
        { y: -12, opacity: 1, ease: 'none' },
        0
      );

      // Scanline
      tl.fromTo(
        scanRef.current,
        { y: '-100%' },
        { y: '200%', ease: 'none' },
        0
      );
    }, outerRef);

    return () => ctx.revert();
  }, []);

  /* ── Multi-layer mouse parallax ── */
  const maskMx = (mousePos.x - 0.5) * 22;
  const maskMy = (mousePos.y - 0.5) * 16;
  const ringMx = (mousePos.x - 0.5) * -8;
  const ringMy = (mousePos.y - 0.5) * -6;

  /* ── Colors ── */
  const ac = isDark ? 'rgba(232,168,32,' : 'rgba(192,39,45,';
  const tx = isDark ? 'rgba(245,240,232,' : 'rgba(30,30,30,';

  const marqueeWords = [...SKILLS_MARQUEE, ...SKILLS_MARQUEE];

  return (
    <div
      ref={outerRef}
      className="mask-transition-outer"
      style={{ height: '280vh', position: 'relative' }}
    >
      {/* TOP FADE */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background:
            'linear-gradient(to bottom, hsl(var(--background)), transparent)',
          zIndex: 35,
          pointerEvents: 'none',
        }}
      />

      {/* STICKY VIEWPORT */}
      <div
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
        {/* ═══ GRID ═══ */}
        <div
          ref={gridRef}
          style={{
            position: 'absolute',
            inset: '-10%',
            zIndex: 0,
            backgroundImage: isDark
              ? 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)'
              : 'linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.15,
          }}
        />

        {/* ═══ PARTICLES ═══ */}
        <div ref={particlesRef} style={{ opacity: 0 }}>
          <ParticleField isDark={isDark} mousePos={mousePos} />
        </div>

        {/* ═══ VIGNETTE ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'radial-gradient(ellipse 60% 55% at center, transparent 18%, hsl(var(--background)) 65%)',
          }}
        />

        {/* ═══ FOG BACK ═══ */}
        <div
          ref={fogBackRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            background: isDark
              ? 'radial-gradient(ellipse 80% 50% at 50% 55%, rgba(15,12,5,0.5) 0%, transparent 60%)'
              : 'radial-gradient(ellipse 80% 50% at 50% 55%, rgba(252,250,248,0.6) 0%, transparent 60%)',
          }}
        />

        {/* ═══ RINGS ═══ */}
        <div
          ref={ringsRef}
          style={{
            opacity: 0,
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${ringMx}px, ${ringMy}px)`,
            transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <ConcentricRings isDark={isDark} />
        </div>

        {/* ═══ MARQUEE ═══ */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-5%',
            width: '110%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            ref={marqueeRef}
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              animation: 'mqCinema 55s linear infinite',
              opacity: 0,
            }}
          >
            {marqueeWords.map((w, i) => (
              <span
                key={i}
                style={{
                  fontSize:
                    w === '·' ? '2rem' : 'clamp(3rem, 7vw, 6rem)',
                  fontWeight: w === '·' ? 400 : 800,
                  fontFamily:
                    w === '·'
                      ? 'serif'
                      : "'Plus Jakarta Sans', sans-serif",
                  color: `${ac}${w === '·' ? '0.06' : i % 4 < 2 ? '0.025' : '0'})`,
                  WebkitTextStroke:
                    i % 4 >= 2 && w !== '·'
                      ? `1px ${ac}0.025)`
                      : 'none',
                  lineHeight: 1,
                  userSelect: 'none',
                  margin: w === '·' ? '0 0.8rem' : '0 0.3rem',
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ MASK ═══ */}
        <div
          ref={maskContainerRef}
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
          }}
        >
          <div
            style={{
              transform: `translate(${maskMx}px, ${maskMy}px)`,
              transition:
                'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Ghosts */}
            <img
              ref={ghostLRef}
              src={maskImg}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 'clamp(210px, 30vw, 400px)',
                height: 'auto',
                opacity: 0,
                filter: isDark
                  ? 'brightness(0.5) blur(1.5px)'
                  : 'blur(1.5px)',
                mixBlendMode: isDark ? 'screen' : 'multiply',
                pointerEvents: 'none',
              }}
            />
            <img
              ref={ghostRRef}
              src={maskImg}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: 'clamp(210px, 30vw, 400px)',
                height: 'auto',
                opacity: 0,
                filter: isDark
                  ? 'brightness(0.5) blur(1.5px)'
                  : 'blur(1.5px)',
                mixBlendMode: isDark ? 'screen' : 'multiply',
                pointerEvents: 'none',
              }}
            />

            {/* Main mask image */}
            <img
              ref={maskRef}
              src={maskImg}
              alt="Gara Yaka"
              style={{
                width: 'clamp(210px, 30vw, 400px)',
                height: 'auto',
                position: 'relative',
                zIndex: 2,
                filter: isDark
                  ? 'drop-shadow(0 0 50px rgba(232,168,32,0.08)) drop-shadow(0 0 100px rgba(232,168,32,0.03))'
                  : 'drop-shadow(0 0 40px rgba(192,39,45,0.06)) drop-shadow(0 0 80px rgba(192,39,45,0.02))',
              }}
            />

            {/* Subtle radial aura */}
            <div
              style={{
                position: 'absolute',
                inset: '-35%',
                zIndex: 1,
                borderRadius: '50%',
                background: isDark
                  ? 'radial-gradient(circle, rgba(232,168,32,0.025) 0%, transparent 55%)'
                  : 'radial-gradient(circle, rgba(192,39,45,0.018) 0%, transparent 55%)',
                animation:
                  'auraPulse 5s ease-in-out infinite alternate',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* ═══ FOG FRONT ═══ */}
        <div
          ref={fogFrontRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 12,
            pointerEvents: 'none',
            background: isDark
              ? 'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, transparent 35%, rgba(10,10,10,0.4) 100%)'
              : 'linear-gradient(180deg, rgba(252,252,252,0.35) 0%, transparent 35%, rgba(252,252,252,0.35) 100%)',
          }}
        />

        {/* ═══ SCANLINE ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 13,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            ref={scanRef}
            style={{
              width: '100%',
              height: '1px',
              background: `linear-gradient(90deg, transparent 10%, ${ac}0.035) 50%, transparent 90%)`,
            }}
          />
        </div>

        {/* ═══ TITLE ═══ */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(100px, 16vh, 155px)',
            left: 0,
            right: 0,
            zIndex: 15,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            ref={titleRef}
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              fontFamily: "'Playfair Display', serif",
              color: `${tx}0.92)`,
              letterSpacing: '0.12em',
              opacity: 0,
              textShadow: isDark
                ? '0 0 70px rgba(232,168,32,0.05)'
                : 'none',
            }}
          >
            GARA YAKA
          </div>
          <div
            ref={roleRef}
            style={{
              fontSize: 'clamp(0.55rem, 1vw, 0.78rem)',
              fontFamily: "'DM Mono', monospace",
              color: `${ac}0.5)`,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              marginTop: '10px',
              opacity: 0,
            }}
          >
            SENIOR SOFTWARE ENGINEER
          </div>
          <div
            ref={tagRef}
            style={{
              fontSize: 'clamp(0.44rem, 0.75vw, 0.58rem)',
              fontFamily: "'DM Mono', monospace",
              color: `${tx}0.2)`,
              letterSpacing: '0.1em',
              marginTop: '8px',
              opacity: 0,
            }}
          >
            building systems that scale — shipping code that lasts
          </div>
        </div>

        {/* ═══ TERMINALS ═══ */}
        <div ref={termLRef} style={{ opacity: 0 }}>
          <TerminalPanel
            isDark={isDark}
            lines={PROFILE_LINES}
            side="left"
            title="profile.sh"
          />
        </div>
        <div ref={termRRef} style={{ opacity: 0 }}>
          <TerminalPanel
            isDark={isDark}
            lines={STATUS_LINES}
            side="right"
            title="status.sh"
          />
        </div>

        {/* ═══ STATS ═══ */}
        <div ref={statsRef} style={{ opacity: 0 }}>
          <StatRow isDark={isDark} />
        </div>

        {/* ═══ HUD TOP ═══ */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 28,
            right: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 20,
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.48rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: `${ac}0.28)` }}>gara_yaka.dev</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.55)',
                animation: 'greenPulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ color: `${ac}0.2)` }}>open to work</span>
          </div>
        </div>

        {/* ═══ CORNER BRACKETS ═══ */}
        {[
          { top: 48, left: 28, bT: true, bL: true },
          { top: 48, right: 28, bT: true, bR: true },
          { bottom: 28, left: 28, bB: true, bL: true },
          { bottom: 28, right: 28, bB: true, bR: true },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...(p.top !== undefined ? { top: p.top } : {}),
              ...(p.bottom !== undefined ? { bottom: p.bottom } : {}),
              ...(p.left !== undefined ? { left: p.left } : {}),
              ...(p.right !== undefined ? { right: p.right } : {}),
              width: 20,
              height: 20,
              zIndex: 20,
              borderTop: p.bT
                ? `1px solid ${ac}0.08)`
                : 'none',
              borderBottom: p.bB
                ? `1px solid ${ac}0.08)`
                : 'none',
              borderLeft: p.bL
                ? `1px solid ${ac}0.08)`
                : 'none',
              borderRight: p.bR
                ? `1px solid ${ac}0.08)`
                : 'none',
            }}
          />
        ))}
      </div>

      {/* BOTTOM FADE */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background:
            'linear-gradient(to top, hsl(var(--background)), transparent)',
          zIndex: 35,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default MaskTransition;