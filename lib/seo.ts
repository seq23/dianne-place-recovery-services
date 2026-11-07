import type { Metadata } from 'next';
import identity from '@/data/seo/site_identity.json';
import pageSeo from '@/data/seo/page_seo.json';
import answerRegistry from '@/data/aeo/answer_surface_registry.json';
import entity from '@/config/entity.json';

// One origin for every absolute URL the site emits. See data/seo/site_identity.json
// for why this is detoxdenver.org and not the separate Webador site.
export const SITE_ORIGIN = identity.origin;
export const siteIdentity = identity;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export const ogImage = {
  url: absoluteUrl(identity.ogImage.path),
  width: identity.ogImage.width,
  height: identity.ogImage.height,
  alt: identity.ogImage.alt
};

type PageMetaInput = { path: string; title: string; description: string; absoluteTitle?: boolean };

// The search result line: the page's own words first, then the site's full name
// once, never past TITLE_MAX characters (Search Readiness b1: 30-65; b10: every
// title names the site, and the audit only counts the full name or the host).
// A title that already carries the full name stands alone; one too long for the
// suffix has its subject cut at a word boundary so the name always fits.
export const SITE_NAME = identity.name;
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;
export const TITLE_MAX = 65;
const DANGLING = new Set('a an the and or but of to in on at by for with from your how why what when is are'.split(' '));
export function documentTitle(title: string, absoluteTitle?: boolean) {
  const named = title.replace(/[’]/g, "'").includes(SITE_NAME);
  if (named && (absoluteTitle || title.length <= TITLE_MAX)) return title;
  if ((title + TITLE_SUFFIX).length <= TITLE_MAX) return title + TITLE_SUFFIX;
  const room = TITLE_MAX - TITLE_SUFFIX.length;
  const words = title.slice(0, room + 1).replace(/\s+\S*$/, '').replace(/[\s,;:—-]+$/, '').split(/\s+/);
  while (words.length > 1 && DANGLING.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(' ') + TITLE_SUFFIX;
}

// Every public page builds its metadata here so canonical, og:url, og:image and
// twitter:image cannot drift apart page by page.
export function pageMetadata({ path, title, description, absoluteTitle }: PageMetaInput): Metadata {
  return {
    title: { absolute: documentTitle(title, absoluteTitle) },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: identity.name,
      type: 'website',
      locale: 'en_US',
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url]
    }
  };
}

export const organizationId = `${SITE_ORIGIN}/#organization`;
export const websiteId = `${SITE_ORIGIN}/#website`;

// Name, url, logo and sameAs come from config/entity.json, the one identity record
// the weekly entity watch also reads, so every Organization node on every page
// (the layout's, and a post's author) says the same thing.
export function organizationRef() {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: entity.name,
    url: `${SITE_ORIGIN}/`,
    logo: absoluteUrl('/icon-512.png'),
    sameAs: entity.sameAs
  };
}

export function organizationSchema() {
  const lb = identity.localBusiness;
  const org: Record<string, unknown> = {
    '@type': lb.schemaType,
    '@id': organizationId,
    name: identity.legalName,
    alternateName: identity.name,
    url: `${SITE_ORIGIN}/`,
    telephone: identity.phoneE164,
    email: identity.email,
    image: ogImage.url,
    logo: absoluteUrl('/icon-512.png'),
    sameAs: entity.sameAs,
    description:
      'Recovery housing, structured sober living, referral support, and recovery resources with services in development.'
  };
  if (lb.address) org.address = lb.address;
  if (lb.geo) org.geo = lb.geo;
  if (lb.openingHours) org.openingHours = lb.openingHours;
  if (lb.areaServed) org.areaServed = lb.areaServed;
  if (identity.googleBusinessProfile.found && identity.googleBusinessProfile.mapsCid) {
    org.hasMap = `https://maps.google.com/?cid=${identity.googleBusinessProfile.mapsCid}`;
  }
  return org;
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${SITE_ORIGIN}/`,
    name: identity.name,
    publisher: { '@id': organizationId },
    inLanguage: 'en-US'
  };
}


type PageSeo = { title: string; name: string; description: string; absoluteTitle?: boolean };
const pages = pageSeo.pages as Record<string, PageSeo>;

function entry(path: string): PageSeo {
  const page = pages[path];
  if (!page) throw new Error(`data/seo/page_seo.json has no entry for ${path}`);
  return page;
}

export function seoFor(path: string): Metadata {
  const page = entry(path);
  return pageMetadata({ path, title: page.title, description: page.description, absoluteTitle: page.absoluteTitle });
}

// The answer blocks a route renders visibly; the same list feeds its FAQPage node,
// so structured Q&A can never claim questions the page does not show.
export function faqFor(path: string) {
  return answerRegistry.answerBlocks
    .filter((block) => block.targetRoutes.includes(path))
    .map((block) => ({ question: block.question, answer: block.answer }));
}

export function schemaFor(path: string) {
  const page = entry(path);
  const faq = faqFor(path);
  return { path, name: page.name, description: page.description, faq: faq.length ? faq : undefined };
}

// Owner ruling 6 Nov 2026: Dianne's pricing is not known, so the site says
// "contact us for current rates" and the Offer carries no price fields - never a
// number. Rendered on the homepage and /recovery-housing/, which both say so
// visibly (Search Readiness c3 price-on-request Offer).
export function recoveryHousingService() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl('/recovery-housing/')}#service`,
    name: 'Recovery housing and structured sober living',
    serviceType: 'Recovery housing',
    url: absoluteUrl('/recovery-housing/'),
    provider: { '@id': organizationId },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl('/contact/'),
      description: 'Contact us for current pricing'
    }
  };
}
