import answerFeed from '@/public/answers.json';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: 'Answers'
};

type Answer = {
  id: string;
  question: string;
  answer: string;
  route: string;
  sourceIds?: string[];
};

export default function AnswersPage() {
  const answers = (answerFeed.answers as Answer[]).slice(0, 40);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answers.slice(0, 20).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <main>
      <PageHero
        eyebrow="Direct answer hub"
        title="Short, citable answers for recovery housing and support."
        body="These answer blocks are structured for people, search engines, and LLM answer systems while staying inside Dianne's Place service and licensure boundaries."
      />
      <section className="content-section">
        <div className="card-grid">
          {answers.map((item) => (
            <article className="card" key={item.id}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
              <p className="small-note">Canonical route: {item.route}</p>
            </article>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
