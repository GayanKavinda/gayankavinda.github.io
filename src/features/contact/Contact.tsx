//src/components/sections/Contact.tsx
//
// Split layout: LEFT = form (enriched), RIGHT = info panel.
// Both cards stretch to matching heights.

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Textarea } from '@shared/components/ui/textarea';
import { Separator } from '@shared/components/ui/separator';

import maskImg from '@shared/assets/mask.png';
import dancerImg from '@shared/assets/dancer.png';
import mapDark from '@shared/assets/map-dark.webp';
import mapWhite from '@shared/assets/map-white.webp';
import { useTheme } from '@app/providers/theme-provider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

gsap.registerPlugin(ScrollTrigger);

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  message: z.string().min(10, 'Message too short (min 10 characters)').max(800),
  topic: z.string(),
  timeline: z.string()
});
type ContactFormData = z.infer<typeof contactSchema>;

// ─── Experience data ──────────────────────────────────────────────────────────

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
}

const EXPERIENCES: Experience[] = [
  {
    role: 'Senior Frontend Engineer',
    company: 'TechCorp',
    period: '2022 — Present',
    description:
      'Leading frontend architecture for a SaaS platform serving 50K+ users. Built design system from scratch, migrated to React 18, improved LCP by 40%.',
    tech: ['React', 'TypeScript', 'GSAP', 'Tailwind'],
  },
  {
    role: 'Full Stack Developer',
    company: 'StartupXYZ',
    period: '2020 — 2022',
    description:
      'Built and shipped 3 products from zero to production. Owned the entire frontend stack and helped define the engineering culture from day one.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    role: 'Frontend Developer',
    company: 'Agency Co',
    period: '2018 — 2020',
    description:
      'Crafted high-end interactive experiences for global brands. Led a team of 4 developers on award-winning campaigns and micro-sites.',
    tech: ['React', 'GSAP', 'Three.js', 'Webpack'],
  },
];

// ─── Topic / Timeline options ─────────────────────────────────────────────────

const TOPICS = [
  { id: 'project', label: 'Project Inquiry', icon: '◆' },
  { id: 'job', label: 'Job Opportunity', icon: '◇' },
  { id: 'collab', label: 'Collaboration', icon: '⟐' },
  { id: 'consult', label: 'Consulting', icon: '◎' },
  { id: 'hello', label: 'Just saying hi', icon: '◦' },
];

const TIMELINES = [
  { id: 'asap', label: 'ASAP' },
  { id: '1-3mo', label: '1–3 months' },
  { id: '3-6mo', label: '3–6 months' },
  { id: 'flexible', label: 'Flexible' },
];

// ─── Colombo clock ────────────────────────────────────────────────────────────

function useColomboTime() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function getColomboHour() {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' }),
  ).getHours();
}

// ─── inputCls ─────────────────────────────────────────────────────────────────

function inputCls(isDark: boolean) {
  return [
    'w-full rounded-xl px-4 py-3 text-[14px] font-sans transition-all duration-150',
    'border focus-visible:outline-none focus-visible:ring-0',
    'placeholder:text-foreground/30',
    isDark
      ? 'bg-[hsl(0_0%_10%)] border-[hsl(0_0%_100%/0.10)] text-[hsl(40_33%_94%)] focus-visible:border-[#C41E3A]/70 focus-visible:shadow-[inset_3px_0_0_#C41E3A]'
      : 'bg-white border-[hsl(220_15%_15%/0.14)] text-[hsl(220_15%_15%)] focus-visible:border-[#C41E3A]/60 focus-visible:shadow-[inset_3px_0_0_#C41E3A]',
  ].join(' ');
}

// ─── Chip selector ────────────────────────────────────────────────────────────

