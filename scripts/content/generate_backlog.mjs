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

const atomLibrary = {
  crisis: {
    id: 'atom-crisis-boundary',
    label: 'Crisis boundary',
    text: 'Dianne’s Place is not an emergency service. If someone is in immediate danger, call 911. If someone is experiencing a mental health or substance use crisis, call or text 988 for free, confidential support.'
  },
  preLicense: {
    id: 'atom-pre-license-boundary',
    label: 'Current service status',
    text: 'This resource is written for recovery housing and referral-support education while expanded licensed services are still in development. It should not be read as a promise of clinical treatment, diagnosis, detox, medication management, or a guaranteed placement.'
  },
  dignity: {
    id: 'atom-dignity-first',
    label: 'Dignity-first language',
    text: 'Recovery support should reduce shame, not add to it. The goal is to help people identify the next honest step with dignity, privacy, and realistic support.'
  },
  referral: {
    id: 'atom-referral-handoff',
    label: 'Warm referral handoff',
    text: 'A helpful referral includes the person’s current safety needs, recent level of care, housing timeline, support system, and any boundaries the receiving organization needs to know before a conversation begins.'
  },
  inclusion: {
    id: 'atom-inclusive-recovery',
    label: 'Inclusive recovery support',
    text: 'Women, Black and minority communities, LGBTQ+ people, millennials, and Gen Z recovery seekers may need support that recognizes identity, safety, culture, family pressure, stigma, work, housing, and belonging at the same time.'
  },
  sourceTrust: {
    id: 'atom-source-trust',
    label: 'Source-aware support',
    text: 'Educational recovery content should separate lived-experience support from medical claims and should point people toward qualified professionals, emergency services, or crisis support when the situation calls for it.'
  }
};

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

function titleSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function contentDepth(contentType) {
  if (contentType === 'quarterly_whitepaper') {
    return {
      label: 'Quarterly white paper',
      targetWords: 2200,
      sectionCount: 7,
      promise: 'a deeper, more durable reference piece that can be cited by families, referral partners, and future resource pages'
    };
  }
  if (contentType === 'monthly_pillar') {
    return {
      label: 'Monthly pillar',
      targetWords: 1500,
      sectionCount: 6,
      promise: 'a pillar resource that connects short daily posts into a larger recovery-support theme'
    };
  }
  if (contentType === 'weekly_article') {
    return {
      label: 'Weekly article',
      targetWords: 950,
      sectionCount: 5,
      promise: 'a practical article with enough depth to support search, answer engines, and human readers'
    };
  }
  return {
    label: 'Daily recovery resource',
    targetWords: 650,
    sectionCount: 4,
    promise: 'a short, useful resource that gives one clear next step without overwhelming the reader'
  };
}

function selectAtoms(theme, audience, contentType) {
  const atoms = [atomLibrary.crisis, atomLibrary.preLicense, atomLibrary.dignity, atomLibrary.sourceTrust];
  if (/referral|family/i.test(theme) || /referral|famil/i.test(audience)) atoms.push(atomLibrary.referral);
  if (/women|minority|lgbtq|millennial|gen z|Black/i.test(theme + ' ' + audience)) atoms.push(atomLibrary.inclusion);
  if (contentType === 'quarterly_whitepaper' && !atoms.find((atom) => atom.id === atomLibrary.referral.id)) atoms.push(atomLibrary.referral);
  return atoms;
}

function buildSections({ theme, titleBase, audience, contentType }) {
  const depth = contentDepth(contentType);
  const sections = [
    {
      heading: 'Start with the real-life signal, not the shame',
      body: `${theme} usually becomes visible through ordinary life first: missed routines, unstable sleep, unsafe housing pressure, relationship strain, money stress, isolation, or the quiet sense that willpower alone is no longer enough. For ${audience}, the most useful starting point is not blame. It is noticing what support would make the next twenty-four hours safer and more structured.`
    },
    {
      heading: 'What structured recovery support can provide',
      body: `Recovery housing and referral support can create a steadier bridge between treatment, crisis stabilization, family support, work, school, and daily life. The value is not magic. It is repetition: a safer environment, clearer expectations, substance-free routines, connection, accountability, and people who understand that recovery is built through small decisions made again and again.`
    },
    {
      heading: 'How to think about readiness',
      body: `${titleBase.toLowerCase()} is less about being perfectly ready and more about being honest about what is hard to maintain alone. If someone wants recovery but keeps getting pulled back into unsafe environments, chaotic routines, or unsupported transitions, structured housing or a warm referral conversation may be a practical next step.`
    },
    {
      heading: 'Questions to ask before the next step',
      body: `Helpful questions include: What does safety require today? What level of structure has worked before? What situations tend to trigger relapse or shutdown? Who needs to be included in the referral conversation? What privacy boundaries matter? What medical or clinical needs should be handled by licensed professionals before housing is considered?`
    },
    {
      heading: 'What families and referral partners can do',
      body: `Families, case managers, courts, hospitals, treatment providers, and community partners can help most by preparing clear, factual information and avoiding promises they cannot control. A good handoff names the current need, the timeline, any known safety concerns, and the kind of support the person is willing to accept.`
    },
    {
      heading: 'A dignity-first reminder',
      body: `Recovery support should leave people with more clarity and less shame. A person can need structure and still deserve respect. A person can have setbacks and still be worthy of stable housing, thoughtful referrals, and a path that does not reduce them to the hardest chapter of their life.`
    },
    {
      heading: 'How Dianne’s Place frames this topic',
      body: `Dianne’s Place frames ${theme.toLowerCase()} through recovery housing, referral support, and plain-language education while expanded licensed services are in development. The focus is careful, honest support: no exaggerated claims, no guaranteed outcomes, and no language that pretends a website can replace professional medical care.`
    }
  ];

  return sections.slice(0, depth.sectionCount);
}

