import { assert, readJson, readText } from './lib.mjs';

const manifest = readJson('data/admin/admin_manifest.json');
assert(manifest.frontendPasswordGateAllowed === false, 'Frontend password gate must not be treated as real security');
assert(
  manifest.adminProtectionRequired.toLowerCase().includes('cloudflare access') ||
    manifest.adminProtectionRequired.toLowerCase().includes('real auth'),
  'Admin manifest must require real auth'
);

const adminPage = readText('app/admin/page.tsx');
const mediaPage = readText('app/admin/media/page.tsx');
const licensurePage = readText('app/admin/licensure/page.tsx');

assert(adminPage.includes('Cloudflare Access'), 'Admin page must disclose production auth requirement');
assert(mediaPage.includes('protected backend or GitHub-backed media manifest'), 'Media admin must not imply unsafe static upload writes');
assert(licensurePage.includes('ACTIVATE LICENSED MODE'), 'Licensure switch must require typed confirmation phrase');
assert(licensurePage.includes('pass validation'), 'Licensure switch must require validation');

console.log('[validate:admin-security] OK');
