console.log("✅ app.js geladen", new Date().toISOString());

/** ---------- THEME CONTROLLER (einmalig, HMR-sicher) ---------- */
(() => {
  if (window.__themeBound) return;
  window.__themeBound = true;

  const doc = document.documentElement;

  const save = (v) => { try { localStorage.setItem("theme", v); } catch {} };
  const isDark = () => doc.classList.contains("dark");

  const iconSun  = () => `<img src="/icons/sun.svg"  alt="Helles Theme" class="w-6 h-6">`;
  const iconMoon = () => `<img src="/icons/moon.svg" alt="Dunkles Theme" class="w-6 h-6">`;

  const setIcon = () => {
    const el = document.getElementById("colorSwitch");
    if (!el) return;
    el.setAttribute("aria-pressed", String(isDark()));
    el.innerHTML = isDark() ? iconSun() : iconMoon();
  };
  window.__setThemeIcon = setIcon;

  const apply = (wantDark) => {
    doc.classList.toggle("dark", wantDark);
    save(wantDark ? "dark" : "light");
    setIcon();
  };

  // Globales Delegations-Click (überlebt Swup + HMR)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#colorSwitch");
    if (!btn) return;
    apply(!isDark());
  });

  // Icon initial setzen
  const ready = () => setIcon();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }

  // Systemwechsel nur berücksichtigen, wenn kein Saved-Theme existiert
  try {
    const hasSaved = !!localStorage.getItem("theme");
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    if (!hasSaved && m?.addEventListener) {
      m.addEventListener("change", (ev) => apply(ev.matches));
    }
  } catch {}
})();

/** ---------- SWUP SINGLETON (nur dynamisch laden) ---------- */
(async () => {
  try {
    const [{ default: Swup }, { default: SwupA11yPlugin }, { default: SwupHeadPlugin }, { default: SwupScrollPlugin }] =
      await Promise.all([
        import('swup'),
        import('@swup/a11y-plugin'),
        import('@swup/head-plugin'),
        import('@swup/scroll-plugin'),
      ]);

    if (!window.__swup) {
      window.__swup = new Swup({
        animationSelector: '[class*="swuptransition-"]',
        plugins: [new SwupA11yPlugin(), new SwupHeadPlugin(), new SwupScrollPlugin()],
      });
    }
    if (!window.__swupThemeListenerBound) {
      window.__swupThemeListenerBound = true;
      window.__swup.on('contentReplaced', () => {
        if (typeof window.__setThemeIcon === 'function') window.__setThemeIcon();
      });
    }
  } catch (err) {
    console.warn('Swup konnte nicht geladen werden – Theme-Toggle läuft trotzdem.', err);
  }
})();
