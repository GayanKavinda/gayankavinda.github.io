// src/features/agent/components/ChatBot.tsx
// ═══════════════════════════════════════════════════════════════════════════════
// GARA YAKA — AGENT v7.4 · Strong Purple Gradient · Fixed Light Mode Contrast
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../services/ai-service';

const GaraYakaMask = ({ size = 24, white = false }: { size?: number; white?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 48 60" fill="none">
    <defs>
      <linearGradient id="gy-mg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor={white ? 'rgba(255,255,255,0.95)' : '#ca2127'} />
        <stop offset="100%" stopColor={white ? 'rgba(255,255,255,0.7)'  : '#c09515'} />
      </linearGradient>
    </defs>
    <path d="M24 1 L20 11 L24 9 L28 11 Z"          fill="url(#gy-mg)" opacity="0.95"/>
    <path d="M16 4 L14 14 L20 11 Z"                 fill="url(#gy-mg)" opacity="0.75"/>
    <path d="M32 4 L34 14 L28 11 Z"                 fill="url(#gy-mg)" opacity="0.75"/>
    <path d="M10 7 L8 17 L15 13 Z"                  fill="url(#gy-mg)" opacity="0.5"/>
    <path d="M38 7 L40 17 L33 13 Z"                 fill="url(#gy-mg)" opacity="0.5"/>
    <path d="M8 17 Q24 12 40 17 L38 22 Q24 18 10 22 Z" fill="url(#gy-mg)" opacity="0.88"/>
    <ellipse cx="24" cy="39" rx="16" ry="19"
      fill="url(#gy-mg)" fillOpacity="0.07" stroke="url(#gy-mg)" strokeWidth="1.4"/>
    <path d="M13 29 Q18.5 25 24 26 Q29.5 25 35 29"
      stroke="url(#gy-mg)" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <ellipse cx="18" cy="33" rx="4.2" ry="2.8"
      stroke="url(#gy-mg)" strokeWidth="1.4" fill="url(#gy-mg)" fillOpacity="0.1"/>
    <circle cx="18" cy="33" r="1.5" fill="url(#gy-mg)" opacity="0.95"/>
    <ellipse cx="30" cy="33" rx="4.2" ry="2.8"
      stroke="url(#gy-mg)" strokeWidth="1.4" fill="url(#gy-mg)" fillOpacity="0.1"/>
    <circle cx="30" cy="33" r="1.5" fill="url(#gy-mg)" opacity="0.95"/>
    <path d="M22 37 L20.5 42 Q24 44 27.5 42 L26 37 Q24 38 22 37Z"
      stroke="url(#gy-mg)" strokeWidth="1.1" fill="url(#gy-mg)" fillOpacity="0.08"/>
    <path d="M16 46.5 Q24 52.5 32 46.5"
      stroke="url(#gy-mg)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M20 47.5 L21 51 L24 49 L27 51 L28 47.5"
      stroke="url(#gy-mg)" strokeWidth="0.9" fill="url(#gy-mg)" fillOpacity="0.18"/>
    <circle cx="11.5" cy="39" r="2" fill="url(#gy-mg)" opacity="0.35"/>
    <circle cx="36.5" cy="39" r="2" fill="url(#gy-mg)" opacity="0.35"/>
    <path d="M9.5 36 Q8.5 39 9.5 42"
      stroke="url(#gy-mg)" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
    <path d="M38.5 36 Q39.5 39 38.5 42"
      stroke="url(#gy-mg)" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
  </svg>
);

const Ic = ({ path, size = 15, className = '', sw = 1.75, style }: {
  path: string | string[]; size?: number; className?: string; sw?: number; style?: React.CSSProperties;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>
    {Array.isArray(path) ? path.map((d, i) => <path key={i} d={d} />) : <path d={path} />}
  </svg>
);

const P = {
  send:   'M22 2L11 13M22 2 15 22 11 13 2 9 22 2Z',
  x:      'M18 6 6 18M6 6l12 12',
  minus:  'M5 12h14',
  refresh:'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15',
  expand: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  shrink: 'M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm10 10-4-4',
  dl:     'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  vol:    'M11 5 6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07',
  mut:    'M11 5 6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6',
  mic:    'M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8',
  micOff: 'M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8',
  copy:   'M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1',
  check:  'M20 6 9 17 4 12',
  thumbU: ['M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z','M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'],
  thumbD: ['M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z','M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17'],
  arrow:  'M5 12h14M12 5l7 7-7 7',
  chevD:  'M6 9l6 6 6-6',
  star:   'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  trash:  'M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
  spark:  'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
} as const;

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 9, enabled = true) {
  const [shown, setShown] = useState(enabled ? '' : text);
  const [done, setDone]   = useState(!enabled);
  useEffect(() => {
    if (!enabled) { setShown(text); setDone(true); return; }
    setShown(''); setDone(false); let i = 0;
    const iv = setInterval(() => {
      i++; setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, enabled]);
  return { shown, done };
}

function useVoiceInput(onFinal: (t: string) => void, onInterim?: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voiceErr,  setVoiceErr]  = useState<string | null>(null);
  const recRef    = useRef<any>(null);
  const activeRef = useRef(false);
  useEffect(() => {
    setSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);
  useEffect(() => () => { try { recRef.current?.abort(); } catch (_) {} }, []);
  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch (_) {}
    activeRef.current = false; setListening(false);
  }, []);
  const toggle = useCallback(() => {
    setVoiceErr(null);
    if (!supported) { setVoiceErr('Voice not supported in this browser.'); return; }
    if (activeRef.current) { stop(); return; }
    try { recRef.current?.abort(); } catch (_) {}
    const SR  = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = true; rec.lang = 'en-US';
    rec.onstart  = () => { activeRef.current = true; setListening(true); };
    rec.onresult = (e: any) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final   += e.results[i][0].transcript;
        else                       interim += e.results[i][0].transcript;
      }
      if (interim && onInterim) onInterim(interim);
      if (final) { onFinal(final.trim()); setTimeout(stop, 80); }
    };
    rec.onerror = (e: any) => {
      if (e.error !== 'aborted')
        setVoiceErr(e.error === 'not-allowed' ? 'Mic access denied.' : 'Voice error.');
      activeRef.current = false; setListening(false);
    };
    rec.onend = () => { activeRef.current = false; setListening(false); };
    recRef.current = rec;
    try { rec.start(); } catch (_) { setVoiceErr('Could not start mic.'); }
  }, [supported, onFinal, onInterim, stop]);
  return { listening, supported, voiceErr, toggle };
}

