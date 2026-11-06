// Search Console truth keeps a query after it leaves the 28-day window (e4), and the
// weekly outcome report turns red on a real drop or a stopped collection (i9).
import test from 'node:test';
import assert from 'node:assert/strict';
import { gscTruth } from '../search_intelligence/gsc_truth.mjs';
import { outcome } from '../search_intelligence/weekly_outcome_report.mjs';

const run = (prev, end, impressions, rows) => gscTruth(prev, {
  property: 'sc-domain:detoxdenver.org', start: '2026-10-01', end, collectedAt: `${end}T12:00:00Z`,
  totals: { clicks: 0, impressions, position: 10 }, queryPageRows: rows
});
const row = (query, impressions) => ({ query, page: 'https://detoxdenver.org/', clicks: 0, impressions, position: 5 });

test('a query that leaves the window stays in the history', () => {
  const w1 = run(null, '2026-11-04', 12, [row('sober living rules', 8), row('recovery housing', 4)]);
  const w2 = run(w1, '2026-11-11', 6, [row('recovery housing', 6)]);
  const gone = w2.query_history.find((q) => q.query === 'sober living rules');
  assert.ok(gone, 'dropped query is kept');
  assert.equal(gone.in_window, false);
  assert.equal(gone.max_impressions_28d, 8);
  assert.equal(gone.last_seen, '2026-11-04');
  assert.equal(w2.weekly.length, 2);
});

test('the weekly report is red on a 25% drop, green on the first week, red when collection stops', () => {
  const now = new Date('2026-11-12T13:00:00Z');
  const live = { status: 'LIVE' };
  const w1 = run(null, '2026-11-04', 40, [row('a', 40)]);
  const first = outcome({ truth: { ...w1, collected_at: '2026-11-12T12:00:00Z' }, status: live, now });
  assert.equal(first.red, false);
  const drop = run(w1, '2026-11-11', 20, [row('a', 20)]);
  assert.equal(outcome({ truth: drop, status: live, now }).red, true);
  const flat = run(w1, '2026-11-11', 39, [row('a', 39)]);
  assert.equal(outcome({ truth: flat, status: live, now }).red, false);
  const stale = outcome({ truth: flat, status: live, now: new Date('2026-11-20T00:00:00Z') });
  assert.equal(stale.red, true);
  assert.equal(outcome({ truth: flat, status: { status: 'NAMED_STOP', reason: 'no secret' }, now }).red, true);
});
