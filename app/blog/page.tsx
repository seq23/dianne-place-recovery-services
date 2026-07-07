import Link from 'next/link';
import contentCalendar from '@/data/content/content_calendar.json';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: 'Recovery Resources'
};

type ContentItem = {
  id: string;
  title: string;
  scheduledAt: string;
  status: string;
  summary: string;
  slug: string;
  routeTarget: string;
  keyTakeaways?: string[];
};

const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);

export default function BlogPage() {
  const items = (contentCalendar.items as ContentItem[])
    .filter((item) => item.status === 'approved' && item.scheduledAt <= releaseDate)
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

  return (
    <main>
      <PageHero
        eyebrow="Recovery resources"
        title="Plain-language support for safer next steps."
        body="Explore recovery housing, referral support, family guidance, and practical education written with dignity, care, and clear safety boundaries."
      />
      <section className="content-section">
        <div className="card-grid blog-grid">
          {items.map((item) => (
            <article className="card blog-card" key={item.id}>
              <p className="eyebrow">{item.scheduledAt}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              {item.keyTakeaways?.length ? (
                <ul className="compact-list">
                  {item.keyTakeaways.slice(0, 2).map((takeaway) => (
                    <li key={takeaway}>{takeaway}</li>
                  ))}
                </ul>
              ) : null}
              <Link className="button secondary" href={item.routeTarget || `/blog/${item.slug}/`}>
                Read post
              </Link>
            </article>
          ))}
        </div>
        {items.length === 0 ? (
          <p>Recovery resources will appear here as scheduled posts are released.</p>
        ) : null}
      </section>
    </main>
  );
}
