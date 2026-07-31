// src/features/projects/components/Projects.tsx

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { allProjects } from '../data/projectData';
import { ProjectViz } from './ProjectViz';
import { Project } from '../types';
import { useTheme } from '@app/providers/theme-provider';

const CARD_W = 320;
const GAP = 20;
const STRIDE = CARD_W + GAP;

const getTagColor = (tag: string): string => {
  const t = tag.toLowerCase();
  if (t.includes('go') || t.includes('k8s') || t.includes('aws') || t.includes('cloud') || t.includes('oauth')) return 'ocean';
  if (t.includes('react') || t.includes('ts') || t.includes('typescript') || t.includes('grpc') || t.includes('native')) return 'indigo';
  if (t.includes('kafka') || t.includes('redis') || t.includes('node') || t.includes('firebase') || t.includes('terraform')) return 'amber';
  if (t.includes('python') || t.includes('d3') || t.includes('maps')) return 'rose';
  return 'emerald';
};

const tagColorMapDark: Record<string, { border: string; color: string; bg: string }> = {
  ocean:   { border: 'rgba(0, 212, 255, 0.20)', color: 'rgba(0, 212, 255, 0.85)', bg: 'rgba(0, 212, 255, 0.05)' },
  indigo:  { border: 'rgba(124, 92, 252, 0.20)', color: 'rgba(124, 92, 252, 0.85)', bg: 'rgba(124, 92, 252, 0.05)' },
  amber:   { border: 'rgba(245, 158, 11, 0.20)', color: 'rgba(245, 158, 11, 0.85)', bg: 'rgba(245, 158, 11, 0.05)' },
  rose:    { border: 'rgba(244, 63, 94, 0.20)', color: 'rgba(244, 63, 94, 0.85)', bg: 'rgba(244, 63, 94, 0.05)' },
  emerald: { border: 'rgba(16, 185, 129, 0.20)', color: 'rgba(16, 185, 129, 0.85)', bg: 'rgba(16, 185, 129, 0.05)' },
};

