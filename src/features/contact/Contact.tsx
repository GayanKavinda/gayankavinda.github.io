//src/components/sections/Contact.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';

import yujiDark from '@assets/images/contact/Yuji_Itadori_dark.jpeg';
import yujiWhite from '@assets/images/contact/Yuji_Itadori_white.jpeg';

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

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── inputCls ─────────────────────────────────────────────────────────────────

function inputCls(isDark: boolean) {
  return [
    'w-full rounded-xl px-4 py-2.5 text-[14px] font-sans transition-all duration-150',
    'border focus-visible:outline-none focus-visible:ring-0',
    'placeholder:text-foreground/30',
    isDark
      ? 'bg-[hsl(0_0%_10%)] border-[hsl(0_0%_100%/0.10)] text-[hsl(248_30%_94%)] focus-visible:border-[#7C5CFC]/70 focus-visible:ring-1 focus-visible:ring-[#7C5CFC]/30'
      : 'bg-white border-[hsl(246_20%_12%/0.14)] text-[hsl(246_20%_12%)] focus-visible:border-[#7C5CFC]/60 focus-visible:ring-1 focus-visible:ring-[#7C5CFC]/20',
  ].join(' ');
}

// ─── ChipGroup ────────────────────────────────────────────────────────────────

function ChipGroup({
  options, selected, onChange, isDark, withIcon = false,
}: {
  options: { id: string; label: string; icon?: string }[];
  selected: string;
  onChange: (id: string) => void;
  isDark: boolean;
  withIcon?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={withIcon ? "Select topic" : "Select timeline"}>
      {options.map((o) => {
        const active = selected === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className="font-sans text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer select-none"
            style={{
              background: active ? 'rgba(124,92,252,0.12)' : isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 97%)',
              color: active ? '#7C5CFC' : 'hsl(var(--foreground)/0.50)',
              border: `1px solid ${active ? 'rgba(124,92,252,0.30)' : isDark ? 'hsl(0 0% 100% / 0.07)' : 'hsl(220 15% 15% / 0.08)'}`,
              fontWeight: active ? 600 : 400,
            }}
          >
            {withIcon && o.icon && <span className="mr-1 opacity-70">{o.icon}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

const FieldRow = ({ id, label, children, error }: {
  id: string; label: string; children: React.ReactNode; error?: string;
}) => (
  <div className="flex flex-col gap-1">
    <Label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">
      {label}
    </Label>
    {children}
    {error && (
      <p className="font-sans text-[11px] text-[#7C5CFC] flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
          <path d="M6 3v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── File helpers ─────────────────────────────────────────────────────────────

interface AF { file: File; id: string; }
const fmtSize = (b: number) =>
  b > 1_000_000 ? `${(b / 1_000_000).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

const FileChip = ({ af, isDark, onRemove }: { af: AF; isDark: boolean; onRemove: () => void; }) => {
  const ext = af.file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
  const isImg = af.file.type.startsWith('image/');
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border"
      style={{
        background: isDark ? 'hsl(0 0% 10%)' : 'hsl(0 0% 98%)',
        borderColor: isDark ? 'hsl(0 0% 100% / 0.09)' : 'hsl(220 15% 15% / 0.10)',
      }}
    >
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 font-mono text-[8px] font-bold"
        style={{
          background: isImg ? 'rgba(124,92,252,0.10)' : 'rgba(0,212,255,0.12)',
          color: isImg ? '#7C5CFC' : '#00D4FF',
        }}
      >
        {isImg ? '⎋' : ext.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[11px] text-foreground truncate leading-tight">{af.file.name}</p>
        <p className="font-mono text-[9px] text-foreground/35">{fmtSize(af.file.size)}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${af.file.name}`}
        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#7C5CFC]/10 transition-colors text-foreground/30 hover:text-[#7C5CFC]"
      >
        <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
          <line x1="1" y1="1" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="1" x2="1" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

const UploadZone = ({ files, isDark, onAdd, onRemove, error }: {
  files: AF[]; isDark: boolean; onAdd: (f: File[]) => void; onRemove: (id: string) => void; error?: string;
}) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const drop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false); onAdd(Array.from(e.dataTransfer.files));
  }, [onAdd]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">Attachments</span>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(0,212,255,0.12)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.22)' }}>
          optional
        </span>
      </div>
      <div
        role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        className="w-full rounded-xl border-2 border-dashed cursor-pointer flex items-center gap-3 px-4 py-2.5 transition-all duration-150"
        style={{
          borderColor: error ? 'rgba(124,92,252,0.4)' : drag ? 'rgba(124,92,252,0.5)' : isDark ? 'hsl(0 0% 100%/0.09)' : 'hsl(220 15% 15%/0.12)',
          background: drag ? 'rgba(124,92,252,0.04)' : 'transparent',
        }}
        aria-label="Upload files"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: drag ? 'rgba(124,92,252,0.10)' : isDark ? 'hsl(0 0% 14%)' : 'hsl(220 14% 96%)' }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 11V3M8 3L5 6M8 3L11 6" stroke={drag ? '#7C5CFC' : 'hsl(var(--foreground)/0.45)'}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 13h11" stroke={drag ? '#7C5CFC' : 'hsl(var(--foreground)/0.25)'}
              strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[12px] text-foreground/65">
            Drop files or <span style={{ color: '#7C5CFC' }}>browse</span>
          </p>
          <p className="font-mono text-[9px] text-foreground/30">PDF · DOCX · PNG · JPG · ZIP — max 10 MB</p>
        </div>
        <input
          ref={inputRef} type="file" multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
          className="sr-only"
          onChange={(e) => { onAdd(Array.from(e.target.files ?? [])); e.target.value = ''; }}
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
        <div className="flex flex-wrap gap-1.5">
          {files.map((af) => (
            <FileChip key={af.id} af={af} isDark={isDark} onRemove={() => onRemove(af.id)} />
          ))}
        </div>
      )}
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
    register, handleSubmit, watch, control, reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', topic: 'project', timeline: 'flexible' },
    mode: 'onTouched',
  });

  const nameVal = watch('name');
  const emailVal = watch('email');
  const msgVal  = watch('message');

  const addFiles = useCallback((incoming: File[]) => {
    let errorStr: string | undefined;
    const validFiles: AF[] = [];
    incoming.forEach((f) => {
      if (f.size > 10 * 1024 * 1024) errorStr = `${f.name} exceeds 10 MB limit`;
      else validFiles.push({ file: f, id: `${f.name}-${Date.now()}-${Math.random()}` });
    });
    if (errorStr) { setFileError(errorStr); setTimeout(() => setFileError(undefined), 4000); }
    if (validFiles.length > 0) setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback(
    (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id)), [],
  );

  const onSubmit = (_data: ContactFormData) => {
    setSending(true);
    setTimeout(() => {
      setSending(false); setSubmitted(true); reset(); setFiles([]);
      setTimeout(() => setSubmitted(false), 10000);
    }, 1400);
  };

  const ready = nameVal?.trim() && emailVal?.trim() && msgVal?.trim() && Object.keys(errors).length === 0;

  const cardBg  = isDark ? 'rgba(15, 15, 15, 0.45)' : 'rgba(255, 255, 255, 0.60)';
  const cardBdr = isDark ? 'hsl(0 0% 100% / 0.09)'     : 'hsl(220 15% 15% / 0.15)';
  const blockBdr= isDark ? 'hsl(0 0% 100% / 0.07)'     : 'hsl(220 15% 15% / 0.08)';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-[60px] sm:py-[80px] md:py-[100px] relative overflow-hidden"
    >
      {/* Background Artwork */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[85%] pointer-events-none z-0 overflow-hidden">
        <motion.img
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isDark ? 0.7 : 0.6, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={isDark ? yujiDark : yujiWhite}
          alt="Contact Background"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-left"
          style={{ mixBlendMode: isDark ? 'screen' : 'multiply', opacity: isDark ? 0.7 : 0.6, willChange: 'opacity, transform' }}
        />
        {/* Soft fade gradients */}
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="max-w-[860px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">

        {/* Header */}
        <div className="text-center mb-8 md:mb-10 flex flex-col items-center">
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-4">
            Let&apos;s{' '}
            <span className="font-playfair italic font-medium text-[#7C5CFC]">Connect</span>
          </h2>
          <p className="text-sm text-foreground/50 dark:text-foreground/60 leading-relaxed max-w-[320px]">
            Architecting scalable systems and refined sensory experiences across 10 years of engineering.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-5 sm:p-6 md:p-7"
          style={{
            background: cardBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${cardBdr}`,
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.05)',
          }}
        >
          {submitted ? (
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10.5l4 4L16 6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-[18px] font-bold text-foreground leading-tight">
                  Sent. I&apos;ll be in touch.
                </h3>
                <p className="font-sans text-[12px] text-foreground/50 mt-0.5">
                  You&apos;ll hear back from a real email, not a no-reply.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-foreground/35 hover:text-[hsl(var(--crimson))] transition-colors flex-shrink-0"
              >
                ← Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" noValidate>

              {/* Row 1: title + topic inline */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-[16px] sm:text-[18px] font-bold text-foreground leading-tight">
                    Send a message
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.12)' }} />
                    <span className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">~24h</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50 hidden sm:block">Topic</span>
                  <Controller
                    name="topic" control={control}
                    render={({ field }) => (
                      <ChipGroup options={TOPICS} selected={field.value} onChange={field.onChange} isDark={isDark} withIcon />
                    )}
                  />
                </div>
              </div>

              <div style={{ borderBottom: `1px solid ${blockBdr}` }} />

              {/* Row 2: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldRow id="cf-name" label="Name" error={errors.name?.message}>
                  <Input id="cf-name" className={inputCls(isDark)} placeholder="Ada Lovelace"
                    {...register('name')} aria-invalid={!!errors.name} />
                </FieldRow>
                <FieldRow id="cf-email" label="Email" error={errors.email?.message}>
                  <Input id="cf-email" type="email" className={inputCls(isDark)} placeholder="ada@example.com"
                    {...register('email')} aria-invalid={!!errors.email} />
                </FieldRow>
              </div>

              {/* Row 3: Message */}
              <FieldRow id="cf-msg" label="Message" error={errors.message?.message}>
                <div className="relative">
                  <Textarea
                    id="cf-msg"
                    className={inputCls(isDark) + ' min-h-[90px] resize-none pr-14'}
                    placeholder="Tell me about the project, the role, or just say hello."
                    maxLength={800}
                    {...register('message')}
                    aria-invalid={!!errors.message}
                  />
                  <span
                    className="absolute bottom-2.5 right-4 font-mono text-[10px] pointer-events-none"
                    style={{ color: (msgVal?.length ?? 0) > 720 ? 'hsl(var(--crimson))' : 'hsl(var(--foreground)/0.22)' }}
                    aria-live="polite" aria-atomic="true"
                  >
                    {msgVal?.length ?? 0}/800
                  </span>
                </div>
              </FieldRow>

              {/* Row 4: Timeline + Attachments */}
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3.5 items-start">
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/75">Timeline</Label>
                  <Controller
                    name="timeline" control={control}
                    render={({ field }) => (
                      <ChipGroup options={TIMELINES} selected={field.value} onChange={field.onChange} isDark={isDark} />
                    )}
                  />
                </div>
                <UploadZone files={files} isDark={isDark} onAdd={addFiles} onRemove={removeFile} error={fileError} />
              </div>

              <div style={{ borderBottom: `1px solid ${blockBdr}` }} />

              {/* Row 5: Submit + trust */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                <Button
                  type="submit"
                  disabled={sending || !ready}
                  className="w-full sm:w-auto font-display font-bold text-[13px] tracking-wide rounded-xl px-7 py-2.5 h-auto relative overflow-hidden transition-all duration-200"
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
                        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"
                          strokeDasharray="18" strokeDashoffset="6" strokeLinecap="round" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    <>
                      Send message →
                      {ready && (
                        <span aria-hidden="true" className="absolute inset-0 pointer-events-none"
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

                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 sm:ml-auto">
                  {[
                    { icon: 'star', label: 'No spam' },
                    { icon: 'mail', label: 'NDA-friendly' },
                    { icon: 'clock', label: 'Same-day reply' },
                  ].map(({ icon, label }) => (
                    <span key={label} className="flex items-center gap-1">
                      {icon === 'star' && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                            fill="hsl(var(--gold)/0.55)" stroke="hsl(var(--gold)/0.7)" strokeWidth="0.5" />
                        </svg>
                      )}
                      {icon === 'mail' && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <rect x="1.5" y="4" width="9" height="6.5" rx="1" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" />
                          <path d="M1.5 5.5L6 8L10.5 5.5" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" />
                        </svg>
                      )}
                      {icon === 'clock' && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="4.5" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" />
                          <path d="M6 3.5V6L7.5 7" stroke="hsl(var(--gold)/0.5)" strokeWidth="0.9" strokeLinecap="round" />
                        </svg>
                      )}
                      <span className="font-sans text-[10px] text-foreground/30">{label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cshimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      {/* Tactical Fade into Footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-30" 
        style={{ background: 'linear-gradient(to top, hsl(var(--background)), transparent)' }} 
      />
    </section>
  );
};

export default Contact;