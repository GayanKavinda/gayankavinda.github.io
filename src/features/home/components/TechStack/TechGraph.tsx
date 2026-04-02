//src/components/sections/TechStack/TechGraph.tsx
// Premium radar chart component.
// - Crimson #C41E3A + Gold #D4891A (exact index.css palette)
// - Playfair Display axis labels, DM Mono percentage ticks
// - Animated draw-on (easeOut4) triggered by ScrollTrigger
// - Per-segment gradient polygon border
// - Crosshair snap lines on hover
// - Floating tooltip with category accent border
// - Category filter pills
// - Full light / dark mode support

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@app/providers/theme-provider';
import { CR, GD, CRP, GDP, CAT_META, SKILLS, rm } from './constants';

gsap.registerPlugin(ScrollTrigger);

const CATS = [
  { key: 'all',   label: 'All',    color: null },
  { key: 'fe',    label: 'Frontend', color: GD },
  { key: 'be',    label: 'Backend',  color: CR },
  { key: 'infra', label: 'Infra',    color: CR },
  { key: 'data',  label: 'Data',     color: GD },
] as const;

type Skill = typeof SKILLS[0];

const easeOut4 = (t: number) => 1 - Math.pow(1 - t, 4);

function polarPt(
  cx: number, cy: number, r: number, i: number, n: number
): [number, number] {
  const a = (2 * Math.PI * i / n) - Math.PI / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function filterSk(key: string): Skill[] {
  return key === 'all' ? SKILLS : SKILLS.filter(s => s.cat === key);
}

// ── Component ────────────────────────────────────────────────────────────────
export const TechGraph = () => {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  const [active, setActive]     = useState('all');
  const [hovSkill, setHovSkill] = useState<Skill | null>(null);
  const [tipPos, setTipPos]     = useState({ x: 0, y: 0 });

  // Mutable refs — shared across effect and RAF callbacks without stale closure
  const activeRef  = useRef('all');
  const animPRef   = useRef(0);
  const hovIdxRef  = useRef(-1);
  const dotPosRef  = useRef<{ x: number; y: number }[]>([]);
  const rafRef     = useRef(0);
  const drawRef    = useRef<((p: number) => void) | null>(null);

  // ── Main canvas effect (re-runs when theme changes) ──────────────────────
  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const DPR = window.devicePixelRatio || 1;
    const d   = isDark;

    // Theme tokens (enhanced for full clear view)
    const T = {
      grid:  d ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.15)',
      axis:  d ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.20)',
      tick:  d ? '#9aa1c2' : '#69728f',
      lbl:   d ? '#c8cfea' : '#49516d',
      dot:   d ? '#181b2a' : '#ffffff',
      xh:    d ? 'rgba(255,255,255,.2)'  : 'rgba(0,0,0,.15)',
    };

    // ── Draw function ──────────────────────────────────────────────────────
    function draw(p: number) {
      const W = canvas.width / DPR;
      const H = canvas.height / DPR;
      ctx.clearRect(0, 0, W, H);

      const sk = filterSk(activeRef.current);
      const n  = sk.length;
      if (!n) return;

      const cx = W / 2, cy = H / 2;
      const maxR = Math.min(cx, cy) - 52;

      // Concentric grid rings
      [20, 40, 60, 80, 100].forEach(pct => {
        const r = (pct / 100) * maxR;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const [x, y] = polarPt(cx, cy, r, i, n);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = pct === 100 ? T.axis : T.grid;
        ctx.lineWidth   = pct === 100 ? 1 : 0.8;
        ctx.stroke();
      });

      // Axis spokes
      for (let i = 0; i < n; i++) {
        const [x2, y2] = polarPt(cx, cy, maxR, i, n);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = T.axis;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }

      // Animated data points
      const rp: [number, number][] = sk.map((s, i) => {
        const r = (s.pct / 100) * maxR * p;
        return polarPt(cx, cy, r, i, n);
      });

      // Polygon fill
      const pfx = activeRef.current === 'all'
        ? CRP
        : (CAT_META[activeRef.current]?.pfx ?? CRP);
      ctx.beginPath();
      rp.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = pfx + '0.2)';
      ctx.fill();

      // Per-segment gradient border
      for (let i = 0; i < rp.length; i++) {
        const [x1, y1] = rp[i];
        const [x2, y2] = rp[(i + 1) % rp.length];
        const c1 = CAT_META[sk[i].cat]?.color ?? CR;
        const c2 = CAT_META[sk[(i + 1) % sk.length].cat]?.color ?? CR;
        const g  = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = g;
        ctx.lineWidth   = 2;
        ctx.stroke();
      }

      // Crosshair snap lines
      const hi = hovIdxRef.current;
      if (hi >= 0 && hi < rp.length) {
        const [hx, hy] = rp[hi];
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = T.xh;
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.moveTo(hx, cy); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, hy); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Dots with hover halo
      const newPos: { x: number; y: number }[] = [];
      rp.forEach(([x, y], i) => {
        const s   = sk[i];
        const isH = i === hi;
        const dc  = CAT_META[s.cat]?.color ?? CR;
        const dp  = CAT_META[s.cat]?.pfx   ?? CRP;
        newPos.push({ x, y });

        if (isH) {
          ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2);
          ctx.fillStyle = dp + '0.2)'; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = dp + '0.6)'; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(x, y, isH ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle   = T.dot;
        ctx.fill();
        ctx.strokeStyle = dc;
        ctx.lineWidth   = isH ? 2.5 : 2;
        ctx.stroke();
      });
      dotPosRef.current = newPos;

      // Axis labels
      const labelR = maxR + 30;
      sk.forEach((s, i) => {
        const a   = (2 * Math.PI * i / n) - Math.PI / 2;
        const lx  = cx + labelR * Math.cos(a);
        const ly  = cy + labelR * Math.sin(a);
        const ax  = Math.abs(Math.cos(a)) < 0.15
          ? 'center'
          : Math.cos(a) > 0 ? 'left' : 'right';
        const dy  = Math.sin(a) > 0.4 ? 14 : Math.sin(a) < -0.4 ? 0 : 6;
        const isH = i === hi;
        const dc  = CAT_META[s.cat]?.color ?? CR;

        ctx.textAlign    = ax as CanvasTextAlign;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle    = isH ? dc : T.lbl;
        ctx.font         = (isH ? '700' : '600') + ' 12px "Playfair Display", serif';
        ctx.fillText(s.name, lx, ly + dy);
      });

      // Ring background indicators (no numbers)
      [20, 40, 60, 80].forEach(pct => {
        const r = (pct / 100) * maxR;
        const [lx, ly] = polarPt(cx, cy, r, 0, n);
        ctx.beginPath();
        ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = T.tick + '40';
        ctx.fill();
      });
    }

    drawRef.current = draw;

    // ── Animation ──────────────────────────────────────────────────────────
    function startAnim() {
      cancelAnimationFrame(rafRef.current);
      hovIdxRef.current = -1;
      setHovSkill(null);
      const t0  = performance.now();
      const dur = rm() ? 1 : 900;

      function step(now: number) {
        const raw = Math.min((now - t0) / dur, 1);
        animPRef.current = easeOut4(raw);
        draw(animPRef.current);
        if (raw < 1) rafRef.current = requestAnimationFrame(step);
        else animPRef.current = 1;
      }
      rafRef.current = requestAnimationFrame(step);
    }

    // ── Hit test ───────────────────────────────────────────────────────────
    function hit(mx: number, my: number) {
      for (let i = 0; i < dotPosRef.current.length; i++) {
        const { x, y } = dotPosRef.current[i];
        if ((mx - x) ** 2 + (my - y) ** 2 < 20 ** 2) return i;
      }
      return -1;
    }

    // ── Mouse events ───────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r   = canvas.getBoundingClientRect();
      const mx  = e.clientX - r.left;
      const my  = e.clientY - r.top;
      const idx = hit(mx, my);

      if (idx !== hovIdxRef.current) {
        hovIdxRef.current = idx;
        draw(animPRef.current);
        setHovSkill(idx >= 0 ? filterSk(activeRef.current)[idx] : null);
      }

      if (idx >= 0) {
        const wr = (canvas.parentElement as HTMLElement).getBoundingClientRect();
        let tx   = e.clientX - wr.left + 16;
        const ty = e.clientY - wr.top  - 75;
        if (tx + 175 > wr.width) tx = e.clientX - wr.left - 190;
        setTipPos({ x: Math.max(0, tx), y: Math.max(0, ty) });
      }
    };

    const onLeave = () => {
      hovIdxRef.current = -1;
      setHovSkill(null);
      draw(animPRef.current);
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // ── Resize observer ────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const W = wrap.clientWidth;
      const H = Math.round(W * 0.92);
      canvas.width        = W * DPR;
      canvas.height       = H * DPR;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      draw(animPRef.current);
    });
    ro.observe(wrap);

    // ── Scroll entrance ────────────────────────────────────────────────────
    let ctxGsap: gsap.Context | null = null;
    if (!rm()) {
      ctxGsap = gsap.context(() => {
        gsap.fromTo(canvas, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: wrap, start: 'top 85%', once: true }
          }
        );
      }, wrapRef);
    }

    startAnim();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (ctxGsap) ctxGsap.revert();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  }, [isDark]);

  // ── Re-animate when active category changes ──────────────────────────────
  useEffect(() => {
    activeRef.current = active;
    const draw = drawRef.current;
    if (!draw) return;

    cancelAnimationFrame(rafRef.current);
    hovIdxRef.current = -1;
    setHovSkill(null);

    const t0  = performance.now();
    const dur = rm() ? 1 : 900;

    function step(now: number) {
      const raw = Math.min((now - t0) / dur, 1);
      animPRef.current = easeOut4(raw);
      draw(animPRef.current);
      if (raw < 1) rafRef.current = requestAnimationFrame(step);
      else animPRef.current = 1;
    }
    rafRef.current = requestAnimationFrame(step);
  }, [active]);

  // ── Pill class helper ────────────────────────────────────────────────────
  const pillCls = (key: string, color: string | null) => {
    const base = [
      'font-mono text-[9px] tracking-[.1em] uppercase',
      'px-[14px] py-[5px] rounded-full border',
      'transition-all duration-200 cursor-pointer',
    ].join(' ');

    if (active !== key)
      return base + ' border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-transparent';
    if (key === 'all')
      return base + ' text-white border-transparent bg-gradient-to-r from-[#C41E3A] to-[#D4891A]';
    if (color === GD)
      return base + ' text-white border-transparent bg-[#D4891A]';
    return base + ' text-white border-transparent bg-[#C41E3A]';
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full">

      {/* Category filter pills */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {CATS.map(c => (
          <button
            key={c.key}
            className={pillCls(c.key, c.color)}
            onClick={() => setActive(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Canvas + floating tooltip */}
      <div ref={wrapRef} className="relative max-w-[440px] mx-auto md:ml-0 md:max-w-[85%]">
        <canvas ref={canvasRef} className="block w-full" />

        {/* Tooltip */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left:      tipPos.x,
            top:       tipPos.y,
            opacity:   hovSkill ? 1 : 0,
            transform: hovSkill ? 'translateY(0)' : 'translateY(5px)',
            transition: 'opacity .14s, transform .14s',
          }}
        >
          {hovSkill && (
            <div
              className="bg-card border border-border rounded-xl px-4 py-3 min-w-[148px]"
              style={{
                borderTop: `2px solid ${CAT_META[hovSkill.cat]?.color ?? CR}`,
              }}
            >
              <div
                className="font-mono text-[9px] tracking-[.14em] uppercase mb-1"
                style={{ color: CAT_META[hovSkill.cat]?.color ?? CR }}
              >
                {CAT_META[hovSkill.cat]?.label}
              </div>
              <div className="font-playfair text-[15px] font-bold text-foreground mb-2.5">
                {hovSkill.name}
              </div>
              <div className="h-[2.5px] bg-muted rounded overflow-hidden mb-1">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width:      hovSkill.pct + '%',
                    background: CAT_META[hovSkill.cat]?.color ?? CR,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-5 flex-wrap mt-5">
        {[
          { color: GD, label: 'Frontend / Data' },
          { color: CR, label: 'Backend / Infra'  },
        ].map(l => (
          <div
            key={l.label}
            className="flex items-center gap-2 font-mono text-[9px] tracking-[.08em] uppercase text-muted-foreground/50"
          >
            <div className="w-4 h-[1.5px]" style={{ background: l.color }} />
            <div
              className="w-1.5 h-1.5 rounded-full border-[1.5px]"
              style={{ borderColor: l.color }}
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
};