function useResize(iW: number, iH: number, mnW: number, mnH: number, mxW: number, mxH: number) {
  const [size, setSize] = useState({ w: iW, h: iH });
  const drag   = useRef(false);
  const origin = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); drag.current = true;
    origin.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    const move = (ev: MouseEvent) => {
      if (!drag.current) return;
      setSize({
        w: Math.min(mxW, Math.max(mnW, origin.current.w + (origin.current.x - ev.clientX))),
        h: Math.min(mxH, Math.max(mnH, origin.current.h + (origin.current.y - ev.clientY))),
      });
    };
    const up = () => {
      drag.current = false;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }, [size, mnW, mnH, mxW, mxH]);
  return { size, setSize, onMouseDown };
}

// ─── RICH TEXT ────────────────────────────────────────────────────────────────

function renderRich(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|_[^_]+_)/g).map((chunk, i) => {
    if (chunk.startsWith('**') && chunk.endsWith('**'))
      return <strong key={i} className="font-semibold">{chunk.slice(2, -2)}</strong>;
    if (chunk.startsWith('`') && chunk.endsWith('`'))
      return <code key={i} style={{
        fontSize: '10.5px', padding: '1px 6px', borderRadius: '5px', fontFamily: 'DM Mono, monospace',
        background: 'rgba(168,85,247,0.12)', color: '#9333ea',
        border: '1px solid rgba(168,85,247,0.25)', display: 'inline-block',
      }}>{chunk.slice(1, -1)}</code>;
    if (chunk.startsWith('_') && chunk.endsWith('_') && !chunk.startsWith('__'))
      return <span key={i} style={{ opacity: 0.55, fontSize: '11px' }}>{chunk.slice(1, -1)}</span>;
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link)
      return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer"
        style={{ color: '#7c3aed', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
        {link[1]}
      </a>;
    return <React.Fragment key={i}>{chunk}</React.Fragment>;
  });
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

const ProjCard = ({ e }: { e: any }) => (
  <a href={e.link || '#'}
    className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300"
    style={{
      background: 'rgba(255,255,255,0.55)',
      border: '1px solid rgba(168,85,247,0.2)',
      backdropFilter: 'blur(8px)',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.background = 'rgba(255,255,255,0.85)';
      el.style.borderColor = 'rgba(168,85,247,0.45)';
      el.style.transform = 'translateY(-1px)';
      el.style.boxShadow = '0 6px 20px rgba(124,58,237,0.12)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.background = 'rgba(255,255,255,0.55)';
      el.style.borderColor = 'rgba(168,85,247,0.2)';
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = 'none';
    }}>
    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(168,85,247,0.1)' }}>
      <Ic path={P.star} size={11} style={{ color: '#9333ea' } as any} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold truncate" style={{ color: '#1e1040' }}>{e.title}</p>
      {e.metadata?.tech && (
        <p className="text-[9px] font-mono mt-0.5 truncate" style={{ color: 'rgba(124,58,237,0.5)' }}>
          {e.metadata.tech}
        </p>
      )}
    </div>
    <Ic path={P.arrow} size={10} style={{ color: 'rgba(124,58,237,0.3)', flexShrink: 0 } as any} />
  </a>
);

// ─── MINI BUTTON ──────────────────────────────────────────────────────────────

const MiniBtn = ({ onClick, active, activeColor = '#9333ea', title, children }: {
  onClick: () => void; active?: boolean; activeColor?: string;
  title?: string; children: React.ReactNode;
}) => (
  <button onClick={onClick} title={title}
    className="p-1 rounded-lg cursor-pointer transition-all duration-150"
    style={{
      color:      active ? activeColor : 'rgba(100,80,140,0.35)',
      background: active ? `${activeColor}18` : 'transparent',
    }}
    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(100,80,140,0.65)'; }}
    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(100,80,140,0.35)'; }}>
    {children}
  </button>
);

// ─── HEADER BUTTON ────────────────────────────────────────────────────────────

const HdrBtn = ({ onClick, title, active, danger, children }: {
  onClick: () => void; title: string; active?: boolean; danger?: boolean; children: React.ReactNode;
}) => (
  <button onClick={onClick} title={title}
    className="flex items-center justify-center w-6 h-6 rounded-lg cursor-pointer
      transition-all duration-200 hover:scale-105 active:scale-95"
    style={{
      color:      danger ? 'rgba(100,80,140,0.4)' : active ? '#9333ea' : 'rgba(80,60,120,0.45)',
      background: active ? 'rgba(168,85,247,0.12)' : 'transparent',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.color      = danger ? '#ef4444' : '#9333ea';
      el.style.background = danger ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.12)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.color      = danger ? 'rgba(100,80,140,0.4)' : active ? '#9333ea' : 'rgba(80,60,120,0.45)';
      el.style.background = active ? 'rgba(168,85,247,0.12)' : 'transparent';
    }}>
    {children}
  </button>
);

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────

