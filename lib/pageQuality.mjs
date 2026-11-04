import fs from 'node:fs';
// Explicit reviewed inventory: neither dates nor an approved template create a new public intent.
export const pageQuality = JSON.parse(fs.readFileSync(`${process.cwd()}/data/seo/page_quality.json`, 'utf8'));
export function reviewedGuide(item) {
  return pageQuality.guides.find((guide) => guide.id === item?.id && guide.route === item?.routeTarget);
}
