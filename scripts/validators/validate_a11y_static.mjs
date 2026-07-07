import { assert, readText } from './lib.mjs';

const css = readText('app/globals.css');
const layout = readText('app/layout.tsx');
const cookie = readText('components/CookieConsent.tsx');
const contact = readText('app/contact/page.tsx');

assert(css.includes('prefers-reduced-motion'), 'Animated hero must respect prefers-reduced-motion');
assert(css.includes(':focus-visible'), 'Focus-visible styles are required');
assert(layout.includes('application/ld+json'), 'Structured data script is required');
assert(cookie.includes('aria-label="Cookie preference banner"'), 'Cookie banner needs aria-label');
assert(cookie.includes('Save Preferences'), 'Cookie banner must include Save Preferences');
assert(contact.includes('aria-label="General contact form"'), 'Contact form needs aria-label');
assert(contact.includes('I consent'), 'Contact form needs consent checkbox text');

console.log('[validate:a11y-static] OK');
