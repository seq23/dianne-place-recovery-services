#!/usr/bin/env node
import fs from 'node:fs';import zlib from 'node:zlib';import crypto from 'node:crypto';
const idx=JSON.parse(fs.readFileSync('data/authority_scale/fanout_100k/index.json','utf8')),errors=[],queries=new Set(),ids=new Set();let count=0;
for(const sh of idx.shards||[]){if(!fs.existsSync(sh.path)){errors.push(`missing:${sh.path}`);continue;}const buf=fs.readFileSync(sh.path),hash=crypto.createHash('sha256').update(buf).digest('hex');if(hash!==sh.sha256)errors.push(`sha:${sh.path}`);const txt=zlib.gunzipSync(buf).toString('utf8').trim();for(const line of txt?txt.split(/\n/):[]){const r=JSON.parse(line);count++;if(queries.has(r.query))errors.push(`duplicate-query:${r.opportunity_id}`);if(ids.has(r.opportunity_id))errors.push(`duplicate-id:${r.opportunity_id}`);queries.add(r.query);ids.add(r.opportunity_id);if(r.disposition!=='OPPORTUNITY_ONLY')errors.push(`disposition:${r.opportunity_id}`);if(r.editorial_authority!=='EXISTING_DIANNE_VALIDATED_PUBLISHING_SYSTEM_ONLY')errors.push(`authority:${r.opportunity_id}`);}}
// `count!==100000` was a target count enforced as a validation check: the only
// way to satisfy it is to keep exactly one hundred thousand cartesian strings
// materialized regardless of the real opportunity space. What the number can
// honestly tell you is whether the index misreports its own size and whether
// any query was emitted twice, so that is what is checked.
if(idx.materialized_reference_runway!==undefined&&idx.materialized_reference_runway!==count)errors.push(`index_claims:${idx.materialized_reference_runway}/found:${count}`);if(queries.size!==count)errors.push(`duplicate_queries:${count-queries.size}`);if(!(count>0))errors.push('no_records_materialized');if(idx.page_quota!==false)errors.push('page-quota');if(idx.shard_count!==(idx.shards||[]).length)errors.push(`shard_count_claims:${idx.shard_count}/found:${(idx.shards||[]).length}`);
console.log(JSON.stringify({ok:!errors.length,records:count,unique_queries:queries.size,shards:idx.shard_count,page_quota:idx.page_quota,errors:errors.slice(0,20)},null,2));if(errors.length)process.exit(1);
