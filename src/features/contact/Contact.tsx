import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().min(1, 'Email required').email('Enter valid email'),
  budget: z.string().optional(),
  message: z.string().min(1, 'Message required'),
  services: z.array(z.string()).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 'website-design', label: 'Website Design' },
  { id: 'ux-design', label: 'UX Design' },
  { id: 'content-creation', label: 'Content Creation' },
  { id: 'strategy-consulting', label: 'Strategy & Consulting' },
];

const LOGOS = [
  { name: 'STAR', src: 'https://placehold.co/80x30/transparent/888888?text=STAR' },
  { name: 'Brand2', src: 'https://placehold.co/80x30/transparent/888888?text=BRAND' },
  { name: 'Shemaroo', src: 'https://placehold.co/80x30/transparent/888888?text=Shemaroo' },
  { name: 'Mercedes-Benz', src: 'https://placehold.co/100x30/transparent/888888?text=Mercedes-Benz' },
  { name: 'University of Mississippi', src: 'https://placehold.co/110x30/transparent/888888?text=MISSISSIPPI' },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

const SendIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const DribbbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    <path d="M12.84 20.7a10 10 0 0 1-11.8-10.74" />
    <path d="M2.86 8.53a10 10 0 0 1 18.28-2.5" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Contact() {
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      budget: '',
      message: '',
      services: [],
    },
  });

  const onSubmit = (_data: ContactFormData) => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      reset();
    }, 1500);
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 items-end">
          <div className="md:col-span-5 space-y-2">
            <span className="inline-block px-2.5 py-1 text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-sm">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              Connect With Me <span className="text-2xl md:text-3xl">👋</span>
            </h2>
          </div>
          
          <div className="md:col-span-7">
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
              Whether you&apos;re looking for more information, have a suggestion, or need help with something, we&apos;re here for you.
            </p>
          </div>
        </div>

        {/* Content Section: Form & Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Box */}
          <div className="lg:col-span-6 bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="cf-name" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Name
                </Label>
                <Input
                  id="cf-name"
                  placeholder="Enter your name here..."
                  className={cn(
                    'h-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400',
                    errors.name && 'border-red-500'
                  )}
                  {...register('name')}
                />
                {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="cf-email" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Email
                </Label>
                <Input
                  id="cf-email"
                  type="email"
                  placeholder="Enter your Email here..."
                  className={cn(
                    'h-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400',
                    errors.email && 'border-red-500'
                  )}
                  {...register('email')}
                />
                {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <Label htmlFor="cf-budget" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Budget
                </Label>
                <Input
                  id="cf-budget"
                  placeholder="Enter the amount"
                  className="h-11 rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400"
                  {...register('budget')}
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="cf-message" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Message
                </Label>
                <Textarea
                  id="cf-message"
                  placeholder="Enter your message"
                  className={cn(
                    'min-h-[120px] rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400 resize-y',
                    errors.message && 'border-red-500'
                  )}
                  {...register('message')}
                />
                {errors.message && <p className="text-[11px] text-red-500">{errors.message.message}</p>}
              </div>

              {/* Services Checkboxes */}
              <div className="space-y-2.5 pt-1">
                <Label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Services
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
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {SERVICES.map((s) => {
                          const isChecked = currentValues.includes(s.id);
                          return (
                            <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleService(s.id)}
                                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0 cursor-pointer"
                              />
                              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#18181b] dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                  <SendIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Profile Image & Info & Clients Logos */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Image Card Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[1.15/1] rounded-3xl overflow-hidden mb-6 bg-neutral-200 dark:bg-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000"
                alt="Profile portrait"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Badge Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm border border-neutral-200/50 dark:border-neutral-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                    Available for Hire
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex items-center justify-center gap-2 text-base md:text-lg">
                <span className="font-bold text-neutral-900 dark:text-white">John Doe</span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span className="text-neutral-500 dark:text-neutral-400 font-normal">UI/UX Designer</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 text-neutral-700 dark:text-neutral-300">
                <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Dribbble">
                  <DribbbleIcon />
                </a>
                <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                  <GithubIcon />
                </a>
              </div>
            </div>

            {/* Client / Partner Logos Strip */}
            <div className="w-full pt-2 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between opacity-60 grayscale hover:grayscale-0 transition-all gap-4 overflow-x-auto">
              {LOGOS.map((logo, index) => (
                <img key={index} src={logo.src} alt={logo.name} className="h-6 object-contain flex-shrink-0" />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}