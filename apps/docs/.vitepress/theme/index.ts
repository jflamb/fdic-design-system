import DefaultTheme from "vitepress/theme";
import "@fdic-ds/components";
import "./tokens.css";
import "./prose.css";
import "./docs-utilities.css";
import "./custom.css";

import type { Theme } from "vitepress";
import StoryEmbed from "./components/StoryEmbed.vue";
import FigmaEmbed from "./components/FigmaEmbed.vue";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("StoryEmbed", StoryEmbed);
    app.component("FigmaEmbed", FigmaEmbed);
  }
};

export default theme;
