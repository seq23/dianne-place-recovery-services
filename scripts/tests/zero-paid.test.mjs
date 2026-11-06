// Zero paid LLM spend (docs/cost/zero-paid-llm.md): the routing file allows no cost
// and only :free models, the search-loop engine is pointed at it, and nothing else
// in the repo calls a model endpoint directly.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const routing = JSON.parse(fs.readFileSync('config/llm_routing.json', 'utf8'));
const MODEL_ENDPOINT = /openrouter\.ai\/api|generativelanguage\.googleapis\.com|api\.openai\.com|api\.anthropic\.com|api\.cloudflare\.com\/client\/v4\/accounts\/[^/]+\/ai\/run|models\.github\.ai/;

export function routingProblems(r) {
  const out = [];
  if (r?.policy?.max_cost_usd !== 0) out.push(`max_cost_usd is ${r?.policy?.max_cost_usd}`);
  if (r?.policy?.fallback_to_paid !== false) out.push('fallback_to_paid is not false');
  const models = r?.free_models || [];
  if (!models.length) out.push('no models listed');
  for (const m of models) {
    if (!String(m.id).endsWith(':free')) out.push(`${m.id} is not a :free id`);
    if (String(m.pricing?.prompt) !== '0' || String(m.pricing?.completion) !== '0') out.push(`${m.id} is not priced $0/$0`);
  }
  return out;
}

function sourceFiles(dir = '.', out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', 'out', '.git', '.search-loop-engine', 'data', 'public', 'artifacts', 'reports'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) sourceFiles(p, out);
    else if (/\.(m?js|ts|tsx|sh|py)$/.test(e.name) && p !== path.join('scripts', 'tests', 'zero-paid.test.mjs')) out.push(p);
  }
  return out;
}

test('the routing file allows no cost and only :free models', () => {
  assert.deepEqual(routingProblems(routing), []);
  assert.ok(routing.policy.snapshot_date, 'routing file names its snapshot date');
});

test('the rule catches a paid model and a non-zero cost (negative proof)', () => {
  const paid = structuredClone(routing);
  paid.free_models.push({ id: 'openai/gpt-5', pricing: { prompt: '0.000002', completion: '0.00001' } });
  paid.policy.max_cost_usd = 5;
  assert.equal(routingProblems(paid).length, 3);
});

test('the search-loop engine is pointed at the routing file', () => {
  const cfg = JSON.parse(fs.readFileSync('search-loop.config.json', 'utf8'));
  assert.equal(cfg.llm?.routing_file, 'config/llm_routing.json');
});

test('no code in the repo calls a model endpoint directly', () => {
  const files = sourceFiles();
  assert.ok(files.length > 20, `only ${files.length} source files read`);
  const hits = files.filter((f) => MODEL_ENDPOINT.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(hits, []);
  assert.ok(MODEL_ENDPOINT.test('fetch("https://openrouter.ai/api/v1/chat/completions")'), 'the endpoint pattern must catch a direct call');
});
