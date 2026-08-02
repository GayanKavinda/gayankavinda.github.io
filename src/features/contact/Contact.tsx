import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from '@google/genai';

import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ACCENT = '#d60d86';

// ─── Schema ──────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().min(1, 'Email required').email('Enter valid email'),
  message: z.string().min(1, 'Message required'),
  services: z.array(z.string()).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 'frontend', label: 'Frontend Dev' },
  { id: 'fullstack', label: 'Fullstack Build' },
  { id: 'automation', label: 'Automation / n8n' },
  { id: 'consulting', label: 'Consulting' },
];

const LOGOS = [
  { name: 'Google', slug: 'google' },
  { name: 'Spotify', slug: 'spotify' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Netflix', slug: 'netflix' },
  { name: 'Microsoft', slug: 'microsoft' },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const DribbbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    <path d="M12.84 20.7a10 10 0 0 1-11.8-10.74" />
    <path d="M2.86 8.53a10 10 0 0 1 18.28-2.5" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const PaperclipIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FileIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [attachments, setAttachments] = useState<{ file: File; preview: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentsRef = useRef(attachments);
  attachmentsRef.current = attachments;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      services: [],
    },
  });

  const currentMessage = watch('message');

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((a) => {
        if (a.preview) URL.revokeObjectURL(a.preview);
      });
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prev) => prev - 1);
      }, 1000);
    } else if (cooldownTimer === 0 && cooldown) {
      setCooldown(false);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer, cooldown]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const item = prev[index];
      if (item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const fetchPolishedMessage = async (text: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
    if (!apiKey || apiKey === 'your_actual_gemini_api_key_here') {
      throw new Error('VITE_GEMINI_API_KEY is missing in environment variables.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an assistant for a full-stack software engineer\'s portfolio contact form.
Rewrite the following client project draft into a clear, professional, and well-structured project inquiry message while preserving the core intent.
Keep it concise and friendly. Output ONLY the polished message text — no markdown fences, no conversational intro, no extra commentary.

Draft: "${text.trim()}"`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
      throw new Error('Received an empty response from Gemini.');
    } catch (err: any) {
      if (
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('Quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED')
      ) {
        throw new Error('Rate limit reached (Free Tier). Please wait a few seconds and try again.');
      }
      throw err;
    }
  };

  const handleAiPolish = async () => {
    if (!currentMessage?.trim() || isEnhancing || cooldown) return;

    setIsEnhancing(true);
    setEnhanceError(null);

    try {
      const polished = await fetchPolishedMessage(currentMessage);
      if (polished) {
        setValue('message', polished, { shouldValidate: true });
      }
    } catch (err: any) {
      console.error('AI enhancement error:', err);
      setEnhanceError(err?.message ?? 'Failed to enhance. Try again.');
      setCooldown(true);
      setCooldownTimer(10);
    } finally {
      setIsEnhancing(false);
    }
  };

  const onSubmit = (_data: ContactFormData) => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      reset();
      setAttachments([]);
    }, 1500);
  };

  // ─── Pure White (light) | Glass (dark) ────────────────────────────────────

  const glassCard = "relative overflow-hidden rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]";

  const glassInput = "h-10 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] shadow-sm dark:shadow-none text-foreground text-xs placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:border-accent/30 transition-all duration-300 hover:border-gray-400 dark:hover:bg-white/[0.06]";

  const glassTextarea = "min-h-[110px] rounded-xl bg-white dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] shadow-sm dark:shadow-none text-foreground text-xs placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:border-accent/30 resize-y transition-all duration-300 hover:border-gray-400 dark:hover:bg-white/[0.06]";

  const chipBtn = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 bg-white dark:bg-white/[0.05] border border-gray-300 dark:border-white/[0.10] shadow-sm dark:shadow-none text-foreground/50 hover:text-foreground/80 hover:bg-gray-50 dark:hover:bg-white/[0.08] hover:border-gray-400 dark:hover:border-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";

  const socialIconBtn = "flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] shadow-sm dark:shadow-none text-foreground/40 hover:text-foreground hover:bg-gray-50 dark:hover:bg-white/[0.08] hover:border-gray-400 dark:hover:border-white/[0.12] hover:scale-110 transition-all duration-300";

  const attachmentBox = "relative group w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-white/[0.05] border border-gray-300 dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-center";

  const tagPill = "inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-white dark:bg-white/[0.05] text-muted-foreground rounded-full border border-gray-300 dark:border-white/[0.08] shadow-sm dark:shadow-none";

  return (
    <section id="contact" className="py-16 md:py-24 bg-background text-foreground relative overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.03] pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)` }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10 items-end">
          <div className="md:col-span-5 space-y-2">
            <span className={cn(tagPill)}>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Get in Touch
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Connect With <span style={{ color: ACCENT }}>Me</span>
              <span className="text-xl md:text-2xl">👋</span>
            </h2>
          </div>

          <div className="md:col-span-7">
            <p className="text-xs md:text-sm text-muted-foreground/80 max-w-lg leading-relaxed">
              Have a project in mind or just want to say hi, drop a message and I&apos;ll get back to you.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Form */}
          <div className={cn("lg:col-span-6 p-5 sm:p-6", glassCard)}>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/30 to-transparent dark:from-white/[0.04] pointer-events-none" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" noValidate>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="cf-name" className="text-[11px] font-medium text-foreground/60 uppercase tracking-wider">
                  Name
                </Label>
                <Input
                  id="cf-name"
                  placeholder="Your name"
                  className={cn(
                    glassInput,
                    errors.name && 'border-red-400/50 focus-visible:ring-red-400/30'
                  )}
                  style={{ ['--tw-ring-color' as any]: ACCENT }}
                  {...register('name')}
                />
                {errors.name && <p className="text-[11px] text-red-400/90">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="cf-email" className="text-[11px] font-medium text-foreground/60 uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="cf-email"
                  type="email"
                  placeholder="you@email.com"
                  className={cn(
                    glassInput,
                    errors.email && 'border-red-400/50 focus-visible:ring-red-400/30'
                  )}
                  style={{ ['--tw-ring-color' as any]: ACCENT }}
                  {...register('email')}
                />
                {errors.email && <p className="text-[11px] text-red-400/90">{errors.email.message}</p>}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cf-message" className="text-[11px] font-medium text-foreground/60 uppercase tracking-wider">
                    Message
                  </Label>
                  <button
                    type="button"
                    onClick={handleAiPolish}
                    disabled={isEnhancing || !currentMessage?.trim() || cooldown}
                    title={
                      cooldown
                        ? `Please wait ${cooldownTimer}s`
                        : !currentMessage?.trim()
                        ? 'Type a draft first'
                        : 'Enhance with Gemini AI'
                    }
                    className={cn(
                      chipBtn,
                      isEnhancing && 'animate-pulse'
                    )}
                  >
                    {isEnhancing ? (
                      <>
                        <svg className="w-2.5 h-2.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        <span>Enhancing…</span>
                      </>
                    ) : cooldown ? (
                      <span>Wait {cooldownTimer}s</span>
                    ) : (
                      <>
                        <SparklesIcon className="w-2.5 h-2.5" />
                        <span>Enhance with AI</span>
                      </>
                    )}
                  </button>
                </div>

                <Textarea
                  id="cf-message"
                  placeholder="Tell me about your project..."
                  className={cn(
                    glassTextarea,
                    errors.message && 'border-red-400/50 focus-visible:ring-red-400/30',
                    isEnhancing && 'opacity-60 pointer-events-none'
                  )}
                  style={{ ['--tw-ring-color' as any]: ACCENT }}
                  {...register('message')}
                />

                {enhanceError && (
                  <p className="text-[11px] text-amber-500/90 flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {enhanceError}
                  </p>
                )}
                {errors.message && <p className="text-[11px] text-red-400/90">{errors.message.message}</p>}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.md"
                />

                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attachments.map((att, i) => (
                      <div
                        key={`${att.file.name}-${i}`}
                        className={cn(attachmentBox)}
                      >
                        {att.preview ? (
                          <img src={att.preview} alt={att.file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-0.5">
                            <FileIcon className="w-4 h-4 text-foreground/30" />
                            <span className="text-[8px] font-mono uppercase text-foreground/40">
                              {att.file.name.split('.').pop()}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        >
                          <XIcon className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(chipBtn, "mt-1")}
                >
                  <PaperclipIcon className="w-2.5 h-2.5" />
                  <span>Attach Files</span>
                  {attachments.length > 0 && (
                    <span
                      className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {attachments.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Services */}
              <div className="space-y-2.5 pt-1">
                <Label className="text-[11px] font-medium text-foreground/60 uppercase tracking-wider">
                  What do you need?
                </Label>
                <Controller
                  name="services"
                  control={control}
                  render={({ field }) => {
                    const currentValues = field.value || [];
                    const toggleService = (id: string) => {
                      if (currentValues.includes(id)) {
                        field.onChange(currentValues.filter((v) => v !== id));
                      } else {
                        field.onChange([...currentValues, id]);
                      }
                    };

                    return (
                      <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                        {SERVICES.map((s) => {
                          const isChecked = currentValues.includes(s.id);
                          return (
                            <label
                              key={s.id}
                              className={cn(
                                "flex items-center gap-2 cursor-pointer group select-none px-2.5 py-2 rounded-xl border transition-all duration-200",
                                isChecked
                                  ? "bg-accent/5 border-accent/15"
                                  : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleService(s.id)}
                                className="w-3.5 h-3.5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/[0.05] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                style={{ accentColor: ACCENT }}
                              />
                              <span className={cn(
                                "text-[11px] font-medium transition-colors",
                                isChecked ? "text-accent" : "text-foreground/40 group-hover:text-foreground/60"
                              )}>
                                {s.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl text-white text-xs font-semibold transition-all duration-300 disabled:opacity-50 hover:brightness-110 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: ACCENT }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">{sending ? 'Sending...' : 'Send Message'}</span>
                  <SendIcon className="relative z-10 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 flex flex-col items-center">

            {/* Profile — engineering frame, corner brackets, no clip-path */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[1.35/1] rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] group">

              {/* accent top rule */}
              <div className="absolute top-0 left-0 right-0 h-[2px] z-20" style={{ backgroundColor: ACCENT }} />

              {/* corner brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/70 z-20 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/70 z-20 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/70 z-20 pointer-events-none" />

              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000"
                alt="Profile portrait"
                className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 transition-all duration-700"
              />

              {/* status tag */}
              <div className="absolute bottom-3 left-3 z-20">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white">Available for Hire</span>
                </div>
              </div>
            </div>

            {/* Name & Socials */}
            <div className="text-center space-y-3 mt-6 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm md:text-base">
                <span className="font-bold text-foreground">Gayan Kavinda</span>
                <span className="text-foreground/20 text-xl leading-none">•</span>
                <span className="text-foreground/50 font-normal">Software Engineer</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                {[
                  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: DribbbleIcon, href: 'https://dribbble.com', label: 'Dribbble' },
                  { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(socialIconBtn)}
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Marquee Logos */}
            <div className="w-full pt-4 border-t border-gray-200 dark:border-white/[0.06] overflow-hidden">
              <div className="flex animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] min-w-max gap-8 items-center">
                {[...LOGOS, ...LOGOS].map((logo, i) => (
                  <img
                    key={`${logo.slug}-${i}`}
                    src={`https://cdn.simpleicons.org/${logo.slug}`}
                    alt={logo.name}
                    className="h-5 object-contain flex-shrink-0 opacity-30 hover:opacity-80 transition-all duration-300 grayscale hover:grayscale-0"
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}