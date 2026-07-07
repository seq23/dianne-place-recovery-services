import { assert, fileExists, readJson } from './lib.mjs';

const manifest = readJson('data/media/site_images.json');
assert(Array.isArray(manifest.slots), 'Media manifest must include slots');
assert(manifest.slots.length >= 6, 'Media manifest must define strategic site image slots');
assert(manifest.diannePhotoBoundary?.includes('real Dianne photo only'), 'Dianne photo boundary must be explicit');

const requiredRepresentation = ['African American', 'white', 'Asian', 'Latino'];
for (const term of requiredRepresentation) {
  assert(
    JSON.stringify(manifest.globalRequirements.representation).toLowerCase().includes(term.toLowerCase()),
    `Media representation requirement missing ${term}`
  );
}

assert(
  manifest.globalRequirements.hairTextureRequirement.toLowerCase().includes('natural hair'),
  'Natural hair texture requirement missing'
);
assert(
  manifest.globalRequirements.forbidden.includes('alcohol') &&
    manifest.globalRequirements.forbidden.includes('pills') &&
    manifest.globalRequirements.forbidden.includes('hospital beds'),
  'Media forbidden list must include high-risk visual categories'
);

for (const slot of manifest.slots) {
  assert(slot.id && slot.route && slot.placement, `Invalid media slot metadata: ${slot.id}`);
  assert(slot.alt && slot.alt.length >= 40, `Media slot alt text too weak: ${slot.id}`);
  assert(slot.direction && slot.direction.length >= 120, `Media slot direction too weak: ${slot.id}`);
  assert(slot.excludeDiannePhoto === true, `Non-Dianne media slot must exclude Dianne photo: ${slot.id}`);
}

const requiredPages = [
  ['app/page.tsx', 'home-hero-community'],
  ['app/page.tsx', 'home-support-community'],
  ['app/recovery-housing/page.tsx', 'recovery-housing-kitchen'],
  ['app/referrals/page.tsx', 'referrals-warm-handoff'],
  ['app/resources/page.tsx', 'resources-guidance'],
  ['app/contact/page.tsx', 'contact-calm-inquiry']
];

for (const [page, slot] of requiredPages) {
  assert(fileExists(page), `Missing page ${page}`);
  const text = await import('node:fs').then((fs) => fs.readFileSync(page, 'utf8'));
  assert(text.includes(slot), `Page ${page} does not render media slot ${slot}`);
}

console.log('[validate:media-representation] OK');
