// src/features/agent/components/ChatBot.tsx
// ═══════════════════════════════════════════════════════════════════════════════
// GARA YAKA — SPIRIT MESSENGER v5 — Ultimate Portfolio Agent
// Features: Resize, Fullscreen, Voice, Typewriter, Reactions, Export,
//           Keyboard Shortcuts, Mobile Bottom Sheet, Follow-up Suggestions,
//           Scroll Indicator, Sound Toggle, Message Search
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../services/ai-service';

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════

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
    <circle cx="16" cy="4" r="1.5" fill="hsl(var(--gold))">
      <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const Icon = ({ d, className = '', size = 16 }: { d: string; className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  send: 'M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z',
  close: 'M18 6L6 18M6 6L18 18',
  minus: 'M5 12H19',
  refresh: 'M1 4V10H7M23 20V14H17',
  expand: 'M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14',
  collapse: 'M4 14H10V20M20 10H14V4M14 10L21 3M10 14L3 21',
  search: 'M11 3a8 8 0 100 16 8 8 0 000-16zM21 21l-4.35-4.35',
  download: 'M21 15V19A2 2 0 0119 21H5A2 2 0 013 19V15M7 10L12 15L17 10M12 15V3',
  volume: 'M11 5L6 9H2V15H6L11 19V5ZM15.54 8.46A5 5 0 0118 12A5 5 0 0115.54 15.54',
  mute: 'M11 5L6 9H2V15H6L11 19V5ZM23 9L17 15M17 9L23 15',
  mic: 'M12 1A3 3 0 0115 4V12A3 3 0 0112 15A3 3 0 019 12V4A3 3 0 0112 1ZM19 10V12A7 7 0 015 12V10M12 19V23M8 23H16',
  micOff: 'M1 1L23 23M9 9V12A3 3 0 005.12 14.88M15 9.34V4A3 3 0 009.57 1.57M12 19V23M8 23H16M19 10V12',
  thumbsUp: 'M14 9V5A3 3 0 0010 5V9M10 15L8 21H5L3 15V9H7M10 15H17.5A1.5 1.5 0 0019 13.5V13A1 1 0 0018 12H14',
  thumbsDown: 'M10 15V19A3 3 0 0014 19V15M14 9L16 3H19L21 9V15H17M14 9H6.5A1.5 1.5 0 005 10.5V11A1 1 0 006 12H10',
  copy: 'M20 9H11A2 2 0 009 11V20A2 2 0 0011 22H20A2 2 0 0022 20V11A2 2 0 0020 9ZM5 15H4A2 2 0 012 13V4A2 2 0 014 2H13A2 2 0 0115 4V5',
  check: 'M20 6L9 17L4 12',
  chevronDown: 'M6 9L12 15L18 9',
  keyboard: 'M4 7H20A2 2 0 0122 9V17A2 2 0 0120 19H4A2 2 0 012 17V9A2 2 0 014 7ZM7 11H7.01M12 11H12.01M17 11H17.01M7 15H17',
  link: 'M10 13A5 5 0 007.54 15.54L4 19M14 11A5 5 0 0016.46 8.46L20 5',
};

// ════════════════════════════════════════════════════════════════════════════
// TYPING INDICATOR
// ════════════════════════════════════════════════════════════════════════════

const TypingIndicator = () => (
  <div className="flex items-start gap-3 animate-[yakaFadeUp_0.3s_ease_both]">
    <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[hsl(var(--crimson)/0.12)] to-[hsl(var(--gold)/0.08)] flex items-center justify-center flex-shrink-0">
      <YakaLogo className="w-4 h-4" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[hsl(var(--muted)/0.4)] dark:bg-[hsl(0,0%,9%)] border border-[hsl(var(--border)/0.5)]">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-[5px] h-[5px] rounded-full bg-[hsl(var(--crimson)/0.5)]" style={{ animation: `yakaTypingBounce 1.2s ease ${i * 0.15}s infinite` }} />
          ))}
        </div>
        <span className="text-[10px] text-[hsl(var(--muted-foreground)/0.35)] font-['DM_Mono']">thinking</span>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// TYPEWRITER EFFECT HOOK
