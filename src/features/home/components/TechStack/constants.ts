//src/components/sections/TechStack/constants.ts

const CR = '#7C5CFC';
const GD = '#00D4FF';

export const CAT_META: Record<string, { label: string; color: string }> = {
  fe:    { label: 'Frontend',       color: GD },
  be:    { label: 'Backend',        color: CR },
  infra: { label: 'Infrastructure', color: CR },
};

export const SKILLS = [
  { name: 'TypeScript',   cat: 'fe' },
  { name: 'React',        cat: 'fe' },
  { name: 'Next.js',      cat: 'fe' },
  { name: 'Tailwind CSS', cat: 'fe' },
  { name: 'Node.js',      cat: 'be' },
  { name: 'Python',       cat: 'be' },
  { name: 'PostgreSQL',   cat: 'infra' },
  { name: 'Docker',       cat: 'infra' },
];

export const ICON_MAP: Record<string, string> = {
  TypeScript:      'typescript/typescript-original.svg',
  React:           'react/react-original.svg',
  'Next.js':       'nextjs/nextjs-original.svg',
  'Tailwind CSS':  'tailwindcss/tailwindcss-original.svg',
  'Node.js':       'nodejs/nodejs-original.svg',
  Python:          'python/python-original.svg',
  PostgreSQL:      'postgresql/postgresql-original.svg',
  Docker:          'docker/docker-original.svg',
};