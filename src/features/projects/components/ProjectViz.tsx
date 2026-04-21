// src/features/projects/components/ProjectViz.tsx

import React from 'react';
import { VizType } from '../types';

interface VizProps {
  accent: string;
  idx: number;
}

const VizNodes = React.memo(({ accent }: { accent: string }) => (
  <svg viewBox="0 0 340 180" fill="none" className="w-full h-full" shapeRendering="optimizeSpeed">
    <circle cx="170" cy="90" r="32" stroke={accent} strokeWidth="1" strokeOpacity="0.35" />
    <circle cx="170" cy="90" r="18" fill={accent} fillOpacity="0.1" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
    <circle cx="78" cy="48" r="16" stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
    <circle cx="262" cy="132" r="20" stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
    <circle cx="78" cy="132" r="12" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2" />
    <circle cx="262" cy="48" r="14" stroke={accent} strokeWidth="0.8" strokeOpacity="0.2" />
    <line x1="138" y1="78" x2="94" y2="58" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="202" y1="102" x2="242" y2="122" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="138" y1="102" x2="90" y2="122" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="202" y1="78" x2="248" y2="56" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="4 3" />
    <circle cx="170" cy="90" r="4" fill={accent} />
  </svg>
));

const VizChart = React.memo(({ accent, idx }: VizProps) => {
  const pts = [28, 55, 40, 72, 58, 85, 70, 62, 90, 75, 88, 95].map(
    (p, i) => p + Math.sin(i + idx * 1.3) * 8,
  );
  const w = 340, h = 180, pad = 24;
  const xs = pts.map((_, j) => pad + j * ((w - 2 * pad) / (pts.length - 1)));
  const ys = pts.map(p => h - pad - (p * (h - 2 * pad)) / 100);
  const line = xs.map((x, j) => `${j === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[j].toFixed(1)}`).join(' ');
  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${(h - pad).toFixed(1)} L${xs[0].toFixed(1)},${(h - pad).toFixed(1)} Z`;
  const peakIdx = pts.indexOf(Math.max(...pts));
  return (
    <svg viewBox="0 0 340 180" fill="none" className="w-full h-full" shapeRendering="optimizeSpeed">
      <defs>
        <linearGradient id={`ag-viz-${idx}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#ag-viz-${idx})`} />
      <path d={line} stroke={accent} strokeWidth="1.5" strokeOpacity="0.75" />
      <circle cx={xs[peakIdx]} cy={ys[peakIdx]} r="3.5" fill={accent} fillOpacity="0.9" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={accent} fillOpacity="0.7" />
    </svg>
  );
});

const VizRings = React.memo(({ accent, idx }: VizProps) => {
  const secondAccent = '#D4891A';
  const pct1 = 68 + (idx * 7) % 24;
  const pct2 = 48 + (idx * 11) % 34;
  const r1 = 56, r2 = 40, cx = 170, cy = 90;
  const arc = (r: number, pct: number) => {
    const a = (pct / 100) * 2 * Math.PI;
    const x1 = cx, y1 = cy - r;
    const x2 = cx + r * Math.sin(a), y2 = cy - r * Math.cos(a);
    const lg = a > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${r},${r},0,${lg},1,${x2.toFixed(2)},${y2.toFixed(2)}`;
  };
  return (
    <svg viewBox="0 0 340 180" fill="none" className="w-full h-full" shapeRendering="optimizeSpeed">
      <circle cx={cx} cy={cy} r={r1} stroke="currentColor" strokeOpacity="0.07" strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r2} stroke="currentColor" strokeOpacity="0.07" strokeWidth="6" />
      <path d={arc(r1, pct1)} stroke={accent} strokeWidth="8" strokeLinecap="round" strokeOpacity="0.8" />
      <path d={arc(r2, pct2)} stroke={secondAccent} strokeWidth="6" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
});

const VizStream = React.memo(({ accent, idx }: VizProps) => {
  const bars = Array.from({ length: 12 }, (_, j) => ({
    x: 20 + j * 26,
    h: 18 + Math.abs(Math.sin(j * 1.1 + idx * 1.2)) * 60 + (j % 2) * 15,
  }));
  return (
    <svg viewBox="0 0 340 180" fill="none" className="w-full h-full" shapeRendering="optimizeSpeed">
      {bars.map((b, j) => (
        <rect
          key={j}
          x={b.x}
          y={150 - b.h}
          width="16"
          height={b.h}
          rx="3"
          fill={accent}
          fillOpacity={0.12 + (b.h / 90) * 0.35}
        />
      ))}
    </svg>
  );
});

export const ProjectViz = ({ viz, idx, accentColor }: { viz?: VizType, idx: number, accentColor?: string }) => {
  // Use HSL if accentColor is provided, else fallback to crimson/gold toggle
  const accent = accentColor 
    ? `hsla(${accentColor}, 70%, 50%, 0.8)`
    : (idx % 2 === 0 ? '#7C5CFC' : '#00D4FF');

  if (viz === 'nodes') return <VizNodes accent={accent} />;
  if (viz === 'chart') return <VizChart accent={accent} idx={idx} />;
  if (viz === 'rings') return <VizRings accent={accent} idx={idx} />;
  if (viz === 'stream') return <VizStream accent={accent} idx={idx} />;
  return null;
};
