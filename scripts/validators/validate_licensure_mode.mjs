import { assert, listFiles, readJson, readText } from './lib.mjs';

const licensure = readJson('data/licensure/licensure_status.json');
const mode = licensure.mode;
assert(['pre_license', 'licensed_provider'].includes(mode), 'Invalid licensure mode');

if (mode === 'licensed_provider') {
  const license = licensure.license || {};
  for (const field of ['status', 'licenseType', 'licenseNumber', 'issuingAgency', 'state', 'effectiveDate']) {
    assert(Boolean(license[field]), `Licensed mode requires ${field}`);
  }
  assert(license.status === 'active', 'Licensed mode requires active license status');
  assert(Array.isArray(license.coveredServices) && license.coveredServices.length > 0, 'Licensed mode requires covered services');
}

if (mode === 'pre_license') {
  const publicFiles = listFiles('app').filter((file) => file.endsWith('.tsx') && !file.includes('/admin/'));
  const forbidden = [
    'licensed treatment center',
    'we treat ',
    'clinical treatment services are active',
    'insurance verification is enabled',
    'medication management'
  ];
  for (const file of publicFiles) {
    const text = readText(file).toLowerCase();
    for (const phrase of forbidden) {
      assert(!text.includes(phrase), `Pre-license forbidden phrase "${phrase}" found in ${file}`);
    }
  }
}

assert(licensure.capabilities.insuranceVerificationEnabled === false, 'Insurance verification must remain disabled in baseline');
console.log('[validate:licensure-mode] OK');
