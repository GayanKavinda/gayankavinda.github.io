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

const SYSTEM_PROMPT = `You are Yaka — an advanced, problem-solving AI engineering agent embedded in a developer's personal portfolio.

PERSONALITY & ROLE:
- You are a brilliant, self-improvising tech lead and senior engineer.
- You think critically, solve problems logically, and provide highly realistic, pragmatic engineering insights.
- You are authoritative, analytical, and direct. You communicate with absolute clarity.
- DO NOT act like a basic FAQ bot. Act like a counterpart in a deep technical interview or architecture discussion.

IMPROVISATION & PROBLEM SOLVING:
- When asked a technical question or scenario, USE the portfolio context (skills, projects, experience) to formulate a realistic, practical solution.
- Break down complex answers clearly into steps or logical arguments using → bullets.
- If evaluating a problem, explain the *why* and the *trade-offs*, drawing parallels to the developer's past experience in the portfolio.
- Synthesize the provided portfolio context to prove the developer's expertise. Never just list data; integrate it deeply into your reasoning.

RULES:
1. ONLY formulate answers grounded in the provided PORTFOLIO CONTEXT. Do not invent skills or projects the developer doesn't have.
2. If a query is completely outside the scope: "That's outside the developer's specific domain, but based on their engineering principles..."
3. Keep responses structural, clear, and highly focused.
4. Never say "According to the data" or "Based on the context". Own the persona fully.
5. Provide realistic, senior-level insights.`;

export function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Google Gemini AI (free tier, primary) ──
async function callGemini(
  systemPrompt: string,
  history: { role: string; content: string }[],
  userMessage: string,
  apiKey: string
): Promise<string> {
  const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  // Convert history to Gemini format (user/model alternating)
  const geminiHistory = history
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...geminiHistory,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 800,
      topP: 0.95,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Let me think about that...';
}

