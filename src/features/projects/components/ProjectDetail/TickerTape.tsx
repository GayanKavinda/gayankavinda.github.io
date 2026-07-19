// ── Ticker tape header ───────────────────────────────────────────────────────
const TickerTape = ({ items }: { items: string[] }) => {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-b border-t border-foreground/[0.06] py-2 relative">
      <div className="flex gap-0 ticker-inner" style={{ width: 'max-content' }}>
        {repeated.map((item, i) => (
          <span key={i} className="font-mono text-[12px] uppercase tracking-[0.2em] text-foreground/50 px-6 flex-shrink-0 flex items-center gap-6">
            {item}
            <span className="w-px h-3 bg-foreground/10 inline-block" />
          </span>
        ))}
      </div>
      <style>{`
        .ticker-inner { animation: ticker 28s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
      `}</style>
    </div>
  );
};

export default TickerTape;
