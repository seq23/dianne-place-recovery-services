#!/usr/bin/env node
import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync('data/authority_scale/kpi_truth_contract.json','utf8')),l=JSON.parse(fs.readFileSync('data/authority_scale/observed_surfacing_ledger.json','utf8')),idx=JSON.parse(fs.readFileSync('data/authority_scale/fanout_100k/index.json','utf8')),cal=JSON.parse(fs.readFileSync('data/content/content_calendar.json','utf8'));
const events=l.events||[],counts={};for(const e of events)counts[e.metric]=(counts[e.metric]||0)+1;
const verified=counts.verified_citation||0,published=(cal.items||[]).filter(x=>x.status==='published').length,approved=(cal.items||[]).filter(x=>x.status==='approved').length;
const out={schema_version:'1.0',generated_at:'2026-07-25T00:00:00.000Z',target_verified_external_citations:c.target.verified_external_citations,target_window_days:c.target.window_days,guarantee:false,fanout_opportunities:idx.materialized_reference_runway,approved_content:approved,published_content:published,observed_counts:counts,verified_external_citations:verified,remaining_to_target:Math.max(0,c.target.verified_external_citations-verified),truth_boundary:'No unobserved indexing, LLM surfacing, external reference, or citation is counted.'};
fs.writeFileSync('data/authority_scale/citation_scoreboard.json',JSON.stringify(out,null,2)+'\n');console.log(`CITATION SCOREBOARD verified=${verified}`);
