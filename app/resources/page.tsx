import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { SiteImage } from '@/components/media/SiteImage';
import { resourceGroups } from '@/lib/content';
import quality from '@/data/seo/page_quality.json';

// Each resource group points at the reviewed guides that cover it
// (data/seo/page_quality.json), described by the first sentence of each
// guide's own definition, so the hub says only what the guides say.
const GROUP_GUIDES: Record<string, string[]> = {
  'Crisis and immediate support': [],
  'Recovery meetings and peer support': ['Community reintegration', 'Relapse prevention'],
  'Women in recovery': ['Women in recovery'],
  'Black, Latino, Indigenous, and minority recovery support': ['Minority recovery support'],
  'LGBTQ+ recovery support': ['LGBTQ+ recovery support'],
  'Millennial and Gen Z recovery topics': ['Millennial recovery', 'Gen Z recovery'],
  'Family and loved-one education': ['Family support', 'Referral guidance'],
  'Employment, education, and daily routine rebuilding': ['Employment and education', 'Daily sober routines'],
  'Housing stability and community reintegration': ['Recovery housing readiness', 'Community reintegration']
};
const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0];
function guidesFor(group: string) {
  return (GROUP_GUIDES[group] ?? []).map((theme) => {
    const guide = quality.guides.find((entry) => entry.theme === theme);
    if (!guide) throw new Error(`resources: no reviewed guide for theme ${theme}`);
    return { route: guide.route, theme, summary: firstSentence(guide.definition) };
  });
}
import { PageFaq } from '@/components/PageFaq';
import { PageSchema } from '@/components/PageSchema';
import { schemaFor, seoFor } from '@/lib/seo';

export const metadata = seoFor('/resources/');

export default function ResourcesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Recovery resource hub"
        title="Recovery resources for people, families, and referral partners."
        body="Resources are organized to reduce overwhelm and help people find plain-language guidance, supportive next steps, and community connection."
      />
      <section className="content-section">
        <SiteImage slotId="resources-guidance" />
        <div className="card-grid">
          {resourceGroups.map((group) => (
            <article className="card" key={group}>
              <h2>{group}</h2>
              {guidesFor(group).length ? (
                guidesFor(group).map((guide) => (
                  <p key={guide.route}>
                    {guide.summary} <Link href={guide.route}>{guide.theme} guide</Link>
                  </p>
                ))
              ) : (
                <p>
                  If someone is in immediate danger, call 911. For free, confidential crisis support,
                  call or text <a href="https://988lifeline.org/">988</a>, available 24/7.
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="button-row">
          <Link className="button primary" href="/blog">
            Browse Scheduled Resources
          </Link>
          <a className="button secondary" href="https://988lifeline.org/">
            988 Crisis Support
          </a>
        </div>
      </section>
      <PageFaq path="/resources/" />
      <PageSchema {...schemaFor('/resources/')} />
    </main>
  );
}
