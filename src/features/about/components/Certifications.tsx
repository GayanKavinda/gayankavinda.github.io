//src/components/sections/Certifications.tsx
// Modern redesign: Gradient-bordered cards with subtle glow effects and badge-style presentation

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const certifications = [
  { name: 'AWS Solutions Architect',      issuer: 'Amazon Web Services', abbr: 'AWS',  year: '2024', icon: 'aws'   },
  { name: 'Certified Kubernetes Admin',   issuer: 'CNCF',               abbr: 'CKA',  year: '2024', icon: 'k8s'   },
  { name: 'Google Cloud Professional',    issuer: 'Google',             abbr: 'GCP',  year: '2024', icon: 'cloud' },
  { name: 'Meta React Developer',         issuer: 'Meta',               abbr: 'META', year: '2023', icon: 'react' },
  { name: 'MongoDB Associate Developer',  issuer: 'MongoDB',            abbr: 'MDB',  year: '2023', icon: 'db'    },
  { name: 'GitHub Actions Certified',     issuer: 'GitHub',             abbr: 'GH',   year: '2023', icon: 'git'   },
];

const CertIcon = ({ type }: { type: string }) => {
  const base = { width: 22, height: 22, stroke: 'currentColor', strokeWidth: 1.5, fill: 'none' };
  const icons: Record<string, JSX.Element> = {
    aws:   <svg viewBox="0 0 24 24" {...base}><path d="M6 9.5l6-3.5 6 3.5M12 21V13m0 0l-6-3.5m6 3.5l6-3.5"/></svg>,
    k8s:   <svg viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>,
    cloud: <svg viewBox="0 0 24 24" {...base}><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,
    react: <svg viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></svg>,
    db:    <svg viewBox="0 0 24 24" {...base}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/></svg>,
    git:   <svg viewBox="0 0 24 24" {...base}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v8a2 2 0 002 2h8"/></svg>,
  };
  return <div className="text-[#E8A820]">{icons[type] || icons.aws}</div>;
};

const Certifications = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cert-card', {
        y: 25, opacity: 0, stagger: 0.06, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-[100px] md:py-[140px] relative bg-background overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8A820]/[0.02] via-transparent to-[#C41E3A]/[0.02] pointer-events-none" />

      <div className="max-w-[900px] mx-auto px-6">
        {/* Modern Header */}
        <div className="text-center pb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Credentials</p>
          <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
            Professional <span className="font-playfair italic font-medium text-crimson">Certifications</span>
          </h2>
          {/* Minimal divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
          </div>
        </div>

        {/* Modern Grid - Glassmorphic cards with gradient borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {certifications.map((cert, i) => (
            <div
              key={i}
              className="cert-card group elevation-card relative rounded-lg border border-border bg-card backdrop-blur-sm p-4 hover:border-[#E8A820]/60 hover:shadow-xl hover:shadow-[#E8A820]/10 hover:-translate-y-[3px] transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E8A820]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon + content */}
              <div className="relative flex flex-col h-full">
                <div className="flex items-start gap-3 mb-3">
                  {/* Icon badge with gradient background */}
                  <div className="flex-shrink-0 w-[44px] h-[44px] rounded-lg bg-gradient-to-br from-[#E8A820]/15 to-[#E8A820]/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <CertIcon type={cert.icon} />
                  </div>
                  {/* Year badge */}
                  <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#C41E3A]/15 text-[#C41E3A] tracking-[0.05em] flex-shrink-0 self-start">
                    {cert.year}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-jakarta text-[13px] md:text-[14px] font-bold text-foreground leading-[1.35] tracking-tight group-hover:text-[#E8A820] transition-colors duration-200">
                    {cert.name}
                  </h3>
                  <p className="font-mono text-[10px] text-foreground/40 mt-1.5">
                    {cert.issuer}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#E8A820] to-[#C41E3A] opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;


