// src/features/agent/components/ChatBot.tsx
// ═══════════════════════════════════════════════════════════════════════════════
// GARA YAKA — AGENT v8 · Clean Modern Design · High Contrast · Light/Dark
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../services/ai-service';
import maskImg from '@shared/assets/images/chatbot/Jujutsu Kaisen Cute Yuji Itadori Sticker.png';

const GaraYakaMask = ({ size = 24 }: { size?: number }) => (
  <img 
    src={maskImg} 
    alt="Gara Yaka Mask" 
    style={{ 
      width: size, 
      height: size, 
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 10px var(--gy-c1))'
    }}
  />
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
      return <code key={i} className="gy-code">{chunk.slice(1, -1)}</code>;
    if (chunk.startsWith('_') && chunk.endsWith('_') && !chunk.startsWith('__'))
      return <span key={i} className="gy-text-muted text-[11px]">{chunk.slice(1, -1)}</span>;
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link)
      return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer"
        className="gy-accent-text underline underline-offset-2 hover:opacity-80 transition-colors">
        {link[1]}
      </a>;
    return <React.Fragment key={i}>{chunk}</React.Fragment>;
  });
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

const ProjCard = ({ e }: { e: any }) => (
  <a href={e.link || '#'}
    className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300
      bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]
      hover:bg-black/[0.04] dark:hover:bg-white/[0.06] gy-accent-border
      hover:-translate-y-px hover:shadow-md">
    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 gy-accent-bg-glow">
      <Ic path={P.star} size={11} className="gy-accent-text" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold truncate gy-text-primary">{e.title}</p>
      {e.metadata?.tech && (
        <p className="text-[9px] font-mono mt-0.5 truncate gy-text-muted">{e.metadata.tech}</p>
      )}
    </div>
    <Ic path={P.arrow} size={10} className="gy-text-muted flex-shrink-0" />
  </a>
);

// ─── MINI BUTTON ──────────────────────────────────────────────────────────────

const MiniBtn = ({ onClick, active, activeColor = 'var(--gy-c1)', title, children }: {
  onClick: () => void; active?: boolean; activeColor?: string;
  title?: string; children: React.ReactNode;
}) => (
  <button onClick={onClick} title={title}
    className="p-1 rounded-lg cursor-pointer transition-all duration-150
      text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
    style={{
      color:      active ? activeColor : undefined,
      background: active ? `${activeColor}15` : 'transparent',
    }}>
    {children}
  </button>
);

// ─── HEADER BUTTON ────────────────────────────────────────────────────────────

