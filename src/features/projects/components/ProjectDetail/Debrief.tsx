import { motion } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import GlowText from './GlowText';

// ── Debrief — Zen alternating pull quotes ───────────────────────────────────────
const Debrief = ({ learnings }: { learnings: string[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-12">
      {learnings.map((learning, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="group relative"
        >
          <GlowText className={`p-8 rounded-3xl border transition-[border-color,background-color,box-shadow] duration-700 ${isDark ? 'border-foreground/5 hover:border-foreground/10 bg-transparent' : 'border-foreground/[0.05] hover:border-foreground/[0.1] bg-foreground/[0.01] shadow-sm'}`}>
            <div className="flex gap-6">
              <span className="font-mono text-[10px] text-foreground/20 mt-2 uppercase tracking-[0.2em] font-bold">Log {String(i + 1).padStart(2, '0')}</span>
              <p className={`text-xl leading-relaxed font-light transition-colors ${isDark ? 'text-foreground/70 group-hover:text-foreground/90' : 'text-foreground/70 group-hover:text-foreground/100'}`}>
                {learning}
              </p>
            </div>
          </GlowText>
        </motion.div>
      ))}
    </div>
  );
};

export default Debrief;
