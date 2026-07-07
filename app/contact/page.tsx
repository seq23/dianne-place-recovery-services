import { DisclaimerBox } from '@/components/DisclaimerBox';
import { SiteImage } from '@/components/media/SiteImage';
import { PageHero } from '@/components/PageHero';
import { site } from '@/lib/content';

export const metadata = {
  title: 'Contact'
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact Dianne's Place"
        title="Reach out when you are ready for the next step."
        body="Whether you are seeking recovery housing, making a referral, supporting a loved one, or asking questions, Dianne's Place is here to respond with care."
      />
      <section className="content-section">
        <SiteImage slotId="contact-calm-inquiry" />
        <div className="card-grid">
          <article className="card">
            <h2>Phone</h2>
            <p>
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
          </article>
          <article className="card">
            <h2>Email</h2>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </article>
          <article className="card">
            <h2>Location</h2>
            <p>{site.location}</p>
          </article>
        </div>

        <h2>Send a Message</h2>
        <form className="form-grid" aria-label="General contact form">
          <label>
            Name
            <input name="name" type="text" autoComplete="name" aria-label="Name" />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" aria-label="Email address" />
          </label>
          <label>
            Message
            <textarea name="message" aria-label="Message" />
          </label>
          <label>
            <span>
              <input type="checkbox" required aria-label="Consent to general contact" /> I consent
              to being contacted about my inquiry and understand this is not an emergency or clinical
              intake form.
            </span>
          </label>
          <button className="button primary" type="submit">
            Submit Form
          </button>
        </form>
        <DisclaimerBox />
      </section>
    </main>
  );
}
