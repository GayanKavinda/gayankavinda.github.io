//src/components/sections/CodeCadence.tsx

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import aftermathImg from '@/assets/aftermath.png';
import { useTheme } from '@/context/ThemeProvider';

const GITHUB_USERNAME = 'GayanKavinda';

// Types for GitHub API
interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
  contributionLevel: string;
}

interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha?: string }[];
    action?: string;
    ref_type?: string;
  };
}

interface GithubStats {
  totalContributions: number;
  public_repos: number;
  languages: { name: string; pct: number }[];
  heatmap: ContributionDay[][];
  longestStreak: number;
  currentStreak: number;
  events: { id: string; type: string; repo: string; time: string; message: string; url: string }[];
}

const getMockData = (): GithubStats => {
  const heatmap: ContributionDay[][] = [];
  const date = new Date();
  date.setDate(date.getDate() - (53 * 7));
  
  for (let w = 0; w < 53; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      date.setDate(date.getDate() + 1);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      let count = 0;
      if (Math.random() > (isWeekend ? 0.8 : 0.3)) {
        count = Math.floor(Math.random() * 5) + 1;
        if (Math.random() > 0.9) count += 10;
      }
      week.push({
        date: date.toISOString().split('T')[0],
        contributionCount: count,
        color: '',
        contributionLevel: ''
      });
    }
    heatmap.push(week);
  }

  return {
    totalContributions: 1842,
    public_repos: 48,
    languages: [
      { name: 'TypeScript', pct: 45 },
      { name: 'JavaScript', pct: 25 },
      { name: 'Go', pct: 15 },
      { name: 'Python', pct: 10 },
      { name: 'Rust', pct: 5 }
    ],
    longestStreak: 42,
    currentStreak: 12,
    events: [
      { id: '1', type: 'PushEvent', repo: 'gara-yaka-portfolio', time: 'Mar 23', message: 'Refactored Hero Component', url: 'https://github.com' },
      { id: '2', type: 'CreateEvent', repo: 'distributed-queue', time: 'Mar 21', message: 'Created repository', url: 'https://github.com' },
      { id: '3', type: 'PushEvent', repo: 'react-components', time: 'Mar 18', message: 'Added Radar Chart', url: 'https://github.com' },
      { id: '4', type: 'WatchEvent', repo: 'vercel/next.js', time: 'Mar 15', message: 'Starred repository', url: 'https://github.com' },
      { id: '5', type: 'PushEvent', repo: 'go-microservices', time: 'Mar 12', message: 'Implemented gRPC streaming', url: 'https://github.com' },
    ],
    heatmap
  };
};

const fetchGithubData = async (): Promise<GithubStats> => {
  try {
    const [userRes, reposRes, contributionsRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
      fetch(`https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=15`)
    ]);

    if (!userRes.ok || !reposRes.ok || !contributionsRes.ok || !eventsRes.ok) {
      throw new Error("GitHub API failed or rate limited");
    }

    const userData = await userRes.json();
    const reposData = await reposRes.json();
    const contributionsData = await contributionsRes.json();
    const eventsData = await eventsRes.json();

    // Process languages
    const langMap: Record<string, number> = {};
    reposData.forEach((repo: { language: string | null }) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });
    const totalReposWithLang = Object.values(langMap).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / totalReposWithLang) * 100)
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);

    // Process heatmap and streaks
    const heatmap: ContributionDay[][] = contributionsData.contributions;

    const allDays = contributionsData.contributions.flat();
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    allDays.forEach((day: ContributionDay) => {
      if (day.contributionCount > 0) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 0;
      }
    });
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    const today = new Date().toISOString().split('T')[0];
    const pastDays = allDays.filter((d: ContributionDay) => d.date <= today).reverse();
    for (const day of pastDays) {
      if (day.contributionCount > 0) {
        currentStreak++;
      } else if (day.date !== today) {
        break;
      }
    }

    // Process events
    const events = (eventsData as GithubEvent[])
      .filter((e) => ['PushEvent', 'CreateEvent', 'WatchEvent', 'ForkEvent', 'IssuesEvent'].includes(e.type))
      .map((e) => {
        let message = '';
        let url = `https://github.com/${e.repo.name}`;
        
        if (e.type === 'PushEvent') {
          const commitMsg = e.payload.commits?.[0]?.message || 'Pushed commits';
          message = commitMsg.length > 45 ? commitMsg.substring(0, 42) + '...' : commitMsg;
          if (e.payload.commits?.[0]?.sha) url = `${url}/commit/${e.payload.commits[0].sha}`;
        } else if (e.type === 'CreateEvent') {
          message = `Created ${e.payload.ref_type || 'repository'}`;
        } else if (e.type === 'WatchEvent') {
          message = `Starred repository`;
        } else if (e.type === 'ForkEvent') {
          message = `Forked repository`;
        } else if (e.type === 'IssuesEvent') {
          message = `${e.payload.action ? e.payload.action.charAt(0).toUpperCase() + e.payload.action.slice(1) : 'Updated'} issue`;
        }

        return {
          id: e.id,
          type: e.type,
          repo: e.repo.name.replace(`${GITHUB_USERNAME}/`, ''),
          time: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          message,
          url
        };
      })
      .slice(0, 6);

    return {
      totalContributions: contributionsData.totalContributions,
      public_repos: userData.public_repos,
      languages,
      heatmap,
      longestStreak,
      currentStreak,
      events
    };
  } catch (err) {
    console.warn("Failed to fetch Github Data, returning mock fallback data", err);
    return getMockData();
  }
};

