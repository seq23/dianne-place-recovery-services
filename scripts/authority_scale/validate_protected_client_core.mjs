#!/usr/bin/env node
import fs from 'node:fs';import crypto from 'node:crypto';
const sha=(b)=>crypto.createHash('sha256').update(b).digest('hex');
const core=JSON.parse(fs.readFileSync('data/protected_core/protected_client_core.json','utf8')),state=JSON.parse(fs.readFileSync('data/protected_core/protected_editorial_state.json','utf8')),errors=[];
for(const f of core.files){if(!fs.existsSync(f.path)){errors.push(`missing:${f.path}`);continue;}if(sha(fs.readFileSync(f.path))!==f.sha256)errors.push(`client-core-drift:${f.path}`);}
const cal=JSON.parse(fs.readFileSync('data/content/content_calendar.json','utf8')),by=new Map((cal.items||[]).map(x=>[x.id,x])),fields=state.immutable_fields||[];
for(const rec of state.records||[]){const item=by.get(rec.id);if(!item){errors.push(`missing-baseline-record:${rec.id}`);continue;}const obj={};for(const k of fields)obj[k]=item[k]??null;const h=sha(Buffer.from(JSON.stringify(obj,Object.keys(obj).sort())));if(h!==rec.sha256)errors.push(`baseline-identity-drift:${rec.id}`);}
for(const item of cal.items||[]){if(item.scheduledAt<='2026-12-31'&&!state.records.some(x=>x.id===item.id))errors.push(`unauthorized-pre2027-record:${item.id}`);}
console.log(JSON.stringify({ok:!errors.length,protected_files:core.files.length,baseline_editorial_records:state.baseline_count,current_editorial_records:(cal.items||[]).length,policy:core.policy,errors:errors.slice(0,30)},null,2));if(errors.length)process.exit(1);