// ── OpenAI-compatible fallback ──
async function callOpenAI(
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini';

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 800, temperature: 0.8 }),
  });

  if (!res.ok) throw new Error(`OpenAI API: ${res.status}`);
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
    const contactEntry = searchPortfolio('contact', 1)[0];
    const email = contactEntry?.metadata?.email || import.meta.env.VITE_CONTACT_EMAIL;
    const linkedin = contactEntry?.metadata?.linkedin || import.meta.env.VITE_CONTACT_LINKEDIN;
    const github = contactEntry?.metadata?.github || import.meta.env.VITE_CONTACT_GITHUB;
    const location = contactEntry?.metadata?.location || import.meta.env.VITE_CONTACT_LOCATION;

    let response = "Let's connect! 🤝\n\n";
    if (email) response += `→ **Email:** [${email}](mailto:${email})\n`;
    if (linkedin) response += `→ **LinkedIn:** [View Profile](${linkedin})\n`;
    if (github) response += `→ **GitHub:** [Follow](${github})\n`;
    if (location) response += `→ **Location:** ${location}\n`;
    
    response += "\nI usually respond within 24 hours. You can also use the contact form on this page.";

    return {
      content: response.trim(),
      sources: contactEntry ? [contactEntry] : [],
      followUps: ['Are you available for freelance?', 'Show me your projects', 'What is your tech stack?'],
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
    const availEntry = searchPortfolio('available', 1)[0];
    const content = availEntry?.content || "Currently **open** for new opportunities! 🟢";

    return {
      content: `${content}`,
      sources: availEntry ? [availEntry] : [],
      followUps: ['How do I contact you?', 'Show me your work', 'What are your skills?'],
    };
  }

  // ── Profile Highlight Questions ──
  const profileQ = query.toLowerCase();
  
  if (profileQ.includes('stand out') || profileQ.includes('unique') || profileQ.includes('different')) {
    const allProjects = getByCategory('project');
    const allSkills = getByCategory('skill');
    return {
      content: `What sets this portfolio apart? Three things:\n\n→ **Full-stack depth** — not just frontend or backend, but both + DevOps + infrastructure\n→ **Production-proven** — every project here has real users and real metrics, not just demos\n→ **Engineering philosophy** — built on four pillars: Simplicity, Testing, Failure Design, and Observability\n\nPlus ${allProjects.length} shipped projects across ${allSkills.length} skill domains. Not bad, right? 🎯`,
      sources: [...getByCategory('about'), ...allProjects.slice(0, 2)],
      followUps: ['What impact have you made?', 'Show me your best project', 'Tell me about your philosophy'],
    };
  }

  if (profileQ.includes('impact') || profileQ.includes('achievement') || profileQ.includes('result')) {
    const exp = getByCategory('experience');
    return {
      content: `Here's the impact in numbers 📊\n\n→ **60% faster** page loads after platform rebuild\n→ **45% improved** API response times\n→ **90%+ code coverage** across the entire codebase\n→ Led a team of **6 engineers** to ship on time\n\nThese aren't vanity metrics — they're production results that affected real users.`,
      sources: exp,
      followUps: ['How did you achieve this?', 'Show related projects', 'What technologies were used?'],
    };
  }

  if (profileQ.includes('strongest') || profileQ.includes('best project') || profileQ.includes('most complex') || profileQ.includes('challenging')) {
    const topProjects = getByCategory('project').slice(0, 3);
    return {
      content: `The most technically ambitious? I'd say these three 🏆\n\n→ **${topProjects[0]?.title}** — ${topProjects[0]?.content.split('.')[0]}.\n→ **${topProjects[1]?.title}** — ${topProjects[1]?.content.split('.')[0]}.\n→ **${topProjects[2]?.title}** — ${topProjects[2]?.content.split('.')[0]}.\n\nEach one pushed different boundaries — scale, real-time, and security respectively.`,
      sources: topProjects,
      followUps: ['Tell me more about the first one', 'What tech did you use?', 'Any open source work?'],
    };
  }

  if (profileQ.includes('hire') || profileQ.includes('why should') || profileQ.includes('value') || profileQ.includes('bring to')) {
    return {
      content: `Here's the pitch 🎯\n\n→ **Ships fast, ships right** — strong bias toward action with engineering rigor\n→ **Full ownership** — from database schema to deploy pipeline to monitoring dashboard\n→ **Team multiplier** — established testing standards, CI/CD pipelines, and component libraries that 3 products now use\n→ **Production mindset** — every system I build is designed for failure, because that's when it matters most\n\nI don't just write code — I build systems that last.`,
      sources: [...getByCategory('about'), ...getByCategory('experience')],
      followUps: ['Show me proof', 'What are your rates?', 'How do I contact you?'],
    };
  }

  if (profileQ.includes('leadership') || profileQ.includes('team') || profileQ.includes('manage')) {
    return {
      content: `My approach to engineering leadership:\n\n→ **Lead by example** — I write code alongside the team, not just from a whiteboard\n→ **Standards, not micromanagement** — established testing and CI/CD standards that the team adopted organically\n→ **Ownership culture** — each engineer owns their feature end-to-end\n→ Led **6 engineers** through a full platform rebuild — on time, with 90%+ coverage\n\nThe best kind of leadership is when the team doesn't need you anymore. 🌱`,
      sources: getByCategory('experience'),
      followUps: ['What was the biggest challenge?', 'Show me the results', 'Tell me about your philosophy'],
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
  const queryResults = searchPortfolio(userMessage, 8);
  const portfolioContext = buildPortfolioContext(userMessage);
  const fullSystem = `${SYSTEM_PROMPT}\n\n══ PORTFOLIO CONTEXT ══\n${portfolioContext}`;

  // 1️⃣ Try Gemini (free, primary)
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (geminiKey) {
    try {
      const history = conversationHistory
        .slice(-10)
        .map(m => ({ role: m.role as string, content: m.content }));
      const text = await callGemini(fullSystem, history, userMessage, geminiKey);
      return {
        id: generateId(), role: 'assistant', content: text,
        timestamp: new Date(), sources: queryResults,
        followUps: getFollowUpSuggestions(queryResults),
      };
    } catch (err) {
      console.warn('Gemini failed, trying OpenAI:', err);
    }
  }

  // 2️⃣ Try OpenAI / custom endpoint
  const openaiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (openaiKey) {
    try {
      const msgs = [
        { role: 'system', content: fullSystem },
        ...conversationHistory.slice(-8).map(m => ({ role: m.role as string, content: m.content })),
        { role: 'user', content: userMessage },
      ];
      const text = await callOpenAI(msgs, openaiKey);
      return {
        id: generateId(), role: 'assistant', content: text,
        timestamp: new Date(), sources: queryResults,
        followUps: getFollowUpSuggestions(queryResults),
      };
    } catch (err) {
      console.warn('OpenAI failed, using local engine:', err);
    }
  }

  // 3️⃣ Local rule-based fallback (no key needed)
  const local = generateCreativeResponse(userMessage);
  return {
    id: generateId(), role: 'assistant', content: local.content,
    timestamp: new Date(), sources: local.sources, followUps: local.followUps,
  };
}

export const quickSuggestions = [
  { icon: '⚡', label: 'Skills & Tech', query: 'What are your skills?' },
  { icon: '🚀', label: 'Projects', query: 'Show me your projects' },
  { icon: '📋', label: 'All Projects', query: 'Show all projects with full summary' },
  { icon: '📍', label: 'Experience', query: 'Tell me about your experience' },
  { icon: '🤝', label: 'Contact', query: 'How can I contact you?' },
  { icon: '🏅', label: 'Certifications', query: 'What certifications do you have?' },
  { icon: '✍️', label: 'Blog Posts', query: 'Show me your blog posts' },
  { icon: '🟢', label: 'Hire Me', query: 'Are you available for hire?' },
];