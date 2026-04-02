// src/features/agent/services/ai-service.ts
// ═══════════════════════════════════════════════════════════════════════════════
// AI SERVICE v5 — Creative Responses + Follow-ups + Full Summary Support
// ═══════════════════════════════════════════════════════════════════════════════

import {
  buildPortfolioContext,
  searchPortfolio,
  getByCategory,
  getFollowUpSuggestions,
  type PortfolioEntry,
} from '../data/knowledge-base';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: PortfolioEntry[];
  followUps?: string[];
  reactions?: { like?: boolean; dislike?: boolean; copied?: boolean };
}

const SYSTEM_PROMPT = `You are Yaka — a smart, charismatic AI assistant embedded in a developer's personal portfolio website.

PERSONALITY:
- Confident, concise, slightly witty — like a senior engineer who's great at explaining things
- Keep responses SHORT (2-5 sentences) unless asked for details
- Use casual-professional tone. No corporate speak.
- Use 1-2 emoji max per response, placed naturally

RULES:
1. ONLY answer from the provided PORTFOLIO CONTEXT. Never hallucinate.
2. If not in context: "That's outside my scope — I only know this portfolio. Try projects, skills, or experience!"
3. Never dump raw data. Synthesize into natural conversation.
4. For skills — highlight top 4-5, mention there's more
5. For projects — compelling one-liner with key tech
6. Never say "Based on the context" or "According to the data"
7. When listing, use clean formatting with → bullets
8. If asked for "all" or "full summary" of something, provide comprehensive but organized response`;

