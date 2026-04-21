//src/components/sections/EngineeringPhilosophy/mockups/ObservabilityMockup.tsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ObservabilityMockup = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start: 'top 85%',
          once: true,
        },
      });

      // Bars grow upward
      tl.fromTo(
        '.obs-bar',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
        },
        0
      );

      // Sparkline draws on
      svg.querySelectorAll('.obs-sparkline').forEach((line) => {
        const length = (line as SVGPolylineElement).getTotalLength?.() || 300;
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.out',
          },
          0.2
        );
      });

      // Pulse dot — infinite
      tl.to(
        '.obs-dot',
        {
          opacity: 0.5,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
        0
      );
    }, svgRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      {/* Background */}
      <rect width="280" height="160" rx="10" fill="#f9f9fb" />

      {/* Top bar */}
      <rect width="280" height="28" rx="10" fill="#fff" />
      <rect y="18" width="280" height="10" fill="#fff" />
      <circle
        cx="16" cy="14" r="4"
        fill="#7C5CFC" opacity="0.7"
        className="obs-dot"
      />
      <rect x="26" y="10" width="50" height="8" rx="3" fill="#ececec" />
      <rect x="218" y="10" width="44" height="8" rx="3" fill="#00D4FF" opacity="0.22" />

      {/* Stat cards */}
      <rect x="10" y="36" width="72" height="30" rx="6"
        fill="#fff" stroke="#ececec" strokeWidth="0.8" />
      <rect x="14" y="42" width="28" height="4" rx="2" fill="#ddd" />
      <rect x="14" y="50" width="44" height="8" rx="3" fill="#7C5CFC" opacity="0.72" />

      <rect x="92" y="36" width="72" height="30" rx="6"
        fill="#fff" stroke="#ececec" strokeWidth="0.8" />
      <rect x="96" y="42" width="28" height="4" rx="2" fill="#ddd" />
      <rect x="96" y="50" width="44" height="8" rx="3" fill="#00D4FF" opacity="0.62" />

      <rect x="174" y="36" width="72" height="30" rx="6"
        fill="#fff" stroke="#ececec" strokeWidth="0.8" />
      <rect x="178" y="42" width="28" height="4" rx="2" fill="#ddd" />
      <rect x="178" y="50" width="44" height="8" rx="3" fill="#22c55e" opacity="0.62" />

      {/* Chart area */}
      <rect x="10" y="76" width="260" height="72" rx="6"
        fill="#fff" stroke="#ececec" strokeWidth="0.8" />

      {/* Bars — GSAP animated via class */}
      {[
        { x: 24,  y: 108, h: 28, opacity: 0.58 },
        { x: 50,  y: 100, h: 36, opacity: 0.72 },
        { x: 76,  y: 92,  h: 44, opacity: 0.82 },
        { x: 102, y: 98,  h: 38, opacity: 0.68 },
        { x: 128, y: 88,  h: 48, opacity: 0.88 },
      ].map((bar, i) => (
        <rect
          key={i}
          className="obs-bar"
          x={bar.x}
          y={bar.y}
          width="16"
          height={bar.h}
          rx="2"
          fill="#7C5CFC"
          opacity={bar.opacity}
          style={{
            transformOrigin: `${bar.x + 8}px ${bar.y + bar.h}px`,
          }}
        />
      ))}

      {/* Sparklines */}
      <polyline
        className="obs-sparkline"
        points="20,130 46,118 72,110 98,115 124,105 150,112 176,98 202,106 228,94 254,100"
        stroke="#00D4FF"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        className="obs-sparkline"
        points="20,136 46,132 72,128 98,130 124,124 150,128 176,120 202,124 228,118 254,121"
        stroke="#00D4FF"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 2"
      />
    </svg>
  );
};


