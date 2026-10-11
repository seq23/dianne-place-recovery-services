// Per-page SEO data: every public route has a title/description, the homepage
// definition is 40-60 words and names the business, schema type fits licensure mode.
import { assert, readJson } from './lib.mjs';

const pages = readJson('data/seo/page_seo.json').pages;
const routes = readJson('data/routing/route_registry.json').routes.filter((r) => !r.path.startsWith('/admin'));
assert(routes.length > 0, 'route registry has no public routes');
for (const route of routes) {
  const p = pages[route.path];
  assert(p, `data/seo/page_seo.json missing ${route.path}`);
  assert(p.title?.length >= 8 && p.title.length <= 70, `${route.path}: title must be 8-70 chars`);
  assert(p.description?.length >= 70 && p.description.length <= 170, `${route.path}: description must be 70-170 chars (is ${p.description?.length})`);
  assert(p.name, `${route.path}: breadcrumb name missing`);
}
const descs = Object.values(pages).map((p) => p.description);
assert(new Set(descs).size === descs.length, 'page descriptions must be unique');

const id = readJson('data/seo/site_identity.json');
const words = id.definition.split(/\s+/).filter(Boolean).length;
assert(words >= 40 && words <= 60, `homepage definition must be 40-60 words (is ${words})`);
assert(id.definition.startsWith(`${id.name} is `), `definition must open "${id.name} is ..."`);

const mode = readJson('data/licensure/licensure_status.json').mode;
if (mode === 'pre_license') assert(!/Medical/.test(id.localBusiness.schemaType), 'pre_license mode cannot use a Medical* schema type');
const gbp = id.googleBusinessProfile;
assert(typeof gbp.found === 'boolean' && gbp.checkedAt, 'googleBusinessProfile must record found + checkedAt');
if (gbp.found) assert(/^\d{5,25}$/.test(String(gbp.mapsCid)), 'googleBusinessProfile.found needs a decimal mapsCid');
console.log(`[validate:page-seo] OK: ${routes.length} routes; definition ${words} words`);
