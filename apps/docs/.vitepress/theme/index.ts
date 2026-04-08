import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import "@fdic-ds/components";
import "./tokens.css";
import "./prose.css";
import "./docs-utilities.css";
import "./custom.css";

import type { Theme } from "vitepress";
import { watchEffect } from "vue";
import StoryEmbed from "./components/StoryEmbed.vue";
import FigmaEmbed from "./components/FigmaEmbed.vue";

const theme: Theme = {
  ...DefaultTheme,
  setup() {
    if (typeof document === "undefined") {
      return;
    }

    const { isDark } = useData();

    watchEffect(() => {
      document.documentElement.classList.toggle("light", !isDark.value);
    });
  },
  enhanceApp({ app }) {
    app.component("StoryEmbed", StoryEmbed);
    app.component("FigmaEmbed", FigmaEmbed);
  }
};

export default theme;
