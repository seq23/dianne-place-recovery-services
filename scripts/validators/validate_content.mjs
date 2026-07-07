import { assert, readJson } from './lib.mjs';

const calendar = readJson('data/content/content_calendar.json');
assert(calendar.calendarStart === '2026-07-07', 'Calendar start must be 2026-07-07');
assert(calendar.calendarEnd === '2026-12-31', 'Calendar end must be 2026-12-31');
assert(Array.isArray(calendar.items), 'Content calendar items must be an array');
assert(calendar.items.length >= 170, 'Content calendar must include approved backlog through 2026-12-31');

const ids = new Set();
for (const item of calendar.items) {
  assert(item.id && !ids.has(item.id), `Duplicate or missing content id: ${item.id}`);
  ids.add(item.id);
  if (item.scheduledAt >= '2026-07-07' && item.scheduledAt <= '2026-12-31') {
    assert(item.status === 'approved', `Backlog item ${item.id} must be approved through 2026-12-31`);
  } else {
    assert(['approved', 'ready_for_approval', 'published', 'revoked'].includes(item.status), `Future item ${item.id} has invalid status`);
  }
  assert(item.publishMode === 'auto_if_validated', `Backlog item ${item.id} must use auto_if_validated`);
  assert(item.validation?.eligible === true, `Approved backlog item must be eligible: ${item.id}`);
  assert(Array.isArray(item.requiredDisclaimers) && item.requiredDisclaimers.length >= 3, `Missing disclaimers: ${item.id}`);
  assert(item.directAnswer && item.directAnswer.length >= 120, `Missing direct answer: ${item.id}`);
  assert(item.answerSurface?.question && item.answerSurface?.answer, `Missing answer surface: ${item.id}`);
  assert(item.routeTarget?.startsWith('/blog/'), `Missing blog route target: ${item.id}`);
  assert(item.slug && item.routeTarget.includes(item.slug), `Blog route must include slug: ${item.id}`);
  assert(item.queryFamilyId, `Missing query family: ${item.id}`);
  assert(item.citationStrategyPillar, `Missing citation strategy pillar: ${item.id}`);
  assert(item.priorityScore >= 50, `Missing useful priority score: ${item.id}`);
  assert(item.humanizedIntro && item.humanizedIntro.length >= 240, `Missing humanized intro: ${item.id}`);
  assert(Array.isArray(item.sections) && item.sections.length >= 4, `Missing real content sections: ${item.id}`);
  assert(item.sections.every((section) => section.heading && section.body?.length >= 180), `Content sections are too thin: ${item.id}`);
  assert(Array.isArray(item.keyTakeaways) && item.keyTakeaways.length >= 4, `Missing key takeaways: ${item.id}`);
  assert(Array.isArray(item.practicalNextSteps) && item.practicalNextSteps.length >= 4, `Missing practical next steps: ${item.id}`);
  assert(Array.isArray(item.faq) && item.faq.length >= 3, `Missing FAQ surface: ${item.id}`);
  assert(Array.isArray(item.atomBlocks) && item.atomBlocks.length >= 4, `Missing recovery support atoms: ${item.id}`);
  assert(item.disclaimerBlock?.toLowerCase().includes('not a substitute'), `Missing content disclaimer: ${item.id}`);
}

console.log(`[validate:content] OK: ${calendar.items.length} items`);
