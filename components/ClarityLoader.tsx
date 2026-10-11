'use client';

import { useEffect } from 'react';
import clarityProjects from '@/data/clarity_projects.json';

type Prefs = { functional?: boolean };
const projects = (clarityProjects as { projects: Record<string, string> }).projects;

// Microsoft Clarity, keyed by hostname from data/clarity_projects.json. Repo law
// (REPO_IDENTITY.md, README.md) says no third-party tracking before explicit
// consent, so the tag loads only after the visitor saves Functional / Analytics
// = on in components/CookieConsent.tsx, and never on /admin.
export function ClarityLoader() {
  useEffect(() => {
    const host = window.location.hostname.toLowerCase().replace(/^www\./, '');
    const id = projects[host];
    if (!id || window.location.pathname.startsWith('/admin')) return;

    let loaded = false;
    const load = (prefs: Prefs | null) => {
      if (loaded || !prefs?.functional) return;
      loaded = true;
      const w = window as unknown as { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } };
      w.clarity =
        w.clarity ||
        Object.assign((...args: unknown[]) => {
          (w.clarity!.q = w.clarity!.q || []).push(args);
        }, {});
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${id}`;
      script.setAttribute('data-clarity-loader', host);
      document.head.appendChild(script);
    };

    try {
      const saved = window.localStorage.getItem('dprs-cookie-preferences');
      if (saved) load(JSON.parse(saved) as Prefs);
    } catch {
      /* no stored preference: wait for the banner */
    }
    const onPrefs = (event: Event) => load((event as CustomEvent<Prefs>).detail);
    window.addEventListener('dprs-cookie-preferences', onPrefs);
    return () => window.removeEventListener('dprs-cookie-preferences', onPrefs);
  }, []);

  return null;
}
