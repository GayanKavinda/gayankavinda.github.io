// src/features/home/components/Hero.tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@app/providers/theme-provider';
import morningVideo from '@shared/assets/videos/demonSlayerInosuke-Morning.mp4';
import nightVideo from '@shared/assets/videos/demonSlayerInosuke-Night.mp4';

gsap.registerPlugin(ScrollTrigger);

// ── Per-character split for stagger animation ─────────────────────────────
const SplitChars = ({ text, className = '' }: { text: string; className?: string }) => (
  <>
    {text.split('').map((char, i) => (
      <span
        key={i}
        className={`hero-char inline-block ${className}`}
        aria-hidden="true"
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </>
);

// ── Anime-style angular clip path for buttons ─────────────────────────────
// ── Anime-style corner-cut clip path for buttons ─────────────────────────────
const CLIP_BTN = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const morningVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [videosReady, setVideosReady] = useState({ morning: false, night: false });

  // ── Video Playback Management ──────────────────────────────────────────
  useEffect(() => {
    const morning = morningVideoRef.current;
    const night = nightVideoRef.current;
    if (!morning || !night) return;

    const handlePlay = async (vid: HTMLVideoElement) => {
      try {
        if (vid.paused) {
          await vid.play();
        }
      } catch (err) {
        console.warn("Video playback was interrupted or blocked:", err);
      }
    };

    if (theme === 'dark') {
      morning.pause();
      handlePlay(night);
      gsap.to(morning, { opacity: 0, duration: 0.8 });
      gsap.to(night, { opacity: 1, duration: 0.8 });
    } else {
      night.pause();
      handlePlay(morning);
      gsap.to(night, { opacity: 0, duration: 0.8 });
      gsap.to(morning, { opacity: 1, duration: 0.8 });
    }
  }, [theme, videosReady]);

  // Preload status for entrance animation
  useEffect(() => {
    const checkReady = () => {
      const m = morningVideoRef.current;
      const n = nightVideoRef.current;
      if (m?.readyState >= 3 && n?.readyState >= 3) {
        setVideosReady({ morning: true, night: true });
      }
    };

    const m = morningVideoRef.current;
    const n = nightVideoRef.current;
    if (m && n) {
      m.addEventListener('canplay', checkReady);
      n.addEventListener('canplay', checkReady);
      if (m.readyState >= 3 && n.readyState >= 3) checkReady();
    }

    return () => {
      m?.removeEventListener('canplay', checkReady);
      n?.removeEventListener('canplay', checkReady);
    };
  }, []);

  // ── Entrance + scroll animations ───────────────────────────────────────
  useEffect(() => {
    if (!videosReady.morning && !videosReady.night) return;

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .to(contentRef.current, { opacity: 1, duration: 0.05 }, 0)
        .from('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.6 }, 0.1)
        .from('.hero-rule', { scaleX: 0, duration: 0.8, transformOrigin: 'center', ease: 'expo.out' }, 0.25)
        .from('.hero-char', {
          y: 70, opacity: 0, rotateX: -40, duration: 0.85,
          stagger: 0.025, ease: 'expo.out'
        }, 0.35)
        .from('.hero-tagline', { y: 18, opacity: 0, duration: 0.65 }, 0.85)
        .from('.hero-description', { y: 12, opacity: 0, duration: 0.55 }, 1.0)
        .from('.hero-cta-group', { y: 12, opacity: 0, duration: 0.55 }, 1.1)
        .from('.hero-scroll-indicator', { opacity: 0, duration: 0.45 }, 1.3)
        .from('.hero-meta', { opacity: 0, duration: 0.4 }, 1.35);

      // Scroll parallax
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(contentRef.current, {
            y: self.progress * 60,
            opacity: 1 - self.progress * 0.3,
          });
        },
      });

      // Floating scroll arrow
      gsap.to('.hero-scroll-indicator svg', {
        y: 5, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [videosReady]);

  // ── Theme tokens ───────────────────────────────────────────────────────
  const isDark = theme === 'dark';

  const c = useMemo(() => ({
    botFade: isDark ? '#090910' : '#F5F5FA',
    rule: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
    meta: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.16)',
    name: isDark ? '#FFFFFF' : '#ffffffff', // Deep Crimson — Red Vibe for name only
    eyebrow: isDark ? 'rgba(0,212,255,0.85)' : 'rgba(124,92,252,0.75)',
    tagline: isDark ? 'rgba(238,237,248,0.92)' : 'rgba(19,25,33,0.85)',
    desc: isDark ? 'rgba(200,198,220,0.80)' : 'rgba(45,55,72,0.75)',
    scroll: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.24)',
    nameGlow: isDark ? 'none' : '0.5px 0.5px 0px rgba(255,255,255,0.15)',
    gradText: isDark
      ? 'linear-gradient(95deg, #00D4FF 0%, #A78BFA 50%, #FF6B9D 100%)'
      : 'linear-gradient(95deg, #7C5CFC 0%, #5B21B6 50%, #DB2777 100%)',
    btnPrimary: isDark
      ? 'linear-gradient(135deg, #7C5CFC 0%, #00D4FF 100%)'
      : 'linear-gradient(135deg, #6B4EF0 0%, #00B8D9 100%)',
    btnPrimaryGlow: 'none',
    btnSecBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    btnSecText: isDark ? 'rgba(238,237,248,0.88)' : 'rgba(19,25,33,0.82)',
    btnSecBg: 'transparent',
    vidFilter: isDark ? 'none' : 'brightness(0.92) contrast(1.05)',
  }), [theme, isDark]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Video Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 bg-black">
        <video
          ref={morningVideoRef}
          src={morningVideo}
          loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: isDark ? 0 : 1, filter: c.vidFilter }}
          aria-hidden="true"
        />
        <video
          ref={nightVideoRef}
          src={nightVideo}
          loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: isDark ? 1 : 0, filter: c.vidFilter }}
          aria-hidden="true"
        />

        {/* Bottom fade only — small and clean */}
        <div
          className="absolute inset-x-0 bottom-0 h-[15vh] pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${c.botFade} 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* ── Bottom Metadata ───────────────────────────────────────── */}
      <p
        className="hero-meta absolute bottom-5 left-6 z-20 font-mono text-[9px] uppercase tracking-[0.2em] pointer-events-none"
        style={{ color: c.meta }}
      >
        Portfolio · 2026
      </p>
      <p
        className="hero-meta absolute bottom-5 right-6 z-20 font-mono text-[9px] uppercase tracking-[0.2em] pointer-events-none"
        style={{ color: c.meta }}
      >
        GK ©
      </p>

      {/* ── Centered Content — pushed down more to clear navbar decisive ── */}
      <div
        ref={contentRef}
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ paddingTop: '64px' }}
      >
        {/* Eyebrow — Audiowide (anime tech font) */}
        <p
          className="hero-eyebrow uppercase tracking-[0.3em] mb-4"
          style={{
            fontFamily: "'Audiowide', sans-serif",
            fontSize: 'clamp(9px, 1.1vw, 12px)',
            color: c.eyebrow,
          }}
        >
          Software Engineer
        </p>

        {/* Top Rule */}
        <div
          className="hero-rule h-px mb-5"
          style={{
            width: 'min(320px, 50vw)',
            background: `linear-gradient(to right, transparent, ${c.rule} 25%, ${c.rule} 75%, transparent)`,
          }}
        />

        {/* ── Name — Winner Sans (Professional bold geometric) ── */}
        <h1
          className="select-none uppercase font-winner"
          style={{
            fontSize: 'clamp(44px, 9.5vw, 92px)',
            lineHeight: 0.9,
            color: c.name,
            letterSpacing: '0.04em',
            textShadow: c.nameGlow,
            perspective: '600px',
            fontWeight: 700,
          }}
          aria-label="Gayan Kavinda"
        >
          <span className="block"><SplitChars text="GAYAN" /></span>
          <span className="block mt-1"><SplitChars text="KAVINDA" /></span>
        </h1>

        {/* Bottom Rule */}
        <div
          className="hero-rule h-px mt-5 mb-4"
          style={{
            width: 'min(320px, 50vw)',
            background: `linear-gradient(to right, transparent, ${c.rule} 25%, ${c.rule} 75%, transparent)`,
          }}
        />

        {/* Tagline — Syne */}
        <h2
          className="hero-tagline font-syne font-semibold leading-snug"
          style={{
            fontSize: 'clamp(15px, 2.6vw, 24px)',
            color: c.tagline,
            letterSpacing: '-0.005em',
          }}
        >
          Architecting{' '}
          <em
            className="not-italic"
            style={{
              backgroundImage: c.gradText,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            systems that scale
          </em>
        </h2>

        {/* Description */}
        <p
          className="hero-description font-sans leading-relaxed mt-3 max-w-[440px]"
          style={{ fontSize: 'clamp(12px, 1.3vw, 14px)', color: c.desc }}
        >
          Crafting distributed architectures and intuitive interfaces with precision.
          Passionate about clean code, performance, and meaningful developer experiences.
        </p>

        {/* ── CTA Buttons — Anime angular clip-path ── */}
        <div className="hero-cta-group flex flex-wrap justify-center gap-3 mt-7">
          {/* Primary — angular shape */}
          <button
            className="group relative overflow-hidden text-white transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50"
            style={{
              fontFamily: "'Audiowide', sans-serif",
              fontSize: 'clamp(10px, 1vw, 12px)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '12px 36px',
              background: c.btnPrimary,
              boxShadow: c.btnPrimaryGlow,
              clipPath: CLIP_BTN,
            }}
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            aria-label="View my projects"
          >
            <span className="relative z-10">Explore Work</span>
            <span
              className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ clipPath: CLIP_BTN }}
            />
          </button>

          {/* Secondary — angular outline — no blur/mask */}
          <button
            className="transition-all duration-300 focus:outline-none focus:ring-2
                       focus:ring-white/20 hover:shadow-md"
            style={{
              fontFamily: "'Audiowide', sans-serif",
              fontSize: 'clamp(10px, 1vw, 12px)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '12px 36px',
              border: `1.5px solid ${c.btnSecBorder}`,
              color: c.btnSecText,
              background: c.btnSecBg,
              clipPath: CLIP_BTN,
            }}
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            aria-label="Contact me"
          >
            Let's Connect
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator absolute bottom-8 flex flex-col items-center gap-[5px]">
          <span
            className="font-mono text-[8px] uppercase tracking-[0.24em]"
            style={{ color: c.scroll }}
          >
            Scroll
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2v12M2 8l6 6 6-6"
              stroke={c.scroll}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;