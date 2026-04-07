// src/features/agent/data/knowledge-base.ts
// ═══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO KNOWLEDGE BASE v5 — Enhanced Search + Fuzzy Matching
// ═══════════════════════════════════════════════════════════════════════════════

export interface PortfolioEntry {
  id: string;
  category: 'about' | 'project' | 'skill' | 'experience' | 'contact' | 'general';
  title: string;
  content: string;
  keywords: string[];
  link?: string;
  metadata?: Record<string, string>;
}

export const portfolioKnowledge: PortfolioEntry[] = [
  // ── About ──
  {
    id: 'about-intro',
    category: 'about',
    title: 'About Me',
    content:
      'I am a Full-Stack Software Engineer specializing in building scalable, high-performance web applications. I focus on clean architecture, observability-first engineering, and delivering production-grade systems. My philosophy revolves around simplicity, rigorous testing, failure-resilient design, and deep observability.',
    keywords: ['about', 'who', 'introduction', 'background', 'engineer', 'developer', 'software', 'me', 'myself'],
    link: '/#about',
  },
  {
    id: 'about-philosophy',
    category: 'about',
    title: 'Engineering Philosophy',
    content:
      "My engineering philosophy has four pillars: Simplicity (write code a junior can understand), Testing (every feature ships with tests), Failure Design (design for when things go wrong, not just when they go right), and Observability (if you can't measure it, you can't improve it).",
    keywords: ['philosophy', 'principles', 'approach', 'methodology', 'simplicity', 'testing', 'observability', 'failure', 'pillars', 'values'],
    link: '/#about',
  },

  // ── Skills / Tech Stack ──
  {
    id: 'skills-frontend',
    category: 'skill',
    title: 'Frontend Skills',
    content:
      'React, Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP, Three.js, Vue.js, Angular, HTML5, CSS3, Sass, Styled Components, Redux, Zustand, React Query.',
    keywords: ['frontend', 'react', 'nextjs', 'typescript', 'tailwind', 'css', 'html', 'angular', 'vue', 'skills', 'tech stack', 'ui'],
    link: '/#tech-stack',
  },
  {
    id: 'skills-backend',
    category: 'skill',
    title: 'Backend Skills',
    content:
      'Node.js, Express, NestJS, Python, Django, FastAPI, Go, Rust, PostgreSQL, MongoDB, Redis, GraphQL, REST APIs, gRPC, Docker, Kubernetes, AWS, GCP, Terraform.',
    keywords: ['backend', 'nodejs', 'python', 'django', 'database', 'api', 'docker', 'kubernetes', 'cloud', 'aws', 'skills', 'tech stack', 'server'],
    link: '/#tech-stack',
  },
  {
    id: 'skills-devops',
    category: 'skill',
    title: 'DevOps & Tools',
    content:
      'Git, GitHub Actions, CI/CD, Docker, Kubernetes, Terraform, AWS (EC2, S3, Lambda, CloudFront), GCP, Nginx, Linux, Prometheus, Grafana, DataDog, Sentry.',
    keywords: ['devops', 'ci/cd', 'deployment', 'infrastructure', 'monitoring', 'tools', 'git', 'pipeline'],
    link: '/#tech-stack',
  },

  // ── Projects ──
  {
    id: 'project-distributed-task-engine',
    category: 'project',
    title: 'Distributed Task Engine',
    content: 'A high-throughput task orchestration system built for scale and reliability, utilizing Go, Kafka, and Redis. Handles millions of tasks per day with sub-second latency.',
    keywords: ['project', 'distributed', 'task', 'engine', 'orchestration', 'go', 'kafka', 'redis', 'scale'],
    link: '/projects/distributed-task-engine',
    metadata: { tech: 'Go, Kafka, Redis', type: 'Web', year: '2024', stars: '2.3k' },
  },
  {
    id: 'project-real-time-analytics',
    category: 'project',
    title: 'Real-time Analytics Dashboard',
    content: 'A real-time analytics dashboard driven by WebSockets, providing live data visualization using React, D3.js, and Node.js. Processes 50K events/second.',
    keywords: ['project', 'real-time', 'analytics', 'websocket', 'dashboard', 'react', 'd3', 'nodejs', 'visualization'],
    link: '/projects/real-time-analytics',
    metadata: { tech: 'React, D3.js, Node.js', type: 'Web', year: '2024' },
  },
  {
    id: 'project-authshield-sdk',
    category: 'project',
    title: 'AuthShield SDK',
    content: 'A zero-trust authentication SDK designed to secure applications with robust OAuth implementations and strict typing using TypeScript. Used by 500+ developers.',
    keywords: ['project', 'authshield', 'sdk', 'zero-trust', 'authentication', 'typescript', 'oauth', 'security'],
    link: '/projects/authshield-sdk',
    metadata: { tech: 'TypeScript, OAuth', type: 'Open Source', year: '2024', stars: '1.8k' },
  },
  {
    id: 'project-datapipe',
    category: 'project',
    title: 'DataPipe ETL',
    content: 'A robust real-time ETL pipeline engineered to process large streams of data efficiently using Python and Kafka. Handles 10TB+ daily throughput.',
    keywords: ['project', 'datapipe', 'etl', 'pipeline', 'real-time', 'python', 'kafka', 'data'],
    link: '/projects/datapipe',
    metadata: { tech: 'Python, Kafka', type: 'Web', year: '2023' },
  },
  {
    id: 'project-clouddash',
    category: 'project',
    title: 'CloudDash',
    content: 'An infrastructure monitoring tool that provides comprehensive visibility into AWS environments, built with React and AWS services. Monitors 200+ services.',
    keywords: ['project', 'clouddash', 'infrastructure', 'monitoring', 'react', 'aws', 'cloud'],
    link: '/projects/clouddash',
    metadata: { tech: 'React, AWS', type: 'Web', year: '2023' },
  },
  {
    id: 'project-apiforge',
    category: 'project',
    title: 'APIForge',
    content: 'A high-performance API gateway framework built to manage and route microservices efficiently using Go and gRPC. Achieves <2ms routing latency.',
    keywords: ['project', 'apiforge', 'api', 'gateway', 'framework', 'go', 'grpc', 'microservices'],
    link: '/projects/apiforge',
    metadata: { tech: 'Go, gRPC', type: 'Open Source', year: '2023', stars: '950' },
  },
  {
    id: 'project-mobiletrack',
    category: 'project',
    title: 'MobileTrack',
    content: 'A cross-platform mobile GPS tracking application built with React Native and powered by Firebase for real-time synchronization. 10K+ active users.',
    keywords: ['project', 'mobiletrack', 'gps', 'tracking', 'app', 'react native', 'firebase', 'mobile'],
    link: '/projects/mobiletrack',
    metadata: { tech: 'React Native, Firebase', type: 'Mobile', year: '2023' },
  },
  {
    id: 'project-chatscale',
    category: 'project',
    title: 'ChatScale',
    content: 'A highly scalable chat infrastructure capable of handling thousands of concurrent users, built with Node.js and WebSockets. Powers 3 production apps.',
    keywords: ['project', 'chatscale', 'chat', 'scalable', 'infrastructure', 'nodejs', 'websocket', 'messaging'],
    link: '/projects/chatscale',
    metadata: { tech: 'Node.js, WebSocket', type: 'Web', year: '2022' },
  },
  {
    id: 'project-devmetrics',
    category: 'project',
    title: 'DevMetrics',
    content: 'An open-source developer productivity tool that analyzes engineering metrics and workflows, built with TypeScript and PostgreSQL. Used by 50+ teams.',
    keywords: ['project', 'devmetrics', 'developer', 'productivity', 'tool', 'typescript', 'postgresql', 'metrics'],
    link: '/projects/devmetrics',
    metadata: { tech: 'TypeScript, PostgreSQL', type: 'Open Source', year: '2022', stars: '1.2k' },
  },

  // ── Experience ──
  {
    id: 'exp-1',
    category: 'experience',
    title: 'Senior Software Engineer — TechCorp',
    content:
      'Led a team of 6 engineers to rebuild the core platform, reducing page load times by 60% and improving API response times by 45%. Implemented comprehensive CI/CD pipelines and established testing standards achieving 90%+ code coverage.',
    keywords: ['experience', 'work', 'job', 'senior', 'engineer', 'lead', 'team', 'performance', 'current'],
    link: '/#experience',
    metadata: { period: '2023 – Present', company: 'TechCorp', role: 'Senior Software Engineer' },
  },
  {
    id: 'exp-2',
    category: 'experience',
    title: 'Software Engineer — StartupXYZ',
    content:
      'Built the entire frontend architecture from scratch using React and TypeScript. Designed and implemented the component library used across 3 products. Integrated real-time features using WebSocket.',
    keywords: ['experience', 'work', 'job', 'startup', 'frontend', 'architecture', 'component library'],
    link: '/#experience',
    metadata: { period: '2021 – 2023', company: 'StartupXYZ', role: 'Software Engineer' },
  },



  // ── Contact ──
  {
    id: 'contact',
    category: 'contact',
    title: 'Contact Information',
    content:
      `Direct email: ${import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}. You can also reach me through the contact form on my portfolio, or connect with me on LinkedIn (${import.meta.env.VITE_CONTACT_LINKEDIN || 'LinkedIn'}) and GitHub (${import.meta.env.VITE_CONTACT_GITHUB || 'GitHub'}). I am currently based in ${import.meta.env.VITE_CONTACT_LOCATION || 'Colombo, Sri Lanka'}.`,
    keywords: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'github', 'message', 'freelance', 'location', 'twitter', 'x', 'devto', 'address'],
    link: '/#contact',
    metadata: {
      email: import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com',
      linkedin: import.meta.env.VITE_CONTACT_LINKEDIN || '#',
      github: import.meta.env.VITE_CONTACT_GITHUB || '#',
      location: import.meta.env.VITE_CONTACT_LOCATION || 'Colombo, Sri Lanka'
    },
  },

  // ── General ──
  {
    id: 'nav-home',
    category: 'general',
    title: 'Homepage',
    content: 'The homepage features a cinematic hero section, tech stack visualization, experience timeline, and more.',
    keywords: ['home', 'homepage', 'main', 'landing'],
    link: '/',
  },
  {
    id: 'nav-projects',
    category: 'general',
    title: 'All Projects',
    content: 'View all my projects including web applications, open-source contributions, and experimental builds.',
    keywords: ['projects', 'portfolio', 'work', 'all projects', 'gallery'],
    link: '/projects',
  },

  {
    id: 'availability',
    category: 'general',
    title: 'Availability',
    content: `${import.meta.env.VITE_CONTACT_STATUS || 'Current status'} — ${import.meta.env.VITE_CONTACT_STATUS_DESC || 'Available for projects.'} Open to: ${import.meta.env.VITE_CONTACT_OPEN_TO || 'Full-time, freelance, and consulting'}.`,
    keywords: ['available', 'hire', 'freelance', 'remote', 'open', 'status', 'work with', 'booking', 'rates', 'opportunity'],
    link: '/#contact',
  },
];

