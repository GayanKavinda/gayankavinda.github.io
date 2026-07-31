import { motion } from 'framer-motion';
import { ICON_MAP } from './constants';

const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';

interface SkillChipProps {
  name: string;
}

export const SkillChip = ({ name }: SkillChipProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      className="group flex flex-col items-center gap-2.5 px-5 py-4 bg-card/90 backdrop-blur-md border border-border rounded-xl cursor-default select-none shrink-0 transition-colors duration-300 hover:border-primary/30"
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 p-1.5">
        <img
          src={BASE + ICON_MAP[name]}
          alt={name}
          width={24}
          height={24}
          loading="lazy"
          draggable={false}
          className="object-contain block grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
      </div>
      <span className="text-[11px] font-medium text-foreground leading-none whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  );
};