// ── Helper components ─────────────────────────────────────────────────────────

const Section = ({ children }: any) => (
  <section className="flex flex-col gap-5">
    {children}
  </section>
);

const SectionHead = ({ children }: any) => (
  <h2 className="font-sans text-[22px] font-bold tracking-[-0.01em] text-foreground">
    {children}
  </h2>
);

const FactRow = ({ items }: any) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-lg border border-foreground/10 bg-foreground/5">
    {items.map(([label, value]: [string, string], i: number) => (
      <div key={i} className="bg-background px-4 py-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/40">
          {label}
        </div>
        <div className="mt-1 text-[14px] text-foreground/80">{value}</div>
      </div>
    ))}
  </div>
);

const Tag = ({ children }: any) => (
  <span className="rounded-md border border-foreground/15 bg-foreground/[0.03] px-3 py-1.5 font-mono text-[12px] text-foreground/70">
    {children}
  </span>
);

const Node = ({ name, role }: any) => (
  <span className="rounded-full border border-foreground/15 bg-foreground/[0.04] px-3 py-1 font-mono text-[12px] text-foreground/70">
    {name}
    {role && <span className="text-foreground/40"> · {role}</span>}
  </span>
);

const Phase = ({ phase, duration, desc }: any) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">
        {phase}
      </span>
      <span className="font-mono text-[10px] text-foreground/35">{duration}</span>
    </div>
    <p className="text-[14px] leading-relaxed text-foreground/65">{desc}</p>
  </div>
);

const Learning = ({ text, index }: any) => (
  <li className="flex gap-3 text-[14px] leading-relaxed text-foreground/75">
    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/50" />
    <span><span className="font-mono text-[10px] text-foreground/35 mr-2">0{index + 1}</span>{text}</span>
  </li>
);

const LinkBtn = ({ href, children, cursor }: any) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/[0.03] px-3.5 py-1.5 font-mono text-[12px] text-foreground/75 transition hover:border-foreground/25 hover:bg-foreground/[0.06]"
    data-cursor={cursor}
  >
    {children}
  </a>
);

// ── Main component ───────────────────────────────────────────────────────────

const ProjectContent = ({ project, onOpenImage }: any) => {
  const hasCode = !!(project.github && project.github !== '#');
  const hasDoc = !!(project.docUrl && project.docUrl !== '#');
  const hasLive = !!project.liveUrl;
  const hasShots = (project.screenshots ?? []).length > 0;
  const hasVideos = (project.videoLinks ?? []).length > 0;
  const hasTimeline = Array.isArray(project.timeline) && project.timeline.length > 0;
  const hasImpact = project.metrics?.length > 0;
  const hasArchitecture = project.architecture?.components?.length > 0;

  return (
    <div className="flex flex-col gap-20">
      {/* ── Overview + Facts + Links ── */}
      <Section>
        <SectionHead>Overview</SectionHead>
        <p className="text-[15px] leading-[1.75] text-foreground/75 mb-6">
          {project.overview}
        </p>
        <FactRow
          items={[
            ['Role', project.role],
            ['Team', project.team],
            ['Duration', project.duration],
            ['Year', project.year],
          ]}
        />
        {(hasLive || hasCode || hasDoc || hasVideos) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {hasLive && <LinkBtn href={project.liveUrl} cursor="LIVE">Live demo →</LinkBtn>}
            {hasCode && <LinkBtn href={project.github} cursor="SOURCE">Source ↗</LinkBtn>}
            {hasDoc && <LinkBtn href={project.docUrl} cursor="DOCS">Case study ↗</LinkBtn>}
            {project.videoLinks?.map((v: any, i: number) => (
              <LinkBtn key={i} href={v.url}>▶ {v.title}</LinkBtn>
            ))}
          </div>
        )}
      </Section>

      {/* ── Screenshots / Videos ── */}
      {hasShots && (
        <Section>
          <SectionHead>Evidence</SectionHead>
          <p className="text-[14px] leading-relaxed text-foreground/60 mb-5">
            Visual artifacts and demonstrations from the project.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.screenshots.map((shot: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => onOpenImage?.(idx)}
                className="group relative overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.01] text-left transition hover:border-foreground/15"
              >
                <img
                  src={shot.lightImage || shot.image}
                  alt={shot.caption || `Screenshot ${idx + 1}`}
                  className="w-full aspect-[16/10] object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-white text-sm font-medium">
                    {shot.caption || `Screenshot ${idx + 1}`} →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* ── Impact Metrics ── */}
      {hasImpact && (
        <Section>
          <SectionHead>Impact</SectionHead>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl border border-foreground/10 bg-foreground/5">
            {project.metrics.map((m: any, i: number) => (
              <div key={i} className="bg-background px-6 py-5">
                <div className="font-mono text-3xl font-semibold tabular-nums text-gold">
                  {m.value}{m.suffix}
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Architecture ── */}
      {hasArchitecture && (
        <Section>
          <SectionHead>Architecture</SectionHead>
          {project.architecture?.description && (
            <p className="text-[14px] leading-relaxed text-foreground/60 mb-5">
              {project.architecture.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {project.architecture.components.map((c: any, i: number) => (
              <Node key={c.name} name={c.name} role={c.role} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Mission ── */}
      <Section>
        <SectionHead>Mission</SectionHead>
        <p className="text-[15px] leading-[1.75] text-foreground/75 italic">
          {project.solution}
        </p>
      </Section>

      {/* ── Stack ── */}
      <Section>
        <SectionHead>Technology Stack</SectionHead>
        <div className="flex flex-wrap gap-2">
          {(project.tags ?? []).map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </Section>

      {/* ── Timeline ── */}
      {hasTimeline && (
        <Section>
          <SectionHead>Execution Timeline</SectionHead>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
            {project.timeline.map((p: any) => (
              <Phase key={p.phase} phase={p.phase} duration={p.duration} desc={p.desc} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Retrospective ── */}
      <Section>
        <SectionHead>Retrospective</SectionHead>
        <ol className="flex flex-col gap-4">
          {(project.learnings ?? []).map((t: string, i: number) => (
            <Learning key={i} text={t} index={i} />
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default ProjectContent;
export { Section, SectionHead, FactRow, Tag, Node, Phase, Learning, LinkBtn };