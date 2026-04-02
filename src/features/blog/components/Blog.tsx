// src/components/sections/Blog.tsx
// Blog preview section — matches Gara Yaka design DNA exactly.
// Crimson #C41E3A · Gold #D4891A · Playfair headings · DM Mono labels
// GSAP ScrollTrigger stagger reveals · full dark/light theme

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { POSTS } from '@features/blog/data/blog';

// ── Tag badge ─────────────────────────────────────────────────────────────────
const TagBadge = ({ tag, color }: { tag: string; color: string }) => (
  <span
    className="font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border"
    style={{ color, borderColor: `${color}30`, background: `${color}10` }}
  >
    {tag}
  </span>
);

// ── Blog component ────────────────────────────────────────────────────────────
const Blog = () => {
  const ref      = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.blog-card', {
        y: 28, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const [featured, ...rest] = POSTS;

  return (
    <section id="blog" ref={ref} className="py-[80px] md:py-[100px] relative overflow-hidden bg-background">
      {/* Subtle gradient texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(196,30,58,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Writing</p>
            <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
              From the{' '}
              <em className="font-playfair italic font-medium text-[#C41E3A]">Trenches</em>
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4891A]" />
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
            </div>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#C41E3A] border border-[#C41E3A]/30 px-5 py-2.5 rounded hover:bg-[#C41E3A]/08 transition-all flex-shrink-0"
          >
            All posts →
          </button>
        </div>

        {/* Grid — featured large + 3 smaller */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

          {/* Featured */}
          <div
            className="blog-card elevation-card group rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:border-[#C41E3A]/40 hover:-translate-y-[2px] transition-all duration-300"
            onClick={() => navigate(`/blog/${featured.slug}`)}
          >
            {/* Thumb */}
            <div className="h-[200px] md:h-[260px] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(var(--muted)) 100%)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(196,30,58,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,0.15) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#C41E3A] group-hover:w-full transition-all duration-500" />
              <div className="w-full h-full flex items-center justify-center font-mono text-[12px] text-foreground/20">
                [ Cover Image ]
              </div>
              {/* Featured badge */}
              <div className="absolute top-4 left-4 font-mono text-[8px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#C41E3A] text-white">
                Featured
              </div>
            </div>
            <div className="p-6 md:p-7">
              <div className="flex items-center gap-2 mb-3">
                <TagBadge tag={featured.tag} color={featured.tagColor} />
                <span className="font-mono text-[9px] text-foreground/30">{featured.date}</span>
                <span className="font-mono text-[9px] text-foreground/30">·</span>
                <span className="font-mono text-[9px] text-foreground/30">{featured.readTime}</span>
              </div>
              <h3 className="font-jakarta font-bold text-[20px] md:text-[22px] text-foreground tracking-tight leading-snug group-hover:text-[#C41E3A] transition-colors">
                {featured.title}
              </h3>
              <p className="font-sans text-[14px] text-foreground/55 mt-2.5 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-1.5 mt-4 font-mono text-[11px] text-[#D4891A] group-hover:gap-3 transition-all">
                Read article
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 6h8M7 3l3 3-3 3"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right column — 3 smaller */}
          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((post) => (
              <div
                key={post.slug}
                className="blog-card elevation-card group rounded-xl border border-border bg-card p-5 cursor-pointer hover:border-[#D4891A]/40 hover:-translate-y-[2px] transition-all duration-300 relative overflow-hidden"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {/* Left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4891A] to-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-2 mb-2.5">
                  <TagBadge tag={post.tag} color={post.tagColor} />
                  <span className="font-mono text-[9px] text-foreground/30">{post.date}</span>
                  <span className="ml-auto font-mono text-[9px] text-foreground/25">{post.readTime}</span>
                </div>
                <h3 className="font-jakarta font-bold text-[15px] text-foreground leading-snug tracking-tight group-hover:text-[#D4891A] transition-colors">
                  {post.title}
                </h3>
                <p className="font-sans text-[12px] text-foreground/45 mt-1.5 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter nudge */}
        <div className="mt-8 elevation-card rounded-xl border border-border bg-card p-5 md:p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#D4891A] mb-1">// Subscribe</p>
            <p className="font-jakarta font-semibold text-[15px] text-foreground">
              Engineering articles, shipped once a month. No fluff.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-mono text-[11px] uppercase tracking-[0.1em] bg-[#C41E3A] text-white px-6 py-2.5 rounded hover:brightness-110 transition-all flex-shrink-0"
          >
            Get notified →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;


