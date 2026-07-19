import { useState, useEffect } from 'react';
import BentoCard from './BentoCard';
import ProjectActions from './ProjectActions';
import ImpactMetrics from './ImpactMetrics';
import { Variants, motion, AnimatePresence } from 'framer-motion';
import { cn } from '@lib/utils';
import { useTheme } from '@app/providers/theme-provider';

const ProjectBentoGrid = ({ project }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const hasCode = !!(project.github && project.github !== '#');
  const hasDoc = !!(project.docUrl && project.docUrl !== '#');
  const hasLive = !!project.liveUrl;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Autoplay image slider
  useEffect(() => {
    if (project.screenshots?.length > 1 && !isImageExpanded) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % project.screenshots.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [project.screenshots, isImageExpanded]);

  // Container variants for staggered animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  // Item variants for individual card animations
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Content for Overview
  const overviewContent = (
    <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
      {project.overview}
    </p>
  );

  // Content for Details
  const detailsContent = (
    <div className="flex flex-col gap-2">
      <div>
        <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">
          Role
        </div>
        <div className="font-medium text-sm">{project.role}</div>
      </div>
      <div>
        <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">
          Team
        </div>
        <div className="font-medium text-sm">{project.team}</div>
      </div>
      <div className="flex justify-between gap-2">
        <div>
          <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">
            Duration
          </div>
          <div className="font-medium text-sm">{project.duration}</div>
        </div>
        <div>
          <div className="text-foreground/40 text-[10px] tracking-widest mb-1 uppercase font-bold">
            Year
          </div>
          <div className="font-medium text-sm">{project.year}</div>
        </div>
      </div>
    </div>
  );

  // Content for Actions/Links
  const actionsContent = (
    <ProjectActions project={project} hasCode={hasCode} hasDoc={hasDoc} hasLive={hasLive} />
  );

  // Content for Tech Stack
  const techStackContent = (
    <div className="flex flex-wrap gap-2">
      {project.tags.map((tag: string) => (
        <span
          key={tag}
          className={cn(
            'px-3 py-1 text-xs font-mono border border-foreground/10 bg-foreground/5 rounded-full text-foreground/70',
            'hover:bg-foreground/10 transition-all duration-300'
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );

  // Content for Impact Metrics (if available)
  const impactContent = project.metrics && project.metrics.length > 0 ? (
    <ImpactMetrics metrics={project.metrics} />
  ) : null;

  // Content for Mission (solution)
  const missionContent = (
    <p className="text-foreground/70 text-[14px] leading-relaxed italic">
      {project.solution}
    </p>
  );

  // Content for Architecture
  const architectureContent = (
    <div className="space-y-2">
      <p className="text-foreground/60 text-[12px]">
        {project.architecture.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {project.architecture.components.map((comp: any, index: number) => (
          <span
            key={comp.name}
            className={cn(
              'px-2 py-1 text-[10px] font-mono border border-foreground/10 bg-foreground/5 rounded-full',
              index % 2 === 0 && 'bg-primary/5 border-primary/10',
              index % 3 === 0 && 'bg-secondary/5 border-secondary/10'
            )}
          >
            <span className="font-medium">{comp.name}</span>
            <span className="text-foreground/50">: {comp.role}</span>
          </span>
        ))}
      </div>
    </div>
  );

  // Content for Evidence (Visual Evidence)
  const evidenceContent = (
    <>
      {/* Video Thumbnails */}
      {project.videoLinks?.length > 0 && (
        <div className="mb-2">
          <div className="text-foreground/40 text-[11px] tracking-widest mb-2 uppercase font-medium">
            Demonstrations
          </div>
          <div className="grid gap-2">
            {project.videoLinks.map((vid: any, i: number) => (
              <a
                key={i}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group block relative aspect-video rounded-xl overflow-hidden border border-foreground/5 bg-foreground/5 hover:border-foreground/10 hover:bg-foreground/10 transition-all duration-400',
                  'dark:bg-foreground/5 dark:hover:bg-foreground/10'
                )}
              >
                <img
                  src={`https://picsum.photos/seed/video-${project.id}-${i}/400/250`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={vid.title}
                />
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border border-foreground/20 bg-white/20 backdrop-blur-sm',
                    'dark:bg-foreground/10 dark:border-foreground/20'
                  )}>
                    <div className="w-0 h-0 border-t-3 border-b-3 border-l-[6px] border-t-transparent border-b-transparent ml-0.5">
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] font-medium group-hover:text-primary transition-colors">
                  {vid.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Screenshot Gallery */}
      {project.screenshots?.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-foreground/40 text-[11px] tracking-widest uppercase font-medium">
              Visual Artifacts
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentImageIndex === 0}
                className="text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition-colors px-1"
              >
                ←
              </button>
              <div className="text-foreground/50 text-[10px] font-mono">
                {currentImageIndex + 1} / {project.screenshots.length}
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => Math.min(project.screenshots.length - 1, prev + 1));
                }}
                disabled={currentImageIndex === project.screenshots.length - 1}
                className="text-foreground/50 hover:text-foreground/80 disabled:opacity-30 transition-colors px-1"
              >
                →
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-foreground/5 bg-foreground/5">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentImageIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {project.screenshots.map((shot: any, idx: number) => (
                <div
                  key={idx}
                  className="min-w-full relative group cursor-pointer"
                  onClick={() => setIsImageExpanded(true)}
                >
                  <img
                    src={(shot.lightImage || shot.image) || `https://picsum.photos/seed/${project.id}-${idx}/500/350`}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={shot.caption || `Artifact ${idx + 1}`}
                  />
                  <div className={cn(
                    'absolute bottom-0 left-0 right-0 px-3 py-2 text-[10px] font-mono text-foreground/80 bg-background/60 backdrop-blur-md flex justify-between items-center',
                    'dark:bg-background/60'
                  )}>
                    <span>{shot.caption || `Artifact ${idx + 1}`}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Click to expand ⤢</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );

    // Content for Timeline (Execution Log) — FIXED
  const timelineContent = Array.isArray(project.timeline) ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {project.timeline.map((phase: any, index: number) => (
        <div
          key={phase.phase}
          className={cn(
            'flex items-start gap-2 border-l-2 pl-3',
            index % 2 === 0 && 'border-primary',
            index % 3 === 0 && 'border-secondary'
          )}
        >
          <div className="shrink-0 flex-none">
            <div className="text-foreground/40 text-[10px] tracking-widest font-medium">
              {phase.phase}
            </div>
            <div className="text-foreground/50 text-[10px]">{phase.duration}</div>
          </div>
          <div className="flex-1">
            <p className="text-foreground/70 text-[12px] leading-relaxed">{phase.desc}</p>
          </div>
        </div>
      ))}
    </div>
  ) : null;

  // Content for Debrief (Retrospective)
  const debriefContent = (
    <div className="space-y-2">
      {project.learnings.map((learning: string, index: number) => (
        <div
          key={index}
          className={cn(
            'flex items-start gap-2 border-l-2 pl-3',
            index % 2 === 0 && 'border-primary',
            index % 3 === 0 && 'border-secondary'
          )}
        >
          <div className="shrink-0 flex-none w-2 h-2 rounded-full bg-primary/20"></div>
          <p className="text-foreground/70 text-[12px] leading-relaxed">{learning}</p>
        </div>
      ))}
    </div>
  );

  // Define grid items with their content and layout properties
  const gridItems: Array<{
    title: string;
    content: React.ReactNode;
    className?: string;
    colspan: number;
    rowspan: number;
  }> = [
    {
      title: 'Overview',
      content: overviewContent,
      className: '',
      colspan: 2,
      rowspan: 2,
    },
    {
      title: 'Details',
      content: detailsContent,
      className: '',
      colspan: 1,
      rowspan: 2,
    },
    {
      title: 'Links',
      content: actionsContent,
      className: '',
      colspan: 1,
      rowspan: 1,
    },
    {
      title: 'Stack',
      content: techStackContent,
      className: '',
      colspan: 4,
      rowspan: 1,
    },
    ...(impactContent ? [{
      title: 'Impact',
      content: impactContent,
      className: '',
      colspan: 4,
      rowspan: 1,
    }] : []),
    {
      title: 'Mission',
      content: missionContent,
      className: '',
      colspan: 2,
      rowspan: 1,
    },
    {
      title: 'Architecture',
      content: architectureContent,
      className: '',
      colspan: 2,
      rowspan: 1,
    },
    {
      title: 'Evidence',
      content: evidenceContent,
      className: '',
      colspan: 2,
      rowspan: 1,
    },
    {
      title: 'Retrospective',
      content: debriefContent,
      className: '',
      colspan: 2,
      rowspan: 1,
    },
    ...(timelineContent ? [{
      title: 'Timeline',
      content: timelineContent,
      className: '',
      colspan: 4,
      rowspan: 1,
    }] : []),
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full"
    >
{/*
    Zen-Inspired Advanced Bento Grid
    Principles: Minimal • Spacious • Intentional • Calm

    Features:
    - Asymmetric, overlapping layout with considered white space
    - Reduced font sizes and spacing to combat visual overwhelm
    - Hierarchical typography that guides the eye
    - Subtle animations and hover states
    - Responsive design that adapts to screen sizes
*/}
      {/* Mobile Layout - Single Column with Gentle Spacing */}
      <div className="grid gap-2 mb-4 block md:hidden">
        {gridItems.map((item, index) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="mb-2"
          >
            <BentoCard
              title={item.title}
              className={cn(
                "h-full",
                item.title === 'Overview' && 'border-primary/20',
                item.title === 'Details' && 'border-secondary/20',
                item.title === 'Stack' && 'border-primary/10 border-secondary/10'
              )}
            >
              <div className="space-y-2">{item.content}</div>
            </BentoCard>
          </motion.div>
        ))}
      </div>

{/* Desktop Layout - Asymmetric Bento Grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-2">
          {gridItems.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              variants={itemVariants}
              className={cn(
                item.colspan === 4 && 'md:col-span-4',
                item.colspan === 3 && 'md:col-span-3',
                item.colspan === 2 && 'md:col-span-2',
                item.colspan === 1 && 'md:col-span-1',
                item.rowspan === 2 && 'md:row-span-2',
                item.rowspan === 1 && 'md:row-span-1',
                index < 2 && 'mb-0', // First two items (Overview & Details) have special positioning
                item.title === 'Overview' && '-mt-4',
                item.title === 'Details' && '-mt-4'
              )}
            >
              <BentoCard
                title={item.title}
                className={cn(
                  "h-full",
                  item.title === 'Overview' && 'border-primary/20',
                  item.title === 'Details' && 'border-secondary/20',
                  item.title === 'Stack' && 'border-primary/10 border-secondary/10',
                  item.title === 'Impact' && 'border-secondary/10',
                  item.title === 'Evidence' && 'border-primary/10',
                  item.title === 'Timeline' && 'border-secondary/10'
                )}
              >
                <div className="space-y-2">{item.content}</div>
              </BentoCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Image Overlay */}
      <AnimatePresence>
        {isImageExpanded && project.screenshots?.[currentImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 bg-background/90 backdrop-blur-md cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsImageExpanded(false);
            }}
          >
            <button 
              type="button"
              className="absolute top-6 right-6 text-foreground/50 hover:text-foreground p-2 z-[110]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsImageExpanded(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={(project.screenshots[currentImageIndex].lightImage || project.screenshots[currentImageIndex].image) || `https://picsum.photos/seed/${project.id}-${currentImageIndex}/1200/800`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl relative z-[105]"
              alt={project.screenshots[currentImageIndex].caption || 'Expanded Artifact'}
              onClick={(e) => e.stopPropagation()}
            />
            {project.screenshots[currentImageIndex].caption && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur-md rounded-full text-sm font-medium border border-border/50 shadow-lg z-[110]">
                {project.screenshots[currentImageIndex].caption}
              </div>
            )}
            
            {/* Expanded Image Navigation */}
            {project.screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-4 text-foreground/70 hover:text-foreground bg-background/60 hover:bg-background/90 rounded-full transition-all disabled:opacity-30 backdrop-blur-md border border-border/50 z-[110]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentImageIndex === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button
                  type="button"
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-4 text-foreground/70 hover:text-foreground bg-background/60 hover:bg-background/90 rounded-full transition-all disabled:opacity-30 backdrop-blur-md border border-border/50 z-[110]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => Math.min(project.screenshots.length - 1, prev + 1));
                  }}
                  disabled={currentImageIndex === project.screenshots.length - 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectBentoGrid;