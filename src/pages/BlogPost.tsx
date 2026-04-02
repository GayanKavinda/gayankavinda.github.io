// src/pages/BlogPost.tsx
// Individual blog post layout — matches Gara Yaka design DNA exactly.
// Editorial layout: narrow prose column + sticky TOC sidebar on desktop.
// Crimson #C41E3A · Gold #D4891A · Playfair headings · DM Mono labels

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@shared/components/layout/Navbar';
import Footer from '@shared/components/layout/Footer';
import { useTheme } from '@app/providers/theme-provider';
import { POSTS } from '@features/blog/data/blog';

gsap.registerPlugin(ScrollTrigger);

// ── Mock article content ──────────────────────────────────────────────────────
const ARTICLE_CONTENT: Record<string, { toc: string[]; sections: { id: string; heading: string; body: string }[] }> = {
  'kafka-consumer-lag-hpa': {
    toc: ['The Problem with CPU', 'Consumer Lag as a Signal', 'Wiring It to HPA', 'Production Numbers', 'Gotchas'],
    sections: [
      {
        id: 'cpu-problem',
        heading: 'The Problem with CPU',
        body: `When your Kubernetes workers are CPU-bound, HPA on CPU works fine. But Kafka consumers aren't CPU-bound — they're I/O and throughput bound. A worker pod sitting at 5% CPU can be catastrophically behind on processing its partition.

We learned this the hard way. During a traffic spike, our CPU HPA was happily scaling down because CPU looked fine — while 200K tasks sat unprocessed in Kafka. Our p99 latency had gone from 120ms to 8 minutes, and nothing had triggered.`,
      },
      {
        id: 'consumer-lag-signal',
        heading: 'Consumer Lag as a Signal',
        body: `Consumer lag — the difference between the latest offset produced and the last offset committed by your consumer group — is a direct measure of how behind your workers are. It's exactly the signal you want to scale on.

The trick is getting that metric from Kafka into Kubernetes in a form HPA can consume. Kubernetes HPA v2 supports "external metrics" backed by a custom metrics API. The standard solution is the KEDA (Kubernetes Event Driven Autoscaling) operator, which has native Kafka lag support.`,
      },
      {
        id: 'wiring-hpa',
        heading: 'Wiring It to HPA',
        body: `We deployed KEDA's ScaledObject alongside our worker Deployment. The ScaledObject polls Kafka for lag on our consumer group and adjusts the Deployment's replica count accordingly.

The key parameters we tuned: lagThreshold (target lag per replica — we use 500), pollingInterval (15s worked well), and cooldownPeriod (300s to prevent thrashing). The min/max replicas were set to match our burst capacity budget.`,
      },
      {
        id: 'production-numbers',
        heading: 'Production Numbers',
        body: `After the migration: scale-out trigger time dropped from 4 minutes (CPU-based, waiting for metrics to accumulate) to under 40 seconds. During a 10× traffic spike test, we saw the first new pod scheduled within 38 seconds of the lag crossing threshold.

Task processing p99 latency went from spiking to 8+ minutes under load to staying under 800ms even at 5× normal traffic. The workers scaled from 4 to 22 pods automatically and scaled back down within 5 minutes of traffic returning to baseline.`,
      },
      {
        id: 'gotchas',
        heading: 'Gotchas',
        body: `A few things that bit us: First, KEDA needs a Kafka user with consumer group describe permissions — make sure your ACLs are set correctly before going to production.

Second, if you have multiple consumer groups on the same topic, each needs its own ScaledObject. We missed this initially and had one group scaling while the other sat at 1 replica.

Third, the pollingInterval adds latency to your reaction time. 15s is a good balance, but if you need sub-30s response, drop it to 10s and accept a small increase in Kafka API load.`,
      },
    ],
  },
};

const FALLBACK_CONTENT = {
  toc: ['Introduction', 'The Core Problem', 'Our Approach', 'Results', 'Takeaways'],
  sections: [
    { id: 'intro', heading: 'Introduction', body: 'This article content is being written. Check back soon.' },
  ],
};

// ── Reading progress bar ──────────────────────────────────────────────────────
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.body.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] h-[2px] bg-transparent">
      <div className="h-full bg-gradient-to-r from-[#C41E3A] to-[#D4891A] transition-none"
        style={{ width: `${progress}%` }} />
    </div>
  );
};

