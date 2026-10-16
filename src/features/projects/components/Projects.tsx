// src/features/projects/components/Projects.tsx

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { TiltedGridHero } from '@components/ui/tilted-grid-hero';
import { useTheme } from '@app/providers/theme-provider';

const CDN = 'https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev';

const MARQUEE_IMAGES = [
  { src: `${CDN}/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg`, alt: 'Diver silhouetted inside a sunset seascape shaped like a profile' },
  { src: `${CDN}/gradients/hero_gradient/hero-gradients-01.png`,        alt: 'Soft multi-tone gradient wash' },
  { src: `${CDN}/stock-images/821d815affa6496c39cbdeeec7a84603.jpg`, alt: 'Double-exposure portrait blended with a city skyline at dusk' },
  { src: `${CDN}/gradients/moon/moon-grade-03.png`,                     alt: 'Moon-toned gradient' },
  { src: `${CDN}/stock-images/937438c560ada1c83317f2c11b3454b0.jpg`, alt: 'Motion-blurred side-profile portrait against a deep orange backdrop' },
  { src: `${CDN}/gradients/shade_shiters/shade-shifters-05.png`,        alt: 'Shifting shade gradient' },
  { src: `${CDN}/stock-images/98f89cb9994f5c382ab964062c4039db.jpg`, alt: 'Figure holding a racket that dissolves into a swirling colourful cloud' },
  { src: `${CDN}/gradients/shade_shiters/shade-shifters-09.png`,        alt: 'Shifting shade gradient' },
  { src: `${CDN}/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg`, alt: 'Hand gesture with a colourful cutout of a bird flying through the fingers' },
  { src: `${CDN}/gradients/moon/moon-grade-06.png`,                     alt: 'Moon-toned gradient' },
];

// ─── Section ───────────────────────────────────────────────────────────────────

const Projects = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-100px' });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-14 md:py-20 relative z-20 overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 1000px',
        background: isDark
          ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244, 114, 182, 0.15), transparent 70%), hsl(var(--background))'
          : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 92, 252, 0.08), transparent 70%), hsl(var(--background))',
      }}
    >
      {/* Top fade — blends previous section into Projects */}
      <div
        className="absolute inset-x-0 top-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />

      {/* Secondary ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-gradient-to-b from-primary/10 dark:from-[rgba(244,114,182,0.08)] to-transparent blur-[100px]" />
      </motion.div>

      {/* ── TiltedGridHero marquee ── */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
      >
        <TiltedGridHero
          images={MARQUEE_IMAGES}
          speed={4}
          tileHeight={26}
          aspectRatio={16 / 9}
          gap={6}
          axis={56}
          curve={80}
          fade={12}
          className="h-[560px] w-full"
        >
          {/* Overlay: heading group (title + subtitle) at top, CTA at bottom */}
          <div className="relative z-10 flex h-full flex-col items-center justify-between py-14 text-center">

            {/* Top block: heading + subtitle stacked */}
            <motion.div
              className="flex flex-col items-center gap-4 px-6"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-jakarta font-semibold text-4xl md:text-5xl text-foreground tracking-tight leading-[1.1]">
                Selected{' '}
                <span className="font-playfair italic font-medium text-primary dark:text-[#d60d86]">
                  Projects
                </span>
              </h2>
              <p className="max-w-xs text-balance text-sm text-muted-foreground leading-relaxed">
                Architecting scalable systems and refined sensory experiences across 10 years of engineering.
              </p>
            </motion.div>

            {/* Bottom: CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => navigate('/projects')}
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full cursor-pointer overflow-hidden"
              >
                {/* Gradient fill */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/90 to-[#d60d86]/80 dark:from-primary dark:to-[#d60d86] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Subtle glass sheen */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent" />
                {/* Border */}
                <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                {/* Label */}
                <span className="relative font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-white">
                  View All Projects
                </span>
                {/* Arrow */}
                <span className="relative text-white text-sm transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </motion.div>

          </div>
        </TiltedGridHero>
      </motion.div>

      {/* Bottom fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-[120px] pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default Projects;