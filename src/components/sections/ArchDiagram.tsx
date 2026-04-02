//src/components/sections/ArchDiagram.tsx
// Interactive architecture diagram for "Distributed Task Engine".
// Replaces the project screenshot placeholder.
// Nodes highlight on hover/click and show a description panel below.
// Mobile: narrower nodes, smaller font. Desktop: full layout.

import { useState } from 'react';

interface Node {
  id: string;
  label: string;
  sublabel: string;
  badge?: string;
  desc: string;
}

const NODES: Record<string, Node> = {
  client: {
    id: 'client', label: 'Client', sublabel: 'REST / gRPC',
    desc: 'External clients send HTTP REST or gRPC requests. TLS terminated at the gateway edge.',
  },
  gateway: {
    id: 'gateway', label: 'API Gateway', sublabel: 'Go · Rate Limit', badge: 'auth',
    desc: 'Single ingress. Validates JWT tokens, enforces per-client rate limits via Redis token bucket, routes to internal services.',
  },
  kafka: {
    id: 'kafka', label: 'Kafka', sublabel: 'Event Bus', badge: '500K/s',
    desc: 'Decouples ingestion from processing. Tasks written to partitioned topics. Retention: 7 days. Replication factor: 3.',
  },
  redis: {
    id: 'redis', label: 'Redis', sublabel: 'Cache + PubSub', badge: '2ms p99',
    desc: 'Dual role: distributed cache for hot task metadata (LRU, TTL 60s) and pub/sub channel for real-time worker coordination.',
  },
  workers: {
    id: 'workers', label: 'Workers', sublabel: 'Go goroutines · K8s HPA',
    desc: 'Go worker pods each run N goroutines. Kubernetes HPA scales pod count based on Kafka consumer lag exported to Prometheus.',
  },
  pg: {
    id: 'pg', label: 'PostgreSQL', sublabel: 'Sharded · 10TB+',
    desc: 'Manually sharded on task_id hash. 8 shards × 2 read replicas. pg_partman for time-based archival to S3 after 90 days.',
  },
};

const NodeBox = ({
  node, active, onClick,
}: { node: Node; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={[
      'flex flex-col items-center justify-center text-center',
      'rounded-xl border px-3 py-2.5 min-w-[80px] md:min-w-[100px]',
      'transition-all duration-200 cursor-pointer',
      active
        ? 'border-[#C41E3A] bg-[rgba(196,30,58,0.07)] scale-[1.03]'
        : 'border-border bg-muted hover:border-border/70 hover:bg-card',
    ].join(' ')}
  >
    <span className="font-mono text-[11px] md:text-[12px] font-medium text-foreground whitespace-nowrap">
      {node.label}
    </span>
    <span className="font-mono text-[8px] md:text-[9px] text-muted-foreground mt-0.5 whitespace-nowrap">
      {node.sublabel}
    </span>
    {node.badge && (
      <span className="mt-1.5 font-mono text-[8px] px-1.5 py-[2px] rounded border border-[rgba(196,30,58,0.25)] bg-[rgba(196,30,58,0.08)] text-[#C41E3A]">
        {node.badge}
      </span>
    )}
  </button>
);

const Arrow = () => (
  <div className="flex justify-center my-1 text-muted-foreground/50 text-sm select-none">↓</div>
);

export const ArchDiagram = () => {
  const [active, setActive] = useState<string>('gateway');

  const toggle = (id: string) => setActive(a => a === id ? '' : id);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card elevation-card">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border">
        <p className="font-mono text-[9px] tracking-[.14em] uppercase text-muted-foreground/60">
          // Distributed Task Engine — data flow
        </p>
      </div>

      {/* Diagram */}
      <div className="px-6 py-6 flex flex-col items-center">

        {/* Client */}
        <NodeBox node={NODES.client} active={active === 'client'} onClick={() => toggle('client')} />
        <Arrow />

        {/* API Gateway */}
        <NodeBox node={NODES.gateway} active={active === 'gateway'} onClick={() => toggle('gateway')} />
        <Arrow />

        {/* Kafka + Redis side by side */}
        <div className="flex items-center gap-3 md:gap-6">
          <NodeBox node={NODES.kafka} active={active === 'kafka'} onClick={() => toggle('kafka')} />
          <div className="w-px h-10 bg-border/60 self-center" />
          <NodeBox node={NODES.redis} active={active === 'redis'} onClick={() => toggle('redis')} />
        </div>
        <Arrow />

        {/* Workers */}
        <div className="flex items-center gap-2 md:gap-3">
          {(['Worker 1', 'Worker 2', 'Worker N'] as const).map((w, i) => (
            <button
              key={w}
              onClick={() => toggle('workers')}
              className={[
                'flex flex-col items-center justify-center text-center',
                'rounded-xl border px-2.5 md:px-4 py-2.5 min-w-[70px] md:min-w-[88px]',
                'transition-all duration-200 cursor-pointer',
                active === 'workers'
                  ? 'border-[#C41E3A] bg-[rgba(196,30,58,0.07)]'
                  : 'border-border bg-muted hover:border-border/70 hover:bg-card',
              ].join(' ')}
            >
              <span className="font-mono text-[10px] md:text-[11px] font-medium text-foreground">{w}</span>
              <span className="font-mono text-[8px] text-muted-foreground mt-0.5">
                {i < 2 ? 'goroutines' : 'K8s HPA'}
              </span>
            </button>
          ))}
        </div>
        <Arrow />

        {/* PostgreSQL */}
        <NodeBox node={NODES.pg} active={active === 'pg'} onClick={() => toggle('pg')} />
      </div>

      {/* Description panel */}
      <div
        className="px-5 py-3.5 border-t border-border min-h-[52px] transition-all duration-200"
        style={{ background: 'hsl(var(--muted))' }}
      >
        {active && NODES[active] ? (
          <p className="font-mono text-[10px] md:text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-[#C41E3A] mr-2">›</span>
            {NODES[active].desc}
          </p>
        ) : (
          <p className="font-mono text-[10px] text-muted-foreground/40">
            Click any node to explore its role.
          </p>
        )}
      </div>
    </div>
  );
};