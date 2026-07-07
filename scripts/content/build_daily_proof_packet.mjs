import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outJson = path.join(root, 'artifacts/validation/daily-proof-packet.json');
const outMd = path.join(root, 'reports/daily-proof-packet.md');
const packet = {
  generatedAt: new Date().toISOString(),
  mode: 'approved_backlog',
  strategyProfile: 'data/strategy/citation_strategy_profile.json',
  sourcesUsed: ['source_registry', 'claim_registry', 'content_calendar'],
  validatorsExpected: [
    'validate:content',
    'validate:licensure-mode',
    'validate:legal',
    'validate:repo'
  ],
  unproven: ['live deployment', 'real admin writes', 'Cloudflare Access configuration']
};

fs.writeFileSync(outJson, `${JSON.stringify(packet, null, 2)}\n`);
fs.writeFileSync(outMd, `# Daily Proof Packet\n\nMode: ${packet.mode}\n\nUnproven: ${packet.unproven.join(', ')}\n`);
console.log('[release:daily-proof] wrote proof packet');
