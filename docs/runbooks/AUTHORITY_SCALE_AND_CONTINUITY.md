# Authority Scale and Post-2026 Continuity

This modernization is an additive sidecar around the existing Dianne client site and publishing system. The 100K opportunity corpus is planning intelligence only. It cannot approve or publish content. The native content generator, admin flow, licensure controls, crisis boundaries, and Content Publish workflow remain authoritative.

After 2026-12-31, the existing native generator still creates one approved validated item per day. The package command then runs a deterministic post-2026 hardener that diversifies the item and continues the existing cadence: daily resources, Tuesday articles, first-of-month pillars, and quarter-end white papers. No 2026 record is changed.

Distribution runs only after the existing Content Publish workflow completes successfully. Provider receipts never claim success unless a live provider returned success.

## Reviewed publication inventory (owner ruling, 3 November 2026)

The calendar remains an internal archive. Automatic generation and approval do not grant public publication. `data/seo/page_quality.json` owns the 12 reviewed editorial intents and their direct redirects; `lib/publication.mjs` enforces that inventory for the blog, sitemap, answer feed and release jobs. Blog intents are added only after review establishes a distinct useful answer. The search-loop engine publishes /questions/ pages again from 6 Nov 2026 under the owner's 3 Nov ruling (distinct pages only, cap grows with Google results): `search-loop.config.json` sets mode `slow` (at most 3 a day), `cap.max_live_pages` 10, the distinct-intent gate over `public/sitemap.xml`, and the strict health gate. The 22 question pages folded into guides on 4 Nov are `merged` in `data/search-loop/pages.json`. See `docs/reviews/PAGE_QUALITY_2026-11-04.md`.
