import Link from 'next/link';
import { DisclaimerBox } from '@/components/DisclaimerBox';
import { SiteImage } from '@/components/media/SiteImage';
import { legal, serviceCards, site } from '@/lib/content';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Denver recovery housing and support services</p>
          <h1>A safe, structured place to begin again.</h1>
          <p>
            Dianne&apos;s Place Recovery Services provides compassionate recovery housing
            and connection-focused support for adults rebuilding life after substance use.
            Expanded services are being developed with care as licensing and operational
            milestones are completed.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={site.phoneHref}>
              Call {site.phone}
            </a>
            <Link className="button secondary" href="/recovery-housing">
              Explore Recovery Housing
            </Link>
          </div>
          <p className="disclaimer">
            Dianne&apos;s Place is not an emergency service. If you are in immediate danger,
            call 911. If you are experiencing a mental health or substance use crisis, call or
            text 988.
          </p>
        </div>
        <div className="legacy-card hero-media">
          <SiteImage slotId="home-hero-community" />
          <p className="script">A warm place to land</p>
          <p>
            The photo direction for this space is a multiracial recovery housing community:
            home-like, calm, dignified, and visibly inclusive.
          </p>
          <Link href="/diannes-legacy">Read Dianne&apos;s legacy</Link>
        </div>
      </section>

      <section className="trust-row" aria-label="Core services">
        {serviceCards.map((card) => (
          <article key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section className="content-section">
        <p className="eyebrow">Current status</p>
        <h2>Services are opening with care, not shortcuts.</h2>
        <p>
          Dianne&apos;s Place is preparing expanded recovery services with respect for the
          licensing, operational, and privacy standards this work deserves. As each offering
          becomes available, this site will be updated with clear eligibility, availability,
          and referral information.
        </p>
        <DisclaimerBox />
      </section>

      <section className="content-section alt">
        <p className="eyebrow">Privacy-first support</p>
        <h2>Simple next steps, careful boundaries.</h2>
        <SiteImage slotId="home-support-community" />
        <p>{legal.privacyStatement}</p>
        <div className="button-row">
          <Link className="button primary" href="/contact">
            Contact Us
          </Link>
          <Link className="button secondary" href="/referrals">
            Referral Information
          </Link>
        </div>
      </section>
    </main>
  );
}
