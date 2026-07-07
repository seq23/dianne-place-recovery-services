import fs from 'node:fs';
import path from 'node:path';
import { readJson, root } from './lib.mjs';

const calendar = readJson('data/content/content_calendar.json');
const shortSummaries = calendar.items.filter((item) => (item.summary || '').length < 120);
const warnings = [];

if (shortSummaries.length > 0) {
  warnings.push({
    code: 'SHORT_SUMMARY',
    count: shortSummaries.length,
    message: 'Some generated summaries are short. This is advisory because full article expansion can happen in scheduled release generation.'
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  severity: 'warning',
  blocksRelease: false,
  warnings
};

fs.writeFileSync(path.join(root, 'artifacts/validation/content-style-policy.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`[validate:content-style-policy] warnings=${warnings.length}`);
