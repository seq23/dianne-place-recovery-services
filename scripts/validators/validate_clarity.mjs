// Clarity: hostname-keyed map exists, loader is mounted, and it is consent-gated.
import { assert, fileExists, readJson, readText } from './lib.mjs';

assert(fileExists('data/clarity_projects.json'), 'data/clarity_projects.json is required');
const cfg = readJson('data/clarity_projects.json');
assert(cfg.projects && typeof cfg.projects === 'object' && !Array.isArray(cfg.projects), 'clarity_projects.json needs a "projects" object');
for (const [host, pid] of Object.entries(cfg.projects)) {
  assert(/^[a-z0-9.-]+\.[a-z]+$/.test(host) && !host.startsWith('www.'), `clarity host key must be a bare hostname without www.: ${host}`);
  assert(/^[a-z0-9]{8,12}$/.test(pid), `clarity project id for ${host} looks wrong: ${pid}`);
}
const loader = readText('components/ClarityLoader.tsx');
assert(loader.includes("clarity_projects.json"), 'ClarityLoader must read data/clarity_projects.json');
assert(loader.includes('dprs-cookie-preferences') && loader.includes('functional'), 'ClarityLoader must wait for Functional/Analytics consent');
assert(readText('app/layout.tsx').includes('<ClarityLoader />'), 'ClarityLoader must be mounted in app/layout.tsx');
const n = Object.keys(cfg.projects).length;
console.log(`[validate:clarity] OK: ${n} project(s)${n ? '' : ' (map empty: project id pending)'}`);
