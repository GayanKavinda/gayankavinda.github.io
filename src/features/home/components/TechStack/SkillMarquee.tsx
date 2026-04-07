// src/components/sections/TechStack/SkillMarquee.tsx
// Premium infinite marquee with gradient fades and hover tooltips
// Row 1: Frontend + Backend (scrolls left)
// Row 2: Infrastructure + Data (scrolls right)

import React from 'react';
import { SkillChip } from './SkillChip';
import { CAT_META, SKILLS } from './constants';

const ROW_1 = SKILLS.filter(s => s.cat === 'fe' || s.cat === 'be');
const ROW_2 = SKILLS.filter(s => s.cat === 'infra' || s.cat === 'data');

// Duplicate items for seamless infinite loop
function renderTrackItems(skills: typeof ROW_1, keyPrefix: string) {
  return (
    <>
      {skills.map((s, i) => (
        <SkillChip
          key={`${keyPrefix}-a-${s.name}-${i}`}
          name={s.name}
          accentColor={CAT_META[s.cat].color}
          description={s.desc}
        />
      ))}
      {skills.map((s, i) => (
        <SkillChip
          key={`${keyPrefix}-b-${s.name}-${i}`}
          name={s.name}
          accentColor={CAT_META[s.cat].color}
          description={s.desc}
        />
      ))}
      {skills.map((s, i) => (
        <SkillChip
          key={`${keyPrefix}-c-${s.name}-${i}`}
          name={s.name}
          accentColor={CAT_META[s.cat].color}
          description={s.desc}
        />
      ))}
    </>
  );
}

export const SkillMarquee = () => (
  <div className="w-full overflow-hidden">
    <div className="space-y-4">
      {/* Row 1 — Frontend & Backend (scrolls left) */}
      <div>
        <div className="flex gap-3 animate-marquee-left py-2">
          {renderTrackItems(ROW_1, 'row1')}
        </div>
      </div>

      {/* Row 2 — Infrastructure & Data (scrolls right) */}
      <div>
        <div className="flex gap-3 animate-marquee-right py-2">
          {renderTrackItems(ROW_2, 'row2')}
        </div>
      </div>
    </div>
  </div>
);
