import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref<boolean>(true);

  /** Apply current theme to <html> and persist to localStorage */
  function applyTheme(dark: boolean): void {
    const html = document.documentElement;
    html.classList.toggle("dark", dark);
    html.classList.toggle("light", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  /** Toggle theme, using View Transition API if available */
  async function toggle(): Promise<void> {
    const nextDark = !isDark.value;
    if (!document.startViewTransition) {
      isDark.value = nextDark;
      applyTheme(nextDark);
      return;
    }
    const transition = document.startViewTransition(() => {
      isDark.value = nextDark;
      applyTheme(nextDark);
    });
    await transition.ready;
    // animate circle from toggle button position
    const rect = document
      .querySelector(".theme-switch")
      ?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const maxRadius = Math.hypot(
        Math.max(rect.left, window.innerWidth - rect.left),
        Math.max(rect.top, window.innerHeight - rect.top),
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }
  }

  // Init on first store creation
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  isDark.value = saved ? saved === "dark" : prefersDark;
  applyTheme(isDark.value);

  return { isDark, toggle };
});
