import Link from 'next/link';
import { DisclaimerBox } from '@/components/DisclaimerBox';
import { SiteImage } from '@/components/media/SiteImage';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: 'Recovery Housing'
};

export default function RecoveryHousingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Structured recovery housing"
        title="A substance-free home base for the next chapter."
        body="Dianne's Place is designed for adults committed to recovery who are seeking structure, accountability, community, and a safe place to continue rebuilding."
      />
      <section className="content-section">
        <SiteImage slotId="recovery-housing-kitchen" />
        <div className="card-grid">
          <article className="card">
            <h2>Community and Compassion</h2>
            <p>
              Residents are welcomed into a supportive environment where dignity, respect, and
              meaningful connection are central to daily life.
            </p>
          </article>
          <article className="card">
            <h2>Structure and Accountability</h2>
            <p>
              The housing model emphasizes routines, personal responsibility, healthy boundaries,
              recovery participation, and progress toward independent living.
            </p>
          </article>
          <article className="card">
            <h2>Growth and Connection</h2>
            <p>
              Dianne&apos;s Place helps residents connect with peer support, community resources,
              employment and education pathways, and appropriate outside care.
            </p>
          </article>
        </div>
        <DisclaimerBox />
        <div className="button-row">
          <Link className="button primary" href="/contact">
            Ask About Availability
          </Link>
          <Link className="button secondary" href="/referrals">
            Make a Referral
          </Link>
        </div>
      </section>
    </main>
  );
}
