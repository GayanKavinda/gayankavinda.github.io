import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import lightHeroImg from '@assets/images/hero/whitemode_2.jpeg';
import darkHeroImg from '@assets/images/hero/darkmode.png';
import Magnetic from '@components/animations/Magnetic';

// ── Per-character split ───────────────────────────────────────────────────────
const MotionSplitChars = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: '110%', opacity: 0, rotateX: -90, filter: 'blur(4px)' }}
        animate={{ y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: delay + i * 0.035, ease: [0.215, 0.61, 0.355, 1] }}
        className="inline-block"
        style={{ transformOrigin: 'bottom' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </>
);

// ── Floating Orb (atmospheric particle) ──────────────────────────────────────
const FloatingOrb = ({
  x, y, size, color, delay, duration,
}: { x: string; y: string; size: number; color: string; delay: number; duration: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(1px)' }}
    animate={{ y: [0, -20, 0], opacity: [0.15, 0.55, 0.15], scale: [1, 1.3, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ── Glitch text effect ────────────────────────────────────────────────────────
const GlitchEyebrow = ({ text, color }: { text: string; color: string }) => (
  <div className="relative select-none" style={{ fontFamily: "'Audiowide', sans-serif" }}>
    <motion.span
      style={{ color, fontSize: 'clamp(9px, 1.1vw, 12px)', letterSpacing: '0.3em', textTransform: 'uppercase' }}
      animate={{ opacity: [1, 0.85, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {text}
    </motion.span>
    {/* Glitch clone */}
    <motion.span
      className="absolute inset-0 overflow-hidden"
      style={{ color: '#00D4FF', fontSize: 'clamp(9px, 1.1vw, 12px)', letterSpacing: '0.3em', textTransform: 'uppercase', clipPath: 'inset(30% 0 50% 0)' }}
      animate={{ x: [0, -3, 3, 0], opacity: [0, 0.5, 0] }}
      transition={{ duration: 0.15, delay: 4, repeat: Infinity, repeatDelay: 6 }}
    >
      {text}
    </motion.span>
  </div>
);

// ── Anime clip path ───────────────────────────────────────────────────────────
const CLIP_BTN = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';

// ── Scroll indicator ──────────────────────────────────────────────────────────
const ScrollIndicator = ({ color }: { color: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 2.2 }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
  >
    <span style={{ fontFamily: "'Audiowide', sans-serif", fontSize: 8, letterSpacing: '0.35em', color, textTransform: 'uppercase' }}>
      Scroll
    </span>
    {/* Orb-trail scroll indicator */}
    <div className="relative w-4 h-10 flex justify-center">
      <div className="absolute inset-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-current to-transparent" style={{ color }} />
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full"
          style={{ background: '#7C5CFC', left: 'calc(50% - 1.5px)' }}
          animate={{ y: [0, 36], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </motion.div>
);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const c = useMemo(() => ({
    eyebrow: isDark ? '#00D4FF' : '#7C5CFC',
    name: isDark ? '#FFFFFF' : '#1A1A1A',
    nameGlow: isDark ? '0 0 40px rgba(0,212,255,0.25), 0 0 80px rgba(124,92,252,0.15)' : 'none',
    tagline: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(10,10,10,0.90)',
    gradText: isDark
      ? 'linear-gradient(90deg, #00D4FF 0%, #7C5CFC 100%)'
      : 'linear-gradient(90deg, #7C5CFC 0%, #00D4FF 100%)',
    desc: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(30,30,30,0.65)',
    scroll: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)',
    btnPrimary: isDark
      ? 'linear-gradient(135deg, #7C5CFC 0%, #00D4FF 100%)'
      : 'linear-gradient(135deg, #6B4EF0 0%, #00B8D9 100%)',
    btnSecBorder: isDark ? 'rgba(0,212,255,0.3)' : 'rgba(124,92,252,0.25)',
    btnSecText: isDark ? '#FFFFFF' : '#1A1A1A',
    rule: isDark ? 'rgba(0,212,255,0.25)' : 'rgba(124,92,252,0.20)',
    vidFilter: isDark ? 'none' : 'brightness(0.95) contrast(1.05)',
    ruleGrad: isDark
      ? 'linear-gradient(to right, transparent, rgba(0,212,255,0.3), rgba(124,92,252,0.2), transparent)'
      : 'linear-gradient(to left, rgba(124,92,252,0.3), transparent)',
  }), [isDark]);

  // Floating orbs data — positioned to match cosmic image theme
  const orbs = useMemo(() => isDark ? [
    { x: '62%', y: '15%', size: 6, color: 'rgba(0,212,255,0.9)', delay: 0, duration: 4.5 },
    { x: '72%', y: '35%', size: 4, color: 'rgba(124,92,252,0.9)', delay: 1, duration: 5.5 },
    { x: '80%', y: '55%', size: 5, color: 'rgba(0,212,255,0.7)', delay: 0.5, duration: 6 },
    { x: '68%', y: '70%', size: 3, color: 'rgba(255,255,255,0.8)', delay: 2, duration: 4 },
    { x: '88%', y: '25%', size: 4, color: 'rgba(124,92,252,0.8)', delay: 1.5, duration: 5 },
    { x: '76%', y: '80%', size: 3, color: 'rgba(0,212,255,0.6)', delay: 3, duration: 7 },
    { x: '92%', y: '60%', size: 5, color: 'rgba(255,255,255,0.5)', delay: 0.8, duration: 5.5 },
  ] : [], [isDark]);

  return (
    <section
      ref={heroRef}
      className="relative h-[100dvh] w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background Image ────────────────────────────────────────────────── */}
      <motion.div style={{ y: bgY, willChange: 'transform' }} className="absolute inset-0 -z-10 bg-black">
        <img
          src={lightHeroImg} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] sm:object-center transition-opacity duration-1000"
          style={{ opacity: isDark ? 0 : 1, filter: c.vidFilter }}
        />
        <img
          src={darkHeroImg} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] sm:object-center transition-opacity duration-1000"
          style={{ opacity: isDark ? 1 : 0, filter: c.vidFilter }}
        />
        {/* Depth vignette — pulls focus to content */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 65% 100% at 75% 50%, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)'
              : 'radial-gradient(ellipse 65% 100% at 75% 50%, transparent 0%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0.2) 100%)',
          }}
        />
      </motion.div>

      {/* ── Floating orbs ────────────────────────────────────────────────────── */}
      {orbs.map((orb, i) => <FloatingOrb key={i} {...orb} />)}

      {/* ── Bottom fade ──────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[15vh] pointer-events-none"
        style={{
          background: `linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)`,
          zIndex: 50,
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }}
        className="relative z-20 h-full flex flex-col items-center sm:items-end justify-center px-6 sm:pr-[clamp(24px,8vw,120px)] sm:pl-6 text-center sm:text-right"
      >
        {/* Eyebrow with glitch */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 mb-4"
        >
          <GlitchEyebrow text="Software Engineer" color={c.eyebrow} />
        </motion.div>

        {/* Top rule — animated shimmer */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] mb-6 sm:origin-right overflow-hidden"
          style={{ width: 'clamp(100px, 20vw, 400px)' }}
        >
          <motion.div
            className="h-full w-full"
            style={{ background: c.ruleGrad }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Name block */}
        <div className="relative">
          <h1
            className="select-none uppercase font-winner overflow-hidden"
            style={{
              fontSize: 'clamp(44px, 9.5vw, 96px)',
              lineHeight: 0.88,
              color: c.name,
              letterSpacing: '0.05em',
              textShadow: c.nameGlow,
              perspective: '600px',
              fontWeight: 700,
            }}
            aria-label="Gayan Kavinda"
          >
            <span className="block"><MotionSplitChars text="GAYAN" delay={0.6} /></span>
            <span className="block mt-1"><MotionSplitChars text="KAVINDA" delay={0.82} /></span>
          </h1>
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] mt-5 mb-5 sm:origin-right"
          style={{ width: 'clamp(120px, 25vw, 500px)', background: c.ruleGrad }}
        />

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="font-syne font-semibold leading-snug"
          style={{ fontSize: 'clamp(15px, 2.6vw, 26px)', color: c.tagline, letterSpacing: '-0.01em' }}
        >
          Architecting{' '}
          <em
            className="not-italic"
            style={{ backgroundImage: c.gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            systems that scale
          </em>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="font-sans leading-relaxed mt-3 max-w-[440px]"
          style={{ fontSize: 'clamp(12px, 1.35vw, 14px)', color: c.desc, textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.6)' : 'none' }}
        >
          Distributed systems architect. Premium digital experiences. Precision
          engineering fused with clean, scalable architecture.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            <Magnetic strength={0.15}>
              <button
                className="group relative overflow-hidden text-white focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50"
                style={{
                  fontFamily: "'Audiowide', sans-serif",
                  fontSize: 'clamp(10px, 1vw, 11px)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '13px 38px',
                  background: c.btnPrimary,
                  clipPath: CLIP_BTN,
                  boxShadow: isDark ? '0 0 30px rgba(124,92,252,0.3), 0 0 60px rgba(0,212,255,0.1)' : 'none',
                  transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10">Explore Work</span>
                <motion.span
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </button>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <Magnetic strength={0.15}>
              <button
                className="group relative focus:outline-none focus:ring-2 focus:ring-white/20"
                style={{
                  fontFamily: "'Audiowide', sans-serif",
                  fontSize: 'clamp(10px, 1vw, 11px)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '13px 38px',
                  border: `1.5px solid ${c.btnSecBorder}`,
                  color: c.btnSecText,
                  background: 'transparent',
                  clipPath: CLIP_BTN,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = c.eyebrow)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = c.btnSecBorder)}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Let's Connect
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator color={c.scroll} />
      </motion.div>
    </section>
  );
};

export default Hero;