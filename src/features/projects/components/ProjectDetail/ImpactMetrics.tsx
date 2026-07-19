import { motion } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// ── New Impact Metrics Section ──────────────────────────────────────────────
const ImpactMetrics = ({ metrics }: { metrics: Array<{ label: string; value: string; suffix?: string }> }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full items-center">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center group"
        >
          <div className={`font-mono text-3xl md:text-4xl font-bold mb-2 tabular-nums ${isDark ? 'text-crimson' : 'text-foreground/80'}`}>
            {metric.value}{metric.suffix}
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold group-hover:text-foreground/60 transition-colors">
            {metric.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ImpactMetrics;
