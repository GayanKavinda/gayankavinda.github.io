import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';

// Thumbnails
import projectsThumbDark from '@/assets/images/selected-projects/gojo-dark-left.webp';
import projectsThumbLight from '@/assets/images/selected-projects/gojo-white-left.webp';
import experienceThumbDark from '@/assets/images/experience/yuta-dark.webp';
import experienceThumbLight from '@/assets/images/experience/yuta-white.webp';
import aboutThumbDark from '@/assets/images/about/nobara-dark-right_side.webp';
import aboutThumbLight from '@/assets/images/about/nobara-white-right_side.webp';
import contactThumbDark from '@/assets/images/contact/Yuji_Itadori_dark.webp';
import contactThumbLight from '@/assets/images/contact/Yuji_Itadori_white.webp';

// Logo
import logoMask from '@/assets/images/mask.png';

type Section = {
  id: string;
  label: string;
  thumb: { dark: string; light: string };
};

const sections: Section[] = [
  { id: 'projects', label: 'Projects', thumb: { dark: projectsThumbDark, light: projectsThumbLight } },
  { id: 'experience', label: 'Experience', thumb: { dark: experienceThumbDark, light: experienceThumbLight } },
  { id: 'about', label: 'About', thumb: { dark: aboutThumbDark, light: aboutThumbLight } },
  { id: 'contact', label: 'Contact', thumb: { dark: contactThumbDark, light: contactThumbLight } },
];

const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E")`;

// ─── Icons ─────────────────────────────────────────────

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ─── Custom Theme Toggle ───────────────────────────────

function ThemeSwitch({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
      className="relative w-[52px] h-[28px] rounded-full flex items-center px-[3px] shrink-0"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
      }}
    >
      <motion.div
        className="absolute w-[20px] h-[20px] rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? <MoonIcon className="w-3 h-3 text-white" /> : <SunIcon className="w-3 h-3 text-white" />}
      </motion.div>
    </motion.button>
  );
}

// ─── Main Component ────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const go = (id: string) => {
    setIsOpen(false);
    if (id === 'home') {
      if (location.pathname !== '/') navigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─── Theme Tokens ─────────────────────────────────
  const triggerBg = isDark ? '#09090b' : '#ffffff';
  const triggerBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const triggerShadow = isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)';
  const triggerText = isDark ? '#ffffff' : '#1f2937';
  const triggerIcon = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

  const panelBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)';
  const panelShadow = isDark
    ? '0 20px 40px -12px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)'
    : '0 20px 40px -12px rgba(0,0,0,0.08), 0 0 40px rgba(0,0,0,0.06)';
  const glow = isDark
    ? 'radial-gradient(circle at 50% -30%, hsl(var(--primary) / 0.35), hsl(var(--primary) / 0.12), transparent 70%)'
    : 'radial-gradient(circle at 50% -30%, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.05), transparent 70%)';
  const topLine = 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.3), transparent)';
  const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

  const btnBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const btnBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';

  const iconMuted = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const iconHover = isDark ? '#ffffff' : '#111827';
  const textPrimary = isDark ? '#ffffff' : '#111827';

  const logoBg = isDark ? '#1a1a1a' : '#f5f5f5';
  const logoBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)';

  const closeBtnIcon = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const closeBtnHover = isDark ? '#ffffff' : '#000000';

  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const cardBorderHover = 'hsl(var(--primary) / 0.55)';
  const cardGlow = 'hsl(var(--primary) / 0.16)';

  const resumeGradient = 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)';

  const socials = [
    { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  ];

  return (
    <>
      <div
        className="fixed z-[999] top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        style={{ fontFamily: '"NotoSans_SemiCondensed-Medium", sans-serif' }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="trigger"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 max-w-[94vw] px-1"
            >
              <ThemeSwitch isDark={isDark} onToggle={toggleTheme} />

              <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.5 }}
                className="relative"
              >
                <div
  className="relative flex items-center justify-between w-[130px] sm:w-[170px] px-2.5 sm:px-3.5 py-2 rounded-2xl"
  style={{ background: triggerBg, border: `1px solid ${triggerBorder}`, boxShadow: triggerShadow }}
