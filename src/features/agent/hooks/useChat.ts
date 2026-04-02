// src/features/agent/hooks/useChat.ts
// ═══════════════════════════════════════════════════════════════════════════════
// CHAT HOOK v5 — Full Feature Set
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { processMessage, generateId, quickSuggestions, type ChatMessage } from '../services/ai-service';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  inputValue: string;
  suggestions: typeof quickSuggestions;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messageCount: number;
  soundEnabled: boolean;
  unreadCount: number;
  setInputValue: (value: string) => void;
  sendMessage: (content?: string) => Promise<void>;
  regenerateLastMessage: () => Promise<void>;
  toggleChat: () => void;
  closeChat: () => void;
  openChat: () => void;
  clearChat: () => void;
  toggleSound: () => void;
  reactToMessage: (messageId: string, reaction: 'like' | 'dislike' | 'copied') => void;
  exportChat: () => void;
  markRead: () => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey! I'm **Yaka** — your guide to this portfolio. Ask me about projects, skills, experience, or anything you see here. What are you curious about? ✨",
  timestamp: new Date(),
  followUps: ['What are your skills?', 'Show me projects', 'Tell me about yourself'],
};

// Simple notification sound
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Silently fail if audio not available
  }
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_AI_API_KEY || '';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Keyboard shortcut: Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((p) => !p);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (content?: string) => {
      const messageContent = content || inputValue.trim();
      if (!messageContent || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      // Natural delay
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));

      try {
        const response = await processMessage(messageContent, messages, apiKey);
        setMessages((prev) => [...prev, response]);
        if (soundEnabled) playNotificationSound();
        if (!isOpen) setUnreadCount((c) => c + 1);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: "Oops — something broke. Give it another shot! 🔧",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, messages, apiKey, soundEnabled, isOpen]
  );

  const regenerateLastMessage = useCallback(async () => {
    if (isLoading || messages.length < 2) return;
    const lastIdx = messages.length - 1;
    if (messages[lastIdx].role !== 'assistant') return;

    setIsLoading(true);
    const lastUserMsg = messages[messages.length - 2];

    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));

    try {
      const newResponse = await processMessage(lastUserMsg.content, messages.slice(0, -1), apiKey);
      setMessages((prev) => {
        const updated = [...prev];
        updated[lastIdx] = newResponse;
        return updated;
      });
      if (soundEnabled) playNotificationSound();
    } catch {
      // Keep existing message
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, apiKey, soundEnabled]);

  const reactToMessage = useCallback((messageId: string, reaction: 'like' | 'dislike' | 'copied') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, reactions: { ...m.reactions, [reaction]: !m.reactions?.[reaction] } }
          : m
      )
    );
  }, []);

  const exportChat = useCallback(() => {
    const chatText = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => `[${m.role.toUpperCase()}] ${m.timestamp.toLocaleTimeString()}\n${m.content}`)
      .join('\n\n---\n\n');

    const blob = new Blob([`Portfolio Chat Export — ${new Date().toLocaleDateString()}\n\n${chatText}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yaka-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen((p) => {
      if (!p) setUnreadCount(0);
      return !p;
    });
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);
  const clearChat = useCallback(() => setMessages([WELCOME_MESSAGE]), []);
  const toggleSound = useCallback(() => setSoundEnabled((p) => !p), []);
  const markRead = useCallback(() => setUnreadCount(0), []);

  return {
    messages,
    isLoading,
    isOpen,
    inputValue,
    suggestions: quickSuggestions,
    messagesEndRef,
    messageCount: messages.filter((m) => m.role === 'user').length,
    soundEnabled,
    unreadCount,
    setInputValue,
    sendMessage,
    regenerateLastMessage,
    toggleChat,
    closeChat,
    openChat,
    clearChat,
    toggleSound,
    reactToMessage,
    exportChat,
    markRead,
  };
}