import fs from 'node:fs';
import path from 'node:path';
import { readJson, root } from './lib.mjs';

const calendar = readJson('data/content/content_calendar.json');
const reportPath = path.join(root, 'artifacts/validation/future-content-self-heal.json');

const warnings = [];
const missingPolicy = calendar.items.filter((item) => !item.validation?.selfHealingPolicy);
if (missingPolicy.length) {
  warnings.push({
    code: 'SELF_HEAL_POLICY_NOT_ATTACHED',
    count: missingPolicy.length,
    message: 'Some items are missing self-healing policy. Run npm run release:self-heal before release validation.'
  });
}

const styleBlockers = calendar.items.filter((item) => item.validation?.selfHealingPolicy?.wordCountIsBlocking === true);
if (styleBlockers.length) {
  warnings.push({
    code: 'STYLE_BLOCKER_TOO_STRICT',
    count: styleBlockers.length,
    message: 'Word count must remain nonblocking unless reclassified for legal or compliance reasons.'
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  severity: 'strong_soft',
  blocksRelease: false,
  futurePublishingStartsAfter: '2026-12-31',
  defaultFutureStatus: 'approved_if_hard_checks_pass',
  marginOfError: {
    wordCount: '45% below target warns but does not hard-fail',
    pettyStyleIssues: 'warning only',
    optionalMetadata: 'warning only'
  },
  hardBlocksOnly: [
    'legal_compliance',
    'licensure_claims',
    'missing_route',
    'missing_disclaimer',
    'missing_crisis_boundary',
    'unsafe_medical_claim'
  ],
  warnings
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`[validate:future-content-self-heal] warnings=${warnings.length}`);
