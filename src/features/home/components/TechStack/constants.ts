//src/components/sections/TechStack/constants.ts

export const CR  = '#C41E3A';
export const GD  = '#D4891A';
export const CRP = 'rgba(196,30,58,';
export const GDP = 'rgba(212,137,26,';

export const CAT_META: Record<string, { label: string; color: string; pfx: string }> = {
  fe:    { label: 'Frontend',       color: GD, pfx: GDP },
  be:    { label: 'Backend',        color: CR, pfx: CRP },
  infra: { label: 'Infrastructure', color: CR, pfx: CRP },
  data:  { label: 'Data',           color: GD, pfx: GDP },
};

export const rm = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const SKILLS = [
  { name: 'TypeScript', cat: 'fe', desc: 'Type-safe JavaScript for scalable applications' },
  { name: 'React',      cat: 'fe', desc: 'UI library for building interactive interfaces' },
  { name: 'Next.js',    cat: 'fe', desc: 'React framework with SSR and routing' },
  { name: 'Node.js',    cat: 'be', desc: 'Server-side JavaScript runtime' },
  { name: 'Python',     cat: 'be', desc: 'Backend development and automation' },
  { name: 'GraphQL',    cat: 'be', desc: 'API query language for efficient data fetching' },
  { name: 'AWS',        cat: 'infra', desc: 'Cloud infrastructure and services' },
  { name: 'Docker',     cat: 'infra', desc: 'Containerization for consistent deployments' },
  { name: 'Kubernetes', cat: 'infra', desc: 'Container orchestration at scale' },
  { name: 'PostgreSQL', cat: 'data', desc: 'Relational database for structured data' },
  { name: 'Redis',      cat: 'data', desc: 'In-memory cache and message broker' },
  { name: 'MongoDB',    cat: 'data', desc: 'NoSQL database for flexible schemas' },
];

export const ICON_MAP: Record<string, string> = {
  TypeScript:  'typescript/typescript-original.svg',
  React:       'react/react-original.svg',
  'Next.js':   'nextjs/nextjs-original.svg',
  'Node.js':   'nodejs/nodejs-original.svg',
  Python:      'python/python-original.svg',
  GraphQL:     'graphql/graphql-plain.svg',
  AWS:         'amazonwebservices/amazonwebservices-plain-wordmark.svg',
  Docker:      'docker/docker-original.svg',
  Kubernetes:  'kubernetes/kubernetes-plain.svg',
  PostgreSQL:  'postgresql/postgresql-original.svg',
  Redis:       'redis/redis-original.svg',
  MongoDB:     'mongodb/mongodb-original.svg',
};