// ── TOC Sidebar ───────────────────────────────────────────────────────────────
const TOCSidebar = ({ toc }: { toc: string[] }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const fn = () => {
      const threshold = window.innerHeight * 0.35;
      const sections  = document.querySelectorAll('.article-section');
      sections.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom > 0) setActive(i);
      });
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scroll = (i: number) => {
    document.querySelectorAll('.article-section')[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-24">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30 mb-4">Contents</p>
      <div className="space-y-1">
        {toc.map((item, i) => (
          <button
            key={i}
            onClick={() => scroll(i)}
            className="block text-left w-full font-sans text-[12px] leading-snug py-1.5 px-3 rounded transition-all duration-150"
            style={{
              color:      active === i ? '#C41E3A' : 'hsl(var(--foreground)/0.40)',
              background: active === i ? 'rgba(196,30,58,0.06)' : 'transparent',
              borderLeft: `2px solid ${active === i ? '#C41E3A' : 'transparent'}`,
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const BlogPost = () => {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const pageRef   = useRef<HTMLDivElement>(null);

  const post    = POSTS.find(p => p.slug === slug) ?? POSTS[0];
  const content = ARTICLE_CONTENT[slug ?? ''] ?? FALLBACK_CONTENT;

  const hairline = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.post-hero', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' });
      gsap.from('.post-body', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 });
    }, pageRef);
    return () => ctx.revert();
  }, [slug]);

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <ReadingProgress />
      <Navbar />

      {/* Hero */}
      <div className="pt-28 md:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.035) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%,transparent 30%,hsl(var(--background)) 70%)' }} />

        <div className="post-hero relative max-w-[740px] mx-auto px-6 md:px-10 text-center">
          <button onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/35 hover:text-[#D4891A] transition-colors mb-8 group">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:-translate-x-1 transition-transform">
              <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to writing
          </button>

          {/* Tag + meta */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border"
              style={{ color: post.tagColor, borderColor: `${post.tagColor}30`, background: `${post.tagColor}10` }}>
              {post.tag}
            </span>
            <span className="font-mono text-[10px] text-foreground/30">{post.date}</span>
            <span className="font-mono text-[10px] text-foreground/30">·</span>
            <span className="font-mono text-[10px] text-foreground/30">{post.readTime}</span>
          </div>

          <h1 className="font-playfair font-black text-[clamp(28px,5vw,52px)] text-foreground leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          <p className="font-sans text-[15px] md:text-[17px] text-foreground/55 mt-4 leading-relaxed max-w-[560px] mx-auto">
            {post.excerpt}
          </p>

          {/* Author row */}
          <div className="flex items-center justify-center gap-3 mt-8 pt-8" style={{ borderTop: `1px solid ${hairline}` }}>
            <div className="w-9 h-9 rounded-full border-2 border-[#D4891A]/40 bg-[#D4891A]/10 flex items-center justify-center font-playfair font-bold text-[14px] text-[#D4891A]">
              G
            </div>
            <div className="text-left">
              <p className="font-jakarta font-semibold text-[13px] text-foreground">Gara Yaka</p>
              <p className="font-mono text-[10px] text-foreground/35 uppercase tracking-[0.08em]">Senior Software Engineer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 mb-16">
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ aspectRatio: '16/6', background: `linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(var(--muted)) 100%)` }}>
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(196,30,58,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,0.15) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <span className="font-mono text-[12px] text-foreground/20">[ Cover Image ]</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="post-body max-w-[1100px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 lg:gap-16 items-start">

          {/* TOC sidebar — desktop only */}
          <div className="hidden lg:block">
            <TOCSidebar toc={content.toc} />
          </div>

          {/* Prose */}
          <div className="max-w-[680px]">
            {content.sections.map((section, i) => (
              <div key={section.id} id={section.id} className="article-section mb-12 md:mb-16">
                <h2 className="font-playfair font-bold text-[clamp(20px,3vw,28px)] text-foreground leading-tight tracking-tight mb-5">
                  {section.heading}
                </h2>
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} className="font-sans text-[15px] md:text-[16px] leading-[1.85] text-foreground/65 mb-5">
                    {para}
                  </p>
                ))}
                {i < content.sections.length - 1 && (
                  <div className="mt-10 mb-1 h-px" style={{ background: hairline }} />
                )}
              </div>
            ))}

            {/* Share / nav */}
            <div className="pt-10 mt-10" style={{ borderTop: `1px solid ${hairline}` }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/30 mb-2">Share</p>
                  <div className="flex gap-2">
                    {['Twitter / X', 'LinkedIn', 'Copy link'].map(s => (
                      <button key={s}
                        className="font-mono text-[10px] px-3 py-1.5 rounded border border-border text-foreground/45 hover:text-foreground hover:border-foreground/25 transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => navigate('/blog')}
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#C41E3A] border border-[#C41E3A]/30 px-5 py-2.5 rounded hover:bg-[#C41E3A]/08 transition-all">
                  ← All articles
                </button>
              </div>
            </div>

            {/* More articles */}
            <div className="mt-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/30 mb-5">// More from the blog</p>
              <div className="space-y-3">
                {POSTS.filter(p => p.slug !== slug).slice(0, 2).map(p => (
                  <div key={p.slug}
                    className="rounded-lg border border-border bg-card p-4 elevation-card cursor-pointer hover:border-[#D4891A]/40 hover:-translate-y-[2px] transition-all duration-200 group"
                    onClick={() => { navigate(`/blog/${p.slug}`); window.scrollTo(0, 0); }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[8px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
                        style={{ color: p.tagColor, background: `${p.tagColor}12`, border: `1px solid ${p.tagColor}25` }}>
                        {p.tag}
                      </span>
                      <span className="font-mono text-[9px] text-foreground/30">{p.readTime}</span>
                    </div>
                    <h4 className="font-jakarta font-bold text-[14px] text-foreground tracking-tight leading-snug group-hover:text-[#D4891A] transition-colors">
                      {p.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;


