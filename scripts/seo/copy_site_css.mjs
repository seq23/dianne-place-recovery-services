// The static /questions/ pages the search-loop engine writes into public/questions/
// are plain HTML outside the Next app, so they cannot use Next's hashed CSS
// bundle. They link /assets/site.css (search-loop.config.json template.stylesheets);
// this copies the one stylesheet there at build time so the two never drift.
import fs from 'node:fs';
fs.mkdirSync('public/assets', { recursive: true });
fs.copyFileSync('app/globals.css', 'public/assets/site.css');
console.log('[seo:site-css] public/assets/site.css copied from app/globals.css');
