import { PageHero } from '@/components/PageHero';
import { legal } from '@/lib/content';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        body="Dianne's Place is designed to treat personal inquiries with care and to avoid unsafe collection of sensitive health information."
      />
      <section className="content-section">
        <p>{legal.privacyStatement}</p>
        <h2>General Contact Forms</h2>
        <p>
          General contact forms are for non-emergency inquiries only. Do not submit urgent medical
          information, crisis details, insurance numbers, full treatment histories, or protected
          health information through general forms unless a secure intake system is clearly active.
        </p>
        <h2>Tracking and Cookies</h2>
        <p>
          Necessary cookies support basic site function. Analytics and marketing technologies are
          blocked until preferences are saved and remain prohibited on sensitive workflows unless
          compliance controls permit them.
        </p>
      </section>
    </main>
  );
}
