// src/components/sections/TechStack/SkillMarquee.tsx
// Premium infinite marquee with gradient fades and hover tooltips
// Row 1: Frontend + Backend (scrolls left)
// Row 2: Infrastructure + Data (scrolls right)

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { SkillChip } from './SkillChip';
import { SKILLS } from './constants';

export const SkillMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-50px' });

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden py-10"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
      }}
    >
      <div className="flex w-max">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className="flex gap-3 px-1.5 animate-marquee-left"
            style={{ animationPlayState: isInView ? 'running' : 'paused' }}
          >
            {SKILLS.map((s, i) => (
              <SkillChip key={`${s.name}-${dup}-${i}`} name={s.name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};