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
  { name: 'TypeScript', cat: 'fe',    pct: 92 },
  { name: 'React',      cat: 'fe',    pct: 88 },
  { name: 'Next.js',    cat: 'fe',    pct: 80 },
  { name: 'Node.js',    cat: 'be',    pct: 85 },
  { name: 'Python',     cat: 'be',    pct: 78 },
  { name: 'GraphQL',    cat: 'be',    pct: 72 },
  { name: 'AWS',        cat: 'infra', pct: 82 },
  { name: 'Docker',     cat: 'infra', pct: 80 },
  { name: 'Kubernetes', cat: 'infra', pct: 70 },
  { name: 'PostgreSQL', cat: 'data',  pct: 75 },
  { name: 'Redis',      cat: 'data',  pct: 68 },
  { name: 'MongoDB',    cat: 'data',  pct: 65 },
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

