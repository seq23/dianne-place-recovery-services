import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outPath = path.join(root, 'data/content/content_calendar.json');
const start = new Date('2026-07-07T00:00:00Z');
const end = new Date('2026-12-31T00:00:00Z');

const audiences = [
  'people seeking recovery housing',
  'women in recovery',
  'Black and minority recovery communities',
  'LGBTQ+ people in recovery',
  'millennials rebuilding routines',
  'Gen Z recovery support seekers',
  'families and loved ones',
  'referral partners'
];

const themes = [
  ['Recovery housing readiness', 'How to know when structured recovery housing may help'],
  ['Daily sober routines', 'Simple structure for rebuilding a day in recovery'],
  ['Family support', 'How families can support recovery without taking over'],
  ['Women in recovery', 'Why safety, dignity, and community matter in recovery housing'],
  ['LGBTQ+ recovery support', 'Choosing recovery spaces that respect identity and belonging'],
  ['Minority recovery support', 'Why culturally respectful recovery resources matter'],
  ['Millennial recovery', 'Rebuilding work, money, and daily life after substance use'],
  ['Gen Z recovery', 'Early recovery support for young adults navigating pressure and change'],
  ['Referral guidance', 'What referral partners can prepare before calling'],
  ['Relapse prevention', 'Planning for triggers without shame or panic'],
  ['Employment and education', 'Small steps toward work, school, and stability'],
  ['Community reintegration', 'Building healthy connection after treatment or a setback']
];

const queryFamilies = [
  'recovery-housing',
  'women-recovery-support',
  'minority-recovery-support',
  'lgbtq-recovery-support',
  'gen-z-millennial-recovery',
  'referral-partner-journey',
  'family-support'
];

const strategyPillars = [
  'entity_clarity',
  'answer_extraction',
  'topical_depth',
  'geo_authority',
  'source_trust',
  'distribution_flywheel'
];

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

const items = [];
let cursor = start;
let index = 0;

while (cursor <= end) {
  const [theme, titleBase] = themes[index % themes.length];
  const audience = audiences[index % audiences.length];
  const day = iso(cursor);
  const isQuarterly = day === '2026-09-30' || day === '2026-12-31';
  const isMonthly = cursor.getUTCDate() === 1;
  const isWeekly = cursor.getUTCDay() === 2;
  const contentType = isQuarterly
    ? 'quarterly_whitepaper'
    : isMonthly
      ? 'monthly_pillar'
      : isWeekly
        ? 'weekly_article'
        : 'daily_resource';

  items.push({
    id: `dprs-${day}-${String(index + 1).padStart(3, '0')}`,
    title: `${titleBase}`,
    slug: `${day}-${theme.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    scheduledAt: day,
    status: 'approved',
    publishMode: 'auto_if_validated',
    contentType,
    theme,
    audience,
    queryFamilyId: queryFamilies[index % queryFamilies.length],
    citationStrategyPillar: strategyPillars[index % strategyPillars.length],
    priorityScore: isQuarterly ? 95 : isMonthly ? 84 : isWeekly ? 74 : 58,
    summary: `A ${contentType.replace(/_/g, ' ')} for ${audience}, focused on ${theme.toLowerCase()} with recovery-housing-safe language, required disclaimers, and source-aware claim boundaries.`,
    directAnswer: `${titleBase}. This resource explains ${theme.toLowerCase()} for ${audience} in plain language, with recovery-housing-safe guidance and no unsupported clinical claims.`,
    bodyOutline: [
      `Define the issue: ${theme}.`,
      `Explain why it matters for ${audience}.`,
      'Give practical next steps that fit recovery housing and referral-support boundaries.',
      'Add crisis, medical, outcomes, and pre-license disclaimers.',
      'Point readers toward contact, referrals, recovery housing, or resources as appropriate.'
    ],
    routeTarget: `/blog/${day}-${theme.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/`,
    answerSurface: {
      question: `${titleBase}?`,
      answer: `For ${audience}, ${theme.toLowerCase()} starts with safety, structure, support, and realistic next steps. Dianne's Place frames this topic through recovery housing and referral-support boundaries while expanded licensed services remain in development.`
    },
    requiredDisclaimers: ['medical', 'outcomes', 'service_status'],
    sourceIds: ['source-988-lifeline', 'source-samhsa'],
    claimIds: contentType === 'daily_resource' ? [] : ['claim-crisis-988'],
    licensureModeAllowed: ['pre_license', 'licensed_provider'],
    validation: {
      eligible: true,
      blockers: [],
      warnings: ['Full article body should be expanded or reviewed before high-traffic promotion.']
    }
  });

  cursor = addDays(cursor, 1);
  index += 1;
}

fs.writeFileSync(
  outPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      calendarStart: iso(start),
      calendarEnd: iso(end),
      items
    },
    null,
    2
  )}\n`
);

console.log(`[content:generate-backlog] wrote ${items.length} approved scheduled items`);
