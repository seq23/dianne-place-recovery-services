import { site } from '@/lib/content';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function PageHero({ eyebrow, title, body }: PageHeroProps) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
      <p className="hero-call">
        <a className="button primary" href={site.phoneHref}>
          Call {site.phone}
        </a>
      </p>
    </section>
  );
}
