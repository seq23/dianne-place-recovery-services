import { assert, fileExists, readJson } from './lib.mjs';

const required = [
  'REPO_IDENTITY.md',
  '.nvmrc',
  '_repo_update_contract.json',
  '_repo_validation_matrix.json',
  '_content_release_contract.json',
  '_citation_intelligence_contract.json',
  '_self_heal_contract.json',
  'data/validation/validation_registry.json',
  'data/admin/content_manifest.json',
  'data/licensure/licensure_status.json',
  'data/strategy/citation_growth_plan.json',
  'data/seo/query_matrix.json',
  'data/aeo/answer_surface_registry.json',
  'data/geo/market_map.json',
  'data/atoms/atom_registry.json',
  'data/page_families/page_contracts.json',
  'data/routing/route_registry.json',
  'data/media/site_images.json',
  'data/content/content_calendar.json',
  'data/citations/source_registry.json',
  'data/citations/claim_registry.json',
  'public/llms.txt',
  'public/llms-full.txt',
  'public/answers.json',
  'public/robots.txt',
  'public/sitemap.xml',
  'artifacts/validation/repo-work-os-compliance.json',
  'reports/REPO_WORK_OS_COMPLIANCE_AUDIT.md',
  'tsconfig.json',
  '.github/workflows/ci.yml',
  '.github/workflows/content_publish.yml'
];

for (const file of required) {
  assert(fileExists(file), `Missing required repo file ${file}`);
}

const matrix = readJson('_repo_validation_matrix.json');
assert(matrix.hardFailValidators.length >= 10, 'Validation matrix must contain hard validators');
assert(matrix.releaseCommand === 'npm run validate:release', 'Validation matrix must expose simplified release validation command');
assert(matrix.strongSoftValidators.length >= 1, 'Validation matrix must contain strong-soft validators');
assert(matrix.warningValidators.length >= 1, 'Validation matrix must contain warning validators');
const contract = readJson('_content_release_contract.json');
assert(contract.postBacklogSelfProductionStarts === '2027-01-01', 'Self-production must start 2027-01-01');
assert(readJson('package.json').engines?.node === '>=24.0.0', 'package.json must declare Node 24 engine');
const tsconfig = readJson('tsconfig.json');
assert(tsconfig.compilerOptions?.baseUrl === '.', 'tsconfig must define baseUrl for @ imports');
assert(tsconfig.compilerOptions?.paths?.['@/*']?.[0] === './*', 'tsconfig must define @/* path alias');

console.log('[validate:repo] OK');
