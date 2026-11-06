// gsc_truth.json: today's Search Console window plus a history that never forgets.
// Pure: (previous file or null, this run's numbers) -> the next file. Used by
// collect.mjs (daily) and read by weekly_outcome_report.mjs.
export const GSC_TRUTH_SCHEMA = 'gsc-truth-v1';
export const WEEKS_KEPT = 104;

/** ISO week key "2026-W45" for a YYYY-MM-DD or ISO time. */
export function isoWeek(t) {
  const d = new Date(t); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const y = d.getUTCFullYear(), w1 = new Date(Date.UTC(y, 0, 4));
  return `${y}-W${String(1 + Math.round(((d - w1) / 86_400_000 - 3 + ((w1.getUTCDay() + 6) % 7)) / 7)).padStart(2, '0')}`;
}

export function gscTruth(prev, { property, start, end, collectedAt, totals, queryPageRows }) {
  const byQuery = new Map();
  for (const r of queryPageRows || []) {
    const q = r.query ?? r.keys?.[0]; const page = r.page ?? r.keys?.[1];
    if (!q) continue;
    const cur = byQuery.get(q) || { query: q, clicks: 0, impressions: 0, pages: new Set(), best_position: null };
    cur.clicks += r.clicks || 0; cur.impressions += r.impressions || 0; if (page) cur.pages.add(page);
    if (typeof r.position === 'number') cur.best_position = cur.best_position === null ? r.position : Math.min(cur.best_position, r.position);
    byQuery.set(q, cur);
  }
  const day = String(collectedAt).slice(0, 10);
  const history = new Map(((prev && prev.query_history) || []).map((h) => [h.query, { ...h, in_window: false }]));
  for (const cur of byQuery.values()) {
    const h = history.get(cur.query) || { query: cur.query, first_seen: day, max_impressions_28d: 0, best_position: null };
    history.set(cur.query, {
      ...h,
      last_seen: day,
      in_window: true,
      impressions_28d: cur.impressions,
      clicks_28d: cur.clicks,
      pages: [...cur.pages].sort(),
      max_impressions_28d: Math.max(h.max_impressions_28d || 0, cur.impressions),
      best_position: h.best_position === null ? cur.best_position : cur.best_position === null ? h.best_position : Math.min(h.best_position, cur.best_position)
    });
  }
  const week = isoWeek(end);
  const weekly = ((prev && prev.weekly) || []).filter((w) => w.week !== week);
  weekly.push({ week, end_date: end, collected_at: collectedAt, clicks: totals.clicks || 0, impressions: totals.impressions || 0, position: totals.position ?? null, queries_in_window: byQuery.size });
  weekly.sort((a, b) => a.week.localeCompare(b.week));
  return {
    schema: GSC_TRUTH_SCHEMA,
    property, start_date: start, end_date: end, collected_at: collectedAt,
    totals,
    queries_in_window: byQuery.size,
    queries_known: history.size,
    query_history: [...history.values()].sort((a, b) => (b.max_impressions_28d || 0) - (a.max_impressions_28d || 0) || a.query.localeCompare(b.query)),
    weekly: weekly.slice(-WEEKS_KEPT)
  };
}
