'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import clarityProjects from '@/data/clarity_projects.json';

const projects = JSON.stringify((clarityProjects as { projects: Record<string, string> }).projects);
const SRC = '/clarity-consent.js';

// Pages where a visitor fills a form. Search Readiness e9 (owner, 25 Oct 2026): Clarity only where
// visitors fill a form or buy, so every other page renders nothing here. /admin is never listed.
export const CLARITY_PATHS = ['/contact'];

// Microsoft Clarity, keyed by hostname from data/clarity_projects.json. The tag is a first-party
// script, public/clarity-consent.js, rendered into the form page's HTML so the loader is visible to
// a crawler; that file reaches clarity.ms only after Functional / Analytics consent
// (REPO_IDENTITY.md: no third-party tracking before explicit consent).
// React does not run a <script> it inserts during client-side navigation, so the effect adds one
// when the file has not run yet; the file guards itself against running twice.
export function ClarityLoader() {
  const path = (usePathname() || '/').replace(/\/+$/, '') || '/';
  const active = CLARITY_PATHS.includes(path);

  useEffect(() => {
    const w = window as unknown as { __dprsClarity?: boolean };
    if (!active || w.__dprsClarity) return;
    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    script.setAttribute('data-clarity-projects', projects);
    document.body.appendChild(script);
  }, [active]);

  return active ? <script src={SRC} async data-clarity-projects={projects} /> : null;
}
