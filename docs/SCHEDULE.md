# Schedule

Every scheduled GitHub Actions job in this repo. Times are Central (America/Chicago): each
`schedule:` entry carries `timezone: America/Chicago`, which GitHub Actions honours, so the clock
change in March and November no longer moves a job. Rebalanced 1 Nov 2026 (owner-approved weekly
schedule); see the notes below for what moved.

| Job | Workflow | When | Cron |
|---|---|---|---|
| Authority Observation and Distribution | `authority_observation_distribution.yml` | Fri 04:10 CT | `10 4 * * 5` |
| Content Publish | `content_publish.yml` | every day 07:17 CT | `17 7 * * *` |
| Search Intelligence | `search_intelligence.yml` | every day 06:23 CT | `23 6 * * *` |

## Notes

- Monday 04:00–08:00 CT is kept clear: this repo's Monday jobs moved to quiet early-morning
  slots Tuesday–Saturday on 1 Nov 2026.

## Moved on 1 Nov 2026
- Authority Observation and Distribution: Monday → Friday 04:10 CT.
