import { PageHero } from '@/components/PageHero';
import { legal } from '@/lib/content';
import { PageFaq } from '@/components/PageFaq';
import { PageSchema } from '@/components/PageSchema';
import { schemaFor, seoFor } from '@/lib/seo';

export const metadata = seoFor('/outcomes-disclaimer/');

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
      <PageFaq path="/outcomes-disclaimer/" />
      <PageSchema {...schemaFor('/outcomes-disclaimer/')} />
    </main>
  );
}
