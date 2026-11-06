import Link from 'next/link';
import { globalLegal, licensure, site } from '@/lib/content';
import { siteIdentity } from '@/lib/seo';

const gbp = siteIdentity.googleBusinessProfile;

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
          {gbp.found && gbp.mapsCid ? (
            <>
              <br />
              <a href={`https://maps.google.com/?cid=${gbp.mapsCid}`}>Find us on Google</a>
            </>
          ) : null}
        </p>
        <p>
          <Link href="/questions/">Questions families ask</Link>
          <br />
          <Link href="/future-services/">Future services in development</Link>
          <br />
          <a href={siteIdentity.sisterSite.url}>{siteIdentity.sisterSite.label}</a>
        </p>
        <p className="small-note">Written and published by Dianne&apos;s Place Recovery Services.</p>
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
    </footer>
  );
}
