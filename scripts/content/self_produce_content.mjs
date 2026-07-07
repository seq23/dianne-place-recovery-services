import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports/self-production-preview.md');
const candidatePath = path.join(root, 'data/content/post_2026_self_production_preview.json');
const today = process.env.SELF_PRODUCE_DATE || new Date().toISOString().slice(0, 10);

if (today < '2027-01-01') {
  fs.writeFileSync(
    reportPath,
    `# Self-Production Preview\n\nDate: ${today}\n\nStatus: BLOCKED_BEFORE_2027\n\nThe approved backlog runs through 2026-12-31. Self-production is intentionally blocked before 2027-01-01.\n`
  );
  console.log('[content:self-produce] blocked before 2027-01-01');
  process.exit(0);
}

const slug = `${today}-self-produced-recovery-support-resource`;
const candidate = {
  generatedAt: new Date().toISOString(),
  date: today,
  defaultStatus: 'approved',
  publishMode: 'auto_if_validated',
  routeTarget: `/blog/${slug}/`,
  title: 'Self-produced recovery support resource',
  slug,
  contentType: 'daily_resource',
  audience: 'people seeking recovery housing',
  validationPolicy: {
    selfHealingEnabled: true,
    wordCountIsBlocking: false,
    pettyStyleIssuesBlockRelease: false,
    hardBlocksOnly: [
      'legal_compliance',
      'licensure_claims',
      'missing_route',
      'missing_disclaimer',
      'missing_crisis_boundary',
      'unsafe_medical_claim'
    ]
  },
  requiredFields: [
    'directAnswer',
    'humanizedIntro',
    'sections',
    'keyTakeaways',
    'practicalNextSteps',
    'faq',
    'atomBlocks',
    'disclaimerBlock',
    'sourceIds'
  ],
  draftingInstruction:
    'Generate one source-aware, trauma-informed recovery support post using the content atom registry, source registry, legal disclaimers, and licensure mode. Default to approved only if hard compliance checks pass.'
};

fs.writeFileSync(candidatePath, `${JSON.stringify(candidate, null, 2)}\n`);
fs.writeFileSync(
  reportPath,
  `# Self-Production Preview\n\nDate: ${today}\n\nStatus: READY_FOR_SELF_PRODUCTION\n\nA default-approved future content candidate was written to data/content/post_2026_self_production_preview.json. It may autopublish only when hard legal, licensure, route, disclaimer, crisis-boundary, and unsafe-medical-claim checks pass. Word count variance and petty style issues are warnings, not blockers.\n`
);
console.log('[content:self-produce] preview generated');