const MsgBubble = ({ msg, idx, isLast, onRegen, onReact, onCopy }: {
  msg: ChatMessage; idx: number; isLast: boolean;
  onRegen?: () => void;
  onReact: (r: 'like' | 'dislike') => void;
  onCopy: () => void;
}) => {
  const isU = msg.role === 'user';
  const tw  = isLast && !isU && msg.id !== 'welcome';
  const { shown, done } = useTypewriter(msg.content, 8, tw);
  const [vis,    setVis]    = useState(false);
  const [hover,  setHover]  = useState(false);
  const [copied, setCopied] = useState(false);
  const text = tw ? shown : msg.content;

  useEffect(() => { const t = setTimeout(() => setVis(true), 30); return () => clearTimeout(t); }, []);
  const projSrcs  = done ? (msg.sources || []).filter((s: any) => s.category === 'project').slice(0, 3) : [];
  const otherSrcs = done ? (msg.sources || []).filter((s: any) => s.category !== 'project').slice(0, 2) : [];
  const handleCopy = () => { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div
      className={`flex w-full gap-2 ${isU ? 'justify-end' : 'justify-start'}`}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(8px)',
        transition: `all .3s cubic-bezier(.16,1,.3,1) ${Math.min(idx * 15, 100)}ms`,
      }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      {!isU && (
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.12))',
              border: '1px solid rgba(168,85,247,0.3)',
            }}>
            <GaraYakaMask size={17} />
          </div>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[82%] ${isU ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-[12.5px] leading-[1.72] rounded-2xl
            ${isU ? 'rounded-br-[4px]' : 'rounded-tl-[4px]'}`}
          style={isU
            ? {
                background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 60%, #a855f7 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              }
            : {
                /* Bot bubble: solid white so it pops cleanly off bg */
                background: '#ffffff',
                color: '#1e1040',
                border: '1px solid rgba(168,85,247,0.18)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }
          }
        >
          {text.split('\n').map((line, li) => {
            if (!line.trim()) return <div key={li} className="h-1.5" />;
            if (line.trim().startsWith('→'))
              return (
                <div key={li} className={`flex gap-2 ${li > 0 ? 'mt-1' : ''}`}>
                  <span style={{
                    flexShrink: 0, marginTop: '2px', fontSize: '11px', fontWeight: 700,
                    color: isU ? 'rgba(255,255,255,0.55)' : '#a855f7',
                  }}>›</span>
                  <span className="flex-1">{isU ? line.replace(/^→\s*/, '') : renderRich(line.replace(/^→\s*/, ''))}</span>
                </div>
              );
            return <p key={li} className={li > 0 ? 'mt-1' : ''}>
              {isU ? line : renderRich(line)}
            </p>;
          })}
          {tw && !done && (
            <span className="inline-block w-[1.5px] h-3 ml-0.5 align-middle rounded-full opacity-70"
              style={{
                background: isU ? 'rgba(255,255,255,0.8)' : '#a855f7',
                animation: 'gyCaret 1s step-end infinite',
              }} />
          )}
        </div>

        {/* Project cards */}
        {projSrcs.length > 0 && (
          <div className="w-full space-y-1 mt-0.5">
            {projSrcs.map((e: any) => <ProjCard key={e.id} e={e} />)}
          </div>
        )}

        {/* Source chips */}
        {otherSrcs.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {otherSrcs.map((s: any) => (
              <a key={s.id} href={s.link || '#'}
                className="text-[8.5px] px-2 py-[3px] rounded-full font-mono uppercase tracking-wider transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  color: 'rgba(124,58,237,0.7)',
                  backdropFilter: 'blur(4px)',
                }}>
                {s.title.length > 22 ? s.title.slice(0, 22) + '…' : s.title}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isU && done && (
          <div className="flex items-center gap-0.5 mt-0.5 transition-all duration-200"
            style={{ opacity: hover ? 1 : 0, transform: hover ? 'translateY(0)' : 'translateY(3px)' }}>
            <span style={{ fontSize: '8.5px', fontFamily: 'DM Mono', color: 'rgba(100,80,140,0.35)', marginRight: '6px' }}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <MiniBtn onClick={() => onReact('like')}   active={msg.reactions?.like}    activeColor="#9333ea" title="Helpful"><Ic path={P.thumbU} size={10} /></MiniBtn>
            <MiniBtn onClick={() => onReact('dislike')} active={msg.reactions?.dislike} activeColor="#ef4444" title="Not helpful"><Ic path={P.thumbD} size={10} /></MiniBtn>
            <MiniBtn onClick={handleCopy} active={copied} activeColor="#10b981" title="Copy"><Ic path={copied ? P.check : P.copy} size={10} /></MiniBtn>
            {onRegen && <MiniBtn onClick={onRegen} title="Regenerate"><Ic path={P.refresh} size={10} /></MiniBtn>}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TYPING DOTS ──────────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex items-start gap-2" style={{ animation: 'gyFade .25s ease' }}>
    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.12))',
        border: '1px solid rgba(168,85,247,0.3)',
      }}>
      <GaraYakaMask size={17} />
    </div>
    <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-tl-[4px]"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(168,85,247,0.18)',
        boxShadow: '0 2px 12px rgba(124,58,237,0.08)',
      }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{
          background: i === 0 ? '#a855f7' : i === 1 ? '#9333ea' : '#c084fc',
          opacity: 0.6,
          animation: `gyBounce 1.1s ease ${i * 0.16}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const ChatBot: React.FC = () => {
  const {
    messages, isLoading, isOpen, inputValue, suggestions, messagesEndRef,
    soundEnabled, unreadCount,
    setInputValue, sendMessage, regenerateLastMessage, toggleChat,
    closeChat, clearChat, toggleSound, reactToMessage, exportChat, markRead,
  } = useChat();

  const inputRef  = useRef<HTMLInputElement>(null);
  const bodyRef   = useRef<HTMLDivElement>(null);
  const [closing,     setClosing]     = useState(false);
  const [expanded,    setExpanded]    = useState(false);
  const [searching,   setSearching]   = useState(false);
  const [searchQ,     setSearchQ]     = useState('');
  const [scrollBtn,   setScrollBtn]   = useState(false);
  const [mobile,      setMobile]      = useState(false);
  const [interacted,  setInteracted]  = useState(false);
  const [voiceErrMsg, setVoiceErrMsg] = useState<string | null>(null);

  const { size, setSize, onMouseDown } = useResize(400, 600, 340, 440, 700, 820);
  const { listening, supported: hasVoice, voiceErr, toggle: toggleVoice } = useVoiceInput(
    (t) => { setInputValue(t); setTimeout(() => sendMessage(t), 200); },
    (t) => setInputValue(t),
  );

  useEffect(() => {
    if (voiceErr) { setVoiceErrMsg(voiceErr); const t = setTimeout(() => setVoiceErrMsg(null), 3500); return () => clearTimeout(t); }
  }, [voiceErr]);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 320); markRead(); setInteracted(true); }
  }, [isOpen, markRead]);
  useEffect(() => {
    const el = bodyRef.current; if (!el) return;
    const fn = () => setScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, [isOpen]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggleChat(); }
      if (e.key === 'Escape' && isOpen) doClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [toggleChat, isOpen]);

  const filtered = useMemo(() => {
    if (!searchQ.trim()) return messages;
    const q = searchQ.toLowerCase();
    return messages.filter(m => m.content.toLowerCase().includes(q));
  }, [messages, searchQ]);

  const doClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { closeChat(); setClosing(false); setExpanded(false); }, 220);
  }, [closeChat]);

  const scrollEnd = () => bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  const doSubmit  = (e: React.FormEvent) => { e.preventDefault(); sendMessage(); };
  const doCopy    = (c: string, id: string) => {
    navigator.clipboard.writeText(c);
    reactToMessage(id, 'copied');
    setTimeout(() => reactToMessage(id, 'copied'), 2000);
  };
  const doExpand = () => {
    if (mobile) return;
    setExpanded(p => !p);
    setSize(expanded
      ? { w: 400, h: 600 }
      : { w: Math.min(700, window.innerWidth - 48), h: Math.min(820, window.innerHeight - 112) });
  };

  const lastBot   = useMemo(() => [...messages].reverse().find(m => m.role === 'assistant'), [messages]);
  const followUps = lastBot?.followUps || [];

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes gyFade     { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gyBounce   { 0%,60%,100%{transform:translateY(0);opacity:.3} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes gyIn       { from{opacity:0;transform:translateY(18px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes gyOut      { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(18px) scale(0.96)} }
        @keyframes gySheet    { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes gySheetOut { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes gyFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes gySlide    { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gyCaret    { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes gyMicLive  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.1)} }
        @keyframes gySpin     { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes gyGlow     { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes gyPulse    { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.3)} 60%{box-shadow:0 0 0 14px rgba(124,58,237,0)} }
        @keyframes gyShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }

        /* ══════════════════════════════════════════════════════════════
           PURPLE + WHITE ANIMATED GRADIENT — FULL PANEL
           Strong, visible, beautiful. Corner blobs drift slowly.

           Light mode:
             TL = rich violet      #7c3aed at 40% opacity
             TR = white
             BR = bright purple    #a855f7 at 30% opacity
             BL = indigo           #6366f1 at 25% opacity
             Base = near-white with purple warmth

           Dark mode:
             TL = deep violet
             TR = near-black
             BR = indigo-shadow
             BL = purple ink
        ══════════════════════════════════════════════════════════════ */
        @keyframes gyPanelDrift {
          0%   { background-position: 0%   0%;   }
          33%  { background-position: 100% 50%;  }
          66%  { background-position: 50%  100%; }
          100% { background-position: 0%   0%;   }
        }

        /* ── LIGHT MODE — visible theme gradient ── */
        .gy-panel-bg {
          background:
            radial-gradient(ellipse 80% 60% at 0%   0%,   rgba(202,33,39,0.12)  0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 100% 0%,   rgba(255,255,255,1)    0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 100% 100%, rgba(192,149,21,0.12)  0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 0%   100%, rgba(147,51,234,0.12)  0%, transparent 60%),
            linear-gradient(135deg, #fffcfc 0%, #ffffff 40%, #fefdfa 70%, #fbfaff 100%);
          background-size: 200% 200%;
          animation: gyPanelDrift 14s ease-in-out infinite;
          border: 1px solid rgba(200,200,200,0.4);
          /* Removed shining outerline */
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        /* ── DARK MODE ── */
        .dark .gy-panel-bg {
          background:
            radial-gradient(ellipse 80% 60% at 0%   0%,   rgba(202,33,39,0.2)  0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 100% 0%,   rgba(10,5,5,1)        0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 100% 100%, rgba(192,149,21,0.15)  0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 0%   100%, rgba(147,51,234,0.18)  0%, transparent 60%),
            linear-gradient(135deg, #110505 0%, #080808 40%, #0d0a02 70%, #0a0415 100%);
          background-size: 200% 200%;
          animation: gyPanelDrift 18s ease-in-out infinite;
          border: 1px solid rgba(255,255,255,0.08);
          /* Removed shining outerline */
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        }

        /* ── Header — frosted glass, readable over purple bg ── */
        .gy-header-bg {
          background: rgba(248,244,255,0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(168,85,247,0.18);
        }
        .dark .gy-header-bg {
          background: rgba(12,6,24,0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(168,85,247,0.2);
        }

        /* ── Footer ── */
        .gy-footer-bg {
          background: rgba(248,244,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(168,85,247,0.14);
        }
        .dark .gy-footer-bg {
          background: rgba(12,6,24,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(168,85,247,0.18);
        }

        /* ── Strip ── */
        .gy-strip-bg {
          background: rgba(248,244,255,0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(168,85,247,0.12);
        }
        .dark .gy-strip-bg {
          background: rgba(12,6,24,0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(168,85,247,0.16);
        }

        /* ── Search ── */
        .gy-search-bg {
          background: rgba(248,244,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(168,85,247,0.14);
        }
        .dark .gy-search-bg {
          background: rgba(12,6,24,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(168,85,247,0.16);
        }

        /* ── Scrollbar ── */
        .gy-scroll::-webkit-scrollbar       { width: 2px; }
        .gy-scroll::-webkit-scrollbar-track { background: transparent; }
        .gy-scroll::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.2); border-radius: 99px; }
        .gy-scroll::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.38); }

        /* ── Strip ── */
        .gy-strip {
          display:flex; align-items:center; gap:5px; overflow-x:auto;
          padding:8px 13px; scrollbar-width:none; -webkit-overflow-scrolling:touch;
        }
        .gy-strip::-webkit-scrollbar { display:none; }

        /* ── Chips — purple on white, hover fills purple ── */
        .gy-chip {
          flex-shrink:0; white-space:nowrap; font-size:10px; padding:3.5px 12px;
          border-radius:999px; cursor:pointer;
          font-family:'Instrument Sans',sans-serif;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(168,85,247,0.25);
          color: rgba(109,40,217,0.75);
          backdrop-filter: blur(6px);
          transition: all .22s cubic-bezier(.16,1,.3,1);
        }
        .gy-chip:hover {
          background: linear-gradient(135deg,#7c3aed,#9333ea);
          color: white; border-color: transparent;
          transform: translateY(-1.5px);
          box-shadow: 0 5px 16px rgba(124,58,237,0.32);
        }
        .dark .gy-chip {
          background: rgba(30,12,60,0.7);
          border-color: rgba(168,85,247,0.3);
          color: rgba(196,156,255,0.8);
        }
        .dark .gy-chip:hover {
          background: linear-gradient(135deg,#7c3aed,#9333ea);
          color: white;
        }

        /* ── Explore cards ── */
        .gy-init {
          text-align:left; padding:10px; border-radius:12px; cursor:pointer;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(168,85,247,0.15);
          backdrop-filter: blur(8px);
          transition: all .25s cubic-bezier(.16,1,.3,1);
        }
        .gy-init:hover {
          background: rgba(255,255,255,0.88);
          border-color: rgba(168,85,247,0.35);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(124,58,237,0.14);
        }
        .dark .gy-init {
          background: rgba(30,12,60,0.45);
          border-color: rgba(168,85,247,0.2);
        }
        .dark .gy-init:hover {
          background: rgba(40,16,80,0.7);
          border-color: rgba(168,85,247,0.4);
          box-shadow: 0 10px 30px rgba(124,58,237,0.25);
        }

        /* ── FAB ── */
        .gy-fab {
          position:fixed; bottom:20px; right:20px; z-index:9990;
          width:44px; height:44px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          border:none; outline:none; cursor:pointer;
          background: linear-gradient(135deg, #ca2127 0%, #c09515 100%);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15); /* removed shining outerline */
          transition: all .3s cubic-bezier(.16,1,.3,1);
        }
        .gy-fab:hover {
          transform: scale(1.08) translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.2);
        }
        .gy-fab:active { transform:scale(0.94); }
        @media(max-width:640px){.gy-fab{bottom:16px;right:16px;width:42px;height:42px;border-radius:13px;}}

        /* ── Send ── */
        .gy-send {
          display:flex; align-items:center; justify-content:center;
          width:33px; height:33px; border-radius:10px; flex-shrink:0;
          border:none; cursor:pointer; color:white;
          background: linear-gradient(135deg, #ca2127 0%, #c09515 100%);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: all .2s cubic-bezier(.16,1,.3,1);
        }
        .gy-send:hover:not(:disabled) { transform:scale(1.07); box-shadow:0 4px 10px rgba(0,0,0,0.15); }
        .gy-send:active:not(:disabled){ transform:scale(0.93); }
        .gy-send:disabled { opacity:.25; cursor:default; box-shadow:none; }

        /* ── Mic ── */
        .gy-mic {
          display:flex; align-items:center; justify-content:center;
          width:33px; height:33px; border-radius:10px; flex-shrink:0;
          border:none; cursor:pointer; position:relative;
          background:transparent; color:rgba(124,58,237,0.5);
          transition: all .22s cubic-bezier(.16,1,.3,1);
        }
        .gy-mic:hover { background:rgba(202,33,39,0.1); color:#ca2127; transform:scale(1.05); }
        .gy-mic.live  {
          background:linear-gradient(135deg, #ca2127 0%, #c09515 100%);
          color:white; animation:gyMicLive 1.4s ease infinite;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);
        }

        /* ── Input ── */
        .gy-input {
          flex:1; padding:8px 12px; font-size:12.5px; border-radius:10px;
          background:rgba(255,255,255,0.7);
          border:1px solid rgba(168,85,247,0.22);
          color:#1e1040; outline:none;
          font-family:'Instrument Sans',sans-serif;
          backdrop-filter: blur(8px);
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .gy-input:focus {
          background:rgba(255,255,255,0.95);
          border-color:rgba(124,58,237,0.5);
          box-shadow:0 0 0 3px rgba(124,58,237,0.1);
        }
        .gy-input::placeholder { color:rgba(124,58,237,0.32); }
        .gy-input:disabled     { opacity:.3; }
        .dark .gy-input        { background:rgba(20,8,45,0.7); color:#e2d9f3; border-color:rgba(168,85,247,0.25); }
        .dark .gy-input:focus  { background:rgba(25,10,55,0.95); border-color:rgba(168,85,247,0.55); box-shadow:0 0 0 3px rgba(168,85,247,0.12); }
        .dark .gy-input::placeholder { color:rgba(168,85,247,0.35); }

        /* ── Name shimmer — purple gradient ── */
        .gy-name {
          background: linear-gradient(90deg,#7c3aed,#a855f7,#c084fc,#9333ea,#7c3aed);
          background-size: 300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation: gyShimmer 4s linear infinite;
        }

        /* ── Resize ── */
        .gy-resize { position:absolute;top:0;left:0;width:16px;height:16px;cursor:nw-resize;z-index:10; }
        .gy-resize::before {
          content:'';position:absolute;top:4px;left:4px;width:8px;height:8px;
          border-top:1.5px solid rgba(168,85,247,0.28);
          border-left:1.5px solid rgba(168,85,247,0.28);
          transition:border-color .2s;
        }
        .gy-resize:hover::before { border-color:rgba(168,85,247,0.6); }

        /* ── Light mode text corrections ──
           All UI text on the purple-tinted frosted panels must be dark/readable
        ── */
        .gy-ui-text        { color: #2d1b69; }
        .gy-ui-text-muted  { color: rgba(74,38,160,0.6); }
        .gy-ui-text-faint  { color: rgba(109,40,217,0.38); }
        .dark .gy-ui-text       { color: #e2d9f3; }
        .dark .gy-ui-text-muted { color: rgba(196,156,255,0.6); }
        .dark .gy-ui-text-faint { color: rgba(196,156,255,0.35); }
      `}</style>

      {/* ── FAB ── */}
      <button onClick={toggleChat} aria-label="Toggle Yaka" className="gy-fab"
        style={{ animation: !isOpen && !interacted ? 'gyFloat 3.5s ease infinite' : undefined }}>
        {!interacted && !isOpen && (
          <span style={{ position:'absolute',inset:0,borderRadius:14,animation:'gyPulse 2.5s ease infinite',pointerEvents:'none' }} />
        )}
        {isOpen ? <Ic path={P.x} size={17} sw={2.2} className="text-white" /> : <GaraYakaMask size={24} white />}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full
            text-[8.5px] font-bold flex items-center justify-center border-[1.5px]"
            style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', color:'white', borderColor:'white' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {!interacted && !isOpen && !mobile && (
          <span className="absolute -top-px -left-px px-1.5 py-px rounded-md text-[7px] font-mono opacity-40"
            style={{ background:'rgba(20,8,45,0.75)', color:'white' }}>⌘K</span>
        )}
      </button>

      {isOpen && mobile && (
        <div className="fixed inset-0 z-[9988]"
          style={{ background:'rgba(15,5,35,0.55)', backdropFilter:'blur(4px)' }}
          onClick={doClose} />
      )}

      {isOpen && (
        <div
          className={`fixed z-[9989] ${mobile ? 'bottom-0 left-0 right-0' : 'bottom-[78px] right-5 sm:right-6'}`}
          style={{
            width: mobile ? '100%' : `${size.w}px`,
            maxWidth: mobile ? '100%' : 'calc(100vw - 32px)',
            animation: mobile
              ? (closing ? 'gySheetOut .22s ease both' : 'gySheet .35s cubic-bezier(.16,1,.3,1) both')
              : (closing ? 'gyOut .22s ease both' : 'gyIn .38s cubic-bezier(.16,1,.3,1) both'),
          }}
        >
          <div className={`relative flex flex-col overflow-hidden gy-panel-bg
            ${mobile ? 'rounded-t-[24px]' : 'rounded-[20px]'}`}
            style={{ height: mobile ? '85vh' : `${size.h}px`, maxHeight: mobile ? '85vh' : 'calc(100vh - 108px)' }}>

            {!mobile && !expanded && <div className="gy-resize" onMouseDown={onMouseDown} />}

            {/* ── HEADER ── */}
            <header className="gy-header-bg flex items-center justify-between px-3.5 py-2.5 flex-shrink-0">
              {mobile && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-1 rounded-full"
                style={{ background:'rgba(168,85,247,0.25)' }} />}

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg,rgba(168,85,247,0.18),rgba(124,58,237,0.1))',
                      border: '1px solid rgba(168,85,247,0.3)',
                    }}>
                    <GaraYakaMask size={22} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full"
                    style={{ border:'2px solid rgba(248,244,255,0.9)', animation:'gyGlow 2.5s ease infinite' }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    {/* Name with purple shimmer — clearly visible */}
                    <p className="text-[13px] font-bold gy-name tracking-tight"
                      style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Yaka</p>
                    <span className="text-[7.5px] px-1.5 py-px rounded-md font-mono uppercase tracking-widest"
                      style={{
                        background:'rgba(124,58,237,0.1)',
                        color:'#7c3aed',
                        border:'1px solid rgba(124,58,237,0.22)',
                      }}>agent</span>
                  </div>
                  <p className="text-[8.5px] font-mono tracking-[.06em]"
                    style={{ color: isLoading ? '#9333ea' : 'rgba(109,40,217,0.5)' }}>
                    {isLoading
                      ? <span style={{ animation:'gyGlow 1.5s ease infinite', display:'inline-block' }}>thinking…</span>
                      : 'online · portfolio ai'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <HdrBtn onClick={() => { setSearching(p => !p); setSearchQ(''); }} title="Search" active={searching}>
                  <Ic path={P.search} size={12} />
                </HdrBtn>
                <HdrBtn onClick={toggleSound} title={soundEnabled ? 'Mute' : 'Sound'}>
                  <Ic path={soundEnabled ? P.vol : P.mut} size={12} />
                </HdrBtn>
                {!mobile && <>
                  <HdrBtn onClick={exportChat} title="Export"><Ic path={P.dl} size={12} /></HdrBtn>
                  <HdrBtn onClick={doExpand} title={expanded ? 'Restore' : 'Expand'}>
                    <Ic path={expanded ? P.shrink : P.expand} size={12} />
                  </HdrBtn>
                </>}
                <div style={{ width:'1px', height:'14px', background:'rgba(168,85,247,0.2)', margin:'0 2px' }} />
                <HdrBtn onClick={clearChat} title="Clear" danger><Ic path={P.trash} size={12} /></HdrBtn>
                <HdrBtn onClick={doClose} title="Minimize"><Ic path={P.minus} size={12} /></HdrBtn>
              </div>
            </header>

            {/* ── SEARCH ── */}
            {searching && (
              <div className="gy-search-bg px-3.5 py-2" style={{ animation:'gyFade .18s ease' }}>
                <div className="flex items-center gap-2">
                  <Ic path={P.search} size={12} style={{ color:'rgba(124,58,237,0.4)', flexShrink:0 } as any} />
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search messages…" autoFocus
                    style={{
                      flex:1, background:'transparent', border:'none', outline:'none',
                      fontSize:'12px', fontFamily:'Instrument Sans', color:'#2d1b69',
                    }} />
                  {searchQ && (
                    <button onClick={() => setSearchQ('')}
                      style={{ color:'rgba(124,58,237,0.4)', cursor:'pointer', background:'none', border:'none' }}>
                      <Ic path={P.x} size={11} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── MESSAGES — transparent, purple gradient shows through ── */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto gy-scroll px-3.5 py-4 space-y-3.5">
              {filtered.map((m, i) => (
                <MsgBubble key={m.id} msg={m} idx={i}
                  isLast={i === filtered.length - 1 && !isLoading}
                  onRegen={i === filtered.length - 1 && m.role === 'assistant' && m.id !== 'welcome' ? regenerateLastMessage : undefined}
                  onReact={r => reactToMessage(m.id, r)}
                  onCopy={() => doCopy(m.content, m.id)} />
              ))}

              {isLoading && <TypingDots />}

              {messages.length <= 1 && !isLoading && (
                <div className="pt-1" style={{ animation:'gyFade .3s ease' }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Ic path={P.spark} size={10} style={{ color:'rgba(168,85,247,0.55)' } as any} />
                    <p className="text-[8.5px] font-mono uppercase tracking-[.14em]"
                      style={{ color:'rgba(109,40,217,0.45)' }}>Explore</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {suggestions.slice(0, 8).map((s, i) => (
                      <button key={s.query} onClick={() => sendMessage(s.query)} className="gy-init"
                        style={{ animation:`gyFade .3s ease ${i * 45}ms both` }}>
                        <span className="text-[15px] block mb-1.5">{s.icon}</span>
                        {/* Card label — dark purple so it's readable on light frosted bg */}
                        <span className="text-[10.5px] font-medium block leading-snug"
                          style={{ color:'#3b1a78' }}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
            </div>

            {/* ── SCROLL BTN ── */}
            {scrollBtn && (
              <div className="absolute bottom-[88px] left-1/2 -translate-x-1/2 z-10"
                style={{ animation:'gyFade .2s ease' }}>
                <button onClick={scrollEnd}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer
                    transition-all duration-200"
                  style={{
                    background:'rgba(248,244,255,0.92)',
                    border:'1px solid rgba(168,85,247,0.22)',
                    boxShadow:'0 4px 16px rgba(124,58,237,0.12)',
                    fontSize:'8.5px', fontFamily:'DM Mono',
                    color:'rgba(109,40,217,0.55)',
                    backdropFilter:'blur(8px)',
                  }}>
                  <Ic path={P.chevD} size={9} /> scroll to latest
                </button>
              </div>
            )}

            {/* ── FOLLOW-UPS ── */}
            {followUps.length > 0 && messages.length > 1 && !isLoading && (
              <div className="gy-strip-bg flex-shrink-0">
                <div className="gy-strip">
                  <Ic path={P.spark} size={9} style={{ color:'rgba(168,85,247,0.5)', flexShrink:0 } as any} />
                  {followUps.slice(0, 5).map((q, qi) => (
                    <button key={q} onClick={() => sendMessage(q)} className="gy-chip"
                      style={{ animation:`gySlide .3s ease ${qi * 55}ms both` }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── INPUT ── */}
            <div className="gy-footer-bg flex-shrink-0 px-3.5 pb-3.5 pt-2">
              <form onSubmit={doSubmit} className="flex items-center gap-2">
                {hasVoice && (
                  <button type="button" onClick={toggleVoice} className={`gy-mic ${listening ? 'live' : ''}`}
                    title={listening ? 'Stop' : 'Voice'}>
                    <Ic path={listening ? P.micOff : P.mic} size={13} />
                    {listening && (
                      <span className="absolute inset-[-4px] rounded-[13px]"
                        style={{ border:'1px solid rgba(168,85,247,0.4)', animation:'gyGlow .7s ease infinite alternate' }} />
                    )}
                  </button>
                )}
                <input ref={inputRef} value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={listening ? '🎤 Listening…' : 'Ask anything about this portfolio…'}
                  disabled={isLoading || listening}
                  className="gy-input" />
                <button type="submit" disabled={!inputValue.trim() || isLoading} className="gy-send">
                  {isLoading
                    ? <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white block"
                        style={{ animation:'gySpin .7s linear infinite' }} />
                    : <Ic path={P.send} size={13} sw={2} className="text-white" />}
                </button>
              </form>

              {voiceErrMsg && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl"
                  style={{
                    background:'rgba(239,68,68,0.07)',
                    border:'1px solid rgba(239,68,68,0.2)',
                    animation:'gyFade .2s ease',
                  }}>
                  <span style={{ color:'#ef4444', fontSize:'10px', fontWeight:700 }}>⚠</span>
                  <span style={{ fontSize:'10px', color:'rgba(239,68,68,0.8)', flex:1 }}>{voiceErrMsg}</span>
                  <button onClick={() => setVoiceErrMsg(null)}
                    style={{ color:'rgba(239,68,68,0.4)', cursor:'pointer', background:'none', border:'none' }}>
                    <Ic path={P.x} size={9} />
                  </button>
                </div>
              )}

              {/* Footer text — clearly readable purple */}
              <p className="text-center text-[7.5px] font-mono tracking-[.18em] uppercase mt-2"
                style={{ color:'rgba(109,40,217,0.3)' }}>
                gara yaka · portfolio ai{!mobile && <span style={{ marginLeft:'8px', opacity:0.5 }}>⌘K</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;