import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { SiteImage } from '@/components/media/SiteImage';
import { resourceGroups } from '@/lib/content';

export const metadata = {
  title: 'Resources'
};

export default function ResourcesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Recovery resource hub"
        title="Practical support for people, families, and referral partners."
        body="Resources are organized to reduce overwhelm and help people find plain-language guidance, supportive next steps, and community connection."
      />
      <section className="content-section">
        <SiteImage slotId="resources-guidance" />
        <div className="card-grid">
          {resourceGroups.map((group) => (
            <article className="card" key={group}>
              <h2>{group}</h2>
              <p>
                This resource category is part of the approved content calendar and will expand
                through scheduled, source-backed publishing.
              </p>
            </article>
          ))}
        </div>
        <div className="button-row">
          <Link className="button primary" href="/blog">
            Browse Scheduled Resources
          </Link>
          <a className="button secondary" href="https://988lifeline.org/">
            988 Crisis Support
          </a>
        </div>
      </section>
    </main>
  );
}
