//src/components/sections/TechStack/SkillChip.tsx
// Clean skill chip with tooltip showing description on hover

import { ICON_MAP, SKILLS } from './constants';

const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

interface SkillChipProps {
  name: string;
  accentColor: string;
  description: string;
}

export const SkillChip = ({ name, accentColor, description }: SkillChipProps) => (
  <div className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-xl cursor-default select-none shrink-0">
    {/* Icon */}
    <div className="relative shrink-0">
      <img
        src={BASE + ICON_MAP[name]}
        alt={name}
        width={24}
        height={24}
        loading="lazy"
        draggable={false}
        className="object-contain block transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    {/* Name */}
    <span className="text-[12px] font-medium text-foreground leading-none whitespace-nowrap">
      {name}
    </span>

    {/* Tooltip - shows on hover */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
      <div className="bg-card border border-border rounded-lg px-3 py-2 min-w-[180px] shadow-xl">
        {/* Accent top border */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
          style={{ backgroundColor: accentColor }}
        />
        {/* Skill name */}
        <div className="font-playfair text-[13px] font-bold text-foreground mb-1">
          {name}
        </div>
        {/* Description */}
        <div className="font-mono text-[9px] tracking-[.08em] uppercase text-muted-foreground/80 leading-relaxed">
          {description}
        </div>
        {/* Small arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[7px]">
          <div className="w-3 h-3 bg-card border-r border-b border-border rotate-45" />
        </div>
      </div>
    </div>
  </div>
);
