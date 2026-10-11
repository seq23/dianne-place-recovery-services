// Cloudflare Pages middleware: one host. www.detoxdenver.org 301s to the
// canonical origin in
// data/seo/site_identity.json, path and query kept.
const CANONICAL_HOST = 'detoxdenver.org';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
