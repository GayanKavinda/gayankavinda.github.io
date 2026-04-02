// src/components/sections/Achievements.tsx
// Modern redesign: Glassmorphic cards with subtle gradient borders, animated icon badges, and smooth hover lifts

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const achievements = [
  { title: 'Best Architecture Award',      org: 'Tech Summit APAC',  year: '2024', desc: 'Distributed system design for 10M+ daily transactions', icon: 'trophy' },
  { title: 'Top Open Source Contributor',  org: 'GitHub',            year: '2023', desc: '500+ stars on distributed caching library', icon: 'star' },
  { title: 'Speaker — NodeConf Asia',      org: 'CNCF',             year: '2023', desc: 'Talk on production Kubernetes patterns', icon: 'mic' },
  { title: 'Hackathon Winner — FinTech',   org: 'WSO2',             year: '2022', desc: '1st place among 200+ teams', icon: 'code' },
  { title: 'Stack Overflow Top 1%',        org: 'Stack Overflow',   year: '2022', desc: 'Top contributor in Node.js & TypeScript', icon: 'badge' },
  { title: 'Innovation Prize',             org: 'TechCrunch',       year: '2021', desc: 'Developer tooling category winner', icon: 'lightbulb' },
];

const Icon = ({ type }: { type: string }) => {
  const base = { width: 20, height: 20, stroke: 'currentColor', strokeWidth: 1.5, fill: 'none' };
  const icons: Record<string, JSX.Element> = {
    trophy:   <svg viewBox="0 0 24 24" {...base}><path d="M8 21h8m-4-9v9m-8-3h16M6 4v6a6 6 0 006 6 6 6 0 006-6V4M6 4H3m15 0h3"/></svg>,
    star:     <svg viewBox="0 0 24 24" {...base}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    mic:      <svg viewBox="0 0 24 24" {...base}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v4m-4 0h8"/></svg>,
    code:     <svg viewBox="0 0 24 24" {...base}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>,
    badge:    <svg viewBox="0 0 24 24" {...base}><path d="M12 2l3 6 6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L2 9l6-1 3-6z"/></svg>,
    lightbulb:<svg viewBox="0 0 24 24" {...base}><path d="M9 18h6m-6 0a3 3 0 01-3-3v-1a3 3 0 013-3V9a6 6 0 1112 0v3a3 3 0 013 3v1a3 3 0 01-3 3m-6 0a3 3 0 003-3"/></svg>,
  };
  return <div className="text-[#E8A820]">{icons[type] || icons.trophy}</div>;
};

const Achievements = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ach-item', {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-[100px] md:py-[140px] relative bg-background overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E8A820]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-6">
        {/* Modern Header */}
        <div className="text-center pb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Recognition</p>
          <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
            Notable <span className="font-playfair italic font-medium text-crimson">Achievements</span>
          </h2>
          {/* Minimal divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
          </div>
        </div>

        {/* Achievement Cards - Modern glassmorphic design */}
        <div className="space-y-3">
          {achievements.map((item, i) => (
            <div
              key={i}
              className="ach-item group elevation-card relative rounded-lg border border-border bg-card backdrop-blur-sm p-5 hover:border-[#E8A820]/60 hover:bg-[#E8A820]/[0.05] hover:shadow-xl hover:shadow-[#E8A820]/10 hover:-translate-y-[3px] transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Subtle left accent - always visible */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E8A820] to-[#C41E3A] opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-4">
                {/* Icon badge */}
                <div className="flex-shrink-0 w-[42px] h-[42px] rounded-lg bg-[#E8A820]/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Icon type={item.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-jakarta font-bold text-[16px] md:text-[17px] text-foreground group-hover:text-[#E8A820] transition-colors duration-200 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="font-mono text-[11px] text-foreground/50 mt-0.5">
                        {item.org}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#E8A820]/15 text-[#E8A820] tracking-[0.05em] flex-shrink-0">
                      {item.year}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-foreground/60 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;


