import { assert, fileExists, readJson } from './lib.mjs';

const growth = readJson('data/strategy/citation_growth_plan.json');
const queries = readJson('data/seo/query_matrix.json');
const answers = readJson('data/aeo/answer_surface_registry.json');
const geo = readJson('data/geo/market_map.json');
const atoms = readJson('data/atoms/atom_registry.json');
const pageContracts = readJson('data/page_families/page_contracts.json');
const routes = readJson('data/routing/route_registry.json');
const calendar = readJson('data/content/content_calendar.json');
const sitemapText = await import('node:fs').then((fs) => fs.readFileSync('public/sitemap.xml', 'utf8'));

assert(growth.target?.timeHorizon === '6-12 months', 'Citation growth plan must target 6-12 months');
assert(growth.target?.guarantee === false, 'Citation growth plan must not guarantee 100K citations');
assert(growth.scoreTarget?.aeoSeoGeoReadiness >= 9, 'AEO/SEO/GEO readiness target must be at least 9');

assert(Array.isArray(queries.queryFamilies) && queries.queryFamilies.length >= 7, 'Query matrix needs at least 7 query families');
assert(queries.queryFamilies.every((family) => family.queries?.length >= 4), 'Each query family needs at least 4 queries');
assert(Array.isArray(answers.answerBlocks) && answers.answerBlocks.length >= 5, 'Answer registry needs direct answer blocks');
assert(geo.primaryMarket?.city === 'Denver', 'GEO map must identify Denver');
assert(Array.isArray(atoms.atoms) && atoms.atoms.length >= 5, 'Atom registry needs reusable atoms');
assert(Array.isArray(pageContracts.pageFamilies) && pageContracts.pageFamilies.length >= 4, 'Page contracts missing');
assert(Array.isArray(routes.routes) && routes.routes.some((route) => route.path === '/answers/'), 'Route registry must include /answers/');
assert(fileExists('app/answers/page.tsx'), 'Answers page missing');
assert((await import('node:fs')).readFileSync('app/answers/page.tsx', 'utf8').includes('FAQPage'), 'Answers page must include FAQPage schema');
assert(fileExists('app/blog/[slug]/page.tsx'), 'Individual blog route missing');
assert(fileExists('public/answers.json'), 'public answers.json missing; run content:build-answers');

const publicAnswers = readJson('public/answers.json');
assert(publicAnswers.answers.length >= 60, 'Public answer feed must expose at least 60 answer blocks');
assert(calendar.items.every((item) => item.directAnswer && item.answerSurface && item.routeTarget), 'Every scheduled content item needs direct answer and route target');
assert(calendar.items.every((item) => item.queryFamilyId && item.citationStrategyPillar), 'Every scheduled item must map to query family and citation pillar');
assert(sitemapText.includes('/answers/'), 'Sitemap must include answers route');
assert(sitemapText.includes(calendar.items[0].routeTarget), 'Sitemap must include generated blog route targets');
assert((sitemapText.match(/<url>/g) || []).length >= calendar.items.length + 10, 'Sitemap must cover core routes plus scheduled content routes');

console.log('[validate:aeo-seo-geo] OK');
