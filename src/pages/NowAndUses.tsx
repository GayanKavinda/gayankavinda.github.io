// src/pages/NowAndUses.tsx
// "What I'm doing right now" page — matches Gara Yaka design system.
// Inspired by nownownow.com. Keeps the portfolio feeling alive.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { setSEO } from '@lib/seo';

const LAST_UPDATED = 'March 2026';

const NOW_ITEMS = [
  {
    tag:   'Work',
    color: '#7C5CFC',
    title: 'Building a distributed rate-limiter',
    body:  'Designing a token-bucket rate limiter that coordinates across Go pods via Redis Lua scripts. The tricky part: making it survive Redis failover without dropping valid requests.',
  },
  {
    tag:   'Learning',
    color: '#D4891A',
    title: 'Going deeper on eBPF',
    body:  'Working through Liz Rice\'s "Learning eBPF" and writing toy programs that inspect syscalls. The kernel programmability story is genuinely exciting — feels like the 2024 equivalent of when Docker landed.',
  },
  {
    tag:   'Reading',
    color: '#7C5CFC',
    title: 'Designing Data-Intensive Applications — again',
    body:  'Third read of Kleppmann\'s book. Every re-read surfaces something the previous pass missed. This time I\'m focused on the replication and consensus chapters.',
  },
  {
    tag:   'Writing',
    color: '#D4891A',
    title: 'Long-form post on Kafka exactly-once semantics',
    body:  'Idempotent producers, transactional APIs, and where the "exactly-once" guarantee actually breaks down. Target: technically accurate for engineers who\'ve read the docs but want the gotchas.',
  },
  {
    tag:   'Life',
    color: '#7C5CFC',
    title: 'Getting back into traditional drumming',
    body:  'Took up Kandyan drum lessons. There\'s a precision-under-pressure element that maps surprisingly well onto incident response.',
  },
];

export const Now = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setSEO({
      title:       'Now — What I\'m Working On',
      description: 'What Gayan Kavinda is focused on right now — projects, learning, reading, and life.',
      url:         'https://gayankav.github.io/now',
    });
    return () => setSEO();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 md:pt-36 pb-24 max-w-[720px] mx-auto px-6 md:px-10">

        {/* Back */}
        <button onClick={() => navigate('/#about')}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/35 hover:text-[#D4891A] transition-colors mb-10 group">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:-translate-x-1 transition-transform">
            <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </button>

        {/* Header */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Now</p>
        <h1 className="font-playfair font-black text-[clamp(36px,6vw,56px)] text-foreground leading-tight tracking-tight">
          What I'm doing{' '}
          <em className="italic text-[#7C5CFC]">right now</em>
        </h1>
        <div className="flex items-center gap-3 mt-4 mb-3">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#7C5CFC]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4891A]" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/30 mb-10">
          Last updated: {LAST_UPDATED}
        </p>

        {/* Items */}
        <div className="space-y-6">
          {NOW_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card elevation-card p-6 relative overflow-hidden group hover:-translate-y-[2px] transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: item.color }} />
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border"
                  style={{ color: item.color, borderColor: `${item.color}30`, background: `${item.color}10` }}>
                  {item.tag}
                </span>
              </div>
              <h2 className="font-jakarta font-bold text-[17px] text-foreground mb-2 tracking-tight">{item.title}</h2>
              <p className="font-sans text-[14px] text-foreground/60 leading-[1.75]">{item.body}</p>
            </div>
          ))}
        </div>

        {/* What is this? */}
        <div className="mt-14 pt-8 border-t border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/25 mb-3">// What is this page?</p>
          <p className="font-sans text-[13px] text-foreground/45 leading-relaxed">
            A "now page" tells you what someone is focused on at this point in their life.
            It's different from an about page — those don't change much.
            Inspired by{' '}
            <a href="https://nownownow.com" target="_blank" rel="noreferrer" className="text-[#D4891A] hover:underline">nownownow.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};



// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Uses.tsx
// /uses page — tools, stack, gear. A personality page senior engineers appreciate.
// ─────────────────────────────────────────────────────────────────────────────

