import quality from '../data/seo/page_quality.json';
const CANONICAL_HOST = 'detoxdenver.org';
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const normalized = `${url.pathname.replace(/\/+$/, '')}/`;
  const destination = quality.redirects[normalized];
  if (destination || url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    if (destination) url.pathname = destination;
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