const tagColorMapLight: Record<string, { border: string; color: string; bg: string }> = {
  ocean:   { border: 'rgba(0, 150, 214, 0.25)', color: '#0077a3', bg: 'rgba(0, 150, 214, 0.08)' },
  indigo:  { border: 'rgba(107, 70, 229, 0.25)', color: '#5b32d6', bg: 'rgba(107, 70, 229, 0.08)' },
  amber:   { border: 'rgba(217, 119, 6, 0.25)', color: '#b45309', bg: 'rgba(217, 119, 6, 0.08)' },
  rose:    { border: 'rgba(225, 29, 72, 0.25)', color: '#be123c', bg: 'rgba(225, 29, 72, 0.08)' },
  emerald: { border: 'rgba(5, 150, 105, 0.25)', color: '#047857', bg: 'rgba(5, 150, 105, 0.08)' },
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
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="group flex-shrink-0 w-[320px] will-change-transform"
      onClick={() => onNavigate(project.slug)}
    >
      {/* Zen Glass Card Container */}
      <div className="relative h-full rounded-2xl border border-foreground/[0.08] dark:border-white/[0.08] bg-card/75 dark:bg-zinc-950/50 backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-primary/30 dark:hover:border-primary/40 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-12px_rgba(124,92,252,0.22)]">

        {/* Subtle Glass Specular Sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.12] via-transparent to-transparent opacity-60 dark:from-white/[0.04]" />

        {/* Soft top border highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {/* Viz Window (Zen Glass Canvas) */}
        <div className="h-[150px] relative overflow-hidden bg-foreground/[0.02] dark:bg-white/[0.02] border-b border-foreground/[0.06] dark:border-white/[0.06]">
          {/* Zen Grid overlay */}
          <div
            className="absolute inset-0 opacity-15 dark:opacity-30"
            style={{
              backgroundImage: isDark
                ? `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`
                : `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Zen Radial Aura */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full blur-[20px] pointer-events-none"
            style={{ background: `radial-gradient(circle, ${project.accentColor ? project.accentColor + '18' : 'rgba(124,92,252,0.15)'} 0%, transparent 70%)` }}
          />

          <ProjectViz viz={project.viz} idx={index} accentColor={project.accentColor} />

          {/* Watermark Index */}
          <div
            className="absolute bottom-[8px] right-[14px] font-playfair text-[44px] font-medium italic leading-none select-none pointer-events-none text-foreground/10 dark:text-white/10"
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Zen Mono Label */}
          <span className="absolute bottom-[14px] left-4 font-mono text-[9px] tracking-[0.14em] uppercase text-muted-foreground/60 dark:text-white/30">
            SYS.NODE_{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Card Body */}
        <div className="px-5 pt-[18px] pb-4">
          {/* Meta: Year · Role */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9.5px] text-primary tracking-[0.08em] font-medium">
              {project.year || '2024'}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-foreground/20 dark:bg-white/20" />
            <span className="text-[10px] text-muted-foreground/80 tracking-[0.03em]">
              {project.role || 'Lead Engineer'}
            </span>
          </div>

          <h3 className="font-jakarta font-semibold text-[15.5px] tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors duration-300 leading-[1.35] mb-[6px]">
            {project.name}
          </h3>

          <p className="text-[12.5px] text-muted-foreground/90 leading-[1.6] line-clamp-2 mb-[16px]">
            {project.desc}
          </p>

          {/* Zen Glass Tags */}
          <div className="flex gap-[6px] flex-wrap mb-[14px]">
            {project.tags.slice(0, 4).map(tag => {
              const colorKey = getTagColor(tag);
              const tc = isDark
                ? (tagColorMapDark[colorKey] || tagColorMapDark.emerald)
                : (tagColorMapLight[colorKey] || tagColorMapLight.emerald);

              return (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-[0.02em] px-2.5 py-1 rounded-full border border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.03] text-foreground/80 dark:text-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30"
                  style={{
                    color: tc.color,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-foreground/[0.06] dark:border-white/[0.06]">
            <div className="flex gap-[10px]">
              {project.metrics?.map(m => (
                <span
                  key={m}
                  className="font-mono text-[9.5px] text-primary/80"
                >
                  {m}
                </span>
              ))}
            </div>
            <span className="font-mono text-[11px] text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-[4px] transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-1">
              Explore <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// ─── Section ───────────────────────────────────────────────────────────────────

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
      className="py-[100px] md:py-[140px] relative z-20 overflow-hidden"
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

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-14 px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
          Selected{' '}
          <span className="font-playfair italic font-medium text-primary dark:text-[#d60d86]">
            Projects
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
          Architecting scalable systems and refined sensory experiences across 10 years of engineering.
        </p>
      </motion.div>

      {/* Marquee */}
      <motion.div
        className="relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes zenScrollProjects {
            from { transform: translateX(0); }
            to { transform: translateX(-${totalPx}px); }
          }
          .animate-zen-scroll {
            animation: zenScrollProjects 45s linear infinite;
            animation-play-state: ${isInView ? 'running' : 'paused'};
          }
          .animate-zen-scroll:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="py-4">
          <div
            className="flex animate-zen-scroll"
            style={{ gap: GAP, width: 'max-content' }}
          >
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={`${project.slug}-${index}`}
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
        className="relative z-10 text-center mt-[52px]"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <button
          onClick={() => navigate('/projects')}
          className="font-mono text-[10px] tracking-[0.14em] uppercase px-7 py-[11px] rounded-full border border-foreground/10 dark:border-white/10 bg-card/60 dark:bg-zinc-950/40 backdrop-blur-xl hover:bg-primary/10 text-foreground hover:text-primary hover:border-primary/40 transition-all duration-350 cursor-pointer shadow-sm"
        >
          View All Projects →
        </button>
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