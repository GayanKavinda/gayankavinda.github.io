import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@components/common/ThemeToggle';
import { useTheme } from '@app/providers/theme-provider';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const isProjectDetail = location.pathname.startsWith('/projects/') && location.pathname !== '/projects';

  const handleBackToProjects = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/projects');
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const options = { threshold: 0.5, rootMargin: "-80px 0px -50% 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    if (id === 'home') {
      if (location.pathname !== '/') navigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
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
    setActiveSection(id);
  };

  // ─── Theme-aware style tokens ─────────────────────────────────────────────
  const pillBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center',
    background: isDark ? 'rgba(15, 15, 15, 0.45)' : 'rgba(255, 255, 255, 0.45)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  };
  const textMuted = isDark ? 'rgba(245,240,232,0.45)' : 'rgba(26,26,46,0.72)';
  const textActive = isDark ? 'rgba(245,240,232,0.9)' : '#0a0a14';
  const scrolledBg = isDark ? 'rgba(10, 10, 10, 0.65)' : 'rgba(255, 255, 255, 0.65)';
  const scrolledBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const dropdownBg = isDark ? 'rgba(15, 15, 15, 0.75)' : 'rgba(255, 255, 255, 0.75)';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <>
      {/* ════════════════════════════════════════
          DESKTOP NAVBAR
      ════════════════════════════════════════ */}
      <div className="hidden lg:block fixed z-[999] top-0 left-0 right-0 pointer-events-none">

        {/* ── SCROLLED STATE ── */}
        <nav
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            background: scrolledBg,
            borderBottom: `1px solid ${scrolledBorder}`,
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            height: 56, padding: '0 40px',
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: scrolled ? 'auto' : 'none',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => go('home')}
            aria-label="Go to home"
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#7C5CFC', fontWeight: 900, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            GY.
          </button>
          {/* Centered links */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="relative py-1 group"
                style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 10,
                  color: activeSection === l.id ? textActive : textMuted,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase', background: 'none', border: 'none',
                  cursor: 'pointer', transition: 'color 0.3s ease',
                }}
              >
                <span className="relative z-10">{l.label}</span>
                {activeSection === l.id && (
                  <motion.div
                    layoutId="nav-active-scroll"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          {/* Right: Resume + Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => window.open('/resume.pdf', '_blank')}
              aria-label="Download resume"
              style={{
                fontFamily: "'DM Mono',monospace", fontSize: 10,
                color: '#7C5CFC', letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '6px 18px', borderRadius: 50,
                border: '1px solid rgba(124,92,252,0.30)',
                background: 'rgba(124,92,252,0.06)', cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,92,252,0.10)'; e.currentTarget.style.borderColor = 'rgba(124,92,252,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,92,252,0.06)'; e.currentTarget.style.borderColor = 'rgba(124,92,252,0.30)'; }}
            >
              ↓ Resume
            </button>
            <ModeToggle />
          </div>
        </nav>

        {/* ── Docked Back Button (Desktop) ── */}
        <AnimatePresence>
          {scrolled && isProjectDetail && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'absolute', top: 56, left: 40,
                zIndex: -1, // Behind the main navbar but above content
                pointerEvents: 'auto'
              }}
            >
              <button
                onClick={handleBackToProjects}
                className="group"
                style={{
                   display: 'flex', alignItems: 'center', gap: 8,
                   background: scrolledBg,
                   border: `1px solid ${scrolledBorder}`,
                   borderTop: 'none',
                   padding: '6px 16px',
                   borderRadius: '0 0 16px 16px',
                   backdropFilter: 'blur(20px) saturate(180%)',
                   WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                   cursor: 'pointer',
                   boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.06)'
                }}
              >
                 <span style={{ color: '#7C5CFC', fontSize: 12 }} className="group-hover:-translate-x-0.5 transition-transform">←</span>
                 <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Back to Projects</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PILL STATE ── */}
        <nav
          style={{
            ...pillBase,
            position: 'absolute', top: 20, left: '50%',
            transform: `translateX(-50%) scale(${scrolled ? 0.95 : 1})`,
            opacity: scrolled ? 0 : 1,
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: scrolled ? 'none' : 'auto',
            padding: '8px 10px 8px 16px', gap: 2, whiteSpace: 'nowrap'
          }}
        >
          {/* Logo */}
          <button
            onClick={() => go('home')}
            style={{
              fontFamily: "'Playfair Display',serif", fontSize: 15,
              color: '#7C5CFC', fontWeight: 900, marginRight: 8,
              paddingRight: 14, borderRight: '1px solid rgba(0,0,0,0.08)',
              background: 'none', border: 'none', borderRadius: 0, cursor: 'pointer',
            }}
          >
            GY.
          </button>
          {/* Links */}
          {navLinks.map(l => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="relative px-3 py-1.5 group"
              style={{
                fontFamily: "'DM Mono',monospace", fontSize: 10,
                color: activeSection === l.id ? textActive : textMuted,
                letterSpacing: '0.14em',
                textTransform: 'uppercase', borderRadius: 50,
                border: 'none', background: 'none',
                cursor: 'pointer', transition: 'color 0.3s',
              }}
            >
              <span className="relative z-10">{l.label}</span>
              {activeSection === l.id && (
                <motion.div
                  layoutId="nav-active-pill"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          {/* Divider */}
          <div style={{ width: 1, height: 14, background: dividerColor, margin: '0 6px', flexShrink: 0 }} />
          {/* Resume pill */}
          <button
            onClick={() => window.open('/resume.pdf', '_blank')}
            style={{
              fontFamily: "'DM Mono',monospace", fontSize: 10,
              color: '#7C5CFC', letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '6px 16px', borderRadius: 50,
              border: '1px solid rgba(124,92,252,0.30)',
              background: 'rgba(124,92,252,0.06)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,92,252,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,92,252,0.06)'; }}
          >
            ↓ Resume
          </button>
          {/* Theme toggle */}
          <div style={{ margin: '0 4px', flexShrink: 0 }}><ModeToggle /></div>
        </nav>
      </div>

      {/* ── MOBILE NAVBAR ── */}
      <div 
        className="lg:hidden fixed top-0 left-0 right-0 z-[999] pointer-events-none"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >


        {/* ── MOBILE HEADER (Unified Pill) ── */}
        <div 
          className="relative w-full h-14 mt-2 px-4 pointer-events-auto"
          style={{ touchAction: 'manipulation' }}
        >
          <motion.div
            style={{
              ...pillBase,
              position: 'absolute', inset: '0 16px',
              justifyContent: 'space-between',
              padding: '0 16px',
              display: 'flex', alignItems: 'center',
              boxShadow: scrolled 
                ? (isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.12)')
                : (isDark ? '0 8px 32px rgba(0,0,0,0.37)' : '0 8px 32px rgba(31,38,135,0.07)'),
              transition: 'box-shadow 0.4s ease',
            }}
          >
            <button 
              onClick={() => go('home')} 
              aria-label="Go to home"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}
            >
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: '#7C5CFC', fontWeight: 900 }}>GY.</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: textMuted, letterSpacing: '0.05em' }}>Gara Yaka</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ModeToggle />
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                style={{
                  width: 42, height: 42, borderRadius: '50%',
                  border: `1px solid ${dividerColor}`,
                  background: menuOpen ? 'rgba(124,92,252,0.08)' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 5, cursor: 'pointer',
                  transition: 'background-color 0.3s, border-color 0.3s',
                }}
              >
                <span style={{ display: 'block', width: 14, height: 1, background: menuOpen ? '#7C5CFC' : textActive, borderRadius: 1, transform: menuOpen ? 'rotate(45deg) translate(3px, 4px)' : 'none', transition: 'transform 0.3s' }} />
                <span style={{ display: 'block', width: menuOpen ? 0 : 10, height: 1, background: textActive, borderRadius: 1, transition: 'width 0.3s', opacity: menuOpen ? 0 : 1 }} />
                <span style={{ display: 'block', width: 14, height: 1, background: menuOpen ? '#7C5CFC' : textActive, borderRadius: 1, transform: menuOpen ? 'rotate(-45deg) translate(3px, -4px)' : 'none', transition: 'transform 0.3s' }} />
              </button>
            </div>

            {/* Back Button (Only on Project Detail + Scrolled) */}
            <AnimatePresence>
              {scrolled && isProjectDetail && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ position: 'absolute', top: '100%', left: 24, zIndex: -1 }}
                >
                  <button
                    onClick={handleBackToProjects}
                    aria-label="Back to projects"
                    style={{
                       display: 'flex', alignItems: 'center', gap: 6,
                       background: isDark ? 'rgba(15, 15, 15, 0.65)' : 'rgba(255, 255, 255, 0.65)',
                       border: `1px solid ${dividerColor}`,
                       borderTop: 'none', padding: '6px 14px',
                       borderRadius: '0 0 14px 14px',
                       backdropFilter: 'blur(20px) saturate(180%)',
                       WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                       cursor: 'pointer',
                       boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.45)' : '0 4px 16px rgba(0,0,0,0.08)',
                       transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
                    }}
                  >
                     <span style={{ color: '#7C5CFC', fontSize: 12 }}>←</span>
                     <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Projects</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Dropdown menu */}
        <div style={{
          position: 'absolute', top: scrolled ? 68 : 80, left: 16, right: 16,
          pointerEvents: menuOpen ? 'auto' : 'none',
          background: dropdownBg,
          border: `1px solid ${scrolledBorder}`,
          borderRadius: 24,
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          overflow: 'hidden',
          maxHeight: menuOpen ? 600 : 0,
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, max-height 0.4s ease',
          boxShadow: isDark ? '0 24px 48px -12px rgba(0,0,0,0.5)' : '0 24px 48px -12px rgba(0,0,0,0.12)',
          overscrollBehavior: 'contain'
        }}>
          <div style={{ padding: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Ultra-Clean Link List */}
            <div 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, touchAction: 'manipulation' }}
            >
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  aria-label={`Go to ${l.label}`}
                  style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 13,
                    color: isDark ? 'rgba(245,240,232,0.55)' : 'rgba(26,26,46,0.55)', letterSpacing: '0.25em',
                    textTransform: 'uppercase', background: 'none', border: 'none',
                    cursor: 'pointer', transition: 'color 0.2s ease', padding: '8px 16px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = textActive}
                  onMouseLeave={e => e.currentTarget.style.color = isDark ? 'rgba(245,240,232,0.55)' : 'rgba(26,26,46,0.55)'}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Tiny Divider */}
            <div style={{ width: 40, height: 1, background: dividerColor, margin: '40px auto 32px auto' }} />

            {/* Bottom Stack: Resume & Socials */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
              <button
                onClick={() => { setMenuOpen(false); window.open('/resume.pdf', '_blank'); }}
                aria-label="Download resume"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'none', border: '1px solid rgba(124,92,252,0.28)',
                  borderRadius: 50, cursor: 'pointer',
                  fontFamily: "'DM Mono',monospace", fontSize: 11,
                  color: '#7C5CFC', letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '10px 24px', transition: 'background-color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,92,252,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,92,252,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(124,92,252,0.28)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Resume
              </button>

              <div style={{ display: 'flex', gap: 24 }}>
                <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noreferrer" style={{ color: textMuted, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = textActive} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                </a>
                <a href="https://linkedin.com/in/YOUR_USERNAME" target="_blank" rel="noreferrer" style={{ color: textMuted, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = textActive} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;


