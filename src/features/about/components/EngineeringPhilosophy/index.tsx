import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ObservabilityMockup } from './mockups/ObservabilityMockup';
import { SimplicityMockup } from './mockups/SimplicityMockup';
import { TestingMockup } from './mockups/TestingMockup';
import { FailureMockup } from './mockups/FailureMockup';

const PRINCIPLES = [
  {
    num: 'STEP 1',
    color: '#7C5CFC',
    title: 'Observability-first',
    body: "If you can't measure it, you can't improve it. I instrument from day one. Distributed traces, structured logs, Prometheus metrics, so production is never a black box.",
    tags: ['Distributed traces', 'Prometheus metrics', 'Dashboards first'],
    Mockup: ObservabilityMockup,
  },
  {
    num: 'STEP 2',
    color: '#00D4FF',
    title: 'Simplicity over cleverness',
    body: "The best code is what your team can debug at 3am in an incident. Boring technology for boring problems. Complexity only where it genuinely earns its place.",
    tags: ['Readable over clever', 'Boring tech', 'Team-debuggable'],
    Mockup: SimplicityMockup,
  },
  {
    num: 'STEP 3',
    color: '#7C5CFC',
    title: 'Test at the boundaries',
    body: "Integration tests over unit tests for distributed systems. Mock at the network boundary, not inside your domain. Fast feedback loops that catch production bugs early.",
    tags: ['Integration tests', 'Network mocks', 'Fast feedback'],
    Mockup: TestingMockup,
  },
  {
    num: 'STEP 4',
    color: '#00D4FF',
    title: 'Design for failure',
    body: "Every external call can fail. Circuit breakers, bulkheads, retry budgets, and graceful degradation are first-class architectural concerns, never afterthoughts.",
    tags: ['Circuit breakers', 'Retry budgets', 'Graceful degradation'],
    Mockup: FailureMockup,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const EngineeringPhilosophy = () => {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="philosophy" ref={ref} className="relative py-[100px] md:py-[140px] bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20 flex flex-col items-center"
        >
          <h2 className="font-jakarta font-semibold text-3xl md:text-4xl text-foreground tracking-tight leading-[1.1] mb-5">
            Engineering{' '}
            <span className="font-playfair italic font-medium text-[#7C5CFC]">
              Philosophy
            </span>
          </h2>
          <p className="text-sm text-foreground/40 leading-relaxed max-w-[280px]">
            Architecting scalable systems and refined sensory experiences across 10 years of engineering.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-start"
        >
          {PRINCIPLES.map((p) => (
            <motion.div key={p.num} variants={itemVariants} className="flex flex-col gap-5 group">
              <div
                className="w-full rounded-2xl overflow-hidden glass-sm shimmer-border elevation-card group-hover:border-primary/30 transition-all duration-500"
                style={{ aspectRatio: '4/3' }}
              >
                <p.Mockup />
              </div>

              <div className="space-y-3">
                <p
                  className="font-mono text-[11px] font-bold tracking-[.2em] uppercase"
                  style={{ color: p.color }}
                >
                  {p.num}
                </p>

                <h3 className="font-jakarta text-[20px] font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors">
                  {p.title}
                </h3>

                <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] font-medium opacity-80">
                  {p.body}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto pt-3">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono tracking-wide text-foreground/50 border border-border/60 rounded-lg px-2.5 py-1 bg-muted/5 group-hover:border-primary/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="section-fade-top" />
      <div className="section-fade-bottom" />
    </section>
  );
};

export default EngineeringPhilosophy;
