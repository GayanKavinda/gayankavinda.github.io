// src/features/home/components/Hero/Hero.tsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@app/providers/theme-provider';
import morningVideo from '@shared/assets/videos/demonSlayerInosuke-Morning.mp4';
import nightVideo from '@shared/assets/videos/demonSlayerInosuke-Night.mp4';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const morningVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [videosReady, setVideosReady] = useState({ morning: false, night: false });

  // ── Preload both videos on mount for instant switching ─────────
  useEffect(() => {
    const preloadVideo = (video: HTMLVideoElement | null, key: 'morning' | 'night') => {
      if (!video) return;
      video.load();
      video.onloadeddata = () => {
        setVideosReady(prev => ({ ...prev, [key]: true }));
        video.pause();
        video.currentTime = 0;
      };
      video.onerror = () => {
        console.warn(`Failed to preload ${key} video`);
        setVideosReady(prev => ({ ...prev, [key]: true })); // Fallback: proceed anyway
      };
    };
    preloadVideo(morningVideoRef.current, 'morning');
    preloadVideo(nightVideoRef.current, 'night');
  }, []);

  // ── Instant video crossfade on theme change ───────────────────
  useEffect(() => {
    const morning = morningVideoRef.current;
    const night = nightVideoRef.current;
    
    if (!morning || !night) return;

    const duration = 0.35;
    const ease = 'power2.inOut';

    if (theme === 'dark') {
      gsap.to(morning, { opacity: 0, duration, ease });
      gsap.to(night, { 
        opacity: 1, 
        duration, 
        ease, 
        onStart: () => { 
          night.play().catch(() => {}); 
        } 
      });
    } else {
      gsap.to(night, { opacity: 0, duration, ease });
      gsap.to(morning, { 
        opacity: 1, 
        duration, 
        ease, 
        onStart: () => { 
          morning.play().catch(() => {}); 
        } 
      });
    }
  }, [theme]);

  // ── Initialize animations when videos are ready ───────────────
  useEffect(() => {
    if (!videosReady.morning && !videosReady.night) return;

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, { opacity: 0, y: 20 });

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      timeline
        .to(contentRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0)
        .from('.hero-eyebrow', { y: 25, opacity: 0, duration: 0.7 }, 0.1)
        .from('.hero-name', { y: 35, opacity: 0, duration: 0.9, ease: 'power4.out' }, 0.25)
        .from('.hero-tagline', { y: 25, opacity: 0, duration: 0.8 }, 0.4)
        .from('.hero-description', { y: 20, opacity: 0, duration: 0.7 }, 0.55)
        .from('.hero-cta-group', { y: 15, opacity: 0, duration: 0.6 }, 0.7)
        .from('.hero-scroll-indicator', { opacity: 0, scale: 0.9, duration: 0.5 }, 0.9);

      // Subtle parallax on scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(contentRef.current, {
            y: self.progress * 60,
            opacity: 1 - self.progress * 0.25,
          });
        },
      });

      // Floating scroll indicator
      gsap.to('.hero-scroll-indicator svg', {
        y: 6,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [videosReady]);

  // ── Dynamic text styles for maximum contrast ──────────────────
  const textStyles = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      eyebrow: {
        color: isDark ? 'rgba(0, 212, 255, 0.95)' : 'rgba(26, 25, 28, 0.9)',
        textShadow: isDark 
          ? '0 2px 12px rgba(0, 0, 0, 0.4)' 
          : '0 2px 10px rgba(245, 245, 250, 0.6)',
      },
      name: {
        color: isDark ? '#ffffff' : '#171621',
        textShadow: isDark 
          ? '0 4px 24px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 92, 252, 0.25)' 
          : '0 3px 16px rgba(0, 0, 0, 0.15)',
      },
      tagline: {
        color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(23, 22, 33, 0.9)',
        textShadow: isDark 
          ? '0 2px 10px rgba(0, 0, 0, 0.5)' 
          : '0 2px 10px rgba(245, 245, 250, 0.8)',
      },
      taglineHighlight: {
        backgroundImage: isDark 
          ? 'linear-gradient(to right, #00D4FF 0%, #7C5CFC 50%, #00D4FF 100%)' 
          : 'linear-gradient(to right, #7C5CFC 0%, #FF007A 50%, #7C5CFC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        filter: isDark 
          ? 'drop-shadow(0 0 16px rgba(124, 92, 252, 0.5))' 
          : 'drop-shadow(0 4px 12px rgba(124, 92, 252, 0.25))',
      },
      description: {
        color: isDark ? 'rgba(238, 237, 248, 0.95)' : 'rgba(23, 22, 33, 0.92)',
        textShadow: isDark 
          ? '0 2px 10px rgba(0, 0, 0, 0.35)' 
          : '0 1px 6px rgba(245, 245, 250, 0.5)',
      },
      ctaPrimary: {
        background: isDark 
          ? 'linear-gradient(135deg, #7C5CFC, #5A3FD4)' 
          : 'linear-gradient(135deg, #7C5CFC, #00D4FF)',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
      },
      ctaSecondary: {
        borderColor: isDark ? 'rgba(238, 237, 248, 0.35)' : 'rgba(23, 22, 33, 0.25)',
        color: isDark ? 'rgba(238, 237, 248, 0.95)' : 'rgba(23, 22, 33, 0.9)',
        background: isDark 
          ? 'rgba(16, 16, 25, 0.45)' 
          : 'rgba(245, 245, 250, 0.55)',
        backdropFilter: 'blur(8px)',
      },
      scrollText: {
        color: isDark ? 'rgba(238, 237, 248, 0.7)' : 'rgba(23, 22, 33, 0.65)',
        textShadow: isDark ? '0 1px 6px rgba(0,0,0,0.4)' : '0 1px 4px rgba(255,255,255,0.6)',
      },
      scrollIcon: {
        stroke: isDark ? 'rgba(238, 237, 248, 0.75)' : 'rgba(23, 22, 33, 0.7)',
        filter: isDark ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 'none',
      },
      accent: {
        violet: isDark ? 'rgba(124, 92, 252, 0.6)' : 'rgba(124, 92, 252, 0.4)',
        cyan: isDark ? 'rgba(0, 212, 255, 0.6)' : 'rgba(0, 212, 255, 0.4)',
        glowViolet: isDark ? '0 0 12px rgba(124, 92, 252, 0.5)' : 'none',
        glowCyan: isDark ? '0 0 12px rgba(0, 212, 255, 0.5)' : 'none',
      }
    };
  }, [theme]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Dual Video Background — Instant Crossfade ─────────── */}
      <div className="absolute inset-0 -z-10">
        {/* Morning Video Layer */}
        <video
          ref={morningVideoRef}
          src={morningVideo}
          autoPlay={theme !== 'dark'}
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: theme === 'dark' ? 0 : 1 }}
          aria-hidden="true"
        />
        
        {/* Night Video Layer */}
        <video
          ref={nightVideoRef}
          src={nightVideo}
          autoPlay={theme === 'dark'}
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: theme === 'dark' ? 1 : 0 }}
          aria-hidden="true"
        />
        
        {/* Bottom Fade to blend seamlessly with the next section */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[35vh] pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, 
                transparent 0%, 
                ${theme === 'dark' ? 'rgba(9, 9, 16, 0.5)' : 'rgba(245, 245, 250, 0.5)'} 50%,
                ${theme === 'dark' ? '#090910' : '#F5F5FA'} 100%
              )
            `,
          }}
        />
      </div>

      {/* ── Centered Content — Proper Z-Index Layering ───────── */}
      <div 
        ref={contentRef}
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Eyebrow */}
        <p 
          className="hero-eyebrow font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em]"
          style={textStyles.eyebrow}
        >
          Senior Software Engineer
        </p>

        {/* Name */}
        <h1 
          className="hero-name font-jakarta font-extrabold leading-none mt-3 md:mt-4 
                     text-[clamp(48px,11vw,84px)] tracking-tight"
          style={textStyles.name}
        >
          Gara Yaka
        </h1>

        {/* Tagline */}
        <h2 
          className="hero-tagline font-jakarta font-semibold leading-none mt-3 md:mt-4 
                     text-[clamp(24px,6vw,42px)] tracking-tight"
          style={textStyles.tagline}
        >
          Building <em 
            className="italic font-normal gradient-animation" 
            style={{ 
              ...textStyles.taglineHighlight,
              fontFamily: "'Instrument Serif', serif", 
              paddingRight: '0.05em',
              display: 'inline-block'
            }}
          >systems that scale</em>.
        </h2>

        {/* Description */}
        <p 
          className="hero-description font-sans leading-relaxed mt-4 md:mt-5 
                     max-w-[520px] text-[15px] md:text-[17px]"
          style={textStyles.description}
        >
          Crafting distributed architectures and intuitive interfaces with precision. 
          Passionate about clean code, performance, and meaningful developer experiences.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-group flex flex-wrap justify-center gap-4 mt-7 md:mt-9">
          <button
            className="group relative font-mono text-[13px] md:text-[14px] 
                       text-white px-8 py-3.5 rounded-full overflow-hidden
                       transition-all duration-300 focus:outline-none focus:ring-2 
                       focus:ring-[#7C5CFC]/60 hover:shadow-lg"
            style={{
              ...textStyles.ctaPrimary,
              boxShadow: theme === 'dark' 
                ? '0 8px 32px rgba(124, 92, 252, 0.35)' 
                : '0 6px 24px rgba(124, 92, 252, 0.25)',
            }}
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            aria-label="View my projects"
          >
            <span className="relative z-10">Explore My Work</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#7C5CFC] 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button
            className="font-mono text-[13px] md:text-[14px] px-8 py-3.5 rounded-full 
                       backdrop-blur-md transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/40
                       hover:shadow-md"
            style={{
              ...textStyles.ctaSecondary,
              boxShadow: theme === 'dark'
                ? '0 4px 20px rgba(0, 0, 0, 0.25)'
                : '0 4px 16px rgba(0, 0, 0, 0.08)',
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
        <div className="hero-scroll-indicator absolute bottom-8 md:bottom-10 flex flex-col items-center gap-2">
          <span 
            className="font-mono text-[10px] uppercase tracking-wider"
            style={textStyles.scrollText}
          >
            Scroll
          </span>
          <svg 
            width="24" height="24" viewBox="0 0 24 24" 
            fill="none" 
            style={textStyles.scrollIcon}
            aria-hidden="true"
          >
            <path 
              d="M12 5v14M5 12l7 7 7-7" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── Minimal Decorative Accents ───────────────────────── */}
      <div 
        className="absolute top-6 left-6 w-1 h-1 rounded-full z-10 animate-hero-pulse"
        style={{ 
          background: textStyles.accent.violet,
          boxShadow: textStyles.accent.glowViolet,
        }} 
      />
      <div 
        className="absolute top-6 right-6 w-1 h-1 rounded-full z-10 animate-pulse"
        style={{ 
          background: textStyles.accent.cyan,
          boxShadow: textStyles.accent.glowCyan,
          animationDelay: '0.5s'
        }} 
      />
    </section>
  );
};

export default Hero;