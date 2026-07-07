import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredDirs = ['artifacts/validation', 'reports', 'data/content'];
for (const dir of requiredDirs) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

const summary = {
  generatedAt: new Date().toISOString(),
  repairs: requiredDirs.map((dir) => ({ path: dir, action: 'ensure_dir' })),
  forbiddenRepairsSkipped: ['licensure mode switch', 'legal policy rewrite', 'tracking enablement']
};

fs.writeFileSync(path.join(root, 'artifacts/validation/self-heal.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log('[release:self-heal] OK');
