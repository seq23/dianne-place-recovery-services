#!/usr/bin/env node
// Search Console collection for the property in data/seo/site_identity.json:
//   1. sites.list            -> is the property readable by the service account?
//   2. searchanalytics       -> rolling 28 days, query+page rows and page rows
//   3. sitemaps.list         -> recorded; the sitemap is submitted if missing
//   4. URL Inspection        -> every sitemap URL, 8 in parallel, <=150/day,
//                               rotated oldest-first; counts by coverageState
// Without GSC_SERVICE_ACCOUNT_JSON, or when the property is not readable, it
// prints a NAMED STOP with the owner step and exits 0 (green, self-clearing:
// the next scheduled run collects as soon as access exists).
import fs from 'node:fs';
import path from 'node:path';
import { googleToken } from './google_auth.mjs';

const OUT = 'data/search_intelligence';
const identity = JSON.parse(fs.readFileSync('data/seo/site_identity.json', 'utf8'));
const host = new URL(identity.origin).host;
const property = process.env.GSC_PROPERTY || `sc-domain:${host}`;
const sitemapUrl = `${identity.origin}/sitemap.xml`;
const DAILY_CAP = Number(process.env.GSC_INSPECTION_DAILY_CAP || 150);
const PARALLEL = 8;
const today = new Date().toISOString().slice(0, 10);

const write = (file, value) => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, file), `${JSON.stringify(value, null, 2)}\n`);
};
const readOr = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(path.join(OUT, file), 'utf8')); } catch { return fallback; }
};

function namedStop(reason, ownerStep) {
  const stop = { status: 'NAMED_STOP', checked_at: new Date().toISOString(), property, reason, owner_step: ownerStep };
  write('gsc_status.json', stop);
  console.log(`NAMED STOP (search-intelligence): ${reason}\nOwner step: ${ownerStep}`);
  process.exit(0);
}

if (!process.env.GSC_SERVICE_ACCOUNT_JSON) {
  namedStop('GSC_SERVICE_ACCOUNT_JSON is not set in this repo',
    'Add repo secret GSC_SERVICE_ACCOUNT_JSON (the gsc-bot service-account JSON used in local-guides-citation-velocity): gh secret set GSC_SERVICE_ACCOUNT_JSON -R seq23/dianne-place-recovery-services < gsc-bot.json');
}

const { token, clientEmail } = await googleToken(process.env.GSC_SERVICE_ACCOUNT_JSON);
const api = async (url, init = {}) => {
  const response = await fetch(url, { ...init, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(init.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
};
const enc = encodeURIComponent(property);

const sites = await api('https://www.googleapis.com/webmasters/v3/sites');
const entry = (sites.body.siteEntry || []).find((site) => site.siteUrl === property);
if (!entry || entry.permissionLevel === 'siteUnverifiedUser') {
  namedStop(`${property} is not readable by ${clientEmail}`,
    `In Search Console add/verify ${property} (DNS TXT), then Settings > Users and permissions > add ${clientEmail} as Full user. The daily run picks it up automatically.`);
}

// 1. rolling 28-day analytics (GSC data lags ~2 days)
const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
const start = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10);
const query = async (dimensions) => {
  const res = await api(`https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
    method: 'POST', body: JSON.stringify({ startDate: start, endDate: end, dimensions, rowLimit: 25000, dataState: 'all' })
  });
  if (!res.ok) throw new Error(`searchAnalytics ${dimensions.join('+')}: HTTP ${res.status}`);
  return res.body.rows || [];
};
const totalsRows = await query([]);
const pageRows = await query(['page']);
const queryPageRows = await query(['query', 'page']);
write('search_analytics_28d.json', {
  property, start_date: start, end_date: end, collected_at: new Date().toISOString(),
  totals: totalsRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: null },
  pages: pageRows.map((row) => ({ page: row.keys[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position })),
  query_pages: queryPageRows.map((row) => ({ query: row.keys[0], page: row.keys[1], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }))
});

// 2. sitemaps: record, submit if missing
let sitemaps = await api(`https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps`);
let submitted = null;
if (!(sitemaps.body.sitemap || []).some((item) => item.path === sitemapUrl)) {
  const put = await api(`https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps/${encodeURIComponent(sitemapUrl)}`, { method: 'PUT' });
  submitted = { sitemap: sitemapUrl, http_status: put.status, ok: put.ok };
  sitemaps = await api(`https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps`);
}
write('sitemaps.json', { property, checked_at: new Date().toISOString(), submitted_this_run: submitted, sitemaps: sitemaps.body.sitemap || [] });

// 3. URL Inspection over the committed sitemap, oldest-inspected first
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
if (!urls.length) throw new Error('public/sitemap.xml has no URLs');
const previous = readOr('index_coverage.json', { results: [] });
const prevBy = new Map((previous.results || []).map((item) => [item.url, item]));
const queue = [...urls].sort((a, b) => String(prevBy.get(a)?.inspected_at || '').localeCompare(String(prevBy.get(b)?.inspected_at || '')));
const batch = queue.slice(0, DAILY_CAP);
const fresh = new Map();
for (let i = 0; i < batch.length; i += PARALLEL) {
  const slice = batch.slice(i, i + PARALLEL);
  const results = await Promise.all(slice.map(async (url) => {
    const res = await api('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST', body: JSON.stringify({ inspectionUrl: url, siteUrl: property, languageCode: 'en-US' })
    });
    const r = res.body?.inspectionResult?.indexStatusResult || {};
    return {
      url, inspected_at: new Date().toISOString(), http_status: res.status,
      verdict: r.verdict || (res.ok ? 'UNKNOWN' : 'ERROR'), coverageState: r.coverageState || (res.ok ? 'UNKNOWN' : `HTTP ${res.status}`),
      indexingState: r.indexingState || null, googleCanonical: r.googleCanonical || null, userCanonical: r.userCanonical || null,
      lastCrawlTime: r.lastCrawlTime || null, pageFetchState: r.pageFetchState || null
    };
  }));
  for (const result of results) fresh.set(result.url, result);
}
const results = urls.map((url) => fresh.get(url) || prevBy.get(url) || { url, coverageState: 'NOT_YET_INSPECTED' });
const counts = results.reduce((acc, item) => { acc[item.coverageState] = (acc[item.coverageState] || 0) + 1; return acc; }, {});
write('index_coverage.json', {
  property, collected_at: new Date().toISOString(), sitemap_url_count: urls.length,
  inspected_this_run: batch.length, daily_cap: DAILY_CAP, parallel: PARALLEL,
  counts_by_coverage_state: counts, results
});
write('gsc_status.json', { status: 'LIVE', checked_at: new Date().toISOString(), property, service_account: clientEmail, permission: entry.permissionLevel, run_date: today });
console.log(`[search-intelligence] ${property}: ${pageRows.length} pages, ${queryPageRows.length} query+page rows; inspected ${batch.length}/${urls.length}; ${JSON.stringify(counts)}`);