export const Uses = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setSEO({
      title:       'Uses — Tools & Setup',
      description: 'The software, hardware, and tools Gayan Kavinda uses daily.',
      url:         'https://gayankav.github.io/uses',
    });
    return () => setSEO();
  }, []);

  const SECTIONS = [
    {
      title: 'Editor & Terminal',
      color: '#7C5CFC',
      items: [
        { name: 'Neovim',          note: 'My daily driver. lua config, lazy.nvim, nvim-cmp. The muscle memory is unbeatable.' },
        { name: 'VS Code',         note: 'For TypeScript and anything needing a proper debugger.' },
        { name: 'WezTerm',         note: 'GPU-accelerated terminal. Lua config, ligatures, splits built-in.' },
        { name: 'tmux',            note: 'Session persistence. Can\'t live without it on remote machines.' },
        { name: 'Catppuccin Mocha', note: 'My colour scheme of choice. Consistent across Neovim, WezTerm, everything.' },
      ],
    },
    {
      title: 'Languages & Runtimes',
      color: '#D4891A',
      items: [
        { name: 'Go',           note: 'Services, CLIs, anything latency-sensitive. The stdlib is genuinely good.' },
        { name: 'TypeScript',   note: 'The rest. Strict mode on, no exceptions.' },
        { name: 'Python',       note: 'Data pipeline scripts and ML tooling where Go would be overkill.' },
        { name: 'Bash + fzf',   note: 'For everything else. fzf changed how I interact with the shell.' },
      ],
    },
    {
      title: 'Infrastructure',
      color: '#7C5CFC',
      items: [
        { name: 'Kubernetes',   note: 'Production workloads. EKS in AWS, k3s locally.' },
        { name: 'Terraform',    note: 'All infra as code. Atlantis for PR-based plan/apply.' },
        { name: 'AWS',          note: 'EKS, RDS, MSK (Kafka), ElastiCache, S3, CloudFront.' },
        { name: 'Docker',       note: 'Multi-stage builds, distroless base images for production.' },
        { name: 'GitHub Actions', note: 'CI/CD. Matrix builds for multi-arch container images.' },
      ],
    },
    {
      title: 'Observability Stack',
      color: '#D4891A',
      items: [
        { name: 'Prometheus + Grafana', note: 'Metrics and dashboards. Cardinality budgets enforced at the scrape config level.' },
        { name: 'Jaeger',               note: 'Distributed tracing via OpenTelemetry.' },
        { name: 'Loki',                 note: 'Log aggregation. Structured JSON logs everywhere.' },
        { name: 'PagerDuty',            note: 'On-call rotation. Runbooks linked directly in alert annotations.' },
      ],
    },
    {
      title: 'Hardware',
      color: '#7C5CFC',
      items: [
        { name: 'MacBook Pro M3 Max 16"', note: '36GB unified memory. Local Docker clusters without fans spinning up.' },
        { name: 'LG UltraWide 34"',       note: 'Three tmux panes, docs, and Slack side by side.' },
        { name: 'Keychron Q1 Pro',        note: 'Gateron oil king switches. Silent enough for calls.' },
        { name: 'Logitech MX Master 3',   note: 'The scroll wheel is worth the price alone.' },
      ],
    },
    {
      title: 'Daily Drivers',
      color: '#D4891A',
      items: [
        { name: 'Linear',   note: 'Issue tracking. The keyboard-first UX is a cut above Jira.' },
        { name: 'Obsidian',  note: 'Notes and architecture decision records. Local-first, Markdown.' },
        { name: 'Arc',       note: 'Browser. Spaces keeps work and personal contexts clean.' },
        { name: 'Raycast',   note: 'Alfred replacement. Extensions for GitHub, Linear, and clipboard history.' },
        { name: 'Spotify',   note: 'Lo-fi hip-hop when writing. Silence when debugging.' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 md:pt-36 pb-24 max-w-[860px] mx-auto px-6 md:px-10">

        {/* Back */}
        <button onClick={() => navigate('/#about')}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/35 hover:text-[#D4891A] transition-colors mb-10 group">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:-translate-x-1 transition-transform">
            <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </button>

        {/* Header */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Setup</p>
        <h1 className="font-playfair font-black text-[clamp(36px,6vw,56px)] text-foreground leading-tight tracking-tight">
          What I <em className="italic text-[#7C5CFC]">use</em>
        </h1>
        <div className="flex items-center gap-3 mt-4 mb-6">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#7C5CFC]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4891A]" />
        </div>
        <p className="font-sans text-[15px] text-foreground/55 leading-relaxed max-w-[540px] mb-12">
          The tools I reach for daily. Opinionated choices, not sponsored suggestions.
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: section.color }}>{section.title}</h2>
                <div className="flex-1 h-px" style={{ background: `${section.color}20` }} />
              </div>
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <div key={j} className="rounded-lg border border-border bg-card elevation-card px-5 py-3.5 flex items-start gap-4 hover:border-foreground/15 transition-colors group">
                    <span className="font-jakarta font-semibold text-[14px] text-foreground min-w-[160px] flex-shrink-0 group-hover:text-[#D4891A] transition-colors">{item.name}</span>
                    <span className="font-sans text-[13px] text-foreground/50 leading-relaxed">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 pt-8 border-t border-border">
          <p className="font-sans text-[13px] text-foreground/35 leading-relaxed">
            This page is updated irregularly. Last major update: {LAST_UPDATED}.
            If something changed, I've probably linked it on{' '}
            <a href="#" className="text-[#D4891A] hover:underline">Twitter / X</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};


