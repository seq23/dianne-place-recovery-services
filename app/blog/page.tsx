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
};

export default function BlogPage() {
  const items = (contentCalendar.items as ContentItem[]).slice(0, 24);

  return (
    <main>
      <PageHero
        eyebrow="Scheduled recovery resources"
        title="A governed content library for recovery education and support."
        body="The content calendar is generated through an approved strategy, then published only when source, disclaimer, licensure, and quality validators pass."
      />
      <section className="content-section">
        <div className="card-grid">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <p className="eyebrow">{item.contentType} · {item.scheduledAt}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <p className="small-note">
                Audience: {item.audience}. Status: {item.status}.
              </p>
            </article>
          ))}
        </div>
        {items.length === 0 ? (
          <p>The generated content calendar will populate during the build step.</p>
        ) : null}
      </section>
    </main>
  );
}
