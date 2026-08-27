/**
 * One definition of "this item is published", imported by the route that
 * renders it and by the script that advertises it.
 *
 * The expression `item.status === 'approved' && item.scheduledAt <= releaseDate`
 * was written twice: once in app/blog/[slug]/page.tsx, which decides what
 * `generateStaticParams` builds and what `notFound()`s, and once in
 * scripts/seo/build_sitemap.mjs, which decides what the sitemap claims. They
 * agree today. Nothing made them agree - they were two people typing the same
 * thought - and 178 approved items sit in the calendar with 127 of them
 * future-dated, so the two sides are separated by a date comparison that has to
 * stay identical on every build for the sitemap not to advertise a route the
 * renderer will refuse.
 *
 * Written as .mjs rather than .ts so the plain Node build script can import the
 * same file the TSX route does, instead of a transpiled copy of it.
 */

/** The date the site considers "now". Both callers must resolve it the same
 *  way, or the predicate is identical and still disagrees. */
export function resolveReleaseDate(env = process.env) {
  return env.PUBLICATION_DATE || env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
}

/** The predicate. Approved, and its scheduled date has arrived. */
export function isPublished(item, releaseDate) {
  return Boolean(item) && item.status === 'approved' && item.scheduledAt <= releaseDate;
}

/** Every published item, in one call, so neither caller has to remember to pair
 *  the filter with the right date. */
export function publishedItems(items, releaseDate = resolveReleaseDate()) {
  return (items || []).filter((item) => isPublished(item, releaseDate));
}
