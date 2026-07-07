import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Cookie Policy' };

export default function CookiePolicyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Cookie controls"
        title="Cookie Policy"
        body="The site separates necessary cookies from analytics and marketing technologies."
      />
      <section className="content-section">
        <h2>Necessary Cookies</h2>
        <p>Required for basic site function and security. These are always on.</p>
        <h2>Functional / Analytics</h2>
        <p>Used only after preference is saved. These should not run on sensitive forms.</p>
        <h2>Marketing / Tracking</h2>
        <p>
          Blocked by default. Marketing or tracking pixels must not run on sensitive healthcare,
          referral, intake, insurance, or contact workflows unless legal and compliance review permits
          them.
        </p>
      </section>
    </main>
  );
}
