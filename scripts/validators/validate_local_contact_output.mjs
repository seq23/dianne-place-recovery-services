// Built site: every public page carries a tel: link to the business phone, and a
// "Find us on Google" Maps link (+ hasMap) whenever a Business Profile is recorded.
import { assert, readJson } from './lib.mjs';
import { builtPages, jsonLdNodes } from './output_lib.mjs';

const id = readJson('data/seo/site_identity.json');
const tel = `tel:${id.phoneE164.replace('+', '')}`;
const pages = builtPages();
for (const p of pages) {
  assert(p.html.includes(`href="${tel}"`), `${p.path}: tel link ${tel} missing`);
  if (id.googleBusinessProfile.found) {
    const maps = `https://maps.google.com/?cid=${id.googleBusinessProfile.mapsCid}`;
    assert(p.html.includes(`href="${maps}"`), `${p.path}: Find us on Google link missing`);
    assert(jsonLdNodes(p.html).some((n) => n.hasMap === maps), `${p.path}: hasMap missing`);
  }
}
console.log(`[validate:local-contact-output] OK: ${pages.length} pages carry ${tel}; GBP ${id.googleBusinessProfile.found ? 'linked' : 'not found (recorded in site_identity.json)'}`);
