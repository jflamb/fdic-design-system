(() => {
  const stored = localStorage.getItem("vitepress-theme-appearance") || "auto";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = (!stored || stored === "auto") ? prefersDark : stored === "dark";

  if (!isDark) {
    document.documentElement.classList.add("light");
  }
})();
