import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { publishedItems, isPublished } from '../../lib/publication.mjs';
import { pageQuality } from '../../lib/pageQuality.mjs';
import { liveQuestionPages } from '../../lib/searchLoopPages.mjs';
const calendar = JSON.parse(fs.readFileSync('data/content/content_calendar.json', 'utf8'));
const routes = JSON.parse(fs.readFileSync('data/routing/route_registry.json', 'utf8')).routes;

test('reviewed inventory controls rendering, sitemap, feeds and direct one-hop redirects', async () => {
  const guides = pageQuality.guides;
  assert.ok(guides.length > 0, 'zero kept guides must fail');
  assert.ok(Object.keys(pageQuality.redirects).length > 0, 'zero consolidation work must fail');
  const kept = new Set(guides.map((g) => g.route));
  assert.equal(kept.size, guides.length);
  const live = publishedItems(calendar.items, '2099-01-01');
  assert.deepEqual(new Set(live.map((i) => i.routeTarget)), kept);
  assert.equal(isPublished({ ...calendar.items[0], id: 'new-unreviewed-intent' }, '2099-01-01'), false);
  assert.equal(isPublished(calendar.items.find((i) => i.id === guides[0].id), '2000-01-01'), false);
  for (const item of live) {
    const guide = guides.find((g) => g.id === item.id);
    assert.equal(item.directAnswer, guide.definition);
    assert.equal(item.answerSurface.answer, guide.definition);
  }
  const source = fs.readFileSync('functions/_middleware.js', 'utf8').replace("import quality from '../data/seo/page_quality.json';", `const quality = ${JSON.stringify(pageQuality)};`);
  const { onRequest } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
  for (const [from, to] of Object.entries(pageQuality.redirects)) {
    assert.ok(from.startsWith('/blog/') || (from.startsWith('/questions/') && from !== '/questions/'));
    assert.ok(!routes.some((r) => r.path === from), `operational route cannot redirect: ${from}`);
    assert.ok(kept.has(to), `redirect must end at a kept guide: ${to}`);
    assert.ok(!pageQuality.redirects[to], 'redirect chains are forbidden');
    for (const host of ['detoxdenver.org', 'www.detoxdenver.org']) {
      for (const path of [from, from.replace(/\/$/, '')]) {
        const response = await onRequest({ request: new Request(`https://${host}${path}?source=test`), next: () => assert.fail('retired route fell through') });
        assert.equal(response.status, 301);
        assert.equal(response.headers.get('location'), `https://detoxdenver.org${to}?source=test`);
      }
    }
  }
  const pass = await onRequest({ request: new Request(`https://detoxdenver.org${guides[0].route}`), next: () => 'kept' });
  assert.equal(pass, 'kept');
  const sitemap = [...fs.readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const questions = liveQuestionPages().map((q) => q.route);
  for (const route of questions) assert.ok(!pageQuality.redirects[route], `${route} is live and redirected`);
  const expected = [...routes.filter((r) => !r.path.startsWith('/admin')).map((r) => r.path), ...kept, ...questions];
  assert.deepEqual(new Set(sitemap), new Set(expected));
  assert.equal(sitemap.length, expected.length);
  const feeds = JSON.parse(fs.readFileSync('public/answers.json', 'utf8')).answers;
  for (const answer of feeds) assert.ok(!pageQuality.redirects[answer.route], `retired route leaked into answers: ${answer.route}`);
  const admin = JSON.parse(fs.readFileSync('data/admin/content_manifest.json', 'utf8')).items;
  assert.equal(admin.length, calendar.items.length, 'admin must retain the complete internal archive');
  for (const item of admin) assert.ok(!pageQuality.redirects[item.previewPath], `admin preview points at retired route: ${item.id}`);
  const llms = fs.readFileSync('public/llms.txt', 'utf8');
  for (const from of Object.keys(pageQuality.redirects)) assert.ok(!llms.includes(from));
  for (const route of kept) {
    assert.ok(fs.existsSync(`out${route}index.html`), `kept page missing from build: ${route}`);
    assert.ok(llms.includes(route), `kept guide missing from llms.txt: ${route}`);
  }
  for (const from of Object.keys(pageQuality.redirects)) assert.ok(!fs.existsSync(`out${from}index.html`), `retired body still built: ${from}`);
});
