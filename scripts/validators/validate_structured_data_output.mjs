// Built site: LocalBusiness + WebSite + WebPage everywhere, BreadcrumbList on inner
// pages, FAQPage only for questions the page shows, homepage definition under the
// H1 (40-60 words) covered by SpeakableSpecification.
import { assert, readJson } from './lib.mjs';
import { builtPages, decode, jsonLdNodes, origin } from './output_lib.mjs';

const identity = readJson('data/seo/site_identity.json');
const pages = builtPages();
for (const p of pages) {
  const nodes = jsonLdNodes(p.html);
  const types = nodes.map((n) => n['@type']);
  const biz = nodes.find((n) => n['@type'] === identity.localBusiness.schemaType);
  assert(biz, `${p.path}: ${identity.localBusiness.schemaType} JSON-LD missing`);
  assert(biz.telephone === identity.phoneE164 && biz.url === `${origin}/`, `${p.path}: LocalBusiness telephone/url wrong`);
  assert(!('areaServed' in biz) || typeof biz.areaServed !== 'string' || !/to be confirmed/i.test(biz.areaServed), `${p.path}: placeholder areaServed in JSON-LD`);
  assert(types.includes('WebSite'), `${p.path}: WebSite JSON-LD missing`);
  const page = nodes.find((n) => n['@type'] === 'WebPage');
  assert(page && page.url === `${origin}${p.path}`, `${p.path}: WebPage JSON-LD missing or url wrong`);
  if (p.path !== '/') assert(types.includes('BreadcrumbList'), `${p.path}: BreadcrumbList missing`);
  const visible = decode(p.html.replace(/<script[\s\S]*?<\/script>/g, ''));
  for (const faq of nodes.filter((n) => n['@type'] === 'FAQPage')) {
    assert(faq.mainEntity?.length, `${p.path}: empty FAQPage`);
    for (const q of faq.mainEntity) assert(visible.includes(q.name), `${p.path}: FAQPage question not visible on page: ${q.name}`);
  }
}

const home = pages.find((p) => p.path === '/');
assert(home, 'homepage not built');
const m = home.html.match(/<h1>[^<]*<\/h1><p class="definition" id="definition">([^<]+)<\/p>/);
assert(m, 'homepage: definition paragraph (#definition) must directly follow the H1');
const def = decode(m[1]);
const words = def.split(/\s+/).filter(Boolean).length;
assert(words >= 40 && words <= 60 && def.startsWith(`${identity.name} is `), `homepage definition must be 40-60 words opening "${identity.name} is" (${words})`);
const webPage = jsonLdNodes(home.html).find((n) => n['@type'] === 'WebPage');
assert(webPage?.speakable?.['@type'] === 'SpeakableSpecification' && webPage.speakable.cssSelector?.includes('#definition'), 'homepage WebPage needs SpeakableSpecification covering #definition');
console.log(`[validate:structured-data-output] OK: ${pages.length} pages; definition ${words} words`);
