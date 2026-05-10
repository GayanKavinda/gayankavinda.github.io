import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { useTheme } from '@app/providers/theme-provider';
import { Cloud, Server, Database, Layers, ExternalLink } from 'lucide-react';

// Asset imports
import certDark from '@assets/images/certifications/akaza-darkmode.jpeg';
import certWhite from '@assets/images/certifications/tanjiro-whitemode.jpeg';

// ─── Data ─────────────────────────────────────────────────────────────────────

const certificationsData = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    year: '2023',
    icon: Cloud,
    color: 'var(--primary-hsl)',
    skills: ['EC2', 'S3', 'VPC', 'IAM'],
    link: 'https://aws.amazon.com/certification/'
  },
  {
    name: 'Google Cloud Professional Cloud Architect',
    issuer: 'Google Cloud',
    year: '2022',
    icon: Server,
    color: 'var(--secondary-hsl)',
    skills: ['GKE', 'BigQuery', 'Compute'],
    link: 'https://cloud.google.com/certification'
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    year: '2021',
    icon: Database,
    color: 'var(--primary-hsl)',
    skills: ['K8s', 'Pods', 'Networking'],
    link: 'https://www.cncf.io/certification/cka/'
  },
  {
    name: 'HashiCorp Certified: Terraform Associate',
    issuer: 'HashiCorp',
    year: '2021',
    icon: Layers,
    color: 'var(--secondary-hsl)',
    skills: ['IaC', 'Modules', 'State'],
    link: 'https://www.hashicorp.com/certification'
  }
];

// ─── Badge Card Component ─────────────────────────────────────────────────────

const BadgeCard = ({ item, index }: { item: typeof certificationsData[0], index: number }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, hsla(${item.color}, 0.2), transparent 40%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer p-6 flex flex-col items-center text-center
        border transition-[border-color,box-shadow,transform] duration-400 glass shimmer-border elevation-card
        ${hovered
          ? 'border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
          : 'border-white/[0.04] shadow-sm'
        }
      `}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ background: spotlightBg, opacity: hovered ? 1 : 0 }}
      />

      <div className="relative z-10 flex flex-col h-full w-full">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 mx-auto shadow-inner text-foreground/80">
          <item.icon className="w-5 h-5" />
        </div>
        
        <h3 className="font-jakarta font-semibold text-base text-foreground tracking-tight leading-tight mb-2 min-h-[40px] flex items-center justify-center">
          {item.name}
        </h3>
        
        <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-3">
          {item.issuer}
        </div>
        
        <div className="mb-6 flex-grow">
          <span 
            className="inline-block font-mono text-[11px] font-bold tracking-[.1em] px-3 py-1 rounded-full bg-black/20 border border-white/5"
            style={{ color: `hsla(${item.color}, 1)` }}
          >
            {item.year}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {item.skills.map(skill => (
            <span key={skill} className="font-mono text-[9px] uppercase tracking-wider text-foreground/50 border border-white/10 rounded px-2 py-0.5 bg-white/5">
              {skill}
            </span>
          ))}
        </div>

        <a 
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto group flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-widest text-foreground/60 hover:text-white transition-colors border-t border-white/10 pt-4 w-full"
        >
          Verify Credential
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative py-[100px] md:py-[140px] min-h-[70vh] md:min-h-[800px] flex items-center overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      {/* Background Artwork */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[85%] pointer-events-none z-0 overflow-hidden">
        <motion.img
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isDark ? 0.55 : 0.45, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={isDark ? certDark : certWhite}
          alt="Certifications Background"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-right"
          style={{ mixBlendMode: isDark ? 'screen' : 'multiply', willChange: 'opacity, transform' }}
        />
        {/* Soft fade gradients - Fading from the left so the character on the right remains visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center flex flex-col items-center"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Professional{' '}
            <span className="font-playfair italic font-medium text-[#7C5CFC]">
              Credentials
            </span>
          </h2>
          <p className="text-sm text-foreground/40 leading-relaxed max-w-[400px]">
            Industry-recognized certifications validating expertise in modern cloud and engineering paradigms.
          </p>
        </motion.div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {certificationsData.map((item, index) => (
            <BadgeCard key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
