// src/pages/AllProjects.tsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { setSEO } from '@lib/seo';

import { allProjects } from '@features/projects/data/projectData';
import { ProjectCategory } from '@features/projects/types';
import { ProjectFilters } from '@features/projects/components/ProjectFilters';
import { ProjectGrid } from '@features/projects/components/ProjectGrid';

const AllProjects = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProjects = useMemo(() =>
    allProjects.filter(p => {
      const matchesCat = activeCategory === 'All' || p.cat === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.desc.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    }),
    [activeCategory, searchQuery],
  );

  useEffect(() => {
    setSEO({
      title: 'Full Portfolio | Gayan Kavinda',
      description: 'Explore the complete archive of production-ready applications, open-source systems, and architectural experiments.',
    });
    return () => setSEO();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500 selection:bg-gold/30 selection:text-gold relative overflow-hidden">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-crimson/5 rounded-full blur-[80px] will-change-transform opacity-70" />
        <div className="absolute bottom-[20%] right-[-5%] w-[45%] h-[45%] bg-gold/5 rounded-full blur-[100px] will-change-transform opacity-70" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.012] dark:opacity-[0.015] mix-blend-overlay pointer-events-none" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-12 pb-12 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* Navigation / Back */}
        <motion.button
          onClick={() => navigate('/#projects')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40 hover:text-crimson transition-colors mb-6"
        >
          <div className="w-5 h-5 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:bg-crimson/5 group-hover:border-crimson/20 transition-all">
            <ChevronLeft className="w-2.5 h-2.5" />
          </div>
          Back to Featured
        </motion.button>

        {/* Header Section */}
        <header className="mb-8">
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="font-playfair font-bold text-3xl md:text-4xl tracking-tight text-foreground mb-3"
           >
             Selected{' '}
             <span className="font-playfair italic font-medium text-primary">Projects</span>
           </motion.h1>

           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="text-xs md:text-sm text-foreground/50 max-w-2xl leading-relaxed italic font-medium"
           >
             A curated collection of engineering solutions, from high-throughput distributed systems to pixel-perfect mobile interfaces. Use the filters below to browse by technical focus.
           </motion.p>
        </header>

        {/* Filters & Grid */}
        <LayoutGroup>
          <ProjectFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            projectCount={filteredProjects.length}
          />

          <ProjectGrid projects={filteredProjects} />
        </LayoutGroup>

      </main>

      <Footer />
    </div>
  );
};

export default AllProjects;