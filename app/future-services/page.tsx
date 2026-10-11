import { DisclaimerBox } from '@/components/DisclaimerBox';
import { PageHero } from '@/components/PageHero';
import { licensure } from '@/lib/content';
import { PageFaq } from '@/components/PageFaq';
import { PageSchema } from '@/components/PageSchema';
import { schemaFor, seoFor } from '@/lib/seo';

export const metadata = seoFor('/future-services/');

export default function FutureServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services in development"
        title="Expanded recovery services are being prepared with care."
        body="Dianne's Place is building toward expanded support while honoring the licensing, privacy, staffing, and operational standards this work requires."
      />
      <section className="content-section">
        <p>
          Current public materials should be read as recovery housing, structured sober living,
          referral support, and resource guidance. Clinical treatment language will activate only
          when licensure mode is switched and validated.
        </p>
        <p>
          Current licensure mode: <span className="status-pill">{licensure.mode}</span>
        </p>
        <DisclaimerBox />
      </section>
      <PageFaq path="/future-services/" />
      <PageSchema {...schemaFor('/future-services/')} />
    </main>
  );
}
