import React, { useState } from 'react';

// ── Redacted text reveal ─────────────────────────────────────────────────────
const Redacted = ({ children }: { children: string }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      onClick={() => setRevealed(true)}
      data-cursor={revealed ? '' : 'REVEAL'}
      className="relative inline-block cursor-pointer group"
    >
      <span className={`transition-all duration-500 ${revealed ? 'blur-0 opacity-100' : 'blur-sm opacity-0 select-none'}`}>
        {children}
      </span>
      {!revealed && (
        <span
          className="absolute inset-0 rounded-sm flex items-center"
          style={{ background: 'hsl(var(--foreground) / 0.85)' }}
        />
      )}
    </span>
  );
};

export default Redacted;
