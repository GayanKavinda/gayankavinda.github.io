import { useTheme } from '@app/providers/theme-provider';

// ── Action Links (Zen Style) ─────────────────────────────────────────────
const ProjectActions = ({ project, hasCode, hasDoc, hasLive }: any) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="flex flex-col gap-3 h-full justify-center">
      {hasCode && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="SOURCE"
          className={`inline-flex w-full items-center justify-between gap-3 px-6 py-3 rounded-xl border transition-all group ${isDark ? 'border-foreground/20 hover:border-foreground/40' : 'border-foreground/10 bg-white/50 hover:border-foreground/20 shadow-sm hover:shadow-md'}`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] font-bold">Source Code</span>
          <span className="text-xl group-hover:rotate-12 transition-transform opacity-50">↗</span>
        </a>
      )}

      {hasDoc && (
        <a
          href={project.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="DOCS"
          className={`inline-flex w-full items-center justify-between gap-3 px-6 py-3 rounded-xl border transition-all ${isDark ? 'border-foreground/20 hover:border-foreground/40' : 'border-foreground/10 bg-white/50 hover:border-foreground/20 shadow-sm hover:shadow-md'}`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] font-bold">Case Study</span>
        </a>
      )}

      {hasLive && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="LIVE"
          className={`inline-flex w-full items-center justify-between gap-3 px-6 py-3 rounded-xl transition-all font-bold ${isDark ? 'bg-foreground text-background hover:bg-crimson' : 'bg-foreground text-background hover:opacity-90 shadow-lg hover:shadow-xl'}`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em]">Live Demo</span>
          <span>→</span>
        </a>
      )}
    </div>
  );
};

export default ProjectActions;
