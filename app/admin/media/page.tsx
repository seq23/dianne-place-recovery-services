import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Admin Media' };

export default function AdminMediaPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legacy media"
        title="Dianne Photo Management"
        body="Upload and publish the Dianne legacy photo with required alt text. Production writes should be handled through a protected backend or GitHub-backed media manifest."
      />
      <section className="admin-shell">
        <div className="legacy-card">
          <div className="photo-placeholder">Current placeholder</div>
        </div>
        <form className="form-grid" aria-label="Dianne photo upload form">
          <label>Photo file<input type="file" accept="image/*" aria-label="Dianne photo file" /></label>
          <label>Alt text<input aria-label="Dianne photo alt text" placeholder="Portrait of Dianne" /></label>
          <label>Caption<textarea aria-label="Dianne photo caption" /></label>
          <button className="button primary" type="button">Publish Photo Update</button>
        </form>
      </section>
    </main>
  );
}
