// Runs automatically before `npm run build`. Set SITE_URL (or VITE_SITE_URL) to your real domain.
import { writeFileSync, mkdirSync } from 'node:fs';
import { projects } from '../src/data/projects.js';

const base = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://your-domain.com').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', ...projects.map((p) => `/projects/${p.slug}`)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', xml);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap.xml written for ${urls.length} URLs (${base})`);
