/*
 * Microsoft Clarity, consent-gated. Served first-party so the page's own HTML shows where Clarity
 * can load. Repo law (REPO_IDENTITY.md): no third-party tracking before explicit consent, so this
 * file contacts clarity.ms only after the visitor saves Functional / Analytics = on in the cookie
 * banner (components/CookieConsent.tsx), and never on /admin. Project ids come from the
 * data-clarity-projects attribute, written at build from data/clarity_projects.json.
 */
(function () {
  if (window.__dprsClarity) return;
  window.__dprsClarity = true;
  var tag = document.querySelector('script[data-clarity-projects]');
  var projects = {};
  try { projects = JSON.parse((tag && tag.getAttribute('data-clarity-projects')) || '{}'); } catch (e) { return; }
  var host = window.location.hostname.toLowerCase().replace(/^www\./, '');
  var id = projects[host];
  if (!id || window.location.pathname.indexOf('/admin') === 0) return;
  var loaded = false;
  function load(prefs) {
    if (loaded || !prefs || !prefs.functional) return;
    loaded = true;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.clarity.ms/tag/' + id;
    s.setAttribute('data-clarity-loader', host);
    document.head.appendChild(s);
  }
  try {
    var saved = window.localStorage.getItem('dprs-cookie-preferences');
    if (saved) load(JSON.parse(saved));
  } catch (e) { /* no stored preference: wait for the banner */ }
  window.addEventListener('dprs-cookie-preferences', function (event) { load(event.detail); });
})();
