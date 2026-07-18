//src/components/common/ThemeToggle.tsx

import { useTheme } from '@app/providers/theme-provider';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36,
        height: 36,
        borderRadius: '0px',
        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
        border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.15)',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
      }}
    >
      {/* Sun icon (shown in dark mode) */}
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke={isDark ? 'rgba(245,240,232,0.8)' : 'transparent'}
        strokeWidth="1.8" strokeLinecap="round"
        style={{ position: 'absolute', transition: 'all 0.3s ease', opacity: isDark ? 1 : 0, transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)' }}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon icon (shown in light mode) */}
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={!isDark ? 'rgba(26,26,46,0.7)' : 'transparent'}
        strokeWidth="1.8" strokeLinecap="round"
        style={{ position: 'absolute', transition: 'all 0.3s ease', opacity: !isDark ? 1 : 0, transform: !isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)' }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}


