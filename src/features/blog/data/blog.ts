// src/constants/blog.ts

export const POSTS = [
  {
    slug: 'kafka-consumer-lag-hpa',
    tag: 'Infrastructure',
    tagColor: '#C41E3A',
    title: 'Why Consumer Lag Is a Better HPA Signal Than CPU',
    excerpt:
      'CPU utilisation is a lagging indicator for Kafka-driven workers. Here\'s how we wired Kafka lag directly into Kubernetes HPA and cut scale-out reaction time from 4 minutes to 40 seconds.',
    readTime: '8 min read',
    date: 'Mar 12, 2026',
    featured: true,
  },
  {
    slug: 'postgres-sharding-at-10tb',
    tag: 'Databases',
    tagColor: '#D4891A',
    title: 'Manual Sharding PostgreSQL at 10TB — What We Got Wrong',
    excerpt:
      'We chose hash sharding on task_id. Six months later, cross-shard queries were killing us. The lessons we learned the painful way about data locality and query patterns.',
    readTime: '12 min read',
    date: 'Feb 28, 2026',
    featured: false,
  },
  {
    slug: 'circuit-breakers-in-go',
    tag: 'Backend',
    tagColor: '#C41E3A',
    title: 'Circuit Breakers in Go — A Production Walkthrough',
    excerpt:
      'The theory is straightforward. The production reality — with jitter, half-open probes, and coordinating state across pods — is where things get interesting.',
    readTime: '10 min read',
    date: 'Feb 14, 2026',
    featured: false,
  },
  {
    slug: 'distributed-tracing-without-vendor-lock',
    tag: 'Observability',
    tagColor: '#D4891A',
    title: 'OpenTelemetry Without Vendor Lock-in',
    excerpt:
      'We evaluated Datadog, Honeycomb, and Grafana Tempo before landing on a self-hosted OTLP pipeline. Here\'s the cost-benefit breakdown and the collector config we use in production.',
    readTime: '7 min read',
    date: 'Jan 30, 2026',
    featured: false,
  },
];

