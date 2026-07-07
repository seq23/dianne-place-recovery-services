# Dianne's Place Recovery Services

Static-first Next.js baseline for Dianne's Place Recovery Services.

The site is intentionally licensed-treatment-ready while operating in `pre_license` mode until an authorized owner enters active license details and flips the guarded licensure mode switch.

## Core Commands

```bash
npm install
npm run build
npm run validate:all
```

`validate:hard` must pass before artifact handoff. `validate:soft` emits production-readiness or advisory findings without blocking the ZIP unless the validation matrix reclassifies the issue.

If this artifact has no `package-lock.json`, use `npm install` rather than `npm ci` until the first successful install creates and commits the lockfile.

## Production Boundary

- Public site can deploy as static output from `out/`.
- `/admin` surfaces must be protected by Cloudflare Access or equivalent real auth in production.
- The static admin UI models the owner workflow and reads repo-governed data; final write operations should happen through GitHub-backed commits, a secured CMS, or a protected backend.
- Do not enable PHI collection, insurance verification, or third-party tracking on sensitive flows until compliant vendor contracts and backend controls are active.