export function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── AI API Call ──
async function callAI(
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini';

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 600, temperature: 0.75 }),
  });

  if (!res.ok) throw new Error(`AI API: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'Let me try that again...';
}

// ── Intent Detection ──
type Intent =
  | 'greeting'
  | 'farewell'
  | 'thanks'
  | 'skills'
  | 'projects'
  | 'projects_all'
  | 'experience'
  | 'contact'
  | 'about'
  | 'certifications'
  | 'blog'
  | 'availability'
  | 'help'
  | 'unknown';

function detectIntent(query: string): Intent {
  const q = query.toLowerCase().trim();

  const patterns: [Intent, RegExp[]][] = [
    ['greeting', [/^(hi|hey|hello|yo|sup|what'?s up|howdy|hola|good\s*(morning|afternoon|evening|day))/i, /^how are you/i]],
    ['farewell', [/^(bye|goodbye|see you|later|cya|peace|adios)/i]],
    ['thanks', [/^(thanks|thank you|thx|appreciate|ty)/i]],
    ['help', [/^(help|what can you|how do|commands|what do you know|menu)/i]],
    ['projects_all', [/(all|every|full|complete|entire|summary|list).*(project|work|build)/i, /(project|work|build).*(all|every|full|complete|entire|summary|list)/i, /^show\s*(me\s*)?(all|every)/i]],
    ['skills', [/skill/i, /tech\s*stack/i, /what.*(know|use|work with)/i, /technolog/i, /tool/i, /language/i, /framework/i, /proficien/i, /stack/i]],
    ['projects', [/project/i, /built/i, /portfolio work/i, /what.*(build|create|make|develop)/i, /show.*work/i, /case stud/i]],
    ['experience', [/experience/i, /work.*history/i, /career/i, /job/i, /compan/i, /where.*(work)/i, /background/i, /resume/i, /cv/i, /role/i]],
    ['contact', [/contact/i, /reach/i, /email/i, /hire/i, /connect/i, /message/i, /get in touch/i, /talk to/i, /work with/i]],
    ['about', [/about/i, /who (are|is)/i, /tell.*about/i, /introduce/i, /yourself/i, /what do you do/i, /describe/i, /philosophy/i]],
    ['certifications', [/cert/i, /qualification/i, /credential/i, /accredit/i, /license/i, /badge/i]],
    ['blog', [/blog/i, /article/i, /writ/i, /post/i, /read/i, /publish/i]],
    ['availability', [/available/i, /free/i, /open to/i, /freelance/i, /status/i, /accepting/i, /booking/i, /rates/i]],
  ];

  for (const [intent, regexes] of patterns) {
    if (regexes.some((r) => r.test(q))) return intent;
  }
  return 'unknown';
}

// ── Creative Local Response Generator ──
function generateCreativeResponse(query: string): { content: string; sources: PortfolioEntry[]; followUps: string[] } {
  const intent = detectIntent(query);

  // ── Greeting ──
  if (intent === 'greeting') {
    const greetings = [
      "Hey there! 👋 I'm Yaka — ask me anything about this portfolio. Skills, projects, experience — I've got it all.",
      "What's good! Welcome. I can walk you through projects, tech stack, experience — whatever catches your eye.",
      "Hello! ✨ Ready to explore this portfolio? I know everything in here. Fire away!",
    ];
    return {
      content: greetings[Math.floor(Math.random() * greetings.length)],
      sources: [],
      followUps: ['What are your skills?', 'Show me projects', 'Tell me about yourself'],
    };
  }

  // ── Farewell ──
  if (intent === 'farewell') {
    return {
      content: "Catch you later! 👋 Feel free to come back anytime. And hey — there's a contact form if you want to reach out for real.",
      sources: [],
      followUps: ['Actually, one more thing...', 'How do I contact you?'],
    };
  }

  // ── Thanks ──
  if (intent === 'thanks') {
    return {
      content: "Anytime! 🙌 That's what I'm here for. Anything else you want to explore?",
      sources: [],
      followUps: ['Show me projects', 'Are you available for hire?', "What's your tech stack?"],
    };
  }

  // ── Help ──
  if (intent === 'help') {
    return {
      content: "Here's what I can help with:\n\n→ **Skills & Tech Stack** — what technologies I work with\n→ **Projects** — things I've built\n→ **Experience** — work history & roles\n→ **Certifications** — professional credentials\n→ **Blog** — articles I've written\n→ **Contact** — how to reach me\n→ **Availability** — am I open for work?\n\nJust ask naturally — I'll figure out what you mean! 🎯",
      sources: [],
      followUps: ['Show me your best project', 'What are your top skills?', 'Are you hiring-ready?'],
    };
  }

  // ── All Projects ──
  if (intent === 'projects_all') {
    const allProjects = getByCategory('project');
    let response = "Here's the full project lineup — every build in the portfolio 🚀\n\n";

    allProjects.forEach((entry) => {
      const tech = entry.metadata?.tech || '';
      const type = entry.metadata?.type ? `[${entry.metadata.type}]` : '';
      response += `→ **${entry.title}** ${type}\n${entry.content.split('.')[0]}.\n`;
      if (tech) response += `\`${tech}\`\n`;
      response += '\n';
    });

    return {
      content: response.trim(),
      sources: allProjects,
      followUps: ['Tell me more about a specific project', 'Which is the most complex?', 'Any open source?'],
    };
  }

  // ── Projects ──
  if (intent === 'projects') {
    const results = searchPortfolio(query, 4).filter((r) => r.category === 'project');
    const projectEntries = results.length > 0 ? results : getByCategory('project').slice(0, 4);

    let response = "Here are some standout builds 🚀\n\n";
    projectEntries.forEach((entry) => {
      const shortDesc = entry.content.split('.')[0] + '.';
      const tech = entry.metadata?.tech ? ` \`${entry.metadata.tech}\`` : '';
      response += `→ **${entry.title}** — ${shortDesc}${tech}\n\n`;
    });

    if (getByCategory('project').length > projectEntries.length) {
      response += `_${getByCategory('project').length - projectEntries.length} more in the portfolio..._`;
    }

    return {
      content: response.trim(),
      sources: projectEntries,
      followUps: ['Show all projects', 'Any open source work?', 'What tech do you use most?'],
    };
  }

  // ── Skills ──
  if (intent === 'skills') {
    const skillEntries = getByCategory('skill');
    let response = "Here's the highlight reel ⚡\n\n";

    skillEntries.forEach((entry) => {
      const skills = entry.content.split(',').map((s) => s.trim());
      const top5 = skills.slice(0, 5).join(', ');
      const remaining = skills.length - 5;
      const label = entry.title.replace(' Skills', '').replace('DevOps & ', '');
      response += `→ **${label}:** ${top5}`;
      if (remaining > 0) response += ` _+${remaining} more_`;
      response += '\n';
    });

    response += '\nFull breakdown at the tech stack section.';

    return {
      content: response.trim(),
      sources: skillEntries,
      followUps: ['Show projects using React', 'What about DevOps?', 'Any certifications?'],
    };
  }

  // ── Experience ──
  if (intent === 'experience') {
    const expEntries = getByCategory('experience');
    let response = "Career journey so far 📍\n\n";

    expEntries.forEach((entry) => {
      const highlight = entry.content.split('.')[0] + '.';
      const period = entry.metadata?.period || '';
      response += `→ **${entry.metadata?.role || entry.title}**${period ? ` _(${period})_` : ''}\n${highlight}\n\n`;
    });

    return {
      content: response.trim(),
      sources: expEntries,
      followUps: ['What projects came from these roles?', 'What skills did you build?', 'Are you open to new opportunities?'],
    };
  }

  // ── Contact ──
  if (intent === 'contact') {
    return {
      content: "Let's connect! 🤝\n\nYou can reach out through the **contact form** on the portfolio, or find me on **LinkedIn** and **GitHub**.\n\nI'm responsive and usually get back within 24 hours.",
      sources: searchPortfolio('contact', 2),
      followUps: ['Are you available for freelance?', 'What are your rates?', 'Show me your work'],
    };
  }

  // ── About ──
  if (intent === 'about') {
    const aboutEntries = getByCategory('about');
    const intro = aboutEntries[0]?.content.split('.').slice(0, 2).join('.') + '.';
    let response = intro;

    const philosophy = aboutEntries.find((e) => e.id === 'about-philosophy');
    if (philosophy) {
      response += '\n\nEngineering philosophy? **Simplicity · Testing · Failure Design · Observability** — the four pillars. 🏛️';
    }

    return {
      content: response,
      sources: aboutEntries,
      followUps: ['What are your core skills?', 'Show me your projects', 'How can I hire you?'],
    };
  }

  // ── Certifications ──
  if (intent === 'certifications') {
    const certEntries = getByCategory('certification');
    let response = "Professional credentials 🏅\n\n";
    certEntries.forEach((entry) => {
      const issuer = entry.metadata?.issuer ? ` by ${entry.metadata.issuer}` : '';
      response += `→ **${entry.title}**${issuer}\n${entry.content}\n\n`;
    });

    return {
      content: response.trim(),
      sources: certEntries,
      followUps: ['Show related projects', 'What about your experience?', 'Any other skills?'],
    };
  }

  // ── Blog ──
  if (intent === 'blog') {
    const blogEntries = getByCategory('blog');
    let response = "From the blog ✍️\n\n";
    blogEntries.forEach((entry) => {
      const readTime = entry.metadata?.readTime ? ` _(${entry.metadata.readTime} read)_` : '';
      response += `→ **${entry.title}**${readTime}\n${entry.content.split('.')[0]}.\n\n`;
    });

    return {
      content: response.trim(),
      sources: blogEntries,
      followUps: ['Show me your projects', 'What topics interest you?', 'Tell me about your experience'],
    };
  }

  // ── Availability ──
  if (intent === 'availability') {
    return {
      content: "Currently **open** for new opportunities! 🟢\n\nAvailable for freelance projects, full-time remote roles, and consulting. Contract work welcome too.\n\nLet's talk about what you need.",
      sources: searchPortfolio('available', 2),
      followUps: ['How do I contact you?', 'Show me your work', 'What are your skills?'],
    };
  }

  // ── Generic search fallback ──
  const results = searchPortfolio(query, 4);
  if (results.length > 0) {
    const primary = results[0];
    const shortContent = primary.content.split('.').slice(0, 2).join('.') + '.';
    let response = shortContent;
    if (primary.link) response += ` [Learn more](${primary.link})`;

    if (results.length > 1) {
      response += `\n\nRelated: ${results
        .slice(1, 3)
        .map((r) => `**${r.title}**`)
        .join(', ')}`;
    }

    return {
      content: response,
      sources: results.slice(0, 3),
      followUps: getFollowUpSuggestions(results),
    };
  }

  return {
    content: "Hmm, can't find that in the portfolio. Try asking about **projects**, **skills**, **experience**, or **how to get in touch**! 🎯",
    sources: [],
    followUps: ['What can you help with?', 'Show me projects', 'What are your skills?'],
  };
}

