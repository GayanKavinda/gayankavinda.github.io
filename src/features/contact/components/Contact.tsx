//src/components/sections/Contact.tsx
//
// Split layout: LEFT = form, RIGHT = info panel.
// - Full theme awareness: light fields have explicit white bg + dark border,
//   dark fields have dark bg + lighter border — always readable.
// - Right panel: live Colombo clock w/ awake indicator, precise status copy,
//   what you're open to, direct email, socials, response note.
// - Both images get independent GSAP scrub parallax.
// - Shadcn: Input, Textarea, Button, Label, Separator.
// - Zero AI-badge language. Every word sounds like a person wrote it.

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Button }    from '@shared/components/ui/button';
import { Input }     from '@shared/components/ui/input';
import { Label }     from '@shared/components/ui/label';
import { Textarea }  from '@shared/components/ui/textarea';
import { Separator } from '@shared/components/ui/separator';

import maskImg   from '@shared/assets/mask.png';
import dancerImg from '@shared/assets/dancer.png';
import { useTheme } from '@app/providers/theme-provider';

gsap.registerPlugin(ScrollTrigger);

// ─── live Colombo clock ───────────────────────────────────────────────────────
function useColomboTime() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
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

// ─── theme-aware input class factory ─────────────────────────────────────────
// Called at render time so it reads the live isDark value.
function inputCls(isDark: boolean) {
  return [
    'w-full rounded-xl px-4 py-3 text-[14px] font-sans transition-all duration-150',
    'border focus-visible:outline-none focus-visible:ring-0',
    'placeholder:text-foreground/30',
    // LIGHT: crisp white bg, visible border, dark text
    isDark
      ? 'bg-[hsl(0_0%_10%)] border-[hsl(0_0%_100%/0.10)] text-[hsl(40_33%_94%)] focus-visible:border-[#C41E3A]/70 focus-visible:shadow-[inset_3px_0_0_#C41E3A]'
      : 'bg-white border-[hsl(220_15%_15%/0.14)] text-[hsl(220_15%_15%)] focus-visible:border-[#C41E3A]/60 focus-visible:shadow-[inset_3px_0_0_#C41E3A]',
  ].join(' ');
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────
const FieldRow = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div className="contact-field flex flex-col gap-1.5">
    <Label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">
      {label}
    </Label>
    {children}
  </div>
);

// ─── file helpers ─────────────────────────────────────────────────────────────
interface AF { file: File; id: string }
const fmtSize = (b: number) =>
  b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

