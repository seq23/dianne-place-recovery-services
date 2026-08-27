#!/usr/bin/env node
/**
 * Fails the build on the three ways a page fan-out goes wrong.
 *
 *   1. A sitemap URL nothing renders. The sitemap and the blog route now share
 *      lib/publication.mjs, so this is checked against the shared predicate
 *      rather than against a second copy of it.
 *   2. A calendar item that is published but structurally incomplete - missing
 *      a field the route dereferences without guarding, which is a build crash
 *      or a blank section rather than an answer.
 *   3. A page created with no demand record.
 *
 * Check 3 currently reports rather than blocks, and says why: this property has
 * no measured demand at all. There is no volume, difficulty, impression or
 * Search Console figure anywhere under data/, and the domain does not appear in
 * the portfolio Semrush packet. All 178 calendar items came from the dimension
 * arrays in data/authority_scale/authority_config.json. Blocking on that would
 * stop the site rather than improve it, so the honest thing is to state the
 * absence in every build until someone closes it. The moment a record exists in
 * data/demand/measured_demand.json, this check starts enforcing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { publishedItems, resolveReleaseDate } from '../../lib/publication.mjs';

const ROOT = process.cwd();
const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const errors = [];
const notes = [];

const releaseDate = resolveReleaseDate();
const calendar = read('data/content/content_calendar.json');
const published = publishedItems(calendar.items, releaseDate);
const future = (calendar.items || []).length - published.length;

// --- 1. sitemap parity, against the shared predicate ------------------------
if (!exists('public/sitemap.xml')) {
  notes.push('no public/sitemap.xml; run `npm run seo:sitemap`');
} else {
  const xml = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const publishedRoutes = new Set(published.map((i) => i.routeTarget));
  // `/blog/` itself is the index route from the route registry, not a calendar
  // item, so it is not the shared predicate's to answer for.
  const blogLocs = locs.filter((l) => l.startsWith('/blog/') && l !== '/blog/');
  const phantom = blogLocs.filter((l) => !publishedRoutes.has(l));
  if (phantom.length) {
    errors.push(`${phantom.length} blog URL(s) in the sitemap are not published by lib/publication.mjs: ${phantom.slice(0, 5).join(', ')}`);
  } else {
    notes.push(`sitemap: ${locs.length} URLs, ${blogLocs.length} blog routes, all published by the shared predicate`);
  }
}

// --- 2. every published item is structurally complete -----------------------
// The fields app/blog/[slug]/page.tsx dereferences without a guard. A published
// item missing one of these is a crash or a blank section, not an answer.
const REQUIRED = ['dek', 'humanizedIntro', 'sections', 'keyTakeaways', 'practicalNextSteps', 'reflectionPrompt', 'faq', 'atomBlocks', 'internalLinks', 'disclaimerBlock', 'answerSurface'];
const incomplete = [];
for (const item of published) {
  const missing = REQUIRED.filter((f) => item[f] === undefined || item[f] === null || (Array.isArray(item[f]) && !item[f].length));
  if (missing.length) incomplete.push(`${item.routeTarget} missing ${missing.join(', ')}`);
}
if (incomplete.length) {
  errors.push(`${incomplete.length} published item(s) are structurally incomplete:\n  ` + incomplete.slice(0, 10).join('\n  '));
} else {
  notes.push(`${published.length} published items, all complete; ${future} approved and future-dated (internal, not public)`);
}

// --- 3. demand evidence -----------------------------------------------------
const demand = exists('data/demand/measured_demand.json') ? read('data/demand/measured_demand.json') : { records: [] };
if (!(demand.records || []).length) {
  notes.push(
    `NOT MEASURED: 0 demand records. ${(calendar.items || []).length} calendar items exist and not one of them has ` +
    `a search-volume figure behind it. ${demand.provenance?.how_to_close_it || ''}`
  );
} else {
  const queries = new Set(demand.records.map((r) => String(r.query_normalized || r.query).toLowerCase()));
  const slugs = [...queries].map((q) => q.replace(/[^a-z0-9]+/g, '-'));
  const ungated = published.filter((i) => !slugs.some((s) => s && String(i.slug).includes(s)));
  if (ungated.length) {
    errors.push(`${ungated.length} published page(s) match no query in data/demand/measured_demand.json: ${ungated.slice(0, 10).map((i) => i.routeTarget).join(', ')}`);
  }
  notes.push(`demand: ${demand.records.length} records worth ${demand.total_measured_volume_per_month}/mo`);
}

for (const n of notes) console.log(`note: ${n}`);
if (errors.length) {
  console.error('validate:demand-backed-pages FAILED');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('validate:demand-backed-pages OK');
