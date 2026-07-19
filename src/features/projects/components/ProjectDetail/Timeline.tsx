import { motion } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// ── Timeline — Zen version ──────────────────────────────────────────────────
const Timeline = ({ items }: { items: { duration: string; phase: string; desc: string }[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-2 bottom-2 w-px bg-foreground/[0.08]" />
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          className="relative pb-16 last:pb-0 group"
        >
          <div
            className={`absolute -left-[25px] top-[7px] w-2 h-2 rounded-full transition-colors duration-300 border ${isDark ? 'bg-foreground/20 border-white/10' : 'bg-foreground/10 border-foreground/5'}`}
            style={{ background: isDark ? 'hsl(var(--background))' : '#fafafa' }}
          />
          <div className="flex flex-col gap-2">
            <span className={`font-mono text-[11px] uppercase tracking-widest ${isDark ? 'text-foreground/40' : 'text-foreground/50'}`}>
              {item.duration}
            </span>
            <h5 className="text-xl font-medium tracking-tight mb-2">
              {item.phase}
            </h5>
            <p className={`text-[16px] leading-[1.8] font-medium max-w-[640px] ${isDark ? 'text-foreground/60' : 'text-foreground/70'}`}>
              {item.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
