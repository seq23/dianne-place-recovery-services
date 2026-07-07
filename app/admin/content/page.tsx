import contentCalendar from '@/data/content/content_calendar.json';
import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Admin Content' };

type ContentItem = {
  id: string;
  title: string;
  scheduledAt: string;
  status: string;
  contentType: string;
  validation: { eligible: boolean; blockers: string[] };
};

export default function AdminContentPage() {
  const items = contentCalendar.items as ContentItem[];
  const approved = items.filter((item) => item.status === 'approved').length;
  const blocked = items.filter((item) => item.validation?.eligible === false).length;

  return (
    <main>
      <PageHero
        eyebrow="Content operations"
        title="Approved backlog and release calendar"
        body="Backlog content is generated through 12/31/2026, set approved, and published only when validators confirm it is eligible."
      />
      <section className="admin-shell">
        <div className="card-grid">
          <article className="admin-card"><h2>Total Items</h2><p>{items.length}</p></article>
          <article className="admin-card"><h2>Approved</h2><p>{approved}</p></article>
          <article className="admin-card"><h2>Blocked</h2><p>{blocked}</p></article>
        </div>
        <div className="card-grid">
          {items.slice(0, 18).map((item) => (
            <article className="admin-card" key={item.id}>
              <p className="eyebrow">{item.scheduledAt} · {item.contentType}</p>
              <h2>{item.title}</h2>
              <p>Status: <strong>{item.status}</strong></p>
              <p>Eligible: <strong>{String(item.validation?.eligible)}</strong></p>
              {item.validation?.blockers?.length ? <p>Blockers: {item.validation.blockers.join(', ')}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
