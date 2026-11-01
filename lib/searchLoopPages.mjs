// The question pages the search-loop engine (seq23/search-loop) has published
// under /questions/. One reader for the sitemap and the /questions/ hub, so the
// two can never disagree about which pages are live. The engine owns the ledger
// (data/search-loop/pages.json); a page it merged or undid is no longer 'live'.
import fs from 'node:fs';
import path from 'node:path';

export function liveQuestionPages(root = process.cwd()) {
  const file = path.join(root, 'data/search-loop/pages.json');
  if (!fs.existsSync(file)) return [];
  const book = JSON.parse(fs.readFileSync(file, 'utf8'));
  return (book.pages || [])
    .filter((p) => p.status === 'live' && p.route && fs.existsSync(path.join(root, p.rel || '')))
    .map((p) => {
      const draftFile = path.join(root, 'data/search-loop/drafts', `${p.slug}.json`);
      const draft = fs.existsSync(draftFile) ? JSON.parse(fs.readFileSync(draftFile, 'utf8')) : null;
      return { slug: p.slug, route: p.route, title: draft?.h1 || p.query, query: p.query, publishedAt: p.published_at };
    })
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)) || a.route.localeCompare(b.route));
}
