import { useEffect } from 'react';
import { site } from '../config/site';
import { env } from '../config/env';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

const abs = (u) => (u?.startsWith('http') ? u : `${env.siteUrl}${u || ''}`);

/** Updates document title + meta tags per route. `path` is the route path, e.g. /projects/loopbook */
export function useSeo({ title, description, image, path = '/', type = 'website', jsonLd } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : site.seo.title;
    const desc = description || site.seo.description;
    const img = abs(image || site.seo.ogImage);
    const url = abs(path);
    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = url;

    let ld;
    if (jsonLd) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.dataset.route = 'true';
      ld.text = JSON.stringify(jsonLd);
      document.head.appendChild(ld);
    }
    return () => { if (ld) ld.remove(); };
  }, [title, description, image, path, type, jsonLd]);
}
