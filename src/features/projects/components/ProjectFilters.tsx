// src/features/projects/components/ProjectFilters.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Code2, Smartphone, ExternalLink } from 'lucide-react';
import { ProjectCategory } from '../types';

interface FilterProps {
  activeCategory: ProjectCategory;
  setActiveCategory: (cat: ProjectCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projectCount: number;
}

const categories: { id: ProjectCategory; label: string; icon: any }[] = [
  { id: 'All',         label: 'All',         icon: Globe        },
  { id: 'Web',         label: 'Web',          icon: Code2        },
  { id: 'Mobile',      label: 'Mobile',       icon: Smartphone   },
  { id: 'Open Source', label: 'Open Source',  icon: ExternalLink },
];

export const ProjectFilters = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  projectCount,
}: FilterProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div className="flex flex-col gap-4">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 px-1">
          Filter by Category
        </label>
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-200/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-sm">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  relative px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all duration-300
                  ${isActive 
                    ? 'text-white dark:text-neutral-900 bg-neutral-900 dark:bg-neutral-100 shadow-lg shadow-black/10 dark:shadow-white/5' 
                    : 'text-foreground/50 hover:text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5'}
                `}
              >
                <span className="flex items-center gap-2 relative z-10">
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-xl bg-neutral-900 dark:bg-white"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:max-w-xs">
        <div className="flex items-center justify-between px-1">
           <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
             Search Projects
           </label>
           <AnimatePresence mode="wait">
             <motion.span 
               key={projectCount}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="font-mono text-[10px] text-gold"
             >
               [{projectCount}]
             </motion.span>
           </AnimatePresence>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search keywords, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-mono tracking-tight
              bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/5
              text-foreground placeholder:text-foreground/20
              focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/30
              transition-all duration-300
            "
          />
        </div>
      </div>
    </div>
  );
};
