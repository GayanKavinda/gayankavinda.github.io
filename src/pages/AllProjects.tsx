// src/pages/AllProjects.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, AnimatePresence, LayoutGroup, useMotionTemplate } from 'framer-motion';
import { Search, ExternalLink, Code2, Smartphone, Globe } from 'lucide-react';
import Navbar from '@shared/components/layout/Navbar';
import Footer from '@shared/components/layout/Footer';
import { setSEO } from '@shared/lib/seo';
import { useTheme } from '@app/providers/theme-provider';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Project {
  slug: string;
  name: string;
  desc: string;
  tags: string[];
  cat: 'Web' | 'Mobile' | 'Open Source';
  featured?: boolean;
  gradient?: string;
}

const allProjects: Project[] = [
  {
    slug: 'distributed-task-engine',
    name: 'Distributed Task Engine',
    desc: 'High-throughput task orchestration system processing 1M+ jobs/day',
    tags: ['Go', 'Kafka', 'Redis'],
    cat: 'Web',
    featured: true,
    gradient: 'dark:from-violet-900/30 from-violet-200/50 dark:via-purple-900/20 via-purple-100/30'
  },
  {
    slug: 'real-time-analytics',
    name: 'Real-time Analytics',
    desc: 'WebSocket-driven dashboard with live data visualization',
    tags: ['React', 'D3.js', 'Node.js'],
    cat: 'Web',
    featured: true,
    gradient: 'dark:from-cyan-900/30 from-cyan-200/50 dark:via-blue-900/20 via-blue-100/30'
  },
  {
    slug: 'authshield-sdk',
    name: 'AuthShield SDK',
    desc: 'Zero-trust authentication SDK with biometric support',
    tags: ['TypeScript', 'OAuth'],
    cat: 'Open Source',
    gradient: 'dark:from-emerald-900/30 from-emerald-200/50 dark:via-teal-900/20 via-teal-100/30'
  },
  {
    slug: 'datapipe',
    name: 'DataPipe',
    desc: 'Real-time ETL pipeline for big data processing',
    tags: ['Python', 'Kafka'],
    cat: 'Web',
    gradient: 'dark:from-orange-900/30 from-orange-200/50 dark:via-amber-900/20 via-amber-100/30'
  },
  {
    slug: 'clouddash',
    name: 'CloudDash',
    desc: 'Infrastructure monitoring and alerting platform',
    tags: ['React', 'AWS'],
    cat: 'Web',
    gradient: 'dark:from-rose-900/30 from-rose-200/50 dark:via-pink-900/20 via-pink-100/30'
  },
  {
    slug: 'apiforge',
    name: 'APIForge',
    desc: 'High-performance API gateway framework',
    tags: ['Go', 'gRPC'],
    cat: 'Open Source',
    gradient: 'dark:from-slate-900/30 from-slate-200/50 dark:via-gray-900/20 via-gray-100/30'
  },
  {
    slug: 'mobiletrack',
    name: 'MobileTrack',
    desc: 'Real-time GPS tracking app with offline support',
    tags: ['React Native', 'Firebase'],
    cat: 'Mobile',
    gradient: 'dark:from-lime-900/30 from-lime-200/50 dark:via-green-900/20 via-green-100/30'
  },
  {
    slug: 'chatscale',
    name: 'ChatScale',
    desc: 'Scalable chat infrastructure handling 10K concurrent users',
    tags: ['Node.js', 'WebSocket'],
    cat: 'Web',
    gradient: 'dark:from-blue-900/30 from-blue-200/50 dark:via-cyan-900/20 via-cyan-100/30'
  },
  {
    slug: 'devmetrics',
    name: 'DevMetrics',
    desc: 'Developer productivity analytics and insights tool',
    tags: ['TypeScript', 'PostgreSQL'],
    cat: 'Open Source',
    gradient: 'dark:from-fuchsia-900/30 from-fuchsia-200/50 dark:via-purple-900/20 via-purple-100/30'
  },
];

const categories = [
  { id: 'All', label: 'All Projects', icon: Globe },
  { id: 'Web', label: 'Web Apps', icon: Code2 },
  { id: 'Mobile', label: 'Mobile', icon: Smartphone },
  { id: 'Open Source', label: 'Open Source', icon: ExternalLink },
];

