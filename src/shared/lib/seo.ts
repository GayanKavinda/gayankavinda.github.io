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
  title:       'Gara Yaka — Senior Software Engineer & Systems Architect',
  description: 'Building scalable distributed systems and elegant interfaces. Passionate about clean architecture, performance optimization, and developer experience.',
  image:       'https://garayaka.com/og-image.png', // replace with your actual OG image
  url:         'https://garayaka.com',
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
  const t   = meta.title       ? `${meta.title} | Gara Yaka` : DEFAULTS.title;
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
  setMetaName('author',           'Gara Yaka');
  setMetaName('robots',           'index, follow');
  setMetaName('theme-color',      '#7C5CFC');

  // ── Open Graph ────────────────────────────────────────────────────────────
  setMetaProp('og:title',         t);
  setMetaProp('og:description',   d);
  setMetaProp('og:image',         img);
  setMetaProp('og:url',           url);
  setMetaProp('og:type',          type);
  setMetaProp('og:site_name',     'Gara Yaka');
  setMetaProp('og:locale',        'en_US');

  // ── Twitter Cards ─────────────────────────────────────────────────────────
  setMetaName('twitter:card',     'summary_large_image');
  setMetaName('twitter:title',    t);
  setMetaName('twitter:description', d);
  setMetaName('twitter:image',    img);
  setMetaName('twitter:creator',  '@garayaka'); // update to your handle

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
    name:         'Gara Yaka',
    url:          'https://garayaka.com',
    jobTitle:     'Senior Software Engineer',
    description:  DEFAULTS.description,
    sameAs: [
      'https://github.com/garayaka',       // update
      'https://linkedin.com/in/garayaka',  // update
    ],
    knowsAbout: ['TypeScript', 'React', 'Go', 'Distributed Systems', 'Kubernetes', 'Kafka'],
  };
  injectSchema('person-schema', schema);
}

/** Inject a TechArticle schema for blog posts */
export function injectArticleSchema(post: {
  title: string; excerpt: string; date: string;
  url: string; image?: string; tags: string[];
}): void {
  removeSchema('article-schema');
  const schema = {
    '@context':       'https://schema.org',
    '@type':          'TechArticle',
    headline:         post.title,
    description:      post.excerpt,
    datePublished:    post.date,
    url:              post.url,
    image:            post.image ?? DEFAULTS.image,
    keywords:         post.tags.join(', '),
    author: { '@type': 'Person', name: 'Gara Yaka', url: 'https://garayaka.com' },
    publisher: {
      '@type':  'Person',
      name:     'Gara Yaka',
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

