// Search Console wiring: workflow scheduled + dispatchable, secret passed, collector
// covers analytics/sitemaps/inspection and degrades to a NAMED STOP, outputs committed.
import { assert, fileExists, readJson, readText } from './lib.mjs';

const wf = readText('.github/workflows/search_intelligence.yml');
for (const s of ['schedule:', 'workflow_dispatch:', 'secrets.GSC_SERVICE_ACCOUNT_JSON', 'collect.mjs', 'git add data/search_intelligence', 'node-version: 24', 'actions/checkout@v4']) {
  assert(wf.includes(s), `search_intelligence.yml must include ${s}`);
}
const c = readText('scripts/search_intelligence/collect.mjs');
for (const s of ['webmasters/v3/sites\'', 'searchAnalytics/query', "['query', 'page']", '/sitemaps', "method: 'PUT'", 'urlInspection/index:inspect', 'PARALLEL = 8', 'GSC_INSPECTION_DAILY_CAP || 150', 'NAMED_STOP', 'index_coverage.json', 'counts_by_coverage_state']) {
  assert(c.includes(s), `collect.mjs must include ${s}`);
}
assert(fileExists('data/search_intelligence/gsc_portfolio_export_2026-10-08.json'), 'first truth file missing');
const cons = readJson('data/search_intelligence/consolidation_candidates.json');
assert(Array.isArray(cons.candidates) && cons.sitemap_pages > 0, 'consolidation_candidates.json must list candidates over a non-empty sitemap');
console.log(`[validate:search-intelligence] OK: ${cons.candidates.length} consolidation candidates recorded`);
