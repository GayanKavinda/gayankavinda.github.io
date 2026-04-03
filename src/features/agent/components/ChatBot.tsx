// src/features/agent/components/ChatBot.tsx
// ═══════════════════════════════════════════════════════════════════════════════
// GARA YAKA — YAKA AGENT v6 — Pure Clean Design
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../services/ai-service';

// ─── ICONS ───────────────────────────────────────────────────────────────────

const YakaLogo = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="yG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--crimson))" />
        <stop offset="100%" stopColor="hsl(var(--gold))" />
      </linearGradient>
    </defs>
    <path d="M8 6L16 18L24 6" stroke="url(#yG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="18" x2="16" y2="28" stroke="url(#yG)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="4" r="1.5" fill="hsl(var(--gold))" />
  </svg>
);

const I = ({ d, s = 16, className = '' }: { d: string; s?: number; className?: string }) => (
  <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ic = {
  send: 'M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z',
  x: 'M18 6L6 18M6 6L18 18',
  min: 'M5 12H19',
  ref: 'M1 4V10H7M23 20V14H17',
  exp: 'M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14',
  col: 'M4 14H10V20M20 10H14V4M14 10L21 3M10 14L3 21',
  src: 'M11 3a8 8 0 100 16 8 8 0 000-16zM21 21l-4.35-4.35',
  dl: 'M21 15V19A2 2 0 0119 21H5A2 2 0 013 19V15M7 10L12 15L17 10M12 15V3',
  vol: 'M11 5L6 9H2V15H6L11 19V5ZM15.54 8.46A5 5 0 0118 12A5 5 0 0115.54 15.54',
  mut: 'M11 5L6 9H2V15H6L11 19V5ZM23 9L17 15M17 9L23 15',
  mic: 'M12 1A3 3 0 0115 4V12A3 3 0 0112 15A3 3 0 019 12V4A3 3 0 0112 1ZM19 10V12A7 7 0 015 12V10M12 19V23M8 23H16',
  micX: 'M1 1L23 23M9 9V12A3 3 0 005.12 14.88M15 9.34V4A3 3 0 009.57 1.57M12 19V23M8 23H16M19 10V12',
  up: 'M14 9V5A3 3 0 0010 5V9M10 15L8 21H5L3 15V9H7M10 15H17.5A1.5 1.5 0 0019 13.5V13A1 1 0 0018 12H14',
  dn: 'M10 15V19A3 3 0 0014 19V15M14 9L16 3H19L21 9V15H17M14 9H6.5A1.5 1.5 0 005 10.5V11A1 1 0 006 12H10',
  cp: 'M20 9H11A2 2 0 009 11V20A2 2 0 0011 22H20A2 2 0 0022 20V11A2 2 0 0020 9ZM5 15H4A2 2 0 012 13V4A2 2 0 014 2H13A2 2 0 0115 4V5',
  ck: 'M20 6L9 17L4 12',
  chD: 'M6 9L12 15L18 9',
  lnk: 'M10 13A5 5 0 007.54 15.54L4 19M14 11A5 5 0 0016.46 8.46L20 5',
  arr: 'M5 12H19M12 5L19 12L12 19',
  star: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
};

// ─── Profile-boosting suggestions based on conversation context ──────────────

function getProfileSuggestions(lastSources: any[], messageCount: number): string[] {
  if (messageCount === 0) return [];

  const cats = [...new Set((lastSources || []).map((s: any) => s.category))];
  const pool: string[] = [];

  // Always good suggestions to highlight the portfolio owner
  const universal = [
    "What makes you stand out?",
    "What's your strongest project?",
    "How do you approach new problems?",
    "What impact have you made?",
  ];

  if (cats.includes('project') || cats.length === 0) {
    pool.push(
      "Which project was the most challenging?",
      "Any open source contributions?",
      "What metrics did your projects achieve?",
    );
  }
  if (cats.includes('skill') || cats.length === 0) {
    pool.push(
      "What's your strongest skill?",
      "How do you stay current with tech?",
      "Show me projects using these skills",
    );
  }
  if (cats.includes('experience')) {
    pool.push(
      "What's your leadership style?",
      "Biggest achievement at work?",
      "What would your team say about you?",
    );
  }
  if (cats.includes('about')) {
    pool.push(
      "What drives your engineering philosophy?",
      "Show your best work",
      "Why should someone hire you?",
    );
  }
  if (cats.includes('contact') || cats.includes('general')) {
    pool.push(
      "What value do you bring to a team?",
      "Show me your latest project",
      "What's your availability?",
    );
  }

  // Mix universal + contextual, deduplicate, pick 3
  const combined = [...pool, ...universal];
  const shuffled = combined.sort(() => Math.random() - 0.5);
  return [...new Set(shuffled)].slice(0, 3);
}

// ─── TYPEWRITER ──────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 10, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const [isDone, setIsDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setIsDone(true); return; }
    setDisplayed(''); setIsDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setIsDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, enabled]);

  return { displayed, isDone };
}

