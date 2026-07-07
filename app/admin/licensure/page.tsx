import licensure from '@/data/licensure/licensure_status.json';
import { PageHero } from '@/components/PageHero';

export const metadata = { title: 'Admin Licensure' };

export default function AdminLicensurePage() {
  return (
    <main>
      <PageHero
        eyebrow="Controlled legal status"
        title="Licensure Mode Switch"
        body="This switch changes public language, disclaimers, schema, service descriptions, and content validators. It must not be activated until licensure is active and documented."
      />
      <section className="admin-shell">
        <div className="admin-grid">
          <article className="admin-card">
            <h2>Current Mode</h2>
            <p className="status-pill">{licensure.mode}</p>
            <p>License status: <strong>{licensure.license.status}</strong></p>
            <p>State: <strong>{licensure.license.state}</strong></p>
          </article>
          <article className="admin-card danger-zone">
            <h2>Activation Guard</h2>
            <p>
              To activate licensed-provider mode, the owner must enter active license details,
              upload/reference supporting documentation, check legal confirmations, type
              <strong> ACTIVATE LICENSED MODE</strong>, and pass validation.
            </p>
          </article>
        </div>
        <form className="form-grid" aria-label="Licensure mode form">
          <label>License type<input aria-label="License type" defaultValue={licensure.license.licenseType} /></label>
          <label>License number<input aria-label="License number" defaultValue={licensure.license.licenseNumber} /></label>
          <label>Issuing agency<input aria-label="Issuing agency" defaultValue={licensure.license.issuingAgency} /></label>
          <label>Effective date<input aria-label="Effective date" type="date" defaultValue={licensure.license.effectiveDate} /></label>
          <label>Covered services<textarea aria-label="Covered services" defaultValue={licensure.license.coveredServices.join('\n')} /></label>
          <label>
            <span><input type="checkbox" aria-label="Licensure confirmation" /> I confirm the license is active and the entered details are accurate.</span>
          </label>
          <label>
            Type confirmation phrase
            <input aria-label="Type ACTIVATE LICENSED MODE" placeholder="ACTIVATE LICENSED MODE" />
          </label>
          <button className="button primary" type="button">Prepare Licensed Mode Validation</button>
        </form>
      </section>
    </main>
  );
}
