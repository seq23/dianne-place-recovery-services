import { publishedItems } from '../../lib/publication.mjs';
import { liveQuestionPages } from '../../lib/searchLoopPages.mjs';
import fs from 'node:fs';
import { assert, fileExists, readJson } from './lib.mjs';

const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
const growth = readJson('data/strategy/citation_growth_plan.json');
const queries = readJson('data/seo/query_matrix.json');
const answers = readJson('data/aeo/answer_surface_registry.json');
const geo = readJson('data/geo/market_map.json');
const atoms = readJson('data/atoms/atom_registry.json');
const pageContracts = readJson('data/page_families/page_contracts.json');
const routes = readJson('data/routing/route_registry.json');
const calendar = readJson('data/content/content_calendar.json');
const sitemapText = fs.readFileSync('public/sitemap.xml', 'utf8');
const publicAnswers = readJson('public/answers.json');

const liveItems = publishedItems(calendar.items, releaseDate);
const futureItems = calendar.items.filter((item) => item.status === 'approved' && item.scheduledAt > releaseDate);

assert(growth.target?.timeHorizon === '6-12 months', 'Citation growth plan must target 6-12 months');
assert(growth.target?.guarantee === false, 'Citation growth plan must not guarantee 100K citations');
assert(growth.scoreTarget?.aeoSeoGeoReadiness >= 9, 'AEO/SEO/GEO readiness target must be at least 9');
assert(Array.isArray(queries.queryFamilies) && queries.queryFamilies.length >= 7, 'Query matrix needs at least 7 query families');
assert(queries.queryFamilies.every((family) => family.queries?.length >= 4), 'Each query family needs at least 4 queries');
assert(Array.isArray(answers.answerBlocks) && answers.answerBlocks.length >= 5, 'Answer registry needs direct answer blocks');
assert(geo.primaryMarket?.serviceAreaMode === 'non_localized', 'GEO map must stay non-localized until service-area strategy is approved');
assert(Array.isArray(atoms.atoms) && atoms.atoms.length >= 5, 'Atom registry needs reusable atoms');
assert(Array.isArray(pageContracts.pageFamilies) && pageContracts.pageFamilies.length >= 4, 'Page contracts missing');
assert(Array.isArray(routes.routes) && routes.routes.some((route) => route.path === '/answers/'), 'Route registry must include /answers/');
assert(fileExists('app/answers/page.tsx'), 'Answers page missing');
assert(fs.readFileSync('app/answers/page.tsx', 'utf8').includes('FAQPage'), 'Answers page must include FAQPage schema');
assert(fileExists('app/blog/[slug]/page.tsx'), 'Individual blog route missing');
assert(fileExists('public/answers.json'), 'public answers.json missing; run content:build-answers');
assert(publicAnswers.answers.length >= answers.answerBlocks.length, 'Public answer feed must include registry answer blocks');
assert(publicAnswers.answers.length <= answers.answerBlocks.length + 60, 'Public answer feed must respect the scheduled-answer cap');
assert(publicAnswers.answers.every((answer) => !answer.scheduledAt || answer.scheduledAt <= releaseDate), 'Public answers must not expose future scheduled content');
assert(calendar.items.every((item) => item.directAnswer && item.answerSurface && item.routeTarget), 'Every scheduled content item needs direct answer and route target');
assert(calendar.items.every((item) => item.queryFamilyId && item.citationStrategyPillar), 'Every scheduled item must map to query family and citation pillar');
assert(sitemapText.includes('/answers/'), 'Sitemap must include answers route');
for (const item of liveItems) assert(sitemapText.includes(item.routeTarget), `Sitemap missing live blog route: ${item.id}`);
for (const item of futureItems.slice(0, 10)) assert(!sitemapText.includes(item.routeTarget), `Sitemap must not expose future blog route: ${item.id}`);
const expectedRoutes = routes.routes.filter((r) => !r.path.startsWith('/admin')).map((r) => r.path);
const sitemapRoutes = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
assert(expectedRoutes.length > 0 && liveItems.length > 0, 'Core routes and reviewed editorial inventory must be non-empty');
// Live search-loop question pages (data/search-loop/pages.json, status live, file present)
// are the third and only other inventory; merged or undone pages never reach the sitemap.
const questionRoutes = liveQuestionPages().map((q) => q.route);
assert(sitemapRoutes.length === expectedRoutes.length + liveItems.length + questionRoutes.length, 'Sitemap must exactly cover core routes, the kept editorial ledger and the live question pages');
for (const route of questionRoutes) assert(sitemapRoutes.includes(route), `Sitemap missing live question page: ${route}`);
for (const route of expectedRoutes) assert(sitemapRoutes.includes(route), `Sitemap missing core route: ${route}`);

console.log('[validate:aeo-seo-geo] OK');
