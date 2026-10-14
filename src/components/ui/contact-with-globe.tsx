"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import contactArtDark from "@/assets/images/contact/Yuji_Itadori_dark.webp";
import contactArtLight from "@/assets/images/contact/Yuji_Itadori_white.webp";
import {
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  Copy,
  Check,
  Paperclip,
  X,
} from "lucide-react";
import { useTheme } from "@app/providers/theme-provider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactBentoProps {
  id?: string;
  className?: string;
  email?: string;
  location?: string;
  status?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const smoothEase = [0.16, 1, 0.3, 1] as const;

const letterClass =
  "text-[17px] md:text-[19px] leading-[2.1] text-foreground/85";

const blankClass =
  "inline-block bg-transparent border-0 border-b border-dotted border-foreground/30 hover:border-foreground/50 focus:border-solid focus:border-[#7C5CFC] outline-none px-1.5 py-1 text-[17px] md:text-[19px] leading-snug text-foreground placeholder:text-foreground/30 caret-[#7C5CFC] transition-colors align-baseline";

// ─── The fill-in blank ────────────────────────────────────────────────────────

function Blank({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  multiline = false,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  multiline?: boolean;
}) {
  if (multiline) {
    return (
      <textarea
        id={id}
        required
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(blankClass, "block w-full resize-none align-top", className)}
      />
    );
  }
  return (
    <input
      id={id}
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(blankClass, className)}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactWithGlobe({
  id = "contact",
  className,
  email = "gayankavinda98v.lk@gmail.com",
  location = "Colombo, Sri Lanka",
  status = "Available for selective opportunities",
  githubUrl = "https://github.com/GayanKavinda",
  linkedinUrl = "https://linkedin.com/in/yourprofile",
  twitterUrl = "https://twitter.com",
}: ContactBentoProps) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (sendTimer.current) clearTimeout(sendTimer.current);
      if (successTimer.current) clearTimeout(successTimer.current);
    },
    [],
  );

  // Art plate mask direction depends on the breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const picked = Array.from(list);
    setFiles((prev) => [...prev, ...picked].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.max(1, Math.round(bytes / 1024))} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (successTimer.current) clearTimeout(successTimer.current);
    setSending(true);
    sendTimer.current = setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      successTimer.current = setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full min-h-screen bg-white dark:bg-background text-foreground overflow-hidden flex items-center",
        className,
      )}
    >
      {/* ── Full-bleed art plate ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: smoothEase }}
        className="absolute inset-x-0 top-0 h-[44vh] md:inset-y-0 md:left-0 md:right-auto md:w-[44vw] md:h-auto"
      >
        <img
          src={isDark ? contactArtDark : contactArtLight}
          alt=""
          className="w-full h-full object-cover object-top"
          style={{
            WebkitMaskImage: isMobile
              ? "linear-gradient(to bottom, black 55%, transparent 100%)"
              : "linear-gradient(to right, black 55%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#7C5CFC]/10 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#7C5CFC]/10" />

        {/* Rubber stamp, pressed by hand */}
        <motion.div
          initial={{ opacity: 0, rotate: -14, scale: 0.9 }}
          whileInView={{ opacity: 1, rotate: -5, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.55, ease: smoothEase }}
          className="absolute bottom-10 left-6 md:bottom-14 md:left-10 border-2 border-[#d60d86] text-[#d60d86] font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 bg-white/70 dark:bg-black/40 backdrop-blur-sm"
        >
          Open to work
        </motion.div>
      </motion.div>

      {/* ── The letter ── */}
      <div className="relative z-10 w-full px-6 md:px-14 lg:px-24 pt-[44vh] md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="w-full md:max-w-[600px] md:ml-auto py-14 md:py-20"
        >
          <h2 className="font-jakarta font-semibold text-[34px] md:text-[42px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Talk to me like a{" "}
            <span className="font-playfair italic font-medium text-[#d60d86]">
              person
            </span>
            .
          </h2>

          <form onSubmit={handleSubmit} className="mt-9">
            <p className={letterClass}>
              Hi, I&apos;m{" "}
              <Blank
                id={`${id}-name`}
                value={formData.name}
                onChange={(name) => setFormData({ ...formData, name })}
                placeholder="your name"
                className="w-full sm:w-[26%] min-w-[140px]"
              />
              , reaching out from{" "}
              <Blank
                id={`${id}-email`}
                type="email"
                value={formData.email}
                onChange={(email) => setFormData({ ...formData, email })}
                placeholder="your email"
                className="w-full sm:w-[30%] min-w-[150px]"
              />
              .
            </p>

            <p className={cn(letterClass, "mt-6")}>
              It&apos;s about{" "}
              <Blank
                id={`${id}-subject`}
                value={formData.subject}
                onChange={(subject) => setFormData({ ...formData, subject })}
                placeholder="a new role, a project, or an idea"
                className="w-full sm:w-[62%] min-w-[200px]"
              />
              .
            </p>

            <p className={cn(letterClass, "mt-6")}>
              Here&apos;s the story{" "}
              <Blank
                id={`${id}-message`}
                multiline
                value={formData.message}
                onChange={(message) => setFormData({ ...formData, message })}
                placeholder="a few lines about what you're building, where it's at, and how I can help"
                className="mt-1"
              />
            </p>

            {/* Optional attachments — a quiet link, not a box */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(e.dataTransfer.files);
                }}
                className={`inline-flex items-center gap-2 text-[13px] transition-colors cursor-pointer ${
                  dragging
                    ? "text-[#7C5CFC]"
                    : "text-foreground/40 hover:text-[#7C5CFC]"
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                Attach anything useful — specs, a deck, a screenshot (optional)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              {files.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {files.map((file, i) => (
                    <span
                      key={`${file.name}-${i}`}
                      className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg border border-foreground/10 text-[11px] text-foreground/70"
                    >
                      <Paperclip className="w-3 h-3 text-foreground/40 shrink-0" />
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <span className="text-foreground/35 font-mono">{formatSize(file.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Remove ${file.name}`}
                        className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Signature CTA — the clipped gradient from the navbar */}
              <button
                type="submit"
                disabled={sending}
                className="group flex items-center gap-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  boxShadow: isDark
                    ? "0 0 20px hsl(var(--primary) / 0.35)"
                    : "0 8px 24px hsl(var(--primary) / 0.25)",
                }}
              >
                {sending ? (
                  "Sending…"
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sent
                  </>
                ) : (
                  <>
                    Send it
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${email}`}
                  className="text-[13px] text-foreground hover:text-[#7C5CFC] transition-colors"
                >
                  {email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email address"
                  className="text-foreground/40 hover:text-[#7C5CFC] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2.5">
              {[
                { name: "GitHub", href: githubUrl, Icon: Github },
                { name: "LinkedIn", href: linkedinUrl, Icon: Linkedin },
                { name: "Twitter", href: twitterUrl, Icon: Twitter },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  className="w-10 h-10 rounded-full border border-black/[0.12] dark:border-white/[0.15] flex items-center justify-center text-foreground/60 hover:text-[#7C5CFC] hover:border-[#7C5CFC] transition-all"
                >
                  <item.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
