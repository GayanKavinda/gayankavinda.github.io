// src/features/projects/components/ProjectGrid.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface GridProps {
  projects: Project[];
}

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="flex flex-col items-center justify-center py-32 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-6">
       <Search className="w-8 h-8 text-foreground/20" />
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-2">No projects found</h3>
    <p className="text-sm text-foreground/40 font-mono tracking-tight max-w-xs mx-auto">
      Try adjusting your search terms or selecting a different category.
    </p>
  </motion.div>
);

export const ProjectGrid = ({ projects }: GridProps) => {
  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={project.featured ? 'md:col-span-2 lg:col-span-1' : ''}
                // We keep it span 1 on large screens for a balanced 3-col grid,
                // but let it span 2 on tablets (2-col) if desired.
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
};
