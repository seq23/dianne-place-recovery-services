import fs from 'node:fs';
import { assert, readJson } from './lib.mjs';

const manifest = readJson('data/admin/content_manifest.json');
const adminPage = fs.readFileSync('app/admin/page.tsx', 'utf8');
const contentPage = fs.readFileSync('app/admin/content/page.tsx', 'utf8');
const dashboard = fs.readFileSync('app/admin/content/ContentOpsDashboard.tsx', 'utf8');
const mediaPage = fs.readFileSync('app/admin/media/page.tsx', 'utf8');
const licensurePage = fs.readFileSync('app/admin/licensure/page.tsx', 'utf8');

assert(Array.isArray(manifest.items) && manifest.items.length >= 170, 'Admin content manifest must include seeded backlog');
assert(manifest.items.every((item) => item.status === 'approved'), 'All through-12/31 seeded manifest items must be approved');
assert(manifest.items.every((item) => item.publicPath?.startsWith('/blog/')), 'Admin manifest items need blog public paths');
assert(manifest.items.every((item) => item.validationPassed === true), 'Admin manifest should only expose validation-passed backlog');

for (const required of ['/admin/content', '/admin/licensure', '/admin/media', '/admin/resources']) {
  assert(adminPage.includes(required), `Main admin must preserve link to ${required}`);
}

assert(contentPage.includes('ContentOpsDashboard'), 'Admin content page must use interactive content dashboard');
assert(dashboard.includes('use client'), 'Content dashboard must be client-side for filters/controls');
assert(dashboard.includes('setStatus'), 'Content dashboard needs status controls');
assert(dashboard.includes('Edit Content Calendar in GitHub'), 'Content dashboard needs GitHub edit control');
assert(dashboard.includes('Preview'), 'Content dashboard needs preview action');
assert(dashboard.includes('Live'), 'Content dashboard needs live action');

assert(mediaPage.includes('Dianne Photo Management'), 'Dianne photo admin must be preserved');
assert(mediaPage.includes('Photo file'), 'Dianne photo upload control must be preserved');
assert(licensurePage.includes('Licensure Mode Switch'), 'Licensure mode admin must be preserved');
assert(licensurePage.includes('ACTIVATE LICENSED MODE'), 'Licensure activation guard must be preserved');

console.log('[validate:admin-content-controls] OK');
