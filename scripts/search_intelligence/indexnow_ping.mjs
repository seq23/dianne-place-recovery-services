#!/usr/bin/env node
// IndexNow ping for every sitemap URL, after the deploy is live: waits (bounded)
// until the live key file answers 200 and the live sitemap matches the committed
// one, then submits. Key and host come from data/seo/indexnow.json.
import fs from 'node:fs';

const cfg = JSON.parse(fs.readFileSync('data/seo/indexnow.json', 'utf8'));
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))].filter((u) => new URL(u).host === cfg.host);
if (!urls.length) throw new Error(`No sitemap URLs on ${cfg.host}`);
const deadline = Date.now() + Number(process.env.INDEXNOW_WAIT_MS || 600000);
const bust = () => `?t=${Date.now()}`;
for (;;) {
  const [key, live] = await Promise.all([
    fetch(cfg.keyLocation + bust()).then(async (r) => (r.ok ? (await r.text()).trim() : '')).catch(() => ''),
    fetch(`https://${cfg.host}/sitemap.xml${bust()}`).then((r) => (r.ok ? r.text() : '')).catch(() => '')
  ]);
  if (key === cfg.key && live.trim() === xml.trim()) break;
  if (Date.now() > deadline) {
    console.error(`[indexnow] deploy not live within wait (key ok: ${key === cfg.key}, sitemap match: ${live.trim() === xml.trim()})`);
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 20000));
}
const response = await fetch(cfg.endpoint, {
  method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: cfg.host, key: cfg.key, keyLocation: cfg.keyLocation, urlList: urls })
});
console.log(`[indexnow] submitted ${urls.length} URLs for ${cfg.host}: HTTP ${response.status}`);
if (![200, 202].includes(response.status)) process.exit(1);
