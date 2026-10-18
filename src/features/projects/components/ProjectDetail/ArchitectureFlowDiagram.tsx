import { useRef } from 'react';
import { 
  Cloud, 
  Database, 
  Server, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Cpu, 
  Globe,
  HardDrive
} from 'lucide-react';
import { AnimatedBeam } from '@components/ui/animated-beam';

interface ArchitectureFlowDiagramProps {
  title?: string;
  description?: string;
  isDark?: boolean;
}

export function ArchitectureFlowDiagram({
  title = "Interactive Architecture & Data Flow",
  description = "Real-time visualization of ingestion, message brokerage, and distributed persistence pipelines.",
  isDark = false,
}: ArchitectureFlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Left column: Ingress & Clients
  const clientRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);

  // Center column: Processing & Core Event Broker
  const coreRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<HTMLDivElement>(null);

  // Right column: Storage & Observability
  const cacheRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const nodeClass = 
    "relative z-10 flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 " +
    (isDark 
      ? "bg-slate-900/90 border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.3)] backdrop-blur-md" 
      : "bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-md");

  const iconTileClass = 
    "w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-colors " +
    (isDark ? "bg-slate-800/80 text-blue-400 border border-slate-700/60" : "bg-slate-100 text-blue-600 border border-slate-200/60");

  return (
    <div className="w-full my-6 flex flex-col gap-3 font-roboto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-sm sm:text-base font-medium tracking-tight text-foreground font-roboto">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed font-roboto">
            {description}
          </p>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className={`relative flex flex-row items-center justify-between gap-4 sm:gap-8 overflow-hidden rounded-xl border p-6 sm:p-10 ${
          isDark
            ? 'bg-slate-950/60 border-slate-800/80 shadow-inner'
            : 'bg-slate-50/70 border-slate-200/80 shadow-sm'
        }`}
      >
        {/* Column 1: Ingress & Clients */}
        <div className="flex flex-col gap-6 sm:gap-8 min-w-[110px] sm:min-w-[130px]">
          <div ref={clientRef} className={nodeClass}>
            <div className={iconTileClass}>
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-roboto text-[12px] font-medium text-foreground">Client Apps</span>
            <span className="text-[10px] text-foreground/50 font-roboto mt-0.5">Web / Mobile</span>
          </div>

          <div ref={gatewayRef} className={nodeClass}>
            <div className={iconTileClass}>
              <Radio className="w-4 h-4" />
            </div>
            <span className="font-roboto text-[12px] font-medium text-foreground">API Gateway</span>
            <span className="text-[10px] text-foreground/50 font-roboto mt-0.5">Auth & Ingress</span>
          </div>
        </div>

        {/* Column 2: Event Core / Worker Engine */}
        <div className="flex flex-col gap-8 sm:gap-10 min-w-[120px] sm:min-w-[150px]">
          <div ref={coreRef} className={nodeClass}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-sm ${
              isDark ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60' : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}>
              <Cloud className="w-5 h-5" />
            </div>
            <span className="font-roboto text-[13px] font-semibold text-foreground">Event Broker</span>
            <span className="text-[10px] text-blue-500 font-roboto font-medium mt-0.5">Kafka Event Mesh</span>
          </div>

          <div ref={workerRef} className={nodeClass}>
            <div className={iconTileClass}>
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-roboto text-[12px] font-medium text-foreground">Compute Pool</span>
            <span className="text-[10px] text-foreground/50 font-roboto mt-0.5">Go Workers</span>
          </div>
        </div>

        {/* Column 3: Storage & Observability */}
        <div className="flex flex-col gap-5 sm:gap-6 min-w-[110px] sm:min-w-[130px]">
          <div ref={cacheRef} className={nodeClass}>
            <div className={iconTileClass}>
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-roboto text-[12px] font-medium text-foreground">Cache / Locks</span>
            <span className="text-[10px] text-foreground/50 font-roboto mt-0.5">Redis Cluster</span>
          </div>

          <div ref={dbRef} className={nodeClass}>
            <div className={iconTileClass}>
              <Database className="w-4 h-4" />
            </div>
            <span className="font-roboto text-[12px] font-medium text-foreground">Storage Tier</span>
            <span className="text-[10px] text-foreground/50 font-roboto mt-0.5">Postgres DB</span>
          </div>

          <div ref={metricsRef} className={nodeClass}>
            <div className={iconTileClass}>
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-roboto text-[12px] font-medium text-foreground">Telemetry</span>
            <span className="text-[10px] text-foreground/50 font-roboto mt-0.5">Prometheus</span>
          </div>
        </div>

        {/* Animated Beams linking nodes */}
        {/* Left -> Core */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={clientRef}
          toRef={coreRef}
          curvature={-30}
          duration={2.6}
          beamColor={isDark ? '#60A5FA' : '#2563EB'}
          pathColor={isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.1)'}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={gatewayRef}
          toRef={coreRef}
          curvature={10}
          duration={2.8}
          delay={0.4}
          beamColor={isDark ? '#38BDF8' : '#0284C7'}
          pathColor={isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.1)'}
        />

        {/* Core <-> Workers */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={coreRef}
          toRef={workerRef}
          curvature={0}
          duration={2.2}
          delay={0.7}
          beamColor={isDark ? '#818CF8' : '#4F46E5'}
          pathColor={isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.1)'}
        />

        {/* Core / Workers -> Storage */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={coreRef}
          toRef={cacheRef}
          curvature={-24}
          duration={2.4}
          delay={0.9}
          beamColor={isDark ? '#60A5FA' : '#2563EB'}
          pathColor={isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.1)'}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={workerRef}
          toRef={dbRef}
          curvature={22}
          duration={2.6}
          delay={1.2}
          beamColor={isDark ? '#34D399' : '#059669'}
          pathColor={isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.1)'}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={workerRef}
          toRef={metricsRef}
          curvature={36}
          duration={3.0}
          delay={1.5}
          beamColor={isDark ? '#F472B6' : '#DB2777'}
          pathColor={isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.1)'}
        />
      </div>
    </div>
  );
}

export default ArchitectureFlowDiagram;
