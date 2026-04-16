// src/features/projects/components/ProjectCard.tsx

import React, { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Globe, Smartphone, Code2, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { ProjectViz } from './ProjectViz';
import { Badge } from '@shared/components/ui/badge';
import { useTheme } from '@app/providers/theme-provider';

const catIconMap: Record<string, React.FC<{ className?: string }>> = {
  Web: Globe,
  Mobile: Smartphone,
  'Open Source': Code2,
};

const getTagColor = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('go') || t.includes('k8s') || t.includes('aws') || t.includes('docker') || t.includes('cloud')) return 'ocean';
  if (t.includes('react') || t.includes('ts') || t.includes('typescript') || t.includes('graphql') || t.includes('native')) return 'indigo';
  if (t.includes('kafka') || t.includes('redis') || t.includes('node') || t.includes('express') || t.includes('firebase')) return 'amber';
  if (t.includes('python') || t.includes('d3') || t.includes('mongo') || t.includes('maps')) return 'rose';
  return 'emerald';
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = React.memo(({ project, index }: ProjectCardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();

  // Mouse position for spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring smoothed position for magnetic effect & tilt
  const springCfg = { stiffness: 150, damping: 20 };
  const cardX = useSpring(0, springCfg);
  const cardY = useSpring(0, springCfg);
  const rotateX = useSpring(0, springCfg);
  const rotateY = useSpring(0, springCfg);

  // Spotlight color based on theme and project accent
  const spotlightColor = useMemo(
    () =>
      resolvedTheme === 'dark'
        ? `hsla(${project.accentColor ?? '0'}, 60%, 70%, 0.12)`
        : `hsla(${project.accentColor ?? '0'}, 60%, 40%, 0.08)`,
    [resolvedTheme, project.accentColor],
  );

  const spotlightBg = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Magnetic pull
    const pull = project.featured ? 12 : 8;
    cardX.set((e.clientX - (rect.left + centerX)) / pull);
    cardY.set((e.clientY - (rect.top + centerY)) / pull);

    // Tilt effect (subtle)
    const tiltLimit = 5;
    rotateX.set(((y - centerY) / centerY) * -tiltLimit);
    rotateY.set(((x - centerX) / centerX) * tiltLimit);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    cardX.set(0);
    cardY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  const CatIcon = catIconMap[project.cat] ?? Globe;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        x: cardX, 
        y: cardY, 
        rotateX, 
        rotateY, 
        perspective: 1000,
        willChange: 'transform'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/projects/${project.slug}`)}
      className="group relative cursor-pointer"
    >
      <div className={`
        relative h-full overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 
        bg-white/95 dark:bg-zinc-900/95 transition-all duration-500
        ${isHovered ? 'shadow-2xl shadow-black/10 dark:shadow-black/40 border-black/10 dark:border-white/10' : 'shadow-sm'}
      `}>
        {/* Viz Background Area */}
        <div className="relative h-48 overflow-hidden bg-neutral-100/50 dark:bg-black/20">
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
             <ProjectViz viz={project.viz} idx={index} accentColor={project.accentColor} />
          </div>
          
          {/* Top Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-crimson via-gold to-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Watermark/Number */}
          <div className="absolute -bottom-4 -right-2 font-display text-[80px] font-black leading-none select-none pointer-events-none opacity-5 dark:opacity-10 group-hover:opacity-15 transition-opacity"
            style={{ color: 'transparent', WebkitTextStroke: '1.5px currentColor' }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/5 text-foreground/70">
                <CatIcon className="w-3 h-3" />
                {project.cat}
             </span>
          </div>

          {project.featured && (
            <div className="absolute top-4 right-4">
               <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 shadow-[0_0_10px_rgba(212,137,26,0.1)]">
                 Featured
               </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col h-full">
           <h3 className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-gold transition-colors duration-300">
             {project.name}
           </h3>
           
           <p className="text-sm text-foreground/60 mt-3 leading-relaxed line-clamp-2 italic font-medium">
             "{project.desc}"
           </p>

           {/* Metrics if any */}
           {project.metrics && project.metrics.length > 0 && (
              <div className="flex gap-2 mt-4">
                {project.metrics.map(m => (
                  <span key={m} className="font-mono text-[10px] text-crimson uppercase tracking-tight py-0.5 px-2 rounded-md bg-crimson/5 border border-crimson/10">
                    {m}
                  </span>
                ))}
              </div>
           )}

           {/* Tags */}
           <div className="flex flex-wrap gap-1.5 mt-5">
             {project.tags.map(tag => (
               <Badge
                 key={tag}
                 variant="premium"
                 color={getTagColor(tag)}
                 className="text-[9px] uppercase tracking-wider px-2 py-0.5"
               >
                 {tag}
               </Badge>
             ))}
           </div>

           {/* Footer CTA */}
           <div className="mt-8 pt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/40 group-hover:text-foreground/70 transition-colors">
              <span className="flex items-center gap-2 group-hover:text-crimson transition-colors">
                Read Case Study
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <motion.div 
                animate={{ scale: isHovered ? 1.1 : 1 }}
                className="w-1.5 h-1.5 rounded-full bg-gold"
              />
           </div>
        </div>

        {/* Mouse Spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlightBg }}
        />
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';
