// src/pages/ProjectDetail.tsx
// Anime-style project detail page - clean, smooth, recruiter-focused
// Character animations, moving image slider, code quality evidence

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@components/ui/carousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Badge } from '@components/ui/badge';
import { useTheme } from '@app/providers/theme-provider';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import bgDark from '@assets/images/project_details/maki-dark2.jpeg';
import bgWhite from '@assets/images/project_details/maki-white.jpeg';
import { PROJECT_DETAILS } from '@constants/projectDetails';

// ── Character Animation Component ─────────────────────────────────────────────
const MotionSplitChars = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: '110%', opacity: 0, rotateX: -90, filter: 'blur(4px)' }}
        animate={{ y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: delay + i * 0.035, ease: [0.215, 0.61, 0.355, 1] }}
        className="inline-block"
        style={{ transformOrigin: 'bottom' }}
      >
        {char === ' ' ? ' ' : char}
      </motion.span>
    ))}
  </>
);

// ── Floating Orb Component ─────────────────────────────────────────────────────
const FloatingOrb = ({
  x, y, size, color, delay, duration,
}: { x: string; y: string; size: number; color: string; delay: number; duration: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(1px)' }}
    animate={{ y: [0, -20, 0], opacity: [0.15, 0.55, 0.15], scale: [1, 1.3, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ── Context-Aware Hotspot Component ────────────────────────────────────────────
const Hotspot = ({ x, y, link, label }: { x: string; y: string; link: string; label: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute group cursor-pointer"
      style={{ left: x, top: y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-3 h-3 rounded-full bg-[#00D4FF]"
        animate={{
          scale: isHovered ? 1.5 : 1,
          boxShadow: isHovered ? '0 0 20px rgba(0, 212, 255, 0.6)' : '0 0 10px rgba(0, 212, 255, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      />
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-4 top-0 bg-background border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap z-50"
        >
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-foreground/60 mt-0.5">{link}</p>
        </motion.div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pageRef = useRef<HTMLDivElement>(null);

  const project = PROJECT_DETAILS[slug ?? ''] ?? PROJECT_DETAILS['distributed-task-engine'];

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const colors = {
    primary: isDark ? '#FFFFFF' : '#1A1A1A',
    secondary: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
    accent1: '#00D4FF',
    accent2: '#7C5CFC',
    border: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    grid: isDark
      ? 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)'
      : 'linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)',
  };

  const orbs = isDark ? [
    { x: '62%', y: '15%', size: 6, color: 'rgba(0,212,255,0.9)', delay: 0, duration: 4.5 },
    { x: '72%', y: '35%', size: 4, color: 'rgba(124,92,252,0.9)', delay: 1, duration: 5.5 },
    { x: '80%', y: '55%', size: 5, color: 'rgba(0,212,255,0.7)', delay: 0.5, duration: 6 },
    { x: '68%', y: '70%', size: 3, color: 'rgba(255,255,255,0.8)', delay: 2, duration: 4 },
  ] : [];

  return (
    <div ref={pageRef} className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img
          src={isDark ? bgDark : bgWhite}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: isDark ? 0.7 : 0.6, mixBlendMode: isDark ? 'screen' : 'multiply' }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 40%,transparent 20%,hsl(var(--background)) 70%)' }}
        />
        {orbs.map((orb, i) => <FloatingOrb key={i} {...orb} />)}
      </motion.div>

      {/* Main Content Wrapper to sit above the background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 md:pt-24 pb-12 md:pb-16 px-6 md:px-10 max-w-[1100px] mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40 hover:text-[#00D4FF] transition-colors mb-6 group"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-1 transition-transform">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to projects
        </motion.button>

        {/* Status & Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 mb-4"
        >
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] px-2 py-0.5">
            {project.status}
          </Badge>
          <span className="font-mono text-[9px] text-foreground/30 uppercase tracking-[0.1em]">
            {project.year}
          </span>
        </motion.div>

        {/* Title with Character Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <h1 className="font-winner font-black text-[clamp(32px,6vw,56px)] text-foreground leading-[1.05] tracking-tight">
            <MotionSplitChars text={project.title} delay={0.3} />
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-[14px] md:text-[16px] text-foreground/55 max-w-[700px] leading-relaxed mb-6"
        >
          {project.tagline}
        </motion.p>

        {/* Meta Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap gap-6 mb-6 pb-6"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          {[
            { label: 'Role', value: project.role },
            { label: 'Team', value: project.team },
            { label: 'Duration', value: project.duration },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-foreground/35 mb-1">
                {item.label}
              </p>
              <p className="font-jakarta font-semibold text-[13px] text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="font-mono text-[9px] border-[#7C5CFC]/25 text-[#7C5CFC] bg-[#7C5CFC]/[0.05] px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </motion.div>

        {/* GitHub Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] bg-[#7C5CFC] text-white px-5 py-2 rounded hover:brightness-110 transition-all"
          >
            View on GitHub
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </section>

      {/* Moving Image Slider */}
      <section className="py-12 md:py-16 px-6 md:px-10 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <Carousel className="w-full" opts={{ loop: true, autoplay: { delay: 5000 } }}>
            <CarouselContent>
              {project.screenshots.map((screenshot, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="font-mono text-[12px] text-foreground/30 mb-2">
                          [{screenshot.placeholder}]
                        </p>
                        <p className="text-sm text-foreground/50 max-w-md">
                          {screenshot.caption}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
                      <p className="text-sm text-foreground/80">{screenshot.caption}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </section>

      {/* Problem & Solution */}
      <section className="py-10 md:py-12 px-6 md:px-10 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00D4FF] mb-3">
              // Problem
            </p>
            <h2 className="font-jakarta font-bold text-[22px] text-foreground mb-4">
              The Challenge
            </h2>
            <p className="text-[14px] leading-[1.7] text-foreground/65">
              {project.problem}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7C5CFC] mb-3">
              // Solution
            </p>
            <h2 className="font-jakarta font-bold text-[22px] text-foreground mb-4">
              The Approach
            </h2>
            <p className="text-[14px] leading-[1.7] text-foreground/65">
              {project.solution}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-10 md:py-12 px-6 md:px-10 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00D4FF] mb-3">
            // Architecture
          </p>
          <h2 className="font-jakarta font-bold text-[24px] text-foreground mb-6">
            System Design
          </h2>
          <p className="text-[14px] leading-[1.7] text-foreground/65 mb-8 max-w-[700px]">
            {project.architecture.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.architecture.components.map((component, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border bg-card/30 hover:border-[#00D4FF]/30 transition-colors"
              >
                <p className="font-mono text-[11px] font-semibold text-[#7C5CFC] mb-1">
                  {component.name}
                </p>
                <p className="text-[12px] text-foreground/60 leading-relaxed">
                  {component.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Code Quality Evidence */}
      <section className="py-10 md:py-12 px-6 md:px-10 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7C5CFC] mb-3">
            // Code Quality
          </p>
          <h2 className="font-jakarta font-bold text-[24px] text-foreground mb-6">
            Repository Structure
          </h2>

          <div className="space-y-1 mb-8">
            {project.codeEvidence.repoStructure.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded hover:bg-card/30 transition-colors"
              >
                <span className="font-mono text-[10px] text-foreground/40">
                  {item.type === 'dir' ? '📁' : '📄'}
                </span>
                <span className="font-mono text-[12px] text-foreground">
                  {item.name}
                </span>
                <span className="text-[11px] text-foreground/50 ml-auto">
                  {item.description}
                </span>
              </motion.div>
            ))}
          </div>

          <h3 className="font-jakarta font-semibold text-[18px] text-foreground mb-4">
            Key Implementation Files
          </h3>
          <div className="space-y-2">
            {project.codeEvidence.keyFiles.map((file, index) => (
              <motion.a
                key={index}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="block p-3 rounded-lg border border-border bg-card/30 hover:border-[#7C5CFC]/30 hover:bg-card/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-[#7C5CFC] mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-[12px] text-foreground group-hover:text-[#7C5CFC] transition-colors">
                      {file.path}
                    </p>
                    <p className="text-[11px] text-foreground/50 mt-1">
                      {file.description}
                    </p>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 16 16" fill="none"
                    className="text-foreground/30 group-hover:text-[#7C5CFC] transition-colors flex-shrink-0"
                  >
                    <path d="M1 8H15M15 8L10 3M15 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Compact Media & Resources Block */}
      <section className="py-8 px-6 md:px-10 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">
            // Media & Resources
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Demo Video */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-[#00D4FF]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#00D4FF]">
                    <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-jakarta font-semibold text-[14px] text-foreground">Demo</h3>
              </div>

              {project.videoLinks.length > 0 && (
                <motion.a
                  href={project.videoLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5 }}
                  className="block group"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted/50 mb-2">
                    {/* Screenshot-style placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/20 to-[#7C5CFC]/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="font-mono text-[10px] text-foreground/40">[VIDEO PREVIEW]</p>
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      <p className="font-mono text-[9px] text-white">3:45</p>
                    </div>
                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-jakarta font-semibold text-[13px] text-foreground group-hover:text-[#00D4FF] transition-colors">
                    {project.videoLinks[0].title}
                  </p>
                  <p className="text-[11px] text-foreground/50 mt-0.5 line-clamp-1">
                    {project.videoLinks[0].description}
                  </p>
                </motion.a>
              )}
            </div>

            {/* Column 2: Quick Access Links */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-[#7C5CFC]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#7C5CFC]">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-jakarta font-semibold text-[14px] text-foreground">Quick Access</h3>
              </div>

              <div className="space-y-2">
                {project.extraLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="block p-3 rounded-lg border border-border bg-card/20 hover:border-[#7C5CFC]/30 hover:bg-card/40 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded bg-[#7C5CFC]/10 flex items-center justify-center flex-shrink-0">
                        {link.title.toLowerCase().includes('doc') ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#7C5CFC]">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : link.title.toLowerCase().includes('api') ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#7C5CFC]">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#7C5CFC]">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-jakarta font-semibold text-[12px] text-foreground group-hover:text-[#7C5CFC] transition-colors truncate">
                          {link.title}
                        </p>
                        <p className="text-[10px] text-foreground/50 mt-0.5 line-clamp-1">
                          {link.description}
                        </p>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-foreground/30 flex-shrink-0">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Column 3: Documentation Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-[#00D4FF]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#00D4FF]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-jakarta font-semibold text-[14px] text-foreground">Documentation</h3>
              </div>

              <div className="space-y-2">
                {project.documentation.slice(0, 3).map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`doc-${index}`} className="border border-border rounded-lg bg-card/20 px-3 py-2">
                        <AccordionTrigger className="font-jakarta font-semibold text-[11px] text-foreground hover:text-[#00D4FF] transition-colors py-1">
                          <div className="flex items-center gap-2 flex-1">
                            {doc.title.toLowerCase().includes('architecture') ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#00D4FF]/60 flex-shrink-0">
                                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            ) : doc.title.toLowerCase().includes('security') ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#00D4FF]/60 flex-shrink-0">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#00D4FF]/60 flex-shrink-0">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            )}
                            <span className="truncate">{doc.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-[10px] text-foreground/60 leading-[1.6] pt-2">
                          {doc.content.length > 100 ? doc.content.substring(0, 100) + '...' : doc.content}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-10 md:py-12 px-6 md:px-10 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00D4FF] mb-3">
            // Timeline
          </p>
          <h2 className="font-jakarta font-bold text-[24px] text-foreground mb-8">
            Project Execution
          </h2>

          <div className="space-y-0">
            {project.timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-5 pb-6 last:pb-0"
              >
                <div className="flex flex-col items-center gap-0 flex-shrink-0 w-8">
                  <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold"
                    style={{
                      borderColor: index % 2 === 0 ? '#7C5CFC' : '#00D4FF',
                      color: index % 2 === 0 ? '#7C5CFC' : '#00D4FF',
                      background: `${index % 2 === 0 ? '#7C5CFC' : '#00D4FF'}12`,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {index < project.timeline.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: colors.border }} />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-jakarta font-bold text-[16px] text-foreground">
                      {item.phase}
                    </h3>
                    <Badge className="bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 text-[8px] px-2 py-0.5">
                      {item.duration}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-foreground/55 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Key Learnings */}
      <section className="py-10 md:py-12 px-6 md:px-10 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7C5CFC] mb-3">
            // Retrospective
          </p>
          <h2 className="font-winner font-bold text-[24px] text-foreground mb-6">
            Key Learnings
          </h2>

          <div className="space-y-2">
            {project.learnings.map((learning, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/30 hover:border-[#7C5CFC]/30 transition-colors"
              >
                <span className="font-mono text-[10px] text-[#7C5CFC] mt-0.5 flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-[13px] text-foreground/65 leading-relaxed">
                  {learning}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* More Projects & CTA */}
      <section className="py-10 md:py-12 px-6 md:px-10 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/30 mb-3">
              // Let's Connect
            </p>
            <h3 className="font-winner font-black text-[clamp(20px,3vw,28px)] text-foreground mb-4">
              Build Something Amazing Together
            </h3>
            <p className="text-[13px] text-foreground/60 leading-relaxed mb-6">
              Ready to bring your next project to life? Let's discuss how we can work together to create something exceptional.
            </p>
            <button
              onClick={() => navigate('/#contact')}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] bg-[#7C5CFC] text-white px-6 py-3 rounded-lg hover:brightness-110 transition-all w-full justify-center"
            >
              Start a conversation
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>

          {/* Auto-scrolling Projects */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-3">
              // More Projects
            </p>
            <h3 className="font-winner font-bold text-[20px] text-foreground mb-4">
              Explore Other Work
            </h3>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/30">
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scrollProjects {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
                .animate-scroll-projects {
                  animation: scrollProjects 30s linear infinite;
                }
                .animate-scroll-projects:hover {
                  animation-play-state: paused;
                }
                `
              }} />
              <div className="py-4">
                <div className="flex animate-scroll-projects gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-64 p-4 rounded-lg border border-border bg-card/50 hover:border-[#00D4FF]/30 transition-all cursor-pointer">
                      <div className="aspect-video rounded-lg bg-muted mb-3 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-foreground/30">Project {i + 1}</span>
                      </div>
                      <h4 className="font-jakarta font-semibold text-[14px] text-foreground mb-1">Project Name {i + 1}</h4>
                      <p className="text-[11px] text-foreground/50 line-clamp-2">Brief description of the project and its key features.</p>
                    </div>
                  ))}
                  {[...Array(4)].map((_, i) => (
                    <div key={`dup-${i}`} className="flex-shrink-0 w-64 p-4 rounded-lg border border-border bg-card/50 hover:border-[#00D4FF]/30 transition-all cursor-pointer">
                      <div className="aspect-video rounded-lg bg-muted mb-3 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-foreground/30">Project {i + 1}</span>
                      </div>
                      <h4 className="font-jakarta font-semibold text-[14px] text-foreground mb-1">Project Name {i + 1}</h4>
                      <p className="text-[11px] text-foreground/50 line-clamp-2">Brief description of the project and its key features.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
};

export default ProjectDetail;


