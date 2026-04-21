//src/components/sections/EngineeringPhilosophy/mockups/SimplicityMockup.tsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SimplicityMockup = () => {
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

      // Code lines fade in sequentially
      tl.from('.sim-line', {
        opacity: 0,
        x: -6,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.18,
      }, 0);

      // Cursor blink — infinite
      tl.to('.sim-cursor', {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      }, 1.3);
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
      <rect width="280" height="160" rx="10" fill="#1a1b26" />
      <rect width="280" height="24" rx="10" fill="#24253a" />
      <rect y="14" width="280" height="10" fill="#24253a" />
      <circle cx="18" cy="12" r="4" fill="#ff5f57" />
      <circle cx="32" cy="12" r="4" fill="#febc2e" />
      <circle cx="46" cy="12" r="4" fill="#28c840" />
      <rect x="96" y="8" width="88" height="8" rx="3" fill="#32334a" />

      <g className="sim-line">
        <rect x="14" y="33" width="18" height="6" rx="2" fill="#7C5CFC" opacity="0.85" />
        <rect x="38" y="33" width="50" height="6" rx="2" fill="#00D4FF" opacity="0.8" />
        <rect x="94" y="33" width="34" height="6" rx="2" fill="#7ec8a0" opacity="0.7" />
      </g>
      <g className="sim-line">
        <rect x="24" y="47" width="14" height="6" rx="2" fill="#7ec8a0" opacity="0.6" />
        <rect x="44" y="47" width="70" height="6" rx="2" fill="#8888b0" />
        <rect x="120" y="47" width="28" height="6" rx="2" fill="#7C5CFC" opacity="0.55" />
      </g>
      <g className="sim-line">
        <rect x="24" y="61" width="90" height="6" rx="2" fill="#8888b0" />
        <rect x="120" y="61" width="46" height="6" rx="2" fill="#00D4FF" opacity="0.6" />
      </g>
      <g className="sim-line">
        <rect x="14" y="75" width="14" height="6" rx="2" fill="#7ec8a0" opacity="0.6" />
        <rect x="34" y="75" width="38" height="6" rx="2" fill="#8888b0" />
      </g>
      <g className="sim-line">
        <rect x="14" y="89" width="18" height="6" rx="2" fill="#7C5CFC" opacity="0.7" />
        <rect x="38" y="89" width="56" height="6" rx="2" fill="#00D4FF" opacity="0.65" />
        <rect x="100" y="89" width="40" height="6" rx="2" fill="#8888b0" />
      </g>
      <g className="sim-line">
        <rect x="24" y="103" width="80" height="6" rx="2" fill="#8888b0" />
        <rect x="110" y="103" width="22" height="6" rx="2" fill="#7ec8a0" opacity="0.6" />
      </g>

      <rect x="160" y="101" width="100" height="14" rx="5" fill="#00D4FF" opacity="0.12" />
      <rect x="166" y="104" width="60" height="5" rx="2" fill="#00D4FF" opacity="0.5" />
      <rect
        className="sim-cursor"
        x="134" y="103" width="2" height="8" rx="1"
        fill="#fff" opacity="0.7"
      />
      <rect x="0" y="148" width="280" height="12" fill="#1e1f30" />
      <rect x="10" y="151" width="30" height="5" rx="2" fill="#22c55e" opacity="0.45" />
      <rect x="220" y="151" width="44" height="5" rx="2" fill="#8888b0" opacity="0.5" />
    </svg>
  );
};