function buildFaq({ titleBase, theme, audience }) {
  return [
    {
      question: `${titleBase}?`,
      answer: `For ${audience}, ${theme.toLowerCase()} often starts with safety, structure, support, and a realistic plan for the next step.`
    },
    {
      question: 'Is this medical advice?',
      answer: 'No. This resource is educational and does not replace professional medical advice, diagnosis, treatment, detox, crisis care, or licensed clinical services.'
    },
    {
      question: 'When should someone use 988 or 911 instead?',
      answer: 'Call 911 for immediate danger. Call or text 988 for mental health or substance use crisis support. A website or recovery housing inquiry is not a crisis-response service.'
    },
    {
      question: 'What should referral partners prepare before calling?',
      answer: 'Prepare the person’s timeline, current safety needs, recent level of care, housing needs, privacy boundaries, and any clinical needs that should be handled by licensed professionals.'
    }
  ];
}

function buildPost({ theme, titleBase, audience, contentType }) {
  const atoms = selectAtoms(theme, audience, contentType);
  const sections = buildSections({ theme, titleBase, audience, contentType });
  const depth = contentDepth(contentType);

  return {
    dek: `A ${depth.label.toLowerCase()} for ${audience} on ${theme.toLowerCase()}, written to be useful, careful, and recovery-housing-safe.`,
    humanizedIntro: `If you are searching this topic, there may already be a lot happening underneath the surface. Maybe someone is leaving treatment. Maybe home does not feel steady. Maybe the family is tired and scared. Maybe the person in recovery wants a different life but needs more structure than encouragement alone can provide. This guide is meant to slow the moment down and make the next step easier to see.`,
    sections,
    keyTakeaways: [
      'Structure can be supportive without being shaming.',
      'Recovery housing and referral support are not substitutes for emergency care or licensed medical treatment.',
      'A strong next step is usually specific, practical, and honest about safety.',
      'Families and referral partners help most when they prepare clear information and realistic expectations.'
    ],
    practicalNextSteps: [
      'Write down what kind of support is needed in the next 24 to 72 hours.',
      'Identify any crisis, detox, medical, or mental health needs that require immediate professional care.',
      'Gather basic referral information before calling or emailing.',
      'Ask what structure, privacy, and community support would make recovery more sustainable.',
      'Use Dianne’s Place contact or referral pages for non-emergency next-step conversations.'
    ],
    reflectionPrompt: `What is the smallest honest next step that would make ${theme.toLowerCase()} feel safer, clearer, or more supported today?`,
    faq: buildFaq({ titleBase, theme, audience }),
    contentAtoms: atoms.map((atom) => atom.id),
    atomBlocks: atoms,
    internalLinks: [
      { label: 'Recovery Housing', href: '/recovery-housing/' },
      { label: 'Referrals', href: '/referrals/' },
      { label: 'Resources', href: '/resources/' },
      { label: 'Contact', href: '/contact/' }
    ],
    humanizationChecklist: [
      'Plain-language, non-shaming tone',
      'Direct answer near the top',
      'Practical next steps',
      'Crisis and medical boundaries',
      'Inclusive recovery context',
      'No fabricated licensure, outcomes, or accreditation'
    ],
    wordTarget: depth.targetWords,
    contentPromise: depth.promise,
    disclaimerBlock: 'This resource is for general education and recovery-support navigation only. It is not a substitute for professional medical advice, diagnosis, treatment, emergency care, detox, therapy, or licensed clinical services. Recovery outcomes vary.'
  };
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

  const slug = `${day}-${titleSlug(theme)}`;
  const post = buildPost({ theme, titleBase, audience, contentType });

  items.push({
    id: `dprs-${day}-${String(index + 1).padStart(3, '0')}`,
    title: `${titleBase}`,
    slug,
    scheduledAt: day,
    status: 'approved',
    publishMode: 'auto_if_validated',
    contentType,
    theme,
    audience,
    queryFamilyId: queryFamilies[index % queryFamilies.length],
    citationStrategyPillar: strategyPillars[index % strategyPillars.length],
    priorityScore: isQuarterly ? 95 : isMonthly ? 84 : isWeekly ? 74 : 58,
    summary: post.dek,
    directAnswer: `${titleBase}. This resource explains ${theme.toLowerCase()} for ${audience} in plain language, with recovery-housing-safe guidance and no unsupported clinical claims.`,
    bodyOutline: [
      `Define the issue: ${theme}.`,
      `Explain why it matters for ${audience}.`,
      'Give practical next steps that fit recovery housing and referral-support boundaries.',
      'Add crisis, medical, outcomes, and pre-license disclaimers.',
      'Point readers toward contact, referrals, recovery housing, or resources as appropriate.'
    ],
    routeTarget: `/blog/${slug}/`,
    answerSurface: {
      question: `${titleBase}?`,
      answer: `For ${audience}, ${theme.toLowerCase()} starts with safety, structure, support, and realistic next steps. Dianne's Place frames this topic through recovery housing and referral-support boundaries while expanded licensed services remain in development.`
    },
    requiredDisclaimers: ['medical', 'outcomes', 'service_status'],
    ...post,
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
