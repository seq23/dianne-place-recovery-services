import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'reports/self-production-preview.md');
const candidatePath = path.join(root, 'data/content/post_2026_self_production_preview.json');
const calendarPath = path.join(root, 'data/content/content_calendar.json');
const today = process.env.SELF_PRODUCE_DATE || process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);

function writePreview(candidate, status) {
  fs.writeFileSync(candidatePath, `${JSON.stringify(candidate, null, 2)}\n`);
  fs.writeFileSync(reportPath, `# Self-Production Preview\n\nDate: ${today}\n\nStatus: ${status}\n\nFuture self-production appends one complete, default-approved post only after the approved 2026 backlog ends. Word count variance and petty style issues are warnings, not blockers. Hard blocks remain legal, licensure, route, disclaimer, crisis-boundary, and unsafe medical-claim risks.\n`);
}

const policy = {
  selfHealingEnabled: true,
  wordCountIsBlocking: false,
  pettyStyleIssuesBlockRelease: false,
  hardBlocksOnly: ['legal_compliance', 'licensure_claims', 'missing_route', 'missing_disclaimer', 'missing_crisis_boundary', 'unsafe_medical_claim']
};

if (today < '2027-01-01') {
  writePreview({ generatedAt: new Date().toISOString(), date: today, status: 'blocked_before_2027', validationPolicy: policy }, 'BLOCKED_BEFORE_2027');
  console.log('[content:self-produce] blocked before 2027-01-01');
  process.exit(0);
}

const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
const slug = `${today}-self-produced-recovery-support-resource`;
const id = `dprs-${today}-self-produced`;

