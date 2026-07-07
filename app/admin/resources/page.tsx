import { PageHero } from '@/components/PageHero';
import { resourceGroups } from '@/lib/content';

export const metadata = { title: 'Admin Resources' };

export default function AdminResourcesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Resource operations"
        title="Resource Directory Management"
        body="Manage resource categories, future local directory entries, and content gaps from the approved recovery-resource strategy."
      />
      <section className="admin-shell">
        <div className="card-grid">
          {resourceGroups.map((resource) => (
            <article className="admin-card" key={resource}>
              <h2>{resource}</h2>
              <p>Status: approved category</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
