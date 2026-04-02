//src/pages/AllProjects.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { setSEO } from '@/lib/seo';

const allProjects = [
  { slug: 'distributed-task-engine', name: 'Distributed Task Engine', desc: 'High-throughput task orchestration', tags: ['Go', 'Kafka', 'Redis'], cat: 'Web' },
  { slug: 'real-time-analytics', name: 'Real-time Analytics', desc: 'WebSocket-driven dashboard', tags: ['React', 'D3.js', 'Node.js'], cat: 'Web' },
  { slug: 'authshield-sdk', name: 'AuthShield SDK', desc: 'Zero-trust authentication SDK', tags: ['TypeScript', 'OAuth'], cat: 'Open Source' },
  { slug: 'datapipe', name: 'DataPipe', desc: 'Real-time ETL pipeline', tags: ['Python', 'Kafka'], cat: 'Web' },
  { slug: 'clouddash', name: 'CloudDash', desc: 'Infrastructure monitoring', tags: ['React', 'AWS'], cat: 'Web' },
  { slug: 'apiforge', name: 'APIForge', desc: 'API gateway framework', tags: ['Go', 'gRPC'], cat: 'Open Source' },
  { slug: 'mobiletrack', name: 'MobileTrack', desc: 'GPS tracking app', tags: ['React Native', 'Firebase'], cat: 'Mobile' },
  { slug: 'chatscale', name: 'ChatScale', desc: 'Scalable chat infrastructure', tags: ['Node.js', 'WebSocket'], cat: 'Web' },
  { slug: 'devmetrics', name: 'DevMetrics', desc: 'Developer productivity tool', tags: ['TypeScript', 'PostgreSQL'], cat: 'Open Source' },
];

const tabs = ['All', 'Web', 'Mobile', 'Open Source'];

const AllProjects = () => {
  const [active, setActive] = useState('All');
  const navigate = useNavigate();
  const filtered = active === 'All' ? allProjects : allProjects.filter(p => p.cat === active);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSEO({ title: 'All Projects', description: 'A complete list of projects and open source contributions by Gara Yaka.' });
    return () => setSEO();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 md:pt-36 pb-24 max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Back */}
        <button
          onClick={() => navigate('/#projects')}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/35 hover:text-[#D4891A] transition-colors mb-10 group"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:-translate-x-1 transition-transform">
            <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </button>

        {/* Header */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Portfolio</p>
        <h1 className="font-playfair font-black text-[clamp(36px,6vw,56px)] text-foreground leading-tight tracking-tight">
          All <em className="italic text-[#C41E3A]">Projects</em>
        </h1>
        <div className="flex items-center gap-3 mt-4 mb-10">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4891A]" />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-10 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`font-mono text-[11px] uppercase tracking-wider pb-3 transition-colors shrink-0 relative ${
                active === t ? 'text-[#C41E3A]' : 'text-foreground/45 hover:text-foreground/70'
              }`}
            >
              {t}
              {active === t && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C41E3A]" />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filtered.map(p => (
            <div
              key={p.name}
              onClick={() => navigate(`/projects/${p.slug}`)}
              className="group rounded-xl border border-border bg-card elevation-card overflow-hidden hover:border-[#D4891A]/40 hover:-translate-y-[2px] transition-all duration-300 relative cursor-pointer"
            >
              <div className="h-[180px] flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--card)) 50%, hsl(var(--muted)) 100%)' }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(196,30,58,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,0.15) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
                <span className="font-mono text-[12px] text-foreground/20 z-10">[ Screenshot ]</span>
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#D4891A] group-hover:w-full transition-all duration-500" />
              </div>
              
              <div className="p-6 flex flex-col h-[calc(100%-180px)]">
                <h3 className="font-jakarta font-bold text-[18px] text-foreground group-hover:text-[#D4891A] transition-colors">{p.name}</h3>
                <p className="font-sans text-[14px] text-foreground/50 mt-1.5 leading-relaxed line-clamp-2 pb-2">{p.desc}</p>
                
                <div className="mt-auto">
                    <div className="flex gap-[6px] mt-2 flex-wrap mb-5">
                      {p.tags.map(t => (
                        <span key={t} className="font-mono text-[10px] text-[#C41E3A] border border-[#C41E3A]/25 bg-[#C41E3A]/[0.08] px-2.5 py-0.5 rounded-[3px]">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#D4891A] group-hover:gap-3 transition-all pt-1 border-t border-border">
                      <span className='pt-2'>View Case Study</span>
                      <svg className='pt-2' width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 6h8M7 3l3 3-3 3"/>
                      </svg>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProjects;
