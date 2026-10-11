import type { Metadata } from 'next';
import './globals.css';
import { CookieConsent } from '@/components/CookieConsent';
import { CrisisBanner } from '@/components/CrisisBanner';
import { Footer } from '@/components/Footer';
import { ClarityLoader } from '@/components/ClarityLoader';
import { Header } from '@/components/Header';
import { SITE_ORIGIN, ogImage, organizationSchema, websiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: "Dianne's Place Recovery Services",
    template: "%s | Dianne's Place Recovery Services"
  },
  description:
    'Recovery housing, structured sober living, referral support, and recovery resources with services in development.',
  metadataBase: new URL(SITE_ORIGIN),
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/icon-192.png', type: 'image/png', sizes: '192x192' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Dianne's Place Recovery Services",
    description:
      'A safe, structured recovery housing and support resource for adults rebuilding life after substance use.',
    url: '/',
    siteName: "Dianne's Place Recovery Services",
    type: 'website',
    locale: 'en_US',
    images: [ogImage]
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage.url]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema()]
  };

  return (
    <html lang="en">
      <body>
        <CrisisBanner />
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        <ClarityLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
