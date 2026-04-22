// src/features/projects/components/Projects.tsx

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Badge } from '@shared/components/ui/badge';
import { allProjects } from '../data/projectData';
import { ProjectViz } from './ProjectViz';
import { Project } from '../types';

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
}: {
  project: Project;
  index: number;
}) => (
  <div className="group flex-shrink-0 w-[340px] will-change-transform">
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
          <span className="font-mono text-[11px] text-[#7C5CFC] group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-1">
            Explore <span>→</span>
          </span>
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
      {/* Ambient blobs - reduced complexity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-2xl opacity-50 will-change-transform"
          style={{ background: 'hsla(var(--primary-hsl), 0.03)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-2xl opacity-50 will-change-transform"
          style={{ background: 'hsla(var(--secondary-hsl), 0.03)' }} />
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-14 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 bg-muted/50 border border-border/50 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
          <span className="text-[10px] font-mono tracking-widest text-[#00D4FF]">
            ///
          </span>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Featured Work
          </span>
        </div>
        <h2 className="font-jakarta font-extrabold text-[clamp(34px,6vw,50px)] tracking-tight text-foreground">
          Selected{' '}
          <span className="font-playfair italic font-medium text-[#7C5CFC]">
            Projects
          </span>
        </h2>
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsla(var(--primary-hsl), 0.5))' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#00D4FF]" />
          <div className="w-12 h-px" style={{ background: 'linear-gradient(270deg, transparent, hsla(var(--secondary-hsl), 0.5))' }} />
        </div>
      </motion.div>

      {/* Single Row Marquee */}
      <motion.div
        className="relative max-w-[1280px] mx-auto px-6 md:px-12 overflow-hidden"
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
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <button
          onClick={() => navigate('/projects')}
          className="group font-mono text-[12px] tracking-wide text-[#7C5CFC] border border-[#7C5CFC]/30 px-10 py-4 rounded-full hover:border-[#00D4FF]/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/5 hover:shadow-xl hover:shadow-[#00D4FF]/10 transition-all duration-500 hover:scale-105"
        >
          <span className="inline-flex items-center gap-2">
            View All Projects
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </button>
      </motion.div>

      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default Projects;
