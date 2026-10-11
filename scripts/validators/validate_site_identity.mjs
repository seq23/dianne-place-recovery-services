// Canonical host: every absolute URL the site emits comes from one origin.
import fs from 'node:fs';
import { assert, listFiles, readJson, readText } from './lib.mjs';

const id = readJson('data/seo/site_identity.json');
const origin = id.origin;
assert(/^https:\/\/[a-z0-9.-]+$/.test(origin), `site_identity.origin must be a bare https origin, got ${origin}`);
const host = new URL(origin).host;

const robots = readText('public/robots.txt');
const sitemapLines = robots.split('\n').filter((l) => /^sitemap:/i.test(l.trim()));
assert(sitemapLines.length === 1 && sitemapLines[0].trim() === `Sitemap: ${origin}/sitemap.xml`, `robots.txt must declare exactly "Sitemap: ${origin}/sitemap.xml"`);

const locs = [...readText('public/sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert(locs.length > 0, 'sitemap.xml has no <loc> entries');
const offHost = locs.filter((u) => new URL(u).host !== host);
assert(!offHost.length, `sitemap.xml lists ${offHost.length} URL(s) off ${host}, e.g. ${offHost[0]}`);
assert(readText('scripts/seo/build_sitemap.mjs').includes('site_identity.json'), 'build_sitemap.mjs must read its origin from data/seo/site_identity.json');

// No hard-coded absolute site origin in templates or SEO scripts.
const scan = [...listFiles('app'), ...listFiles('components'), ...listFiles('lib'), ...listFiles('scripts/seo'), 'public/llms.txt', 'public/llms-full.txt']
  .filter((f) => /\.(tsx?|mjs|txt)$/.test(f));
for (const file of scan) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/https?:\/\/(www\.)?(diannesplacerecoveryservices\.com|detoxdenver\.org)/g)) {
    assert(false, `${file} hard-codes ${m[0]}; read the origin from data/seo/site_identity.json`);
  }
}
console.log(`[validate:site-identity] OK: ${locs.length} sitemap URLs on ${host}; ${scan.length} source files free of hard-coded origins`);
