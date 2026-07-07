import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
const calendar = JSON.parse(fs.readFileSync(path.join(root, 'data/content/content_calendar.json'), 'utf8'));
const liveItems = calendar.items.filter((item) => item.status === 'approved' && item.scheduledAt <= releaseDate);
const todaysItems = calendar.items.filter((item) => item.status === 'approved' && item.scheduledAt === releaseDate);
const mode = releaseDate <= '2026-12-31' ? 'seeded_backlog' : 'self_produced_extension';

const state = {
  generatedAt: new Date().toISOString(),
  releaseDate,
  mode,
  calendarStart: calendar.calendarStart,
  seededCalendarEnd: calendar.calendarEnd,
  approvedInternalCount: calendar.items.filter((item) => item.status === 'approved').length,
  livePublicCount: liveItems.length,
  todaysReleaseCount: todaysItems.length,
  todaysRoutes: todaysItems.map((item) => item.routeTarget),
  futureHiddenCount: calendar.items.filter((item) => item.status === 'approved' && item.scheduledAt > releaseDate).length,
  publicationBoundary: 'Only approved content scheduled on or before releaseDate is public. Future approved backlog stays internal/admin-only.'
};

fs.writeFileSync(path.join(root, 'data/content/release_state.json'), `${JSON.stringify(state, null, 2)}\n`);
console.log(`[release:state] ${releaseDate} mode=${mode} live=${state.livePublicCount} today=${state.todaysReleaseCount}`);
