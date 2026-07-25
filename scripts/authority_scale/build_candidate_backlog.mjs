#!/usr/bin/env node
import fs from 'node:fs';
const w=JSON.parse(fs.readFileSync('data/authority_scale/operational_window.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('data/admin/content_manifest.json','utf8'));
const routes=JSON.parse(fs.readFileSync('data/routing/route_registry.json','utf8'));
function tokens(s){return new Set(String(s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(x=>x.length>3));}
function sim(a,b){const A=tokens(a),B=tokens(b);let n=0;for(const x of A)if(B.has(x))n++;return n/Math.max(1,new Set([...A,...B]).size);}
const existing=[...(manifest.items||[]).map(x=>({route:x.publicPath,text:`${x.title} ${x.contentType} ${x.track||''} ${x.audience||''}`})),...(routes.routes||[]).map(x=>({route:x.path,text:`${x.family} ${x.citationRole}`}))];
const cand=[];
for(const o of w.opportunities){let best={s:0,route:null};for(const e of existing){const s=sim(`${o.topic} ${o.query}`,e.text);if(s>best.s)best={s,route:e.route};}
 const action=best.s>=0.17?'IMPROVE_EXISTING':'EDITORIAL_OPPORTUNITY';
 cand.push({...o,priority_score:Number(((['comparison','decision_matrix','checklist','framework'].includes(o.recommended_format)?20:12)+(o.decision_stage.includes('before')||o.decision_stage.includes('deciding')?15:8)+(best.s*40)).toFixed(2)),best_existing_route:best.route,best_existing_similarity:Number(best.s.toFixed(4)),recommended_action:action,publication_status:'NOT_PUBLISHED',approval_status:'NOT_SUBMITTED',clinical_claim_authority:'NONE'});
}
cand.sort((a,b)=>b.priority_score-a.priority_score||a.query.localeCompare(b.query));const out=[],seen=new Set();
for(const x of cand){const k=`${x.topic}|${x.recommended_format}|${x.audience}|${x.decision_stage}`;if(seen.has(k))continue;seen.add(k);out.push(x);if(out.length>=250)break;}
fs.writeFileSync('data/authority_scale/candidate_backlog.json',JSON.stringify({schema_version:'1.0',generated_for_date:w.generated_for_date,candidate_count:out.length,publication_law:'Recommendations only. Existing Dianne validation, status, schedule, and publication system remain authoritative.',candidates:out},null,2)+'\n');
console.log(`AUTHORITY CANDIDATES ${out.length}; improve=${out.filter(x=>x.recommended_action==='IMPROVE_EXISTING').length}; editorial=${out.filter(x=>x.recommended_action==='EDITORIAL_OPPORTUNITY').length}`);
