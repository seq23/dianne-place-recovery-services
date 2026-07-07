import { assert, readJson } from './lib.mjs';

const registry = readJson('data/validation/validation_registry.json');
const matrix = readJson('_repo_validation_matrix.json');

for (const severity of ['hard', 'strong_soft', 'warning']) {
  assert(registry.severityModel?.[severity], `Missing severity model: ${severity}`);
}

assert(matrix.registry === 'data/validation/validation_registry.json', 'Matrix must point to validation registry');
assert(Array.isArray(matrix.hardFailValidators), 'Matrix requires hardFailValidators');
assert(Array.isArray(matrix.strongSoftValidators), 'Matrix requires strongSoftValidators');
assert(Array.isArray(matrix.warningValidators), 'Matrix requires warningValidators');

const registeredScripts = new Set(registry.validators.map((validator) => validator.script));
for (const script of [
  ...matrix.hardFailValidators,
  ...matrix.strongSoftValidators,
  ...matrix.warningValidators
]) {
  assert(registeredScripts.has(script), `Matrix references unregistered validator: ${script}`);
}

const hardCount = registry.validators.filter((validator) => validator.severity === 'hard').length;
const softCount = registry.validators.filter((validator) => validator.severity === 'strong_soft').length;
const warningCount = registry.validators.filter((validator) => validator.severity === 'warning').length;

assert(hardCount >= 10, 'Registry needs meaningful hard validators');
assert(softCount >= 1, 'Registry needs at least one strong-soft validator');
assert(warningCount >= 1, 'Registry needs at least one warning validator');
assert(
  registry.pettyBlockerPolicy?.toLowerCase().includes('must not hard-fail'),
  'Registry must include no-petty-blockers policy'
);

console.log('[validate:validation-registry] OK');
