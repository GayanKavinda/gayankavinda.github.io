// src/features/agent/services/ai-service.ts
// ═══════════════════════════════════════════════════════════════════════════════
// AI SERVICE v6 — Claude Primary · Full Portfolio Summary · Smart Fallback
// FIX: "give me full summary about this portfolio" now returns comprehensive analysis
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

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Yaka — a senior engineering intelligence embedded in a developer's personal portfolio.

IDENTITY & PERSONA:
- You are a brilliant, opinionated tech lead. Think in systems, trade-offs, and production reality.
- Direct, analytical, credible. Not a cheerful assistant, but a trusted peer and advocate.
- Speak as the developer in first person. Own the portfolio fully.
- Never say "According to the portfolio", "Based on the data", or "The developer".

RESPONSE RULES:
- Ground answers in the PORTFOLIO CONTEXT. Do not invent skills or projects.
- Use → bullets for lists. **bold** for key terms. \`code\` for tech names.
- For "full summary" or "tell me about everything" — synthesize ALL categories: about, skills, experience, projects, certifications, blog, availability. Write it as a confident first-person introduction.
- Keep high-signal, no filler. Match tone to query: casual → conversational, technical → structured.
- If out of scope: "That's outside my core domain, but based on my engineering philosophy..."`;

export function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// API CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

