import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const calendarPath = path.join(root, 'data/content/content_calendar.json');
const releasePath = path.join(root, 'artifacts/validation/daily-citation-release-plan.json');
const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
const today = process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);

const selected = calendar.items.filter(
  (item) =>
    item.scheduledAt === today &&
    item.status === 'approved' &&
    item.publishMode === 'auto_if_validated' &&
    item.validation?.eligible === true
);

const blocked = calendar.items.filter((item) => item.scheduledAt === today && item.validation?.eligible === false);

const plan = {
  generatedAt: new Date().toISOString(),
  date: today,
  selectedCount: selected.length,
  blockedCount: blocked.length,
  units: selected.map((item) => ({
    unit_id: item.id,
    unit_type: item.contentType,
    source_basis: item.sourceIds,
    claim_ids: item.claimIds,
    route_target: item.routeTarget || `/blog/${item.slug}/`,
    page_family: 'blog',
    priority_score: item.contentType === 'quarterly_whitepaper' ? 95 : item.contentType === 'monthly_pillar' ? 80 : 55,
    selected_or_blocked: 'selected',
    reason: 'scheduled approved item passed manifest validation',
    expected_mutation: 'publish generated content route or queue for static generation',
    validation_required: ['validate:content', 'validate:licensure-mode', 'validate:legal']
  })),
  blocked: blocked.map((item) => ({ unit_id: item.id, reason: item.validation?.blockers || [] }))
};

fs.writeFileSync(releasePath, `${JSON.stringify(plan, null, 2)}\n`);
console.log(`[content:publish] selected=${selected.length} blocked=${blocked.length}`);
