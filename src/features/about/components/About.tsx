// src/components/sections/About.tsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, MapPin, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@app/providers/theme-provider';

/* ═════════════════════════════════════════════════════════════════
   TYPES & DATA
   ═════════════════════════════════════════════════════════════════ */

interface TechItem {
  id: string;
  name: string;
  description: string;
  color: string;
  glowColor: string;
  svg: React.ReactNode;
  delay: number;
}

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  trackUrl: string;
}

// Impact-driven stats (preserved from original)
const stats = [
  { num: '10+', label: 'YEARS', sub: 'Engineering' },
  { num: '50+', label: 'PROJECTS', sub: 'Shipped' },
  { num: '12+', label: 'SYSTEMS', sub: 'Architected' },
];

// Social links (preserved, redesigned into list cards)
const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    Icon: Github,
    handle: '@garayaka',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    Icon: Linkedin,
    handle: '/in/garayaka',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    Icon: Twitter,
    handle: '@garayaka',
  },
];

// Arsenal / Tech stack with custom SVG icons matching screenshot
const techStack: TechItem[] = [
  {
    id: 'react',
    name: 'React',
    description: 'Component-based UI architecture',
    color: '#61DAFB',
    glowColor: 'rgba(97, 218, 251, 0.35)',
    delay: 0,
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Distributed version control',
    color: '#F05032',
    glowColor: 'rgba(240, 80, 50, 0.35)',
    delay: 0.5,
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
        <path d="M12 8v8M8 12h8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: 'gitlab',
    name: 'GitLab CI',
    description: 'DevOps & CI/CD pipelines',
    color: '#FC6D26',
    glowColor: 'rgba(252, 109, 38, 0.35)',
    delay: 1,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.5 9.5H22L16 14L18.5 22L12 17.5L5.5 22L8 14L2 9.5H9.5L12 2Z" fill="#FC6D26" />
      </svg>
    ),
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Primary code editor & extensions',
    color: '#007ACC',
    glowColor: 'rgba(0, 122, 204, 0.35)',
    delay: 1.5,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4L16 12L4 20V4Z" fill="#007ACC" />
        <path d="M16 12L20 8V16L16 12Z" fill="#007ACC" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'android',
    name: 'Android',
    description: 'Mobile native development',
    color: '#3DDC84',
    glowColor: 'rgba(61, 220, 132, 0.35)',
    delay: 0.3,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-8H6v8zM3 10h18v5H3z" fill="#3DDC84" />
        <path d="M8 6V4m8 2V4" stroke="#3DDC84" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="13" r="0.8" fill="#000" />
        <circle cx="15" cy="13" r="0.8" fill="#000" />
      </svg>
    ),
  },
  {
    id: 'postman',
    name: 'Postman',
    description: 'API testing & documentation',
    color: '#FF6C37',
    glowColor: 'rgba(255, 108, 55, 0.35)',
    delay: 0.8,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#FF6C37" strokeWidth="1.5" fill="none" />
        <path d="M12 7v5l3 3" stroke="#FF6C37" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Interface design & prototyping',
    color: '#F24E1E',
    glowColor: 'rgba(242, 78, 30, 0.35)',
    delay: 1.2,
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83" />
        <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF" />
        <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E" />
        <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262" />
        <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE" />
      </svg>
    ),
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Containerization & orchestration',
    color: '#2496ED',
    glowColor: 'rgba(36, 150, 237, 0.35)',
    delay: 1.7,
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 10h2v2H4zM7 10h2v2H7zM10 10h2v2h-2zM4 7h2v2H4zM7 7h2v2H7zM10 7h2v2h-2zM13 7h2v2h-2zM7 4h2v2H7zM10 4h2v2h-2z" fill="#2496ED" />
        <path d="M2 13h16c0 3.3-2.7 6-6 6H8c-3.3 0-6-2.7-6-6z" fill="#2496ED" opacity="0.8" />
      </svg>
    ),
  },
];

/* ═════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═════════════════════════════════════════════════════════════════ */

