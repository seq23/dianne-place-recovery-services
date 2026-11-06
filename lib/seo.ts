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

// The search result line: the page's own words first, the short brand once, and
// never past TITLE_MAX characters. A title that already names Dianne's Place, or
// would run long with the suffix, stands alone. (Search Readiness b1: 30-65.)
export const TITLE_SUFFIX = " | Dianne's Place";
export const TITLE_MAX = 65;
export function documentTitle(title: string, absoluteTitle?: boolean) {
  if (absoluteTitle || /Dianne['’]s Place/.test(title)) return title;
  return (title + TITLE_SUFFIX).length <= TITLE_MAX ? title + TITLE_SUFFIX : title;
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