// ════════════════════════════════════════════════════════════════════════════

function useTypewriter(text: string, speed = 12, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const [isDone, setIsDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, isDone };
}

// ════════════════════════════════════════════════════════════════════════════
// RICH TEXT RENDERER
// ════════════════════════════════════════════════════════════════════════════

function renderRichText(text: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|_[^_]+_)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[hsl(var(--foreground))]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="text-[11px] px-1.5 py-0.5 rounded-md bg-[hsl(var(--crimson)/0.08)] text-[hsl(var(--crimson))] font-['DM_Mono']">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('_') && part.endsWith('_') && !part.startsWith('__')) {
      return <em key={i} className="text-[hsl(var(--muted-foreground)/0.6)] not-italic text-[12px]">{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} className="text-[hsl(var(--gold))] hover:text-[hsl(var(--crimson))] underline underline-offset-2 decoration-[hsl(var(--gold)/0.3)] transition-colors">
          {linkMatch[1]} ↗
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ════════════════════════════════════════════════════════════════════════════
// PROJECT PREVIEW CARD
// ════════════════════════════════════════════════════════════════════════════

const ProjectCard = ({ entry }: { entry: any }) => (
  <a
    href={entry.link || '#'}
    className="group block rounded-xl p-3.5 border border-[hsl(var(--border))] bg-[hsl(var(--card))] dark:bg-[hsl(0,0%,7%)] hover:border-[hsl(var(--gold)/0.4)] hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <h4 className="text-[12px] font-bold text-[hsl(var(--foreground))] truncate leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {entry.title}
        </h4>
        <p className="text-[11px] text-[hsl(var(--muted-foreground)/0.6)] mt-1 line-clamp-2 leading-relaxed">
          {entry.content.split('.')[0]}.
        </p>
      </div>
      <span className="text-[hsl(var(--gold)/0.5)] group-hover:text-[hsl(var(--gold))] transition-colors flex-shrink-0 mt-0.5">
        <Icon d={icons.link} size={12} />
      </span>
    </div>
    {entry.metadata?.tech && (
      <div className="mt-2 flex flex-wrap gap-1">
        {entry.metadata.tech.split(',').slice(0, 3).map((t: string, i: number) => (
          <span key={i} className="text-[9px] px-1.5 py-[2px] rounded bg-[hsl(var(--gold)/0.08)] text-[hsl(var(--gold)/0.7)] font-['DM_Mono']">
            {t.trim()}
          </span>
        ))}
      </div>
    )}
  </a>
);

// ════════════════════════════════════════════════════════════════════════════
// MESSAGE BUBBLE
// ════════════════════════════════════════════════════════════════════════════

const MessageBubble = ({
  message,
  index,
  isLatest,
  onRegenerate,
  onReact,
  onCopy,
}: {
  message: ChatMessage;
  index: number;
  isLatest: boolean;
  onRegenerate?: () => void;
  onReact: (reaction: 'like' | 'dislike' | 'copied') => void;
  onCopy: () => void;
}) => {
  const isUser = message.role === 'user';
  const enableTypewriter = isLatest && !isUser && message.id !== 'welcome';
  const { displayed, isDone } = useTypewriter(message.content, 8, enableTypewriter);
  const [visible, setVisible] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const textToShow = enableTypewriter ? displayed : message.content;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const hasProjectSources = message.sources?.some((s) => s.category === 'project') && isDone;

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      style={{ transition: 'all 0.4s var(--easing)', transitionDelay: `${Math.min(index * 20, 200)}ms` }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mr-2.5 mt-0.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[hsl(var(--crimson)/0.12)] to-[hsl(var(--gold)/0.08)] dark:from-[hsl(var(--crimson)/0.2)] dark:to-[hsl(var(--gold)/0.1)] flex items-center justify-center">
            <YakaLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'order-1' : ''}`}>
        {/* Bubble */}
        <div
          className={`
            relative px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13px] leading-[1.7]
            ${isUser
              ? 'bg-[hsl(var(--crimson))] text-white rounded-2xl rounded-br-[4px] shadow-md shadow-[hsl(var(--crimson)/0.12)]'
              : 'bg-[hsl(var(--muted)/0.35)] dark:bg-[hsl(0,0%,8%)] text-[hsl(var(--foreground)/0.88)] rounded-2xl rounded-tl-[4px] border border-[hsl(var(--border)/0.5)]'
            }
          `}
        >
          {textToShow.split('\n').map((line, i) => {
            if (line.trim().startsWith('→')) {
              return (
                <div key={i} className={`flex gap-2 ${i > 0 ? 'mt-1.5' : ''}`}>
                  <span className={`flex-shrink-0 mt-0.5 ${isUser ? 'text-white/50' : 'text-[hsl(var(--gold))]'}`}>→</span>
                  <span className="flex-1">{renderRichText(line.replace(/^→\s*/, ''))}</span>
                </div>
              );
            }
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{renderRichText(line)}</p>;
          })}

          {/* Typewriter cursor */}
          {enableTypewriter && !isDone && (
            <span className="inline-block w-[2px] h-[14px] bg-[hsl(var(--crimson))] ml-0.5 align-middle" style={{ animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        {/* Project cards */}
        {hasProjectSources && (
          <div className="mt-2 space-y-1.5">
            {message.sources!.filter((s) => s.category === 'project').slice(0, 4).map((entry) => (
              <ProjectCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Non-project source chips */}
        {!isUser && isDone && message.sources && message.sources.filter((s) => s.category !== 'project').length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 ml-1">
            {message.sources.filter((s) => s.category !== 'project').slice(0, 3).map((s) => (
              <a
                key={s.id}
                href={s.link || '#'}
                className="inline-flex items-center gap-1 text-[9px] px-2 py-[3px] rounded-full bg-[hsl(var(--gold)/0.06)] text-[hsl(var(--gold)/0.65)] hover:bg-[hsl(var(--gold)/0.12)] hover:text-[hsl(var(--gold))] transition-all font-['DM_Mono'] uppercase tracking-wider"
              >
                <span className="w-[3px] h-[3px] rounded-full bg-current opacity-60" />
                {s.title.length > 22 ? s.title.slice(0, 22) + '…' : s.title}
              </a>
            ))}
          </div>
        )}

        {/* Message actions */}
        {!isUser && isDone && (
          <div
            className={`flex items-center gap-1 mt-1.5 ml-1 transition-all duration-200 ${showActions ? 'opacity-100' : 'opacity-0 sm:opacity-0'}`}
            style={{ height: showActions ? '24px' : '0px', overflow: 'hidden', transition: 'all 0.2s ease' }}
          >
            <span className="text-[9px] text-[hsl(var(--muted-foreground)/0.25)] font-['DM_Mono'] mr-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            <button
              onClick={() => onReact('like')}
              className={`p-1 rounded-md transition-colors ${message.reactions?.like ? 'text-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.1)]' : 'text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--gold))]'}`}
              title="Helpful"
            >
              <Icon d={icons.thumbsUp} size={11} />
            </button>

            <button
              onClick={() => onReact('dislike')}
              className={`p-1 rounded-md transition-colors ${message.reactions?.dislike ? 'text-[hsl(var(--crimson))] bg-[hsl(var(--crimson)/0.1)]' : 'text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--crimson))]'}`}
              title="Not helpful"
            >
              <Icon d={icons.thumbsDown} size={11} />
            </button>

            <button
              onClick={onCopy}
              className={`p-1 rounded-md transition-colors ${message.reactions?.copied ? 'text-emerald-500' : 'text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)]'}`}
              title="Copy"
            >
              <Icon d={message.reactions?.copied ? icons.check : icons.copy} size={11} />
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded-md text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] transition-colors"
                title="Regenerate"
              >
                <Icon d={icons.refresh} size={11} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// VOICE INPUT HOOK
// ════════════════════════════════════════════════════════════════════════════

function useVoiceInput(
  onResult: (text: string) => void,
  onInterim?: (text: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  // Check support on mount
  useEffect(() => {
    const supported = !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
    setIsSupported(supported);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    setError(null);

    if (!isSupported) {
      setError('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    // If already listening, stop
    if (isListeningRef.current) {
      stop();
      return;
    }

    // Kill any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      // Configuration
      recognition.continuous = true; // Prevents immediate 'no-speech' timeout on brief silence
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Show interim results in input
        if (interimTranscript && onInterim) {
          onInterim(interimTranscript);
        }

        // Final result — send it
        if (finalTranscript) {
          onResult(finalTranscript.trim());
          // Auto-stop after getting final result
          setTimeout(() => stop(), 100);
        }
      };

      recognition.onerror = (event: any) => {
        const errorMap: Record<string, string> = {
          'not-allowed': 'Microphone permission denied. Please allow microphone access.',
          'no-speech': 'No speech detected. Try again.',
          'audio-capture': 'No microphone found. Check your device.',
          'network': 'Network error. Check your connection.',
          'aborted': '', // User aborted, no error message needed
          'service-not-allowed': 'Speech service not available. Try Chrome or Edge.',
        };

        const errorMsg = errorMap[event.error] || `Voice error: ${event.error}`;
        if (event.error !== 'aborted') {
          setError(errorMsg);
          console.warn('Speech recognition error:', event.error);
        }

        isListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (startErr) {
        setError('Could not start microphone. Please check permissions.');
        console.error('Speech start error:', startErr);
        setIsListening(false);
      }
    } catch (err) {
      setError('Failed to initialize voice input.');
      console.error('Speech init error:', err);
      setIsListening(false);
    }
  }, [isSupported, onResult, onInterim, stop]);

  const toggle = useCallback(() => {
    if (isListeningRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  return { isListening, isSupported, error, toggle, stop };
}

// ════════════════════════════════════════════════════════════════════════════
// RESIZE HOOK
// ════════════════════════════════════════════════════════════════════════════

function useResize(initialW: number, initialH: number, minW: number, minH: number, maxW: number, maxH: number) {
  const [size, setSize] = useState({ w: initialW, h: initialH });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };

    const onMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dw = startPos.current.x - ev.clientX;
      const dh = startPos.current.y - ev.clientY;
      setSize({
        w: Math.min(maxW, Math.max(minW, startPos.current.w + dw)),
        h: Math.min(maxH, Math.max(minH, startPos.current.h + dh)),
      });
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [size, minW, minH, maxW, maxH]);

  return { size, setSize, onMouseDown };
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const ChatBot: React.FC = () => {
  const {
    messages, isLoading, isOpen, inputValue, suggestions, messagesEndRef,
    messageCount, soundEnabled, unreadCount,
    setInputValue, sendMessage, regenerateLastMessage, toggleChat,
    closeChat, clearChat, toggleSound, reactToMessage, exportChat, markRead,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const { size, setSize, onMouseDown } = useResize(400, 600, 340, 420, 700, 800);
  const { isListening, isSupported: voiceSupported, error: voiceErr, toggle: toggleVoice } = useVoiceInput(
    // onResult — final transcript
    (text) => {
      setInputValue(text);
      // Small delay so user can see the text before it sends
      setTimeout(() => sendMessage(text), 300);
    },
    // onInterim — show partial transcript in input
    (interimText) => {
      setInputValue(interimText);
    }
  );

  // Show voice errors briefly
  useEffect(() => {
    if (voiceErr) {
      setVoiceError(voiceErr);
      const timer = setTimeout(() => setVoiceError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [voiceErr]);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Focus input
  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  // Mark read when open
  useEffect(() => {
    if (isOpen) { markRead(); setHasInteracted(true); }
  }, [isOpen, markRead]);

  // Scroll detection
  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    const onScroll = () => {
      const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBottom(gap > 100);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  // Filtered messages for search
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter((m) => m.content.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => { closeChat(); setIsClosing(false); setIsExpanded(false); }, 280);
  }, [closeChat]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(); };

  const scrollToBottom = () => chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });

  const handleCopy = (content: string, msgId: string) => {
    navigator.clipboard.writeText(content);
    reactToMessage(msgId, 'copied');
    setTimeout(() => reactToMessage(msgId, 'copied'), 2000);
  };

  const toggleExpand = () => {
    if (isMobile) return;
    setIsExpanded((p) => !p);
    if (!isExpanded) setSize({ w: Math.min(700, window.innerWidth - 48), h: Math.min(800, window.innerHeight - 120) });
    else setSize({ w: 400, h: 600 });
  };

  // Follow-ups from last bot message
  const lastBotMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const followUps = lastBotMessage?.followUps || [];

  // Panel dimensions
  const panelW = isMobile ? '100vw' : isExpanded ? `${size.w}px` : `${size.w}px`;
  const panelH = isMobile ? '85vh' : `${size.h}px`;

  return (
    <>
      {/* ════ KEYFRAMES ════ */}
      <style>{`
        @keyframes yakaFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes yakaPanelIn { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes yakaPanelOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(20px) scale(0.96); } }
        @keyframes yakaTypingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes yakaFabPulse { 0%, 100% { box-shadow: 0 0 0 0 hsl(var(--crimson) / 0.25); } 50% { box-shadow: 0 0 0 12px hsl(var(--crimson) / 0); } }
        @keyframes yakaFabFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes yakaSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes yakaSheetDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes yakaMicPulse { 
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--crimson)/0.3); } 
          50% { box-shadow: 0 0 0 10px hsl(var(--crimson)/0); } 
        }
        @keyframes yakaRecDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .yaka-scrollbar::-webkit-scrollbar { width: 3px; }
        .yaka-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .yaka-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--crimson)/0.1); border-radius: 10px; }
        .yaka-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--crimson)/0.25); }
      `}</style>

      {/* ════ FAB BUTTON ════ */}
      <button
        onClick={() => { toggleChat(); }}
        aria-label={isOpen ? 'Close Yaka' : 'Open Yaka (Ctrl+K)'}
        title={isOpen ? 'Close' : 'Ask Yaka (Ctrl+K)'}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9990] group"
        style={{ cursor: 'pointer' }}
      >
        {/* Ripple */}
        {!hasInteracted && !isOpen && (
          <div className="absolute inset-0 rounded-2xl" style={{ animation: 'yakaFabPulse 2.5s ease infinite' }} />
        )}

        <div
          className={`
            relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center
            bg-gradient-to-br from-[hsl(var(--crimson))] to-[hsl(var(--crimson)/0.85)] text-white
            shadow-lg shadow-[hsl(var(--crimson)/0.2)]
            transition-all duration-500 ease-[var(--easing)]
            group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(var(--crimson)/0.3)]
            active:scale-95
          `}
          style={{ animation: !isOpen && !hasInteracted ? 'yakaFabFloat 3s ease infinite' : undefined, width: '56px', height: '56px' }}
        >
          <div className="transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
            {isOpen ? <Icon d={icons.close} className="w-5 h-5" size={20} /> : <YakaLogo className="w-7 h-7" />}
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[hsl(var(--gold))] rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[hsl(var(--background))]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}

          {/* Shortcut hint */}
          {!hasInteracted && !isOpen && !isMobile && (
            <span className="absolute -top-1 -left-1 px-1 py-[1px] rounded bg-[hsl(var(--foreground)/0.8)] text-[hsl(var(--background))] text-[8px] font-['DM_Mono'] opacity-60">
              ⌘K
            </span>
          )}
        </div>
      </button>

      {/* ════ MOBILE OVERLAY ════ */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-[9988] bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
          style={{ animation: isClosing ? 'fadeOut 0.2s ease' : 'fadeIn 0.2s ease' }}
        />
      )}

      {/* ════ CHAT PANEL ════ */}
      {isOpen && (
        <div
          className={`fixed z-[9989] ${isMobile
            ? 'bottom-0 left-0 right-0'
            : 'bottom-[88px] right-5 sm:right-6'
            }`}
          style={{
            width: isMobile ? '100%' : panelW,
            maxWidth: isMobile ? '100%' : 'calc(100vw - 32px)',
            animation: isMobile
              ? (isClosing ? 'yakaSheetDown 0.3s ease both' : 'yakaSheetUp 0.4s var(--easing) both')
              : (isClosing ? 'yakaPanelOut 0.28s ease both' : 'yakaPanelIn 0.4s var(--easing) both'),
          }}
        >
          <div
            className={`flex flex-col overflow-hidden bg-[hsl(var(--card))] dark:bg-[hsl(0,0%,5%)] border border-[hsl(var(--border))] shadow-2xl shadow-black/[0.08] dark:shadow-black/[0.4] ${isMobile ? 'rounded-t-[20px]' : 'rounded-[20px]'
              }`}
            style={{ height: panelH, maxHeight: isMobile ? '85vh' : 'calc(100vh - 120px)' }}
          >
            {/* ── RESIZE HANDLE (desktop only) ── */}
            {!isMobile && !isExpanded && (
              <div
                onMouseDown={onMouseDown}
                className="absolute top-0 left-0 w-5 h-5 z-10 group/resize"
                style={{ cursor: 'nw-resize' }}
              >
                <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-[hsl(var(--muted-foreground)/0.15)] group-hover/resize:border-[hsl(var(--gold)/0.5)] rounded-tl-sm transition-colors" />
              </div>
            )}

            {/* ── HEADER ── */}
            <div className="relative px-4 py-3 border-b border-[hsl(var(--border)/0.5)] flex-shrink-0">
              {/* Shimmer */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--crimson)), hsl(var(--gold)), transparent)', backgroundSize: '200% 100%', animation: 'yakaHeaderShimmer 8s linear infinite' }} />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile drag indicator */}
                  {isMobile && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[hsl(var(--muted-foreground)/0.15)]" />
                  )}

                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--crimson)/0.1)] to-[hsl(var(--gold)/0.06)] flex items-center justify-center border border-[hsl(var(--crimson)/0.06)]">
                      <YakaLogo className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[hsl(var(--card))] dark:border-[hsl(0,0%,5%)]" style={{ animation: 'greenPulse 2s ease infinite' }} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold text-[hsl(var(--foreground))] leading-tight tracking-tight flex items-center gap-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Yaka
                      <span className="text-[8px] font-medium px-1.5 py-[1px] rounded-full bg-[hsl(var(--crimson)/0.08)] text-[hsl(var(--crimson)/0.7)] font-['DM_Mono'] tracking-wider uppercase">
                        v5
                      </span>
                    </h3>
                    <p className="text-[9px] text-[hsl(var(--muted-foreground)/0.4)] font-['DM_Mono'] tracking-[0.1em] mt-0.5">
                      {isLoading ? '● typing...' : `● online · ${messageCount} msg${messageCount !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  <button onClick={() => setShowSearch((p) => !p)} className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.4)] transition-all" title="Search messages" style={{ cursor: 'pointer' }}>
                    <Icon d={icons.search} size={13} />
                  </button>
                  <button onClick={toggleSound} className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.4)] transition-all" title={soundEnabled ? 'Mute' : 'Unmute'} style={{ cursor: 'pointer' }}>
                    <Icon d={soundEnabled ? icons.volume : icons.mute} size={13} />
                  </button>
                  <button onClick={exportChat} className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.4)] transition-all hidden sm:block" title="Export chat" style={{ cursor: 'pointer' }}>
                    <Icon d={icons.download} size={13} />
                  </button>
                  {!isMobile && (
                    <button onClick={toggleExpand} className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.4)] transition-all" title={isExpanded ? 'Collapse' : 'Expand'} style={{ cursor: 'pointer' }}>
                      <Icon d={isExpanded ? icons.collapse : icons.expand} size={13} />
                    </button>
                  )}
                  <button onClick={clearChat} className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.4)] transition-all" title="New chat" style={{ cursor: 'pointer' }}>
                    <Icon d={icons.refresh} size={13} />
                  </button>
                  <button onClick={handleClose} className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.4)] transition-all" title="Close" style={{ cursor: 'pointer' }}>
                    <Icon d={icons.minus} size={13} />
                  </button>
                </div>
              </div>

              {/* Search bar */}
              {showSearch && (
                <div className="mt-2.5 animate-[yakaFadeUp_0.2s_ease_both]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full px-3 py-2 text-[12px] rounded-lg bg-[hsl(var(--muted)/0.3)] dark:bg-[hsl(0,0%,7%)] border border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--gold)/0.3)] focus:outline-none transition-colors"
                    style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    autoFocus
                  />
                  {searchQuery && (
                    <p className="text-[9px] text-[hsl(var(--muted-foreground)/0.35)] mt-1 font-['DM_Mono']">
                      {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── MESSAGES ── */}
            <div ref={chatBodyRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 yaka-scrollbar relative">
              {filteredMessages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  index={i}
                  isLatest={i === filteredMessages.length - 1 && !isLoading}
                  onRegenerate={i === filteredMessages.length - 1 && msg.role === 'assistant' && msg.id !== 'welcome' ? regenerateLastMessage : undefined}
                  onReact={(r) => reactToMessage(msg.id, r)}
                  onCopy={() => handleCopy(msg.content, msg.id)}
                />
              ))}

              {isLoading && <TypingIndicator />}

              {/* Quick suggestions — first visit */}
              {messages.length <= 1 && !isLoading && (
                <div className="pt-2 animate-[yakaFadeUp_0.4s_ease_both]">
                  <p className="text-[9px] text-[hsl(var(--muted-foreground)/0.3)] font-['DM_Mono'] tracking-[0.12em] uppercase mb-2.5 ml-1">
                    Try asking
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {suggestions.slice(0, 8).map((s, i) => (
                      <button
                        key={s.query}
                        onClick={() => sendMessage(s.query)}
                        className="group text-left text-[11px] px-3 py-2.5 rounded-xl bg-[hsl(var(--muted)/0.25)] dark:bg-[hsl(0,0%,7%)] text-[hsl(var(--foreground)/0.55)] border border-transparent hover:border-[hsl(var(--crimson)/0.12)] hover:bg-[hsl(var(--crimson)/0.03)] hover:text-[hsl(var(--foreground)/0.85)] transition-all duration-300"
                        style={{ cursor: 'pointer', fontFamily: "'Instrument Sans'", animationDelay: `${i * 50}ms`, animation: 'yakaFadeUp 0.3s var(--easing) both' }}
                      >
                        <span className="text-[14px] block mb-0.5">{s.icon}</span>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground)/0.4)] group-hover:text-[hsl(var(--muted-foreground)/0.6)] transition-colors">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
            </div>

            {/* Scroll to bottom indicator */}
            {showScrollBottom && (
              <div className="absolute bottom-[120px] sm:bottom-[110px] left-1/2 -translate-x-1/2 z-10">
                <button
                  onClick={scrollToBottom}
                  className="px-3 py-1.5 rounded-full bg-[hsl(var(--card))] dark:bg-[hsl(0,0%,8%)] border border-[hsl(var(--border))] shadow-lg text-[10px] text-[hsl(var(--muted-foreground)/0.6)] hover:text-[hsl(var(--foreground))] transition-all flex items-center gap-1"
                  style={{ cursor: 'pointer' }}
                >
                  <Icon d={icons.chevronDown} size={10} />
                  New messages
                </button>
              </div>
            )}

            {/* ── FOLLOW-UP SUGGESTIONS ── */}
            {followUps.length > 0 && messages.length > 1 && !isLoading && (
              <div className="px-3 sm:px-4 pb-1 flex-shrink-0">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hidden">
                  {followUps.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-full bg-[hsl(var(--muted)/0.25)] dark:bg-[hsl(0,0%,7%)] text-[hsl(var(--muted-foreground)/0.5)] border border-[hsl(var(--border)/0.3)] hover:border-[hsl(var(--crimson)/0.2)] hover:text-[hsl(var(--crimson)/0.8)] transition-all whitespace-nowrap"
                      style={{ cursor: 'pointer', fontFamily: "'Instrument Sans'" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── INPUT ── */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 flex-shrink-0">
              <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--border)/0.5)] to-transparent mb-3" />

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* Voice button */}
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`
      flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl
      flex items-center justify-center
      transition-all duration-300 relative
      ${isListening
                        ? 'bg-[hsl(var(--crimson))] text-white shadow-lg shadow-[hsl(var(--crimson)/0.3)]'
                        : 'text-[hsl(var(--muted-foreground)/0.3)] hover:text-[hsl(var(--foreground)/0.6)] hover:bg-[hsl(var(--muted)/0.3)]'
                      }
    `}
                    style={{
                      cursor: 'pointer',
                      animation: isListening ? 'yakaMicPulse 1.5s ease infinite' : undefined,
                    }}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    <Icon d={isListening ? icons.micOff : icons.mic} size={15} />
                    {/* Listening ring animation */}
                    {isListening && (
                      <>
                        <span className="absolute inset-0 rounded-xl border-2 border-[hsl(var(--crimson)/0.4)] animate-ping" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[hsl(var(--card))] dark:border-[hsl(0,0%,5%)]" style={{ animation: 'blink 1s step-end infinite' }} />
                      </>
                    )}
                  </button>
                )}

                {/* Text input */}
                <div className="flex-1 relative group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={isListening ? '🎤 Listening... speak now' : 'Ask about skills, projects, experience…'}
                    disabled={isLoading || isListening}
                    className="w-full pl-3.5 pr-3.5 py-2.5 sm:py-3 text-[13px] rounded-xl bg-[hsl(var(--muted)/0.3)] dark:bg-[hsl(0,0%,7%)] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/0.3)] border border-[hsl(var(--border)/0.4)] focus:border-[hsl(var(--crimson)/0.25)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--crimson)/0.05)] transition-all duration-300 disabled:opacity-40"
                    style={{ fontFamily: "'Instrument Sans', sans-serif", cursor: 'text' }}
                  />
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[hsl(var(--crimson))] to-[hsl(var(--crimson)/0.85)] text-white shadow-md shadow-[hsl(var(--crimson)/0.12)] hover:shadow-lg hover:scale-[1.04] disabled:opacity-20 disabled:shadow-none disabled:scale-100 active:scale-95 transition-all duration-300"
                  style={{ cursor: inputValue.trim() && !isLoading ? 'pointer' : 'default' }}
                >
                  <Icon d={icons.send} size={14} />
                </button>
              </form>

              {/* Footer */}
              {/* Voice error toast */}
              {voiceError && (
                <div
                  className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.15)] animate-[yakaFadeUp_0.2s_ease_both]"
                >
                  <span className="text-[hsl(var(--destructive))] text-[11px] flex-shrink-0">⚠</span>
                  <p className="text-[11px] text-[hsl(var(--destructive)/0.8)] leading-tight" style={{ fontFamily: "'Instrument Sans'" }}>
                    {voiceError}
                  </p>
                  <button
                    onClick={() => setVoiceError(null)}
                    className="flex-shrink-0 text-[hsl(var(--destructive)/0.5)] hover:text-[hsl(var(--destructive))] ml-auto"
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon d={icons.close} size={10} />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mt-2.5">
                <div className="w-[3px] h-[3px] rounded-full bg-[hsl(var(--crimson)/0.15)]" />
                <p className="text-[7px] sm:text-[8px] text-[hsl(var(--muted-foreground)/0.2)] font-['DM_Mono'] tracking-[0.15em] uppercase">
                  yaka · portfolio agent
                  {!isMobile && <span className="ml-2 opacity-50">ctrl+K</span>}
                </p>
                <div className="w-[3px] h-[3px] rounded-full bg-[hsl(var(--gold)/0.15)]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;