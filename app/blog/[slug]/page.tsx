import { notFound } from 'next/navigation';
import calendar from '@/data/content/content_calendar.json';
import { DisclaimerBox } from '@/components/DisclaimerBox';

type ContentItem = {
  id: string;
  status: string;
  title: string;
  slug: string;
  scheduledAt: string;
  contentType: string;
  audience: string;
  summary: string;
  directAnswer: string;
  bodyOutline: string[];
  dek: string;
  humanizedIntro: string;
  sections: { heading: string; body: string }[];
  keyTakeaways: string[];
  practicalNextSteps: string[];
  reflectionPrompt: string;
  faq: { question: string; answer: string }[];
  atomBlocks: { id: string; label: string; text: string }[];
  internalLinks: { label: string; href: string }[];
  disclaimerBlock: string;
  wordTarget: number;
  contentPromise: string;
  answerSurface: {
    question: string;
    answer: string;
  };
  sourceIds: string[];
};

const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
const items = (calendar.items as ContentItem[]).filter((item) => item.status === 'approved' && item.scheduledAt <= releaseDate);

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
        <p className="eyebrow">{item.scheduledAt}</p>
        <h1>{item.title}</h1>
        <p>{item.dek || item.directAnswer}</p>
      </section>
      <section className="content-section">
        <article className="post-body">
          <p className="lede">{item.humanizedIntro}</p>
          <h2>{item.answerSurface.question}</h2>
          <p>{item.answerSurface.answer}</p>
          <h2>Key takeaways</h2>
          <ul>
            {item.keyTakeaways.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {item.sections.map((section) => (
            <section key={section.heading} className="post-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <h2>Practical next steps</h2>
          <ol>
            {item.practicalNextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <aside className="soft-panel">
            <h2>Reflection prompt</h2>
            <p>{item.reflectionPrompt}</p>
          </aside>
          <h2>Recovery support atoms</h2>
          <div className="atom-grid">
            {item.atomBlocks.map((atom) => (
              <article className="atom-card" key={atom.id}>
                <h3>{atom.label}</h3>
                <p>{atom.text}</p>
              </article>
            ))}
          </div>
          <h2>Frequently asked questions</h2>
          {item.faq.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
          <h2>Related next steps</h2>
          <div className="button-row">
            {item.internalLinks.map((link) => (
              <a className="button secondary" href={link.href} key={link.href}>{link.label}</a>
            ))}
          </div>
          <aside className="disclaimer-box">
            <strong>Content disclaimer:</strong> {item.disclaimerBlock}
          </aside>
        </article>
        <DisclaimerBox />
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