// ─── Project Card Component ──────────────────────────────────────────────────

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();

  // Mouse tracking for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const cardX = useSpring(0, springConfig);
  const cardY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    const pullStrength = 8;
    cardX.set((e.clientX - centerX) / pullStrength);
    cardY.set((e.clientY - centerY) / pullStrength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    cardX.set(0);
    cardY.set(0);
  };

  // Spotlight color needs dynamic JS check because it depends on a style prop, not a class
  const spotlightColor = resolvedTheme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.04)';

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`
        group relative overflow-hidden rounded-3xl cursor-pointer
        ${project.featured ? 'md:col-span-2 md:row-span-2' : ''}
      `}
      style={{ x: cardX, y: cardY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/projects/${project.slug}`)}
    >
      {/* Border Wrapper with Gradient - utilizing Tailwind dark: */}
      <div className="
        absolute inset-0 rounded-3xl p-[1px]
        bg-gradient-to-br transition-all duration-500
        from-neutral-200/60 via-neutral-100/40 to-transparent
        dark:from-white/10 dark:via-white/5 dark:to-transparent
        group-hover:from-neutral-300/60 group-hover:via-neutral-200/40
        dark:group-hover:from-white/20 dark:group-hover:via-white/10
      ">
        <div className="
          w-full h-full rounded-[calc(1.5rem-1px)]
          bg-white/90 dark:bg-neutral-950/90
          backdrop-blur-xl
        " />
      </div>

      {/* Spotlight Effect - Uses JS because it depends on mouse coordinates */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-8">

        {/* Animated Gradient Background - utilizing Tailwind dark: */}
        <div className={`
          absolute inset-0 rounded-3xl opacity-30 dark:opacity-50
          bg-gradient-to-br ${project.gradient || 'from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900'}
          group-hover:opacity-50 dark:group-hover:opacity-70 transition-opacity duration-500
        `}>
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>

        {/* Category Badge - utilizing Tailwind dark: */}
        <div className="relative z-10 mb-auto">
          <span className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider
            bg-black/5 text-black/70 border border-black/10
            dark:bg-white/10 dark:text-white/70 dark:border-white/20
          ">
            {project.cat === 'Web' && <Globe className="w-3 h-3" />}
            {project.cat === 'Mobile' && <Smartphone className="w-3 h-3" />}
            {project.cat === 'Open Source' && <Code2 className="w-3 h-3" />}
            {project.cat}
          </span>
        </div>

        {/* Project Info - utilizing Tailwind dark: */}
        <div className="relative z-10 mt-auto">
          <h3 className="
            font-jakarta font-bold text-xl md:text-2xl tracking-tight mb-2
            text-neutral-900 dark:text-white
            group-hover:text-gold transition-colors duration-300
          ">
            {project.name}
          </h3>

          <p className="
            text-sm leading-relaxed mb-4
            text-neutral-600 dark:text-neutral-400
            line-clamp-2
          ">
            {project.desc}
          </p>

          {/* Tags - utilizing Tailwind dark: */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="
                  text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md
                  bg-black/5 text-black/60 border border-black/10
                  dark:bg-white/5 dark:text-white/60 dark:border-white/10
                "
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA - utilizing Tailwind dark: */}
          <div className="
            flex items-center gap-2 text-sm font-medium
            text-neutral-900 dark:text-gold
            group-hover:gap-3 transition-all duration-300
          ">
            View Case Study
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="stroke-current"
              animate={{ x: isHovered ? 4 : 0 }}
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AllProjects = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filtering logic
  const filtered = allProjects.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.cat === activeCategory;
    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setSEO({
      title: 'All Projects',
      description: 'A complete portfolio of web apps, mobile applications, and open source contributions.'
    });
    return () => setSEO();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />

      <div className="pt-28 md:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button - utilizing Tailwind dark: */}
        <motion.button
          onClick={() => navigate('/#projects')}
          className="
            inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider mb-10
            text-neutral-600 hover:text-neutral-900
            dark:text-neutral-500 dark:hover:text-gold
            transition-colors group
          "
          whileHover={{ x: -4 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
            <path d="M10 3L5 8l5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </motion.button>

        {/* Header - utilizing Tailwind dark: */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider mb-4
              bg-neutral-200 text-neutral-600 border border-neutral-300
              dark:bg-white/5 dark:text-neutral-400 dark:border-white/10
            ">
              <Code2 className="w-3.5 h-3.5" />
              Portfolio
            </span>

            <h1 className="
              font-jakarta font-extrabold text-4xl md:text-6xl tracking-tight mb-4
              text-neutral-900 dark:text-white
            ">
              All Projects
            </h1>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
              A curated collection of production applications, open source tools, and experimental projects.
            </p>
          </motion.div>
        </div>

        {/* Filters & Search - utilizing Tailwind dark: */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">

          {/* Category Tabs */}
          <div className="
            flex gap-2 p-1 rounded-2xl w-full md:w-auto
            bg-neutral-200/50 dark:bg-white/5
          ">
            {categories.map(cat => {
              const count = cat.id === 'All'
                ? allProjects.length
                : allProjects.filter(p => p.cat === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    relative px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-300 whitespace-nowrap
                    ${activeCategory === cat.id
                      ? 'bg-white dark:bg-white text-neutral-900 shadow-lg dark:shadow-none'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded-full
                      ${activeCategory === cat.id
                        ? 'bg-neutral-900/10 text-neutral-900'
                        : 'bg-neutral-300 text-neutral-600 dark:bg-white/10 dark:text-neutral-500'
                      }
                    `}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-2xl text-sm
                bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400
                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-neutral-500
                focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all
              "
            />
          </div>
        </div>

        {/* Projects Grid */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
                layout
              >
                {filtered.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="
                  inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
                  bg-neutral-200 dark:bg-white/5
                ">
                  <Search className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                  No projects found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-500">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      <Footer />
    </div>
  );
};

export default AllProjects;