// ─── VOICE INPUT ─────────────────────────────────────────────────────────────

function useVoiceInput(onResult: (t: string) => void, onInterim?: (t: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    setIsSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);

  useEffect(() => () => { try { recRef.current?.abort(); } catch (_) { /* cleanup */ } }, []);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch (_) { /* ignore */ }
    activeRef.current = false;
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    setError(null);
    if (!isSupported) { setError('Voice not supported. Try Chrome or Edge.'); return; }
    if (activeRef.current) { stop(); return; }
    try { recRef.current?.abort(); } catch (_) { /* ignore */ }

    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR();
      rec.continuous = false; rec.interimResults = true; rec.lang = 'en-US';

      rec.onstart = () => { activeRef.current = true; setIsListening(true); };
      rec.onresult = (e: any) => {
        let interim = '', final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        if (interim && onInterim) onInterim(interim);
        if (final) { onResult(final.trim()); setTimeout(stop, 100); }
      };
      rec.onerror = (e: any) => {
        if (e.error !== 'aborted') setError(e.error === 'not-allowed' ? 'Microphone denied.' : 'Voice error.');
        activeRef.current = false; setIsListening(false);
      };
      rec.onend = () => { activeRef.current = false; setIsListening(false); recRef.current = null; };

      recRef.current = rec;
      rec.start();
    } catch (_) { setError('Failed to start voice.'); setIsListening(false); }
  }, [isSupported, onResult, onInterim, stop]);

  const toggle = useCallback(() => activeRef.current ? stop() : start(), [start, stop]);
  return { isListening, isSupported, error, toggle };
}

// ─── RESIZE HOOK ─────────────────────────────────────────────────────────────

function useResize(iW: number, iH: number, mnW: number, mnH: number, mxW: number, mxH: number) {
  const [size, setSize] = useState({ w: iW, h: iH });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    const move = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setSize({
        w: Math.min(mxW, Math.max(mnW, start.current.w + (start.current.x - ev.clientX))),
        h: Math.min(mxH, Math.max(mnH, start.current.h + (start.current.y - ev.clientY))),
      });
    };
    const up = () => { dragging.current = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }, [size, mnW, mnH, mxW, mxH]);

  return { size, setSize, onMouseDown };
}

// ─── RICH TEXT ────────────────────────────────────────────────────────────────

function rich(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|_[^_]+_)/g).map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="text-[11px] px-1 py-0.5 rounded bg-[hsl(var(--crimson)/0.07)] text-[hsl(var(--crimson))] font-['DM_Mono']">{p.slice(1, -1)}</code>;
    if (p.startsWith('_') && p.endsWith('_') && !p.startsWith('__')) return <span key={i} className="text-[hsl(var(--muted-foreground)/0.5)] text-[12px]">{p.slice(1, -1)}</span>;
    const lm = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lm) return <a key={i} href={lm[2]} className="text-[hsl(var(--gold))] hover:text-[hsl(var(--crimson))] underline underline-offset-2 decoration-[hsl(var(--gold)/0.25)] transition-colors">{lm[1]}</a>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

// ─── PROJECT CARD ────────────────────────────────────────────────────────────

const ProjCard = ({ e }: { e: any }) => (
  <a href={e.link || '#'} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-black dark:hover:border-white bg-white dark:bg-black transition-all duration-200">
    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 dark:group-hover:bg-zinc-800 transition-colors">
      <I d={ic.star} s={12} className="text-gray-400 dark:text-zinc-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-[hsl(var(--foreground))] truncate leading-tight">{e.title}</p>
      {e.metadata?.tech && (
        <p className="text-[10px] text-[hsl(var(--muted-foreground)/0.4)] font-['DM_Mono'] mt-0.5 truncate">{e.metadata.tech}</p>
      )}
    </div>
    <I d={ic.arr} s={12} className="text-[hsl(var(--muted-foreground)/0.2)] group-hover:text-black dark:group-hover:text-white transition-colors flex-shrink-0" />
  </a>
);

