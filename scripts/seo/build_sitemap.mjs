import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
const calendar = JSON.parse(fs.readFileSync(path.join(root, 'data/content/content_calendar.json'), 'utf8'));
const routes = JSON.parse(fs.readFileSync(path.join(root, 'data/routing/route_registry.json'), 'utf8'));
const base = 'https://www.diannesplacerecoveryservices.com';

const staticUrls = routes.routes
  .filter((route) => !route.path.startsWith('/admin'))
  .map((route) => ({
    loc: `${base}${route.path}`,
    priority: route.path === '/' ? '1.0' : '0.8',
    changefreq: route.family === 'resource' ? 'daily' : 'weekly'
  }));

const blogUrls = calendar.items
  .filter((item) => item.status === 'approved' && item.scheduledAt <= releaseDate)
  .map((item) => ({
    loc: `${base}${item.routeTarget}`,
    priority: item.contentType === 'quarterly_whitepaper' ? '0.9' : item.contentType === 'monthly_pillar' ? '0.85' : '0.7',
    changefreq: 'monthly',
    lastmod: item.scheduledAt
  }));

const urls = [...staticUrls, ...blogUrls];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((url) => {
    const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${url.loc}</loc>${lastmod}\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`;
  })
  .join('\n')}\n</urlset>\n`;

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
fs.writeFileSync(
  path.join(root, 'artifacts/validation/sitemap-build.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), releaseDate, urlCount: urls.length, blogCount: blogUrls.length }, null, 2)}\n`
);
console.log(`[seo:sitemap] wrote ${urls.length} URLs for ${releaseDate}`);
