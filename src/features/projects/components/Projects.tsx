// src/features/projects/components/Projects.tsx

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { CircularCarousel, CircularCarouselItem } from '@components/ui/circular-carousel';
import { useTheme } from '@app/providers/theme-provider';
import { allProjects } from '../data/projectData';

const CDN = 'https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev';

// Project image mapping for carousel
const PROJECT_CAROUSEL_IMAGES: Record<string, string> = {
  'distributed-task-engine': '/src/assets/images/project_details/distributed-task-engine/dashboard.png',
  'real-time-analytics': `${CDN}/stock-images/821d815affa6496c39cbdeeec7a84603.jpg`,
  'authshield-sdk': `${CDN}/stock-images/937438c560ada1c83317f2c11b3454b0.jpg`,
  'datapipe': `${CDN}/gradients/shade_shiters/shade-shifters-05.png`,
  'clouddash': `${CDN}/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg`,
  'apiforge': `${CDN}/gradients/moon/moon-grade-03.png`,
  'mobiletrack': `${CDN}/stock-images/98f89cb9994f5c382ab964062c4039db.jpg`,
  'chatscale': `${CDN}/gradients/hero_gradient/hero-gradients-01.png`,
  'devmetrics': `${CDN}/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg`,
};

// Fallback images pool
const FALLBACK_IMAGES = [
  `${CDN}/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg`,
  `${CDN}/gradients/hero_gradient/hero-gradients-01.png`,
  `${CDN}/stock-images/821d815affa6496c39cbdeeec7a84603.jpg`,
  `${CDN}/gradients/moon/moon-grade-03.png`,
  `${CDN}/stock-images/937438c560ada1c83317f2c11b3454b0.jpg`,
  `${CDN}/gradients/shade_shiters/shade-shifters-05.png`,
  `${CDN}/stock-images/98f89cb9994f5c382ab964062c4039db.jpg`,
  `${CDN}/gradients/shade_shiters/shade-shifters-09.png`,
  `${CDN}/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg`,
  `${CDN}/gradients/moon/moon-grade-06.png`,
];

// ─── Section ───────────────────────────────────────────────────────────────────

