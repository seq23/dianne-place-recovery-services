#!/usr/bin/env node
import fs from 'node:fs';

const errors = [];
const required = [
  'data/distribution/indexnow_batch.txt',
  'data/distribution/priority_urls.txt',
  'data/distribution/distribution_manifest.json',
  '.github/workflows/authority_observation_distribution.yml',
  'scripts/distribution/submit_distribution.mjs'
];
for (const file of required) if (!fs.existsSync(file)) errors.push(`missing:${file}`);
const manifest = JSON.parse(fs.readFileSync('data/distribution/distribution_manifest.json', 'utf8'));
const batch = fs.readFileSync('data/distribution/indexnow_batch.txt', 'utf8').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const priority = fs.readFileSync('data/distribution/priority_urls.txt', 'utf8').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const workflow = fs.readFileSync('.github/workflows/authority_observation_distribution.yml', 'utf8');
const submit = fs.readFileSync('scripts/distribution/submit_distribution.mjs', 'utf8');
if (manifest.provider_success_claimed !== false) errors.push('manifest-provider-truth');
if (manifest.url_count !== batch.length) errors.push(`count:${manifest.url_count}/${batch.length}`);
if (manifest.priority_url_count !== priority.length) errors.push(`priority-count:${manifest.priority_url_count}/${priority.length}`);
if (!manifest.publication_trigger.includes('EXISTING_CONTENT_PUBLISH')) errors.push('trigger');
for (const step of ['successful_publish','sitemap_refresh','indexnow','gsc_sitemap_submission','priority_url_inspection_where_configured','durable_distribution_receipt','observation_feedback']) {
  if (!manifest.chain?.includes(step)) errors.push(`chain:${step}`);
}
if (!workflow.includes('workflow_run:') || !workflow.includes('workflows: ["Content Publish"]')) errors.push('workflow-not-post-publish');
if (!workflow.includes("github.event.workflow_run.conclusion == 'success'")) errors.push('workflow-success-gate');
if (!workflow.includes('npm run authority:cycle')) errors.push('workflow-sitemap-refresh');
if (!workflow.includes('npm run distribution:submit')) errors.push('workflow-submit');
if (!workflow.includes('data/distribution')) errors.push('workflow-durable-commit');
if (!submit.includes('searchconsole.googleapis.com/v1/urlInspection/index:inspect')) errors.push('missing-url-inspection');
if (!submit.includes('webmasters/v3/sites/')) errors.push('missing-gsc-sitemap');
if (!submit.includes('data/distribution/observation_feedback.json')) errors.push('missing-observation-feedback');
if (!submit.includes('data/distribution/receipts/')) errors.push('missing-receipt-history');
if (fs.existsSync('data/distribution/provider_receipt.json')) {
  const receipt = JSON.parse(fs.readFileSync('data/distribution/provider_receipt.json', 'utf8'));
  if (receipt.provider_success_claimed === true && !['SUCCESS'].includes(receipt.indexnow?.status) && !['SUCCESS'].includes(receipt.gsc_sitemap_submission?.status) && !['SUCCESS'].includes(receipt.priority_url_inspection?.status)) errors.push('receipt-provider-truth');
  if (receipt.verified_external_citations_delta !== 0) errors.push('receipt-citation-truth');
}
console.log(JSON.stringify({ ok: !errors.length, url_count: batch.length, priority_url_count: priority.length, provider_success_claimed: manifest.provider_success_claimed, errors }, null, 2));
if (errors.length) process.exit(1);
