#!/usr/bin/env node
// Weekly outcome report for detoxdenver.org (Search Readiness i9). Reads the
// committed Search Console truth (data/search_intelligence/gsc_truth.json, written
// daily by collect.mjs) and index coverage, compares this week with last week, and
// writes reports/weekly-outcome.json plus a job summary. The workflow keeps ONE
// GitHub issue open while the site is red and closes it when it turns green.
// Client site: the report stays in this repo (owner ruling 1 Nov 2026).
//
// Red when: Search Console collection is not LIVE; gsc_truth.json is more than 3
// days old; or impressions fell by DROP_SHARE or more week over week from a base of
// at least MIN_BASE. Exits 1 (Rule 0) when the truth file cannot be read at all.
import fs from 'node:fs';
import path from 'node:path';

export const DROP_SHARE = 0.25;
export const MIN_BASE = 10;
export const STALE_DAYS = 3;

export function outcome({ truth, status, coverage, now = new Date() }) {
  const reasons = [];
  const weeks = truth.weekly || [];
  const cur = weeks.at(-1) || null;
  const prev = weeks.length > 1 ? weeks.at(-2) : null;
  const ageDays = (now - new Date(truth.collected_at)) / 86_400_000;
  if (status?.status !== 'LIVE') reasons.push(`Search Console collection is ${status?.status || 'unknown'}${status?.reason ? `: ${status.reason}` : ''}`);
  if (!(ageDays <= STALE_DAYS)) reasons.push(`gsc_truth.json was last collected ${Number.isFinite(ageDays) ? Math.floor(ageDays) : '?'} days ago (daily collection has stopped)`);
  const change = cur && prev ? { impressions: cur.impressions - prev.impressions, clicks: cur.clicks - prev.clicks } : null;
  if (cur && prev && prev.impressions >= MIN_BASE && cur.impressions <= prev.impressions * (1 - DROP_SHARE)) {
    reasons.push(`impressions fell from ${prev.impressions} (${prev.week}) to ${cur.impressions} (${cur.week})`);
  }
  const lost = (truth.query_history || []).filter((q) => !q.in_window && (q.max_impressions_28d || 0) > 0).map((q) => q.query);
  return {
    generated_at: now.toISOString(),
    site: 'detoxdenver.org',
    week: cur?.week ?? null,
    previous_week: prev?.week ?? null,
    this_week: cur, last_week: prev, change,
    note: prev ? null : 'first week on record: no week-over-week comparison yet',
    queries_in_window: truth.queries_in_window ?? null,
    queries_known: truth.queries_known ?? null,
    queries_left_window: lost.slice(0, 20),
    index_coverage: coverage?.counts_by_coverage_state ?? null,
    red: reasons.length > 0,
    reasons
  };
}

export function summary(r) {
  const fmt = (w) => (w ? `${w.impressions} impressions, ${w.clicks} clicks (${w.week})` : 'none yet');
  return [
    `## Weekly outcome: detoxdenver.org — ${r.red ? 'RED' : 'green'}`,
    `- This week: ${fmt(r.this_week)}`,
    `- Last week: ${fmt(r.last_week)}${r.note ? ` (${r.note})` : ''}`,
    `- Queries in the 28-day window: ${r.queries_in_window}; known in history: ${r.queries_known}${r.queries_left_window.length ? `; left the window: ${r.queries_left_window.join(', ')}` : ''}`,
    `- Index coverage: ${r.index_coverage ? Object.entries(r.index_coverage).map(([k, v]) => `${k} ${v}`).join('; ') : 'not read'}`,
    ...r.reasons.map((x) => `- RED: ${x}`)
  ].join('\n');
}

function main() {
  const dir = 'data/search_intelligence';
  const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { return null; } };
  const truth = read('gsc_truth.json');
  if (!truth) { console.error('NAMED STOP [GSC_TRUTH_MISSING]: data/search_intelligence/gsc_truth.json is missing or not JSON; the daily Search Intelligence run writes it.'); process.exit(1); }
  const r = outcome({ truth, status: read('gsc_status.json'), coverage: read('index_coverage.json') });
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/weekly-outcome.json', `${JSON.stringify(r, null, 2)}\n`);
  const text = summary(r);
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `red=${r.red}\n`);
  fs.writeFileSync('reports/weekly-outcome.md', `${text}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
