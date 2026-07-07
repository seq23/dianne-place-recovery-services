import { notFound } from 'next/navigation';
import calendar from '@/data/content/content_calendar.json';
import { DisclaimerBox } from '@/components/DisclaimerBox';

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  scheduledAt: string;
  contentType: string;
  audience: string;
  summary: string;
  directAnswer: string;
  bodyOutline: string[];
  answerSurface: {
    question: string;
    answer: string;
  };
  sourceIds: string[];
};

const items = calendar.items as ContentItem[];

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = items.find((entry) => entry.slug === params.slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.directAnswer
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const item = items.find((entry) => entry.slug === params.slug);
  if (!item) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    datePublished: item.scheduledAt,
    about: item.audience,
    description: item.directAnswer,
    isAccessibleForFree: true
  };

  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">{item.contentType.replace(/_/g, ' ')} · {item.scheduledAt}</p>
        <h1>{item.title}</h1>
        <p>{item.directAnswer}</p>
      </section>
      <section className="content-section">
        <article>
          <h2>{item.answerSurface.question}</h2>
          <p>{item.answerSurface.answer}</p>
          <h2>What this resource covers</h2>
          <ul>
            {item.bodyOutline.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="small-note">
            Audience: {item.audience}. Source references: {item.sourceIds.join(', ') || 'none required for this general support topic'}.
          </p>
        </article>
        <DisclaimerBox />
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
