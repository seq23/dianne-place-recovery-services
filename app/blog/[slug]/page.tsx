import { notFound } from 'next/navigation';
import calendar from '@/data/content/content_calendar.json';
import quality from '@/data/seo/page_quality.json';
import { DisclaimerBox } from '@/components/DisclaimerBox';
import { PageSchema } from '@/components/PageSchema';
import { absoluteUrl, organizationId, pageMetadata } from '@/lib/seo';
import { publishedItems, resolveReleaseDate } from '../../../lib/publication.mjs';

const items = publishedItems(calendar.items, resolveReleaseDate()) as typeof calendar.items;
export function generateStaticParams() { return items.map((item) => ({ slug: item.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = items.find((entry) => entry.slug === params.slug);
  if (!item) return {};
  return pageMetadata({ path: item.routeTarget, title: item.title, description: item.directAnswer });
}
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const item = items.find((entry) => entry.slug === params.slug);
  const guide = quality.guides.find((entry) => entry.id === item?.id);
  if (!item || !guide) notFound();
  const schema = {
    '@context': 'https://schema.org', '@type': 'Article',
    '@id': `${absoluteUrl(item.routeTarget)}#article`,
    mainEntityOfPage: { '@id': `${absoluteUrl(item.routeTarget)}#webpage` },
    url: absoluteUrl(item.routeTarget), headline: item.title,
    author: { '@type': 'Organization', '@id': organizationId, name: "Dianne's Place Recovery Services" },
    publisher: { '@id': organizationId }, image: absoluteUrl('/og-image.png'),
    datePublished: item.scheduledAt, dateModified: guide.updatedAt,
    description: guide.definition, isAccessibleForFree: true
  };
  return <main>
    <section className="page-hero">
      <h1>{item.title}</h1>
      <p className="definition" id="definition">{guide.definition}</p>
      <p>Published by Dianne’s Place Recovery Services · <time dateTime={item.scheduledAt}>{item.scheduledAt}</time> · Updated <time dateTime={guide.updatedAt}>{guide.updatedAt}</time></p>
    </section>
    <section className="content-section">
      <article className="post-body">
        {guide.sections.map((section) => <section className="post-section" key={section.heading}>
          <h2>{section.heading}</h2><p>{section.body}</p>
        </section>)}
        <h2>What can you check now?</h2>
        <ul>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ul>
        <h2>What else should you know?</h2>
        {guide.faq.map((faq) => <section key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></section>)}
        <h2>Which sources explain recovery housing?</h2>
        <p>These planning questions are educational, not medical advice. For background, see:</p>
        <ul>
          <li><a href="https://library.samhsa.gov/sites/default/files/pep23-10-00-002.pdf">SAMHSA: Best Practices for Recovery Housing</a>.</li>
          <li><a href="https://988lifeline.org/">988 Suicide &amp; Crisis Lifeline</a> — call or text 988 for crisis support; call 911 for immediate danger.</li>
        </ul>
        <aside className="soft-panel">
          <h2>What is the next step?</h2>
          <p>{guide.nextStep}</p><a href="/contact/">Ask Dianne’s Place a non-emergency question</a>
        </aside>
      </article>
      <DisclaimerBox />
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <PageSchema path={item.routeTarget} name={item.title} description={guide.definition} crumbs={[{ name: 'Blog', path: '/blog/' }]} faq={guide.faq} />
  </main>;
}
