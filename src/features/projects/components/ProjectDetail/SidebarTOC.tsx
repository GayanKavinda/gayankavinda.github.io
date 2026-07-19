import { motion } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// ── Sticky TOC — left rail ───────────────────────────────────────────────────
export const SECTIONS = [
  { id: 'overview',  label: 'ZEN',       num: '00' },
  { id: 'problem',   label: 'MISSION',   num: '01' },
  { id: 'system',    label: 'SCHEMA',    num: '02' },
  { id: 'impact',    label: 'IMPACT',    num: '03' },
  { id: 'evidence',  label: 'VIEW',      num: '04' },
  { id: 'timeline',  label: 'LOG',       num: '05' },
  { id: 'debrief',   label: 'WRAP',      num: '06' },
];

const SidebarTOC = ({ active }: { active: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside className="hidden xl:flex flex-col sticky top-32 w-[80px] shrink-0 self-start">
      <div className="flex flex-col gap-1">
        {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{ textDecoration: 'none' }}
            className="group flex items-center gap-2 py-2 px-2 rounded-md transition-colors hover:bg-foreground/[0.03]"
          >
            <span
              className="font-mono text-[11px] transition-colors"
              style={{ color: isActive ? 'hsl(var(--crimson))' : (isDark ? 'hsl(var(--foreground) / 0.35)' : 'hsl(var(--foreground) / 0.5)') }}
            >
              {s.num}
            </span>
            <motion.div
              className="h-px transition-all"
              animate={{
                width: isActive ? 20 : 8,
                background: isActive ? 'hsl(var(--crimson))' : (isDark ? 'hsl(var(--foreground) / 0.12)' : 'hsl(var(--foreground) / 0.2)'),
              }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors font-bold"
              style={{ color: isActive ? (isDark ? 'hsl(var(--foreground) / 0.9)' : 'hsl(var(--foreground) / 0.8)') : (isDark ? 'hsl(var(--foreground) / 0.4)' : 'hsl(var(--foreground) / 0.3)') }}
            >
              {s.label}
            </span>
          </a>
        );
        })}
      </div>
    </aside>
  );
};

export default SidebarTOC;
