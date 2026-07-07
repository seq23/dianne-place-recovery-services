import Link from 'next/link';
import contentCalendar from '@/data/content/content_calendar.json';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: 'Blog'
};

type ContentItem = {
  id: string;
  title: string;
  scheduledAt: string;
  status: string;
  contentType: string;
  audience: string;
  summary: string;
  slug: string;
  routeTarget: string;
  keyTakeaways?: string[];
  contentAtoms?: string[];
};

export default function BlogPage() {
  const items = contentCalendar.items as ContentItem[];
  const featured = items.slice(0, 36);
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.contentType] = (acc[item.contentType] || 0) + 1;
    return acc;
  }, {});

  return (
    <main>
      <PageHero
        eyebrow="Scheduled recovery resources"
        title="A governed content library for recovery education and support."
        body="The content calendar is generated through an approved strategy, then published only when source, disclaimer, licensure, and quality validators pass."
      />
      <section className="content-section">
        <div className="admin-stats" aria-label="Content library counts">
          <article className="card"><strong>{items.length}</strong><div className="small-note">Approved seeded posts</div></article>
          <article className="card"><strong>{counts.daily_resource || 0}</strong><div className="small-note">Daily resources</div></article>
          <article className="card"><strong>{counts.weekly_article || 0}</strong><div className="small-note">Weekly articles</div></article>
          <article className="card"><strong>{(counts.monthly_pillar || 0) + (counts.quarterly_whitepaper || 0)}</strong><div className="small-note">Long-form pieces</div></article>
        </div>
        <div className="card-grid blog-grid">
          {featured.map((item) => (
            <article className="card blog-card" key={item.id}>
              <p className="eyebrow">{item.contentType} · {item.scheduledAt}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              {item.keyTakeaways?.length ? (
                <ul className="compact-list">
                  {item.keyTakeaways.slice(0, 2).map((takeaway) => (
                    <li key={takeaway}>{takeaway}</li>
                  ))}
                </ul>
              ) : null}
              <p className="small-note">
                Audience: {item.audience}. Status: {item.status}. Atoms: {item.contentAtoms?.length || 0}.
              </p>
              <Link className="button secondary" href={item.routeTarget || `/blog/${item.slug}/`}>
                Read post
              </Link>
            </article>
          ))}
        </div>
        <div className="content-section compact-section">
          <h2>Full approved release calendar</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Audience</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.scheduledAt}</td>
                    <td>{item.title}</td>
                    <td>{item.contentType.replace(/_/g, ' ')}</td>
                    <td>{item.audience}</td>
                    <td><Link href={item.routeTarget || `/blog/${item.slug}/`}>Read</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {items.length === 0 ? (
          <p>The generated content calendar will populate during the build step.</p>
        ) : null}
      </section>
    </main>
  );
}
