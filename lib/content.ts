import licensureStatus from '@/data/licensure/licensure_status.json';
import legalCopy from '@/data/legal/legal_copy.json';
import entityRegistry from '@/data/entities/entity_registry.json';

export type SiteMode = 'pre_license' | 'licensed_provider';

export const site = {
  name: "Dianne's Place Recovery Services",
  legalName: "Dianne's Place Recovery Services LLC",
  phone: '(720) 588-8864',
  phoneHref: 'tel:17205888864',
  email: 'diannesplacerecovery@gmail.com',
  location: 'Service area to be confirmed',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/diannes-legacy', label: "Dianne's Legacy" },
    { href: '/recovery-housing', label: 'Recovery Housing' },
    { href: '/referrals', label: 'Referrals' },
    { href: '/resources', label: 'Resources' },
    { href: '/answers', label: 'Answers' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' }
  ],
  legalLinks: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/medical-disclaimer', label: 'Medical Disclaimer' },
    { href: '/outcomes-disclaimer', label: 'Outcomes Disclaimer' },
    { href: '/cookie-policy', label: 'Cookie Policy' }
  ],
  entity: entityRegistry.organization,
  legacy: entityRegistry.foundingStory
};

export const licensure = licensureStatus;
export const mode = licensure.mode as SiteMode;
export const legal = legalCopy[mode];
export const globalLegal = legalCopy;

export const serviceCards = [
  {
    title: 'Recovery Housing',
    body: 'Structured, substance-free living designed around accountability, healthy routines, dignity, and community.'
  },
  {
    title: 'Referral Support',
    body: 'Clear next steps for individuals, families, treatment providers, hospitals, courts, and community partners.'
  },
  {
    title: 'Resource Guidance',
    body: 'Plain-language recovery education, local support topics, and practical tools published through a governed calendar.'
  }
];

export const resourceGroups = [
  'Crisis and immediate support',
  'Recovery meetings and peer support',
  'Women in recovery',
  'Black, Latino, Indigenous, and minority recovery support',
  'LGBTQ+ recovery support',
  'Millennial and Gen Z recovery topics',
  'Family and loved-one education',
  'Employment, education, and daily routine rebuilding',
  'Housing stability and community reintegration'
];

export const requiredDisclaimer = `${legal.medicalDisclaimer} ${legal.outcomesDisclaimer}`;
