// src/pages/ProjectDetail.tsx
// Zen Redesign: Minimal • Spacious • Intentional • Calm

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, AnimatePresence, useSpring } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import { PROJECT_DETAILS } from '@features/projects/data/projectDetails';
import LightRays from '@components/ui/LightRays';
import LightPillar from '@components/ui/LightPillar';
import BorderGlow from '@components/ui/BorderGlow';
import { CardStack } from '@components/ui/card-stack';
// import ScrollImageSequence from '@components/animations/ScrollImageSequence';
import { useReducedMotion } from '@features/projects/components/ProjectDetail/utils';
import AnimatedSection from '@features/projects/components/ProjectDetail/AnimatedSection';
import MagneticCursor from '@features/projects/components/ProjectDetail/MagneticCursor';
import GlowText from '@features/projects/components/ProjectDetail/GlowText';
import SectionLabel from '@features/projects/components/ProjectDetail/SectionLabel';
import PulseDot from '@features/projects/components/ProjectDetail/PulseDot';
import StreamingArchitecture from '@features/projects/components/ProjectDetail/StreamingArchitecture';
import Timeline from '@features/projects/components/ProjectDetail/Timeline';
import Debrief from '@features/projects/components/ProjectDetail/Debrief';
import SidebarTOC, { SECTIONS } from '@features/projects/components/ProjectDetail/SidebarTOC';
import ProjectBentoGrid from '@features/projects/components/ProjectDetail/ProjectBentoGrid';

