import { assert, fileExists, readJson } from './lib.mjs';

assert(fileExists('artifacts/validation/strategy-gate.json'), 'Strategy gate artifact missing; run strategy:gate');
const gate = readJson('artifacts/validation/strategy-gate.json');
assert(gate.status === 'passed', 'Strategy gate must pass');
assert(gate.allowedPageFamilies.includes('resources'), 'Resources page family must be allowed');
assert(gate.forbiddenClaims.includes('guaranteed outcomes'), 'Guaranteed outcomes must be forbidden');
console.log('[strategy:validate] OK');
