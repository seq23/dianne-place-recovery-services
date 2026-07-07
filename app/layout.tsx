import type { Metadata } from 'next';
import './globals.css';
import { CookieConsent } from '@/components/CookieConsent';
import { CrisisBanner } from '@/components/CrisisBanner';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: {
    default: "Dianne's Place Recovery Services",
    template: "%s | Dianne's Place Recovery Services"
  },
  description:
    'Denver recovery housing, structured sober living, referral support, and recovery resources with services in development.',
  metadataBase: new URL('https://www.diannesplacerecoveryservices.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: "Dianne's Place Recovery Services",
    description:
      'A safe, structured recovery housing and support resource for adults rebuilding life after substance use.',
    type: 'website',
    locale: 'en_US'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.legalName,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Denver',
      addressRegion: 'CO',
      addressCountry: 'US'
    },
    description:
      'Recovery housing, structured sober living, referral support, and recovery resources in Denver, Colorado.'
  };

  return (
    <html lang="en">
      <body>
        <CrisisBanner />
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
