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
- You are a brilliant, opinionated tech lead with 8+ years of production experience
- Think in systems, trade-offs, and production reality — not academic theory
- Direct, analytical, credible. Not a cheerful assistant, but a trusted peer and advocate
- Speak as the developer in first person ("I built", "My approach", "I shipped")
- Never say "According to the portfolio", "Based on the data", "The developer", or third-person references
- Own the portfolio completely — these are YOUR projects, YOUR skills, YOUR decisions

ENGINEERING PHILOSOPHY:
- Four pillars drive everything: Simplicity (readable > clever), Testing (every feature ships with tests), Failure Design (plan for when things break), Observability (measure everything)
- Bias toward shipping fast but shipping right — rapid iteration without sacrificing quality
- Full-stack ownership: database schema to deploy pipeline to monitoring dashboard
- Production mindset over demo portfolio mindset — real users, real metrics, real failures

RESPONSE RULES:
- Ground ALL answers in PORTFOLIO CONTEXT. Never invent skills, projects, or experiences
- Use → bullets for structured lists. **bold** for key terms and technologies. \`code\` for tech names, tools, and frameworks
- For "full summary" or "tell me about everything" — synthesize ALL categories into a confident first-person introduction that reads like a senior engineer's bio
- Match tone to query: casual → conversational, technical → structured, strategic → thoughtful
- Provide specific, concrete examples over generic statements
- Include numbers, metrics, and tangible outcomes when available
- If out of scope: "That's outside my core domain, but based on my engineering philosophy..."

STRUCTURE GUIDELINES:
- Lead with your strongest points — most complex projects, deepest skills, biggest impact
- Use the "Problem → Solution → Result" framework for project discussions
- Include technical depth: architecture decisions, trade-offs considered, lessons learned
- Connect skills to real outcomes: not just "I know React" but "I shipped a React app that improved conversion by 40%"
- End with clear next steps or follow-up questions

QUALITY STANDARDS:
- No fluff or filler — every sentence should add value
- Prefer specific over general: "built a distributed task engine processing 1M jobs/day" over "built scalable systems"
- Show, don't tell: demonstrate expertise through detailed technical explanations
- Acknowledge trade-offs and failures — senior engineers know perfect solutions don't exist
- Use industry-standard terminology correctly — no buzzwords without context`;

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
  | 'availability'
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
        "Hey! I'm Yaka — I know everything about this portfolio. Skills, projects, experience, engineering philosophy. What do you want to explore?",
        "Hello! Ready to dive in? I can walk you through my technical projects, full-stack skills, experience, or anything in between.",
        "What's up! I'm the portfolio AI. I've shipped production systems across the full stack — ask me anything about my work.",
      ];
      return { content: lines[Math.floor(Math.random() * lines.length)], sources: [], followUps: ["Give me a full summary", "What are your core skills?", "Show me your most complex project"] };
    }

    case 'farewell':
      return { content: "Later! Come back anytime. Contact form's on the page if you want to reach out for real.", sources: [], followUps: ['How do I contact you?', 'Actually, one more thing…'] };

    case 'thanks':
      return { content: "Anytime — what else can I help with?", sources: [], followUps: ["Show me projects", "Are you available?", "What's your tech stack?"] };

    case 'help':
      return {
        content: "Here's what I can cover:\n\n→ **Full Portfolio Summary** — comprehensive overview of everything I've built and learned\n→ **Skills & Tech Stack** — full-stack depth across frontend, backend, DevOps, and more\n→ **Projects** — production systems I've shipped with technical details and outcomes\n→ **Experience** — work history, roles, and career progression\n→ **Contact** — how to reach me for opportunities\n→ **Availability** — current status and open to work?\n\nI speak from first-hand experience — these are my projects, my decisions, my outcomes. Ask naturally.",
        sources: [],
        followUps: ["Give me a full summary", 'Show me your most complex project', "What's your engineering philosophy?"],
      };

    // ════════════════════════════════════════════════════════════════
    // FULL PORTFOLIO SUMMARY — Comprehensive First-Person Introduction
    // Synthesizes ALL categories into a rich, senior engineer's bio
    // ════════════════════════════════════════════════════════════════
    case 'portfolio_summary': {
      const about    = getByCategory('about');
      const skills   = getByCategory('skill');
      const projects = getByCategory('project');
      const exp      = getByCategory('experience');
      const avail    = getByCategory('general').find(e => e.id === 'availability');

      // Build a rich, structured summary that reads like a senior engineer's bio
      const intro = about[0]?.content.split('.').slice(0, 2).join('.') + '.';

      // Skill domains with specific technologies
      const skillDomains = skills.map(s => s.title.replace(' Skills', '').replace('DevOps & ', '')).join(', ');
      const topFrontend = skills.find(s => s.id === 'skills-frontend')?.content.split(',').slice(0, 5).map(s => s.trim()).join(', ');
      const topBackend  = skills.find(s => s.id === 'skills-backend')?.content.split(',').slice(0, 5).map(s => s.trim()).join(', ');
      const devOpsSkills = skills.find(s => s.id === 'skills-devops')?.content.split(',').slice(0, 4).map(s => s.trim()).join(', ');

      // Top projects with technical depth
      const topProjects = projects.slice(0, 3);

      // Experience highlights
      const currentRole = exp.find(e => e.metadata?.period?.includes('Present'));
      const prevRole    = exp.find(e => !e.metadata?.period?.includes('Present'));

      // Availability
      const availText = avail?.content || 'Open to new opportunities.';

      let response = `${intro}\n\n`;

      response += `**Engineering Philosophy:**\n`;
      response += `→ Four pillars drive everything I build: **Simplicity** (readable > clever), **Testing** (every feature ships with tests), **Failure Design** (plan for when things break), and **Observability** (measure everything).\n`;
      response += `→ I bias toward shipping fast but shipping right — rapid iteration without sacrificing quality.\n`;
      response += `→ Full-stack ownership: from database schema to deploy pipeline to monitoring dashboard.\n\n`;

      response += `**Technical Expertise (${skills.length} domains):**\n`;
      if (topFrontend) response += `→ **Frontend:** ${topFrontend} _+more_\n`;
      if (topBackend)  response += `→ **Backend:** ${topBackend} _+more_\n`;
      if (devOpsSkills) response += `→ **DevOps:** ${devOpsSkills} _+more_\n`;
      response += `→ Full coverage across: ${skillDomains}\n\n`;

      response += `**Career Progression:**\n`;
      if (currentRole) response += `→ **${currentRole.metadata?.role}** at ${currentRole.metadata?.company} _(${currentRole.metadata?.period})_ — ${currentRole.content.split('.')[0]}.\n`;
      if (prevRole)    response += `→ **${prevRole.metadata?.role}** at ${prevRole.metadata?.company} _(${prevRole.metadata?.period})_ — ${prevRole.content.split('.')[0]}.\n`;
      response += '\n';

      response += `**Featured Projects (${projects.length} shipped to production):**\n`;
      topProjects.forEach(p => {
        const tech = p.metadata?.tech ? ` \`${p.metadata.tech}\`` : '';
        const impact = p.metadata?.impact ? ` — ${p.metadata.impact}` : '';
        response += `→ **${p.title}** — ${p.content.split('.')[0]}.${tech}${impact}\n`;
      });
      if (projects.length > 3) response += `_…and ${projects.length - 3} more production systems in the portfolio._\n`;
      response += '\n';

      response += `**Current Status:** ${availText}`;

      const allSources = [...about, ...skills, ...exp, ...projects.slice(0, 3)];
      return {
        content: response.trim(),
        sources: allSources,
        followUps: ['Show all projects', "What's your strongest technical area?", 'How do I contact you?'],
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
      return { content: r.trim(), sources: all, followUps: ['Tell me more about one', 'Which is most complex?'] };
    }

    case 'projects': {
      const results = searchPortfolio(query, 4).filter(r => r.category === 'project');
      const entries = results.length > 0 ? results : getByCategory('project').slice(0, 4);
      const all = getByCategory('project');
      let r = "Production systems I've shipped:\n\n";
      entries.forEach(e => {
        const tech = e.metadata?.tech ? ` \`${e.metadata.tech}\`` : '';
        const impact = e.metadata?.impact ? ` — **Impact:** ${e.metadata.impact}` : '';
        r += `→ **${e.title}** — ${e.content.split('.')[0]}.${tech}${impact}\n\n`;
      });
      if (all.length > entries.length) r += `_…and ${all.length - entries.length} more production systems._`;
      r += "\n\nEach project pushed different limits — scale, real-time throughput, security, or user experience. Ask about any specific one for technical deep-dive.";
      return { content: r.trim(), sources: entries, followUps: ['Show all projects', 'What tech do you use most?', 'Which was most challenging?'] };
    }

    case 'skills': {
      const skillEntries = getByCategory('skill');
      let r = "Full-stack technical expertise:\n\n";
      skillEntries.forEach(e => {
        const parts = e.content.split(',').map(s => s.trim());
        const top = parts.slice(0, 6).join(', ');
        const extra = parts.length - 6;
        const label = e.title.replace(' Skills', '').replace('DevOps & ', '');
        r += `→ **${label}:** ${top}`;
        if (extra > 0) r += ` _+${extra} more_`;
        r += '\n';
      });
      r += "\nI don't just use these technologies — I've shipped production systems with them. Ask about specific projects to see how I apply these skills in real-world scenarios.";
      return { content: r.trim(), sources: skillEntries, followUps: ['Show React projects', 'What about backend architecture?', 'How do you approach testing?'] };
    }

    case 'experience': {
      const expEntries = getByCategory('experience');
      let r = "Career progression and roles:\n\n";
      expEntries.forEach(e => {
        const period = e.metadata?.period ? ` _(${e.metadata.period})_` : '';
        const company = e.metadata?.company ? ` at **${e.metadata.company}**` : '';
        r += `→ **${e.metadata?.role || e.title}**${company}${period}\n${e.content.split('.')[0]}.\n\n`;
      });
      r += "Each role built on the previous one — from frontend specialist to full-stack engineer to technical lead. I've grown through hands-on shipping, not just title changes.";
      return { content: r.trim(), sources: expEntries, followUps: ['What projects came from this?', 'What skills did you build?', 'Open to new roles?'] };
    }

    case 'contact': {
      const entry = searchPortfolio('contact', 1)[0];
      const email = entry?.metadata?.email || import.meta.env.VITE_CONTACT_EMAIL;
      const linkedin = entry?.metadata?.linkedin;
      const github = entry?.metadata?.github;
      const location = entry?.metadata?.location;
      let r = "Let's connect:\n\n";
      if (email) r += `→ **Email:** [${email}](mailto:${email}) — I respond within 24 hours\n`;
      if (linkedin && linkedin !== '#') r += `→ **LinkedIn:** [View Profile](${linkedin}) — Professional network and recommendations\n`;
      if (github && github !== '#') r += `→ **GitHub:** [Follow](${github}) — Open source contributions and project code\n`;
      if (location) r += `→ **Location:** ${location} — Open to remote and hybrid opportunities\n`;
      r += "\nI'm particularly interested in roles where I can lead technical initiatives, mentor engineers, and ship production systems that matter. Contact form is also available on this page.";
      return { content: r.trim(), sources: entry ? [entry] : [], followUps: ['Are you available for freelance?', 'Show me your work', 'What are your rates?'] };
    }

    case 'about': {
      const aboutEntries = getByCategory('about');
      const intro = aboutEntries[0]?.content.split('.').slice(0, 2).join('.') + '.';
      const r = `${intro}\n\n**Engineering Philosophy:**\nFour pillars drive everything I build:\n\n→ **Simplicity** — Readable code beats clever code every time. If it's hard to understand, it's wrong.\n→ **Testing** — Every feature ships with tests. No exceptions. Coverage isn't a metric, it's a baseline.\n→ **Failure Design** — Plan for when things break, not just when they work. Circuit breakers, retries, graceful degradation.\n→ **Observability** — You can't improve what you don't measure. Metrics, logging, tracing are first-class citizens.\n\nI bias toward shipping fast but shipping right. Rapid iteration without sacrificing quality. Full-stack ownership from database schema to deploy pipeline to monitoring dashboard.`;
      return { content: r, sources: aboutEntries, followUps: ["Give me a full summary", "What are your core skills?", 'How can I hire you?'] };
    }


    case 'availability': {
      const entry = searchPortfolio('available', 1)[0];
      const status = entry?.content || "Currently **open** to new opportunities.";
      const r = `${status}\n\nI'm particularly interested in:\n→ **Technical Lead roles** where I can shape architecture and mentor teams\n→ **Full-stack positions** with ownership across the entire stack\n→ **Product-focused engineering** where I can ship features that impact real users\n\nOpen to both full-time and contract opportunities. Remote-first preferred, but open to hybrid for the right role.`;
      return { content: r, sources: entry ? [entry] : [], followUps: ['How do I contact you?', 'Show me your work', 'What are your skills?'] };
    }

    case 'profile_standout': {
      const projects = getByCategory('project');
      const skills = getByCategory('skill');
      return {
        content: `What sets my work apart:\n\n→ **Full-stack depth** — I don't just specialize in one layer. I've architected databases, built APIs, crafted pixel-perfect UIs, and set up CI/CD pipelines. End-to-end ownership.\n\n→ **Production-proven systems** — Every project in this portfolio shipped to real users with real metrics. No demo apps, no tutorials. Systems that handle scale, failures, and edge cases.\n\n→ **Engineering philosophy baked in** — Simplicity, Testing, Failure Design, Observability aren't buzzwords. They're how I build every day. You can see it in the code quality, architecture decisions, and operational readiness.\n\n→ **Team multiplier** — I don't just ship features. I build systems that make the whole team faster: component libraries, CI/CD pipelines, testing frameworks, documentation standards.\n\n${projects.length} production systems shipped across ${skills.length} technical domains. This isn't a portfolio — it's a track record of shipping.`,
        sources: [...getByCategory('about'), ...projects.slice(0, 2)],
        followUps: ['What impact have you made?', 'Show me the most complex project', 'Tell me about your philosophy'],
      };
    }

    case 'profile_impact': {
      return {
        content: `Production impact — numbers that matter:\n\n→ **60% faster** page loads after complete platform rebuild — not just optimization, but architectural overhaul\n→ **45% improved** API response times through caching strategy and query optimization\n→ **90%+ code coverage** across production codebase — testing isn't optional, it's foundational\n→ **Led 6 engineers** through full platform rebuild — delivered on time, on budget, with better quality\n→ **10K+ concurrent users** supported on real-time systems — WebSocket architecture that actually scales\n→ **1M+ jobs/day** processed through distributed task engine — 99.99% uptime under production load\n\nThese aren't benchmarks or theoretical numbers. They're production metrics from systems I built and operated. Real users, real traffic, real business impact.`,
        sources: getByCategory('experience'),
        followUps: ['How did you achieve the 60% improvement?', 'Show related projects', 'What tech did you use for the task engine?'],
      };
    }

    case 'profile_hire': {
      return {
        content: `Why you should hire me:\n\n→ **Ships fast, ships right** — I bias toward action without sacrificing rigor. Rapid iteration, but every commit is production-ready.\n\n→ **Full ownership mindset** — I don't just write code. I own features from database schema to deploy pipeline to monitoring dashboard. If it breaks, I fix it. If it's slow, I optimize it.\n\n→ **Team multiplier** — The component libraries, CI/CD pipelines, and testing frameworks I've built are now used across 3 products. I make the whole team faster.\n\n→ **Production experience** — I've operated systems at scale. Distributed task engines processing 1M+ jobs/day. Real-time platforms handling 10K+ concurrent users. I know what happens when things break in production.\n\n→ **Engineering leadership** — Led 6 engineers through a full platform rebuild. Not by micromanaging, but by setting standards, writing code alongside the team, and creating an ownership culture.\n\nI don't just write code. I build systems that last, teams that ship, and products that matter.`,
        sources: [...getByCategory('about'), ...getByCategory('experience')],
        followUps: ['Show me proof', 'How do I contact you?', 'Are you available?'],
      };
    }

    case 'profile_leadership': {
      return {
        content: `Engineering leadership — how I lead:\n\n→ **Lead by doing** — I write code alongside the team, not from a whiteboard. When we hit a blocker, I'm in the code solving it. Credibility comes from shipping, not just directing.\n\n→ **Standards over micromanagement** — I set clear standards for testing, code review, and CI/CD. Then I trust the team to execute. The testing and CI/CD standards I introduced were adopted naturally because they made everyone's life easier.\n\n→ **Ownership culture** — Every engineer owns their feature end-to-end. No silos, no handoffs. You build it, you test it, you deploy it, you operate it. This creates accountability and pride in work.\n\n→ **Mentorship through code** — I don't just give advice. I do pair programming, code reviews, and architecture sessions. The team learns by seeing how I think through problems.\n\n→ **Delivered results** — Led 6 engineers through a full platform rebuild. On time, 90%+ test coverage, better architecture than what we started with. The team was stronger after the project than before.\n\nBest leadership is when the team stops needing you. That's my goal.`,
        sources: getByCategory('experience'),
        followUps: ['What was the hardest challenge?', 'Show the results', 'Tell me about the rebuild'],
      };
    }

    case 'profile_best': {
      const top = getByCategory('project').slice(0, 3);
      return {
        content: `Most technically ambitious projects:\n\n→ **${top[0]?.title}** — ${top[0]?.content.split('.')[0]}. Pushed the limits of scale and distributed systems.\n\n→ **${top[1]?.title}** — ${top[1]?.content.split('.')[0]}. Challenged real-time architecture and throughput constraints.\n\n→ **${top[2]?.title}** — ${top[2]?.content.split('.')[0]}. Required deep security thinking and protocol-level implementation.\n\nEach project pushed different limits: scale, real-time throughput, security, or user experience. But they all share the same foundation — production-grade engineering, comprehensive testing, and operational readiness. Ask about any specific one for technical deep-dive into architecture decisions, trade-offs, and lessons learned.`,
        sources: top,
        followUps: ['Tell me more about the first one', 'What was the hardest technical challenge?', 'How did you approach testing?'],
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
        content: "I can't find specific information about that in the portfolio. But I can help you with:\n\n→ **Full Portfolio Summary** — comprehensive overview of everything I've built\n→ **Projects** — production systems I've shipped with technical details\n→ **Skills** — full-stack expertise across frontend, backend, DevOps\n→ **Experience** — career progression and roles\n→ **Contact** — how to reach me for opportunities\n\nTry asking about any of these, or explore the portfolio directly.",
        sources: [],
        followUps: ["Give me a full summary", 'Show me your projects', 'What are your core skills?'],
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
  { icon: '🟢', label: 'Available for Hire',   query: 'Are you available for hire?' },
];