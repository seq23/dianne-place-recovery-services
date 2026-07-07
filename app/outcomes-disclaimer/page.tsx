import { PageHero } from '@/components/PageHero';
import { legal } from '@/lib/content';

export const metadata = { title: 'Outcomes Disclaimer' };

export default function OutcomesDisclaimerPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal disclaimer"
        title="Outcomes Disclaimer"
        body="Recovery outcomes vary. No website or recovery provider can promise a specific result."
      />
      <section className="content-section">
        <p>{legal.outcomesDisclaimer}</p>
      </section>
    </main>
  );
}
