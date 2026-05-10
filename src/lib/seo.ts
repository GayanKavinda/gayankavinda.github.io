// src/lib/seo.ts
// SEO utility — structured data, Open Graph, Twitter Cards.
// Drop-in for Gara Yaka portfolio. No external deps.

export interface SEOMeta {
  title?:       string;
  description?: string;
  image?:       string;
  url?:         string;
  type?:        'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?:  string;
    author?:        string;
    tags?:          string[];
  };
}

const DEFAULTS: Required<Omit<SEOMeta, 'article'>> = {
  title:       'Gayan Kavinda | Senior Systems Architect',
  description: 'Crafting high-performance distributed systems and cinematic digital experiences.',
  image:       'https://gayankav.github.io/og-image.png', // replace with your actual OG image
  url:         'https://gayankav.github.io',
  type:        'website',
};

/**
 * Injects / updates all SEO meta tags in <head>.
 * Call this at the top of each page component via useEffect.
 *
 * @example
 * useEffect(() => {
 *   setSEO({ title: 'Case Study · Distributed Task Engine', type: 'article' });
 *   return () => setSEO(); // reset to defaults on unmount
 * }, []);
 */
export function setSEO(meta: SEOMeta = {}): void {
  const t   = meta.title       ? `${meta.title} | Gayan Kavinda` : DEFAULTS.title;
  const d   = meta.description ?? DEFAULTS.description;
  const img = meta.image       ?? DEFAULTS.image;
  const url = meta.url         ?? DEFAULTS.url;
  const type = meta.type       ?? DEFAULTS.type;

  // ── <title> ───────────────────────────────────────────────────────────────
  document.title = t;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setMeta = (sel: string, attr: string, val: string) => {
    let el = document.querySelector<HTMLMetaElement>(sel);
    if (!el) {
      el = document.createElement('meta');
      document.head.appendChild(el);
    }
    el.setAttribute(attr, val);
  };

  const setMetaName = (name: string, content: string) =>
    setMeta(`meta[name="${name}"]`, 'content', content);
  const setMetaProp = (prop: string, content: string) =>
    setMeta(`meta[property="${prop}"]`, 'content', content);

  // ── Standard meta ─────────────────────────────────────────────────────────
  setMetaName('description',      d);
  setMetaName('author',           'Gayan Kavinda');
  setMetaName('robots',           'index, follow');
  setMetaName('theme-color',      '#7C5CFC');

  // ── Open Graph ────────────────────────────────────────────────────────────
  setMetaProp('og:title',         t);
  setMetaProp('og:description',   d);
  setMetaProp('og:image',         img);
  setMetaProp('og:url',           url);
  setMetaProp('og:type',          type);
  setMetaProp('og:site_name',     'Gayan Kavinda');
  setMetaProp('og:locale',        'en_US');

  // ── Twitter Cards ─────────────────────────────────────────────────────────
  setMetaName('twitter:card',     'summary_large_image');
  setMetaName('twitter:title',    t);
  setMetaName('twitter:description', d);
  setMetaName('twitter:image',    img);
  setMetaName('twitter:creator',  '@gayankav'); // update to your handle

  // ── Article-specific ──────────────────────────────────────────────────────
  if (type === 'article' && meta.article) {
    const a = meta.article;
    if (a.publishedTime) setMetaProp('article:published_time', a.publishedTime);
    if (a.modifiedTime)  setMetaProp('article:modified_time',  a.modifiedTime);
    if (a.author)        setMetaProp('article:author',         a.author);
    a.tags?.forEach(tag => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'article:tag');
      el.setAttribute('content', tag);
      document.head.appendChild(el);
    });
  }

  // ── Canonical link ────────────────────────────────────────────────────────
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

// ── Structured Data (JSON-LD) ─────────────────────────────────────────────────

/** Inject a Person schema for the homepage */
export function injectPersonSchema(): void {
  removeSchema('person-schema');
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'Person',
    name:         'Gayan Kavinda',
    url:          'https://gayankav.github.io',
    jobTitle:     'Senior Software Engineer',
    description:  DEFAULTS.description,
    sameAs: [
      'https://github.com/GayanKavinda',
      'https://linkedin.com/in/GayanKavinda',
      'https://twitter.com/gayankav'
    ],
  };
  injectSchema('person-schema', schema);
}

export const getArticleSchema = (post: { title: string; description: string; date: string; url: string; image?: string; tags: string[] }) => {
  const schema = {
    '@context':       'https://schema.org',
    '@type':          'BlogPosting',
    headline:         post.title,
    description:      post.description,
    datePublished:    post.date,
    url:              post.url,
    image:            post.image ?? DEFAULTS.image,
    keywords:         post.tags.join(', '),
    author: { '@type': 'Person', name: 'Gayan Kavinda', url: 'https://gayankav.github.io' },
    publisher: {
      '@type':  'Person',
      name:     'Gayan Kavinda',
      logo:     { '@type': 'ImageObject', url: DEFAULTS.image },
    },
  };
  injectSchema('article-schema', schema);
}

function injectSchema(id: string, data: object): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id   = id;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeSchema(id: string): void {
  document.getElementById(id)?.remove();
}