const Projects = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselControlsRef = useRef<{ stepBy: (delta: number) => void; focusIndex: (index: number) => void } | null>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);

  // Map all projects into circular carousel items
  const carouselItems: CircularCarouselItem[] = allProjects.map((p, index) => ({
    src: PROJECT_CAROUSEL_IMAGES[p.slug] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    alt: p.name,
    title: p.name,
    subtitle: p.cat,
    description: p.desc,
    tags: p.tags,
    slug: p.slug,
    metrics: p.metrics,
    accentColor: p.accentColor,
  }));

  // Theme-aware fade and background colors
  const fadeColor = isDark ? '#000000' : '#ffffff';

  return (
    <section
      id="projects"
      ref={containerRef}
      className="pt-10 pb-12 md:pt-14 md:pb-16 relative z-20 overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 850px',
        background: isDark
          ? 'radial-gradient(ellipse 80% 50% at 50% 10%, rgba(244, 114, 182, 0.1), transparent 70%), hsl(var(--background))'
          : 'radial-gradient(ellipse 80% 50% at 50% 10%, rgba(124, 92, 252, 0.06), transparent 70%), hsl(var(--background))',
      }}
    >
      {/* Top fade — smooth blending into section */}
      <div
        className="absolute inset-x-0 top-0 h-[100px] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />

      {/* Ambient background glow accents */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[600px] h-[260px] rounded-full bg-gradient-to-b from-primary/12 dark:from-[#6C63FF]/10 to-transparent blur-[100px]" />
      </motion.div>

      {/* Header and Title — Compact & Elegant */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center mb-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="font-jakarta font-semibold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-[1.1]">
            Selected{' '}
            <span className="font-playfair italic font-medium text-[#10B981]">
              Projects
            </span>
          </h2>
          <p className="max-w-md text-balance text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Drag, scroll, or hover to inspect architecture and key metrics across production systems.
          </p>
        </motion.div>
      </div>

      {/* ── Circular Carousel 3D Section ── */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        {/* Adjusted compact height and tight offset */}
        <div className="relative w-full h-[430px] sm:h-[460px] md:h-[480px]">
          <CircularCarousel
            carouselRef={carouselControlsRef}
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            cardWidth={240}
            aspectRatio={0.92}
            speed={12}
            captions={false}
            gap={24}
            tilt={-4}
            curve={1}
            perspective={2400}
            autoplay="drift"
            interval={3}
            direction="left"
            momentum={0.65}
            snap
            pauseOnHover
            focusOnClick
            draggable
            parallax={0.3}
            stretch={0.4}
            shiftOffset={-18}
            fadeColor={fadeColor}
            depthFade={isDark ? 0.62 : 0.45}
            innerShade={isDark ? 0.65 : 0.45}
            cornerRadius={16}
            onChange={(idx) => setActiveIndex(idx)}
            onItemClick={(item) => {
              if (item.slug) {
                navigate(`/projects/${item.slug}`);
              }
            }}
            renderOverlayCard={(item, _idx, isHovered) => (
              <div
                className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 rounded-[16px] border ${
                  isHovered
                    ? isDark
                      ? 'bg-neutral-950/90 backdrop-blur-md border-foreground/20 shadow-2xl shadow-black/25'
                      : 'bg-white/95 backdrop-blur-md border-foreground/20 shadow-2xl shadow-black/15'
                    : 'bg-gradient-to-t from-black/85 via-black/25 to-transparent border-transparent'
                }`}
              >
                {/* Top Badge: Category & Quick action icon */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                      isHovered
                        ? isDark
                          ? 'bg-foreground/15 text-foreground border border-foreground/30'
                          : 'bg-foreground/10 text-foreground border border-foreground/20'
                        : 'bg-black/60 text-white border border-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {item.subtitle || 'Project'}
                  </span>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isHovered
                        ? 'bg-foreground text-background scale-105 shadow-md shadow-black/20'
                        : 'bg-white/10 text-white/60 opacity-0'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Bottom Content: Title & Short Description on Hover */}
                <div className="transform transition-transform duration-300">
                  <h3
                    className={`font-jakarta font-bold text-sm sm:text-base line-clamp-1 transition-colors ${
                      isHovered
                        ? isDark
                          ? 'text-white'
                          : 'text-neutral-900'
                        : 'text-white drop-shadow-md'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Hover reveal description */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isHovered ? 'max-h-28 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p
                      className={`text-[11px] sm:text-xs line-clamp-2 leading-relaxed ${
                        isDark ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Metrics or tags preview */}
                    {item.metrics && item.metrics.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.metrics.slice(0, 2).map((m: string) => (
                          <span
                            key={m}
                            className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                              isDark
                                ? 'bg-primary/20 text-[#f472b6] border border-primary/30'
                                : 'bg-primary/10 text-primary border border-primary/20'
                            }`}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    ) : item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              isDark
                                ? 'bg-white/10 text-neutral-300'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Bottom bar: prev/next arrows + View All CTA */}
        <div className="mt-0 sm:mt-1 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto px-6 z-20 relative">

          {/* Left: Previous / Next Carousel Steppers */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => carouselControlsRef.current?.stepBy(-1)}
              aria-label="Previous project"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-border/60 bg-background/80 hover:bg-foreground/5 hover:border-foreground/20 text-foreground/60 hover:text-foreground transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => carouselControlsRef.current?.stepBy(1)}
              aria-label="Next project"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-border/60 bg-background/80 hover:bg-foreground/5 hover:border-foreground/20 text-foreground/60 hover:text-foreground transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: View All Projects CTA */}
          <button
            onClick={() => navigate('/projects')}
            className="group inline-flex items-center gap-2.5 h-11 px-6 rounded-full bg-foreground text-background font-sans font-medium text-sm transition-all duration-300 hover:bg-foreground/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

        </div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60px] pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default Projects;