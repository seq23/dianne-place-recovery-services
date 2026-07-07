import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const calendar = JSON.parse(fs.readFileSync(path.join(root, 'data/content/content_calendar.json'), 'utf8'));
const outPath = path.join(root, 'data/admin/content_manifest.json');

function typeLabel(contentType) {
  const labels = {
    daily_resource: 'Daily Resource',
    weekly_article: 'Weekly Article',
    monthly_pillar: 'Monthly Pillar',
    quarterly_whitepaper: 'Quarterly White Paper'
  };
  return labels[contentType] || String(contentType || '').replace(/_/g, ' ');
}

function adminStatus(item) {
  if (item.status === 'ready_for_approval') return 'ready_for_approval';
  if (item.status === 'published') return 'published';
  if (item.status === 'revoked') return 'revoked';
  return 'approved';
}

const items = calendar.items.map((item) => {
  const publicPath = item.routeTarget || `/blog/${item.slug}/`;
  const riskLevel = item.contentType === 'quarterly_whitepaper'
    ? 'high'
    : item.contentType === 'monthly_pillar'
      ? 'medium'
      : 'standard';

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    publicPath,
    previewPath: publicPath,
    type: item.contentType,
    contentType: item.contentType,
    contentTypeLabel: typeLabel(item.contentType),
    track: item.citationStrategyPillar,
    status: adminStatus(item),
    publishMode: item.publishMode,
    scheduledAt: item.scheduledAt,
    publishedAt: item.status === 'published' ? item.scheduledAt : null,
    riskLevel,
    audience: item.audience,
    queryFamilyId: item.queryFamilyId,
    atomIds: item.contentAtoms || [],
    sourceIds: item.sourceIds || [],
    requiresFooter: true,
    requiresDisclaimer: true,
    validationPassed: item.validation?.eligible === true,
    validationWarnings: item.validation?.warnings || [],
    operatorInstruction:
      item.status === 'approved'
        ? 'Approved and scheduled. Change status to revoked only if this item should be pulled from release.'
        : item.status === 'ready_for_approval'
          ? 'Review the live preview, then change status to approved when ready.'
          : item.status === 'published'
            ? 'Published item. Change status to revoked if it should come down.'
            : 'Review item status before release.',
    editTarget: 'data/content/content_calendar.json',
    approvalAction:
      item.status === 'approved'
        ? 'Keep approved or change to revoked.'
        : 'Change status to approved, ready_for_approval, or revoked in the content calendar.'
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'data/content/content_calendar.json',
  repo: {
    manifestPath: 'data/content/content_calendar.json',
    manifestEditUrl: 'https://github.com/seq23/dianne-place-recovery-services/edit/main/data/content/content_calendar.json'
  },
  statusModel: {
    ready_for_approval: 'passed validation and waiting on owner review',
    approved: 'approved and eligible for scheduled publication',
    published: 'live public content',
    revoked: 'removed from public release'
  },
  items
};

fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[admin:content-manifest] wrote ${items.length} items`);