// ─── FileChip ─────────────────────────────────────────────────────────────────
const FileChip = ({ af, isDark, onRemove }: { af: AF; isDark: boolean; onRemove: () => void }) => {
  const ext   = af.file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
  const isImg = af.file.type.startsWith('image/');
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
      style={{
        background: isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 98%)',
        borderColor: isDark ? 'hsl(0 0% 100% / 0.09)' : 'hsl(220 15% 15% / 0.10)',
      }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 font-mono text-[9px] font-bold"
        style={{
          background: isImg ? 'hsl(var(--crimson)/0.10)' : 'hsl(var(--gold)/0.12)',
          color:      isImg ? 'hsl(var(--crimson))'      : 'hsl(var(--gold))',
        }}
      >
        {isImg ? '⎋' : ext.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[12px] text-foreground truncate">{af.file.name}</p>
        <p className="font-mono text-[10px] text-foreground/35">{fmtSize(af.file.size)}</p>
      </div>
      <button
        type="button" onClick={onRemove}
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#C41E3A]/10 transition-colors text-foreground/30 hover:text-[#C41E3A]"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <line x1="1" y1="1" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="1" x2="1" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

// ─── UploadZone ───────────────────────────────────────────────────────────────
const UploadZone = ({
  files, isDark, onAdd, onRemove,
}: { files: AF[]; isDark: boolean; onAdd: (f: File[]) => void; onRemove: (id: string) => void }) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const drop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    onAdd(Array.from(e.dataTransfer.files));
  }, [onAdd]);

  return (
    <div className="contact-field space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">Attachments</span>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full"
          style={{ background: 'hsl(var(--gold)/0.12)', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold)/0.22)' }}>
          optional
        </span>
      </div>

      <div
        role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        className="w-full rounded-xl border-2 border-dashed cursor-pointer flex items-center gap-4 px-5 py-4 transition-all duration-150"
        style={{
          borderColor: drag ? 'hsl(var(--crimson)/0.5)' : isDark ? 'hsl(0 0% 100%/0.09)' : 'hsl(220 15% 15%/0.12)',
          background:  drag ? 'hsl(var(--crimson)/0.04)' : 'transparent',
        }}
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: drag ? 'hsl(var(--crimson)/0.10)' : isDark ? 'hsl(0 0% 14%)' : 'hsl(220 14% 96%)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 11V3M8 3L5 6M8 3L11 6"
              stroke={drag ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.45)'}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 13h11"
              stroke={drag ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.25)'}
              strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="font-sans text-[13px] text-foreground/65">
            Drop files or <span style={{ color: 'hsl(var(--crimson))' }}>browse</span>
          </p>
          <p className="font-mono text-[10px] text-foreground/30 mt-0.5">
            PDF · DOCX · PNG · JPG · ZIP — max 10 MB
          </p>
        </div>
        <input ref={inputRef} type="file" multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
          className="sr-only"
          onChange={e => { onAdd(Array.from(e.target.files ?? [])); e.target.value = ''; }}
        />
      </div>

      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map(af => (
            <FileChip key={af.id} af={af} isDark={isDark} onRemove={() => onRemove(af.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── InfoPanel ────────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: 'GitHub',   href: import.meta.env.VITE_CONTACT_GITHUB || '#', abbr: 'GH' },
  { label: 'LinkedIn', href: import.meta.env.VITE_CONTACT_LINKEDIN || '#', abbr: 'LI' },
  { label: 'X',        href: import.meta.env.VITE_CONTACT_X || '#', abbr: 'X'  },
  { label: 'Dev.to',   href: import.meta.env.VITE_CONTACT_DEVTO || '#', abbr: 'DEV' },
];

const OPEN_TO = (import.meta.env.VITE_CONTACT_OPEN_TO || 'Full-time roles, Contract / freelance, Technical consulting').split(',').map((s: string) => s.trim());

const InfoPanel = ({ isDark }: { isDark: boolean }) => {
  const time    = useColomboTime();
  const hour    = getColomboHour();
  const awake   = hour >= 8 && hour < 23;
  const maskRef = useRef<HTMLImageElement>(null);
  const dncRef  = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      // mask — slow gentle drift
      gsap.fromTo(maskRef.current, { y: 50 }, {
        y: -50, ease: 'none',
        scrollTrigger: { trigger: panelRef.current!, start: 'top bottom', end: 'bottom top', scrub: 1.6 },
      });
      // dancer — faster + slight horizontal
      gsap.fromTo(dncRef.current, { y: 90, x: 12 }, {
        y: -20, x: -8, ease: 'none',
        scrollTrigger: { trigger: panelRef.current!, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  const panelBg   = isDark ? 'hsl(0 0% 7%)'   : 'hsl(0 0% 100%)';
  const panelBdr  = isDark ? 'hsl(0 0% 100%/0.07)' : 'hsl(220 15% 15%/0.10)';
  const blockBg   = 'transparent';
  const blockBdr  = isDark ? 'hsl(0 0% 100%/0.08)' : 'hsl(220 15% 15%/0.09)';

  return (
    <div
      ref={panelRef}
      className="relative rounded-2xl overflow-hidden flex flex-col gap-0"
      style={{
        background: panelBg,
        border: `1px solid ${panelBdr}`,
        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.05)',
      }}
    >
      {/* parallax images */}
      <img ref={maskRef} src={maskImg} alt="" aria-hidden
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[80%] pointer-events-none select-none"
        style={{ opacity: isDark ? 0.055 : 0.065, mixBlendMode: isDark ? 'screen' : 'multiply', willChange: 'transform' }}
      />
      <img ref={dncRef} src={dancerImg} alt="" aria-hidden
        className="absolute bottom-0 right-0 h-[58%] w-auto pointer-events-none select-none"
        style={{ opacity: isDark ? 0.22 : 0.10, mixBlendMode: isDark ? 'screen' : 'multiply', willChange: 'transform' }}
      />

      {/* content */}
      <div className="relative z-10 flex flex-col gap-px">

        {/* ── Status ── */}
        <div className="p-7" style={{ background: blockBg, borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-3">Status</p>
          <div className="flex items-start gap-2.5">
            {/* pulsing dot */}
            <span className="mt-[5px] w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#22c55e', boxShadow: '0 0 0 4px rgba(34,197,94,0.15)', animation: 'greenPulse 2s infinite' }}
            />
            <div>
              <p className="font-playfair text-[17px] font-bold text-foreground leading-snug">
                {import.meta.env.VITE_CONTACT_STATUS || 'Employed — open to the right thing.'}
              </p>
              <p className="font-sans text-[13px] text-foreground/50 mt-1.5 leading-relaxed">
                {import.meta.env.VITE_CONTACT_STATUS_DESC || 'Not actively hunting, but I pay attention when something interesting lands.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Open to ── */}
        <div className="px-7 py-5" style={{ background: blockBg, borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-3">Open to</p>
          <div className="flex flex-wrap gap-2">
            {OPEN_TO.map(role => (
              <span key={role}
                className="font-sans text-[12px] px-3 py-1.5 rounded-lg"
                style={{
                  background: isDark ? 'hsl(0 0% 14%)' : 'hsl(0 0% 96%)',
                  color: 'hsl(var(--foreground)/0.75)',
                  border: `1px solid ${blockBdr}`,
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* ── Clock ── */}
        <div className="px-7 py-5" style={{ background: blockBg, borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-2">My time</p>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[26px] font-medium tabular-nums leading-none text-foreground">
              {time}
            </span>
            <span className="font-mono text-[10px] text-foreground/35">UTC +5:30</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: awake ? '#22c55e' : '#f59e0b',
                boxShadow:  awake ? '0 0 0 3px rgba(34,197,94,0.15)' : '0 0 0 3px rgba(245,158,11,0.15)',
              }}
            />
            <span className="font-mono text-[10px] text-foreground/40">
              {awake ? 'Probably at my desk right now' : 'Asleep — email still gets through'}
            </span>
          </div>
        </div>

        {/* ── Email ── */}
        <div className="px-7 py-5" style={{ background: blockBg, borderBottom: `1px solid ${blockBdr}` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-2">Direct email</p>
          <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}`}
            className="font-mono text-[14px] transition-colors hover:text-[#C41E3A]"
            style={{ color: 'hsl(var(--foreground)/0.80)' }}
          >
            {import.meta.env.VITE_CONTACT_EMAIL || 'hello@yourdomain.com'}
          </a>
          <p className="font-sans text-[12px] text-foreground/35 mt-1">
            Replies within 24 h — usually same day.
          </p>
        </div>

        {/* ── Socials ── */}
        <div className="px-7 py-5" style={{ background: blockBg }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/35 mb-3">Find me</p>
          <div className="flex items-center gap-2 flex-wrap">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href}
                className="group flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-150"
                style={{
                  background: isDark ? 'hsl(0 0% 13%)' : 'hsl(0 0% 96%)',
                  border: `1px solid ${blockBdr}`,
                }}
              >
                <span className="font-mono text-[10px] font-bold transition-colors text-foreground/50 group-hover:text-[#D4891A]">
                  {s.abbr}
                </span>
                <span className="font-sans text-[12px] text-foreground/55 group-hover:text-foreground/85 transition-colors">
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
  const headRef    = useRef<HTMLDivElement>(null);

  const [form, setForm]           = useState({ name: '', email: '', message: '' });
  const [files, setFiles]         = useState<AF[]>([]);
  const [sending, setSending]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // scroll-triggered reveal
  useEffect(() => {
    // No other animations active as requested.
  }, []);

  const addFiles = useCallback((incoming: File[]) =>
    setFiles(prev => [
      ...prev,
      ...incoming
        .filter(f => f.size <= 10 * 1024 * 1024)
        .map(f => ({ file: f, id: `${f.name}-${Date.now()}-${Math.random()}` })),
    ]), []);

  const removeFile = useCallback((id: string) =>
    setFiles(prev => prev.filter(f => f.id !== id)), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false); setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setFiles([]);
    }, 1400);
  };

  const ready = form.name.trim() && form.email.trim() && form.message.trim();

  // theme-aware card surfaces
  const cardBg  = isDark ? 'hsl(0 0% 6%)'        : 'hsl(0 0% 100%)';
  const cardBdr = isDark ? 'hsl(0 0% 100% / 0.09)' : 'hsl(220 15% 15% / 0.15)';

  return (
    <section id="contact" ref={sectionRef} className="py-[100px] md:py-[120px] relative">
      <div className="max-w-[1140px] mx-auto px-6 md:px-10">

        {/* ── header ── */}
        <div ref={headRef} className="text-center mb-12 md:mb-16 px-6">
          <p className="c-head font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">
            // Get In Touch
          </p>
          <h2 className="c-head font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
            Let's Build <span className="font-playfair italic font-medium text-crimson">Something</span>
          </h2>
          <div className="c-head flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-crimson" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-crimson" />
          </div>
        </div>

        {/* ── split ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-5 items-start">

          {/* ══ LEFT — form ══ */}
          <div className="rounded-2xl p-7 md:p-9"
            style={{
              background: cardBg,
              border: `1px solid ${cardBdr}`,
              boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.05)',
            }}>

            {submitted ? (
              <div className="flex flex-col items-start gap-5 py-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10.5l4 4L16 6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-playfair text-[24px] font-bold text-foreground leading-tight">
                    Sent. I'll be in touch.
                  </h3>
                  <p className="font-sans text-[13px] text-foreground/50 mt-2 max-w-[320px] leading-relaxed">
                    You'll hear back from a real email address — not a no-reply.
                  </p>
                </div>
                <button onClick={() => setSubmitted(false)}
                  className="font-mono text-[11px] uppercase tracking-widest text-foreground/35 hover:text-[#C41E3A] transition-colors">
                  ← Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* name + email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldRow id="cf-name" label="Name">
                    <Input id="cf-name" className={inputCls(isDark)}
                      placeholder="Ada Lovelace"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </FieldRow>
                  <FieldRow id="cf-email" label="Email">
                    <Input id="cf-email" type="email" className={inputCls(isDark)}
                      placeholder="ada@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </FieldRow>
                </div>

                {/* message */}
                <FieldRow id="cf-msg" label="Message">
                  <div className="relative">
                    <Textarea id="cf-msg"
                      className={inputCls(isDark) + ' min-h-[140px] resize-none pr-14'}
                      placeholder="Tell me about the project, the role, or just say hello."
                      value={form.message} maxLength={800}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                    <span className="absolute bottom-3 right-4 font-mono text-[10px] pointer-events-none"
                      style={{ color: form.message.length > 720 ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.22)' }}>
                      {form.message.length}/800
                    </span>
                  </div>
                </FieldRow>

                {/* attachments */}
                <UploadZone files={files} isDark={isDark} onAdd={addFiles} onRemove={removeFile} />

                <Separator style={{ opacity: isDark ? 0.12 : 0.18 }} />

                {/* submit row */}
                <div className="flex items-center gap-4 pt-1">
                  <Button type="submit" disabled={sending || !ready}
                    className="contact-field font-jakarta font-bold text-[13px] tracking-wide rounded-xl px-7 py-3 h-auto relative overflow-hidden transition-all duration-200"
                    style={{
                      background: ready && !sending ? 'hsl(var(--crimson))' : isDark ? 'hsl(0 0% 14%)' : 'hsl(220 14% 92%)',
                      color:      ready && !sending ? '#fff' : 'hsl(var(--foreground)/0.28)',
                      border: 'none',
                      cursor: ready && !sending ? 'pointer' : 'not-allowed',
                    }}>
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <circle cx="6.5" cy="6.5" r="5"
                            stroke="currentColor" strokeWidth="1.5"
                            strokeDasharray="18" strokeDashoffset="6" strokeLinecap="round"/>
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <>
                        Send message →
                        {ready && (
                          <span aria-hidden className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.12) 50%,transparent 62%)',
                              backgroundSize: '200% 100%',
                              animation: 'cshimmer 2.8s linear infinite',
                            }} />
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

              </form>
            )}
          </div>

          {/* ══ RIGHT — info panel ══ */}
          <InfoPanel isDark={isDark} />

        </div>
      </div>

      <style>{`
        @keyframes cshimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default Contact;

