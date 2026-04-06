//src/components/layout/SideNav.tsx

import { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'home',        label: 'Hero'          },
  { id: 'projects',    label: 'Work'          },
  { id: 'skills',      label: 'Stack'         },
  { id: 'timeline',    label: 'Timeline'      },  // new
  { id: 'experience',  label: 'Experience'    },
  { id: 'about',       label: 'About'         },
  { id: 'philosophy',  label: 'Philosophy'    },
  { id: 'contact',     label: 'Contact'       },
];

const SideNav = () => {
  const [active, setActive] = useState('home');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[900] flex-col items-end gap-3"
      aria-label="Page sections"
    >
      {SECTIONS.map(s => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="group flex items-center gap-2.5 cursor-pointer"
            aria-label={`Go to ${s.label}`}
          >
            {/* Label — visible on hover or active */}
            <span
              className={[
                'font-mono text-[9px] tracking-[.1em] uppercase transition-all duration-200',
                isActive
                  ? 'opacity-100 text-[#C41E3A] translate-x-0'
                  : 'opacity-0 group-hover:opacity-60 text-foreground translate-x-2 group-hover:translate-x-0',
              ].join(' ')}
            >
              {s.label}
            </span>

            {/* Dot */}
            <div
              className={[
                'rounded-full transition-all duration-200 shrink-0',
                isActive
                  ? 'w-2 h-2 bg-[#C41E3A]'
                  : 'w-1.5 h-1.5 bg-foreground/20 group-hover:bg-foreground/50',
              ].join(' ')}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default SideNav;

