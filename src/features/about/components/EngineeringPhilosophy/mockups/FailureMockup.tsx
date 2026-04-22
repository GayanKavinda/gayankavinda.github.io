//src/components/sections/EngineeringPhilosophy/mockups/FailureMockup.tsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const FailureMockup = () => {
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

      // Broken node pulses
      tl.to('.fail-broken', {
        opacity: 0.32,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }, 0);

      // Arrows draw on
      tl.from('.fail-arrow', {
        strokeDashoffset: 24,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.3,
      }, 0.2);

      // Badges slide up
      tl.from('.fail-badge', {
        opacity: 0,
        y: 6,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.15,
      }, 1.0);
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
      <defs>
        <marker id="fa" viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#ccc"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="fad" viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#7C5CFC"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      <rect width="280" height="160" rx="10" className="mockup-bg" />
      <rect width="280" height="26" rx="10" className="mockup-panel" />
      <rect y="16" width="280" height="10" className="mockup-panel" />
      <rect x="12" y="9" width="72" height="7" rx="3" fill="currentColor" className="text-foreground/5 opacity-50" />
      <rect x="238" y="7" width="32" height="12" rx="5" fill="#7C5CFC" opacity="0.12" />
      <rect x="244" y="10" width="20" height="5" rx="2" fill="#7C5CFC" opacity="0.45" />

      {/* Node A */}
      <rect x="12" y="42" width="64" height="36" rx="7"
        className="mockup-panel" stroke="#00D4FF" strokeWidth="1.2" />
      <rect x="18" y="50" width="40" height="5" rx="2" fill="#00D4FF" opacity="0.45" />
      <rect x="18" y="60" width="28" height="5" rx="2" fill="currentColor" className="text-foreground/10" />

      {/* Arrow A→B */}
      <line className="fail-arrow" x1="78" y1="60" x2="102" y2="60"
        stroke="#ccc" strokeWidth="1.5" markerEnd="url(#fa)"
        strokeDasharray="24" strokeDashoffset="0" />

      {/* Node B — broken */}
      <g className="fail-broken" opacity="0.85">
        <rect x="104" y="42" width="64" height="36" rx="7"
          fill="rgba(124, 92, 252, 0.05)" stroke="#7C5CFC" strokeWidth="1.2" strokeDasharray="4 2" />
        <rect x="110" y="50" width="40" height="5" rx="2" fill="#7C5CFC" opacity="0.45" />
        <rect x="110" y="60" width="28" height="5" rx="2" fill="currentColor" className="text-foreground/10" />
        <text x="157" y="51" fontSize="11" fill="#7C5CFC" fontFamily="monospace">✕</text>
      </g>

      {/* Arrow B→C */}
      <line className="fail-arrow" x1="170" y1="60" x2="194" y2="60"
        stroke="#7C5CFC" strokeWidth="1.5" strokeDasharray="4 3"
        markerEnd="url(#fad)" />

      {/* Node C — fallback */}
      <rect x="196" y="42" width="72" height="36" rx="7"
        fill="rgba(34, 197, 94, 0.05)" stroke="#22c55e" strokeWidth="1.2" />
      <rect x="202" y="50" width="44" height="5" rx="2" fill="#22c55e" opacity="0.45" />
      <rect x="202" y="60" width="28" height="5" rx="2" fill="currentColor" className="text-foreground/10" />
      <text x="252" y="51" fontSize="11" fill="#22c55e" fontFamily="monospace">↩</text>

      {/* Badges */}
      <g className="fail-badge">
        <rect x="12" y="92" width="64" height="16" rx="6"
          fill="#00D4FF" opacity="0.1" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity="0.3" />
        <rect x="18" y="97" width="44" height="5" rx="2" fill="#00D4FF" opacity="0.4" />
      </g>
      <g className="fail-badge">
        <rect x="90" y="92" width="92" height="16" rx="6"
          fill="#7C5CFC" opacity="0.08" stroke="#7C5CFC" strokeWidth="0.8" strokeOpacity="0.2" />
        <rect x="96" y="97" width="60" height="5" rx="2" fill="#7C5CFC" opacity="0.35" />
      </g>
      <g className="fail-badge">
        <rect x="196" y="92" width="72" height="16" rx="6"
          fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="0.8" strokeOpacity="0.25" />
        <rect x="202" y="97" width="52" height="5" rx="2" fill="#22c55e" opacity="0.4" />
      </g>

      {/* Status row */}
      <rect x="12" y="122" width="16" height="16" rx="4" fill="#22c55e" opacity="0.15" />
      <rect x="14" y="126" width="10" height="5" rx="2" fill="#22c55e" opacity="0.6" />
      <rect x="36" y="124" width="80" height="5" rx="2" fill="currentColor" className="text-foreground/10" />
      <rect x="36" y="133" width="60" height="5" rx="2" fill="currentColor" className="text-foreground/5" />
      <rect x="202" y="122" width="66" height="16" rx="6" fill="#7C5CFC" opacity="0.07" />
      <rect x="208" y="127" width="48" height="5" rx="2" fill="#7C5CFC" opacity="0.3" />
    </svg>
  );
};


