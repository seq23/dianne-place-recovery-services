import fs from 'node:fs';
import path from 'node:path';

export const root = process.cwd();

export function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

export function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

export function listFiles(dir, acc = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return acc;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(rel, acc);
    else acc.push(rel);
  }
  return acc;
}

// Owner ruling 2 Nov 2026 (no petty validation): a length or word count OVER its
// ceiling never fails (a note at most); one UNDER its floor fails only below 75%
// of it. Every validator reads this helper instead of its own numbers.
export const FLOOR_SLACK = 0.75;
export const failsFloor = (n, min) => !(Number(n) >= Math.ceil(min * FLOOR_SLACK));
export function note(message) {
  console.warn(`[note] ${message}`);
}