/** Animated audio equalizer bars for Spotify card */
function AudioBars({ isPlaying }: { isPlaying: boolean }) {
  const [heights, setHeights] = useState([4, 7, 5, 9, 6]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHeights(prev => prev.map(() => 3 + Math.random() * 9));
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end gap-[3px] h-[14px]">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-[#1DB954]"
          animate={{ height: isPlaying ? h : 3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}

/** Spotify Now Playing / Recently Played Card */
function SpotifyCard() {
  const [track, setTrack] = useState<SpotifyTrack>({
    isPlaying: false,
    title: 'Dalada Mal',
    artist: 'JANANA',
    albumArt: '',
    trackUrl: '#',
  });

  // Fetch from your API endpoint — wire this up to your Spotify integration
  useEffect(() => {
    // Example: fetch('/api/spotify').then(r => r.json()).then(setTrack)
    // For now, simulate a "recently played" state
    const timer = setTimeout(() => {
      setTrack(prev => ({ ...prev, isPlaying: true }));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-5 flex flex-col justify-between overflow-hidden group">
      {/* Subtle inner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#1DB954]/5 dark:bg-[#1DB954]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="w-9 h-9 rounded-full bg-[#1DB954]/10 dark:bg-[#1DB954]/15 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <AudioBars isPlaying={track.isPlaying} />
      </div>

      {/* Track Info */}
      <div className="relative z-10 mt-auto pt-8">
        <div className="flex items-end gap-3">
          {/* Album Art Placeholder */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center shrink-0 overflow-hidden">
            {track.albumArt ? (
              <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1DB954] font-medium mb-0.5">
              {track.isPlaying ? 'Now Playing' : 'Recently Played'}
            </p>
            <a
              href={track.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-foreground truncate hover:underline decoration-[#1DB954]/50 underline-offset-2"
            >
              {track.title}
            </a>
            <p className="text-xs text-foreground/50 truncate">{track.artist}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Arsenal Card with floating icons & cursor tooltips */
function ArsenalCard() {
  const [hovered, setHovered] = useState<TechItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent, tech: TechItem) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setHovered(tech);
  }, []);

  return (
    <div ref={cardRef} className="relative h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-5 overflow-hidden">
      <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">My Arsenal</h3>

      <div className="grid grid-cols-4 gap-3">
        {techStack.map((tech) => (
          <motion.div
            key={tech.id}
            className="relative flex items-center justify-center aspect-square rounded-xl border border-black/[0.05] dark:border-white/[0.05] bg-background/50 dark:bg-white/[0.03] cursor-pointer transition-colors duration-300 hover:bg-background dark:hover:bg-white/[0.06]"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: tech.delay,
            }}
            onMouseMove={(e) => handleMouseMove(e, tech)}
            onMouseEnter={(e) => handleMouseMove(e, tech)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: hovered?.id === tech.id ? `0 0 20px ${tech.glowColor}` : 'none',
            }}
          >
            {tech.svg}
          </motion.div>
        ))}
      </div>

      {/* Cursor-following tooltip */}
      {hovered && (
        <motion.div
          className="fixed z-[9999] pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: tooltipPos.x + 16,
            y: tooltipPos.y - 16,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="px-3 py-2 rounded-lg bg-background/95 dark:bg-[#141422]/95 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-xl">
            <p className="text-xs font-semibold text-foreground whitespace-nowrap">{hovered.name}</p>
            <p className="text-[10px] text-foreground/60 whitespace-nowrap mt-0.5">{hovered.description}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/** Location Card */
function LocationCard() {
  return (
    <div className="relative h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-5 flex flex-col justify-between overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 bg-background/60 dark:bg-white/[0.04] flex items-center justify-center">
          <MapPin size={18} className="text-foreground/70" />
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-black/10 dark:border-white/10 text-foreground/60 bg-background/60 dark:bg-white/[0.04]">
          Remote Ready
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-10">
        <p className="text-xl font-semibold text-foreground tracking-tight">Colombo, LK</p>
        <p className="text-xs text-foreground/50 font-mono mt-0.5">GMT+5:30</p>
      </div>
    </div>
  );
}

/** Social Links Card */
function SocialCard() {
  return (
    <div className="relative h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-5 flex flex-col justify-center overflow-hidden">
      <div className="space-y-2">
        {socials.map((social, i) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-black/[0.06] dark:hover:border-white/[0.08] hover:bg-background/60 dark:hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <social.Icon size={18} strokeWidth={1.6} className="text-foreground/60 group-hover:text-foreground transition-colors" />
              <div>
                <p className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">{social.name}</p>
                <p className="text-[10px] font-mono text-foreground/40">{social.handle}</p>
              </div>
            </div>
            <ArrowUpRight
              size={14}
              className="text-foreground/30 group-hover:text-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════════ */

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-14 md:py-24 relative overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 900px' }}
    >
      {/* Dark mode magenta nebula glow (preserved) */}
      {isDark && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236, 72, 153, 0.18), transparent 70%)',
          }}
        />
      )}

      {/* Top fade, blends Hero bottom into About (preserved) */}
      <div
        className="absolute inset-x-0 top-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />

      {/* Bottom fade, blends About bottom into next section (preserved) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-[1] max-w-[1000px] mx-auto px-6 md:px-10">
        {/* Section Header — preserved bio content, compacted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-4">
            About the{' '}
            <span className="font-playfair italic font-medium text-[#d60d86]">
              Engineer
            </span>
          </h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="text-sm text-foreground/50 dark:text-foreground/60 leading-relaxed max-w-[380px]">
              Architecting scalable systems and refined sensory experiences across 10 years of engineering.
            </p>

            {/* Stats row — preserved from original, moved to header */}
            <div className="flex gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <span className="font-jakarta font-bold text-xl text-foreground block">{stat.num}</span>
                  <span className="font-mono text-[10px] text-foreground/50 uppercase tracking-wider block">{stat.label}</span>
                  <span className="font-mono text-[10px] text-foreground/40 block">{stat.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bio paragraph — preserved content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <ul className="space-y-2 text-sm text-foreground/60 dark:text-foreground/50 max-w-[720px]">
            <li className="flex gap-2">
              <span className="text-[#d60d86] mt-1.5">◆</span>
              <span>Designed a multi‑region, event‑driven platform handling {'>'}2M RPS with {'<'}50 ms p99 latency.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d60d86] mt-1.5">◆</span>
              <span>Introduced observability‑first practices (OpenTelemetry, SLO‑based alerting) reducing MTTR by 40%.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d60d86] mt-1.5">◆</span>
              <span>Led migration from monolith to Kubernetes‑microservices, reducing deploy‑time from hours to {'<'}15 min.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d60d86] mt-1.5">◆</span>
              <span>Authored internal library for distributed tracing adopted by 8+ teams.</span>
            </li>
          </ul>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            BENTO GRID — 2x2 Layout matching screenshot
            ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Top Left — Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[180px] md:min-h-[200px]"
          >
            <LocationCard />
          </motion.div>

          {/* Top Right — Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[180px] md:min-h-[200px]"
          >
            <SocialCard />
          </motion.div>

          {/* Bottom Left — Spotify */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[180px] md:min-h-[200px]"
          >
            <SpotifyCard />
          </motion.div>

          {/* Bottom Right — Arsenal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[180px] md:min-h-[200px]"
          >
            <ArsenalCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;