import { globalLegal } from '@/lib/content';

export function CrisisBanner() {
  return (
    <a className="crisis-banner" href="https://988lifeline.org/" aria-label="Crisis support information">
      {globalLegal.crisisBanner}
    </a>
  );
}
