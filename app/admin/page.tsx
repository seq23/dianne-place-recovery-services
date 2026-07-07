import Link from 'next/link';
import adminManifest from '@/data/admin/admin_manifest.json';
import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Admin' };

export default function AdminPage() {
  return (
    <main>
      <PageHero
        eyebrow="Protected owner operations"
        title="Dianne's Place Admin"
        body="Manage content, licensure state, media, and resource updates from a governed admin surface. Production access must be protected by Cloudflare Access or equivalent real auth."
      />
      <section className="admin-shell">
        <p className="status-pill">{adminManifest.adminProtectionRequired}</p>
        <div className="admin-grid">
          <article className="admin-card">
            <h2>Content Calendar</h2>
            <p>Review approved scheduled content, blocked items, and publishing status.</p>
            <Link className="button primary" href="/admin/content">Open Content</Link>
          </article>
          <article className="admin-card">
            <h2>Licensure Switch</h2>
            <p>Prepare and validate the transition from pre-license mode to licensed-provider mode.</p>
            <Link className="button primary" href="/admin/licensure">Open Licensure</Link>
          </article>
          <article className="admin-card">
            <h2>Dianne Photo</h2>
            <p>Upload or replace the Dianne legacy photo and required alt text.</p>
            <Link className="button primary" href="/admin/media">Open Media</Link>
          </article>
          <article className="admin-card">
            <h2>Resources</h2>
            <p>Manage recovery resource categories and future directory entries.</p>
            <Link className="button primary" href="/admin/resources">Open Resources</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
