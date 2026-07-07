import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const releaseDate = process.env.PUBLICATION_DATE || process.env.PUBLISH_DATE || new Date().toISOString().slice(0, 10);
const calendar = JSON.parse(fs.readFileSync(path.join(root, 'data/content/content_calendar.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/aeo/answer_surface_registry.json'), 'utf8'));

const scheduledAnswers = calendar.items
  .filter((item) => item.status === 'approved' && item.scheduledAt <= releaseDate)
  .slice(-60)
  .map((item) => ({
    id: `scheduled-${item.id}`,
    question: item.answerSurface.question,
    answer: item.answerSurface.answer,
    route: item.routeTarget,
    scheduledAt: item.scheduledAt,
    sourceIds: item.sourceIds || []
  }));

const answers = {
  generatedAt: new Date().toISOString(),
  releaseDate,
  mode: 'pre_license',
  disclaimer: 'Answer blocks are educational and recovery-support oriented. They are not medical advice, treatment, diagnosis, or emergency support.',
  answers: [
    ...registry.answerBlocks.map((block) => ({
      id: block.id,
      question: block.question,
      answer: block.answer,
      route: block.targetRoutes[0],
      sourceIds: block.sourceIds || []
    })),
    ...scheduledAnswers
  ]
};

fs.writeFileSync(path.join(root, 'public/answers.json'), `${JSON.stringify(answers, null, 2)}\n`);
console.log(`[answers] wrote ${answers.answers.length} public answer blocks for ${releaseDate}`);
