import crypto from 'node:crypto';

const b64url = (value) => Buffer.from(value).toString('base64url');

// Service-account JWT -> access token, no SDK. Scope "webmasters" covers
// searchanalytics, sitemaps (list + submit) and URL Inspection.
export async function googleToken(serviceAccountJson, scope = 'https://www.googleapis.com/auth/webmasters') {
  const sa = JSON.parse(serviceAccountJson);
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss: sa.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const assertion = `${header}.${claims}.${signer.sign(sa.private_key, 'base64url')}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  if (!response.ok) throw new Error(`Google OAuth token request failed: HTTP ${response.status}`);
  return { token: (await response.json()).access_token, clientEmail: sa.client_email };
}
