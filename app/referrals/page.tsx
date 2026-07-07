import Link from 'next/link';
import { DisclaimerBox } from '@/components/DisclaimerBox';
import { SiteImage } from '@/components/media/SiteImage';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: 'Referrals'
};

export default function ReferralsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Referral partners and families"
        title="A clear path for helping someone take the next step."
        body="Dianne's Place welcomes inquiries from individuals, families, treatment providers, hospitals, therapists, case managers, probation and parole officers, social service agencies, and community partners."
      />
      <section className="content-section">
        <SiteImage slotId="referrals-warm-handoff" />
        <div className="card-grid">
          <article className="card">
            <h2>Professional Referrals</h2>
            <p>
              Treatment centers, detox programs, hospitals, therapists, courts, and community
              organizations can contact Dianne&apos;s Place to discuss availability and fit.
            </p>
          </article>
          <article className="card">
            <h2>Family and Friends</h2>
            <p>
              Loved ones can reach out with questions and receive guidance on what information may
              help during an initial conversation.
            </p>
          </article>
          <article className="card">
            <h2>Self-Referrals</h2>
            <p>
              Individuals seeking recovery housing can contact Dianne&apos;s Place directly to learn
              about expectations, next steps, and availability.
            </p>
          </article>
        </div>
        <h2>Admissions Path</h2>
        <ol>
          <li>Contact Dianne&apos;s Place by phone, email, or the contact form.</li>
          <li>Discuss recovery goals, current needs, and housing fit.</li>
          <li>Review eligibility, expectations, and availability.</li>
          <li>Complete required paperwork and orientation if accepted.</li>
          <li>Begin the recovery housing journey with structure and support.</li>
        </ol>
        <DisclaimerBox />
        <Link className="button primary" href="/contact">
          Start a Referral Conversation
        </Link>
      </section>
    </main>
  );
}