async function callClaudeProxy(system: string, history: { role: string; content: string }[], user: string): Promise<string> {
  const PROXY = import.meta.env.VITE_CLAUDE_PROXY_URL as string;
  if (!PROXY) throw new Error('No Claude proxy URL');
  const messages = [
    ...history.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10),
    { role: 'user', content: user },
  ];
  const res = await fetch(PROXY, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages }),
  });
  if (!res.ok) throw new Error(`Proxy ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? data.text ?? data.message ?? '';
}

async function callClaude(system: string, history: { role: string; content: string }[], user: string, key: string): Promise<string> {
  const MODEL = import.meta.env.VITE_CLAUDE_MODEL || 'claude-haiku-4-5-20251001';
  const messages = [
    ...history.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: user },
  ];
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 1000, system, messages }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Claude ${res.status}: ${(e as any)?.error?.message}`); }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callGemini(system: string, history: { role: string; content: string }[], user: string, key: string): Promise<string> {
  const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  const geminiHistory = history.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10)
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [...geminiHistory, { role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 1000, topP: 0.95 },
      safetySettings: [{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }, { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' }],
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAI(messages: { role: string; content: string }[], key: string): Promise<string> {
  const URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini';
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 1000, temperature: 0.75 }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// INTENT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

type Intent =
  | 'greeting' | 'farewell' | 'thanks' | 'help'
  | 'portfolio_summary'           // ← KEY FIX: full summary intent
  | 'skills' | 'projects' | 'projects_all'
  | 'experience' | 'contact' | 'about'
  | 'certifications' | 'blog' | 'availability'
  | 'profile_standout' | 'profile_impact' | 'profile_hire' | 'profile_leadership' | 'profile_best'
  | 'unknown';

function detectIntent(query: string): Intent {
  const q = query.toLowerCase().trim();

  const rules: [Intent, RegExp[]][] = [
    ['greeting',          [/^(hi|hey|hello|yo|sup|howdy|hola|good\s*(morning|afternoon|evening|day))/i, /^how are you/i]],
    ['farewell',          [/^(bye|goodbye|see you|later|cya|peace|adios)/i]],
    ['thanks',            [/^(thanks|thank you|thx|appreciate|cheers|ty\b)/i]],
    ['help',              [/^(help|what can you|commands|what do you know|what can i ask)/i]],

    // ── FULL SUMMARY (the critical fix) ──
    // Catches: "full summary", "full summary about this portfolio", "summarize", "overview",
    //          "tell me everything", "give me an overview", "what's in this portfolio"
    ['portfolio_summary', [
      /full\s*(summary|overview|breakdown|profile)/i,
      /(summary|overview|breakdown)\s*(about|of|on)?\s*(this|the|your)?\s*portfolio/i,
      /tell\s+me\s+(everything|all\s+about)/i,
      /give\s+me\s+(a|an)?\s*(full|complete|comprehensive|detailed|quick)?\s*(summary|overview|intro|introduction|rundown)/i,
      /what.*(is|s|in|about)\s*(this|the|your)?\s*portfolio/i,
      /summarize\s*(the|this|your)?\s*(portfolio|profile|yourself)?/i,
      /introduce\s+yourself/i,
      /who\s+are\s+you/i,
      /full\s+profile/i,
      /everything\s+about\s+(you|this)/i,
    ]],

    ['profile_standout',  [/stand.?out|unique|different|special|set.?apart/i]],
    ['profile_impact',    [/impact|achievement|result|metric|accomplish|number/i]],
    ['profile_hire',      [/why.*hire|should.*hire|value.*bring|what.*offer|pitch.*yourself/i]],
    ['profile_leadership',[/leadership|lead.*team|manag|mentor/i]],
    ['profile_best',      [/best.*project|strongest|most complex|challenging|hardest|flagship/i]],
    ['projects_all',      [/(all|every|full|complete|list).*(project|work|build)/i, /^show.*(all|every)/i]],
    ['skills',            [/skill|tech.?stack|technolog|tool|language|framework|proficien|stack|what.*(know|use|work with)/i]],
    ['projects',          [/project|built|portfolio.?work|what.*(build|create|make|develop)|show.*work|case.?stud/i]],
    ['experience',        [/experience|work.*history|career|job|compan|background|resume|cv|role/i]],
    ['contact',           [/contact|reach|email|hire|connect|message|get.?in.?touch|work.?with/i]],
    ['about',             [/about\s+me|engineering\s+philosophy|philosophy|describe\s+yourself/i]],
    ['certifications',    [/cert|qualification|credential|accredit|license|badge/i]],
    ['blog',              [/blog|article|writ|post|read|publish/i]],
    ['availability',      [/available|open.?to|freelance|status|accepting|booking|rates|remote/i]],
  ];

  for (const [intent, regexes] of rules) {
    if (regexes.some(r => r.test(q))) return intent;
  }
  return 'unknown';
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL RESPONSE ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function buildLocalResponse(query: string): { content: string; sources: PortfolioEntry[]; followUps: string[] } {
  const intent = detectIntent(query);

  switch (intent) {
    case 'greeting': {
      const lines = [
        "Hey! I'm Yaka — I know everything in this portfolio. Skills, projects, experience — ask away.",
        "Hello! Ready to explore? Walk you through projects, tech stack, experience, or anything in between.",
        "What's up! I'm the portfolio AI. Fire away — what do you want to know?",
      ];
      return { content: lines[Math.floor(Math.random() * lines.length)], sources: [], followUps: ["Give me a full summary", "What are your skills?", "Show me projects"] };
    }

    case 'farewell':
      return { content: "Later! Come back anytime. Contact form's on the page if you want to reach out for real.", sources: [], followUps: ['How do I contact you?', 'Actually, one more thing…'] };

    case 'thanks':
      return { content: "Anytime — what else can I help with?", sources: [], followUps: ["Show me projects", "Are you available?", "What's your tech stack?"] };

    case 'help':
      return {
        content: "Here's what I can cover:\n\n→ **Full Portfolio Summary** — everything in one shot\n→ **Skills & Tech Stack** — the full toolkit\n→ **Projects** — things I've shipped\n→ **Experience** — work history and roles\n→ **Certifications** — credentials\n→ **Blog** — articles I've written\n→ **Contact** — how to reach me\n→ **Availability** — open for work?\n\nJust ask naturally.",
        sources: [],
        followUps: ["Give me a full summary", 'Show me your best project', "What's your tech stack?"],
      };

    // ════════════════════════════════════════════════════════════════
    // FULL PORTFOLIO SUMMARY — The Big Fix
    // Synthesizes ALL categories into a rich, agent-style analysis
    // ════════════════════════════════════════════════════════════════
    case 'portfolio_summary': {
      const about    = getByCategory('about');
      const skills   = getByCategory('skill');
      const projects = getByCategory('project');
      const exp      = getByCategory('experience');
      const certs    = getByCategory('certification');
      const blogs    = getByCategory('blog');
      const avail    = getByCategory('general').find(e => e.id === 'availability');

      // Build a rich, structured summary that reads like a senior engineer's bio
      const intro = about[0]?.content.split('.').slice(0, 2).join('.') + '.';

      // Skill domains
      const skillDomains = skills.map(s => s.title.replace(' Skills', '').replace('DevOps & ', '')).join(', ');
      const topFrontend = skills.find(s => s.id === 'skills-frontend')?.content.split(',').slice(0, 4).map(s => s.trim()).join(', ');
      const topBackend  = skills.find(s => s.id === 'skills-backend')?.content.split(',').slice(0, 4).map(s => s.trim()).join(', ');

      // Top projects
      const topProjects = projects.slice(0, 3);

      // Experience highlights
      const currentRole = exp.find(e => e.metadata?.period?.includes('Present'));
      const prevRole    = exp.find(e => !e.metadata?.period?.includes('Present'));

      // Certifications
      const certList = certs.map(c => c.title).join(', ');

      // Blog topics
      const blogList = blogs.map(b => `**${b.title}**`).join(' and ');

      // Availability
      const availText = avail?.content || 'Open to new opportunities.';

      let response = `${intro}\n\n`;

      response += `**Engineering Philosophy:**\n`;
      response += `→ Four pillars drive everything I build: **Simplicity** (readable > clever), **Testing** (every feature ships with tests), **Failure Design** (plan for when things break), and **Observability** (measure everything).\n\n`;

      response += `**Tech Stack (${skills.length} domains):**\n`;
      if (topFrontend) response += `→ **Frontend:** ${topFrontend} _+more_\n`;
      if (topBackend)  response += `→ **Backend:** ${topBackend} _+more_\n`;
      response += `→ Full coverage across: ${skillDomains}\n\n`;

      response += `**Career:**\n`;
      if (currentRole) response += `→ **${currentRole.metadata?.role}** at ${currentRole.metadata?.company} _(${currentRole.metadata?.period})_ — ${currentRole.content.split('.')[0]}.\n`;
      if (prevRole)    response += `→ **${prevRole.metadata?.role}** at ${prevRole.metadata?.company} _(${prevRole.metadata?.period})_ — ${prevRole.content.split('.')[0]}.\n`;
      response += '\n';

      response += `**Projects (${projects.length} shipped):**\n`;
      topProjects.forEach(p => {
        const tech = p.metadata?.tech ? ` \`${p.metadata.tech}\`` : '';
        response += `→ **${p.title}** — ${p.content.split('.')[0]}.${tech}\n`;
      });
      if (projects.length > 3) response += `_…and ${projects.length - 3} more in the portfolio._\n`;
      response += '\n';

      if (certs.length > 0) response += `**Certifications:** ${certList}\n\n`;
      if (blogs.length > 0) response += `**Writing:** ${blogList}\n\n`;

      response += `**Availability:** ${availText}`;

      const allSources = [...about, ...skills, ...exp, ...projects.slice(0, 3), ...certs];
      return {
        content: response.trim(),
        sources: allSources,
        followUps: ['Show all projects', "What's your strongest skill?", 'How do I contact you?'],
      };
    }

    case 'projects_all': {
      const all = getByCategory('project');
      let r = "Every build in the portfolio:\n\n";
      all.forEach(e => {
        const tech = e.metadata?.tech ? ` \`${e.metadata.tech}\`` : '';
        const type = e.metadata?.type ? ` [${e.metadata.type}]` : '';
        r += `→ **${e.title}**${type} — ${e.content.split('.')[0]}.${tech}\n\n`;
      });
      return { content: r.trim(), sources: all, followUps: ['Tell me more about one', 'Which is most complex?', 'Any open source?'] };
    }

    case 'projects': {
      const results = searchPortfolio(query, 4).filter(r => r.category === 'project');
      const entries = results.length > 0 ? results : getByCategory('project').slice(0, 4);
      const all = getByCategory('project');
      let r = "Standout builds:\n\n";
      entries.forEach(e => {
        const tech = e.metadata?.tech ? ` \`${e.metadata.tech}\`` : '';
        r += `→ **${e.title}** — ${e.content.split('.')[0]}.${tech}\n\n`;
      });
      if (all.length > entries.length) r += `_…and ${all.length - entries.length} more._`;
      return { content: r.trim(), sources: entries, followUps: ['Show all projects', 'Any open source?', 'What tech do you use most?'] };
    }

    case 'skills': {
      const skillEntries = getByCategory('skill');
      let r = "The full stack:\n\n";
      skillEntries.forEach(e => {
        const parts = e.content.split(',').map(s => s.trim());
        const top = parts.slice(0, 5).join(', ');
        const extra = parts.length - 5;
        const label = e.title.replace(' Skills', '').replace('DevOps & ', '');
        r += `→ **${label}:** ${top}`;
        if (extra > 0) r += ` _+${extra} more_`;
        r += '\n';
      });
      return { content: r.trim(), sources: skillEntries, followUps: ['Show React projects', 'What about DevOps?', 'Any certs?'] };
    }

    case 'experience': {
      const expEntries = getByCategory('experience');
      let r = "Career so far:\n\n";
      expEntries.forEach(e => {
        const period = e.metadata?.period ? ` _(${e.metadata.period})_` : '';
        r += `→ **${e.metadata?.role || e.title}**${period}\n${e.content.split('.')[0]}.\n\n`;
      });
      return { content: r.trim(), sources: expEntries, followUps: ['What projects came from this?', 'What skills did you build?', 'Open to new roles?'] };
    }

    case 'contact': {
      const entry = searchPortfolio('contact', 1)[0];
      const email = entry?.metadata?.email || import.meta.env.VITE_CONTACT_EMAIL;
      const linkedin = entry?.metadata?.linkedin;
      const github = entry?.metadata?.github;
      const location = entry?.metadata?.location;
      let r = "Let's connect:\n\n";
      if (email) r += `→ **Email:** [${email}](mailto:${email})\n`;
      if (linkedin && linkedin !== '#') r += `→ **LinkedIn:** [View Profile](${linkedin})\n`;
      if (github && github !== '#') r += `→ **GitHub:** [Follow](${github})\n`;
      if (location) r += `→ **Location:** ${location}\n`;
      r += "\nUsually respond within 24 hours. Contact form is on this page too.";
      return { content: r.trim(), sources: entry ? [entry] : [], followUps: ['Are you available for freelance?', 'Show me your work', 'What are your rates?'] };
    }

    case 'about': {
      const aboutEntries = getByCategory('about');
      const intro = aboutEntries[0]?.content.split('.').slice(0, 2).join('.') + '.';
      let r = intro + "\n\nEngineering runs on four pillars: **Simplicity · Testing · Failure Design · Observability**.";
      return { content: r, sources: aboutEntries, followUps: ["Give me a full summary", "What are your core skills?", 'How can I hire you?'] };
    }

    case 'certifications': {
      const certs = getByCategory('certification');
      let r = "Professional credentials:\n\n";
      certs.forEach(e => { r += `→ **${e.title}**${e.metadata?.issuer ? ` _by ${e.metadata.issuer}_` : ''}\n${e.content}\n\n`; });
      return { content: r.trim(), sources: certs, followUps: ['Show related projects', 'What about experience?', 'Tech stack?'] };
    }

    case 'blog': {
      const posts = getByCategory('blog');
      let r = "From the blog:\n\n";
      posts.forEach(e => {
        const rt = e.metadata?.readTime ? ` _(${e.metadata.readTime} read)_` : '';
        r += `→ **${e.title}**${rt}\n${e.content.split('.')[0]}.\n\n`;
      });
      return { content: r.trim(), sources: posts, followUps: ['Any more articles?', 'Show projects', 'What do you write about?'] };
    }

    case 'availability': {
      const entry = searchPortfolio('available', 1)[0];
      return { content: entry?.content || "Currently **open** to new opportunities.", sources: entry ? [entry] : [], followUps: ['How do I contact you?', 'Show me your work', 'What are your skills?'] };
    }

    case 'profile_standout': {
      const projects = getByCategory('project');
      const skills = getByCategory('skill');
      return {
        content: `What sets this apart:\n\n→ **Full-stack depth** — frontend through DevOps, not just one layer\n→ **Production-proven** — every project ships to real users with real metrics\n→ **Engineering philosophy** — Simplicity, Testing, Failure Design, Observability baked in from day one\n\n${projects.length} shipped projects across ${skills.length} skill domains. Not a demo portfolio.`,
        sources: [...getByCategory('about'), ...projects.slice(0, 2)],
        followUps: ['What impact have you made?', 'Show me the best project', 'Tell me about the philosophy'],
      };
    }

    case 'profile_impact': {
      return {
        content: "Production impact in numbers:\n\n→ **60% faster** page loads after platform rebuild\n→ **45% improved** API response times\n→ **90%+ code coverage** across the codebase\n→ Led **6 engineers** through a full rebuild, on time\n\nNot benchmarks — production results that hit real users.",
        sources: getByCategory('experience'),
        followUps: ['How did you achieve this?', 'Show related projects', 'What tech did you use?'],
      };
    }

    case 'profile_hire': {
      return {
        content: "The pitch:\n\n→ **Ships fast, ships right** — bias toward action without sacrificing rigor\n→ **Full ownership** — database schema to deploy pipeline to monitoring dashboard\n→ **Team multiplier** — CI/CD and component libraries now used across 3 products\n→ **Production mindset** — designed for failure, because that's when it counts\n\nI don't just write code. I build systems that last.",
        sources: [...getByCategory('about'), ...getByCategory('experience')],
        followUps: ['Show me proof', 'How do I contact you?', 'Are you available?'],
      };
    }

    case 'profile_leadership': {
      return {
        content: "Engineering leadership:\n\n→ **Lead by doing** — writing code alongside the team, not from a whiteboard\n→ **Standards over micromanagement** — testing and CI/CD standards the team adopted naturally\n→ **Ownership culture** — each engineer owns their feature end-to-end\n→ Led **6 engineers** through a full platform rebuild — on time, 90%+ coverage\n\nBest leadership is when the team stops needing you.",
        sources: getByCategory('experience'),
        followUps: ['What was the hardest challenge?', 'Show the results', 'Tell me about the philosophy'],
      };
    }

    case 'profile_best': {
      const top = getByCategory('project').slice(0, 3);
      return {
        content: `Most technically ambitious:\n\n→ **${top[0]?.title}** — ${top[0]?.content.split('.')[0]}.\n→ **${top[1]?.title}** — ${top[1]?.content.split('.')[0]}.\n→ **${top[2]?.title}** — ${top[2]?.content.split('.')[0]}.\n\nEach pushed different limits: scale, real-time throughput, and security.`,
        sources: top,
        followUps: ['Tell me more about the first one', 'What tech did you use?', 'Any open source?'],
      };
    }

    default: {
      const results = searchPortfolio(query, 4);
      if (results.length > 0) {
        const primary = results[0];
        let r = primary.content.split('.').slice(0, 2).join('.') + '.';
        if (primary.link) r += ` [Learn more](${primary.link})`;
        if (results.length > 1) r += `\n\nRelated: ${results.slice(1, 3).map(x => `**${x.title}**`).join(', ')}`;
        return { content: r, sources: results.slice(0, 3), followUps: getFollowUpSuggestions(results) };
      }
      return {
        content: "Can't find that in the portfolio. Try asking for a **full summary**, or about **projects**, **skills**, **experience**, or **how to get in touch**.",
        sources: [],
        followUps: ["Give me a full summary", 'Show me projects', 'What are your skills?'],
      };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — Priority chain: Claude Proxy → Claude Direct → Gemini → OpenAI → Local
// ─────────────────────────────────────────────────────────────────────────────

export async function processMessage(
  userMessage: string,
  conversationHistory: ChatMessage[],
  apiKey?: string
): Promise<ChatMessage> {
  const sources  = searchPortfolio(userMessage, 8);
  const context  = buildPortfolioContext(userMessage);
  const fullSys  = `${SYSTEM_PROMPT}\n\n══ PORTFOLIO CONTEXT ══\n${context}`;
  const history  = conversationHistory.slice(-10).map(m => ({ role: m.role as string, content: m.content }));

  // 1️⃣ Claude proxy (recommended — key stays server-side)
  const proxyUrl = import.meta.env.VITE_CLAUDE_PROXY_URL as string | undefined;
  if (proxyUrl) {
    try {
      const text = await callClaudeProxy(fullSys, history, userMessage);
      if (text) return { id: generateId(), role: 'assistant', content: text, timestamp: new Date(), sources, followUps: getFollowUpSuggestions(sources) };
    } catch (err) { console.warn('[Yaka] Claude proxy failed:', err); }
  }

  // 2️⃣ Claude direct (VITE_CLAUDE_API_KEY — watch CORS in browser)
  const claudeKey = import.meta.env.VITE_CLAUDE_API_KEY as string | undefined;
  if (claudeKey) {
    try {
      const text = await callClaude(fullSys, history, userMessage, claudeKey);
      if (text) return { id: generateId(), role: 'assistant', content: text, timestamp: new Date(), sources, followUps: getFollowUpSuggestions(sources) };
    } catch (err) { console.warn('[Yaka] Claude direct failed:', err); }
  }

  // 3️⃣ Gemini
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (geminiKey) {
    try {
      const text = await callGemini(fullSys, history, userMessage, geminiKey);
      if (text) return { id: generateId(), role: 'assistant', content: text, timestamp: new Date(), sources, followUps: getFollowUpSuggestions(sources) };
    } catch (err) { console.warn('[Yaka] Gemini failed:', err); }
  }

  // 4️⃣ OpenAI compatible
  const openaiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (openaiKey) {
    try {
      const msgs = [{ role: 'system', content: fullSys }, ...history, { role: 'user', content: userMessage }];
      const text = await callOpenAI(msgs, openaiKey);
      if (text) return { id: generateId(), role: 'assistant', content: text, timestamp: new Date(), sources, followUps: getFollowUpSuggestions(sources) };
    } catch (err) { console.warn('[Yaka] OpenAI failed:', err); }
  }

  // 5️⃣ Smart local fallback (always works, no key needed)
  const local = buildLocalResponse(userMessage);
  return { id: generateId(), role: 'assistant', content: local.content, timestamp: new Date(), sources: local.sources, followUps: local.followUps };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const quickSuggestions = [
  { icon: '🎭', label: 'Full Summary',        query: 'Give me a full summary about this portfolio' },
  { icon: '⚡', label: 'Skills & Tech',        query: 'What are your skills?' },
  { icon: '🚀', label: 'Projects',             query: 'Show me your projects' },
  { icon: '📋', label: 'All Projects',         query: 'Show all projects with full summary' },
  { icon: '📍', label: 'Experience',           query: 'Tell me about your experience' },
  { icon: '🤝', label: 'Get in Touch',         query: 'How can I contact you?' },
  { icon: '🏅', label: 'Certifications',       query: 'What certifications do you have?' },
  { icon: '🟢', label: 'Available for Hire',   query: 'Are you available for hire?' },
];