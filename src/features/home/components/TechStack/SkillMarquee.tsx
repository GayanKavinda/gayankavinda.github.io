// src/components/sections/TechStack/SkillMarquee.tsx
// Premium infinite marquee with gradient fades and hover tooltips
// Row 1: Frontend + Backend (scrolls left)
// Row 2: Infrastructure + Data (scrolls right)

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SkillChip } from './SkillChip';
import { CAT_META, SKILLS } from './constants';

const ROW_1 = SKILLS.filter(s => s.cat === 'fe' || s.cat === 'be');
const ROW_2 = SKILLS.filter(s => s.cat === 'infra' || s.cat === 'data');


export const SkillMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-50px' });

  const MarqueeRow = ({ skills, direction }: { skills: typeof ROW_1; direction: 'left' | 'right' }) => (
    <div className="flex w-max">
      <div 
        className={`flex gap-3 px-1.5 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationPlayState: isInView ? 'running' : 'paused' }}
      >
        {skills.map((s, i) => (
          <SkillChip
            key={`${s.name}-${i}`}
            name={s.name}
            accentColor={CAT_META[s.cat].color}
            description={s.desc}
          />
        ))}
      </div>
      <div 
        className={`flex gap-3 px-1.5 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationPlayState: isInView ? 'running' : 'paused' }}
      >
        {skills.map((s, i) => (
          <SkillChip
            key={`${s.name}-${i}-dup`}
            name={s.name}
            accentColor={CAT_META[s.cat].color}
            description={s.desc}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-hidden py-10 md:pt-16 md:pb-32"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 400px'
      }}
    >
      <div className="space-y-12">
        <MarqueeRow skills={ROW_1} direction="left" />
        <MarqueeRow skills={ROW_2} direction="right" />
      </div>
    </div>
  );
};