const getColor = (n: number, isDark: boolean) => {
  if (n === 0) return isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  if (n <= 3) return isDark ? 'rgba(192,39,45,0.4)' : 'rgba(192,39,45,0.2)';
  if (n <= 8) return isDark ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.5)';
  if (n <= 15) return isDark ? 'rgba(192,39,45,0.85)' : 'rgba(192,39,45,0.7)';
  return isDark ? 'rgba(212,175,55,1)' : 'rgba(212,175,55,0.9)';
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Mon', '', 'Wed', '', 'Fri', '', ''];

const CodeCadence = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const heatmapRef = useRef<SVGSVGElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; subtitle: string } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: githubStats, isLoading, error } = useQuery({
    queryKey: ['githubStats'],
    queryFn: fetchGithubData,
    staleTime: 1000 * 60 * 15, // 15 mins
  });

  useEffect(() => {
    if (isLoading || !githubStats) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current!, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      gsap.from(sectionRef.current!, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 80%'
        }
      });

      gsap.from('.heatmap-col-group', {
        opacity: 0,
        stagger: 0.012,
        duration: 0.5,
        scrollTrigger: {
          trigger: heatmapRef.current!,
          start: 'top 82%',
          once: true
        }
      });

      gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current!,
          start: 'top 85%',
          once: true
        }
      });

      gsap.from('.lang-bar-fill', {
        width: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.lang-bars',
          start: 'top 85%',
          once: true
        }
      });

      gsap.from('.activity-item', {
        x: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.activity-feed',
          start: 'top 85%',
          once: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isLoading, githubStats]);

  const cellSize = 11;
  const gap = 3;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const monthLabels = useMemo(() => {
    if (!githubStats?.heatmap) return [];
    const labels: { col: number; label: string }[] = [];
    let prevMonth = -1;

    githubStats.heatmap.forEach((week, i) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      if (month !== prevMonth) {
        labels.push({ col: i, label: months[month] });
        prevMonth = month;
      }
    });
    return labels;
  }, [githubStats?.heatmap]);

  if (error) return null;

  return (
    <section
      ref={sectionRef}
      className="py-[100px] relative overflow-hidden"
    >
      <img
        ref={bgRef}
        src={aftermathImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none z-0"
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
      />
      <div className="absolute inset-0 z-[1]" style={{ background: 'hsl(var(--background) / 0.93)' }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-10">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Real-time Activity</p>
          <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">Code <em className="font-playfair italic font-medium text-crimson">Cadence</em></h2>
          {/* Minimal divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_240px] gap-[60px] mt-14 max-lg:grid-cols-1">
          <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[11px] text-foreground/35">
                Past 12 months
              </span>
              <span className="font-mono text-[11px] text-gold">
                {githubStats?.totalContributions.toLocaleString()} contributions
              </span>
            </div>

            <div className="relative">
              <svg
                ref={heatmapRef}
                width="100%"
                viewBox={`0 0 ${(githubStats?.heatmap.length || 53) * (cellSize + gap) + 40} ${7 * (cellSize + gap) + 30}`}
              >
                {monthLabels.map((m, i) => (
                  <text
                    key={`${m.label}-${i}`}
                    x={40 + m.col * (cellSize + gap)}
                    y={10}
                    fill={isDark ? "rgba(245,240,232,0.35)" : "rgba(26,26,46,0.35)"}
                    fontSize="9"
                    fontFamily='"DM Mono", monospace'
                  >
                    {m.label}
                  </text>
                ))}
                {['Mon', 'Wed', 'Fri'].map((d, i) => (
                  <text
                    key={d}
                    x={0}
                    y={20 + (i * 2 + 1) * (cellSize + gap) + cellSize / 2 + 3}
                    fill={isDark ? "rgba(245,240,232,0.35)" : "rgba(26,26,46,0.35)"}
                    fontSize="9"
                    fontFamily='"DM Mono", monospace'
                  >
                    {d}
                  </text>
                ))}
                {githubStats?.heatmap.map((week, col) => (
                  <g key={col} className="heatmap-col-group">
                    {week.map((day, row) => (
                      <rect
                        key={`${col}-${row}`}
                        x={40 + col * (cellSize + gap)}
                        y={20 + row * (cellSize + gap)}
                        width={cellSize}
                        height={cellSize}
                        rx={1.5}
                        fill={getColor(day.contributionCount, isDark)}
                        className="cursor-pointer transition-all duration-200 hover:stroke-gold/50 hover:stroke-2"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ 
                            x: rect.left + cellSize/2, 
                            y: rect.top - 10, 
                            title: `${day.contributionCount} contributions`,
                            subtitle: formatDate(day.date)
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    ))}
                  </g>
                ))}
              </svg>
              {tooltip && (
                <div
                  className="fixed translate-x-[-50%] translate-y-[-100%] mb-4 rounded-[6px] border border-border px-3 py-2 font-mono text-[11px] z-50 pointer-events-none flex flex-col items-center gap-0.5 bg-card shadow-xl"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  <span className="text-foreground whitespace-nowrap">{tooltip.title}</span>
                  <span className="text-foreground/40 text-[9px] uppercase tracking-tighter">{tooltip.subtitle}</span>
                  <div className="absolute bottom-[-5px] left-1/2 translate-x-[-50%] w-2 h-2 rotate-45 border-r border-b border-border bg-card" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-[40px] mt-10 max-md:grid-cols-1">
              <div ref={statsRef} className="grid grid-cols-3 gap-3">
                {[
                  { num: githubStats?.totalContributions.toLocaleString() || '0', label: 'COMMITS' },
                  { num: githubStats?.public_repos.toString() || '0', label: 'REPOS' },
                  { num: `${githubStats?.longestStreak || 0}d`, label: 'STREAK' }
                ].map((s) => (
                  <div
                    key={s.label}
                    className="stat-card elevation-card rounded-[8px] border border-border p-3 text-center bg-card"
                  >
                    <p className="font-jakarta font-bold text-[24px] text-gold tracking-tight">{s.num}</p>
                    <p className="font-mono text-[9px] uppercase tracking-wider mt-1 text-foreground/70">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="activity-feed">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30 mb-4 ml-1">
                  // Recent Activity
                </p>
                <div className="space-y-4">
                  {githubStats?.events.map((e) => (
                    <a 
                      key={e.id} 
                      href={e.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="activity-item flex items-start gap-4 group cursor-pointer"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-crimson mt-1.5 shrink-0 shadow-[0_0_8px_rgba(192,39,45,0.6)] group-hover:scale-125 transition-transform" />
                      <div>
                        <p className="font-sans text-[13px] text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                          {e.message} <span className="text-crimson/80 group-hover:text-crimson">in</span> <span className="text-foreground font-mono text-[12px] group-hover:text-gold">{e.repo}</span>
                        </p>
                        <p className="font-mono text-[10px] text-foreground/30 mt-1">{e.time}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 max-lg:w-full max-lg:mt-8 border-l border-border pl-10 max-lg:border-l-0 max-lg:pl-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold mb-8">
              // Languages
            </p>

            <div className="lang-bars">
              {githubStats?.languages.map((l) => (
                <div key={l.name} className="mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[13px] text-foreground">{l.name}</span>
                    <span className="font-mono text-[11px] text-gold opacity-60">{l.pct}%</span>
                  </div>
                  <div
                    className="mt-2.5 h-[3px] rounded-full overflow-hidden bg-foreground/5"
                  >
                    <div
                      className="lang-bar-fill h-full rounded-full bg-crimson shadow-[0_0_10px_rgba(192,39,45,0.3)]"
                      style={{ width: `${l.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-10 pt-8">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-mono text-[12px] text-crimson hover:text-gold transition-colors duration-300"
              >
                <span>View Full Profile</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeCadence;