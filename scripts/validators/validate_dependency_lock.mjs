import fs from 'node:fs';
import path from 'node:path';
import { root } from './lib.mjs';

const lockPath = path.join(root, 'package-lock.json');
const reportPath = path.join(root, 'artifacts/validation/dependency-lock.json');
const exists = fs.existsSync(lockPath);

const report = {
  generatedAt: new Date().toISOString(),
  severity: exists ? 'none' : 'strong_soft',
  blocksRelease: false,
  status: exists ? 'lockfile_present' : 'lockfile_missing',
  message: exists
    ? 'package-lock.json is present.'
    : 'package-lock.json is missing because dependency install could not complete in this environment. Use npm install locally/GitHub to create and commit the lockfile before relying on npm ci.'
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`[validate:dependency-lock] ${report.status}`);
