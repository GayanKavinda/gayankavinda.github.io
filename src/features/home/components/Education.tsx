import { motion, useMotionTemplate, useMotionValue, useTransform, useScroll } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { Badge } from '@components/ui/badge';
import { useTheme } from '@app/providers/theme-provider';
import { useImageLoader } from '@hooks/useImageLoader';

// Asset imports removed - background images removed per requirements

// ─── Data ─────────────────────────────────────────────────────────────────────

const educationData = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of Colombo',
    period: '2018 — 2022',
    status: 'Graduated',
    description: 'Focused on distributed systems, algorithms, and software engineering principles. Completed with First Class Honours.',
    highlights: ['Dean\'s List 2020, 2021', 'Thesis on Distributed Consensus'],
    color: 'var(--primary-hsl)',
    span: 'md:col-span-2'
  },
  {
    degree: 'Advanced Diploma in Software Engineering',
    institution: 'Institute of Software',
    period: '2016 — 2018',
    status: 'Completed',
    description: 'Core programming fundamentals, databases, and web development.',
    highlights: ['Best Capstone Project'],
    color: 'var(--secondary-hsl)',
    span: 'md:col-span-1'
  }
];

// ─── Bento Card Component ─────────────────────────────────────────────────────

const BentoCard = ({ item, index }: { item: typeof educationData[0], index: number }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, hsla(${item.color}, 0.15), transparent 40%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`
        relative overflow-hidden rounded-3xl cursor-pointer
        border transition-[border-color,box-shadow] duration-500 glass shimmer-border elevation-card
        ${hovered
          ? 'border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]'
          : 'border-white/[0.04] shadow-none'
        }
        ${item.span}
      `}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ background: spotlightBg, opacity: hovered ? 1 : 0 }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-50"
        style={{ background: `linear-gradient(90deg, hsla(${item.color}, 1), transparent)` }}
      />

      <div className="relative z-10 p-5 md:p-8 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <h3 className="font-jakarta font-semibold text-lg md:text-2xl text-foreground/80 dark:text-foreground tracking-tight leading-tight mb-2">
              {item.degree}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-foreground/40 uppercase tracking-wider font-medium">
                {item.institution}
              </span>
              <span className="text-foreground/20 text-xs">·</span>
              <span className="font-mono text-[11px] text-foreground/40">
                {item.period}
              </span>
            </div>
          </div>
          <Badge variant="premium" className="shrink-0 text-[10px] uppercase tracking-wider">
            {item.status}
          </Badge>
        </div>

        <p className="text-sm text-foreground/60 leading-relaxed mb-8 flex-grow">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {item.highlights.map(highlight => (
            <span
              key={highlight}
              className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 border border-white/10 rounded-full px-3 py-1.5 bg-white/5"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────

const Education = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative py-[100px] md:py-[140px] overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
    >
      {/* Parallax Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transform: `translateY(${useTransform(useScroll({ target: sectionRef, offset: ['start center', 'end center'] }).scrollY, [0, 1], [100, -100])}px)`
        }}
      >
        <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#7C5CFC]/10 via-[#00D4FF]/10 to-transparent blur-[80px]" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Academic{' '}
            <span className="font-playfair italic font-medium text-[#7C5CFC]">
              Foundation
            </span>
          </h2>
          <p className="text-sm text-foreground/40 leading-relaxed max-w-[400px]">
            Cultivating the theoretical roots of engineering excellence through rigorous academic study and applied computer science.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationData.map((item, index) => (
            <BentoCard key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