// ── Levenshtein Distance for fuzzy matching ──
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(query: string, target: string, threshold = 0.7): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q) || q.includes(t)) return true;
  const distance = levenshtein(q, t);
  const maxLen = Math.max(q.length, t.length);
  return maxLen > 0 && (1 - distance / maxLen) >= threshold;
}

// ── Enhanced Search Engine ──
export function searchPortfolio(query: string, maxResults = 5): PortfolioEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = portfolioKnowledge.map((entry) => {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const contentLower = entry.content.toLowerCase();

    // Exact title match
    if (titleLower === q) score += 200;
    if (titleLower.includes(q)) score += 100;

    tokens.forEach((t) => {
      if (titleLower.includes(t)) score += 30;
      // Fuzzy title match
      titleLower.split(/\s+/).forEach((word) => {
        if (fuzzyMatch(t, word, 0.75)) score += 15;
      });
    });

    // Keyword matching
    entry.keywords.forEach((kw) => {
      const kwLower = kw.toLowerCase();
      if (kwLower === q) score += 80;
      tokens.forEach((t) => {
        if (kwLower === t) score += 40;
        if (kwLower.includes(t) || t.includes(kwLower)) score += 20;
        if (fuzzyMatch(t, kwLower, 0.8)) score += 10;
      });
    });

    // Content matching
    if (contentLower.includes(q)) score += 40;
    tokens.forEach((t) => {
      if (contentLower.includes(t)) score += 8;
    });

    // Category match
    if (entry.category.includes(q)) score += 15;
    tokens.forEach((t) => {
      if (entry.category.includes(t)) score += 5;
    });

    // Metadata matching
    if (entry.metadata) {
      Object.values(entry.metadata).forEach((v) => {
        const vLower = v.toLowerCase();
        tokens.forEach((t) => {
          if (vLower.includes(t)) score += 12;
        });
      });
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.entry);
}

export function buildPortfolioContext(query: string): string {
  const results = searchPortfolio(query, 8);
  if (results.length === 0) return 'No relevant information found in the portfolio for this query.';

  return results
    .map(
      (r) =>
        `[${r.category.toUpperCase()}] ${r.title}\n${r.content}${r.link ? `\nLink: ${r.link}` : ''}${
          r.metadata
            ? `\n${Object.entries(r.metadata).map(([k, v]) => `${k}: ${v}`).join(', ')}`
            : ''
        }`
    )
    .join('\n\n---\n\n');
}

// ── Get all entries by category ──
export function getByCategory(category: PortfolioEntry['category']): PortfolioEntry[] {
  return portfolioKnowledge.filter((e) => e.category === category);
}

// ── Get follow-up suggestions based on last response context ──
export function getFollowUpSuggestions(lastSources: PortfolioEntry[]): string[] {
  if (!lastSources.length) {
    return ['What are your skills?', 'Show me projects', 'Tell me about yourself'];
  }

  const categories = [...new Set(lastSources.map((s) => s.category))];
  const suggestions: string[] = [];

  categories.forEach((cat) => {
    switch (cat) {
      case 'project':
        suggestions.push('Show all projects', 'What tech do you use most?');
        break;
      case 'skill':
        suggestions.push('Show me projects using these', 'What about backend skills?');
        break;
      case 'experience':
        suggestions.push('What projects came from this?', 'What skills did you gain?', 'Are you available now?');
        break;
      case 'about':
        suggestions.push('What are your core skills?', 'Show me your work', 'How can I hire you?');
        break;
      case 'contact':
        suggestions.push('Are you available for freelance?', 'Show me your work first', 'What are your rates?');
        break;
      default:
        suggestions.push('Show me projects', 'What are your skills?');
    }
  });

  // Deduplicate and limit
  return [...new Set(suggestions)].slice(0, 3);
}