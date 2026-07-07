import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Terms"
        title="Terms of Service"
        body="Use of this website is subject to the boundaries and disclaimers below."
      />
      <section className="content-section">
        <p>
          This website provides general information about Dianne&apos;s Place Recovery Services,
          recovery housing, referral support, resources, and services in development. It does not
          create a clinical, medical, therapeutic, or emergency relationship.
        </p>
        <p>
          Content may change as services, licensure, availability, policies, and resources evolve.
          Users should contact Dianne&apos;s Place directly for current availability and eligibility.
        </p>
      </section>
    </main>
  );
}