function ChipGroup({
  options,
  selected,
  onChange,
  isDark,
  withIcon = false,
}: {
  options: { id: string; label: string; icon?: string }[];
  selected: string;
  onChange: (id: string) => void;
  isDark: boolean;
  withIcon?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = selected === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className="font-sans text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer select-none"
            style={{
              background: active
                ? 'hsl(var(--crimson)/0.12)'
                : isDark
                  ? 'hsl(0 0% 10%)'
                  : 'hsl(0 0% 97%)',
              color: active
                ? 'hsl(var(--crimson))'
                : 'hsl(var(--foreground)/0.50)',
              border: `1px solid ${active
                ? 'hsl(var(--crimson)/0.30)'
                : isDark
                  ? 'hsl(0 0% 100% / 0.07)'
                  : 'hsl(220 15% 15% / 0.08)'
                }`,
              fontWeight: active ? 600 : 400,
            }}
          >
            {withIcon && o.icon ? (
              <span className="mr-1.5 opacity-70">{o.icon}</span>
            ) : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

const FieldRow = ({
  id,
  label,
  children,
  error,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <Label
      htmlFor={id}
      className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75"
    >
      {label}
    </Label>
    {children}
    {error && (
      <p className="font-sans text-[11px] text-[#C41E3A] flex items-center gap-1.5 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
          <path
            d="M6 3v3M6 8v.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── File helpers ─────────────────────────────────────────────────────────────

interface AF {
  file: File;
  id: string;
}
const fmtSize = (b: number) =>
  b > 1_000_000
    ? `${(b / 1_000_000).toFixed(1)} MB`
    : `${Math.round(b / 1024)} KB`;

const FileChip = ({
  af,
  isDark,
  onRemove,
}: {
  af: AF;
  isDark: boolean;
  onRemove: () => void;
}) => {
  const ext = af.file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
  const isImg = af.file.type.startsWith('image/');
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
      style={{
        background: isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 98%)',
        borderColor: isDark
          ? 'hsl(0 0% 100% / 0.09)'
          : 'hsl(220 15% 15% / 0.10)',
      }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 font-mono text-[9px] font-bold"
        style={{
          background: isImg ? 'hsl(var(--crimson)/0.10)' : 'hsl(var(--gold)/0.12)',
          color: isImg ? 'hsl(var(--crimson))' : 'hsl(var(--gold))',
        }}
      >
        {isImg ? '⎋' : ext.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[12px] text-foreground truncate">
          {af.file.name}
        </p>
        <p className="font-mono text-[10px] text-foreground/35">
          {fmtSize(af.file.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${af.file.name}`}
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#C41E3A]/10 transition-colors text-foreground/30 hover:text-[#C41E3A]"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <line x1="1" y1="1" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="1" x2="1" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

const UploadZone = ({
  files,
  isDark,
  onAdd,
  onRemove,
  error,
}: {
  files: AF[];
  isDark: boolean;
  onAdd: (f: File[]) => void;
  onRemove: (id: string) => void;
  error?: string;
}) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const drop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      onAdd(Array.from(e.dataTransfer.files));
    },
    [onAdd],
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">
          Attachments
        </span>
        <span
          className="font-mono text-[9px] px-2 py-0.5 rounded-full"
          style={{
            background: 'hsl(var(--gold)/0.12)',
            color: 'hsl(var(--gold))',
            border: '1px solid hsl(var(--gold)/0.22)',
          }}
        >
          optional
        </span>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        className="w-full rounded-xl border-2 border-dashed cursor-pointer flex items-center gap-4 px-5 py-4 transition-all duration-150"
        style={{
          borderColor: error
            ? 'hsl(var(--crimson)/0.4)'
            : drag
              ? 'hsl(var(--crimson)/0.5)'
              : isDark
                ? 'hsl(0 0% 100%/0.09)'
                : 'hsl(220 15% 15%/0.12)',
          background: drag ? 'hsl(var(--crimson)/0.04)' : 'transparent',
        }}
        aria-label="Upload files"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            background: drag
              ? 'hsl(var(--crimson)/0.10)'
              : isDark
                ? 'hsl(0 0% 14%)'
                : 'hsl(220 14% 96%)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 11V3M8 3L5 6M8 3L11 6"
              stroke={drag ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.45)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 13h11"
              stroke={drag ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.25)'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[13px] text-foreground/65">
            Drop files or <span style={{ color: 'hsl(var(--crimson))' }}>browse</span>
          </p>
          <p className="font-mono text-[10px] text-foreground/30 mt-0.5">
            PDF · DOCX · PNG · JPG · ZIP — max 10 MB each
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
          className="sr-only"
          onChange={(e) => {
            onAdd(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
          aria-label="File upload input"
        />
      </div>
      {error && (
        <p className="font-sans text-[11px] text-[#C41E3A] flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
            <path d="M6 3v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map((af) => (
            <FileChip key={af.id} af={af} isDark={isDark} onRemove={() => onRemove(af.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ExperienceItem — hover to reveal ─────────────────────────────────────────

const ExperienceItem = ({
  exp,
  isDark,
}: {
  exp: Experience;
  isDark: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg transition-colors duration-200"
      style={{
        background: open ? (isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 97%)') : 'transparent',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-2 py-2 px-2.5 cursor-default">
        <span className="font-mono text-[9px] text-foreground/30 w-[34px] flex-shrink-0">
          {exp.period.split('—')[0].trim()}
        </span>
        <span className="font-sans text-[12px] text-foreground/75 truncate">{exp.role}</span>
        <span className="font-mono text-[10px] text-foreground/25">@</span>
        <span className="font-sans text-[11px] text-[hsl(var(--gold)/0.85)] truncate">{exp.company}</span>
        <svg
          width="8" height="8" viewBox="0 0 8 8" fill="none"
          className="ml-auto flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', color: 'hsl(var(--foreground)/0.2)' }}
        >
          <path d="M3 1l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-2.5 pb-3 pt-0.5">
            <div className="w-6 h-px mb-2" style={{ background: isDark ? 'hsl(var(--crimson)/0.3)' : 'hsl(var(--crimson)/0.25)' }} />
            <p className="font-mono text-[10px] text-foreground/35 mb-1.5">{exp.period}</p>
            <p className="font-sans text-[12px] text-foreground/55 leading-relaxed">{exp.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {exp.tech.map((t) => (
                <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: isDark ? 'hsl(0 0% 15%)' : 'hsl(0 0% 94%)', color: 'hsl(var(--foreground)/0.5)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MapHeader ────────────────────────────────────────────────────────────────

const MapHeader = ({ isDark }: { isDark: boolean }) => {
  const panelBg = isDark ? 'hsl(0 0% 7%)' : 'hsl(0 0% 100%)';

  return (
    <div className="relative w-full h-[160px] sm:h-[200px] overflow-hidden rounded-t-2xl flex-shrink-0">
      <img src={mapDark} alt="" className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-200" style={{ opacity: isDark ? 1 : 0 }} draggable={false} />
      <img src={mapWhite} alt="Colombo, Sri Lanka" className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-200" style={{ opacity: isDark ? 0 : 1 }} draggable={false} />
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: `linear-gradient(to top, ${panelBg} 0%, ${panelBg}cc 30%, transparent 100%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: isDark ? 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 60%)' : 'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="absolute w-14 h-14 rounded-full border border-[hsl(var(--crimson)/0.35)] animate-ping" />
        <span className="absolute w-9 h-9 rounded-full border border-[hsl(var(--crimson)/0.5)]" />
        <div className="relative flex flex-col items-center">
          <div className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style={{ background: 'hsl(var(--crimson))' }} aria-label="Colombo location marker">
            <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
          </div>
          <div className="w-[2px] h-3 -mt-[1px]" style={{ background: 'linear-gradient(to bottom, hsl(var(--crimson)), transparent)' }} />
        </div>
      </div>
      <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-5 flex items-center gap-2 pointer-events-none">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] px-2 sm:px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{
            background: isDark ? 'hsl(0 0% 0% / 0.55)' : 'hsl(0 0% 100% / 0.75)',
            color: isDark ? 'hsl(40 33% 94% / 0.8)' : 'hsl(220 15% 15% / 0.7)',
            border: isDark ? '1px solid hsl(0 0% 100% / 0.10)' : '1px solid hsl(220 15% 15% / 0.10)',
          }}
        >
          Colombo, LK
        </span>
      </div>
    </div>
  );
};

// ─── InfoPanel ────────────────────────────────────────────────────────────────

const SOCIALS = [
  { label: 'GitHub', href: import.meta.env.VITE_CONTACT_GITHUB || '#', abbr: 'GH' },
  { label: 'LinkedIn', href: import.meta.env.VITE_CONTACT_LINKEDIN || '#', abbr: 'LI' },
  { label: 'X', href: import.meta.env.VITE_CONTACT_X || '#', abbr: 'X' },
  { label: 'Dev.to', href: import.meta.env.VITE_CONTACT_DEVTO || '#', abbr: 'DEV' },
];

const OPEN_TO = (
  import.meta.env.VITE_CONTACT_OPEN_TO || 'Full-time roles, Contract / freelance, Technical consulting'
).split(',').map((s: string) => s.trim());

const InfoPanel = ({ isDark }: { isDark: boolean }) => {
  const time = useColomboTime();
  const hour = getColomboHour();
  const awake = hour >= 8 && hour < 23;

  const maskRef = useRef<HTMLImageElement>(null);
  const dncRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(maskRef.current, { y: 40 }, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: panelRef.current!, start: 'top bottom', end: 'bottom top', scrub: 1.6 },
      });
      gsap.fromTo(dncRef.current, { y: 80, x: 10 }, {
        y: -16, x: -6, ease: 'none',
        scrollTrigger: { trigger: panelRef.current!, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  const panelBg = isDark ? 'hsl(0 0% 7%)' : 'hsl(0 0% 100%)';
  const panelBdr = isDark ? 'hsl(0 0% 100% / 0.07)' : 'hsl(220 15% 15% / 0.10)';
  const blockBdr = isDark ? 'hsl(0 0% 100% / 0.08)' : 'hsl(220 15% 15% / 0.09)';

  return (
    <div ref={panelRef} className="relative rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: panelBg, border: `1px solid ${panelBdr}`, boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.05)' }}
    >
      <img ref={maskRef} src={maskImg} alt="" aria-hidden="true"
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[70%] pointer-events-none select-none z-0"
        style={{ opacity: isDark ? 0.08 : 0.09, mixBlendMode: isDark ? 'screen' : 'multiply', transformStyle: 'preserve-3d', willChange: 'transform' }}
      />
      <img ref={dncRef} src={dancerImg} alt="" aria-hidden="true"
        className="absolute bottom-0 right-0 h-[45%] w-auto pointer-events-none select-none z-0"
        style={{ opacity: isDark ? 0.32 : 0.16, mixBlendMode: isDark ? 'screen' : 'multiply', transformStyle: 'preserve-3d', willChange: 'transform' }}
      />

      <MapHeader isDark={isDark} />

      <div className="relative z-10 flex flex-col gap-px -mt-2 flex-1">
        {/* Status */}
        <div className="px-5 sm:px-6 py-4 sm:py-5" style={{ borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-3">Status</p>
          <div className="flex items-start gap-2.5">
            <span className="mt-[5px] w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#22c55e', boxShadow: '0 0 0 4px rgba(34,197,94,0.15)', animation: 'greenPulse 2s infinite' }}
              aria-label="Available status indicator"
            />
            <div>
              <p className="font-display text-[15px] sm:text-[16px] font-bold text-foreground leading-snug">
                {import.meta.env.VITE_CONTACT_STATUS || 'Employed — open to the right thing.'}
              </p>
              <p className="font-sans text-[12px] text-foreground/50 mt-1.5 leading-relaxed">
                {import.meta.env.VITE_CONTACT_STATUS_DESC || 'Not actively hunting, but I pay attention when something interesting lands.'}
              </p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="px-5 sm:px-6 py-4 sm:py-5" style={{ borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-2">Experience</p>
          <div className="flex flex-col gap-0.5">
            {EXPERIENCES.map((exp) => (
              <ExperienceItem key={exp.company} exp={exp} isDark={isDark} />
            ))}
          </div>
          <p className="font-mono text-[9px] text-foreground/25 mt-2 px-2.5">hover to expand</p>
        </div>

        {/* Open to */}
        <div className="px-5 sm:px-6 py-4 sm:py-5" style={{ borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-3">Open to</p>
          <div className="flex flex-wrap gap-1.5">
            {OPEN_TO.map(role => (
              <span key={role} className="font-sans text-[11px] px-2.5 py-1 rounded-lg"
                style={{ background: isDark ? 'hsl(0 0% 14%)' : 'hsl(0 0% 96%)', color: 'hsl(var(--foreground)/0.70)', border: `1px solid ${blockBdr}` }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Clock */}
        <div className="px-5 sm:px-6 py-4 sm:py-5" style={{ borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-2">My time</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <time className="font-mono text-[22px] sm:text-[24px] font-medium tabular-nums leading-none text-foreground">{time}</time>
            <span className="font-mono text-[10px] text-foreground/35">UTC +5:30</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: awake ? '#22c55e' : '#f59e0b', boxShadow: awake ? '0 0 0 3px rgba(34,197,94,0.15)' : '0 0 0 3px rgba(245,158,11,0.15)' }}
              aria-label={awake ? 'Likely awake' : 'Likely asleep'}
            />
            <span className="font-mono text-[10px] text-foreground/40">
              {awake ? 'Probably at my desk right now' : 'Asleep — email still gets through'}
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="px-5 sm:px-6 py-4 sm:py-5" style={{ borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-2">Direct email</p>
          <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}`}
            className="font-mono text-[13px] transition-colors hover:text-[hsl(var(--crimson))] break-all"
            style={{ color: 'hsl(var(--foreground)/0.75)' }}
          >
            {import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}
          </a>
          <p className="font-sans text-[12px] text-foreground/35 mt-1">Replies within 24 h — usually same day.</p>
        </div>

        {/* Socials */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 mt-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-3">Find me</p>
          <div className="flex items-center gap-2 flex-wrap">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150"
                style={{ background: isDark ? 'hsl(0 0% 13%)' : 'hsl(0 0% 96%)', border: `1px solid ${blockBdr}` }}
                aria-label={`Visit ${s.label} profile`}
              >
                <span className="font-mono text-[10px] font-bold transition-colors text-foreground/50 group-hover:text-[hsl(var(--gold))]">{s.abbr}</span>
                <span className="font-sans text-[11px] text-foreground/55 group-hover:text-foreground/85 transition-colors">{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Contact (main) ───────────────────────────────────────────────────────────

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<AF[]>([]);
  const [fileError, setFileError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', topic: 'project', timeline: 'flexible' },
    mode: 'onTouched'
  });

  const nameVal = watch('name');
  const emailVal = watch('email');
  const msgVal = watch('message');

  const addFiles = useCallback((incoming: File[]) => {
    let errorStr: string | undefined;
    const validFiles: AF[] = [];
    incoming.forEach(f => {
      if (f.size > 10 * 1024 * 1024) errorStr = `${f.name} exceeds 10 MB limit`;
      else validFiles.push({ file: f, id: `${f.name}-${Date.now()}-${Math.random()}` });
    });
    if (errorStr) {
      setFileError(errorStr);
      setTimeout(() => setFileError(undefined), 4000);
    }
    if (validFiles.length > 0) setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((id: string) => setFiles(prev => prev.filter(f => f.id !== id)), []);

  const onSubmit = (data: ContactFormData) => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      reset();
      setFiles([]);
      setTimeout(() => setSubmitted(false), 10000);
    }, 1400);
  };

  const ready = nameVal?.trim() && emailVal?.trim() && msgVal?.trim() && Object.keys(errors).length === 0;

  const cardBg = isDark ? 'hsl(0 0% 6%)' : 'hsl(0 0% 100%)';
  const cardBdr = isDark ? 'hsl(0 0% 100% / 0.09)' : 'hsl(220 15% 15% / 0.15)';
  const blockBdr = isDark ? 'hsl(0 0% 100% / 0.07)' : 'hsl(220 15% 15% / 0.08)';

  return (
    <section id="contact" ref={sectionRef} className="py-[80px] sm:py-[100px] md:py-[120px] relative">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--gold)/0.85)] mb-3">
            // Get In Touch
          </p>
          <h2 className="font-display font-bold text-[clamp(28px,5vw,44px)] text-foreground tracking-tight">
            Let&apos;s Build{' '}
            <span className="font-display italic font-medium text-[hsl(var(--crimson))]">Something</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[hsl(var(--crimson))]" />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--gold))]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[hsl(var(--crimson))]" />
          </div>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-4 sm:gap-5 lg:items-stretch">

          {/* ─── LEFT: form ─── */}
          <div className="rounded-2xl p-5 sm:p-7 md:p-9 order-2 lg:order-1 h-full flex flex-col"
            style={{ background: cardBg, border: `1px solid ${cardBdr}`, boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.05)' }}
          >
            {submitted ? (
              <div className="flex flex-col items-start gap-5 py-6 flex-1 justify-center">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10.5l4 4L16 6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-[22px] sm:text-[24px] font-bold text-foreground leading-tight">
                    Sent. I&apos;ll be in touch.
                  </h3>
                  <p className="font-sans text-[13px] text-foreground/50 mt-2 max-w-[320px] leading-relaxed">
                    You&apos;ll hear back from a real email address — not a no-reply.
                  </p>
                </div>
                <button onClick={() => setSubmitted(false)}
                  className="font-mono text-[11px] uppercase tracking-widest text-foreground/35 hover:text-[hsl(var(--crimson))] transition-colors mt-2"
                >
                  ← Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 flex-1" noValidate>

                {/* Form header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[18px] sm:text-[20px] font-bold text-foreground leading-tight">
                      Send a message
                    </h3>
                    <p className="font-sans text-[12px] text-foreground/40 mt-1 leading-relaxed">
                      Fill out the details below and I&apos;ll get back to you.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.12)' }} />
                    <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-wider">
                      ~24h response
                    </span>
                  </div>
                </div>

                <div style={{ borderBottom: `1px solid ${blockBdr}` }} />

                {/* Topic */}
                <div className="flex flex-col gap-2">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">
                    What&apos;s this about?
                  </Label>
                  <Controller
                    name="topic"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup options={TOPICS} selected={field.value} onChange={field.onChange} isDark={isDark} withIcon />
                    )}
                  />
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow id="cf-name" label="Name" error={errors.name?.message}>
                    <Input id="cf-name" className={inputCls(isDark)} placeholder="Ada Lovelace"
                      {...register('name')}
                      aria-invalid={!!errors.name}
                    />
                  </FieldRow>
                  <FieldRow id="cf-email" label="Email" error={errors.email?.message}>
                    <Input id="cf-email" type="email" className={inputCls(isDark)} placeholder="ada@example.com"
                      {...register('email')}
                      aria-invalid={!!errors.email}
                    />
                  </FieldRow>
                </div>

                {/* Message */}
                <FieldRow id="cf-msg" label="Message" error={errors.message?.message}>
                  <div className="relative">
                    <Textarea id="cf-msg" className={inputCls(isDark) + ' min-h-[150px] resize-none pr-14'}
                      placeholder="Tell me about the project, the role, or just say hello."
                      maxLength={800}
                      {...register('message')}
                      aria-invalid={!!errors.message}
                    />
                    <span className="absolute bottom-3 right-4 font-mono text-[10px] pointer-events-none"
                      style={{ color: (msgVal?.length ?? 0) > 720 ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.22)' }}
                      aria-live="polite" aria-atomic="true"
                    >
                      {msgVal?.length ?? 0}/800
                    </span>
                  </div>
                </FieldRow>

                {/* Timeline */}
                <div className="flex flex-col gap-2">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">
                    Timeline
                  </Label>
                  <Controller
                    name="timeline"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup options={TIMELINES} selected={field.value} onChange={field.onChange} isDark={isDark} />
                    )}
                  />
                </div>

                {/* Attachments */}
                <UploadZone files={files} isDark={isDark} onAdd={addFiles} onRemove={removeFile} error={fileError} />

                <div style={{ borderBottom: `1px solid ${blockBdr}` }} />

                {/* Submit row + trust signals */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-1">
                  <Button type="submit" disabled={sending || !ready}
                    className="w-full sm:w-auto font-display font-bold text-[13px] tracking-wide rounded-xl px-7 py-3 h-auto relative overflow-hidden transition-all duration-200"
                    style={{
                      background: ready && !sending ? 'hsl(var(--crimson))' : isDark ? 'hsl(0 0% 14%)' : 'hsl(220 14% 92%)',
                      color: ready && !sending ? '#fff' : 'hsl(var(--foreground)/0.28)',
                      border: 'none',
                      cursor: ready && !sending ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {sending ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="6" strokeLinecap="round" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <>
                        Send message →
                        {ready && (
                          <span aria-hidden="true" className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.12) 50%,transparent 62%)', backgroundSize: '200% 100%', animation: 'cshimmer 2.8s linear infinite' }}
                          />
                        )}
                      </>
                    )}
                  </Button>

                  {files.length > 0 && (
                    <span className="font-mono text-[10px] text-foreground/35">
                      {files.length} file{files.length > 1 ? 's' : ''} attached
                    </span>
                  )}
                </div>

                {/* Trust signals — bottom row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-auto pt-2">
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                        fill="hsl(var(--gold)/0.55)" stroke="hsl(var(--gold)/0.7)" strokeWidth="0.5" />
                    </svg>
                    <span className="font-sans text-[11px] text-foreground/30">No spam, ever</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="1.5" y="4" width="9" height="6.5" rx="1" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" />
                      <path d="M1.5 5.5L6 8L10.5 5.5" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" />
                    </svg>
                    <span className="font-sans text-[11px] text-foreground/30">NDA-friendly</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" />
                      <path d="M6 3.5V6L7.5 7" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" strokeLinecap="round" />
                    </svg>
                    <span className="font-sans text-[11px] text-foreground/30">Usually same-day reply</span>
                  </span>
                </div>

              </form>
            )}
          </div>

          {/* ─── RIGHT: info panel ─── */}
          <div className="order-1 lg:order-2 h-full">
            <InfoPanel isDark={isDark} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cshimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes greenPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
      `}</style>

      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default Contact;