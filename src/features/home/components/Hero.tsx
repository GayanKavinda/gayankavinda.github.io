import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import Magnetic from '@components/animations/Magnetic';
import nightHeroImg from '@assets/images/hero/midnight.png';
import camperImg from '@assets/images/hero/person_camping_area.png';

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

// ── Realistic Firefly particle ────────────────────────────────────────────────
const Firefly = ({
  x, y, size, color, delay, duration, drift = 20,
}: { x: string; y: string; size: number; color: string; delay: number; duration: number; drift?: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none mix-blend-screen"
    style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(1.5px)' }}
    animate={{ 
      y: [0, -drift, 4, -drift * 0.6, 0], 
      x: [0, drift * 0.5, -drift * 0.3, drift * 0.4, 0],
      opacity: [0.1, 0.9, 0.3, 0.85, 0.1], 
      scale: [1, 1.6, 0.9, 1.4, 1] 
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ── Realistic Lantern Glow with flicker ───────────────────────────────────────
const LanternGlow = ({ x, y, scale = 1 }: { x: string; y: string; scale?: number }) => {
  const flicker = useMemo(() => ({
    opacity: [0.4, 0.75, 0.55, 0.9, 0.5, 0.8, 0.45],
    scale: [1, 1.08, 0.97, 1.12, 1, 1.06, 0.98],
  }), []);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ 
        left: x, 
        top: y, 
        width: 120 * scale, 
        height: 120 * scale, 
        transform: 'translate(-50%, -50%)',
      }}
      animate={flicker}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 1] }}
    >
      {/* Core intense glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,80,0.5) 0%, rgba(255,140,40,0.2) 30%, transparent 60%)',
          filter: 'blur(4px)',
        }}
      />
      {/* Outer bloom */}
      <div 
        className="absolute inset-[-50%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,160,60,0.25) 0%, rgba(255,120,30,0.08) 40%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />
      {/* Warm haze */}
      <div 
        className="absolute inset-[-100%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,50,0.12) 0%, transparent 50%)',
          filter: 'blur(24px)',
        }}
      />
    </motion.div>
  );
};

// ── Light ray from lantern ────────────────────────────────────────────────────
const LightRay = ({ x, y, rotation, width = 60, delay = 0 }: { x: string; y: string; rotation: number; width?: number; delay?: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ 
      left: x, 
      top: y, 
      width, 
      height: 180,
      transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
      transformOrigin: 'bottom center',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0.06, 0.14, 0.08, 0.12, 0.06] }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div 
      className="w-full h-full"
      style={{
        background: 'linear-gradient(to top, rgba(255,180,80,0.3) 0%, rgba(255,160,60,0.1) 30%, transparent 100%)',
        filter: 'blur(8px)',
        clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
      }}
    />
  </motion.div>
);

