// ── Pulse dot ───────────────────────────────────────────────────────────────
const PulseDot = ({ color = 'crimson' }: { color?: string }) => (
  <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
    <span
      className="absolute inline-flex w-full h-full rounded-full opacity-40 animate-ping"
      style={{ background: `hsl(var(--${color}))` }}
    />
    <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: `hsl(var(--${color}))` }} />
  </span>
);

export default PulseDot;
