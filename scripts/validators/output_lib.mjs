// Shared reader for validators that check the built site in out/ (run after `npm run build`).
import fs from 'node:fs';
import path from 'node:path';
import { assert, listFiles, readJson } from './lib.mjs';

export const origin = readJson('data/seo/site_identity.json').origin;

export function builtPages() {
  assert(fs.existsSync('out/index.html'), 'out/ missing: run `npm run build` before the SEO output validators');
  const pages = listFiles('out')
    .filter((f) => f.endsWith('index.html') && !f.startsWith(`out${path.sep}404`) && !f.startsWith(`out${path.sep}admin`) && !f.startsWith(`out${path.sep}_next`))
    .map((file) => {
      const rel = file.slice(4).replace(/index\.html$/, '');
      return { file, path: `/${rel}`.replace(/\\/g, '/'), html: fs.readFileSync(file, 'utf8') };
    })
    // Pages the search-loop engine wrote (public/questions/) pass the engine's own
    // gate before they publish (search-loop.config.json, health gate included);
    // these validators check the pages this repo renders.
    .filter((page) => !page.html.includes('<meta content="search-loop" name="generator"/>'));
  const expected = [...fs.readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert(expected.length > 0 && pages.length === expected.length, `built public inventory must exactly match the non-empty sitemap (${expected.length}), found ${pages.length}`);
  for (const route of expected) assert(pages.some((page) => page.path === route), `missing built sitemap route: ${route}`);
  return pages;
}

export function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

export function jsonLdNodes(html) {
  const nodes = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(m[1]);
    for (const n of data['@graph'] || [data]) nodes.push(n);
  }
  return nodes;
}

export const decode = (s) => s.replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
