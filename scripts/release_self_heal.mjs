import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredDirs = ['artifacts/validation', 'reports', 'data/content', 'data/admin'];
for (const dir of requiredDirs) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

const contentPath = path.join(root, 'data/content/content_calendar.json');
const calendar = fs.existsSync(contentPath) ? JSON.parse(fs.readFileSync(contentPath, 'utf8')) : null;
const repairs = requiredDirs.map((dir) => ({ path: dir, action: 'ensure_dir' }));

if (calendar?.items?.length) {
  for (const item of calendar.items) {
    item.validation = item.validation || {};
    item.validation.blockers = item.validation.blockers || [];
    item.validation.warnings = item.validation.warnings || [];
    item.validation.selfHealingPolicy = {
      enabledForFutureContent: item.scheduledAt > '2026-12-31',
      wordCountIsBlocking: false,
      pettyStyleIssuesBlockRelease: false,
      hardBlocksOnly: ['legal_compliance', 'licensure_claims', 'missing_route', 'missing_disclaimer', 'missing_crisis_boundary', 'unsafe_medical_claim']
    };
  }
  fs.writeFileSync(contentPath, `${JSON.stringify(calendar, null, 2)}\n`);
  repairs.push({ path: 'data/content/content_calendar.json', action: 'attach_self_healing_policy_to_items' });
}

const summary = {
  generatedAt: new Date().toISOString(),
  repairs,
  futureContentPolicy: {
    startsAfter: '2026-12-31',
    defaultStatus: 'approved',
    wordCountMargin: '45% below target warns but does not hard-fail',
    nonBlocking: ['word count variance', 'minor style variance', 'optional metadata', 'tone polish'],
    hardBlocking: ['legal/compliance risk', 'licensure misrepresentation', 'missing disclaimer', 'missing route', 'unsafe medical claim']
  },
  forbiddenRepairsSkipped: ['licensure mode switch', 'legal policy rewrite', 'tracking enablement']
};

fs.writeFileSync(path.join(root, 'artifacts/validation/self-heal.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log('[release:self-heal] OK');
