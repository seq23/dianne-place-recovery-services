import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const calendar = JSON.parse(fs.readFileSync(path.join(root, 'data/content/content_calendar.json'), 'utf8'));
const outPath = path.join(root, 'reports/daily-citation-release-plan.json');
const nextItems = calendar.items.slice(0, 7).map((item) => ({
  unit_id: item.id,
  unit_type: item.contentType,
  route_target: item.routeTarget || `/blog/${item.slug}/`,
  selected_or_blocked: item.validation?.eligible ? 'selected' : 'blocked',
  reason: item.validation?.eligible ? 'approved scheduled backlog item' : item.validation?.blockers
}));

fs.writeFileSync(outPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), nextItems }, null, 2)}\n`);
console.log(`[release:plan] wrote ${nextItems.length} units`);
