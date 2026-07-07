import { legal } from '@/lib/content';

export function DisclaimerBox() {
  return (
    <aside className="disclaimer-box" aria-label="Important service disclaimer">
      <strong>Important:</strong> {legal.serviceDisclaimer} {legal.outcomesDisclaimer}
    </aside>
  );
}
