// src/features/projects/components/Projects.tsx

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Magnetic from '@components/animations/Magnetic';
import { Badge } from '@components/ui/badge';
import { allProjects } from '../data/projectData';
import { ProjectViz } from './ProjectViz';
import { Project } from '../types';
import { useTheme } from '@app/providers/theme-provider';
import bgDark from '@assets/images/selected-projects/dark.jpeg';
import bgWhite from '@assets/images/selected-projects/white.png';

const CLIP_BTN = 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';

const getTagColor = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('go') || t.includes('k8s') || t.includes('aws') || t.includes('cloud') || t.includes('oauth')) return 'ocean';
  if (t.includes('react') || t.includes('ts') || t.includes('typescript') || t.includes('grpc') || t.includes('native')) return 'indigo';
  if (t.includes('kafka') || t.includes('redis') || t.includes('node') || t.includes('firebase') || t.includes('terraform')) return 'amber';
  if (t.includes('python') || t.includes('d3') || t.includes('maps')) return 'rose';
  return 'emerald';
};

// ─── Card ──────────────────────────────────────────────────────────────────────

const ProjectCard = React.memo(({
  project,
  index,
  onNavigate,
}: {
  project: Project;
  index: number;
  onNavigate: (slug: string) => void;
}) => (
  <div
    className="group flex-shrink-0 w-[340px] will-change-transform"
    onClick={() => onNavigate(project.slug)}
  >
    <div className="h-full rounded-2xl border border-white/5 bg-card/70 dark:bg-zinc-900/80 elevation-card shimmer-border group-hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden">

      {/* Viz area */}
      <div className="h-[175px] relative overflow-hidden bg-black/20">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7C5CFC] via-[#00D4FF] to-[#7C5CFC] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        <ProjectViz viz={project.viz} idx={index} accentColor={project.accentColor} />

        {/* Watermark number */}
        <div className="absolute -bottom-3 -right-1 font-playfair text-[76px] font-black leading-none select-none pointer-events-none"
          style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Mono label */}
        <span className="absolute bottom-3 left-4 font-mono text-[9px] tracking-[0.14em] uppercase text-foreground/20 group-hover:text-foreground/40 transition-colors duration-400">
          Data.Process_{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-jakarta font-bold text-[17px] tracking-tight text-foreground group-hover:text-[#00D4FF] transition-colors duration-300 leading-snug">
          {project.name}
        </h3>
        <p className="text-[13px] text-foreground/50 mt-2 leading-relaxed line-clamp-2">
          {project.desc}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3.5 flex-wrap">
          {project.tags.slice(0, 4).map(tag => (
            <Badge
              key={tag}
              variant="premium"
              color={getTagColor(tag)}
              className="text-[10px] uppercase tracking-wider px-2.5 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex gap-1.5 flex-wrap">
            {project.metrics?.map(m => (
              <span
                key={m}
                className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                style={{
                  color: 'hsl(var(--gold))',
                  borderColor: 'hsla(var(--gold) / 0.25)',
                  background: 'hsla(var(--gold) / 0.08)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* Evidence type indicator */}
            {project.evidenceType && (
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-foreground/40">
                {project.evidenceType === 'code' ? '💻 Code' :
                  project.evidenceType === 'docs' ? '📄 Docs' :
                    project.evidenceType === 'diagrams' ? '📊 Diagrams' : '🔀 Mixed'}
              </span>
            )}
            <span className="font-mono text-[11px] text-[#7C5CFC] group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-1">
              Explore <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

// ─── Section ───────────────────────────────────────────────────────────────────

const CARD_W = 340;
const GAP = 20;
const STRIDE = CARD_W + GAP; // 360px per card

const Projects = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-100px' });

  const displayProjects = [...allProjects, ...allProjects];
  const totalPx = STRIDE * allProjects.length;

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-[100px] md:py-[140px] relative z-20 bg-background overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 1000px'
      }}
    >
      {/* Background Image - Gojo */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/4 pointer-events-none z-0 overflow-hidden">
        <motion.img
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isDark ? 0.55 : 0.45, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={isDark ? bgDark : bgWhite}
          alt=""
          className="h-full w-full object-cover object-right"
          style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
        />
        {/* Soft edge fade: fade out the left edge to blend with the background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-14 px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
          Selected{' '}
          <span className="font-playfair italic font-medium text-[#7C5CFC]">
            Projects
          </span>
        </h2>
        <p className="text-sm text-foreground/50 dark:text-foreground/60 leading-relaxed max-w-[280px]">
          Architecting scalable systems and refined sensory experiences across 10 years of engineering.
        </p>
      </motion.div>

      {/* Single Row Marquee */}
      <motion.div
        className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scrollProjects {
            from { transform: translateX(0); }
            to { transform: translateX(-${totalPx}px); }
          }
          .animate-scroll-projects {
            animation: scrollProjects 50s linear infinite;
            animation-play-state: ${isInView ? 'running' : 'paused'};
          }
          .animate-scroll-projects:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="py-4">
          <div
            className="flex animate-scroll-projects"
            style={{ gap: GAP, width: 'max-content' }}
          >
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={`${project.name}-${index}`}
                project={project}
                index={index % allProjects.length}
                onNavigate={(slug) => navigate(`/projects/${slug}`)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="relative z-10 text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Magnetic strength={0.15}>
          <button
            onClick={() => navigate('/projects')}
            className="group relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#7C5CFC]/50"
            style={{
              fontFamily: "'Audiowide', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '10px 30px',
              background: 'transparent',
              color: isDark ? 'rgba(255,255,255,0.90)' : 'rgba(20,20,20,0.85)',
              border: `1.5px solid ${isDark ? 'rgba(124,92,252,0.65)' : 'rgba(107,78,240,0.55)'}`,
              clipPath: CLIP_BTN,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? 'rgba(0,212,255,0.85)' : 'rgba(124,92,252,0.85)';
              (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#00D4FF' : '#7C5CFC';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isDark ? '0 0 22px rgba(0,212,255,0.2)' : '0 0 22px rgba(124,92,252,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? 'rgba(124,92,252,0.65)' : 'rgba(107,78,240,0.55)';
              (e.currentTarget as HTMLButtonElement).style.color = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(20,20,20,0.85)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            <span className="relative z-10">View All Projects</span>
            <motion.span
              className="absolute inset-0"
              style={{ background: isDark ? 'linear-gradient(135deg, rgba(124,92,252,0.08) 0%, transparent 100%)' : 'linear-gradient(135deg, rgba(107,78,240,0.05) 0%, transparent 100%)' }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </button>
        </Magnetic>
      </motion.div>

      <div className="section-fade-top" style={{ zIndex: 50 }} />
      <div className="section-fade-bottom" style={{ zIndex: 50 }} />
    </section>
  );
};

export default Projects;
