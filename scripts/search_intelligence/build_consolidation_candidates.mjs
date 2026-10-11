#!/usr/bin/env node
// Pages with zero Search Console impressions AND thin <main> copy in the built
// site (out/). Candidates only: nothing is deleted or redirected here.
// Impressions come from the live 28-day file when the collector has run, else
// from the 2026-10-08 portfolio export (the first truth file).
import fs from 'node:fs';
import path from 'node:path';

const THIN_WORDS = 300;
const identity = JSON.parse(fs.readFileSync('data/seo/site_identity.json', 'utf8'));
const live = 'data/search_intelligence/search_analytics_28d.json';
const seed = 'data/search_intelligence/gsc_portfolio_export_2026-10-08.json';
const source = fs.existsSync(live) ? live : seed;
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
const rows = data.pages || data.top_pages || [];
const norm = (u) => new URL(u).pathname;
const impressions = new Map();
for (const row of rows) impressions.set(norm(row.page), (impressions.get(norm(row.page)) || 0) + row.impressions);

if (!fs.existsSync('out/index.html')) throw new Error('out/ missing: run npm run build first');
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => norm(m[1]));
const words = (p) => {
  const html = fs.readFileSync(path.join('out', p, 'index.html'), 'utf8');
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, ''])[1];
  return main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
};
const pages = paths.map((p) => ({ path: p, url: `${identity.origin}${p}`, impressions_28d: impressions.get(p) || 0, main_words: words(p) }));
const candidates = pages.filter((p) => p.impressions_28d === 0 && p.main_words < THIN_WORDS);
fs.writeFileSync('data/search_intelligence/consolidation_candidates.json', `${JSON.stringify({
  generated_at: new Date().toISOString(), impressions_source: source, thin_threshold_main_words: THIN_WORDS,
  sitemap_pages: pages.length, pages_with_impressions: pages.filter((p) => p.impressions_28d > 0).length,
  rule: 'zero impressions in the 28-day window AND fewer than 300 words in <main>; candidates for merging into a stronger page, never auto-removed',
  candidates
}, null, 2)}\n`);
console.log(`[consolidation] ${candidates.length} candidates of ${pages.length} sitemap pages (source ${source})`);
