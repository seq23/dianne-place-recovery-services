import fs from 'node:fs';
import { assert, fileExists, readJson } from './lib.mjs';

const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
const calendar = readJson('data/content/content_calendar.json');
const blogIndex = fs.readFileSync('app/blog/page.tsx', 'utf8');
const blogPost = fs.readFileSync('app/blog/[slug]/page.tsx', 'utf8');

assert(blogIndex.includes("import Link from 'next/link'"), 'Blog index must import Next Link');
assert(blogIndex.includes('Read post'), 'Blog cards must expose a Read post CTA');
assert(blogIndex.includes('href={item.routeTarget'), 'Blog index must link to item route targets');
assert(blogIndex.includes('scheduledAt <= releaseDate'), 'Blog index must hide future scheduled posts');
assert(!blogIndex.includes('Full approved release calendar'), 'Public blog must not expose the internal release calendar');
assert(!blogIndex.includes('Approved seeded posts'), 'Public blog must not expose seeded-post counts');
assert(!blogIndex.includes('Audience:'), 'Public blog must not expose internal audience metadata');
assert(!blogIndex.includes('Status:'), 'Public blog must not expose approval status metadata');
assert(!blogIndex.includes('Atoms:'), 'Public blog must not expose atom-count metadata');

assert(blogPost.includes('humanizedIntro'), 'Blog post page must render humanized intro');
assert(blogPost.includes('item.sections.map'), 'Blog post page must render full post sections');
assert(blogPost.includes('item.atomBlocks.map'), 'Blog post page must render content atoms');
assert(blogPost.includes('item.faq.map'), 'Blog post page must render FAQ content');
assert(blogPost.includes('disclaimerBlock'), 'Blog post page must render content disclaimer block');
assert(blogPost.includes('scheduledAt <= releaseDate'), 'Blog post route must hide future scheduled posts');
assert(!blogPost.includes('Target depth'), 'Public blog post must not expose internal target-depth metadata');
assert(!blogPost.includes('Source references:'), 'Public blog post must not expose internal source-reference metadata');

for (const item of calendar.items) {
  assert(item.slug, `Missing slug: ${item.id}`);
  assert(item.routeTarget === `/blog/${item.slug}/`, `Route target must match slug: ${item.id}`);
  if (item.scheduledAt >= '2026-07-07' && item.scheduledAt <= '2026-12-31') {
    assert(item.status === 'approved', `Seeded backlog must remain approved through 12/31/26: ${item.id}`);
  }
  assert(Array.isArray(item.sections) && item.sections.length >= 4, `Missing full sections: ${item.id}`);
  assert(Array.isArray(item.atomBlocks) && item.atomBlocks.length >= 4, `Missing atom blocks: ${item.id}`);
  assert(Array.isArray(item.faq) && item.faq.length >= 3, `Missing FAQ blocks: ${item.id}`);
}

assert(fileExists('app/blog/[slug]/page.tsx'), 'Blog post route missing');
console.log(`[validate:blog-routes] OK for releaseDate=${releaseDate}`);