>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden"
                      style={{ background: logoBg }}
                    >
                      <img src={logoMask} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="hidden xs:inline text-[12px] font-semibold tracking-tight truncate" style={{ color: triggerText }}>
      Gara Yaka
    </span>
                  </div>
                  <MenuIcon className="w-3.5 h-3.5" style={{ color: triggerIcon }} />
                </div>
              </motion.button>

              <div
                className="hidden sm:flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl"
                style={{ background: triggerBg, border: `1px solid ${triggerBorder}`, boxShadow: triggerShadow }}
              >
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ color: iconMuted }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = iconHover)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = iconMuted)}
                    aria-label={social.label}
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </motion.a>
                ))}
              </div>

              <motion.button
  onClick={() => window.open('/resume.pdf', '_blank')}
  whileHover={{ scale: 1.03, y: -1 }}
  whileTap={{ scale: 0.97 }}
  className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-[11px] font-semibold tracking-wide uppercase"
  style={{
    background: resumeGradient,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    color: '#ffffff',
    boxShadow: triggerShadow,
  }}
>
  <DownloadIcon className="w-3.5 h-3.5" />
  <span className="hidden sm:inline">Resume</span>
</motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative w-[calc(100vw-2rem)] sm:w-auto"
            >
              <div
                className="absolute -inset-5 rounded-[3rem] opacity-60 pointer-events-none"
                style={{ background: glow, filter: 'blur(20px)' }}
              />

              <div
                className="relative rounded-2xl overflow-hidden backdrop-blur-2xl"
                style={{
                  background: isDark
                    ? 'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.22), transparent 70%), rgba(10, 10, 10, 0.65)'
                    : 'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.12), transparent 70%), rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${panelBorder}`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), ${panelShadow}`,
                }}
              >
                <div className="absolute inset-0 opacity-70 mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseSvg }} />
                <div className="absolute top-0 left-8 right-8 h-px" style={{ background: topLine }} />

                <div className="relative p-4">
                  <div className="flex items-center justify-between mb-3.5">
                    <button onClick={() => go('home')} className="flex items-center gap-2 group">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
                        style={{ background: logoBg, border: `1px solid ${logoBorder}` }}
                      >
                        <img src={logoMask} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[13px] font-semibold tracking-tight" style={{ color: textPrimary }}>
                        Gara Yaka
                      </span>
                    </button>

                    <motion.button
                      onClick={() => setIsOpen(false)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: closeBtnIcon }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = closeBtnHover)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = closeBtnIcon)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:flex-nowrap justify-center gap-2.5">
                    {sections.map((section, index) => (
                      <NavCard
                        key={section.id}
                        section={section}
                        index={index}
                        isHovered={hoveredId === section.id}
                        onHover={() => setHoveredId(section.id)}
                        onLeave={() => setHoveredId(null)}
                        onClick={() => go(section.id)}
                        cardBorder={cardBorder}
                        cardBorderHover={cardBorderHover}
                        cardGlow={cardGlow}
                      />
                    ))}
                  </div>

                  <div className="mt-3.5 pt-3 flex items-center justify-center" style={{ borderTop: `1px solid ${divider}` }}>
                    <motion.button
                      onClick={() => {
                        setIsOpen(false);
                        window.open('/resume.pdf', '_blank');
                      }}
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-semibold tracking-wide uppercase"
                      style={{
                        background: resumeGradient,
                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                        color: '#ffffff',
                        boxShadow: isDark ? '0 0 15px hsl(var(--primary) / 0.3)' : 'none',
                      }}
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[998] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Navigation Card ───────────────────────────────────

function NavCard({
  section,
  index,
  isHovered,
  onHover,
  onLeave,
  onClick,
  cardBorder,
  cardBorderHover,
  cardGlow,
}: {
  section: Section;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  cardBorder: string;
  cardBorderHover: string;
  cardGlow: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.03, duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      className="relative flex-shrink-0 w-full sm:w-[125px] group outline-none"
    >
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300"
        style={{
          border: `1px solid ${isHovered ? cardBorderHover : cardBorder}`,
          boxShadow: isHovered ? `0 10px 24px -8px ${cardGlow}, 0 0 14px ${cardGlow}` : '0 3px 10px rgba(0,0,0,0.15)',
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={section.thumb.dark}
            alt={section.label}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,5,30,0.92) 0%, rgba(10,5,30,0.4) 55%, transparent 100%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-white/90 font-mono">
                {section.label}
              </span>
              <motion.svg
                width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                animate={{ x: isHovered ? 2 : 0, opacity: isHovered ? 1 : 0.3 }}
                transition={{ duration: 0.15 }}
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </motion.svg>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: 'hsl(var(--primary))' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.button>
  );
}