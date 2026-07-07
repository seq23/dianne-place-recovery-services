import { assert, fileExists, readJson } from './lib.mjs';

const legal = readJson('data/legal/legal_copy.json');
for (const mode of ['pre_license', 'licensed_provider']) {
  assert(legal[mode].medicalDisclaimer.length > 80, `${mode} medical disclaimer too short`);
  assert(legal[mode].outcomesDisclaimer.length > 80, `${mode} outcomes disclaimer too short`);
  assert(legal[mode].privacyStatement.length > 80, `${mode} privacy statement too short`);
}

const routes = [
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/medical-disclaimer/page.tsx',
  'app/outcomes-disclaimer/page.tsx',
  'app/cookie-policy/page.tsx'
];
for (const route of routes) {
  assert(fileExists(route), `Missing legal route ${route}`);
}

console.log('[validate:legal] OK');
