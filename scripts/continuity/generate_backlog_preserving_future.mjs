#!/usr/bin/env node
import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const p='data/content/content_calendar.json';let future=[];
if(fs.existsSync(p)){const before=JSON.parse(fs.readFileSync(p,'utf8'));future=(before.items||[]).filter(x=>x.scheduledAt>='2027-01-01');}
const r=spawnSync(process.execPath,['scripts/content/generate_backlog.mjs'],{stdio:'inherit',env:process.env});if(r.status!==0)process.exit(r.status||1);
const after=JSON.parse(fs.readFileSync(p,'utf8')),by=new Map((after.items||[]).map(x=>[x.id,x]));for(const item of future)by.set(item.id,item);after.items=[...by.values()].sort((a,b)=>a.scheduledAt.localeCompare(b.scheduledAt)||a.id.localeCompare(b.id));after.extensionStart=future.length?(after.extensionStart||future.map(x=>x.scheduledAt).sort()[0]):after.extensionStart;after.generatedAt=new Date().toISOString();fs.writeFileSync(p,JSON.stringify(after,null,2)+'\n');console.log(`[continuity:preserve] restored ${future.length} post-2026 records after native backlog generation`);
