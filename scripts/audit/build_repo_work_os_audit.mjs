import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function json(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

const checks = [
  ['repo_identity', 'REPO_IDENTITY.md'],
  ['update_contract', '_repo_update_contract.json'],
  ['validation_matrix', '_repo_validation_matrix.json'],
  ['validation_registry', 'data/validation/validation_registry.json'],
  ['content_release_contract', '_content_release_contract.json'],
  ['citation_contract', '_citation_intelligence_contract.json'],
  ['self_heal_contract', '_self_heal_contract.json'],
  ['licensure_state', 'data/licensure/licensure_status.json'],
  ['legal_copy', 'data/legal/legal_copy.json'],
  ['content_calendar', 'data/content/content_calendar.json'],
  ['source_registry', 'data/citations/source_registry.json'],
  ['claim_registry', 'data/citations/claim_registry.json'],
  ['content_atoms', 'data/atoms/atom_registry.json'],
  ['query_matrix', 'data/seo/query_matrix.json'],
  ['answer_surface_registry', 'data/aeo/answer_surface_registry.json'],
  ['geo_market_map', 'data/geo/market_map.json'],
  ['page_contracts', 'data/page_families/page_contracts.json'],
  ['route_registry', 'data/routing/route_registry.json'],
  ['media_manifest', 'data/media/site_images.json'],
  ['llms_txt', 'public/llms.txt'],
  ['llms_full', 'public/llms-full.txt'],
  ['answers_json', 'public/answers.json'],
  ['sitemap', 'public/sitemap.xml'],
  ['strategy_gate_doc', 'docs/strategy/CITATION_STRATEGY_GATE.md'],
  ['citation_growth_plan_doc', 'docs/strategy/100K_CITATION_SURFACE_PLAN.md'],
  ['content_pipeline_runbook', 'docs/runbooks/CONTENT_RELEASE_PIPELINE.md'],
  ['licensure_runbook', 'docs/runbooks/LICENSURE_MODE_SWITCH.md'],
  ['github_validate_workflow', '.github/workflows/validate_repo.yml'],
  ['github_content_publish_workflow', '.github/workflows/content_publish.yml'],
  ['daily_proof_packet', 'artifacts/validation/daily-proof-packet.json']
];

const results = checks.map(([id, file]) => ({
  id,
  file,
  status: exists(file) ? 'present' : 'missing'
}));

const calendar = exists('data/content/content_calendar.json') ? json('data/content/content_calendar.json') : { items: [] };
const matrix = exists('_repo_validation_matrix.json') ? json('_repo_validation_matrix.json') : {};
const media = exists('data/media/site_images.json') ? json('data/media/site_images.json') : { slots: [] };

const derived = [
  {
    id: 'calendar_seeded_2026',
    status:
      calendar.items?.length >= 178 &&
      calendar.items?.[0]?.scheduledAt === '2026-07-07' &&
      calendar.items?.at(-1)?.scheduledAt === '2026-12-31'
        ? 'present'
        : 'missing',
    detail: `${calendar.items?.length || 0} items`
  },
  {
    id: 'validation_severity_tiers',
    status:
      matrix.hardFailValidators?.length >= 8 &&
      matrix.strongSoftValidators?.length >= 1 &&
      matrix.warningValidators?.length >= 1
        ? 'present'
        : 'missing',
    detail: `hard=${matrix.hardFailValidators?.length || 0}, strong_soft=${matrix.strongSoftValidators?.length || 0}, warning=${matrix.warningValidators?.length || 0}`
  },
  {
    id: 'photo_slots_defined',
    status: media.slots?.length >= 6 ? 'present' : 'missing',
    detail: `${media.slots?.length || 0} slots`
  },
  {
    id: 'build_validation_boundary',
    status: exists('artifacts/validation/dependency-lock.json') ? 'blocked_until_local_validation' : 'missing',
    detail: 'Dependency install/build remains local validation boundary when lockfile is absent.'
  }
];

const all = [...results, ...derived];
const summary = {
  generatedAt: new Date().toISOString(),
  standard: 'Repo Work OS v0 source-doc compliance audit',
  counts: all.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {}),
  results: all
};

fs.writeFileSync(
  path.join(root, 'artifacts/validation/repo-work-os-compliance.json'),
  `${JSON.stringify(summary, null, 2)}\n`
);

const missing = all.filter((item) => item.status === 'missing');
const partial = all.filter((item) => item.status === 'partial');
const blocked = all.filter((item) => item.status === 'blocked_until_local_validation');

const md = [
  '# Repo Work OS Compliance Audit',
  '',
  `Generated: ${summary.generatedAt}`,
  '',
  '## Summary',
  '',
  `- Present: ${summary.counts.present || 0}`,
  `- Missing: ${summary.counts.missing || 0}`,
  `- Partial: ${summary.counts.partial || 0}`,
  `- Blocked Until Local Validation: ${summary.counts.blocked_until_local_validation || 0}`,
  '',
  '## Missing',
  '',
  missing.length ? missing.map((item) => `- ${item.id}: ${item.file || item.detail || ''}`).join('\n') : '- None',
  '',
  '## Partial',
  '',
  partial.length ? partial.map((item) => `- ${item.id}: ${item.file || item.detail || ''}`).join('\n') : '- None',
  '',
  '## Blocked Until Local Validation',
  '',
  blocked.length ? blocked.map((item) => `- ${item.id}: ${item.detail || item.file || ''}`).join('\n') : '- None',
  '',
  '## Notes',
  '',
  '- This audit validates repo structure and governance artifacts against Repo Work OS expectations.',
  '- It does not claim live deploy, browser, Search Console, Bing, or Cloudflare proof.',
  '- Photo assets are governed by slots and requirements; final real photo files remain pending owner approval/selection.'
].join('\n');

fs.writeFileSync(path.join(root, 'reports/REPO_WORK_OS_COMPLIANCE_AUDIT.md'), `${md}\n`);
console.log(`[repo-work-os:audit] present=${summary.counts.present || 0} missing=${summary.counts.missing || 0}`);
