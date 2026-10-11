// IndexNow: key file served from public/, host = canonical host, ping wired post-deploy.
import { assert, fileExists, readJson, readText } from './lib.mjs';

const cfg = readJson('data/seo/indexnow.json');
const origin = readJson('data/seo/site_identity.json').origin;
assert(/^[a-f0-9]{32}$/.test(cfg.key), 'IndexNow key must be 32 hex chars');
assert(cfg.host === new URL(origin).host, `IndexNow host ${cfg.host} must equal the canonical host`);
assert(cfg.keyLocation === `${origin}/${cfg.key}.txt`, 'IndexNow keyLocation must be <origin>/<key>.txt');
assert(fileExists(`public/${cfg.key}.txt`), `public/${cfg.key}.txt missing`);
assert(readText(`public/${cfg.key}.txt`).trim() === cfg.key, 'IndexNow key file content must equal the key');
assert(readText('.github/workflows/search_intelligence.yml').includes('indexnow_ping.mjs'), 'search_intelligence workflow must run the IndexNow ping');
console.log(`[validate:indexnow] OK: key file for ${cfg.host}`);
