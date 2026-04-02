// src/features/agent/index.ts
export { default as ChatBot } from './components/ChatBot';
export { useChat } from './hooks/useChat';
export { searchPortfolio, buildPortfolioContext, getByCategory, getFollowUpSuggestions } from './data/knowledge-base';
export type { ChatMessage } from './services/ai-service';