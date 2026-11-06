# Zero paid LLM spend

**Nothing paid.** No model call from this repo may cost money (owner, 11 Oct 2026: "nothing should be paid").

## Where the rule lives in code
- `config/llm_routing.json` — the only model list: `policy.max_cost_usd: 0`, `fallback_to_paid: false`, every model id ends in `:free` and is priced $0/$0, with the snapshot date and source.
- `search-loop.config.json` → `llm.routing_file` points the shared search-loop engine (seq23/search-loop `src/llm.mjs`) at that file. The engine fails loud unless the policy is $0 and every model is priced $0/$0; its other lanes are the Gemini free tier and a metered share of the free Workers AI allowance. There is no paid lane: when every free lane is out, the run notes `NO_FREE_MODEL` and the search waits.
- The engine is the only door. No other script, page or function in this repo calls a model endpoint.

## The guard
`scripts/tests/zero-paid.test.mjs` (CI, `npm run test:zero-paid`) fails when the routing file allows any cost or a non-`:free` model, when the search-loop config stops pointing at it, or when any file in the repo calls a model endpoint directly.

## Changing models
Refresh the list from https://openrouter.ai/api/v1/models (prompt and completion both "0"), keep only `:free` ids, update `snapshot_date`. Never add a paid model, a paid fallback or a paid API key (the paid OpenAI/Anthropic APIs are out).
