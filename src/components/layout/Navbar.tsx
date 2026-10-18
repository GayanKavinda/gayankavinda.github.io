import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@app/providers/theme-provider';
import GooeyNav from '@components/ui/GooeyNav';

// Logo
import logoMask from '@/assets/images/mask.png';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

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

// ─── Theme Toggle Button ───────────────────────────────

function ThemeButton({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
      className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all overflow-hidden"
      style={{
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(241, 245, 249, 0.9)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)'}`,
        boxShadow: isDark
          ? 'none'
          : '0 1px 3px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <MoonIcon className="w-3.5 h-3.5 text-amber-300" />
        ) : (
          <SunIcon className="w-3.5 h-3.5 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}

// ─── Main Component ────────────────────────────────────

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeId with current route when navigating away from home page
  useEffect(() => {
    if (location.pathname === '/projects') {
      setActiveId('projects');
    } else if (location.pathname === '/') {
      setActiveId('home');
    }
  }, [location.pathname]);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  // Track active section on scroll
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      // Find all target section elements in actual DOM layout order
      const sections = navItems
        .filter((item) => item.id !== 'home')
        .map((item) => {
          const el = document.getElementById(item.id);
          return {
            id: item.id,
            top: el ? el.getBoundingClientRect().top + window.scrollY : Infinity,
            height: el ? el.offsetHeight : 0,
          };
        })
        .filter((item) => item.top !== Infinity)
        .sort((a, b) => a.top - b.top);

      const scrollPos = window.scrollY + 220;

      // Top of page is Home
      if (window.scrollY < 260) {
        setActiveId('home');
        return;
      }

      // Check if user is scrolled to the bottom of the page (Contact section)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveId('contact');
        return;
      }

      // Find the last section whose top threshold has been crossed
      let currentId = 'home';
      for (const section of sections) {
        if (scrollPos >= section.top - 50) {
          currentId = section.id;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const go = (id: string) => {
    setMobileMenuOpen(false);
    setActiveId(id);
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

  const socials = [
    { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  ];

  // Island container styles (Enhanced for clean contrast and glass depth)
  const islandBg = isDark
    ? 'rgba(13, 14, 20, 0.75)'
    : 'rgba(255, 255, 255, 0.88)';
  const islandBorder = isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(15, 23, 42, 0.09)';
  const islandShadow = isDark
    ? '0 16px 40px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
    : '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04), inset 0 1px 0 #ffffff';

  const textActive = isDark ? '#ffffff' : '#0f172a';
  const textMuted = isDark ? 'rgba(255, 255, 255, 0.65)' : '#64748b';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)';

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className="fixed z-[999] top-3.5 sm:top-5 left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[96vw]"
        style={{ fontFamily: '"NotoSans_SemiCondensed-Medium", sans-serif' }}
      >
        {/* Unified Floating Island */}
        <div
          className="relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full backdrop-blur-2xl transition-all duration-300"
          style={{
            background: islandBg,
            border: `1px solid ${islandBorder}`,
            boxShadow: islandShadow,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Brand Logo & Name */}
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full group outline-none"
            aria-label="Go to home"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.08)'}`,
                boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              <img src={logoMask} alt="Gara Yaka Logo" className="w-full h-full object-cover" />
            </div>
            <span
              className="hidden md:inline text-[13px] font-bold tracking-tight"
              style={{ color: textActive }}
            >
              Gara Yaka
            </span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 relative px-1">
            <GooeyNav
              items={navItems.map((item) => ({ label: item.label, href: '#' }))}
              initialActiveIndex={Math.max(0, navItems.findIndex((i) => i.id === activeId))}
              activeIndex={Math.max(0, navItems.findIndex((i) => i.id === activeId))}
              theme={isDark ? 'dark' : 'light'}
              color="#10B981"
              activeTextColor="#ffffff"
              size="sm"
              frame={false}
              onChange={(index) => go(navItems[index].id)}
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-4 mx-0.5" style={{ background: dividerColor }} />

          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-0.5">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1.5, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = textActive)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = textMuted)}
                aria-label={social.label}
              >
                <social.icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 mx-0.5" style={{ background: dividerColor }} />

          {/* Theme Toggle Button */}
          <ThemeButton isDark={isDark} onToggle={toggleTheme} />

          {/* Resume CTA Button */}
          <motion.button
            onClick={() => window.open('/resume.pdf', '_blank')}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide uppercase rounded-full transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
            }}
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Resume</span>
          </motion.button>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-0.5"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              color: textActive,
            }}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Dropdown Menu (Clean, Modern Glass Sheet) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full mt-2.5 w-[240px] p-2 rounded-2xl backdrop-blur-2xl overflow-hidden"
              style={{
                background: isDark ? 'rgba(15, 16, 24, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                border: `1px solid ${islandBorder}`,
                boxShadow: isDark
                  ? '0 16px 40px -8px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 0, 0, 0.4)'
                  : '0 16px 40px -8px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.id)}
                      className="flex items-center justify-between px-3.5 py-2 text-[12px] font-medium rounded-xl transition-all"
                      style={{
                        background: isActive
                          ? isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.05)'
                          : 'transparent',
                        color: isActive ? textActive : textMuted,
                      }}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: 'hsl(var(--primary))' }}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Mobile Socials Row */}
                <div
                  className="flex items-center justify-around pt-2 mt-1"
                  style={{ borderTop: `1px solid ${dividerColor}` }}
                >
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>
    </>
  );
}