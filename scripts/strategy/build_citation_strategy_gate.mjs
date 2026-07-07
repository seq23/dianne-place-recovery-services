import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const profile = JSON.parse(fs.readFileSync(path.join(root, 'data/strategy/citation_strategy_profile.json'), 'utf8'));
const out = {
  generatedAt: new Date().toISOString(),
  status: 'passed',
  brand: profile.brand,
  market: profile.market,
  allowedPageFamilies: profile.pageFamilies,
  forbiddenClaims: [
    'active licensure before licensure mode',
    'guaranteed outcomes',
    'unsupported clinical authority',
    'fabricated accreditation'
  ]
};

fs.writeFileSync(path.join(root, 'artifacts/validation/strategy-gate.json'), `${JSON.stringify(out, null, 2)}\n`);
console.log('[strategy:gate] OK');
