import { assert, fileExists, listFiles, readText } from './lib.mjs';

const workflowsDir = '.github/workflows';
const workflows = listFiles(workflowsDir).filter((file) => file.endsWith('.yml'));
const hasPackageLock = fileExists('package-lock.json');

const requiredWorkflows = [
  '.github/workflows/ci.yml',
  '.github/workflows/content_publish.yml'
];

for (const workflow of requiredWorkflows) {
  assert(workflows.includes(workflow), `Missing required product workflow: ${workflow}`);
}

function requireSharedWorkflowBaseline(workflow) {
  const text = readText(workflow);
  assert(text.includes('actions/checkout@v4'), `${workflow} must checkout repo`);
  assert(text.includes('node-version: 24'), `${workflow} must use Node 24`);
  assert(text.includes('npm install'), `${workflow} must install dependencies`);

  if (!hasPackageLock) {
    assert(!text.includes('npm ci'), `${workflow} must not use npm ci until package-lock exists`);
    assert(!text.includes('cache: npm'), `${workflow} must not enable npm cache until package-lock exists`);
  }
}

for (const workflow of requiredWorkflows) {
  requireSharedWorkflowBaseline(workflow);
}

const ci = readText('.github/workflows/ci.yml');
assert(ci.includes('pull_request:'), 'CI workflow must run on pull_request');
assert(ci.includes('push:') && ci.includes('branches:') && ci.includes('- main'), 'CI workflow must run on push to main');
assert(ci.includes('workflow_dispatch:'), 'CI workflow must support manual dispatch');
assert(ci.includes('permissions:\n  contents: read'), 'CI workflow should use read-only contents permission');
assert(ci.includes('concurrency:'), 'CI workflow must include a concurrency guard');
assert(ci.includes('npm run build'), 'CI workflow must run the production build');
assert(ci.includes('npm run validate:all'), 'CI workflow must run full validation');

const contentPublish = readText('.github/workflows/content_publish.yml');
assert(contentPublish.includes('schedule:'), 'Content publish workflow must run on schedule');
assert(contentPublish.includes('workflow_dispatch:'), 'Content publish workflow must support manual dispatch');
assert(contentPublish.includes('permissions:\n  contents: write'), 'Content publish workflow must have contents: write permission');
assert(contentPublish.includes('concurrency:'), 'Content publish workflow must include a concurrency guard');
assert(contentPublish.includes('fetch-depth: 0'), 'Content publish workflow must checkout full history');
assert(contentPublish.includes('git pull --rebase origin main'), 'Content publish workflow must rebase latest main before mutation');
assert(contentPublish.includes('PUBLICATION_DATE'), 'Content publish workflow must set PUBLICATION_DATE');
assert(contentPublish.includes('SELF_PRODUCE_DATE'), 'Content publish workflow must set SELF_PRODUCE_DATE');
assert(contentPublish.includes('npm run content:self-produce'), 'Content publish workflow must run post-2026 self-production');
assert(contentPublish.includes('npm run release:state'), 'Content publish workflow must write release state');
assert(contentPublish.includes('npm run validate:all'), 'Content publish workflow must validate');
assert(contentPublish.includes('npm run release:daily-proof'), 'Content publish workflow must emit proof packet');
assert(contentPublish.includes('git commit -m "Release scheduled content for ${PUBLICATION_DATE}"'), 'Content publish workflow must commit dated release surfaces');
assert(contentPublish.includes('git push origin main'), 'Content publish workflow must push generated release surfaces to main');
assert(
  !contentPublish.includes('_repo_validation_matrix.json') && !contentPublish.includes('REPO_IDENTITY.md'),
  'Content publish workflow must not target governance-file mutation'
);

console.log(`[validate:workflow-contract] OK: required product workflows present (${requiredWorkflows.join(', ')})`);
