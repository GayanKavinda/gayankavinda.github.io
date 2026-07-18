import { motion } from 'framer-motion';
import { ICON_MAP } from './constants';

const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';

interface SkillChipProps {
  name: string;
  accentColor: string;
  description: string;
}

export const SkillChip = ({ name, accentColor, description }: SkillChipProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 bg-card/90 backdrop-blur-md border border-border rounded-xl cursor-default select-none shrink-0 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:z-50"
    >
      {/* Glow Drift Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 0% 0%, ${accentColor}15 0%, transparent 50%)`,
            `radial-gradient(circle at 100% 100%, ${accentColor}15 0%, transparent 50%)`,
            `radial-gradient(circle at 0% 0%, ${accentColor}15 0%, transparent 50%)`,
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Icon */}
      <div className="relative shrink-0">
        <motion.img
          src={BASE + ICON_MAP[name]}
          alt={name}
          width={24}
          height={24}
          loading="lazy"
          draggable={false}
          className="object-contain block"
          whileHover={{ rotate: 8, scale: 1.1 }}
        />
      </div>

      {/* Name */}
      <span className="relative z-10 text-[12px] font-medium text-foreground leading-none whitespace-nowrap">
        {name}
      </span>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-[100] pointer-events-none translate-y-2 group-hover:translate-y-0 group-hover:scale-105 origin-top">
        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-lg px-3 py-2 min-w-[180px] shadow-2xl relative">
          <div
            className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-lg opacity-80"
            style={{ backgroundColor: accentColor }}
          />
          <div className="font-playfair text-[13px] font-bold text-foreground mb-1">
            {name}
          </div>
          <div className="font-mono text-[9px] tracking-[.08em] uppercase text-muted-foreground/80 leading-relaxed">
            {description}
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-[7px]">
            <div className="w-3 h-3 bg-card/95 border-l border-t border-border rotate-45" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
