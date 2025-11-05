console.log("✅ app.js geladen", new Date().toISOString());

/* ---------------- THEME (wie gehabt) ---------------- */
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

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#colorSwitch");
    if (!btn) return;
    apply(!isDark());
  });

  const ready = () => setIcon();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();

/* ---------------- TYPEWRITER (re-added, HMR + Swup sicher) ---------------- */
(() => {
  // vorherigen Lauf stoppen (bei HMR/Swup)
  if (typeof window.__typewriterCleanup === "function") {
    try { window.__typewriterCleanup(); } catch {}
  }

  let timeoutId;

  function startTypewriter() {
    const el = document.getElementById("dynamic-header-text");
    if (!el) return;

    const words = ["Design", "Kaffee", "Pizza"]; // hier deine Wunschwörter
    let i = 0, current = "", isDeleting = false;

    const tick = () => {
      const word = words[i];
      current = isDeleting ? word.slice(0, current.length - 1)
                           : word.slice(0, current.length + 1);
      el.textContent = current;

      let delay = 100;
      if (!isDeleting && current === word) { isDeleting = true;  delay = 3000; }
      else if (isDeleting && current === "") { isDeleting = false; i = (i + 1) % words.length; delay = 500; }

      timeoutId = setTimeout(tick, delay);
    };

    tick();
  }

  // global für Swup-Callbacks
  window.__startTypewriter = () => {
    if (typeof window.__typewriterCleanup === "function") {
      try { window.__typewriterCleanup(); } catch {}
    }
    startTypewriter();
  };
  window.__typewriterCleanup = () => { if (timeoutId) clearTimeout(timeoutId); };

  // Initial starten
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.__startTypewriter, { once: true });
  } else {
    window.__startTypewriter();
  }
})();
