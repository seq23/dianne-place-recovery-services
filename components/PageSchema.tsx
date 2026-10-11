import { SITE_ORIGIN, absoluteUrl, organizationId, websiteId } from '@/lib/seo';

type Crumb = { name: string; path: string };
type Faq = { question: string; answer: string };

type PageSchemaProps = {
  path: string;
  name: string;
  description: string;
  crumbs?: Crumb[];
  faq?: Faq[];
  speakableSelectors?: string[];
  pageType?: string;
};

// WebPage (+ BreadcrumbList on inner pages, + FAQPage only when the page renders
// the same questions visibly). Organization and WebSite nodes live in the root layout.
export function PageSchema({ path, name, description, crumbs, faq, speakableSelectors, pageType = 'WebPage' }: PageSchemaProps) {
  const url = absoluteUrl(path);
  const graph: Record<string, unknown>[] = [];
  const webPage: Record<string, unknown> = {
    '@type': pageType,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    inLanguage: 'en-US'
  };
  if (speakableSelectors?.length) {
    webPage.speakable = { '@type': 'SpeakableSpecification', cssSelector: speakableSelectors };
  }
  graph.push(webPage);

  if (path !== '/') {
    const trail = [{ name: 'Home', path: '/' }, ...(crumbs ?? []), { name, path }];
    const list = {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: trail.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${SITE_ORIGIN}${crumb.path}`
      }))
    };
    webPage.breadcrumb = { '@id': list['@id'] };
    graph.push(list);
  }

  if (faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
      }))
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
