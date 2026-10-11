import { faqFor } from '@/lib/seo';

// Visible questions for a route, from data/aeo/answer_surface_registry.json
// (targetRoutes). PageSchema emits FAQPage from the same faqFor() call.
export function PageFaq({ path }: { path: string }) {
  const faq = faqFor(path);
  if (!faq.length) return null;
  return (
    <section className="content-section" aria-labelledby="page-faq-heading">
      <h2 id="page-faq-heading">Common questions</h2>
      {faq.map((item) => (
        <details className="faq-item" key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
