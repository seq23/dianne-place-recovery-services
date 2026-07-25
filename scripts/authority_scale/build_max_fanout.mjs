#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
const ROOT=process.cwd();
const CFG=JSON.parse(fs.readFileSync('data/authority_scale/authority_config.json','utf8'));
const sha=(v)=>crypto.createHash('sha256').update(Buffer.isBuffer(v)?v:Buffer.from(String(v))).digest('hex');
const clean=(v)=>String(v||'').replace(/\s+/g,' ').trim();
const read=(p,f)=>{try{return JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));}catch{return f;}};
const topics=[];
for(const x of read('data/content/content_calendar.json',{items:[]}).items||[]) topics.push(x.title,x.answerSurface?.question,x.theme);
for(const x of read('data/seo/query_matrix.json',{queryFamilies:[]}).queryFamilies||[]) topics.push(x.intent,...(x.queries||[]));
for(const x of read('data/aeo/answer_surface_registry.json',{answerBlocks:[]}).answerBlocks||[]) topics.push(x.question);
for(const x of read('data/routing/route_registry.json',{routes:[]}).routes||[]) topics.push(`${x.citationRole} ${x.family}`);
const seed=[...new Set(topics.map(clean).filter(x=>x.length>=12))].slice(0,CFG.max_seed_topics||500);
if(!seed.length) throw new Error('No authority seed topics found');
const dims=['intent_patterns','audiences','contexts','formats','decision_stages'];
for(const d of dims) if(!Array.isArray(CFG[d])||!CFG[d].length) throw new Error(`Missing ${d}`);
const cap=BigInt(seed.length)*dims.reduce((n,d)=>n*BigInt(CFG[d].length),1n);
const target=Number(process.argv.find(x=>x.startsWith('--target='))?.split('=')[1]||100000);
if(cap<BigInt(target)) throw new Error(`capacity ${cap}<${target}`);
const OUT='data/authority_scale/fanout_100k'; fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
function comboAt(n){let x=BigInt(n);const o={topic:seed[Number(x%BigInt(seed.length))]};x/=BigInt(seed.length);for(const d of dims){const a=CFG[d];o[d]=a[Number(x%BigInt(a.length))];x/=BigInt(a.length);}return o;}
const query=(c)=>clean(`${c.intent_patterns.replaceAll('{topic}',c.topic)} ${c.contexts} for ${c.audiences} ${c.decision_stages}`);
const STEP=104729n,seen=new Set(),shards=[];let rows=[],cursor=0,produced=0;const SHARD=5000;
function flush(){if(!rows.length)return;const n=shards.length+1,fn=`part-${String(n).padStart(5,'0')}.jsonl.gz`;const raw=Buffer.from(rows.map(JSON.stringify).join('\n')+'\n');const gz=zlib.gzipSync(raw,{level:9,mtime:0});fs.writeFileSync(path.join(OUT,fn),gz);shards.push({part:n,path:`${OUT}/${fn}`,record_count:rows.length,sha256:sha(gz),first_id:rows[0].opportunity_id,last_id:rows.at(-1).opportunity_id});rows=[];}
while(produced<target){if(BigInt(cursor)>=cap)throw new Error(`exhausted at ${produced}`);const c=comboAt((BigInt(cursor++)*STEP)%cap),q=query(c);if(seen.has(q))continue;seen.add(q);rows.push({opportunity_id:`dprs_fanout_${String(produced+1).padStart(6,'0')}_${sha(q).slice(0,10)}`,query:q,topic:c.topic,intent:c.intent_patterns,audience:c.audiences,context:c.contexts,recommended_format:c.formats,decision_stage:c.decision_stages,disposition:'OPPORTUNITY_ONLY',editorial_authority:'EXISTING_DIANNE_VALIDATED_PUBLISHING_SYSTEM_ONLY',medical_boundary:'NO_DIAGNOSIS_TREATMENT_OR_OUTCOME_PROMISES',service_area_boundary:'NON_LOCALIZED_UNTIL_APPROVED',source:'deterministic_authority_fanout_v1'});produced++;if(rows.length>=SHARD)flush();}
flush();
const aggregate=sha(shards.map(s=>`${s.part}:${s.record_count}:${s.sha256}`).join('\n'));
fs.writeFileSync(path.join(OUT,'index.json'),JSON.stringify({schema_version:'1.0',repo_id:CFG.repo_id,generated_at:'2026-07-25T00:00:00.000Z',materialized_reference_runway:target,theoretical_combinations:cap.toString(),page_quota:false,publication_authority:'EXISTING_DIANNE_VALIDATED_PUBLISHING_SYSTEM',compression:'gzip_jsonl',shard_count:shards.length,aggregate_sha256:aggregate,shards},null,2)+'\n');
console.log(`AUTHORITY FANOUT BUILT ${produced} / ${shards.length} shards / capacity ${cap}`);
