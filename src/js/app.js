import Swup from "swup";
import SwupScrollPlugin from "@swup/scroll-plugin";
import SwupHeadPlugin from "@swup/head-plugin";
import SwupA11yPlugin from "@swup/a11y-plugin";

class PageHandler {
  constructor() {
    this.applyInitialTheme();
    this.setThemeIcon();
    this.bindThemeToggle();
    this.typeWriterManager();
  }

  applyInitialTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldBeDark = saved === "dark" || (saved == null && prefersDark);
    document.documentElement.classList.toggle("dark", !!shouldBeDark);
  }

  setThemeIcon() {
    const colorSwitch = document.querySelector("#colorSwitch");
    if (!colorSwitch) return;

    const isDark = document.documentElement.classList.contains("dark");
    colorSwitch.innerHTML = isDark
      ? `<img src="/icons/sun.svg?a=${Math.random()}" alt="sun" class="w-6 h-6" />`
      : `<img src="/icons/moon.svg?a=${Math.random()}" alt="moon" class="w-6 h-6" />`;
  }

  bindThemeToggle() {
    const colorSwitch = document.querySelector("#colorSwitch");
    if (!colorSwitch) return;

    colorSwitch.addEventListener("click", () => {
      const isNowDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isNowDark ? "dark" : "");
      this.setThemeIcon();
    });
  }

  typeWriterManager() {
    const el = document.querySelector("#dynamic-header-text");
    if (!el) return;

    const words = ["Design", "Kaffee", "Pizza"];
    let i = 0;
    let current = "";
    let isDeleting = false;

    const tick = () => {
      const word = words[i];

      current = isDeleting
        ? word.substring(0, current.length - 1)
        : word.substring(0, current.length + 1);

      el.innerHTML = current;

      if (!isDeleting && current === word) {
        isDeleting = true;
        setTimeout(tick, 3000);
      } else if (isDeleting && current === "") {
        isDeleting = false;
        i = (i + 1) % words.length;
        setTimeout(tick, 500);
      } else {
        setTimeout(tick, 100);
      }
    };

    tick();
  }
}

const init = () => new PageHandler();

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

const swup = new Swup({
  animationSelector: '[class*="swuptransition-"]',
  plugins: [new SwupA11yPlugin(), new SwupHeadPlugin(), new SwupScrollPlugin()],
});

swup.on("contentReplaced", init);
