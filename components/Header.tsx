import Link from 'next/link';
import { site } from '@/lib/content';

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Dianne's Place Recovery Services home">
        <span className="brand-script">Dianne&apos;s Place</span>
        <span>Recovery Services</span>
      </Link>
      <nav aria-label="Main navigation">
        {site.nav.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