const HdrBtn = ({ onClick, title, active, danger, children }: {
  onClick: () => void; title: string; active?: boolean; danger?: boolean; children: React.ReactNode;
}) => (
  <button onClick={onClick} title={title}
    className={`flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer
      transition-all duration-200 hover:scale-105 active:scale-95
      ${danger
        ? 'text-gray-400 dark:text-gray-600 hover:text-red-500 hover:bg-red-500/10'
        : active
          ? 'gy-accent-text gy-accent-bg-glow'
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
      }`}>
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
        <div className="flex-shrink-0 mt-1">
          <GaraYakaMask size={24} />
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[82%] ${isU ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-[12.5px] leading-[1.72] rounded-2xl
            ${isU ? 'rounded-br-[4px]' : 'rounded-tl-[4px]'}`}
          style={isU
            ? {
                background: 'linear-gradient(135deg, var(--gy-c1) 0%, var(--gy-c2) 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 8px color-mix(in srgb, var(--gy-c1) 30%, transparent)',
              }
            : {
                background: 'var(--gy-bot-bg, #ffffff)',
                color: 'var(--gy-bot-text, #111827)',
                border: '1px solid var(--gy-bot-border, rgba(0,0,0,0.08))',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }
          }
        >
          {text.split('\n').map((line, li) => {
            if (!line.trim()) return <div key={li} className="h-1.5" />;
            if (line.trim().startsWith('→'))
              return (
                <div key={li} className={`flex gap-2 ${li > 0 ? 'mt-1' : ''}`}>
                  <span className={`flex-shrink-0 mt-0.5 text-[11px] font-bold ${isU ? 'text-white/50' : 'gy-accent-text'}`}>›</span>
                  <span className="flex-1">{isU ? line.replace(/^→\s*/, '') : renderRich(line.replace(/^→\s*/, ''))}</span>
                </div>
              );
            return <p key={li} className={li > 0 ? 'mt-1' : ''}>
              {isU ? line : renderRich(line)}
            </p>;
          })}
          {tw && !done && (
            <span className={`inline-block w-[1.5px] h-3 ml-0.5 align-middle rounded-full ${isU ? 'bg-white/70' : ''}`}
              style={{ background: isU ? undefined : 'var(--gy-c1)', animation: 'gyCaret 1s step-end infinite' }} />
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
                className="text-[8.5px] px-2 py-[3px] rounded-full font-mono uppercase tracking-wider
                  bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06]
                  gy-text-secondary transition-colors hover:border-[#0284c7]/40 dark:hover:border-[#0ea5e9]/50">
                {s.title.length > 22 ? s.title.slice(0, 22) + '…' : s.title}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isU && done && (
          <div className="flex items-center gap-0.5 mt-0.5 transition-all duration-200"
            style={{ opacity: hover ? 1 : 0, transform: hover ? 'translateY(0)' : 'translateY(3px)' }}>
            <span className="text-[8.5px] font-mono gy-text-muted mr-1.5">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <MiniBtn onClick={() => onReact('like')}   active={msg.reactions?.like}    activeColor="#0e9f6e" title="Helpful"><Ic path={P.thumbU} size={10} /></MiniBtn>
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
    <div className="flex-shrink-0 mt-1">
      <GaraYakaMask size={24} />
    </div>
    <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-tl-[4px]
      bg-white dark:bg-[#1c1c20] border border-black/[0.06] dark:border-white/[0.06]"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{
          background: 'var(--gy-c1)', opacity: 0.5,
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
      {/* CSS Variables for dark mode bot bubbles */}
      <style>{`
        .gy-code {
          font-size: 10.5px; padding: 1px 6px; border-radius: 5px; font-family: 'DM Mono', monospace;
          background: rgba(2,132,199,0.08); color: #0284c7;
          border: 1px solid rgba(2,132,199,0.15); display: inline-block;
        }
        .dark .gy-code {
          background: rgba(14,165,233,0.12); color: #38bdf8;
          border-color: rgba(14,165,233,0.25);
        }
        :root {
          --gy-bot-bg: #ffffff;
          --gy-bot-text: #111827;
          --gy-bot-border: rgba(0,0,0,0.08);
        }
        .dark {
          --gy-bot-bg: #1c1c20;
          --gy-bot-text: #f3f4f6;
          --gy-bot-border: rgba(255,255,255,0.06);
        }
      `}</style>

      {/* ── FAB LABEL ── */}
      {!interacted && !isOpen && !mobile && (
        <div className="fixed bottom-[28px] right-[75px] z-[9990] flex items-center justify-end
          animate-in fade-in slide-in-from-right-4 duration-700 pointer-events-none">
          <div className="bg-white/90 dark:bg-[#12121a]/90 text-black dark:text-white
            border border-black/[0.08] dark:border-white/[0.08]
            px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase
            shadow-lg flex items-center gap-2 backdrop-blur-md">
            <span>Agent</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gy-c1)', animation: 'gyPulse 2s infinite' }} />
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button onClick={toggleChat} aria-label="Toggle Yaka" className="gy-fab"
        style={{ animation: !isOpen && !interacted ? 'gyFloat 3.5s ease infinite' : undefined }}>
        {isOpen ? <Ic path={P.x} size={17} sw={2.2} className="text-[#ca2127]" /> : <GaraYakaMask size={48} />}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full
            text-[8.5px] font-bold flex items-center justify-center border-[1.5px]
            bg-gradient-to-br from-amber-500 to-orange-500 text-white border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && mobile && (
        <div className="fixed inset-0 z-[9988] bg-black/40 backdrop-blur-sm"
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
              {mobile && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-1 rounded-full bg-black/10 dark:bg-white/10" />}

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <GaraYakaMask size={32} />
                  <span className="absolute -bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full
                    border-2 border-white dark:border-[#18181c]"
                    style={{ animation:'gyGlow 2.5s ease infinite' }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-bold gy-name tracking-tight"
                      style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Yaka</p>
                    <span className="text-[7.5px] px-1.5 py-px rounded-md font-mono uppercase tracking-widest
                      gy-accent-text gy-accent-bg-glow gy-accent-border border">agent</span>
                  </div>
                  <p className={`text-[8.5px] font-mono tracking-[.06em] ${isLoading ? 'gy-accent-text' : 'gy-text-muted'}`}>
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
                <div className="w-px h-3.5 bg-black/10 dark:bg-white/10 mx-0.5" />
                <HdrBtn onClick={clearChat} title="Clear" danger><Ic path={P.trash} size={12} /></HdrBtn>
                <HdrBtn onClick={doClose} title="Minimize"><Ic path={P.minus} size={12} /></HdrBtn>
              </div>
            </header>

            {/* ── SEARCH ── */}
            {searching && (
              <div className="gy-search-bg px-3.5 py-2" style={{ animation:'gyFade .18s ease' }}>
                <div className="flex items-center gap-2">
                  <Ic path={P.search} size={12} className="gy-text-muted flex-shrink-0" />
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search messages…" autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-[12px] gy-text-primary
                      placeholder:gy-text-muted"
                    style={{ fontFamily: 'Instrument Sans' }} />
                  {searchQ && (
                    <button onClick={() => setSearchQ('')}
                      className="gy-text-muted hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer bg-transparent border-none">
                      <Ic path={P.x} size={11} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── MESSAGES ── */}
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
                    <Ic path={P.spark} size={10} className="gy-accent-text opacity-70" />
                    <p className="text-[8.5px] font-mono uppercase tracking-[.14em] gy-text-muted">Explore</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {suggestions.slice(0, 8).map((s, i) => (
                      <button key={s.query} onClick={() => sendMessage(s.query)} className="gy-init"
                        style={{ animation:`gyFade .3s ease ${i * 45}ms both` }}>
                        <span className="text-[15px] block mb-1.5">{s.icon}</span>
                        <span className="text-[10.5px] font-medium block leading-snug gy-text-primary">{s.label}</span>
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
                    transition-all duration-200 text-[8.5px] font-mono
                    bg-white/90 dark:bg-[#1c1c20]/90 border border-black/[0.08] dark:border-white/[0.06]
                    gy-text-secondary shadow-lg backdrop-blur-sm">
                  <Ic path={P.chevD} size={9} /> scroll to latest
                </button>
              </div>
            )}

            {/* ── FOLLOW-UPS ── */}
            {followUps.length > 0 && messages.length > 1 && !isLoading && (
              <div className="gy-strip-bg flex-shrink-0">
                <div className="gy-strip">
                  <Ic path={P.spark} size={9} className="gy-accent-text opacity-60 flex-shrink-0" />
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
                      <span className="absolute inset-[-4px] rounded-[14px] border gy-accent-border"
                        style={{ animation:'gyGlow .7s ease infinite alternate' }} />
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
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl
                  bg-red-500/[0.06] border border-red-500/20"
                  style={{ animation:'gyFade .2s ease' }}>
                  <span className="text-red-500 text-[10px] font-bold">⚠</span>
                  <span className="text-[10px] text-red-500/80 flex-1">{voiceErrMsg}</span>
                  <button onClick={() => setVoiceErrMsg(null)}
                    className="text-red-500/40 cursor-pointer bg-transparent border-none">
                    <Ic path={P.x} size={9} />
                  </button>
                </div>
              )}

              <p className="text-center text-[7.5px] font-mono tracking-[.18em] uppercase mt-2 gy-text-muted">
                gara yaka · portfolio ai{!mobile && <span className="ml-2 opacity-50">⌘K</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;