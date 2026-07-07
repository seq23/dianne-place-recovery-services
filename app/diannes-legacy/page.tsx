import { DisclaimerBox } from '@/components/DisclaimerBox';
import { PageHero } from '@/components/PageHero';

export const metadata = {
  title: "Dianne's Legacy"
};

export default function DiannesLegacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Named in honor of Dianne"
        title="A name rooted in compassion, strength, and care."
        body="Dianne's Place is named in honor of the owner's mother, Dianne, whose compassion, strength, and unwavering care for others inspired this organization."
      />
      <section className="content-section">
        <div className="hero" style={{ padding: 0, background: 'transparent' }}>
          <div>
            <p>
              While this organization bears her name, its mission reflects the values she lived every
              day: treating every person with dignity, kindness, and respect.
            </p>
            <p>
              Dianne&apos;s Place exists to create a grounded and supportive environment where people
              can rebuild after substance use, reconnect with hope, and take the next right step
              toward a healthier future.
            </p>
            <p className="script">Recovery thrives in community, and no one should have to walk that journey alone.</p>
          </div>
          <div className="legacy-card">
            <div className="photo-placeholder" aria-label="Dianne photo placeholder">
              Dianne photo placeholder
              <br />
              Uploadable from /admin/media
            </div>
          </div>
        </div>
        <DisclaimerBox />
      </section>
    </main>
  );
}
