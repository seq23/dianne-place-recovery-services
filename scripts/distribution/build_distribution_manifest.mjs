#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

const sitemapPath = 'public/sitemap.xml';
if (!fs.existsSync(sitemapPath)) throw new Error(`Missing ${sitemapPath}`);
const xml = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean))];
if (!urls.length) throw new Error('No sitemap URLs');
const origin = new URL(urls[0]).origin;
const sitemapUrl = `${origin}/sitemap.xml`;
const staticPriority = [
  `${origin}/`, `${origin}/recovery-housing/`, `${origin}/referrals/`, `${origin}/resources/`,
  `${origin}/answers/`, `${origin}/blog/`, `${origin}/about/`, `${origin}/contact/`
];
const blogUrls = urls.filter((url) => /\/blog\/[^/]+\/$/.test(url)).sort().reverse();
const priorityUrls = [...new Set([...staticPriority.filter((url) => urls.includes(url)), ...blogUrls.slice(0, 12)])].slice(0, 20);
const sitemapSha256 = crypto.createHash('sha256').update(xml).digest('hex');

fs.mkdirSync('data/distribution', { recursive: true });
fs.writeFileSync('data/distribution/indexnow_batch.txt', `${urls.join('\n')}\n`);
fs.writeFileSync('data/distribution/priority_urls.txt', `${priorityUrls.join('\n')}\n`);
fs.writeFileSync('data/distribution/distribution_manifest.json', `${JSON.stringify({
  schema_version: '2.0',
  generated_at: process.env.DISTRIBUTION_GENERATED_AT || '2026-07-25T00:00:00.000Z',
  url_count: urls.length,
  priority_url_count: priorityUrls.length,
  sitemap_path: sitemapPath,
  sitemap_url: sitemapUrl,
  sitemap_sha256: sitemapSha256,
  publication_trigger: 'ONLY_AFTER_EXISTING_CONTENT_PUBLISH_WORKFLOW_SUCCEEDS',
  chain: [
    'successful_publish', 'sitemap_refresh', 'indexnow', 'gsc_sitemap_submission',
    'priority_url_inspection_where_configured', 'durable_distribution_receipt', 'observation_feedback'
  ],
  provider_success_claimed: false,
  truth_boundary: 'Preparing a batch does not prove submission, indexing, search visibility, LLM surfacing, external reference, or citation.'
}, null, 2)}\n`);
console.log(`DISTRIBUTION MANIFEST ${urls.length} urls / ${priorityUrls.length} priority`);
