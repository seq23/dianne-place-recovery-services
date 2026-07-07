'use client';

import { useEffect, useState } from 'react';

type Preferences = {
  functional: boolean;
  marketing: boolean;
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    functional: false,
    marketing: false
  });

  useEffect(() => {
    const saved = window.localStorage.getItem('dprs-cookie-preferences');
    if (!saved) {
      setVisible(true);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as Preferences;
      setPreferences(parsed);
      window.dispatchEvent(new CustomEvent('dprs-cookie-preferences', { detail: parsed }));
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  function save() {
    window.localStorage.setItem('dprs-cookie-preferences', JSON.stringify(preferences));
    window.dispatchEvent(new CustomEvent('dprs-cookie-preferences', { detail: preferences }));
    setVisible(false);
  }

  return (
    <aside className="cookie-banner" aria-label="Cookie preference banner">
      <div>
        <h2>Cookie Preferences</h2>
        <p>
          Necessary cookies stay on for site security and basic function. Analytics and marketing
          scripts remain blocked unless you choose them and save preferences.
        </p>
      </div>
      <fieldset>
        <legend>Choose cookie categories</legend>
        <label>
          <input type="checkbox" checked disabled aria-label="Necessary cookies always on" /> Necessary
          Cookies
        </label>
        <label>
          <input
            type="checkbox"
            checked={preferences.functional}
            onChange={(event) =>
              setPreferences((current) => ({ ...current, functional: event.target.checked }))
            }
          />{' '}
          Functional / Analytics
        </label>
        <label>
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={(event) =>
              setPreferences((current) => ({ ...current, marketing: event.target.checked }))
            }
          />{' '}
          Marketing / Tracking
        </label>
      </fieldset>
      <a href="/cookie-policy/">Cookie Policy</a>
      <button type="button" onClick={save}>
        Save Preferences
      </button>
    </aside>
  );
}
