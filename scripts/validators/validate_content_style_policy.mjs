import fs from 'node:fs';
import path from 'node:path';
import { readJson, root } from './lib.mjs';

const calendar = readJson('data/content/content_calendar.json');
const shortSummaries = calendar.items.filter((item) => (item.summary || '').length < 120);
const wordTargetVariance = calendar.items.filter((item) => item.wordTarget && item.sections)
  .filter((item) => {
    const estimatedWords = [
      item.humanizedIntro,
      item.directAnswer,
      ...(item.sections || []).map((section) => section.body),
      ...(item.keyTakeaways || []),
      ...(item.practicalNextSteps || [])
    ].join(' ').split(/\s+/).filter(Boolean).length;
    return estimatedWords < Math.floor(item.wordTarget * 0.55);
  });
const warnings = [];

if (shortSummaries.length > 0) {
  warnings.push({
    code: 'SHORT_SUMMARY',
    count: shortSummaries.length,
    message: 'Some generated summaries are short. This is advisory because full article expansion can happen in scheduled release generation.'
  });
}

if (wordTargetVariance.length > 0) {
  warnings.push({
    code: 'WORD_TARGET_VARIANCE',
    count: wordTargetVariance.length,
    message: 'Some posts estimate below the preferred word target. This is advisory, not blocking, because word count is a quality target with a margin of error.'
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
