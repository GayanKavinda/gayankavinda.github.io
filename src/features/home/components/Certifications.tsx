import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { Cloud, Server, Database, Layers, ExternalLink } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const certificationsData = [
  {
    name: 'AWS Solutions Architect',
    issuer: 'AWS',
    year: '2023',
    icon: Cloud,
    color: '14 100% 50%',
    link: 'https://aws.amazon.com/certification/',
    thumb: '/certs/aws-sa.png'
  },
  {
    name: 'Google Cloud Architect',
    issuer: 'Google Cloud',
    year: '2022',
    icon: Server,
    color: '217 89% 61%',
    link: 'https://cloud.google.com/certification',
    thumb: '/certs/gcp-pca.png'
  },
  {
    name: 'CKA',
    issuer: 'CNCF',
    year: '2021',
    icon: Database,
    color: '252 95% 68%',
    link: 'https://www.cncf.io/certification/cka/',
    thumb: '/certs/cka.png'
  },
  {
    name: 'Terraform Associate',
    issuer: 'HashiCorp',
    year: '2021',
    icon: Layers,
    color: '0 0% 100%',
    link: 'https://www.hashicorp.com/certification',
    thumb: '/certs/terraform.png'
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

  const accent = `hsl(${item.color})`;
  const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, hsla(${item.color}, 0.08), transparent 55%)`;

  return (
    <motion.a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.42, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`
        relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] dark:bg-black/[0.2]
        transition-[border-color,box-shadow,transform] duration-300
        glass elevation-card
        ${hovered ? 'border-white/16 shadow-[0_10px_34px_rgba(0,0,0,0.32)]' : ''}
      `}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ background: spotlightBg, opacity: hovered ? 1 : 0 }}
      />

      <div className="relative z-10 p-4 flex flex-col gap-3">
        <div className="w-full h-28 sm:h-24 md:h-26 lg:h-28 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
          <img
            src={item.thumb}
            alt={`${item.name} certification badge`}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-jakarta font-medium text-sm md:text-[15px] text-foreground tracking-tight leading-none truncate">
              {item.name}
            </h3>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-foreground/40 leading-none truncate">
              {item.issuer} • {item.year}
            </p>
          </div>
          <div className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-foreground/40">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative py-14 md:py-20 flex items-center overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      {/* Parallax Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transform: `translateY(${useTransform(useScroll({ target: sectionRef, offset: ['start center', 'end center'] }).scrollY, [0, 1], [100, -100])}px)`
        }}
      >
        <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#10B981]/10 via-[#F59E0B]/10 to-transparent blur-[80px]" />
      </motion.div>

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
            <span className="font-playfair italic font-medium text-[#10B981]">
              Credentials
            </span>
          </h2>
          <p className="text-sm text-foreground/40 leading-relaxed max-w-[400px]">
            Industry-recognized certifications validating expertise in modern cloud and engineering paradigms.
          </p>
        </motion.div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {certificationsData.map((item, index) => (
            <BadgeCard key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
