// Per-page SEO data: every public route has a title/description, the homepage
// definition names the business, schema type fits licensure mode. Lengths and
// word counts: over the band is a note, under fails only below 75% of the floor.
import { assert, readJson, failsFloor, note } from './lib.mjs';

const TITLE = [8, 70];
const DESC = [70, 170];
const DEF_WORDS = [40, 60];
function band(label, n, [min, max], unit) {
  assert(!failsFloor(n, min), `${label} is ${n ?? 0} ${unit}, under 75% of the ${min}-${unit} floor`);
  if (n < min || n > max) note(`${label} is ${n} ${unit}; aimed for ${min}-${max}`);
}

// The rule itself, probed: over a ceiling never fails, under fails only below 75%.
assert(!failsFloor(5000, DESC[0]) && !failsFloor(Math.ceil(DESC[0] * 0.75), DESC[0]) && failsFloor(Math.ceil(DESC[0] * 0.75) - 1, DESC[0]) && failsFloor(undefined, TITLE[0]),
  'LENGTH RULE: failsFloor must pass anything over its ceiling and fail only below 75% of the floor');

const pages = readJson('data/seo/page_seo.json').pages;
const routes = readJson('data/routing/route_registry.json').routes.filter((r) => !r.path.startsWith('/admin'));
assert(routes.length > 0, 'route registry has no public routes');
for (const route of routes) {
  const p = pages[route.path];
  assert(p, `data/seo/page_seo.json missing ${route.path}`);
  band(`${route.path}: title`, p.title?.length, TITLE, 'chars');
  band(`${route.path}: description`, p.description?.length, DESC, 'chars');
  assert(p.name, `${route.path}: breadcrumb name missing`);
}
const descs = Object.values(pages).map((p) => p.description);
assert(new Set(descs).size === descs.length, 'page descriptions must be unique');

const id = readJson('data/seo/site_identity.json');
const words = id.definition.split(/\s+/).filter(Boolean).length;
band('homepage definition', words, DEF_WORDS, 'words');
assert(id.definition.startsWith(`${id.name} is `), `definition must open "${id.name} is ..."`);

const mode = readJson('data/licensure/licensure_status.json').mode;
if (mode === 'pre_license') assert(!/Medical/.test(id.localBusiness.schemaType), 'pre_license mode cannot use a Medical* schema type');
const gbp = id.googleBusinessProfile;
assert(typeof gbp.found === 'boolean' && gbp.checkedAt, 'googleBusinessProfile must record found + checkedAt');
if (gbp.found) assert(/^\d{5,25}$/.test(String(gbp.mapsCid)), 'googleBusinessProfile.found needs a decimal mapsCid');
console.log(`[validate:page-seo] OK: ${routes.length} routes; definition ${words} words`);
