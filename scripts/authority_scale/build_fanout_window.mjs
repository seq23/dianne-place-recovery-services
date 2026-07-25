#!/usr/bin/env node
import fs from 'node:fs';import zlib from 'node:zlib';import crypto from 'node:crypto';
const idx=JSON.parse(fs.readFileSync('data/authority_scale/fanout_100k/index.json','utf8'));
const policy=JSON.parse(fs.readFileSync('data/authority_scale/velocity_policy.json','utf8'));
const size=Number(process.argv.find(x=>x.startsWith('--size='))?.split('=')[1]||policy.current_intelligence_window||2500);
const run=process.env.AUTHORITY_RUN_DATE||new Date().toISOString().slice(0,10);
const seed=parseInt(crypto.createHash('sha256').update(run).digest('hex').slice(0,12),16),all=[];
for(const sh of idx.shards){const txt=zlib.gunzipSync(fs.readFileSync(sh.path)).toString('utf8').trim();if(txt)for(const line of txt.split(/\n/))all.push(JSON.parse(line));}
const start=seed%all.length,stride=7919,out=[];for(let i=0;i<Math.min(size,all.length);i++)out.push(all[(start+i*stride)%all.length]);
fs.writeFileSync('data/authority_scale/operational_window.json',JSON.stringify({schema_version:'1.0',generated_for_date:run,window_size:out.length,total_runway:all.length,start_offset:start,stride,opportunities:out},null,2)+'\n');
console.log(`AUTHORITY WINDOW ${out.length}/${all.length}`);
