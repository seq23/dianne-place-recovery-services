import Link from 'next/link';
import { DisclaimerBox } from '@/components/DisclaimerBox';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our story, mission, and heart"
        title="A recovery home built around dignity, structure, and second chances."
        body="Dianne's Place Recovery Services was created to help adults continue their recovery in a safe, structured, substance-free environment where accountability and compassion can exist together."
      />
      <section className="content-section">
        <div className="card-grid">
          <article className="card">
            <h2>Mission</h2>
            <p>
              To provide recovery housing and connection-focused support that helps residents rebuild
              stability, confidence, healthy routines, and meaningful relationships.
            </p>
          </article>
          <article className="card">
            <h2>Values</h2>
            <p>
              Compassion, dignity, hope, accountability, community, integrity, growth, and second
              chances guide the way Dianne&apos;s Place communicates, supports, and grows.
            </p>
          </article>
          <article className="card">
            <h2>Careful Growth</h2>
            <p>
              Expanded services are being developed with care as licensing, staffing, privacy, and
              operational milestones are completed.
            </p>
          </article>
        </div>
        <DisclaimerBox />
        <div className="button-row">
          <Link className="button primary" href="/diannes-legacy">
            Read Dianne&apos;s Legacy
          </Link>
          <Link className="button secondary" href="/recovery-housing">
            Explore Recovery Housing
          </Link>
        </div>
      </section>
    </main>
  );
}