// ─── MESSAGE BUBBLE ──────────────────────────────────────────────────────────

const Msg = ({
  msg, idx, isLast, onRegen, onReact, onCopy,
}: {
  msg: ChatMessage; idx: number; isLast: boolean;
  onRegen?: () => void;
  onReact: (r: 'like' | 'dislike' | 'copied') => void;
  onCopy: () => void;
}) => {
  const isU = msg.role === 'user';
  const tw = isLast && !isU && msg.id !== 'welcome';
  const { displayed, isDone } = useTypewriter(msg.content, 8, tw);
  const [vis, setVis] = useState(false);
  const [hover, setHover] = useState(false);
  const text = tw ? displayed : msg.content;

  useEffect(() => { const t = setTimeout(() => setVis(true), 40); return () => clearTimeout(t); }, []);

  const projSrcs = isDone ? (msg.sources || []).filter((s: any) => s.category === 'project').slice(0, 3) : [];
  const otherSrcs = isDone ? (msg.sources || []).filter((s: any) => s.category !== 'project').slice(0, 3) : [];

  return (
    <div
      className={`flex w-full ${isU ? 'justify-end' : 'justify-start'} ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{ transition: 'all 0.35s var(--easing)', transitionDelay: `${Math.min(idx * 15, 150)}ms` }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      {/* Bot icon */}
      {!isU && (
        <div className="flex-shrink-0 mr-2 mt-0.5">
          <div className="w-6 h-6 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <YakaLogo className="w-3 h-3 text-white dark:text-black [&_path]:stroke-current [&_line]:stroke-current [&_circle]:fill-current" />
          </div>
        </div>
      )}

      <div className={`max-w-[82%] ${isU ? '' : ''}`}>
        {/* Bubble */}
        <div className={`px-3.5 py-2.5 text-[13px] leading-[1.7] ${isU
            ? 'bg-black text-white dark:bg-white dark:text-black rounded-[16px] rounded-br-[4px] border border-transparent'
            : 'bg-gray-50 dark:bg-zinc-900 text-[hsl(var(--foreground)/0.85)] rounded-[16px] rounded-tl-[4px] border border-gray-100 dark:border-zinc-800'
          }`}>
          {text.split('\n').map((line, i) => {
            if (line.trim().startsWith('→')) {
              return (
                <div key={i} className={`flex gap-2 ${i > 0 ? 'mt-1' : ''}`}>
                  <span className={`flex-shrink-0 ${isU ? 'opacity-40' : 'text-gray-400 dark:text-zinc-500'}`}>→</span>
                  <span className="flex-1">{rich(line.replace(/^→\s*/, ''))}</span>
                </div>
              );
            }
            if (!line.trim()) return <div key={i} className="h-1.5" />
            return <p key={i} className={i > 0 ? 'mt-1' : ''}>{rich(line)}</p>
          })}
          {tw && !isDone && <span className="inline-block w-[2px] h-3.5 bg-black dark:bg-white ml-0.5 align-middle" style={{ animation: 'blink 1s step-end infinite' }} />}
        </div>

        {/* Project cards */}
        {projSrcs.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {projSrcs.map((e: any) => <ProjCard key={e.id} e={e} />)}
          </div>
        )}

        {/* Source chips */}
        {otherSrcs.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {otherSrcs.map((s: any) => (
              <a key={s.id} href={s.link || '#'} className="text-[8px] px-1.5 py-[2px] rounded-full bg-[hsl(var(--gold)/0.05)] text-[hsl(var(--gold)/0.5)] hover:text-[hsl(var(--gold))] font-['DM_Mono'] uppercase tracking-wider transition-colors">
                {s.title.length > 20 ? s.title.slice(0, 20) + '…' : s.title}
              </a>
            ))}
          </div>
        )}

        {/* Actions row */}
        {!isU && isDone && (
          <div className={`flex items-center gap-0.5 mt-1 transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[8px] text-[hsl(var(--muted-foreground)/0.2)] font-['DM_Mono'] mr-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {[
              { key: 'like' as const, icon: ic.up, active: msg.reactions?.like, color: 'gold' },
              { key: 'dislike' as const, icon: ic.dn, active: msg.reactions?.dislike, color: 'crimson' },
              { key: 'copied' as const, icon: msg.reactions?.copied ? ic.ck : ic.cp, active: msg.reactions?.copied, color: 'emerald' },
            ].map(({ key, icon, active }) => (
              <button key={key} onClick={() => key === 'copied' ? onCopy() : onReact(key)}
                className={`p-0.5 rounded transition-colors ${active ? 'text-black dark:text-white' : 'text-gray-300 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'}`}>
                <I d={icon} s={10} />
              </button>
            ))}
            {onRegen && (
              <button onClick={onRegen} className="p-0.5 rounded text-gray-300 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">
                <I d={ic.ref} s={10} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

const ChatBot: React.FC = () => {
  const {
    messages, isLoading, isOpen, inputValue, suggestions, messagesEndRef,
    messageCount, soundEnabled, unreadCount,
    setInputValue, sendMessage, regenerateLastMessage, toggleChat,
    closeChat, clearChat, toggleSound, reactToMessage, exportChat, markRead,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [scrollBtn, setScrollBtn] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [voiceErr, setVoiceErr] = useState<string | null>(null);

  const { size, setSize, onMouseDown } = useResize(390, 580, 330, 400, 680, 780);
  const { isListening, isSupported: hasVoice, error: vErr, toggle: toggleV } = useVoiceInput(
    (t) => { setInputValue(t); setTimeout(() => sendMessage(t), 250); },
    (t) => setInputValue(t),
  );

  useEffect(() => { if (vErr) { setVoiceErr(vErr); const t = setTimeout(() => setVoiceErr(null), 3500); return () => clearTimeout(t); } }, [vErr]);
  useEffect(() => { const c = () => setMobile(window.innerWidth < 640); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);
  useEffect(() => { if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 350); }, [isOpen]);
  useEffect(() => { if (isOpen) { markRead(); setInteracted(true); } }, [isOpen, markRead]);
  useEffect(() => {
    const el = bodyRef.current; if (!el) return;
    const fn = () => setScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
    el.addEventListener('scroll', fn); return () => el.removeEventListener('scroll', fn);
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!searchQ.trim()) return messages;
    const q = searchQ.toLowerCase();
    return messages.filter(m => m.content.toLowerCase().includes(q));
  }, [messages, searchQ]);

  const doClose = useCallback(() => { setClosing(true); setTimeout(() => { closeChat(); setClosing(false); setExpanded(false); }, 250); }, [closeChat]);
  const doSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(); };
  const scrollEnd = () => bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  const doCopy = (c: string, id: string) => { navigator.clipboard.writeText(c); reactToMessage(id, 'copied'); setTimeout(() => reactToMessage(id, 'copied'), 2000); };
  const doExpand = () => {
    if (mobile) return;
    setExpanded(p => !p);
    if (!expanded) setSize({ w: Math.min(680, window.innerWidth - 40), h: Math.min(780, window.innerHeight - 100) });
    else setSize({ w: 390, h: 580 });
  };

  // Get last bot message for follow-ups + profile suggestions
  const lastBot = useMemo(() => [...messages].reverse().find(m => m.role === 'assistant'), [messages]);
  const followUps = lastBot?.followUps || [];
  const profileSuggestions = useMemo(
    () => getProfileSuggestions(lastBot?.sources || [], messageCount),
    [lastBot, messageCount]
  );

  // Combine follow-ups + profile suggestions into one single-line strip
  const allSuggestions = useMemo(() => {
    const combined = [...followUps];
    profileSuggestions.forEach(s => { if (!combined.includes(s)) combined.push(s); });
    return combined.slice(0, 5);
  }, [followUps, profileSuggestions]);

  return (
    <>
      <style>{`
        @keyframes yFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ySlideLeft{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes yPanelIn{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes yPanelOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(16px) scale(0.97)}}
        @keyframes yBounce{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-5px);opacity:1}}
        @keyframes yPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,0,0,0.15)}50%{box-shadow:0 0 0 12px rgba(0,0,0,0)}}
        @keyframes yFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes ySheet{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes ySheetOut{from{transform:translateY(0)}to{transform:translateY(100%)}}
        @keyframes yMicPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.15)}}
        @keyframes ySpinOnce{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .yScroll::-webkit-scrollbar{width:2px}
        .yScroll::-webkit-scrollbar-track{background:transparent}
        .yScroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.08);border-radius:10px}
        .dark .yScroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08)}
        .ySugStrip{display:flex;align-items:center;gap:6px;overflow-x:auto;padding:8px 12px;scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}
        .ySugStrip::-webkit-scrollbar{display:none}
        .yHdrBtn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;color:rgba(0,0,0,0.25);transition:all 0.2s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .yHdrBtn:hover{color:rgba(0,0,0,0.75);background:rgba(0,0,0,0.04);transform:scale(1.08);}
        .dark .yHdrBtn{color:rgba(255,255,255,0.25);}
        .dark .yHdrBtn:hover{color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.06);}
        .ySugChip{flex-shrink:0;white-space:nowrap;font-size:10px;padding:4px 12px;border-radius:999px;border:1px solid;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);cursor:pointer;font-family:'Instrument Sans',sans-serif;}
        .ySugChip{background:white;color:rgba(0,0,0,0.5);border-color:rgba(0,0,0,0.1);}
        .ySugChip:hover{background:black;color:white;border-color:black;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.15);}
        .dark .ySugChip{background:black;color:rgba(255,255,255,0.4);border-color:rgba(255,255,255,0.1);}
        .dark .ySugChip:hover{background:white;color:black;border-color:white;box-shadow:0 4px 12px rgba(255,255,255,0.1);}
        .yInitCard{text-align:left;padding:10px;border-radius:10px;border:1px solid transparent;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);cursor:pointer;background:rgba(0,0,0,0.02);}
        .yInitCard:hover{background:white;border-color:rgba(0,0,0,0.08);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.06);}
        .dark .yInitCard{background:rgba(255,255,255,0.02);}
        .dark .yInitCard:hover{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
        .yMicBtn{position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);cursor:pointer;flex-shrink:0;}
        .yMicBtn.idle{color:rgba(0,0,0,0.2);}.yMicBtn.idle:hover{color:rgba(0,0,0,0.6);background:rgba(0,0,0,0.05);transform:scale(1.05);}
        .dark .yMicBtn.idle{color:rgba(255,255,255,0.2);}.dark .yMicBtn.idle:hover{color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.06);}
        .yMicBtn.active{background:black;color:white;animation:yMicPulse 1.5s ease infinite;}
        .dark .yMicBtn.active{background:white;color:black;}
        .ySendBtn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:black;color:white;flex-shrink:0;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .ySendBtn:hover:not(:disabled){transform:scale(1.06);box-shadow:0 4px 14px rgba(0,0,0,0.25);}
        .ySendBtn:active:not(:disabled){transform:scale(0.95);}
        .ySendBtn:disabled{opacity:0.15;cursor:default;}
        .dark .ySendBtn{background:white;color:black;}
        .dark .ySendBtn:hover:not(:disabled){box-shadow:0 4px 14px rgba(255,255,255,0.2);}
      `}</style>

      {/* ── FAB ── */}
      <button onClick={toggleChat} aria-label="Toggle Yaka" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9990] group" style={{ cursor: 'pointer' }}>
        {!interacted && !isOpen && <div className="absolute inset-0 rounded-2xl" style={{ animation: 'yPulse 2.5s ease infinite' }} />}
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-[hsl(var(--crimson))] text-white shadow-lg shadow-[hsl(var(--crimson)/.15)] transition-all duration-400 group-hover:scale-105 group-hover:shadow-xl active:scale-95"
          style={{ animation: !isOpen && !interacted ? 'yFloat 3s ease infinite' : undefined }}>
          {isOpen ? <I d={ic.x} s={18} /> : <YakaLogo className="w-7 h-7" />}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[hsl(var(--gold))] rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-[hsl(var(--background))]">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
          {!interacted && !isOpen && !mobile && <span className="absolute -top-1 -left-1 px-1 py-px rounded bg-[hsl(var(--foreground)/.75)] text-[hsl(var(--background))] text-[7px] font-['DM_Mono'] opacity-50">⌘K</span>}
        </div>
      </button>

      {/* ── Mobile overlay ── */}
      {isOpen && mobile && <div className="fixed inset-0 z-[9988] bg-black/30 backdrop-blur-[2px]" onClick={doClose} />}

      {/* ── Panel ── */}
      {isOpen && (
        <div
          className={`fixed z-[9989] ${mobile ? 'bottom-0 left-0 right-0' : 'bottom-[88px] right-5 sm:right-6'}`}
          style={{
            width: mobile ? '100%' : `${size.w}px`,
            maxWidth: mobile ? '100%' : 'calc(100vw - 32px)',
            animation: mobile
              ? (closing ? 'ySheetOut .25s ease both' : 'ySheet .35s var(--easing) both')
              : (closing ? 'yPanelOut .25s ease both' : 'yPanelIn .35s var(--easing) both'),
          }}
        >
          <div
            className={`flex flex-col overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 ${mobile ? 'rounded-t-2xl' : 'rounded-2xl'} elevation-card`}
            style={{ height: mobile ? '82vh' : `${size.h}px`, maxHeight: mobile ? '82vh' : 'calc(100vh - 110px)' }}
          >
            {/* Resize handle */}
            {!mobile && !expanded && (
              <div onMouseDown={onMouseDown} className="absolute top-0 left-0 w-4 h-4 z-10 cursor-nw-resize group/r">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[hsl(var(--muted-foreground)/.1)] group-hover/r:border-[hsl(var(--gold)/.4)] transition-colors" />
              </div>
            )}

            {/* ── HEADER ── */}
            <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-zinc-900 flex-shrink-0 bg-white dark:bg-black">
              {mobile && <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[hsl(var(--muted-foreground)/.1)]" />}

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                    <YakaLogo className="w-4 h-4 text-white dark:text-black [&_path]:stroke-current [&_line]:stroke-current [&_circle]:fill-current" />
                  </div>
                  <span className="absolute -bottom-px -right-px w-2 h-2 bg-emerald-400 rounded-full border-[1.5px] border-white dark:border-black" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[hsl(var(--foreground))] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans'" }}>
                    Yaka
                    <span className="ml-1.5 text-[7px] font-medium px-1 py-px rounded bg-[hsl(var(--crimson)/.06)] text-[hsl(var(--crimson)/.5)] font-['DM_Mono'] uppercase tracking-wider align-middle">agent</span>
                  </p>
                  <p className="text-[8px] text-[hsl(var(--muted-foreground)/.3)] font-['DM_Mono'] tracking-[.1em]">
                    {isLoading ? 'typing…' : 'online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {[
                  { fn: () => setSearching(p => !p), icon: ic.src, title: 'Search', show: true, active: searching },
                  { fn: toggleSound, icon: soundEnabled ? ic.vol : ic.mut, title: soundEnabled ? 'Mute' : 'Sound', show: true },
                  { fn: exportChat, icon: ic.dl, title: 'Export', show: !mobile },
                  { fn: doExpand, icon: expanded ? ic.col : ic.exp, title: expanded ? 'Collapse' : 'Expand', show: !mobile },
                  { fn: clearChat, icon: ic.ref, title: 'Clear', show: true },
                  { fn: doClose, icon: ic.min, title: 'Minimize', show: true },
                ].filter(b => b.show).map((b, i) => (
                  <button key={i} onClick={b.fn} className={`yHdrBtn ${b.active ? '!text-black dark:!text-white !bg-black/[0.05] dark:!bg-white/[0.07]' : ''}`} title={b.title}>
                    <I d={b.icon} s={13} />
                  </button>
                ))}
              </div>
            </header>

            {/* Search */}
            {searching && (
              <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/50 animate-[yFade_.2s_ease]">
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search messages…"
                  className="w-full px-3 py-1.5 text-[11px] rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 focus:border-gray-400 dark:focus:border-zinc-600 focus:outline-none transition-colors"
                  style={{ fontFamily: "'Instrument Sans'" }} autoFocus />
              </div>
            )}

            {/* ── MESSAGES ── */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3.5 yScroll">
              {filtered.map((m, i) => (
                <Msg key={m.id} msg={m} idx={i}
                  isLast={i === filtered.length - 1 && !isLoading}
                  onRegen={i === filtered.length - 1 && m.role === 'assistant' && m.id !== 'welcome' ? regenerateLastMessage : undefined}
                  onReact={r => reactToMessage(m.id, r)}
                  onCopy={() => doCopy(m.content, m.id)}
                />
              ))}

              {isLoading && (
                <div className="flex items-start gap-2 animate-[yFade_.3s_ease]">
                  <div className="w-6 h-6 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                    <YakaLogo className="w-3 h-3 text-white dark:text-black [&_path]:stroke-current [&_line]:stroke-current [&_circle]:fill-current" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl rounded-tl-sm bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                    {[0, 1, 2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600" style={{ animation: `yBounce 1.2s ease ${i * .15}s infinite` }} />)}
                  </div>
                </div>
              )}

              {/* Initial suggestions — 2×4 grid */}
              {messages.length <= 1 && !isLoading && (
                <div className="pt-1 animate-[yFade_.3s_ease]">
                  <p className="text-[8px] text-black/20 dark:text-white/20 font-['DM_Mono'] tracking-[.12em] uppercase mb-2 ml-0.5">Explore</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {suggestions.slice(0, 8).map((s, i) => (
                      <button key={s.query} onClick={() => sendMessage(s.query)} className="yInitCard"
                        style={{ animationDelay: `${i * 50}ms`, animation: 'yFade .3s var(--easing) both' }}>
                        <span className="text-[14px] block mb-1">{s.icon}</span>
                        <span className="text-[11px] font-medium text-black/60 dark:text-white/50 block leading-tight">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
            </div>

            {/* Scroll btn */}
            {scrollBtn && (
              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10">
                <button onClick={scrollEnd} className="px-2.5 py-1 rounded-full bg-[hsl(var(--background))] dark:bg-[hsl(0,0%,6%)] border border-[hsl(var(--border)/.4)] shadow text-[9px] text-[hsl(var(--muted-foreground)/.4)] hover:text-[hsl(var(--foreground)/.6)] flex items-center gap-1 transition-colors" style={{ cursor: 'pointer' }}>
                  <I d={ic.chD} s={8} /> scroll down
                </button>
              </div>
            )}

            {/* ── SUGGESTION STRIP — single line, always scrollable ── */}
            {allSuggestions.length > 0 && messages.length > 1 && !isLoading && (
              <div className="flex-shrink-0 border-t border-gray-100 dark:border-zinc-900" style={{ minHeight: 0 }}>
                <div className="ySugStrip" ref={suggestionsRef}>
                  <span className="flex-shrink-0 text-[8px] text-black/20 dark:text-white/20 font-['DM_Mono'] uppercase tracking-widest pr-1">Try</span>
                  {allSuggestions.map((q, qi) => (
                    <button key={q} onClick={() => sendMessage(q)} className="ySugChip"
                      style={{ animationDelay: `${qi * 60}ms`, animation: 'ySlideLeft .3s var(--easing) both' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── INPUT ── */}
            <div className="flex-shrink-0 px-3 pb-3 pt-2">
              <form onSubmit={doSubmit} className="flex items-center gap-2">
                {hasVoice && (
                  <button type="button" onClick={toggleV} className={`yMicBtn ${isListening ? 'active' : 'idle'}`}>
                    <I d={isListening ? ic.micX : ic.mic} s={14} />
                    {isListening && (
                      <span className="absolute inset-[-3px] rounded-xl border border-black/20 dark:border-white/20" style={{ animation: 'yFade .6s ease infinite alternate' }} />
                    )}
                  </button>
                )}

                <input ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={isListening ? '🎤 Listening… speak now' : 'Ask anything about this portfolio…'}
                  disabled={isLoading || isListening}
                  className="flex-1 px-3 py-[7px] text-[13px] rounded-xl bg-transparent text-[hsl(var(--foreground))] placeholder:text-gray-300 dark:placeholder:text-zinc-600 border border-gray-200 dark:border-zinc-800 focus:border-black dark:focus:border-white focus:outline-none transition-all disabled:opacity-30"
                  style={{ fontFamily: "'Instrument Sans'", cursor: 'text' }} />

                <button type="submit" disabled={!inputValue.trim() || isLoading} className="ySendBtn">
                  <I d={ic.send} s={13} />
                </button>
              </form>

              {/* Voice error */}
              {voiceErr && (
                <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/30 dark:border-red-800/20 animate-[yFade_.2s_ease]">
                  <span className="text-red-400 text-[10px]">⚠</span>
                  <span className="text-[10px] text-red-400/80 flex-1">{voiceErr}</span>
                  <button onClick={() => setVoiceErr(null)} className="text-red-300 hover:text-red-400" style={{ cursor: 'pointer' }}><I d={ic.x} s={8} /></button>
                </div>
              )}

              {/* Footer */}
              <p className="text-center text-[7px] text-[hsl(var(--muted-foreground)/.15)] font-['DM_Mono'] tracking-[.15em] uppercase mt-2">
                yaka · portfolio agent{!mobile && <span className="ml-1.5 opacity-60">⌘K</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;