import { PageHero } from '@/components/PageHero';
import { legal } from '@/lib/content';
import { PageFaq } from '@/components/PageFaq';
import { PageSchema } from '@/components/PageSchema';
import { schemaFor, seoFor } from '@/lib/seo';

export const metadata = seoFor('/medical-disclaimer/');

export default function MedicalDisclaimerPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal disclaimer"
        title="Medical Disclaimer"
        body="This site is not a substitute for professional medical advice, diagnosis, treatment, therapy, or emergency support."
      />
      <section className="content-section">
        <p>{legal.medicalDisclaimer}</p>
        <p>
          If you are in immediate danger, call 911. If you are experiencing a mental health or
          substance use crisis, call or text 988.
        </p>
      </section>
      <PageFaq path="/medical-disclaimer/" />
      <PageSchema {...schemaFor('/medical-disclaimer/')} />
    </main>
  );
}