// ── Main component ───────────────────────────────────────────────────────────
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTOC, setActiveTOC] = useState('overview');
  const [previewIndex, setPreviewIndex] = useState<number>(-1);

  // Responsive card sizing — CardStack uses fixed pixel widths
  const [cardDims, setCardDims] = useState({ w: 420, h: 280 });
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
      if (vw < 480) setCardDims({ w: Math.min(300, vw - 40), h: 200 });
      else if (vw < 768) setCardDims({ w: Math.min(360, vw - 60), h: 240 });
      else setCardDims({ w: 420, h: 280 });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const project = PROJECT_DETAILS[slug ?? ''] ?? PROJECT_DETAILS['distributed-task-engine'];

  // Derive gallery images array once
  const galleryImages = (project.screenshots ?? []).map(
    (shot: any, idx: number) => {
      const img = isDark ? shot.image : (shot.lightImage || shot.image);
      return img || `https://picsum.photos/seed/${project.id}-${idx}/900/600`;
    }
  );
  const previewImage = previewIndex >= 0 ? galleryImages[previewIndex] : null;
  const goNext = () => setPreviewIndex(i => (i + 1) % galleryImages.length);
  const goPrev = () => setPreviewIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);

  const hasCode = !!(project.github && project.github !== '#' && project.github !== null);
  const hasDoc = !!(project.docUrl && project.docUrl !== '#');
  const hasLive = !!(project.liveUrl);

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveTOC(e.target.id); }),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (previewIndex < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') setPreviewIndex(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewIndex, galleryImages.length]);

  return (
    <div ref={pageRef} className="min-h-[100dvh] relative overflow-x-hidden" style={{ background: isDark ? '#0a0a0a' : '#fafafa' }}>
      {!reducedMotion && !isTouch && <MagneticCursor />}
      <Navbar />

      {/* Progress Bar (Zen) */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left ${isDark ? 'bg-gradient-to-r from-crimson via-purple-500 to-gold' : 'bg-foreground/10'}`}
        style={{ scaleX: progressScaleX }}
      />

      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {!isDark && (
          <>
            {/* <ScrollImageSequence opacity={0.55} /> */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, transparent 20%, #fafafa 100%)',
                opacity: 0.4
              }}
            />
          </>
        )}
        <div className="absolute inset-0 opacity-30">
          {isDark && (
            <>
              <LightRays raysColor="#4f46e5" raysSpeed={0.45} noiseAmount={0.01} />
              <LightPillar
                topColor="#7C5CFC"
                bottomColor="#00D4FF"
                intensity={0.6}
                pillarWidth={2.5}
                glowAmount={0.003}
                noiseIntensity={0.2}
              />
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-28 pb-32 max-w-4xl mx-auto px-6 md:px-8">

        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/projects')}
          data-cursor="BACK"
          className="flex items-center gap-2 text-sm font-mono tracking-widest text-foreground/50 hover:text-foreground mb-16 group"
        >
          ← <span className="group-hover:underline">All Projects</span>
        </motion.button>

        {/* Cinematic Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <PulseDot color={project.status === 'Production' ? 'crimson' : 'gold'} />
            <span className="font-mono text-xs tracking-[3px] text-foreground/50">{project.status}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-light text-4xl sm:text-5xl leading-tight tracking-tighter mb-4 break-words"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-foreground/70 max-w-2xl leading-relaxed font-light"
          >
            {project.tagline}
          </motion.p>
        </div>

        {/* Bento Grid */}
        <ProjectBentoGrid project={project} />

        <main className="mt-16 space-y-24">
          {/* ════════════════════════════════════════════
              00  ZEN OVERVIEW
          ════════════════════════════════════════════ */}
          <AnimatedSection id="overview" direction="up">
            <SectionLabel num="00" title="Overview" />
            <GlowText className="text-lg leading-relaxed text-center text-foreground/80 font-light">
              {project.problem}
            </GlowText>
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              01  THE MISSION
          ════════════════════════════════════════════ */}
          <AnimatedSection id="problem" direction="left" delay={0.05}>
            <SectionLabel num="01" title="The Mission" />
            <GlowText className="text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto italic font-medium">
              {project.solution}
            </GlowText>
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              02  REAL-TIME ARCHITECTURE
          ════════════════════════════════════════════ */}
          <AnimatedSection id="system" direction="up" delay={0.05}>
            <SectionLabel num="02" title="Real-time Architecture" />
            <StreamingArchitecture
              components={project.architecture.components}
              description={project.architecture.description}
            />
          </AnimatedSection>



          {/* ════════════════════════════════════════════
              04  VISUAL EVIDENCE
          ════════════════════════════════════════════ */}
          <AnimatedSection id="evidence" direction="up">
            <SectionLabel num="04" title="Visual Evidence" />

            {/* Video Thumbnails */}
            {project.videoLinks?.length > 0 && (
              isDark ? (
                <BorderGlow
                  glowColor="124 92 252"
                  className="mb-20 rounded-[40px] overflow-hidden"
                  borderRadius={40}
                >
                  <div className="p-8 md:p-12">
                    <h4 className="font-mono uppercase tracking-widest text-sm mb-8 text-center text-foreground/40">Demonstrations</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.videoLinks.map((vid: any, i: number) => (
                        <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="group block">
                          <div className={`relative aspect-video rounded-3xl overflow-hidden ${isDark ? 'bg-black/10' : 'bg-foreground/[0.03]'}`}>
                            <img
                              src={`https://picsum.photos/seed/video-${project.id}-${i}/800/450`}
                              className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105"
                              alt={vid.title}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${isDark ? 'bg-white/10 border-white/30 backdrop-blur-md' : 'bg-foreground/5 border-foreground/10 backdrop-blur-xl'}`}
                              >
                                <div
                                  className={`w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-t-transparent border-b-transparent ml-1 ${isDark ? 'border-l-white' : 'border-l-foreground/60'}`}
                                />
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-center font-medium group-hover:text-crimson transition-colors">{vid.title}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </BorderGlow>
              ) : (
                <div className="mb-20 rounded-[40px] overflow-hidden bg-foreground/[0.02] border border-foreground/[0.08] p-8 md:p-12 shadow-sm">
                  <h4 className="font-mono uppercase tracking-widest text-sm mb-8 text-center text-foreground/30">Demonstrations</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.videoLinks.map((vid: any, i: number) => (
                      <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="group block">
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-foreground/[0.03]">
                          <img
                            src={`https://picsum.photos/seed/video-${project.id}-${i}/800/450`}
                            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                            alt={vid.title}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-16 h-16 rounded-full flex items-center justify-center border border-foreground/10 bg-white/40 backdrop-blur-xl transition-all duration-500 group-hover:scale-110"
                            >
                              <div
                                className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-t-transparent border-b-transparent border-l-foreground/40 ml-1"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-center font-medium text-foreground/70 group-hover:text-crimson transition-colors tracking-tight">{vid.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Screenshot Gallery */}
            {project.screenshots?.length > 0 && (
              <div className="flex justify-center mt-24">
                <CardStack
                  items={project.screenshots.map((shot: any, idx: number) => ({
                    id: idx,
                    title: shot.caption || `Artifact ${idx + 1}`,
                    imageSrc: (isDark ? shot.image : (shot.lightImage || shot.image)) || `https://picsum.photos/seed/${project.id}-${idx}/900/600`,
                  }))}
                  cardWidth={cardDims.w}
                  cardHeight={cardDims.h}
                  autoAdvance
                  intervalMs={4500}
                  renderCard={(item) => (
                    <div
                      className="relative h-full w-full overflow-hidden rounded-[32px] cursor-zoom-in group shadow-2xl"
                      onClick={() => setPreviewIndex(item.id as number)}
                    >
                      <img
                        src={item.imageSrc}
                        className={`w-full h-full object-cover transition-all duration-700 ${isDark ? 'grayscale-[0.4] group-hover:grayscale-0' : 'grayscale-[0.1] group-hover:grayscale-0'}`}
                        alt={item.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs tracking-widest">
                        {item.title}
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              05  EXECUTION LOG
          ════════════════════════════════════════════ */}
          <AnimatedSection id="timeline" direction="left" delay={0.05}>
            <SectionLabel num="05" title="Execution Log" />
            <Timeline items={project.timeline} />
          </AnimatedSection>

          {/* ════════════════════════════════════════════
              06  RETROSPECTIVE
          ════════════════════════════════════════════ */}
          <AnimatedSection id="debrief" direction="up" delay={0.05}>
            <SectionLabel num="06" title="Retrospective" />
            <Debrief learnings={project.learnings} />
          </AnimatedSection>
        </main>

        {/* Final CTA (Zen) */}
        <div className="mt-64 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[4px] text-foreground/30 mb-8 font-bold">Colombo, Sri Lanka</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/#contact')}
            className="inline-block px-16 py-8 border border-foreground/10 hover:border-foreground/30 rounded-full text-xl font-light transition-all shadow-sm hover:shadow-md bg-white dark:bg-transparent"
          >
            Start a Conversation
          </motion.button>
        </div>
      </div>

      <Footer />

      {/* ── Image Expand Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-0 md:p-16"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={() => setPreviewIndex(-1)}
          >
            {/* ── Close button ─────────────────────────────── */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-white/80 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => { e.stopPropagation(); setPreviewIndex(-1); }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="font-mono text-[11px] uppercase tracking-widest">Close</span>
              <span className="font-mono text-[10px] text-white/40 ml-0.5">ESC</span>
            </motion.button>

            {/* ── Prev / Next ───────────────────────────────── */}
            {galleryImages.length > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: 0.12, duration: 0.2 }}
                className="absolute left-4 md:left-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
            )}
            {galleryImages.length > 1 && (
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: 0.12, duration: 0.2 }}
                className="absolute right-4 md:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            )}

            {/* ── Expanded image ────────────────────────────── */}
            <motion.div
              key={previewIndex}
              drag={!reducedMotion ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 150) setPreviewIndex(-1);
              }}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -12 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="relative w-full md:max-w-full h-full md:h-auto md:max-h-[84vh] rounded-none md:rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,92,252,0.25)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage!}
                alt={`Screenshot ${previewIndex + 1}`}
                className={`block w-full h-full md:max-h-[84vh] object-contain md:object-contain transition-all duration-500 ${!isDark && !project.screenshots[previewIndex].lightImage ? 'invert-[0.9] hue-rotate-180 contrast-125' : ''}`}
                draggable={false}
              />
              {/* Bottom info bar */}
              {galleryImages.length > 1 && (
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
                >
                  <span className="font-mono text-[12px] text-white/60 uppercase tracking-widest">
                    {previewIndex + 1} / {galleryImages.length}
                  </span>
                  {/* Dot strip */}
                  <div className="flex items-center gap-1.5">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setPreviewIndex(i); }}
                        style={{
                          width: i === previewIndex ? 18 : 5,
                          height: 5,
                          borderRadius: 3,
                          background: i === previewIndex ? '#7c5cfc' : 'rgba(255,255,255,0.25)',
                          transition: 'all 0.25s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default ProjectDetail;