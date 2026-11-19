// Clarity: hostname-keyed map exists, loader is mounted, and it is consent-gated.
import { assert, fileExists, readJson, readText } from './lib.mjs';

assert(fileExists('data/clarity_projects.json'), 'data/clarity_projects.json is required');
const cfg = readJson('data/clarity_projects.json');
assert(cfg.projects && typeof cfg.projects === 'object' && !Array.isArray(cfg.projects), 'clarity_projects.json needs a "projects" object');
for (const [host, pid] of Object.entries(cfg.projects)) {
  assert(/^[a-z0-9.-]+\.[a-z]+$/.test(host) && !host.startsWith('www.'), `clarity host key must be a bare hostname without www.: ${host}`);
  assert(/^[a-z0-9]{8,12}$/.test(pid), `clarity project id for ${host} looks wrong: ${pid}`);
}
// Pinned 2026-10-11: the project created for this site; the canonical host must resolve to it.
assert(cfg.projects['detoxdenver.org'] === 'yw33z6e8yr', 'clarity project for detoxdenver.org must be yw33z6e8yr');
const loader = readText('components/ClarityLoader.tsx');
assert(loader.includes('clarity_projects.json'), 'ClarityLoader must read data/clarity_projects.json');
assert(loader.includes('/clarity-consent.js'), 'ClarityLoader must render the first-party loader public/clarity-consent.js');
assert(fileExists('public/clarity-consent.js'), 'public/clarity-consent.js is required');
const file = readText('public/clarity-consent.js');
assert(file.includes('dprs-cookie-preferences') && file.includes('functional'), 'clarity-consent.js must wait for Functional/Analytics consent');
assert(readText('app/layout.tsx').includes('<ClarityLoader />'), 'ClarityLoader must be mounted in app/layout.tsx');
// Search Readiness e9 (owner, 25 Oct 2026): Clarity only where a visitor fills a form or buys.
const paths = [...(loader.match(/CLARITY_PATHS = \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]);
assert(paths.length > 0, 'ClarityLoader must list at least one form page in CLARITY_PATHS');
for (const p of paths) {
  assert(!p.startsWith('/admin'), `Clarity must never load on ${p}`);
  const page = `app${p}/page.tsx`;
  assert(fileExists(page) && readText(page).includes('<form'), `${p} is in CLARITY_PATHS but ${page} has no <form>`);
}
const n = Object.keys(cfg.projects).length;
console.log(`[validate:clarity] OK: ${n} project(s)${n ? '' : ' (map empty: project id pending)'}`);
