import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { PageSchema } from '@/components/PageSchema';
import { schemaFor, seoFor } from '@/lib/seo';
import { liveQuestionPages } from '@/lib/searchLoopPages.mjs';

export const metadata = seoFor('/questions/');

type QuestionPage = { slug: string; route: string; title: string; publishedAt: string };

// The hub for the question pages the search-loop engine publishes into
// public/questions/ (search-loop.config.json). Every live page is listed here,
// so none is an orphan; the list comes from the engine's ledger at build time.
export default function QuestionsPage() {
  const pages = liveQuestionPages() as QuestionPage[];
  return (
    <main>
      <PageHero
        eyebrow="Recovery questions"
        title="Plain answers to common recovery housing questions."
        body="General recovery-support education from Dianne's Place. It is not medical advice and not a promise of availability or outcomes. Call 911 for immediate danger, or call or text 988 for crisis support."
      />
      <section className="content-section">
        {pages.length ? (
          <ul className="question-list">
            {pages.map((page) => (
              <li key={page.slug}>
                <a href={page.route}>{page.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            New answers are added here as they are published. Until then, see the{' '}
            <Link href="/answers/">short answers</Link> and the <Link href="/resources/">recovery resources</Link>.
          </p>
        )}
        <div className="button-row">
          <Link className="button primary" href="/contact/">
            Contact Dianne&apos;s Place about availability and fit
          </Link>
        </div>
      </section>
      <PageSchema {...schemaFor('/questions/')} />
    </main>
  );
}