// ── Ambient dust mote ─────────────────────────────────────────────────────────
const DustMote = ({ x, y, delay, duration }: { x: string; y: string; delay: number; duration: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ 
      left: x, 
      top: y, 
      width: 2, 
      height: 2, 
      background: 'rgba(255,200,120,0.5)',
      filter: 'blur(0.5px)',
    }}
    animate={{ 
      y: [0, -30, 10, -20, 0],
      x: [0, 15, -10, 8, 0],
      opacity: [0, 0.7, 0.3, 0.6, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const CLIP_BTN = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax: background slowest, camper mid, content fastest
  const bgY = useTransform(smoothProgress, [0, 1], [0, 140]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.06]);
  const camperY = useTransform(smoothProgress, [0, 1], [0, 50]);
  const camperScale = useTransform(smoothProgress, [0, 1], [1, 1.02]);
  const contentY = useTransform(smoothProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);

  const c = useMemo(() => ({
    eyebrow: '#00D4FF',
    name: '#FFFFFF',
    nameGlow: '0 0 40px rgba(0,212,255,0.25), 0 0 80px rgba(124,92,252,0.15)',
    tagline: 'rgba(255,255,255,0.95)',
    desc: 'rgba(255,255,255,0.65)',
    scroll: 'rgba(255,255,255,0.35)',
    btnPrimary: 'linear-gradient(135deg, #7C5CFC 0%, #00D4FF 100%)',
    btnSecBorder: 'rgba(0,212,255,0.3)',
    btnSecText: '#FFFFFF',
  }), []);

  // Fireflies near the lantern
  const fireflies = useMemo(() => [
    { x: '7%', y: '76%', size: 5, color: 'rgba(255,180,80,0.9)', delay: 0, duration: 4, drift: 25 },
    { x: '11%', y: '80%', size: 3, color: 'rgba(255,210,120,0.8)', delay: 0.8, duration: 5, drift: 18 },
    { x: '5%', y: '74%', size: 4, color: 'rgba(0,212,255,0.6)', delay: 1.5, duration: 6, drift: 22 },
    { x: '14%', y: '78%', size: 3, color: 'rgba(124,92,252,0.7)', delay: 2.2, duration: 4.5, drift: 15 },
    { x: '9%', y: '83%', size: 2, color: 'rgba(255,255,255,0.5)', delay: 3, duration: 5, drift: 20 },
    { x: '17%', y: '75%', size: 4, color: 'rgba(0,212,255,0.4)', delay: 1, duration: 7, drift: 28 },
    { x: '20%', y: '86%', size: 3, color: 'rgba(255,180,80,0.6)', delay: 2.5, duration: 5.5, drift: 16 },
    { x: '3%', y: '79%', size: 2, color: 'rgba(255,200,100,0.7)', delay: 1.8, duration: 4.2, drift: 12 },
    { x: '16%', y: '82%', size: 3, color: 'rgba(255,160,60,0.8)', delay: 3.5, duration: 6.5, drift: 24 },
  ], []);

  // Dust motes in lantern light
  const dustMotes = useMemo(() => [
    { x: '6%', y: '78%', delay: 0, duration: 8 },
    { x: '10%', y: '75%', delay: 1.2, duration: 7 },
    { x: '8%', y: '81%', delay: 2.5, duration: 9 },
    { x: '12%', y: '77%', delay: 0.8, duration: 6 },
    { x: '4%', y: '80%', delay: 3, duration: 8.5 },
    { x: '14%', y: '83%', delay: 1.8, duration: 7.5 },
  ], []);

  return (
    <section
      ref={heroRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-black"
      aria-label="Hero section"
    >
      {/* ═══════════════════════════════════════════════════════════
          LAYER 1: Cosmic Background
          ═══════════════════════════════════════════════════════════ */}
      <motion.div 
        className="absolute inset-0 -z-30"
        style={{ y: bgY, scale: bgScale, willChange: 'transform' }}
      >
        <motion.img
          src={nightHeroImg}
          alt="Cosmic night sky"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.7) saturate(1.1)' }}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          loading="eager"
        />
        {/* Vignette — pulls focus to center-left */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 65% 100% at 25% 60%, transparent 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)',
          }}
        />
        {/* Night darkness overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          LAYER 2: Camper Foreground (transparent PNG)
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-0 left-0 z-10 pointer-events-none"
        style={{ y: camperY, scale: camperScale, willChange: 'transform' }}
        initial={{ y: 100, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Breathing float */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={camperImg}
            alt="Camper overlooking the horizon"
            className="w-[58vw] max-w-[750px] min-w-[300px] h-auto object-contain object-bottom"
            style={{ 
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(0,0,0,0.4)) brightness(0.85)',
            }}
            loading="eager"
          />
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          LAYER 3: Atmospheric Effects
          ═══════════════════════════════════════════════════════════ */}
      {/* Dark overlay on campsite area for night realism */}
      <div
        className="absolute bottom-0 left-0 w-[60vw] h-[55vh] pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(ellipse at 15% 90%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
          maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[45vw] h-[40vh] pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
        }}
      />

      {/* Realistic lantern warm glow — blends with cosmic sky */}
      <LanternGlow x="8%" y="82%" scale={1.2} />
      <LanternGlow x="12%" y="85%" scale={0.9} />
      <LanternGlow x="6%" y="88%" scale={0.7} />

      {/* Light rays emanating from lanterns */}
      <LightRay x="8%" y="82%" rotation={-25} width={80} delay={0} />
      <LightRay x="8%" y="82%" rotation={-10} width={60} delay={1.5} />
      <LightRay x="12%" y="85%" rotation={-35} width={50} delay={0.8} />
      <LightRay x="6%" y="88%" rotation={-15} width={40} delay={2} />

      {/* Warm ambient ground reflection */}
      <motion.div
        className="absolute pointer-events-none z-[6]"
        style={{ 
          left: '2%', 
          bottom: '5%', 
          width: '25vw', 
          height: '15vh',
          background: 'radial-gradient(ellipse at center, rgba(255,160,60,0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {fireflies.map((fly, i) => (
        <Firefly key={i} {...fly} />
      ))}

      {dustMotes.map((mote, i) => (
        <DustMote key={`dust-${i}`} {...mote} />
      ))}

      {/* Subtle nebula dust near camper */}
      <div 
        className="absolute bottom-0 left-0 w-[40vw] h-[40vh] pointer-events-none z-0 mix-blend-screen opacity-25"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(124,92,252,0.12) 0%, transparent 60%)',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          LAYER 4: Content (right-aligned)
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, willChange: 'transform, opacity' }}
        className="relative z-20 h-full flex flex-col items-end justify-center pr-6 sm:pr-12 md:pr-20 lg:pr-28 xl:pr-36 text-right"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <span 
            className="uppercase tracking-[0.3em]"
            style={{ 
              fontFamily: "'Audiowide', sans-serif", 
              fontSize: 'clamp(9px, 1vw, 11px)', 
              color: c.eyebrow,
              textShadow: '0 0 20px rgba(0,212,255,0.4)',
            }}
          >
            Senior Systems Architect
          </span>
        </motion.div>

        {/* Name */}
        <div className="relative overflow-hidden">
          <h1
            className="select-none uppercase font-winner"
            style={{
              fontSize: 'clamp(32px, 7vw, 80px)',
              lineHeight: 0.9,
              color: c.name,
              letterSpacing: '0.04em',
              perspective: '600px',
              fontWeight: 700,
            }}
            aria-label="Gayan Kavinda"
          >
            <span className="block overflow-hidden">
              <MotionSplitChars text="GAYAN" delay={0.7} />
            </span>
            <span className="block overflow-hidden mt-1">
              <MotionSplitChars text="KAVINDA" delay={0.92} />
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne font-semibold leading-snug mt-4 max-w-[440px]"
          style={{ fontSize: 'clamp(14px, 2vw, 22px)', color: c.tagline, letterSpacing: '-0.01em' }}
        >
          Architecting systems that scale beyond the horizon
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans leading-relaxed mt-4 max-w-[440px]"
          style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', color: c.desc }}
        >
          I design and operate high‑performance distributed systems that power global‑scale products — combining cloud‑native architecture, observability‑first thinking, and clean, scalable code.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-4 mt-8 w-full sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <Magnetic strength={0.15}>
              <button
                className="group relative overflow-hidden text-white focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50"
                style={{
                  fontFamily: "'Audiowide', sans-serif",
                  fontSize: 'clamp(10px, 1vw, 11px)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '14px 40px',
                  background: c.btnPrimary,
                  clipPath: CLIP_BTN,
                  boxShadow: '0 0 30px rgba(124,92,252,0.3), 0 0 60px rgba(0,212,255,0.1)',
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.95 }}
          >
            <Magnetic strength={0.15}>
              <button
                className="group relative focus:outline-none focus:ring-2 focus:ring-white/20"
                style={{
                  fontFamily: "'Audiowide', sans-serif",
                  fontSize: 'clamp(10px, 1vw, 11px)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '14px 40px',
                  border: `1.5px solid ${c.btnSecBorder}`,
                  color: c.btnSecText,
                  background: 'rgba(0,0,0,0.2)',
                  clipPath: CLIP_BTN,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#00D4FF';
                  e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = c.btnSecBorder;
                  e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Let's Connect
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Tech Stack Pills */}
        <motion.div 
          className="flex flex-wrap justify-end gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
        >
          {['React', 'Go', 'Kubernetes', 'AWS', 'Terraform'].map((tech, i) => (
            <span 
              key={tech}
              className="px-3 py-1 rounded-full text-[clamp(10px,1.1vw,12px)] font-medium"
              style={{ 
                background: i % 2 === 0 ? 'rgba(124,92,252,0.12)' : 'rgba(0,212,255,0.10)',
                color: i % 2 === 0 ? '#A78BFA' : '#67E8F9',
                border: `1px solid ${i % 2 === 0 ? 'rgba(124,92,252,0.2)' : 'rgba(0,212,255,0.15)'}`,
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span style={{ fontFamily: "'Audiowide', sans-serif", fontSize: 9, letterSpacing: '0.35em', color: c.scroll, textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div className="relative w-4 h-10 flex justify-center">
          <div className="absolute inset-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-current to-transparent" style={{ color: c.scroll }} />
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute w-[3px] h-[3px] rounded-full"
              style={{ background: '#7C5CFC', left: 'calc(50% - 1.5px)' }}
              animate={{ y: [0, 36], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: i * 0.5 + 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom fade into next section — fixed to section, outside parallax */}
      <div
        className="absolute inset-x-0 bottom-0 h-[22vh] pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default Hero;