if (!calendar.items.some((item) => item.id === id || item.slug === slug)) {
  const item = {
    id,
    title: 'A steady recovery support check-in for today',
    slug,
    scheduledAt: today,
    status: 'approved',
    publishMode: 'auto_if_validated',
    contentType: 'daily_resource',
    theme: 'Daily recovery support',
    audience: 'people seeking recovery housing and recovery-support resources',
    queryFamilyId: 'recovery-housing',
    citationStrategyPillar: 'answer_extraction',
    priorityScore: 58,
    summary: 'A plain-language daily recovery support resource for people considering structured recovery housing, referral support, and safer next steps.',
    directAnswer: 'A steady recovery support check-in starts by naming what safety and structure require today, separating emergency needs from non-emergency support, and choosing one practical next step without shame or exaggeration.',
    routeTarget: `/blog/${slug}/`,
    answerSurface: {
      question: 'What is a steady recovery support check-in for today?',
      answer: 'A steady recovery support check-in helps someone identify the next safe, realistic step in recovery while respecting crisis boundaries, medical boundaries, and the current recovery-housing focus of Dianne’s Place.'
    },
    requiredDisclaimers: ['medical', 'outcomes', 'service_status'],
    dek: 'A daily recovery-support resource written for people who need clarity, structure, and a humane next step.',
    humanizedIntro: 'Some recovery days do not need a grand plan. They need one honest check-in: Am I safe? Is my environment helping or hurting? Do I need emergency support, clinical support, housing support, or simply a calmer next step? This resource is meant to make that question easier to answer without shame, panic, or promises a website cannot responsibly make.',
    sections: [
      { heading: 'Start with safety before strategy', body: 'The first useful question is not whether someone has done everything perfectly. The first question is whether they are safe enough for a non-emergency next step. Immediate danger belongs with 911. Mental health or substance use crisis support belongs with 988. Recovery housing and referral conversations are important, but they are not emergency response.' },
      { heading: 'Name what structure would change today', body: 'Structure can mean a substance-free place to sleep, a predictable routine, fewer unsafe contacts, a referral conversation, transportation planning, or a clearer handoff after treatment. Naming the structure needed today helps turn a vague feeling of overwhelm into a practical request for support.' },
      { heading: 'Keep the next step small enough to complete', body: 'A good recovery-support step should be specific enough to do today. That might mean writing down recent treatment history, calling a referral partner, asking a trusted person to sit nearby during a call, reviewing housing expectations, or saving crisis numbers somewhere easy to find.' },
      { heading: 'Use dignity-first language', body: 'Recovery support should not reduce a person to relapse, treatment history, court involvement, family conflict, or fear. People can need structure and still deserve respect. People can be uncertain and still deserve a careful, non-shaming path toward support.' },
      { heading: 'Know what this resource is and is not', body: 'This post is general education and recovery-support navigation. It is not medical advice, diagnosis, treatment, detox, therapy, emergency care, or a promise that any specific service is available. Licensed professionals should handle clinical and medical needs.' }
    ],
    keyTakeaways: [
      'Safety comes before content, housing, or paperwork.',
      'One clear next step is better than a perfect plan that never starts.',
      'Recovery housing and referral support are not substitutes for emergency or clinical care.',
      'Dignity-first support helps people ask for help without additional shame.'
    ],
    practicalNextSteps: [
      'Call 911 for immediate danger or call/text 988 for crisis support.',
      'Write down the kind of support needed in the next 24 hours.',
      'Gather basic referral information before contacting a recovery housing provider.',
      'Choose one safe person or professional who can help with the next conversation.'
    ],
    reflectionPrompt: 'What is the smallest honest step that would make the next 24 hours safer or more structured?',
    faq: [
      { question: 'Is this a treatment recommendation?', answer: 'No. This is general recovery-support education and is not a substitute for professional medical advice, diagnosis, treatment, detox, therapy, or emergency care.' },
      { question: 'What if someone is in immediate danger?', answer: 'Call 911. If someone is experiencing a mental health or substance use crisis, call or text 988 for free, confidential support.' },
      { question: 'Can recovery housing help with daily structure?', answer: 'Recovery housing may help some people by providing a substance-free environment, expectations, community, and routine, but fit and availability should be discussed directly with the provider.' }
    ],
    contentAtoms: ['atom-crisis-boundary', 'atom-pre-license-boundary', 'atom-dignity-first', 'atom-source-trust'],
    atomBlocks: [
      { id: 'atom-crisis-boundary', label: 'Crisis boundary', text: 'Dianne’s Place is not an emergency service. Use 911 for immediate danger and 988 for mental health or substance use crisis support.' },
      { id: 'atom-pre-license-boundary', label: 'Current service status', text: 'This resource is written for recovery housing and referral-support education while expanded licensed services are still in development.' },
      { id: 'atom-dignity-first', label: 'Dignity-first language', text: 'Recovery support should reduce shame, not add to it, and should help people identify the next honest step.' },
      { id: 'atom-source-trust', label: 'Source-aware support', text: 'Educational recovery content should separate general support from medical claims and point people to qualified help when needed.' }
    ],
    internalLinks: [
      { label: 'Recovery Housing', href: '/recovery-housing/' },
      { label: 'Referrals', href: '/referrals/' },
      { label: 'Resources', href: '/resources/' },
      { label: 'Contact', href: '/contact/' }
    ],
    wordTarget: 650,
    contentPromise: 'a short, useful resource that gives one clear next step without overwhelming the reader',
    disclaimerBlock: 'This resource is for general education and recovery-support navigation only. It is not a substitute for professional medical advice, diagnosis, treatment, emergency care, detox, therapy, or licensed clinical services. Recovery outcomes vary.',
    sourceIds: ['source-988-lifeline', 'source-samhsa'],
    claimIds: [],
    licensureModeAllowed: ['pre_license', 'licensed_provider'],
    validationPolicy: policy,
    validation: { eligible: true, blockers: [], warnings: ['Self-produced post should be reviewed for voice and depth when convenient; this warning is nonblocking.'] }
  };
  calendar.items.push(item);
  calendar.generatedAt = new Date().toISOString();
  calendar.extensionStart = calendar.extensionStart || today;
  fs.writeFileSync(calendarPath, `${JSON.stringify(calendar, null, 2)}\n`);
}

writePreview({ generatedAt: new Date().toISOString(), date: today, defaultStatus: 'approved', routeTarget: `/blog/${slug}/`, validationPolicy: policy }, 'READY_FOR_SELF_PRODUCTION');
console.log(`[content:self-produce] ensured approved future post for ${today}`);
