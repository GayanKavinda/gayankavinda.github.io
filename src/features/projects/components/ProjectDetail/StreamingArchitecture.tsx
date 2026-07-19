import { motion } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// ── Real-time Streaming Architecture (Zen) ──────────────────────────────────
const StreamingArchitecture = ({ components, description }: {
  components: { name: string; role: string; detail?: string }[];
  description: string;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-3xl mx-auto space-y-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 mb-6">
          <span className="text-[10px] font-mono tracking-widest text-crimson font-bold uppercase">Technical Schema</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-light tracking-tight" style={{ textWrap: 'balance' }}>{description}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {components.map((comp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group p-6 md:p-8 rounded-3xl border transition-[transform,border-color,box-shadow,background-color] duration-500 hover:-translate-y-1 ${isDark ? 'border-foreground/10 hover:border-foreground/20' : 'border-foreground/10 bg-foreground/[0.01] hover:border-foreground/15 shadow-sm hover:shadow-md'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-6 transition-all group-hover:scale-125 ${isDark ? 'bg-white' : 'bg-foreground/40'}`} />
            <h4 className="text-xl font-medium mb-3 tracking-tight">{comp.name}</h4>
            <p className="text-foreground/70 leading-relaxed font-light">{comp.role}</p>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 border-t border-foreground/10 text-center text-[11px] font-mono text-foreground/40 tracking-widest uppercase">
        Engineered for performance • Zero-downtime scalability
      </div>
    </div>
  );
};

export default StreamingArchitecture;
