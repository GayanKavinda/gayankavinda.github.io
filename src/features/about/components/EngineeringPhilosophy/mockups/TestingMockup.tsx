//src/components/sections/EngineeringPhilosophy/mockups/TestingMockup.tsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TestingMockup = () => {
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

      // Test rows slide in
      tl.from('.tst-row', {
        opacity: 0,
        x: -8,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.18,
      }, 0);

      // Progress bar grows
      tl.from('.tst-progress', {
        scaleX: 0,
        duration: 0.8,
        ease: 'power2.out',
        transformOrigin: 'left center',
      }, 0.6);
    }, svgRef.current!);

    return () => ctx.revert();
  }, []);

  const rows = [
    { y: 35,  pass: true,  w: 80 },
    { y: 52,  pass: true,  w: 100 },
    { y: 69,  pass: false, w: 92 },
    { y: 86,  pass: true,  w: 76 },
    { y: 103, pass: true,  w: 110 },
  ];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <rect width="280" height="160" rx="10" fill="#f6faf6" />
      <rect width="280" height="26" rx="10" fill="#fff" />
      <rect y="16" width="280" height="10" fill="#fff" />
      <rect x="12" y="9" width="60" height="7" rx="3" fill="#e0e0e0" />
      <rect x="202" y="8" width="66" height="10" rx="5" fill="#22c55e" opacity="0.18" />
      <rect x="214" y="10" width="42" height="5" rx="2" fill="#22c55e" opacity="0.7" />

      {rows.map((r, i) => (
        <g key={i} className="tst-row">
          <circle
            cx="22" cy={r.y + 6} r="6"
            fill={r.pass ? '#22c55e' : '#7C5CFC'}
            opacity={r.pass ? 0.8 : 0.85}
          />
          {r.pass ? (
            <polyline
              points={`${18},${r.y + 6} ${21},${r.y + 9} ${26},${r.y + 3}`}
              stroke="#fff" strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
            />
          ) : (
            <>
              <line x1="18" y1={r.y + 3} x2="26" y2={r.y + 9}
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1={r.y + 3} x2="18" y2={r.y + 9}
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
          <rect x="36" y={r.y + 2} width={r.w} height="6" rx="2"
            fill="#d0d0d0" opacity="0.85" />
          <rect x={r.w + 44} y={r.y + 2}
            width={r.pass ? 30 : 48} height="6" rx="2"
            fill={r.pass ? '#00D4FF' : '#7C5CFC'} opacity="0.4" />
          <rect x="236" y={r.y + 2} width="34" height="6" rx="2" fill="#e8e8e8" />
        </g>
      ))}

      {/* Progress bar track */}
      <rect x="12" y="128" width="256" height="6" rx="3" fill="#e8e8e8" />
      <rect className="tst-progress"
        x="12" y="128" width="200" height="6" rx="3"
        fill="#22c55e" opacity="0.55" />

      <rect x="12" y="140" width="40" height="5" rx="2" fill="#22c55e" opacity="0.4" />
      <rect x="58" y="140" width="30" height="5" rx="2" fill="#7C5CFC" opacity="0.4" />
      <rect x="94" y="140" width="50" height="5" rx="2" fill="#d0d0d0" />
    </svg>
  );
};


