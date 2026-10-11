// Built site: icons, manifest, og:image 1200x630 on the canonical origin, twitter
// card + image, and a self-referencing canonical/og:url on every public page.
import fs from 'node:fs';
import { assert, readJson } from './lib.mjs';
import { attr, builtPages, origin } from './output_lib.mjs';

for (const f of ['favicon.ico', 'apple-touch-icon.png', 'site.webmanifest', 'og-image.png']) assert(fs.existsSync(`out/${f}`), `out/${f} missing`);
const ico = fs.readFileSync('out/favicon.ico');
assert(ico.readUInt16LE(0) === 0 && ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) >= 1, 'favicon.ico is not an ICO file');
const png = fs.readFileSync('out/og-image.png');
assert(png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, `og-image.png must be 1200x630, is ${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`);
const touch = fs.readFileSync('out/apple-touch-icon.png');
assert(touch.readUInt32BE(16) === 180, 'apple-touch-icon.png must be 180px');
const manifest = readJson('out/site.webmanifest');
assert(manifest.name && manifest.icons?.length >= 2, 'site.webmanifest needs name and icons');

const pages = builtPages();
for (const p of pages) {
  const want = `${origin}${p.path}`;
  assert(attr(p.html, /<link rel="canonical" href="([^"]+)"/) === want, `${p.path}: canonical must be ${want}, got ${attr(p.html, /<link rel="canonical" href="([^"]+)"/)}`);
  assert(attr(p.html, /<meta property="og:url" content="([^"]+)"/) === want, `${p.path}: og:url must be ${want}`);
  assert(attr(p.html, /<meta property="og:image" content="([^"]+)"/) === `${origin}/og-image.png`, `${p.path}: og:image must be ${origin}/og-image.png`);
  assert(attr(p.html, /<meta property="og:image:width" content="([^"]+)"/) === '1200', `${p.path}: og:image:width 1200 missing`);
  assert(attr(p.html, /<meta property="og:image:height" content="([^"]+)"/) === '630', `${p.path}: og:image:height 630 missing`);
  assert(attr(p.html, /<meta name="twitter:card" content="([^"]+)"/) === 'summary_large_image', `${p.path}: twitter:card summary_large_image missing`);
  assert(attr(p.html, /<meta name="twitter:image" content="([^"]+)"/) === `${origin}/og-image.png`, `${p.path}: twitter:image missing`);
  assert(/<link rel="icon" href="\/favicon\.ico"/.test(p.html), `${p.path}: favicon link missing`);
  assert(/<link rel="apple-touch-icon" href="\/apple-touch-icon\.png"/.test(p.html), `${p.path}: apple-touch-icon link missing`);
  assert(/<link rel="manifest" href="\/site\.webmanifest"/.test(p.html), `${p.path}: manifest link missing`);
}
console.log(`[validate:seo-hygiene-output] OK: ${pages.length} pages`);
