//src/components/sections/Contact.tsx
//
// Split layout: LEFT = form (enriched), RIGHT = info panel (compact).

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Textarea } from '@shared/components/ui/textarea';

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
  timeline: z.string(),
});
type ContactFormData = z.infer<typeof contactSchema>;

// ─── Topic / Timeline options ─────────────────────────────────────────────────

const TOPICS = [
  { id: 'project', label: 'Project', icon: '◆' },
  { id: 'job', label: 'Job', icon: '◇' },
  { id: 'collab', label: 'Collab', icon: '⟐' },
  { id: 'consult', label: 'Consult', icon: '◎' },
  { id: 'hello', label: 'Hi!', icon: '◦' },
];

const TIMELINES = [
  { id: 'asap', label: 'ASAP' },
  { id: '1-3mo', label: '1–3 mo' },
  { id: '3-6mo', label: '3–6 mo' },
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
      ? 'bg-[hsl(0_0%_10%)] border-[hsl(0_0%_100%/0.10)] text-[hsl(248_30%_94%)] focus-visible:border-[#7C5CFC]/70 focus-visible:shadow-[inset_3px_0_0_#7C5CFC]'
      : 'bg-white border-[hsl(246_20%_12%/0.14)] text-[hsl(246_20%_12%)] focus-visible:border-[#7C5CFC]/60 focus-visible:shadow-[inset_3px_0_0_#7C5CFC]',
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
              border: `1px solid ${
                active
                  ? 'hsl(var(--crimson)/0.30)'
                  : isDark
                    ? 'hsl(0 0% 100% / 0.07)'
                    : 'hsl(220 15% 15% / 0.08)'
              }`,
              fontWeight: active ? 600 : 400,
            }}
          >
            {withIcon && o.icon ? (
              <span className="mr-1 opacity-70">{o.icon}</span>
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
      <p className="font-sans text-[11px] text-[#7C5CFC] flex items-center gap-1.5 mt-0.5">
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
          background: isImg
            ? 'hsl(var(--crimson)/0.10)'
            : 'hsl(var(--gold)/0.12)',
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
          <line
            x1="1" y1="1" x2="8" y2="8"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
          <line
            x1="8" y1="1" x2="1" y2="8"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
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
    <div className="space-y-2">
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
        className="w-full rounded-xl border-2 border-dashed cursor-pointer flex items-center gap-3 px-4 py-3 transition-all duration-150"
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
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: drag
              ? 'hsl(var(--crimson)/0.10)'
              : isDark
                ? 'hsl(0 0% 14%)'
                : 'hsl(220 14% 96%)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 11V3M8 3L5 6M8 3L11 6"
              stroke={
                drag
                  ? 'hsl(var(--crimson))'
                  : 'hsl(var(--foreground)/0.45)'
              }
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 13h11"
              stroke={
                drag
                  ? 'hsl(var(--crimson))'
                  : 'hsl(var(--foreground)/0.25)'
              }
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[12px] text-foreground/65">
            Drop files or{' '}
            <span style={{ color: 'hsl(var(--crimson))' }}>browse</span>
          </p>
          <p className="font-mono text-[10px] text-foreground/30 mt-0.5">
            PDF · DOCX · PNG · JPG · ZIP — max 10 MB
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
            <circle
              cx="6" cy="6" r="5"
              stroke="currentColor" strokeWidth="1"
            />
            <path
              d="M6 3v3M6 8v.5"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
            />
          </svg>
          {error}
        </p>
      )}
      {files.length > 0 && (
        <div className="grid gap-1.5">
          {files.map((af) => (
            <FileChip
              key={af.id}
              af={af}
              isDark={isDark}
              onRemove={() => onRemove(af.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MapHeader (compact) ──────────────────────────────────────────────────────

const MapHeader = ({ isDark }: { isDark: boolean }) => {
  const panelBg = isDark ? 'hsl(0 0% 7%)' : 'hsl(0 0% 100%)';

  return (
    // Reduced height: was 160px/200px → now 120px/140px
    <div className="relative w-full h-[120px] sm:h-[140px] overflow-hidden rounded-t-2xl flex-shrink-0">
      <img
        src={mapDark}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-200"
        style={{ opacity: isDark ? 1 : 0 }}
        draggable={false}
      />
      <img
        src={mapWhite}
        alt="Colombo, Sri Lanka"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-200"
        style={{ opacity: isDark ? 0 : 1 }}
        draggable={false}
      />
      {/* Fade to card bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${panelBg} 0%, ${panelBg}cc 30%, transparent 100%)`,
        }}
      />
      {/* Pin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="absolute w-10 h-10 rounded-full border border-[hsl(var(--crimson)/0.35)] animate-ping" />
        <span className="absolute w-7 h-7 rounded-full border border-[hsl(var(--crimson)/0.5)]" />
        <div className="relative flex flex-col items-center">
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            style={{ background: 'hsl(var(--crimson))' }}
            aria-label="Colombo location marker"
          >
            <div className="w-1 h-1 rounded-full bg-white/90" />
          </div>
          <div
            className="w-[2px] h-2.5 -mt-[1px]"
            style={{
              background:
                'linear-gradient(to bottom, hsl(var(--crimson)), transparent)',
            }}
          />
        </div>
      </div>
      {/* Label */}
      <div className="absolute bottom-2.5 left-4 flex items-center gap-2 pointer-events-none">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full backdrop-blur-sm"
          style={{
            background: isDark
              ? 'hsl(0 0% 0% / 0.55)'
              : 'hsl(0 0% 100% / 0.75)',
            color: isDark
              ? 'hsl(40 33% 94% / 0.8)'
              : 'hsl(220 15% 15% / 0.7)',
            border: isDark
              ? '1px solid hsl(0 0% 100% / 0.10)'
              : '1px solid hsl(220 15% 15% / 0.10)',
          }}
        >
          Colombo, LK · UTC +5:30
        </span>
      </div>
    </div>
  );
};

// ─── InfoPanel (compact — no experience accordion) ────────────────────────────

const SOCIALS = [
  {
    label: 'GitHub',
    href: import.meta.env.VITE_CONTACT_GITHUB || '#',
    abbr: 'GH',
  },
  {
    label: 'LinkedIn',
    href: import.meta.env.VITE_CONTACT_LINKEDIN || '#',
    abbr: 'LI',
  },
  { label: 'X', href: import.meta.env.VITE_CONTACT_X || '#', abbr: 'X' },
  {
    label: 'Dev.to',
    href: import.meta.env.VITE_CONTACT_DEVTO || '#',
    abbr: 'DEV',
  },
];

const OPEN_TO = (
  import.meta.env.VITE_CONTACT_OPEN_TO ||
  'Full-time roles, Contract, Consulting'
)
  .split(',')
  .map((s: string) => s.trim());

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
      gsap.fromTo(
        maskRef.current,
        { y: 30 },
        {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: panelRef.current!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        },
      );
      gsap.fromTo(
        dncRef.current,
        { y: 50, x: 8 },
        {
          y: -12,
          x: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: panelRef.current!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    }, panelRef);
    return () => ctx.revert();
  }, []);

  const panelBg = isDark ? 'hsl(0 0% 7%)' : 'hsl(0 0% 100%)';
  const panelBdr = isDark
    ? 'hsl(0 0% 100% / 0.07)'
    : 'hsl(220 15% 15% / 0.10)';
  const blockBdr = isDark
    ? 'hsl(0 0% 100% / 0.08)'
    : 'hsl(220 15% 15% / 0.09)';

  return (
    <div
      ref={panelRef}
      className="relative rounded-2xl overflow-hidden flex flex-col h-full"
      style={{
        background: panelBg,
        border: `1px solid ${panelBdr}`,
        boxShadow: isDark
          ? '0 20px 50px rgba(0,0,0,0.3)'
          : '0 20px 50px rgba(0,0,0,0.05)',
      }}
    >
      {/* Decorative bg images */}
      <img
        ref={maskRef}
        src={maskImg}
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] pointer-events-none select-none z-0"
        style={{
          opacity: isDark ? 0.07 : 0.08,
          mixBlendMode: isDark ? 'screen' : 'multiply',
          willChange: 'transform',
        }}
      />
      <img
        ref={dncRef}
        src={dancerImg}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-[38%] w-auto pointer-events-none select-none z-0"
        style={{
          opacity: isDark ? 0.28 : 0.13,
          mixBlendMode: isDark ? 'screen' : 'multiply',
          willChange: 'transform',
        }}
      />

      {/* Map */}
      <MapHeader isDark={isDark} />

      <div className="relative z-10 flex flex-col flex-1 -mt-1">

        {/* ── Status ── */}
        <div
          className="px-5 py-3.5"
          style={{ borderBottom: `1px solid ${blockBdr}` }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30 mb-2">
            Status
          </p>
          <div className="flex items-start gap-2">
            {/* Green pulse dot */}
            <span
              className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: '#22c55e',
                boxShadow: '0 0 0 4px rgba(34,197,94,0.15)',
                animation: 'greenPulse 2s infinite',
              }}
              aria-label="Available"
            />
            <div>
              <p className="font-display text-[13px] font-bold text-foreground leading-snug">
                {import.meta.env.VITE_CONTACT_STATUS ||
                  'Employed — open to the right thing.'}
              </p>
              <p className="font-sans text-[11px] text-foreground/45 mt-0.5 leading-relaxed">
                {import.meta.env.VITE_CONTACT_STATUS_DESC ||
                  'Not actively hunting, but the right thing gets a reply.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Clock + availability ── */}
        <div
          className="px-5 py-3.5 flex items-center justify-between gap-4"
          style={{ borderBottom: `1px solid ${blockBdr}` }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30 mb-1">
              My time
            </p>
            <time className="font-mono text-[20px] font-medium tabular-nums leading-none text-foreground">
              {time}
            </time>
          </div>
          <div className="text-right">
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full"
              style={{
                background: awake
                  ? 'rgba(34,197,94,0.10)'
                  : 'rgba(245,158,11,0.10)',
                color: awake ? '#22c55e' : '#f59e0b',
                border: awake
                  ? '1px solid rgba(34,197,94,0.25)'
                  : '1px solid rgba(245,158,11,0.25)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: awake ? '#22c55e' : '#f59e0b',
                }}
              />
              {awake ? 'At my desk' : 'Asleep'}
            </span>
            <p className="font-mono text-[9px] text-foreground/30 mt-1">
              UTC +5:30
            </p>
          </div>
        </div>

        {/* ── Open to ── */}
        <div
          className="px-5 py-3.5"
          style={{ borderBottom: `1px solid ${blockBdr}` }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30 mb-2">
            Open to
          </p>
          <div className="flex flex-wrap gap-1.5">
            {OPEN_TO.map((role) => (
              <span
                key={role}
                className="font-sans text-[11px] px-2.5 py-1 rounded-lg"
                style={{
                  background: isDark ? 'hsl(0 0% 13%)' : 'hsl(0 0% 96%)',
                  color: 'hsl(var(--foreground)/0.65)',
                  border: `1px solid ${blockBdr}`,
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* ── Direct email ── */}
        <div
          className="px-5 py-3.5"
          style={{ borderBottom: `1px solid ${blockBdr}` }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30 mb-1.5">
            Direct email
          </p>
          <a
            href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}`}
            className="font-mono text-[12px] transition-colors hover:text-[hsl(var(--crimson))] break-all"
            style={{ color: 'hsl(var(--foreground)/0.70)' }}
          >
            {import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}
          </a>
          <p className="font-sans text-[11px] text-foreground/30 mt-0.5">
            Usually same day.
          </p>
        </div>

        {/* ── Socials ── */}
        <div className="px-5 py-3.5 mt-auto">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/30 mb-2">
            Find me
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  background: isDark ? 'hsl(0 0% 13%)' : 'hsl(0 0% 96%)',
                  border: `1px solid ${blockBdr}`,
                }}
                aria-label={`Visit ${s.label} profile`}
              >
                <span className="font-mono text-[9px] font-bold transition-colors text-foreground/40 group-hover:text-[hsl(var(--gold))]">
                  {s.abbr}
                </span>
                <span className="font-sans text-[11px] text-foreground/50 group-hover:text-foreground/80 transition-colors">
                  {s.label}
                </span>
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

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      topic: 'project',
      timeline: 'flexible',
    },
    mode: 'onTouched',
  });

  const nameVal = watch('name');
  const emailVal = watch('email');
  const msgVal = watch('message');

  const addFiles = useCallback((incoming: File[]) => {
    let errorStr: string | undefined;
    const validFiles: AF[] = [];
    incoming.forEach((f) => {
      if (f.size > 10 * 1024 * 1024)
        errorStr = `${f.name} exceeds 10 MB limit`;
      else
        validFiles.push({
          file: f,
          id: `${f.name}-${Date.now()}-${Math.random()}`,
        });
    });
    if (errorStr) {
      setFileError(errorStr);
      setTimeout(() => setFileError(undefined), 4000);
    }
    if (validFiles.length > 0)
      setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback(
    (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id)),
    [],
  );

  const onSubmit = (_data: ContactFormData) => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      reset();
      setFiles([]);
      setTimeout(() => setSubmitted(false), 10000);
    }, 1400);
  };

  const ready =
    nameVal?.trim() &&
    emailVal?.trim() &&
    msgVal?.trim() &&
    Object.keys(errors).length === 0;

  const cardBg = isDark ? 'hsl(0 0% 6%)' : 'hsl(0 0% 100%)';
  const cardBdr = isDark
    ? 'hsl(0 0% 100% / 0.09)'
    : 'hsl(220 15% 15% / 0.15)';
  const blockBdr = isDark
    ? 'hsl(0 0% 100% / 0.07)'
    : 'hsl(220 15% 15% / 0.08)';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-[80px] sm:py-[100px] md:py-[120px] relative"
    >
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--gold)/0.85)] mb-3">
            // Get In Touch
          </p>
          <h2 className="font-display font-bold text-[clamp(28px,5vw,44px)] text-foreground tracking-tight">
            Let&apos;s Build{' '}
            <span className="font-display italic font-medium text-[hsl(var(--crimson))]">
              Something
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[hsl(var(--crimson))]" />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--gold))]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[hsl(var(--crimson))]" />
          </div>
        </div>

        {/* Split layout — both cols same height via items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-4 sm:gap-5 lg:items-stretch">

          {/* ─── LEFT: form ─── */}
          <div
            className="rounded-2xl p-5 sm:p-7 md:p-8 order-2 lg:order-1 flex flex-col"
            style={{
              background: cardBg,
              border: `1px solid ${cardBdr}`,
              boxShadow: isDark
                ? '0 20px 50px rgba(0,0,0,0.3)'
                : '0 20px 50px rgba(0,0,0,0.05)',
            }}
          >
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-start gap-5 py-6 flex-1 justify-center">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(34,197,94,0.10)',
                    border: '1px solid rgba(34,197,94,0.25)',
                  }}
                >
                  <svg
                    width="20" height="20" viewBox="0 0 20 20" fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10.5l4 4L16 6"
                      stroke="#22c55e" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-[22px] sm:text-[24px] font-bold text-foreground leading-tight">
                    Sent. I&apos;ll be in touch.
                  </h3>
                  <p className="font-sans text-[13px] text-foreground/50 mt-2 max-w-[320px] leading-relaxed">
                    You&apos;ll hear back from a real email — not a no-reply.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-mono text-[11px] uppercase tracking-widest text-foreground/35 hover:text-[hsl(var(--crimson))] transition-colors mt-2"
                >
                  ← Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 flex-1"
                noValidate
              >
                {/* Form header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-display text-[18px] sm:text-[20px] font-bold text-foreground leading-tight">
                      Send a message
                    </h3>
                    <p className="font-sans text-[12px] text-foreground/40 mt-0.5">
                      Fill in the details and I&apos;ll get back to you.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: '#22c55e',
                        boxShadow: '0 0 0 3px rgba(34,197,94,0.12)',
                      }}
                    />
                    <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-wider">
                      ~24h response
                    </span>
                  </div>
                </div>

                <div style={{ borderBottom: `1px solid ${blockBdr}` }} />

                {/* Topic chips */}
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">
                    What&apos;s this about?
                  </Label>
                  <Controller
                    name="topic"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup
                        options={TOPICS}
                        selected={field.value}
                        onChange={field.onChange}
                        isDark={isDark}
                        withIcon
                      />
                    )}
                  />
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldRow id="cf-name" label="Name" error={errors.name?.message}>
                    <Input
                      id="cf-name"
                      className={inputCls(isDark)}
                      placeholder="Ada Lovelace"
                      {...register('name')}
                      aria-invalid={!!errors.name}
                    />
                  </FieldRow>
                  <FieldRow id="cf-email" label="Email" error={errors.email?.message}>
                    <Input
                      id="cf-email"
                      type="email"
                      className={inputCls(isDark)}
                      placeholder="ada@example.com"
                      {...register('email')}
                      aria-invalid={!!errors.email}
                    />
                  </FieldRow>
                </div>

                {/* Message */}
                <FieldRow id="cf-msg" label="Message" error={errors.message?.message}>
                  <div className="relative">
                    <Textarea
                      id="cf-msg"
                      className={inputCls(isDark) + ' min-h-[130px] resize-none pr-14'}
                      placeholder="Tell me about the project, the role, or just say hello."
                      maxLength={800}
                      {...register('message')}
                      aria-invalid={!!errors.message}
                    />
                    <span
                      className="absolute bottom-3 right-4 font-mono text-[10px] pointer-events-none"
                      style={{
                        color:
                          (msgVal?.length ?? 0) > 720
                            ? 'hsl(var(--crimson))'
                            : 'hsl(var(--foreground)/0.22)',
                      }}
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {msgVal?.length ?? 0}/800
                    </span>
                  </div>
                </FieldRow>

                {/* Timeline chips */}
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">
                    Timeline
                  </Label>
                  <Controller
                    name="timeline"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup
                        options={TIMELINES}
                        selected={field.value}
                        onChange={field.onChange}
                        isDark={isDark}
                      />
                    )}
                  />
                </div>

                {/* Attachments */}
                <UploadZone
                  files={files}
                  isDark={isDark}
                  onAdd={addFiles}
                  onRemove={removeFile}
                  error={fileError}
                />

                <div style={{ borderBottom: `1px solid ${blockBdr}` }} />

                {/* Submit row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Button
                    type="submit"
                    disabled={sending || !ready}
                    className="w-full sm:w-auto font-display font-bold text-[13px] tracking-wide rounded-xl px-7 py-3 h-auto relative overflow-hidden transition-all duration-200"
                    style={{
                      background:
                        ready && !sending
                          ? 'hsl(var(--crimson))'
                          : isDark
                            ? 'hsl(0 0% 14%)'
                            : 'hsl(220 14% 92%)',
                      color:
                        ready && !sending
                          ? '#fff'
                          : 'hsl(var(--foreground)/0.28)',
                      border: 'none',
                      cursor: ready && !sending ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {sending ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg
                          className="animate-spin"
                          width="13" height="13" viewBox="0 0 13 13" fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="6.5" cy="6.5" r="5"
                            stroke="currentColor" strokeWidth="1.5"
                            strokeDasharray="18" strokeDashoffset="6"
                            strokeLinecap="round"
                          />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <>
                        Send message →
                        {ready && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.12) 50%,transparent 62%)',
                              backgroundSize: '200% 100%',
                              animation: 'cshimmer 2.8s linear infinite',
                            }}
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

                {/* Trust signals */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto pt-1">
                  {[
                    { icon: 'star', label: 'No spam, ever' },
                    { icon: 'mail', label: 'NDA-friendly' },
                    { icon: 'clock', label: 'Usually same-day reply' },
                  ].map(({ icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      {icon === 'star' && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                            fill="hsl(var(--gold)/0.55)"
                            stroke="hsl(var(--gold)/0.7)"
                            strokeWidth="0.5"
                          />
                        </svg>
                      )}
                      {icon === 'mail' && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect
                            x="1.5" y="4" width="9" height="6.5" rx="1"
                            stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9"
                          />
                          <path
                            d="M1.5 5.5L6 8L10.5 5.5"
                            stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9"
                          />
                        </svg>
                      )}
                      {icon === 'clock' && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle
                            cx="6" cy="6" r="4.5"
                            stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9"
                          />
                          <path
                            d="M6 3.5V6L7.5 7"
                            stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      <span className="font-sans text-[11px] text-foreground/30">
                        {label}
                      </span>
                    </span>
                  ))}
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
          0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0);   }
        }
      `}</style>

      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default Contact;