// ── Main: Process user message ──
export async function processMessage(
  userMessage: string,
  conversationHistory: ChatMessage[],
  apiKey?: string
): Promise<ChatMessage> {
  const queryResults = searchPortfolio(userMessage, 6);

  // Use AI if key available
  if (apiKey) {
    try {
      const portfolioContext = buildPortfolioContext(userMessage);
      const msgs = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `PORTFOLIO CONTEXT:\n\n${portfolioContext}` },
        ...conversationHistory.slice(-8).map((m) => ({ role: m.role as string, content: m.content })),
        { role: 'user', content: userMessage },
      ];

      const aiResponse = await callAI(msgs, apiKey);
      return {
        id: generateId(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        sources: queryResults,
        followUps: getFollowUpSuggestions(queryResults),
      };
    } catch (err) {
      console.warn('AI API failed, using local engine:', err);
    }
  }

  // Local fallback
  const local = generateCreativeResponse(userMessage);
  return {
    id: generateId(),
    role: 'assistant',
    content: local.content,
    timestamp: new Date(),
    sources: local.sources,
    followUps: local.followUps,
  };
}

export const quickSuggestions = [
  { icon: '⚡', label: 'Skills & Tech', query: 'What are your skills?' },
  { icon: '🚀', label: 'Projects', query: 'Show me your projects' },
  { icon: '📋', label: 'All Projects', query: 'Show all projects with full summary' },
  { icon: '📍', label: 'Experience', query: 'Tell me about your experience' },
  { icon: '🤝', label: 'Contact', query: 'How can I contact you?' },
  { icon: '🏅', label: 'Certifications', query: 'What certifications do you have?' },
  { icon: '✍️', label: 'Blog', query: 'Show me your blog posts' },
  { icon: '🟢', label: 'Availability', query: 'Are you available for hire?' },
];