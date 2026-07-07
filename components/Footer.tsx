import Link from 'next/link';
import { globalLegal, licensure, site } from '@/lib/content';

export function Footer() {
  return (
    <footer className="site-footer">
      <section>
        <h2>Dianne&apos;s Place Recovery Services</h2>
        <p>
          Recovery housing, structured support, and referral guidance. Expanded services are being
          developed with care as licensing and operational milestones are completed.
        </p>
        <p>
          <strong>Call:</strong> <a href={site.phoneHref}>{site.phone}</a>
          <br />
          <strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </section>

      <section>
        <h2>Legal & Compliance</h2>
        <p>{globalLegal.footerMedical}</p>
        <p>{globalLegal.footerOutcomes}</p>
        <p>{globalLegal.footerPrivacy}</p>
        <ul>
          {site.legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Licensure Status</h2>
        <p>
          Current public mode: <strong>{licensure.mode}</strong>
        </p>
        <p>
          License status: <strong>{licensure.license.status}</strong>
        </p>
        <p>
          Licensed clinical services, insurance verification, and accreditation badges are displayed
          only when the licensure profile and validators permit them.
        </p>
      </section>

      <section>
        <h2>Accreditation Badges</h2>
        <div className="badge-grid" aria-label="Accreditation badge placeholders">
          <span>Joint Commission</span>
          <span>LegitScript</span>
          <span>SAMHSA</span>
        </div>
        <p className="small-note">Badge placeholders remain inactive until verified and approved.</p>
      </section>
    </footer>
  );
}
