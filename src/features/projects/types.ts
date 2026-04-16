// src/features/projects/types.ts

export type ProjectCategory = 'Web' | 'Mobile' | 'Open Source' | 'All';

export type VizType = 'nodes' | 'chart' | 'rings' | 'stream';

export interface Project {
  slug: string;
  name: string;
  desc: string;
  tags: string[];
  cat: Exclude<ProjectCategory, 'All'>;
  featured?: boolean;
  gradient?: string;
  accentColor?: string; // HSL hue for spotlight tint (e.g., "262")
  metrics?: string[];
  viz?: VizType;
  githubUrl?: string;
  liveUrl?: string;
}
