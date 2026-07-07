import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports/self-production-preview.md');
const today = process.env.SELF_PRODUCE_DATE || new Date().toISOString().slice(0, 10);

if (today < '2027-01-01') {
  fs.writeFileSync(
    reportPath,
    `# Self-Production Preview\n\nDate: ${today}\n\nStatus: BLOCKED_BEFORE_2027\n\nThe approved backlog runs through 2026-12-31. Self-production is intentionally blocked before 2027-01-01.\n`
  );
  console.log('[content:self-produce] blocked before 2027-01-01');
  process.exit(0);
}

fs.writeFileSync(
  reportPath,
  `# Self-Production Preview\n\nDate: ${today}\n\nStatus: READY_FOR_CANDIDATE_GENERATION\n\nNext step: generate source-backed candidates from the strategy profile, source registry, query universe, and content atom registry. Candidates must pass validators before publishing.\n`
);
console.log('[content:self-produce] preview generated');
