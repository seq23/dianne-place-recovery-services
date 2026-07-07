import { assert, fileExists, readJson } from './lib.mjs';

assert(fileExists('artifacts/validation/repo-work-os-compliance.json'), 'Repo Work OS compliance artifact missing; run repo-work-os:audit');
assert(fileExists('reports/REPO_WORK_OS_COMPLIANCE_AUDIT.md'), 'Repo Work OS compliance report missing');

const audit = readJson('artifacts/validation/repo-work-os-compliance.json');
assert((audit.counts?.missing || 0) === 0, 'Repo Work OS audit has missing required items');
assert((audit.counts?.partial || 0) === 0, 'Repo Work OS audit has partial required items');
assert((audit.counts?.present || 0) >= 30, 'Repo Work OS audit should cover at least 30 items');

console.log('[validate:repo-work-os-compliance] OK');
